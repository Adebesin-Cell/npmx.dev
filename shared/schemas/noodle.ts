import { array, object, optional, string, boolean, type InferOutput } from 'valibot'

const NoodleAuthorSchema = object({
  name: string(),
  blueskyHandle: optional(string()),
})

/**
 * Noodle entry — a seasonal/event logo we ran on the homepage.
 *
 * Noodles are authored as plain TypeScript entries in app/noodles.ts.
 * The required set is intentionally tiny so adding a noodle is easy:
 * key / title / slug / date. Everything else (including `occasion`) is
 * optional — the detail page only renders sections for the fields that
 * are actually filled in.
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
  /** Short one-liner — the day/event the noodle marked. */
  occasion: optional(string()),
  /** Longer write-up. Renders as a paragraph on the detail page when present. */
  description: optional(string()),
  /**
   * Optional process / draft images. Each is a path under public/.
   * Rendered as a stacked figure list when present.
   */
  processImages: optional(array(string())),
  /** Optional link to the PR / context where the noodle shipped. */
  prUrl: optional(string()),
  /** Designers / engineers who shipped the noodle. */
  authors: optional(array(NoodleAuthorSchema)),
})

export type Noodle = InferOutput<typeof NoodleSchema>
