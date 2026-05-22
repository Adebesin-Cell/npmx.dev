<script setup lang="ts">
import { findNoodle } from '~/noodles'
import { resolveNoodleLogo } from '~/components/Noodle'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

const noodle = computed(() => findNoodle(slug.value))
const logo = computed(() => (noodle.value ? resolveNoodleLogo(noodle.value.key) : undefined))

/** Map noodle authors to the shape AuthorList expects. */
const enrichedAuthors = computed(() =>
  (noodle.value?.authors ?? []).map(a => ({
    name: a.name,
    blueskyHandle: a.blueskyHandle as never,
    avatar: null,
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
    // Surface a 404 status to crawlers/headless tools while still rendering
    // the friendly inline UI to humans.
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
  <main class="w-full overflow-x-hidden px-4 sm:px-6">
    <!-- HERO: the bowl, same look as /noodles landing -->
    <section
      class="relative overflow-hidden border-b border-border-subtle py-10 sm:py-20 px-4 sm:px-6"
    >
      <div
        class="absolute inset-0 [background-image:repeating-linear-gradient(115deg,rgb(0_0_0/0.04)_0_22px,transparent_22px_80px)] dark:[background-image:repeating-linear-gradient(115deg,rgb(0_0_0/0.35)_0_22px,transparent_22px_80px)]"
        aria-hidden="true"
      />
      <div class="relative max-w-3xl mx-auto flex flex-col items-center text-center">
        <div
          class="relative aspect-square w-60 sm:w-96 max-w-full flex items-center justify-center"
        >
          <div
            class="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center bg-bg-subtle border-[10px] sm:border-[14px] border-border [box-shadow:inset_0_0_40px_rgb(0_0_0/0.08),0_20px_40px_-12px_rgb(0_0_0/0.15)] dark:[box-shadow:inset_0_0_60px_rgb(0_0_0/0.6),0_20px_50px_-10px_rgb(0_0_0/0.5)]"
            aria-hidden="true"
          >
            <component :is="logo" v-if="logo" class="max-w-[70%] max-h-[70%]" />
            <span
              v-else
              class="font-mono text-6xl sm:text-8xl text-fg-subtle select-none"
              aria-hidden="true"
              >?</span
            >
          </div>
        </div>
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
            class="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 pt-6 border-t border-border-subtle text-xs font-mono m-0"
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
            <div v-if="enrichedAuthors.length">
              <dt class="text-fg-subtle uppercase tracking-widest mb-1.5">
                {{ $t('noodles.credits') }}
              </dt>
              <dd>
                <AuthorList :authors="enrichedAuthors" variant="compact" />
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
          </dl>
        </header>

        <section v-if="noodle.description" class="mb-12 sm:mb-16">
          <p class="text-fg-muted text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {{ noodle.description }}
          </p>
        </section>

        <section v-if="noodle.processImages?.length" class="mb-12 sm:mb-16">
          <h2 class="font-mono text-xl font-semibold uppercase text-fg leading-none mb-6">
            {{ $t('noodles.process') }}
          </h2>
          <figure
            v-for="(image, index) in noodle.processImages"
            :key="image"
            class="m-0 mb-8 sm:mb-12 last:mb-0"
          >
            <div
              class="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-bg-elevated"
            >
              <img
                :src="image"
                :alt="`${noodle.title} — process ${index + 1}`"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <figcaption class="mt-3 font-mono text-xs text-fg-subtle uppercase tracking-widest">
              {{ `Fig. ${String(index + 1).padStart(2, '0')}` }}
            </figcaption>
          </figure>
        </section>
      </template>

      <!-- 404: cool "this noodle never existed" UI -->
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
