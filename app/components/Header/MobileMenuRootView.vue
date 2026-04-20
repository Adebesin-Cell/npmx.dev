<script setup lang="ts">
import type { NavigationConfigWithGroups } from '~/types'

const { links } = defineProps<{
  links: NavigationConfigWithGroups
}>()

const emit = defineEmits<{
  close: []
  enterDocs: []
  openCommandPalette: []
  showConnector: []
  showAuth: []
}>()

const { isConnected, npmUser, avatar: npmAvatar } = useConnector()
const { user: atprotoUser } = useAtproto()
</script>

<template>
  <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain py-2">
    <!-- Account section -->
    <div class="px-2 py-2">
      <span class="px-3 py-2 block font-mono text-xs text-fg-subtle uppercase tracking-wider">
        {{ $t('account_menu.account') }}
      </span>

      <button
        v-if="isConnected && npmUser"
        type="button"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-md font-mono text-sm text-fg hover:bg-bg-subtle transition-colors duration-200 text-start"
        @click="emit('showConnector')"
      >
        <img
          v-if="npmAvatar"
          :src="npmAvatar"
          :alt="npmUser"
          width="20"
          height="20"
          class="w-5 h-5 rounded-full object-cover"
        />
        <span v-else class="w-5 h-5 rounded-full bg-bg-muted flex items-center justify-center">
          <span class="i-lucide:terminal w-3 h-3 text-fg-muted" aria-hidden="true" />
        </span>
        <span class="flex-1">~{{ npmUser }}</span>
        <span class="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
      </button>

      <button
        v-if="atprotoUser"
        type="button"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-md font-mono text-sm text-fg hover:bg-bg-subtle transition-colors duration-200 text-start"
        @click="emit('showAuth')"
      >
        <img
          v-if="atprotoUser.avatar"
          :src="atprotoUser.avatar"
          :alt="atprotoUser.handle"
          width="20"
          height="20"
          class="w-5 h-5 rounded-full object-cover"
        />
        <span v-else class="w-5 h-5 rounded-full bg-bg-muted flex items-center justify-center">
          <span class="i-lucide:at-sign w-3 h-3 text-fg-muted" aria-hidden="true" />
        </span>
        <span class="flex-1 truncate">@{{ atprotoUser.handle }}</span>
      </button>

      <button
        v-else
        type="button"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-md font-mono text-sm text-fg hover:bg-bg-subtle transition-colors duration-200 text-start"
        @click="emit('showAuth')"
      >
        <span class="w-5 h-5 rounded-full bg-bg-muted flex items-center justify-center">
          <span class="i-lucide:at-sign w-3 h-3 text-fg-muted" aria-hidden="true" />
        </span>
        <span class="flex-1">{{ $t('account_menu.connect_atmosphere') }}</span>
      </button>
    </div>

    <!-- Command palette -->
    <div class="px-2 py-2">
      <span class="px-3 py-2 block font-mono text-xs text-fg-subtle uppercase tracking-wider">
        {{ $t('command_palette.title') }}
      </span>
      <ButtonBase
        class="w-full flex items-center gap-3 px-3 py-2 rounded-md font-mono text-sm text-fg hover:bg-bg-subtle transition-colors duration-200 text-start"
        :aria-label="$t('shortcuts.command_palette')"
        @click="emit('openCommandPalette')"
      >
        <span class="w-5 h-5 rounded-full bg-bg-muted flex items-center justify-center">
          <span class="i-lucide:command w-3 h-3 text-fg-muted" aria-hidden="true" />
        </span>
        <span class="flex-1">{{ $t('command_palette.quick_actions') }}</span>
      </ButtonBase>
    </div>

    <!-- Divider -->
    <div class="mx-4 my-2 border-t border-border" />

    <!-- Docs drill-down entry -->
    <div class="px-2 py-2">
      <button
        type="button"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-md font-mono text-sm text-fg hover:bg-bg-subtle transition-colors duration-200 text-start"
        :aria-label="$t('nav.docs_label')"
        @click="emit('enterDocs')"
      >
        <span class="i-lucide:book-open w-5 h-5 text-fg-muted" aria-hidden="true" />
        <span class="flex-1">{{ $t('nav.docs_label') }}</span>
        <span class="i-lucide:chevron-right rtl-flip w-4 h-4 text-fg-subtle" aria-hidden="true" />
      </button>
    </div>

    <!-- Divider -->
    <div class="mx-4 my-2 border-t border-border" />

    <!-- Link groups -->
    <template v-for="(group, index) in links">
      <div
        v-if="group.type === 'separator'"
        :key="`sep-${index}`"
        class="mx-4 my-2 border-t border-border"
      />
      <div v-if="group.type === 'group'" :key="group.name" class="p-2">
        <span
          v-if="group.label"
          class="px-3 py-2 font-mono text-xs text-fg-subtle uppercase tracking-wider"
        >
          {{ group.label }}
        </span>
        <div>
          <NuxtLink
            v-for="link in group.items"
            :key="link.name"
            :to="link.to"
            :href="link.href"
            :target="link.target"
            class="flex items-center gap-3 px-3 py-2 rounded-md font-mono text-sm text-fg hover:bg-bg-subtle transition-colors duration-200"
            @click="emit('close')"
          >
            <span :class="link.iconClass" class="w-5 h-5 text-fg-muted" aria-hidden="true" />
            {{ link.label }}
            <span
              v-if="link.external"
              class="i-lucide:external-link rtl-flip w-3 h-3 ms-auto text-fg-subtle"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>
