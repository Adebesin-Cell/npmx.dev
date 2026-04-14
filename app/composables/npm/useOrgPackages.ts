import type { NpmSearchResponse, NpmSearchResult, PackageMetaResponse } from '#shared/types'
import { emptySearchResponse, metaToSearchResult } from './search-utils'
import { mapWithConcurrency } from '#shared/utils/async'

/** Number of packages to fetch metadata for in the initial load */
const INITIAL_BATCH_SIZE = 50

/** Max names per Algolia getObjects request */
const ALGOLIA_BATCH_SIZE = 1000

export interface OrgPackagesResponse extends NpmSearchResponse {
  /** Total number of packages in the org (may exceed objects.length before loadAll) */
  totalPackages: number
  /** All package names in the org (used by loadMore to know what to fetch next) */
  allPackageNames: string[]
}

function emptyOrgResponse(): OrgPackagesResponse {
  return {
    ...emptySearchResponse(),
    totalPackages: 0,
    allPackageNames: [],
  }
}

/**
 * Fetch packages for an npm organization with progressive loading.
 *
 * 1. Gets the authoritative package list from the npm registry (single request)
 * 2. Fetches metadata for the first batch immediately (fast SSR)
 * 3. Remaining packages are loaded on-demand via `loadAll()`
 */
export function useOrgPackages(orgName: MaybeRefOrGetter<string>) {
  const route = useRoute()
  const { searchProvider } = useSearchProvider()
  const searchProviderValue = computed(() => {
    const p = normalizeSearchParam(route.query.p)
    if (p === 'npm' || searchProvider.value === 'npm') return 'npm'
    return 'algolia'
  })
  const { getPackagesByNameSlice } = useAlgoliaSearch()

  const loadedObjects = shallowRef<NpmSearchResult[]>([])

  // Promise lock — scoped inside the composable to avoid cross-instance sharing
  let loadAllPromise: Promise<void> | null = null

  const asyncData = useLazyAsyncData(
    () => `org-packages:${searchProviderValue.value}:${toValue(orgName)}`,
    async ({ ssrContext }, { signal }) => {
      const org = toValue(orgName)
      if (!org) {
        return emptyOrgResponse()
      }

      // Get the authoritative package list from the npm registry
      let packageNames: string[]
      try {
        const { packages } = await $fetch<{ packages: string[]; count: number }>(
          `/api/registry/org/${encodeURIComponent(org)}/packages`,
          { signal },
        )
        packageNames = packages
      } catch (err) {
        if (err && typeof err === 'object' && 'statusCode' in err && err.statusCode === 404) {
          const error = createError({
            statusCode: 404,
            statusMessage: 'Organization not found',
            message: `The organization "@${org}" does not exist on npm`,
          })
          if (import.meta.server) {
            ssrContext!.payload.error = error
          }
          throw error
        }
        packageNames = []
      }

      if (packageNames.length === 0) {
        loadedObjects.value = []
        return emptyOrgResponse()
      }

      const initialNames = packageNames.slice(0, INITIAL_BATCH_SIZE)

      // Fetch metadata for first batch
      let initialObjects: NpmSearchResult[] = []

      if (searchProviderValue.value === 'algolia') {
        try {
          initialObjects = await getPackagesByNameSlice(initialNames)
        } catch {
          // Fall through to npm fallback
        }
      }

      // Staleness guard
      if (toValue(orgName) !== org) return emptyOrgResponse()

      // npm fallback for initial batch
      if (initialObjects.length === 0) {
        const metaResults = await mapWithConcurrency(
          initialNames,
          async name => {
            try {
              return await $fetch<PackageMetaResponse>(
                `/api/registry/package-meta/${encodePackageName(name)}`,
                { signal },
              )
            } catch {
              return null
            }
          },
          10,
        )

        if (toValue(orgName) !== org) return emptyOrgResponse()

        initialObjects = metaResults
          .filter((meta): meta is PackageMetaResponse => meta !== null)
          .map(metaToSearchResult)
      }

      loadedObjects.value = initialObjects

      return {
        isStale: false,
        objects: initialObjects,
        total: initialObjects.length,
        totalPackages: packageNames.length,
        allPackageNames: packageNames,
        time: new Date().toISOString(),
      } satisfies OrgPackagesResponse
    },
    { default: emptyOrgResponse },
  )

  /** Read allPackageNames from async data (survives SSR→client hydration via Nuxt payload). */
  function allPackageNames(): string[] {
    return asyncData.data.value?.allPackageNames ?? []
  }

  /** Load the next batch of packages (default: 1 Algolia batch of 1000). */
  async function loadMore(count: number = ALGOLIA_BATCH_SIZE): Promise<void> {
    const loadedSet = new Set(loadedObjects.value.map(o => o.package.name))
    if (loadedSet.size >= allPackageNames().length) return

    // Reuse in-flight promise to prevent duplicate fetches
    if (loadAllPromise) {
      await loadAllPromise
      return
    }

    loadAllPromise = _doLoadMore(count)
    try {
      await loadAllPromise
    } finally {
      loadAllPromise = null
    }
  }

  /** Load ALL remaining packages (used when filters need the full dataset). */
  async function loadAll(): Promise<void> {
    const remaining = allPackageNames().length - loadedObjects.value.length
    if (remaining <= 0) return
    await loadMore(remaining)
  }

  async function _doLoadMore(count: number): Promise<void> {
    const names = allPackageNames()
    const current = loadedObjects.value
    const loadedSet = new Set(current.map(o => o.package.name))
    const remainingNames = names.filter(n => !loadedSet.has(n)).slice(0, count)
    if (remainingNames.length === 0) return

    const org = toValue(orgName)
    let newObjects: NpmSearchResult[] = []

    if (searchProviderValue.value === 'algolia') {
      const batches: string[][] = []
      for (let i = 0; i < remainingNames.length; i += ALGOLIA_BATCH_SIZE) {
        batches.push(remainingNames.slice(i, i + ALGOLIA_BATCH_SIZE))
      }

      const results = await Promise.allSettled(batches.map(batch => getPackagesByNameSlice(batch)))

      if (toValue(orgName) !== org) return

      for (const result of results) {
        if (result.status === 'fulfilled') {
          newObjects.push(...result.value)
        }
      }
    } else {
      const metaResults = await mapWithConcurrency(
        remainingNames,
        async name => {
          try {
            return await $fetch<PackageMetaResponse>(
              `/api/registry/package-meta/${encodePackageName(name)}`,
            )
          } catch {
            return null
          }
        },
        10,
      )

      if (toValue(orgName) !== org) return

      newObjects = metaResults
        .filter((meta): meta is PackageMetaResponse => meta !== null)
        .map(metaToSearchResult)
    }

    if (newObjects.length > 0) {
      const deduped = newObjects.filter(o => !loadedSet.has(o.package.name))
      const all = [...current, ...deduped]
      loadedObjects.value = all

      // Update asyncData so the page sees the new objects
      asyncData.data.value = {
        isStale: false,
        objects: all,
        total: all.length,
        totalPackages: names.length,
        allPackageNames: names,
        time: new Date().toISOString(),
      }
    }
  }

  return {
    ...asyncData,
    loadMore,
    loadAll,
  }
}
