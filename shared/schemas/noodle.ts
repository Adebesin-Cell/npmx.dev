import { array, boolean, literal, object, optional, string, type InferOutput } from 'valibot'
import { AuthorSchema, ResolvedAuthorSchema } from './blog'

/** Raw frontmatter as authored in a noodle .md file. */
export const RawNoodlePostSchema = object({
  type: literal('noodle'),
  key: string(),
  title: string(),
  slug: string(),
  excerpt: optional(string()),
  authors: optional(array(AuthorSchema)),
  gallery: optional(array(string())),
  /** ISO date (YYYY-MM-DD). Absence = permanent noodle (query-param triggered). */
  date: optional(string()),
  /** ISO date (YYYY-MM-DD). Last day the noodle is active (inclusive). */
  dateTo: optional(string()),
  /** IANA timezone name, or "auto" for the visitor's local time. */
  timezone: optional(string()),
  /** Whether the npmx tagline is hidden while this noodle is active. */
  tagline: optional(boolean()),
  draft: optional(boolean()),
  path: optional(string()),
})

/** Frontmatter after build-time enrichment (authors resolved, defaults applied). */
export const NoodlePostSchema = object({
  type: literal('noodle'),
  key: string(),
  title: string(),
  slug: string(),
  path: string(),
  excerpt: optional(string()),
  authors: array(ResolvedAuthorSchema),
  gallery: array(string()),
  date: optional(string()),
  dateTo: optional(string()),
  timezone: optional(string()),
  tagline: optional(boolean()),
  draft: optional(boolean()),
  /** Derived: true when no `date` is set (visible via query param only). */
  permanent: boolean(),
})

export type RawNoodlePostFrontmatter = InferOutput<typeof RawNoodlePostSchema>
export type NoodlePostFrontmatter = InferOutput<typeof NoodlePostSchema>
