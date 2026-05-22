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

const lensSlides = computed<LensSlide[]>(() => {
  const slides: LensSlide[] = []
  if (logo.value) slides.push({ kind: 'logo', logo: logo.value })
  for (const src of noodle.value?.processImages ?? []) {
    slides.push({ kind: 'image', src })
  }
  return slides
})

const lensScroller = useTemplateRef<HTMLElement>('lensScroller')
const activeSlide = shallowRef(0)
const hasMultipleSlides = computed(() => lensSlides.value.length > 1)
const atStart = computed(() => activeSlide.value === 0)
const atEnd = computed(() => activeSlide.value >= lensSlides.value.length - 1)

function lensScrollTo(index: number) {
  const el = lensScroller.value
  if (!el) return
  const clamped = Math.max(0, Math.min(index, lensSlides.value.length - 1))
  const target = el.children[clamped] as HTMLElement | undefined
  target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
}

function onLensScroll() {
  const el = lensScroller.value
  if (!el) return
  const width = el.clientWidth
  if (width === 0) return
  activeSlide.value = Math.round(el.scrollLeft / width)
}

function lensPrev() {
  lensScrollTo(activeSlide.value - 1)
}
function lensNext() {
  lensScrollTo(activeSlide.value + 1)
}

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
  <main class="w-full overflow-x-hidden">
    <!-- HERO -->
    <section
      class="relative overflow-hidden border-b border-border-subtle py-10 sm:py-20 px-4 sm:px-6"
    >
      <div
        class="absolute inset-0 [background-image:repeating-linear-gradient(115deg,rgb(0_0_0/0.04)_0_22px,transparent_22px_80px)] dark:[background-image:repeating-linear-gradient(115deg,rgb(0_0_0/0.35)_0_22px,transparent_22px_80px)]"
        aria-hidden="true"
      />
      <div class="relative max-w-3xl mx-auto flex flex-col items-center text-center">
        <div class="relative aspect-square w-60 sm:w-96 max-w-full">
          <!-- The lens: bowl chrome with rounded clip. Slides scroll under it. -->
          <div
            class="absolute inset-0 rounded-full overflow-hidden bg-bg-subtle border-[10px] sm:border-[14px] border-border [box-shadow:inset_0_0_50px_rgb(0_0_0/0.28),inset_0_2px_2px_rgb(255_255_255/0.9),0_20px_50px_-12px_rgb(0_0_0/0.3)] dark:[box-shadow:inset_0_0_60px_rgb(0_0_0/0.6),0_20px_50px_-10px_rgb(0_0_0/0.5)]"
          >
            <div
              v-if="lensSlides.length"
              ref="lensScroller"
              class="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              :aria-label="$t('noodles.lens_label', { title: noodle?.title ?? '' })"
              @scroll.passive="onLensScroll"
            >
              <div
                v-for="(slide, index) in lensSlides"
                :key="index"
                class="shrink-0 w-full h-full snap-start flex items-center justify-center p-6 sm:p-10"
              >
                <component
                  v-if="slide.kind === 'logo'"
                  :is="slide.logo"
                  class="max-w-[80%] max-h-[80%]"
                />
                <img
                  v-else
                  :src="slide.src"
                  :alt="
                    noodle?.title ? `${noodle.title} — ${$t('noodles.lens_slide', { index })}` : ''
                  "
                  loading="lazy"
                  class="max-w-[85%] max-h-[85%] object-contain"
                />
              </div>
            </div>
            <span
              v-else
              class="absolute inset-0 flex items-center justify-center font-mono text-6xl sm:text-8xl text-fg-subtle select-none"
              aria-hidden="true"
              >?</span
            >
          </div>

          <!-- Lens controls — only visible when there's more than one slide. -->
          <template v-if="hasMultipleSlides">
            <ButtonBase
              type="button"
              classicon="i-lucide:chevron-left"
              class="rtl-flip absolute top-1/2 -translate-y-1/2 -inset-is-3 sm:-inset-is-6 backdrop-blur z-10"
              :aria-label="$t('noodles.carousel_prev')"
              :disabled="atStart"
              @click="lensPrev"
            />
            <ButtonBase
              type="button"
              classicon="i-lucide:chevron-right"
              class="rtl-flip absolute top-1/2 -translate-y-1/2 -inset-ie-3 sm:-inset-ie-6 backdrop-blur z-10"
              :aria-label="$t('noodles.carousel_next')"
              :disabled="atEnd"
              @click="lensNext"
            />
          </template>
        </div>

        <ol
          v-if="hasMultipleSlides"
          class="flex justify-center gap-2 mt-6 list-none p-0 m-0"
          :aria-label="$t('noodles.carousel_dots')"
        >
          <li v-for="(_, index) in lensSlides" :key="index">
            <button
              type="button"
              class="block w-2 h-2 rounded-full transition-colors cursor-pointer"
              :class="index === activeSlide ? 'bg-fg' : 'bg-fg-subtle/40 hover:bg-fg-subtle'"
              :aria-label="$t('noodles.carousel_jump', { index: index + 1 })"
              :aria-current="index === activeSlide ? 'true' : undefined"
              @click="lensScrollTo(index)"
            />
          </li>
        </ol>
      </div>
    </section>

    <!-- BODY -->
    <article class="container max-w-3xl mx-auto pb-16 sm:pb-24 pt-10 sm:pt-16">
      <template v-if="noodle">
        <header class="mb-10 sm:mb-14">
          <h1
            class="font-mono text-3xl sm:text-5xl font-medium tracking-tight mb-3 sm:mb-4 break-words"
          >
            {{ noodle.title }}
          </h1>
          <p
            v-if="noodle.occasion"
            class="text-fg-muted text-base sm:text-xl leading-relaxed mb-6 sm:mb-8"
          >
            {{ noodle.occasion }}
          </p>

          <dl
            class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-border-subtle text-xs font-mono m-0"
          >
            <div>
              <dt class="text-fg-subtle uppercase tracking-widest mb-1.5">
                {{ $t('noodles.dates') }}
              </dt>
              <dd class="text-fg-muted">
                <DateTime :datetime="noodle.date" year="numeric" month="short" day="numeric" />
                <template v-if="noodle.dateTo">
                  <span class="text-fg-subtle mx-1">—</span>
                  <DateTime :datetime="noodle.dateTo" year="numeric" month="short" day="numeric" />
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
            <div
              v-if="enrichedAuthors.length"
              class="sm:col-span-2 pt-4 sm:pt-2 border-t border-border-subtle sm:border-t-0"
            >
              <dt class="text-fg-subtle uppercase tracking-widest mb-2">
                {{ $t('noodles.credits') }}
              </dt>
              <dd>
                <AuthorList :authors="enrichedAuthors" variant="expanded" />
              </dd>
            </div>
          </dl>
        </header>

        <section v-if="noodle.description" class="mb-12 sm:mb-16">
          <p class="text-fg-muted text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {{ noodle.description }}
          </p>
        </section>
      </template>

      <!-- 404 -->
      <template v-else>
        <header class="text-center">
          <p
            class="font-mono text-xs tracking-widest uppercase text-fg-subtle mb-3"
            aria-label="404"
          >
            404 — empty bowl
          </p>
          <h1 class="font-mono text-3xl sm:text-4xl font-medium tracking-tight mb-4">
            {{ $t('noodles.missing.title') }}
          </h1>
          <p class="text-fg-muted text-base sm:text-lg leading-relaxed max-w-prose mx-auto mb-8">
            {{ $t('noodles.missing.body', { slug: slug }) }}
          </p>
          <NuxtLink
            to="/noodles"
            class="inline-flex items-center gap-2 text-sm font-mono text-fg-muted hover:text-fg transition-colors"
          >
            <span class="i-lucide:arrow-left rtl-flip w-4 h-4" aria-hidden="true" />
            {{ $t('noodles.back_to_archive') }}
          </NuxtLink>
        </header>
      </template>

      <footer v-if="noodle" class="mt-12 pt-8 border-t border-border-subtle">
        <NuxtLink
          to="/noodles"
          class="inline-flex items-center gap-2 text-sm font-mono text-fg-muted hover:text-fg transition-colors"
        >
          <span class="i-lucide:arrow-left rtl-flip w-4 h-4" aria-hidden="true" />
          {{ $t('noodles.back_to_archive') }}
        </NuxtLink>
      </footer>
    </article>
  </main>
</template>
