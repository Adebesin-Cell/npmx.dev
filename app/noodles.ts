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
    occasion:
      'We build open source to keep our work open. A free press keeps the entire world open.',
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2666',
    authors: [ALEX, ALFON],
    posterImage: '/extra/npmx-dark-press.png',
  },
  {
    key: 'kawaii',
    title: 'Kawaii',
    slug: 'kawaii',
    date: '2026-03-31',
    timezone: 'auto',
    tagline: false,
    occasion: "Our first noodle, and of course, in kawaii style. It's all about fun and joy.",
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2346',
    authors: [ALEX, ALFON],
    posterImage: '/extra/npmx-cute.svg',
  },
  {
    key: 'kawaii-pride',
    title: 'Transgender Visibility Day',
    slug: 'kawaii-pride',
    date: '2026-03-31',
    timezone: 'auto',
    tagline: false,
    occasion: 'Today and always ./🏳️‍⚧️',
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2349',
    authors: [ALEX, ALFON],
    posterImage: '/extra/npmx-cute-transgender.svg',
  },
  {
    key: 'artemis',
    title: 'Artemis II',
    slug: 'artemis',
    date: '2026-04-08',
    dateTo: '2026-04-12',
    timezone: 'America/Los_Angeles',
    tagline: true,
    occasion:
      'The first crewed flight beyond low Earth orbit since Apollo 17 in 1972. We watch and worry about them together with humanity.',
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2421',
    authors: [ALEX],
    posterImage: '/extra/npmx-dark-artemis.svg',
  },
  {
    key: 'nodejs',
    title: 'Node.js Initial Release',
    slug: 'nodejs',
    date: '2026-05-27',
    timezone: 'auto',
    occasion: 'console.log("happy birthday, nodejs")',
    prUrl: 'https://github.com/npmx-dev/npmx.dev/pull/2778',
    authors: [ALEX],
  },
]

export const noodles: Noodle[] = [...entries].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
)

export function findNoodle(slug: string): Noodle | undefined {
  return noodles.find(n => n.slug === slug)
}
