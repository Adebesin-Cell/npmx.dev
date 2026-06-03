<script setup lang="ts">
import type { Component } from 'vue'
import type { AtIdentifierString } from '@atproto/lex'
import { findNoodle } from '~/noodles'
import { resolveNoodleLogo } from '~/components/Noodle'
import { resolveNoodleAvatar } from '#noodles/avatars'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

const noodle = computed(() => findNoodle(slug.value))
const logo = computed(() => (noodle.value ? resolveNoodleLogo(noodle.value.key) : undefined))

type LensSlide = { kind: 'logo'; logo: Component } | { kind: 'image'; src: string }

const variants = computed(() => noodle.value?.variants ?? [])
const hasVariants = computed(() => variants.value.length > 0)

const lensSlides = computed<LensSlide[]>(() => {
  if (!hasVariants.value) return []
  const slides: LensSlide[] = []
  if (logo.value) slides.push({ kind: 'logo', logo: logo.value })
  for (const src of variants.value) {
    slides.push({ kind: 'image', src })
  }
  return slides
})

const slideCount = computed(() => lensSlides.value.length)
const hasMultipleSlides = computed(() => slideCount.value > 1)

const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

const lensScroller = useTemplateRef<HTMLElement>('lensScroller')
const activeSlide = shallowRef(0)
// Position in the 3× slide list — keeps the snap-back loop in sync with `activeSlide`.
let rawIndex = 0

function snapBackIfNeeded() {
  const el = lensScroller.value
  if (!el) return
  const width = el.clientWidth
  const n = slideCount.value
  if (width === 0 || n === 0) return
  if (rawIndex < n) {
    rawIndex += n
    el.scrollLeft = rawIndex * width
  } else if (rawIndex >= 2 * n) {
    rawIndex -= n
    el.scrollLeft = rawIndex * width
  }
}

function onLensScroll() {
  const el = lensScroller.value
  if (!el) return
  const width = el.clientWidth
  const n = slideCount.value
  if (width === 0 || n === 0) return
  rawIndex = Math.round(el.scrollLeft / width)
  activeSlide.value = ((rawIndex % n) + n) % n
}

function lensScrollTo(canonicalIndex: number) {
  const el = lensScroller.value
  if (!el) return
  const n = slideCount.value
  if (n === 0) return
  // Shortest signed delta so wrapping across the loop seam still feels like one step.
  let delta = (((canonicalIndex - activeSlide.value) % n) + n) % n
  if (delta > n / 2) delta -= n
  const target = el.children[rawIndex + delta] as HTMLElement | undefined
  target?.scrollIntoView({
    behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'start',
  })
}

function lensPrev() {
  lensScrollTo((activeSlide.value - 1 + slideCount.value) % slideCount.value)
}
function lensNext() {
  lensScrollTo((activeSlide.value + 1) % slideCount.value)
}

// Pagination dots: active dot always centered, neighbours fade out with distance.
// Distance is measured the short way around the cycle so the strip reads as an infinite reel.
const DOT_PITCH = 16
const DOT_FADE_RADIUS = 4

// margin-inline-start is logical, so the same formula centers the active dot
// in both LTR and RTL — no direction detection needed.
const dotStripStyle = computed(() => ({
  marginInlineStart: `calc(50% - ${activeSlide.value * DOT_PITCH + DOT_PITCH / 2}px)`,
}))

function dotOpacity(index: number) {
  const n = slideCount.value
  if (n === 0) return 0
  const linear = Math.abs(index - activeSlide.value)
  const distance = Math.min(linear, n - linear)
  return Math.max(0, 1 - distance / DOT_FADE_RADIUS)
}

// Dots that are fully faded are taken out of pointer + AT reach so they
// can't be clicked invisibly or trap focus.
function isDotHidden(index: number) {
  return dotOpacity(index) === 0
}

