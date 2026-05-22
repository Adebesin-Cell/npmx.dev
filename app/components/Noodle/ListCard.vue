<script setup lang="ts">
import type { NoodlePostFrontmatter } from '#shared/schemas/noodle'
import { resolveNoodleLogo } from '../Noodle'

const props = defineProps<{
  noodle: NoodlePostFrontmatter
}>()

const logo = computed(() => resolveNoodleLogo(props.noodle.key))
</script>

<template>
  <component
    :is="noodle.prUrl ? 'a' : 'div'"
    :href="noodle.prUrl"
    :target="noodle.prUrl ? '_blank' : undefined"
    :rel="noodle.prUrl ? 'noopener noreferrer' : undefined"
    :aria-label="noodle.prUrl ? `${noodle.title} — open source PR` : undefined"
    class="group relative block rounded-xl border border-border bg-bg-elevated overflow-hidden decoration-none"
    :class="
      noodle.prUrl ? 'transition-colors hover:border-border-hover cursor-pointer' : 'cursor-default'
    "
  >
    <span class="sr-only">{{ noodle.title }}</span>
    <div class="aspect-[4/3] flex items-center justify-center bg-bg p-8 overflow-hidden">
      <component :is="logo" v-if="logo" class="max-w-full max-h-full" />
      <span v-else class="i-lucide:sparkles w-12 h-12 text-fg-subtle" aria-hidden="true" />
    </div>
    <div
      v-if="noodle.prUrl"
      class="absolute top-3 inset-ie-3 text-fg-subtle group-hover:text-fg transition-colors"
    >
      <span class="i-lucide:arrow-up-right rtl-flip w-4 h-4" aria-hidden="true" />
    </div>
    <div
      class="border-t border-border px-4 py-3 flex items-center gap-2 text-xs text-fg-muted font-mono"
    >
      <span class="text-fg-subtle">//</span>
      <DateTime
        v-if="noodle.date"
        :datetime="noodle.date"
        year="numeric"
        month="2-digit"
        day="2-digit"
      />
      <template v-if="noodle.dateTo">
        <span class="text-fg-subtle">—</span>
        <DateTime :datetime="noodle.dateTo" year="numeric" month="2-digit" day="2-digit" />
      </template>
    </div>
  </component>
</template>
