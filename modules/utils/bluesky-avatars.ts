import { join } from 'node:path'
import { Buffer } from 'node:buffer'
import { writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import crypto from 'node:crypto'
import { BLUESKY_API } from '../../shared/utils/constants'

const PROFILE_FETCH_TIMEOUT_MS = 10_000
const AVATAR_FETCH_TIMEOUT_MS = 15_000

interface FetchBlueskyAvatarsOptions {
  /** Public URL prefix the cached avatar is served from, e.g. `/blog/avatar`. */
  publicPathPrefix: string
  /** Label used in build-time warning logs, e.g. `blog`. */
  logLabel: string
}

/**
 * Fetches Bluesky avatars for a set of handles at build time, caching each one
 * to `imagesDir/{hash}.png`. Returns a map of handle → public avatar URL.
 *
 * Shared by the blog and noodles modules; they only differ in where the cached
 * file is served from (`publicPathPrefix`) and the log label.
 */
export async function fetchBlueskyAvatars(
  imagesDir: string,
  handles: string[],
  { publicPathPrefix, logLabel }: FetchBlueskyAvatarsOptions,
): Promise<Map<string, string>> {
  const avatarMap = new Map<string, string>()
  if (handles.length === 0) return avatarMap

  try {
    const params = new URLSearchParams()
    for (const handle of handles) params.append('actors', handle)

    const response = await fetch(
      `${BLUESKY_API}/xrpc/app.bsky.actor.getProfiles?${params.toString()}`,
      { signal: AbortSignal.timeout(PROFILE_FETCH_TIMEOUT_MS) },
    )
    if (!response.ok) {
      console.warn(`[${logLabel}] Failed to fetch Bluesky profiles: ${response.status}`)
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
        const res = await fetch(`${profile.avatar}@png`, {
          signal: AbortSignal.timeout(AVATAR_FETCH_TIMEOUT_MS),
        })
        if (!res.ok || !res.body) {
          console.warn(`[${logLabel}] Failed to fetch Bluesky avatar: ${profile.avatar}@png`)
          continue
        }
        // Avatars are tiny; buffering sidesteps the Web/Node ReadableStream type mismatch.
        await writeFile(dest, Buffer.from(await res.arrayBuffer()))
      }
      avatarMap.set(profile.handle, `${publicPathPrefix}/${hash}.png`)
    }
  } catch (error) {
    console.warn(`[${logLabel}] Failed to fetch Bluesky avatars:`, error)
  }

  return avatarMap
}
