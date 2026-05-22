import type { Component } from 'vue'
import { noodles } from '~/noodles'
import NoodleArtemisLogo from './Artemis/Logo.vue'
import NoodleKawaiiLogo from './Kawaii/Logo.vue'
import NoodleKawaiiPrideLogo from './KawaiiPride/Logo.vue'
import NoodlePressLogo from './Press/Logo.vue'

export type Noodle = {
  key: string
  timezone?: string
  date: string
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
  'press': NoodlePressLogo,
  'kawaii': NoodleKawaiiLogo,
  'kawaii-pride': NoodleKawaiiPrideLogo,
  'artemis': NoodleArtemisLogo,
}

export function resolveNoodleLogo(key: string): Component | undefined {
  return NOODLE_LOGOS[key]
}

export const NOODLES: Noodle[] = noodles.map(entry => {
  const logo = NOODLE_LOGOS[entry.key]
  if (!logo) {
    throw new Error(
      `Missing logo registration for noodle key "${entry.key}". Add it to NOODLE_LOGOS in app/components/Noodle/index.ts.`,
    )
  }
  return {
    key: entry.key,
    logo,
    date: entry.date,
    dateTo: entry.dateTo,
    timezone: entry.timezone,
    tagline: entry.tagline,
  }
})
