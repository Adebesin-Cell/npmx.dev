import type { Noodle } from '#shared/schemas/noodle'

/**
 * The noodle archive — every seasonal/event logo we've shown on the homepage.
 *
 * To add a new noodle:
 *   1. Drop a logo component in app/components/Noodle/<Name>/Logo.vue
 *   2. Register it in app/components/Noodle/index.ts under the same `key`
 *   3. Add an entry below — `key`, `title`, `slug`, `date`, and an `occasion`
 *      one-liner are enough. Everything else is optional and the detail
 *      page only renders sections for the fields you fill in.
 *
 * All noodles are historical: a noodle runs automatically on the homepage
 * during its date range.
 */
const entries: Noodle[] = [
  {
    key: 'press',
    title: 'Press Freedom Day',
    slug: 'press',
    date: '2026-05-01',
    dateTo: '2026-05-04',
    timezone: 'auto',
    tagline: false,
    occasion: 'World Press Freedom Day, 3 May.',
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2666',
  },
  {
    key: 'kawaii',
    title: 'Kawaii',
    slug: 'kawaii',
    date: '2026-04-01',
    dateTo: '2026-04-07',
    timezone: 'auto',
    tagline: false,
    occasion:
      "April Fools' — a soft, cute variant of the npmx logo (with a trans-flag colourway revision shipped a week later).",
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2346',
  },
  {
    key: 'artemis',
    title: 'Artemis',
    slug: 'artemis',
    date: '2026-04-08',
    dateTo: '2026-04-12',
    timezone: 'America/Los_Angeles',
    tagline: true,
    occasion: "NASA's Artemis Moon program — a quiet salute during the mission window.",
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2421',
  },
]

/** Latest first. */
export const noodles: Noodle[] = [...entries].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
)

export function findNoodle(slug: string): Noodle | undefined {
  return noodles.find(n => n.slug === slug)
}
