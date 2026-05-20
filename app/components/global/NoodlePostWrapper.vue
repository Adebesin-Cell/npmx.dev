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
  <main class="container w-full py-12 sm:py-16">
    <article class="max-w-3xl mx-auto">
      <header class="mb-12">
        <div
          class="mb-8 flex items-center justify-center rounded-2xl border border-border bg-bg-elevated p-10 sm:p-14"
        >
          <component :is="logo" v-if="logo" class="max-w-xs sm:max-w-sm" />
          <span v-else class="i-lucide:sparkles w-16 h-16 text-fg-subtle" aria-hidden="true" />
        </div>
        <div
          v-if="frontmatter.draft"
          class="mb-6 px-4 py-3 rounded-md border border-badge-orange/30 bg-badge-orange/5 flex items-center gap-2 text-badge-orange"
        >
          <span class="i-lucide:file-edit w-4 h-4 shrink-0" aria-hidden="true" />
          <span class="text-sm font-medium">{{ $t('noodles.draft_banner') }}</span>
        </div>
        <h1 class="font-mono text-3xl sm:text-4xl font-medium mb-3">
          {{ frontmatter.title }}
        </h1>
        <p v-if="frontmatter.excerpt" class="text-fg-muted text-lg mb-6">
          {{ frontmatter.excerpt }}
        </p>
        <dl class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fg-muted font-mono m-0">
          <div v-if="entry?.permanent" class="flex items-center gap-1.5">
            <dt class="sr-only">{{ $t('noodles.permanent_badge') }}</dt>
            <dd>{{ $t('noodles.permanent_badge') }}</dd>
          </div>
          <template v-else-if="frontmatter.date">
            <div class="flex items-center gap-1.5">
              <dt class="sr-only">{{ $t('noodles.dates') }}</dt>
              <dd>
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
          </template>
        </dl>
        <div v-if="entry?.authors?.length" class="mt-6">
          <AuthorList :authors="entry.authors" variant="expanded" />
        </div>
      </header>

      <div class="prose dark:prose-invert max-w-none mb-12">
        <slot />
      </div>

      <section v-if="entry?.gallery?.length">
        <h2 class="font-mono text-sm tracking-widest uppercase text-fg-muted mb-4">
          {{ $t('noodles.gallery') }}
        </h2>
        <NoodleGallery :images="entry.gallery" :alt="frontmatter.title" />
      </section>

      <div class="mt-16 pt-8 border-t border-border-subtle">
        <NuxtLink
          to="/noodles"
          class="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors"
        >
          <span class="i-lucide:arrow-left w-4 h-4" aria-hidden="true" />
          {{ $t('noodles.back_to_index') }}
        </NuxtLink>
      </div>
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
