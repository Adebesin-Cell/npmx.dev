import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { mkdir, readFile } from 'node:fs/promises'
import { addTemplate, defineNuxtModule, useNuxt, createResolver } from 'nuxt/kit'
import { fetchBlueskyAvatars } from './utils/bluesky-avatars'

// Parses the registry as text so we don't have to evaluate TS at build time.
async function readHandlesFromRegistry(registryPath: string): Promise<string[]> {
  if (!existsSync(registryPath)) return []
  const source = await readFile(registryPath, 'utf-8')
  const handles = new Set<string>()
  const re = /blueskyHandle\s*:\s*['"]([^'"]+)['"]/g
  let match: RegExpExecArray | null
  while ((match = re.exec(source)) !== null) {
    const handle = match[1]
    if (handle) handles.add(handle)
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
      ? await fetchBlueskyAvatars(imagesDir, handles, {
          publicPathPrefix: '/noodle-avatar',
          logLabel: 'noodles',
        })
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
