import type { Component } from 'vue'
import { noodles } from '~/noodles'
import NoodleKawaiiLogo from './Kawaii/Logo.vue'
import NoodlePressLogo from './Press/Logo.vue'

export type Noodle = {
  key: string
  timezone?: string
  date?: string
  dateTo?: string
  logo: Component
  tagline?: boolean
}

/**
 * Logo component for each noodle, keyed by the entry's `key` in app/noodles.ts.
 * To add a new noodle:
 *   1. Drop a logo in app/components/Noodle/<Name>/Logo.vue
 *   2. Register it here under the same key
 *   3. Add an entry to app/noodles.ts
 */
const NOODLE_LOGOS: Record<string, Component> = {
  press: NoodlePressLogo,
  kawaii: NoodleKawaiiLogo,
}

export function resolveNoodleLogo(key: string): Component | undefined {
  return NOODLE_LOGOS[key]
}

function entriesToNoodles(filter: (e: (typeof noodles)[number]) => boolean): Noodle[] {
  const list: Noodle[] = []
  for (const entry of noodles) {
    if (!filter(entry)) continue
    const logo = NOODLE_LOGOS[entry.key]
    if (!logo) continue
    list.push({
      key: entry.key,
      logo,
      date: entry.date,
      dateTo: entry.dateTo,
      timezone: entry.timezone,
      tagline: entry.tagline,
    })
  }
  return list
}

export const PERMANENT_NOODLES: Noodle[] = entriesToNoodles(e => e.permanent)
export const ACTIVE_NOODLES: Noodle[] = entriesToNoodles(e => !e.permanent)
