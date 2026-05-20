import { join } from 'node:path'
import Markdown from 'unplugin-vue-markdown/vite'
import { addTemplate, addVitePlugin, defineNuxtModule, useNuxt, createResolver } from 'nuxt/kit'
import shiki from '@shikijs/markdown-exit'
import MarkdownItAnchor from 'markdown-it-anchor'
import { read } from 'gray-matter'
import { array, safeParse } from 'valibot'
import { glob } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import crypto from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { RawNoodlePostSchema, type NoodlePostFrontmatter } from '../shared/schemas/noodle'
import { AuthorSchema, type Author, type ResolvedAuthor } from '../shared/schemas/blog'
import { isProduction } from '../config/env'
import { BLUESKY_API } from '../shared/utils/constants'

/**
 * Fetches Bluesky avatars for a set of authors at build time.
 * Mirrors the blog module's helper — kept local so the two modules don't share
 * mutable state.
 */
async function fetchBlueskyAvatars(
  imagesDir: string,
  handles: string[],
): Promise<Map<string, string>> {
  const avatarMap = new Map<string, string>()
  if (handles.length === 0) return avatarMap

  try {
    const params = new URLSearchParams()
    for (const handle of handles) params.append('actors', handle)

    const response = await fetch(
      `${BLUESKY_API}/xrpc/app.bsky.actor.getProfiles?${params.toString()}`,
    )
    if (!response.ok) {
      console.warn(`[noodles] Failed to fetch Bluesky profiles: ${response.status}`)
      return avatarMap
    }

    const data = (await response.json()) as {
      profiles: Array<{ handle: string; avatar?: string }>
    }
    for (const profile of data.profiles) {
      if (!profile.avatar) continue
      const hash = crypto.createHash('sha256').update(profile.avatar).digest('hex')
      const dest = join(imagesDir, `${hash}.png`)
      if (!existsSync(dest)) {
        const res = await fetch(`${profile.avatar}@png`)
        if (!res.ok || !res.body) continue
        await writeFile(dest, res.body)
      }
      avatarMap.set(profile.handle, `/noodle-avatar/${hash}.png`)
    }
  } catch (error) {
    console.warn(`[noodles] Failed to fetch Bluesky avatars:`, error)
  }

  return avatarMap
}

function resolveAuthors(authors: Author[], avatarMap: Map<string, string>): ResolvedAuthor[] {
  return authors.map(author => ({
    ...author,
    avatar: author.blueskyHandle ? (avatarMap.get(author.blueskyHandle) ?? null) : null,
    profileUrl: author.blueskyHandle ? `https://bsky.app/profile/${author.blueskyHandle}` : null,
  }))
}

async function loadNoodlePosts(
  noodlesDir: string,
  options: { imagesDir: string; resolveAvatars: boolean },
): Promise<NoodlePostFrontmatter[]> {
  const { imagesDir, resolveAvatars } = options
  const files = await Array.fromAsync(glob(join(noodlesDir, '*.md').replace(/\\/g, '/')))

  const rawEntries: Array<Record<string, unknown>> = []
  const allHandles = new Set<string>()

  for (const file of files) {
    const { data: frontmatter } = read(file)
    if (frontmatter.type !== 'noodle') continue

    if (typeof frontmatter.slug === 'string' && !frontmatter.path) {
      frontmatter.path = `/noodles/${frontmatter.slug}`
    }

    const authorsResult = safeParse(array(AuthorSchema), frontmatter.authors ?? [])
    if (authorsResult.success) {
      for (const author of authorsResult.output) {
        if (author.blueskyHandle) allHandles.add(author.blueskyHandle)
      }
    }
    rawEntries.push(frontmatter)
  }

  const avatarMap = resolveAvatars
    ? await fetchBlueskyAvatars(imagesDir, [...allHandles])
    : new Map<string, string>()

  const entries: NoodlePostFrontmatter[] = []
  for (const frontmatter of rawEntries) {
    const result = safeParse(RawNoodlePostSchema, frontmatter)
    if (!result.success) {
      console.warn(
        `[noodles] Skipping ${frontmatter.slug ?? 'unknown'}: invalid frontmatter`,
        result.issues,
      )
      continue
    }
    const raw = result.output
    entries.push({
      type: 'noodle',
      key: raw.key,
      title: raw.title,
      slug: raw.slug,
      path: raw.path ?? `/noodles/${raw.slug}`,
      excerpt: raw.excerpt,
      authors: resolveAuthors(raw.authors ?? [], avatarMap),
      gallery: raw.gallery ?? [],
      date: raw.date,
      dateTo: raw.dateTo,
      timezone: raw.timezone,
      tagline: raw.tagline,
      draft: raw.draft,
      permanent: !raw.date,
    })
  }

  // Latest first; permanent noodles sort after dated ones.
  entries.sort((a, b) => {
    if (a.permanent && !b.permanent) return 1
    if (!a.permanent && b.permanent) return -1
    if (a.permanent && b.permanent) return a.title.localeCompare(b.title)
    return Date.parse(b.date!) - Date.parse(a.date!)
  })
  return entries
}

export default defineNuxtModule({
  meta: { name: 'noodles' },
  async setup() {
    const nuxt = useNuxt()
    const resolver = createResolver(import.meta.url)
    const noodlesDir = resolver.resolve('../app/pages/noodles')
    const imagesDir = resolver.resolve('../public/noodle-avatar')
    const resolveAvatars = !nuxt.options._prepare

    if (!existsSync(noodlesDir)) return

    if (resolveAvatars && !existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true })
    }

    addVitePlugin(() =>
      Markdown({
        include: [/pages[\\/]noodles[\\/].+\.(md|markdown)($|\?)/],
        wrapperComponent: 'NoodlePostWrapper',
        wrapperClasses: 'text-fg-muted leading-relaxed',
        async markdownSetup(md) {
          md.use(
            await shiki({
              themes: {
                dark: 'github-dark',
                light: 'github-light',
              },
            }),
          )
          md.use(MarkdownItAnchor as any)
        },
      }),
    )

    const allEntries = await loadNoodlePosts(noodlesDir, { imagesDir, resolveAvatars })
    const showDrafts = nuxt.options.dev || !isProduction

    addTemplate({
      filename: 'noodles/entries.ts',
      write: true,
      getContents: () => {
        const entries = allEntries.filter(e => showDrafts || !e.draft)
        return [
          `import type { NoodlePostFrontmatter } from '#shared/schemas/noodle'`,
          ``,
          `export const noodles: NoodlePostFrontmatter[] = ${JSON.stringify(entries, null, 2)}`,
        ].join('\n')
      },
    })

    nuxt.options.alias['#noodles/entries'] = join(nuxt.options.buildDir, 'noodles/entries')

    // Hide draft detail pages from indexers.
    for (const entry of allEntries) {
      if (entry.draft) {
        nuxt.options.routeRules ||= {}
        nuxt.options.routeRules[`/noodles/${entry.slug}`] = {
          headers: { 'X-Robots-Tag': 'noindex, nofollow' },
        }
      }
    }
  },
})
