import { boolean, object, optional, string, type InferOutput } from 'valibot'

/**
 * Noodle entry — a seasonal/event logo we ran on the homepage.
 *
 * Noodles are authored as plain TypeScript entries in app/noodles.ts.
 * Keep the shape minimal so each noodle is easy to add — only `key`,
 * `title`, and `slug` are required.
 */
export const NoodleSchema = object({
  key: string(),
  title: string(),
  slug: string(),
  /** ISO date (YYYY-MM-DD). Absence = permanent noodle (query-param triggered). */
  date: optional(string()),
  /** ISO date (YYYY-MM-DD). Last day the noodle is active (inclusive). */
  dateTo: optional(string()),
  /** IANA timezone name, or "auto" for the visitor's local time. */
  timezone: optional(string()),
  /** Whether the npmx tagline is hidden while this noodle is active. */
  tagline: optional(boolean()),
  /** Optional link to the PR / context where the noodle shipped. */
  prUrl: optional(string()),
  /** Derived: true when no `date` is set (visible via query param only). */
  permanent: boolean(),
})

export type Noodle = InferOutput<typeof NoodleSchema>

/**
 * @deprecated — kept as an alias during the transition away from .md-authored
 * noodles. Use `Noodle` going forward.
 */
export type NoodlePostFrontmatter = Noodle
