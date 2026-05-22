import type { Noodle } from '#shared/schemas/noodle'

/**
 * The noodle archive — every seasonal/event logo we've shown on the homepage.
 *
 * To add a new noodle:
 *   1. Drop a logo component in app/components/Noodle/<Name>/Logo.vue
 *   2. Register it in app/components/Noodle/index.ts under the same `key`
 *   3. Add an entry below
 *
 * Keep it minimal — `key`, `title`, and `slug` are enough. Add dates if the
 * noodle ran on a schedule, or `prUrl` to point readers at the shipping PR.
 */
const entries: Array<Omit<Noodle, 'permanent'>> = [
  {
    key: 'press',
    title: 'Press',
    slug: 'press',
    date: '2026-05-01',
    dateTo: '2026-05-04',
    timezone: 'auto',
    tagline: false,
  },
  {
    key: 'kawaii',
    title: 'Kawaii',
    slug: 'kawaii',
    date: '2026-04-01',
    dateTo: '2026-04-07',
    timezone: 'auto',
    tagline: false,
  },
]

function withPermanent(entry: (typeof entries)[number]): Noodle {
  return Object.assign(entry, { permanent: !entry.date })
}

/** Latest first; permanent noodles (no `date`) sort to the bottom. */
export const noodles: Noodle[] = entries.map(withPermanent).sort((a, b) => {
  if (a.permanent && !b.permanent) return 1
  if (!a.permanent && b.permanent) return -1
  if (a.permanent && b.permanent) return a.title.localeCompare(b.title)
  return Date.parse(b.date!) - Date.parse(a.date!)
})
