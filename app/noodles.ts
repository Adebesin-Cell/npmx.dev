import type { Noodle } from '#shared/schemas/noodle'

// To add a noodle: drop a Logo.vue under app/components/Noodle/<Name>/,
// register the key in app/components/Noodle/index.ts, then append an entry below.

const ALEX = { name: 'Alex Savelyev', blueskyHandle: 'alexdln.com' }
const ALFON = { name: 'Alfon', blueskyHandle: 'alfon.dev' }

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
    description:
      'We wanted something that felt like the npmx logo had been clipped out of a newspaper — a quiet salute to journalists keeping the record honest. The wordmark sits over a halftone scan of front pages, taped down with a strip of gaffer, like a press kit pinned to a board.\n\nWe went through a few rounds: an early version leaned too cute, another felt too editorial. The shipped take landed on a single restrained composition — high contrast, just enough texture, no extra ornament — so it reads at logo size in the header without competing with the search bar.',
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2666',
    authors: [ALEX, ALFON],
    posterImage: '/extra/npmx-dark-press.png',
    // DUMMY — lets us preview the carousel. Replace with real iteration shots.
    processImages: [
      '/extra/npmx-light-press.png',
      '/extra/npmx-dark-press.png',
      '/extra/npmx-sticker.png',
      '/extra/npmx-cute.svg',
    ],
  },
  {
    key: 'kawaii',
    title: 'Kawaii',
    slug: 'kawaii',
    date: '2026-03-31',
    timezone: 'auto',
    tagline: false,
    occasion: "April Fools' — the original soft, cute pink/peach take on the npmx logo.",
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2346',
    authors: [ALEX, ALFON],
    posterImage: '/extra/npmx-cute.svg',
  },
  {
    key: 'kawaii-pride',
    title: 'Kawaii (Pride)',
    slug: 'kawaii-pride',
    date: '2026-03-31',
    timezone: 'auto',
    tagline: false,
    occasion:
      'Same-day revision of the kawaii noodle — re-coloured to the trans pride flag stripes.',
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2349',
    authors: [ALEX, ALFON],
    posterImage: '/extra/npmx-cute-transgender.svg',
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
    authors: [ALEX],
    posterImage: '/extra/npmx-dark-artemis.svg',
  },
]

export const noodles: Noodle[] = [...entries].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
)

export function findNoodle(slug: string): Noodle | undefined {
  return noodles.find(n => n.slug === slug)
}
