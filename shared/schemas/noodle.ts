import { object, optional, string, boolean, type InferOutput } from 'valibot'

/**
 * Noodle entry — a seasonal/event logo we ran on the homepage.
 *
 * Noodles are authored as plain TypeScript entries in app/noodles.ts.
 * Keep the shape minimal so each noodle is easy to add — only `key`,
 * `title`, `slug`, and `date` are required. All noodles are historical
 * (date-anchored); a noodle is "active" on the homepage during its date
 * range, or any time it's triggered via the matching `?<key>` query param.
 */
export const NoodleSchema = object({
  key: string(),
  title: string(),
  slug: string(),
  /** ISO date (YYYY-MM-DD). When the noodle started running on the homepage. */
  date: string(),
  /** ISO date (YYYY-MM-DD). Last day the noodle was active (inclusive). */
  dateTo: optional(string()),
  /** IANA timezone name, or "auto" for the visitor's local time. */
  timezone: optional(string()),
  /** Whether the npmx tagline is hidden while this noodle is active. */
  tagline: optional(boolean()),
  /** Optional link to the PR / context where the noodle shipped. */
  prUrl: optional(string()),
})

export type Noodle = InferOutput<typeof NoodleSchema>
