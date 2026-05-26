import { array, object, optional, string, boolean, type InferOutput } from 'valibot'

const NoodleAuthorSchema = object({
  name: string(),
  blueskyHandle: optional(string()),
})

const NoodleReferenceSchema = object({
  label: optional(string()),
  url: string(),
})

// Required: key, title, slug, date. Everything else is optional and the
// detail page only renders sections for fields that are filled in.
const NoodleSchema = object({
  key: string(),
  title: string(),
  slug: string(),
  date: string(),
  dateTo: optional(string()),
  // IANA timezone name, or "auto" for the visitor's local time.
  timezone: optional(string()),
  // When true, the npmx tagline is hidden while this noodle is active.
  tagline: optional(boolean()),
  occasion: optional(string()),
  description: optional(string()),
  // Public paths to process / draft images, used by the lens carousel.
  processImages: optional(array(string())),
  prUrl: optional(string()),
  authors: optional(array(NoodleAuthorSchema)),
  // External links (Wikipedia, NASA mission page, etc.) shown in the detail right panel.
  references: optional(array(NoodleReferenceSchema)),
  // Public path to the OG-image hero asset.
  posterImage: optional(string()),
  // Optional image rendered behind `posterImage` (e.g. a backdrop the wordmark sits on).
  posterBackdrop: optional(string()),
})

export type Noodle = InferOutput<typeof NoodleSchema>