function onLensKeydown(event: KeyboardEvent) {
  if (!hasMultipleSlides.value) return
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault()
      lensNext()
      break
    case 'ArrowLeft':
      event.preventDefault()
      lensPrev()
      break
    case 'Home':
      event.preventDefault()
      lensScrollTo(0)
      break
    case 'End':
      event.preventDefault()
      lensScrollTo(slideCount.value - 1)
      break
  }
}

// Start in the middle copy so both edges can be reached before a snap-back.
onMounted(() => {
  if (!hasMultipleSlides.value) return
  const el = lensScroller.value
  if (!el) return
  const width = el.clientWidth
  if (width === 0) return
  rawIndex = slideCount.value
  el.scrollLeft = rawIndex * width
  activeSlide.value = 0
})

const enrichedAuthors = computed(() =>
  (noodle.value?.authors ?? []).map(a => ({
    name: a.name,
    blueskyHandle: a.blueskyHandle as AtIdentifierString | undefined,
    avatar: resolveNoodleAvatar(a.blueskyHandle),
    profileUrl: a.blueskyHandle ? `https://bsky.app/profile/${a.blueskyHandle}` : null,
  })),
)

useSeoMeta({
  title: () =>
    noodle.value
      ? `${noodle.value.title} — ${$t('noodles.title')}`
      : `${$t('noodles.missing.title')} — ${$t('noodles.title')}`,
  description: () => noodle.value?.occasion,
  ogTitle: () => noodle.value?.title,
  ogDescription: () => noodle.value?.occasion,
})

if (noodle.value) {
  defineOgImage(
    'Noodle.takumi',
    {
      title: noodle.value.title,
      occasion: noodle.value.occasion ?? '',
      poster: noodle.value.posterImage,
      backdrop: noodle.value.posterBackdrop ?? '',
    },
    { alt: `${noodle.value.title} — npmx` },
  )
} else {
  defineOgImage(
    'Page.takumi',
    {
      title: () => noodle.value?.title ?? $t('noodles.missing.title'),
      description: () => noodle.value?.occasion ?? $t('noodles.title'),
    },
    { alt: () => `${noodle.value?.title ?? $t('noodles.missing.title')} — npmx` },
  )
}

onMounted(() => {
  if (!noodle.value) {
    const event = useRequestEvent()
    if (event) setResponseStatus(event, 404)
  }
})

if (import.meta.server && !noodle.value) {
  const event = useRequestEvent()
  if (event) setResponseStatus(event, 404)
}
</script>

