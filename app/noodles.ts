import type { Noodle } from '#shared/schemas/noodle'

/**
 * The noodle archive — every seasonal/event logo we've shown on the homepage.
 *
 * To add a new noodle:
 *   1. Drop a logo component in app/components/Noodle/<Name>/Logo.vue
 *   2. Register it in app/components/Noodle/index.ts under the same `key`
 *   3. Add an entry below — `key`, `title`, `slug`, `date` are enough.
 *
 * All noodles are historical: a noodle runs automatically on the homepage
 * during its date range, and can also be triggered any time via `?<key>`.
 */
const entries: Noodle[] = [
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

/** Latest first. */
export const noodles: Noodle[] = [...entries].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
)
