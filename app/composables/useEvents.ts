import type { EventDetail, EventKind, EventSummary } from '~/types/events'
import { isPastEvent } from '~/utils/events/format'
import { SEED_EVENTS } from '~/utils/events/seed.data'

export function useEvents() {
  const { locale } = useI18n()

  const all = computed<EventDetail[]>(() => SEED_EVENTS)

  const upcoming = computed(() =>
    all.value.filter(e => !isPastEvent(e)).sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
  )

  const past = computed(() =>
    all.value.filter(e => isPastEvent(e)).sort((a, b) => b.startsAt.localeCompare(a.startsAt)),
  )

  const kinds = computed<EventKind[]>(() => {
    const set = new Set<EventKind>()
    for (const e of all.value) set.add(e.kind)
    return [...set]
  })

  function findBySlug(slug: string): EventDetail | undefined {
    return all.value.find(e => e.slug === slug)
  }

  function relatedTo(slug: string, limit = 3): EventSummary[] {
    const current = findBySlug(slug)
    if (!current) return []
    return all.value.filter(e => e.slug !== slug && e.kind === current.kind).slice(0, limit)
  }

  return { all, upcoming, past, kinds, findBySlug, relatedTo, locale }
}