<template>
  <main class="w-full flex-1 flex flex-col">
    <section
      class="relative flex-1 flex flex-col pt-6 pb-10 sm:pt-8 sm:pb-16 lg:pb-20 px-4 sm:px-6"
    >
      <div
        class="absolute inset-0 [background-image:repeating-linear-gradient(115deg,rgb(0_0_0/0.04)_0_22px,transparent_22px_80px)] dark:[background-image:repeating-linear-gradient(115deg,rgb(0_0_0/0.35)_0_22px,transparent_22px_80px)]"
        aria-hidden="true"
      />

      <nav class="relative max-w-6xl w-full mx-auto mb-10 sm:mb-14 lg:mb-16 flex justify-end">
        <NuxtLink
          to="/noodles"
          class="inline-flex items-center gap-2 text-sm font-mono text-fg-muted hover:text-fg transition-colors"
        >
          <span class="i-lucide:arrow-left rtl-flip w-4 h-4" aria-hidden="true" />
          {{ $t('noodles.back_to_archive') }}
        </NuxtLink>
      </nav>

      <div
        class="relative max-w-6xl w-full mx-auto grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-y-10 gap-x-16 xl:gap-x-24 items-start"
      >
        <!-- LENS COLUMN -->
        <div class="xl:sticky xl:top-24 flex flex-col items-center justify-self-center self-start">
          <div class="relative aspect-square w-60 sm:w-80 lg:w-96 max-w-full">
            <div
              class="absolute inset-0 rounded-full overflow-hidden bg-bg-subtle border-[10px] sm:border-[14px] border-border [box-shadow:inset_0_0_50px_rgb(0_0_0/0.28),inset_0_2px_2px_rgb(255_255_255/0.9),0_20px_50px_-12px_rgb(0_0_0/0.3)] dark:[box-shadow:inset_0_0_60px_rgb(0_0_0/0.6),0_20px_50px_-10px_rgb(0_0_0/0.5)]"
            >
              <!-- 3× copies + snap-back is the loop trick. See onLensScroll/snapBackIfNeeded. -->
              <div
                v-if="hasVariants"
                ref="lensScroller"
                tabindex="0"
                role="region"
                aria-roledescription="carousel"
                class="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                :aria-label="$t('noodles.lens_label', { title: noodle?.title ?? '' })"
                @scroll.passive="onLensScroll"
                @scrollend.passive="snapBackIfNeeded"
                @keydown="onLensKeydown"
              >
                <template v-for="copy in 3" :key="`copy-${copy}`">
                  <div
                    v-for="(slide, index) in lensSlides"
                    :key="`${copy}-${index}`"
                    class="shrink-0 w-full h-full snap-start flex items-center justify-center p-6 sm:p-10"
                    :role="copy === 2 ? 'group' : undefined"
                    :aria-roledescription="copy === 2 ? 'slide' : undefined"
                    :aria-label="
                      copy === 2
                        ? $t('noodles.lens_slide_position', {
                            index: index + 1,
                            total: slideCount,
                          })
                        : undefined
                    "
                    :aria-hidden="copy !== 2 ? 'true' : undefined"
                  >
                    <component
                      v-if="slide.kind === 'logo'"
                      :is="slide.logo"
                      no-tooltip
                      class="max-w-[80%] max-h-[80%]"
                    />
                    <img
                      v-else
                      :src="slide.src"
                      :alt="
                        copy === 2 && noodle?.title
                          ? `${noodle.title} — ${$t('noodles.lens_slide', { index })}`
                          : ''
                      "
                      loading="lazy"
                      class="max-w-[85%] max-h-[85%] object-contain"
                    />
                  </div>
                </template>
              </div>
              <div v-else class="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
                <component :is="logo" v-if="logo" no-tooltip class="max-w-[80%] max-h-[80%]" />
                <span
                  v-else
                  class="font-mono text-6xl sm:text-8xl text-fg-subtle select-none"
                  aria-hidden="true"
                  >?</span
                >
              </div>
            </div>

            <template v-if="hasMultipleSlides">
              <ButtonBase
                type="button"
                classicon="i-lucide:chevron-left"
                class="hidden sm:inline-flex rtl-flip absolute top-1/2 -translate-y-1/2 -inset-is-16 lg:-inset-is-20 text-3xl !p-3 z-10"
                :aria-label="$t('noodles.carousel_prev')"
                @click="lensPrev"
              />
              <ButtonBase
                type="button"
                classicon="i-lucide:chevron-right"
                class="hidden sm:inline-flex rtl-flip absolute top-1/2 -translate-y-1/2 -inset-ie-16 lg:-inset-ie-20 text-3xl !p-3 z-10"
                :aria-label="$t('noodles.carousel_next')"
                @click="lensNext"
              />
            </template>
          </div>

          <div
            v-if="hasMultipleSlides"
            class="mt-6 h-2 w-32 overflow-hidden flex items-center"
            :aria-label="$t('noodles.carousel_dots')"
            role="group"
          >
            <div
              class="flex items-center gap-2 shrink-0 motion-safe:transition-[margin] motion-safe:duration-300 motion-safe:ease-out"
              :style="dotStripStyle"
            >
              <button
                v-for="(_, index) in lensSlides"
                :key="index"
                type="button"
                class="block w-2 h-2 shrink-0 rounded-full bg-fg cursor-pointer motion-safe:transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                :class="isDotHidden(index) ? 'pointer-events-none' : ''"
                :style="{ opacity: dotOpacity(index) }"
                :aria-hidden="isDotHidden(index) ? 'true' : undefined"
                :tabindex="isDotHidden(index) ? -1 : 0"
                :aria-label="$t('noodles.carousel_jump', { index: index + 1 })"
                :aria-current="index === activeSlide ? 'true' : undefined"
                @click="lensScrollTo(index)"
              />
            </div>
          </div>

          <div v-if="hasMultipleSlides" class="sr-only" aria-live="polite" aria-atomic="true">
            {{ $t('noodles.lens_slide_position', { index: activeSlide + 1, total: slideCount }) }}
          </div>
        </div>

        <!-- CONTENT CARD -->
        <article
          class="rounded-2xl bg-bg-elevated/40 border border-border-subtle p-6 sm:p-10 backdrop-blur-sm"
        >
          <template v-if="noodle">
            <h1
              class="font-mono text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-3 sm:mb-4 break-words"
            >
              {{ noodle.title }}
            </h1>
            <p v-if="noodle.occasion" class="text-fg-muted text-base sm:text-lg leading-relaxed">
              {{ noodle.occasion }}
            </p>

            <p
              v-if="noodle.description"
              class="text-fg-muted text-base leading-relaxed whitespace-pre-line mt-6 sm:mt-8"
            >
              {{ noodle.description }}
            </p>

            <hr class="border-0 border-t border-border-subtle my-8 sm:my-10" />

            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-xs font-mono m-0">
              <div>
                <dt class="text-fg-subtle uppercase tracking-widest mb-1.5">
                  {{ $t('noodles.dates') }}
                </dt>
                <dd class="text-fg-muted">
                  <DateTime :datetime="noodle.date" year="numeric" month="short" day="numeric" />
                  <template v-if="noodle.dateTo">
                    <span class="text-fg-subtle mx-1">—</span>
                    <DateTime
                      :datetime="noodle.dateTo"
                      year="numeric"
                      month="short"
                      day="numeric"
                    />
                  </template>
                </dd>
              </div>
              <div v-if="noodle.prUrl">
                <dt class="text-fg-subtle uppercase tracking-widest mb-1.5">
                  {{ $t('noodles.shipped_in') }}
                </dt>
                <dd>
                  <LinkBase :to="noodle.prUrl" no-new-tab-icon class="text-fg-muted">
                    {{ noodle.prUrl.split('/').pop() ? `#${noodle.prUrl.split('/').pop()}` : 'PR' }}
                  </LinkBase>
                </dd>
              </div>
              <div v-if="enrichedAuthors.length" class="sm:col-span-2">
                <dt class="text-fg-subtle uppercase tracking-widest mb-3">
                  {{ $t('noodles.credits') }}
                </dt>
                <dd>
                  <AuthorList :authors="enrichedAuthors" variant="expanded" />
                </dd>
              </div>
              <div v-if="noodle.references?.length" class="sm:col-span-2">
                <dt class="text-fg-subtle uppercase tracking-widest mb-2">
                  {{ $t('noodles.learn_more') }}
                </dt>
                <dd>
                  <ul class="list-none p-0 m-0 flex flex-col gap-1.5">
                    <li v-for="(ref, idx) in noodle.references" :key="idx">
                      <LinkBase :to="ref.url" class="text-fg-muted">
                        {{ ref.label ?? ref.url }}
                      </LinkBase>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </template>

          <template v-else>
            <p class="font-mono text-xs tracking-widest uppercase text-fg-subtle mb-3">
              404 — empty bowl
            </p>
            <h1 class="font-mono text-3xl sm:text-4xl font-medium tracking-tight mb-4">
              {{ $t('noodles.missing.title') }}
            </h1>
            <p class="text-fg-muted text-base sm:text-lg leading-relaxed">
              {{ $t('noodles.missing.body', { slug: slug }) }}
            </p>
          </template>
        </article>
      </div>
    </section>
  </main>
</template>
