import type { EventDetail } from '~/types/events'

const AVATARS = {
  a: '/blog/avatar/868d264bb8f2c10ec09365ae712ab4bf0323caa129e04d77876da88df09d7a02.jpg',
  b: '/blog/avatar/ce38208f9a08dd02a8d22c67b51af0201848990165b705e9df98dd1bed4bcaad.jpg',
  c: '/blog/avatar/57fe535feed8fba7a9112a94a9f5e23589e7fd02555aead6ad8e1dcb289dc46a.jpg',
  d: '/blog/avatar/fab2b15f2d0926e983e63dc63b398eb5a5c57f2f7c744162945055ddc6cf412e.jpg',
  e: '/blog/avatar/bfaa93a26e6ee803038d27575c92535acd1d94783917c5b39fe4583713bbe738.jpg',
}

export const SEED_EVENTS: EventDetail[] = [
  {
    slug: 'npmx-london-meetup',
    name: 'npmx London Meetup',
    description:
      'All the magic of npmx is achieved through its community — strong, active, and warm. And behind the development itself are real people and their encounters.',
    kind: 'meetup',
    mode: 'hybrid',
    status: 'scheduled',
    startsAt: '2026-06-19T18:00:00Z',
    endsAt: '2026-06-19T21:00:00Z',
    cover:
      'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreibnhisre2l6ub6yamni425afvmuwqnelcgftuooeuyr247tbrhlgu',
    location: { name: 'AG Grid HQ', locality: 'London', country: 'GB' },
    tags: ['meetup', 'community', 'atproto'],
    hosts: [{ name: 'AG Grid', uri: 'https://www.ag-grid.com' }],
    attendeeCount: 42,
    attendees: [
      { name: 'Alex', handle: 'alex.npmx.dev', avatar: AVATARS.a },
      { name: 'Lope', handle: 'lope.npmx.dev', avatar: AVATARS.b },
      { name: 'Felix', handle: 'felixs.dev', avatar: AVATARS.c },
      { name: 'Patak', handle: 'patak.dev' },
    ],
    schedule: [
      { time: '18:00', label: 'Socialising & Food' },
      { time: '19:00', label: 'Introductions & House Keeping' },
      { time: '19:15', label: 'Alex: Trust Network' },
      { time: '19:45', label: 'Break' },
      { time: '20:00', label: 'Panel: the future of npmx' },
      { time: '21:00', label: 'End & Pub Time' },
    ],
    links: [
      { uri: 'https://youtube.com', name: 'Watch Live on YouTube' },
      { uri: 'https://stream.place', name: 'stream.place' },
      { uri: 'https://chat.npmx.dev', name: 'npmx community discord' },
    ],
    bskyPostUrl: 'https://bsky.app/profile/ag-grid.bsky.social/post/3moo34mkdy22g',
    gallery: [
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreicrin7umxwhh54cybm4ilklexsvanwjtbq7yt6ujwayy2hvoohobe',
        alt: 'The panel discussion begins, the audience takes their seats, and Matthias is already discussing something interesting with someone',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreibnhisre2l6ub6yamni425afvmuwqnelcgftuooeuyr247tbrhlgu',
        alt: 'The panel discussion stage with the core team: Willow, James, Alex, Mattias (Patak), and Daniel',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreihoe4bm7v4l5uhvcaomssulrgjqlnuvasabnxqsjfwjzl5c52dpzq',
        alt: 'Wonderful people standing during the break and discussing something good',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreifs5bwmoa5kqzddaqnm2yh4clpt6jg77x3nfip3b6k4g5ek65rtpm',
        alt: 'A group of people standing to the side and calmly talking, seen from the seated area',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreig6nay6zf4uqpe66h7fb2dhlcgzdy2ijq6z6iyj56sxo7fs5wqtqe',
        alt: 'People browsing the AG Grid merch table',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreihnqkt2h56ub5rqkfwr3e2hbzrptbisu3msxuoueu4ls65hrammpq',
        alt: 'A break with people chatting, a pizza box in the foreground',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreiarek7vxnac2sywthyuplicjkq244pc6iytxgddti3s4qzagrfsou',
        alt: 'Several small groups discussing technologies and stories across the room',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreihn3o5sen5f7zi5td4la2m453oyxbyipuadl6yfvvkm7wznlznycy',
        alt: 'People still talking as the space returns to its original state, Mattias sharing stories',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreiamio6wifho455hd6ylakbxhz6e6bxl4bipsgjiu7qryw7twdhn3y',
        alt: 'A table with leftover pizza, a discussion continuing in the background',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreifiy4yovbpjsx6ohz5q3luo24cmyu7tojsg53muiudoldl5k7mudy',
        alt: 'The empty room after the event, chairs back in place and the last participant leaving',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreiejusc25bveorsukp7b6eyzu3kujeerkqqk4xqtq24gq2o7kjlwme',
        alt: 'People socializing in groups around a table with pizza',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreieg473dkdpebirricskeepgm3w2elnda5kxnvnkdbrrnfdaybeh5q',
        alt: 'Several attendees together in a single shot',
      },
    ],
    talks: [
      {
        id: 'trust-network',
        title: 'Trust Network',
        abstract: 'How npmx builds a web of trust on top of atproto identities.',
        speakers: [{ name: 'Alex', handle: 'alex.npmx.dev', avatar: AVATARS.a }],
        startsAt: '2026-06-19T19:15:00Z',
        watchUrl: 'https://youtube.com',
        slidesUrl: 'https://speakerdeck.com',
        pdfUrl: 'https://example.com/trust-network.pdf',
      },
      {
        id: 'future-of-npmx',
        title: 'Panel: The Future of npmx',
        abstract: 'The core team on where npmx goes next.',
        speakers: [
          { name: 'Alex', handle: 'alex.npmx.dev', avatar: AVATARS.a },
          { name: 'Lope', handle: 'lope.npmx.dev', avatar: AVATARS.b },
        ],
        startsAt: '2026-06-19T20:00:00Z',
        watchUrl: 'https://youtube.com',
      },
    ],
  },
  {
    slug: 'vienna-meetup-3',
    name: 'npmx Vienna Meetup #3',
    description: 'The third npmx Vienna meetup — talks, hallway track, and drinks after.',
    kind: 'meetup',
    mode: 'inperson',
    status: 'scheduled',
    startsAt: '2026-05-14T17:00:00Z',
    endsAt: '2026-05-14T21:00:00Z',
    cover:
      'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreiakvo6fu563g3j7a6pcioeijq7ni7i462dboss24uerzeisuxrwj4',
    location: { name: 'Vienna', locality: 'Vienna', country: 'AT', lat: '48.2082', lon: '16.3738' },
    tags: ['meetup', 'vienna'],
    hosts: [{ name: 'Felix Schneider', uri: 'https://felixs.dev/events/' }],
    attendeeCount: 28,
    attendees: [
      { name: 'Felix', handle: 'felixs.dev', avatar: AVATARS.c },
      { name: 'Alex', handle: 'alex.npmx.dev', avatar: AVATARS.a },
    ],
    schedule: [
      { time: '17:00', label: 'Doors & Socialising' },
      { time: '17:30', label: 'atproto 101' },
      { time: '18:15', label: 'Lightning talks' },
      { time: '19:00', label: 'Hallway track & drinks' },
      { time: '21:00', label: 'Wrap up' },
    ],
    links: [{ uri: 'https://felixs.dev/events/', name: 'Event page' }],
    gallery: [
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreieg473dkdpebirricskeepgm3w2elnda5kxnvnkdbrrnfdaybeh5q',
        alt: 'Several attendees together in a single shot',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreidavrldq6zigzwcdu46pgr4indo62ne3v5it2czlvota3igduofe4',
        alt: 'Conversations among attendees, one talking about technology with passion',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreif7uwalqlhgqeizxw6ksivwofoy74vexkyfwejwestnyz3n353bmy',
        alt: 'Attendees gathered at the stage listening to presentations',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreibj27mrk6v6b6gaaceged36uamfqi2womo3jar6ttxpejetd7dere',
        alt: 'The audience watching a presentation intently, some taking photos',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreiakvo6fu563g3j7a6pcioeijq7ni7i462dboss24uerzeisuxrwj4',
        alt: 'The opening talk on stage',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreibccpe3ys2zzdqw6t6b4n2hlnfbbvponzy2r6tvdgc2q5u2waq6t4',
        alt: 'Empty chairs on stage at the end of the event',
      },
    ],
    talks: [
      {
        id: 'atproto-101',
        title: 'atproto 101',
        abstract: 'A gentle intro to repos, lexicons and the firehose.',
        speakers: [{ name: 'Felix', handle: 'felixs.dev', avatar: AVATARS.c }],
        watchUrl: 'https://youtube.com',
        slidesUrl: 'https://speakerdeck.com',
      },
    ],
  },
  {
    slug: 'npmx-online-townhall',
    name: 'npmx Online Town Hall',
    description: 'A fully online town hall — roadmap updates and community Q&A.',
    kind: 'conference',
    mode: 'virtual',
    status: 'scheduled',
    startsAt: '2026-08-26T14:00:00Z',
    endsAt: '2026-08-26T16:00:00Z',
    cover:
      'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:akon7og3z6ihjpoclxzjrglf/bafkreigc3zmk3ayfw2w55c4hhaoyhi35occrrneiehksa2eyo4il6vtvui',
    tags: ['conference', 'online'],
    hosts: [{ name: 'npmx', uri: 'https://npmx.dev' }],
    attendeeCount: 113,
    attendees: [
      { name: 'Lope', handle: 'lope.npmx.dev', avatar: AVATARS.b },
      { name: 'Alex', handle: 'alex.npmx.dev', avatar: AVATARS.a },
      { name: 'Dana', handle: 'dana.example', avatar: AVATARS.d },
      { name: 'Sam', handle: 'sam.example', avatar: AVATARS.e },
    ],
    schedule: [
      { time: '14:00', label: 'Welcome & intros' },
      { time: '14:15', label: 'Roadmap update' },
      { time: '15:00', label: 'Community Q&A' },
      { time: '15:45', label: 'Open floor' },
    ],
    links: [{ uri: 'https://npmx.dev', name: 'Register' }],
    registerUrl: 'https://npmx.dev',
    gallery: [
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreicsxn7blppolvtrf6w5kxc5hxuv2454licb3c5jcx6njygenvax2u',
        alt: 'A screen showing "npmx London meetup #2"',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreigk7hqvly7rfn3aldhtdrgx7a4yhf5ydraj6igiymv7zeaanjswsq',
        alt: 'A group of people talking together',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreiczqaiflwnokgljuazi5dpmm3hq4hhpclrywp52rrd3v2k37peqia',
        alt: 'Empty chairs arranged in a semicircle before the event',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreifka6pryqaxkuxqa43h4uiucxc4dln4gergjspqclatngdjefzjey',
        alt: 'A conversation at the edge of a table with pizza boxes',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:er6erflnnxcozlbqmrpflt6h/bafkreih5ilqvdk2grb5glwx76rfav5nhfaxl5tuwwkzot2fuxciyi4enfu',
        alt: 'Patak chatting with James while Willow sets things up',
      },
      {
        url: 'https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:akon7og3z6ihjpoclxzjrglf/bafkreigda6qfmea4yyvvlwf7rckpdzflp6fwe6gixugqchgs27i3qtnxpm',
        alt: 'Alex presenting a talk on trust',
      },
    ],
    talks: [
      {
        id: 'roadmap',
        title: 'npmx Roadmap',
        abstract: 'Where npmx is headed over the next few months.',
        speakers: [{ name: 'Lope', handle: 'lope.npmx.dev', avatar: AVATARS.b }],
        watchUrl: 'https://youtube.com',
        slidesUrl: 'https://speakerdeck.com',
      },
    ],
  },
]
