<script setup lang="ts">
import type { RawNoodlePostFrontmatter } from '#shared/schemas/noodle'
import { noodles } from '#noodles/entries'
import { resolveNoodleLogo } from '../Noodle'

const props = defineProps<{
  frontmatter: RawNoodlePostFrontmatter
}>()

const { t } = useI18n()

const entry = computed(() => noodles.find(n => n.slug === props.frontmatter.slug))
const logo = computed(() => resolveNoodleLogo(props.frontmatter.key))

useSeoMeta({
  title: () => `${props.frontmatter.title} — ${t('noodles.title')}`,
  description: () => props.frontmatter.excerpt,
  ogTitle: () => props.frontmatter.title,
  ogDescription: () => props.frontmatter.excerpt,
  ogType: 'article',
  ...(props.frontmatter.draft ? { robots: 'noindex, nofollow' } : {}),
})
</script>

<template>
  <main class="w-full overflow-x-hidden">
    <!-- HERO: full-bleed framed artifact, big and dramatic -->
    <section
      class="relative overflow-hidden border-b border-border-subtle py-16 sm:py-24 px-4 sm:px-6"
    >
      <div
        class="absolute inset-0 [background-image:repeating-linear-gradient(115deg,rgb(0_0_0/0.04)_0_22px,transparent_22px_80px)] dark:[background-image:repeating-linear-gradient(115deg,rgb(0_0_0/0.35)_0_22px,transparent_22px_80px)]"
        aria-hidden="true"
      />
      <div class="relative max-w-3xl mx-auto flex flex-col items-center text-center">
        <div
          class="relative aspect-square w-72 sm:w-96 max-w-full flex items-center justify-center rounded-full overflow-hidden bg-bg-subtle border-[14px] border-border [box-shadow:inset_0_0_40px_rgb(0_0_0/0.08),0_20px_40px_-12px_rgb(0_0_0/0.15)] dark:[box-shadow:inset_0_0_60px_rgb(0_0_0/0.6),0_20px_50px_-10px_rgb(0_0_0/0.5)]"
        >
          <component :is="logo" v-if="logo" class="max-w-[60%] max-h-[60%]" />
          <span v-else class="i-lucide:sparkles w-16 h-16 text-fg-subtle" aria-hidden="true" />
        </div>
      </div>
    </section>

    <article class="container max-w-3xl mx-auto pb-16 sm:pb-24">
      <header class="pt-12 sm:pt-16 mb-10 sm:mb-14">
        <div
          v-if="frontmatter.draft"
          class="mb-6 px-4 py-3 rounded-md border border-badge-orange/30 bg-badge-orange/5 flex items-center gap-2 text-badge-orange"
        >
          <span class="i-lucide:file-edit w-4 h-4 shrink-0" aria-hidden="true" />
          <span class="text-sm font-medium">{{ $t('noodles.draft_banner') }}</span>
        </div>

        <!-- CREDITS: avatar + name + handle row, above the title (blog-style) -->
        <div v-if="entry?.authors?.length" class="mb-8">
          <AuthorList :authors="entry.authors" variant="expanded" />
        </div>

        <h1 class="font-mono text-4xl sm:text-5xl font-medium tracking-tight mb-4">
          {{ frontmatter.title }}
        </h1>
        <p v-if="frontmatter.excerpt" class="text-fg-muted text-lg sm:text-xl leading-relaxed mb-8">
          {{ frontmatter.excerpt }}
        </p>

        <!-- META STRIP: tombstone (dates · status) -->
        <dl
          class="grid grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-border-subtle text-xs font-mono m-0"
        >
          <div v-if="frontmatter.date">
            <dt class="text-fg-subtle uppercase tracking-widest mb-1.5">
              {{ $t('noodles.dates') }}
            </dt>
            <dd class="text-fg-muted">
              <DateTime :datetime="frontmatter.date" year="numeric" month="short" day="numeric" />
              <template v-if="frontmatter.dateTo">
                <span class="text-fg-subtle mx-1">—</span>
                <DateTime
                  :datetime="frontmatter.dateTo"
                  year="numeric"
                  month="short"
                  day="numeric"
                />
              </template>
            </dd>
          </div>
          <div>
            <dt class="text-fg-subtle uppercase tracking-widest mb-1.5">
              {{ $t('noodles.status') }}
            </dt>
            <dd class="text-fg-muted">
              {{ frontmatter.draft ? $t('noodles.status_draft') : $t('noodles.status_shipped') }}
            </dd>
          </div>
        </dl>
      </header>

      <!-- BODY: long-form notes, prose -->
      <div class="prose dark:prose-invert prose-lg max-w-none">
        <slot />
      </div>

      <!-- FIGURES: editorial reference figures, numbered, stacked. Only renders with real images. -->
      <section v-if="entry?.gallery?.length" class="mt-16 sm:mt-20">
        <h2 class="font-mono text-xl font-semibold uppercase text-fg leading-none mb-8">
          {{ $t('noodles.figures') }}
        </h2>
        <NoodleFigures :images="entry.gallery" :alt="frontmatter.title" />
      </section>

      <!-- FOOTER: back link -->
      <footer class="mt-20 pt-8 border-t border-border-subtle">
        <NuxtLink
          to="/noodles"
          class="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors"
        >
          <span class="i-lucide:arrow-left rtl-flip w-4 h-4" aria-hidden="true" />
          {{ $t('noodles.back_to_index') }}
        </NuxtLink>
      </footer>
    </article>
  </main>
</template>

<style scoped>
:deep(.prose a:not(.not-prose a):not([class*='no-underline'])) {
  text-decoration: underline;
  text-underline-offset: 0.2rem;
  text-decoration-thickness: 1px;
  text-decoration-color: var(--fg-subtle);
  transition:
    text-decoration-color 0.2s,
    color 0.2s;
}

:deep(.prose a:not(.not-prose a):not([class*='no-underline']):hover) {
  text-decoration-color: var(--fg);
  color: var(--fg);
}
</style>
