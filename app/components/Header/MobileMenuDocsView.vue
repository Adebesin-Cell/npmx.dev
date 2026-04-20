<script setup lang="ts">
import { NPMX_DOCS_SITE } from '#shared/utils/constants'

const emit = defineEmits<{
  back: []
  close: []
}>()

const docsLinks = [{ labelKey: 'nav.docs_home', href: NPMX_DOCS_SITE, external: true }]
</script>

<template>
  <div class="flex-1 min-h-0 flex flex-col">
    <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain py-2">
      <div class="px-2 py-2">
        <span class="px-3 py-2 block font-mono text-xs text-fg-subtle uppercase tracking-wider">
          {{ $t('nav.docs_label') }}
        </span>
        <NuxtLink
          v-for="link in docsLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 px-3 py-2 rounded-md font-mono text-sm text-fg hover:bg-bg-subtle transition-colors duration-200"
          @click="emit('close')"
        >
          <span class="i-lucide:file-text w-5 h-5 text-fg-muted" aria-hidden="true" />
          <span class="flex-1">{{ $t(link.labelKey) }}</span>
          <span
            v-if="link.external"
            class="i-lucide:external-link rtl-flip w-3 h-3 ms-auto text-fg-subtle"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </div>

    <div class="border-t border-border p-3">
      <button
        type="button"
        class="w-full flex items-center gap-2 px-3 py-2 rounded-md font-mono text-sm text-fg hover:bg-bg-subtle transition-colors duration-200"
        :aria-label="$t('nav.back_to_main_menu')"
        @click="emit('back')"
      >
        <span class="i-lucide:arrow-left rtl-flip w-4 h-4 text-fg-muted" aria-hidden="true" />
        {{ $t('nav.back_to_main_menu') }}
      </button>
    </div>
  </div>
</template>
