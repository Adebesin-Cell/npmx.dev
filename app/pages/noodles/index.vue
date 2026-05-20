<script setup lang="ts">
import { noodles } from '#noodles/entries'

definePageMeta({
  name: 'noodles',
})

useSeoMeta({
  title: () => `${$t('noodles.title')} - npmx`,
  ogTitle: () => `${$t('noodles.title')} - npmx`,
  twitterTitle: () => `${$t('noodles.title')} - npmx`,
  description: () => $t('noodles.meta_description'),
  ogDescription: () => $t('noodles.meta_description'),
  twitterDescription: () => $t('noodles.meta_description'),
})

const colorMode = useColorMode()
const moonSrc = computed(() =>
  colorMode.value === 'light' ? '/extra/moon-light.png' : '/extra/moon-dark.png',
)
</script>

<template>
  <main class="container w-full flex-1 overflow-x-hidden">
    <section
      class="relative overflow-hidden border-b border-border-subtle py-12 sm:py-20 -mx-4 sm:-mx-6 px-4 sm:px-6 mb-12 sm:mb-16"
    >
      <div
        class="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(135deg,var(--border-subtle)_0_1px,transparent_1px_12px)]"
        aria-hidden="true"
      />
      <div class="relative max-w-4xl mx-auto flex flex-col items-center text-center">
        <div
          class="relative aspect-square w-72 sm:w-96 max-w-full flex items-center justify-center"
        >
          <div
            class="absolute inset-0 rounded-full border border-border-subtle bg-bg-elevated/40"
            aria-hidden="true"
          />
          <h1 class="relative font-mono text-4xl sm:text-6xl font-medium z-10">
            {{ $t('noodles.title') }}
          </h1>
          <img
            :src="moonSrc"
            alt=""
            aria-hidden="true"
            class="absolute -bottom-2 sm:-bottom-4 inset-is-1/2 -translate-x-1/2 w-44 sm:w-60 pointer-events-none"
          />
        </div>
      </div>
    </section>

    <article class="max-w-5xl mx-auto pb-16 sm:pb-24">
      <header class="mb-6">
        <h2 class="font-mono text-xs tracking-widest uppercase text-fg-muted">
          {{ $t('noodles.latest') }}
        </h2>
      </header>
      <ul
        v-if="noodles.length > 0"
        role="list"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0"
      >
        <li v-for="noodle in noodles" :key="noodle.key">
          <NoodleListCard :noodle="noodle" />
        </li>
      </ul>
      <p v-else class="text-fg-subtle text-center py-20">
        {{ $t('noodles.empty') }}
      </p>

      <section class="mt-16 sm:mt-20 max-w-3xl">
        <h2 class="font-mono text-xs tracking-widest uppercase text-fg-muted mb-4">
          {{ $t('noodles.what_is') }}
        </h2>
        <div class="text-fg-muted text-sm sm:text-base leading-relaxed space-y-4">
          <p>{{ $t('noodles.what_is_body') }}</p>
        </div>
      </section>
    </article>
  </main>
</template>
