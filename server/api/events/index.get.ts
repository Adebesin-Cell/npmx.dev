import type { EventDetail, EventKind, EventLink, EventMode, EventStatus } from '~/types/events'

const NPMX_PDS_HOST = 'https://npmx.social'
const NPMX_EVENTS_DID = 'did:plc:u5zp7npt5kpueado77kuihyz'
const EVENT_COLLECTION = 'community.lexicon.calendar.event'

interface RawBlobRef {
  ref?: { $link?: string }
  mimeType?: string
}

interface RawEvent {
  name: string
  description?: string
  mode?: string
  status?: string
  startsAt?: string
  endsAt?: string
  createdAt: string
  uris?: Array<{ uri: string; name?: string }>
  locations?: Array<{ uri?: string; name?: string }>
  media?: Array<{ role?: string; content?: RawBlobRef }>
}

interface ListRecordsResponse {
  records: Array<{ uri: string; value: RawEvent }>
  cursor?: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function tokenTail(value: string | undefined, fallback: string): string {
  if (!value) return fallback
  const tail = value.split('#').pop()
  return tail || fallback
}

function blobUrl(did: string, ref?: RawBlobRef): string | undefined {
  const cid = ref?.ref?.$link
  if (!cid) return undefined
  return `${NPMX_PDS_HOST}/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${cid}`
}

function mapEvent(did: string, value: RawEvent): EventDetail {
  const uris = value.uris ?? []
  const links: EventLink[] = uris.map(u => ({ uri: u.uri, name: u.name }))
  const registerUrl = uris.find(u => u.uri.includes('guild.host'))?.uri
  const cover = blobUrl(did, value.media?.find(m => m.role === 'thumbnail')?.content)

  return {
    slug: slugify(value.name),
    name: value.name,
    description: value.description,
    kind: 'meetup' as EventKind,
    mode: tokenTail(value.mode, 'inperson') as EventMode,
    status: tokenTail(value.status, 'scheduled') as EventStatus,
    startsAt: value.startsAt ?? value.createdAt,
    endsAt: value.endsAt,
    cover,
    tags: [],
    attendees: [],
    attendeeCount: 0,
    hosts: [],
    links,
    registerUrl,
    talks: [],
  }
}

export default defineEventHandler(async event => {
  const url = new URL(`${NPMX_PDS_HOST}/xrpc/com.atproto.repo.listRecords`)
  url.searchParams.set('repo', NPMX_EVENTS_DID)
  url.searchParams.set('collection', EVENT_COLLECTION)
  url.searchParams.set('limit', '100')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw createError({ statusCode: 502, message: 'Failed to load events from the npmx PDS' })
  }

  const data = (await response.json()) as ListRecordsResponse
  const events = data.records
    .map(record => mapEvent(NPMX_EVENTS_DID, record.value))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt))

  setHeader(event, 'cache-control', 's-maxage=300, stale-while-revalidate=3600')
  return events
})
