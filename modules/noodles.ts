import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import crypto from 'node:crypto'
import { addTemplate, defineNuxtModule, useNuxt, createResolver } from 'nuxt/kit'
import { BLUESKY_API } from '../shared/utils/constants'

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

// Parses the registry as text so we don't have to evaluate TS at build time.
async function readHandlesFromRegistry(registryPath: string): Promise<string[]> {
  if (!existsSync(registryPath)) return []
  const source = await readFile(registryPath, 'utf-8')
  const handles = new Set<string>()
  const re = /blueskyHandle\s*:\s*['"]([^'"]+)['"]/g
  let match: RegExpExecArray | null
  while ((match = re.exec(source)) !== null) {
    handles.add(match[1]!)
  }
  return [...handles]
}

export default defineNuxtModule({
  meta: { name: 'noodles' },
  async setup() {
    const nuxt = useNuxt()
    const resolver = createResolver(import.meta.url)
    const registryPath = resolver.resolve('../app/noodles.ts')
    const imagesDir = resolver.resolve('../public/noodle-avatar')
    const resolveAvatars = !nuxt.options._prepare

    if (resolveAvatars && !existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true })
    }

    const handles = await readHandlesFromRegistry(registryPath)
    const avatarMap = resolveAvatars
      ? await fetchBlueskyAvatars(imagesDir, handles)
      : new Map<string, string>()

    addTemplate({
      filename: 'noodles/avatars.ts',
      write: true,
      getContents: () => {
        const record: Record<string, string> = {}
        for (const [handle, url] of avatarMap) record[handle] = url
        return [
          `export const noodleAvatars: Record<string, string> = ${JSON.stringify(record, null, 2)}`,
          '',
          'export function resolveNoodleAvatar(handle: string | undefined): string | null {',
          '  if (!handle) return null',
          '  return noodleAvatars[handle] ?? null',
          '}',
        ].join('\n')
      },
    })

    nuxt.options.alias['#noodles/avatars'] = join(nuxt.options.buildDir, 'noodles/avatars')
  },
})
