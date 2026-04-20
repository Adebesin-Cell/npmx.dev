<script setup lang="ts">
const { isOpen, activeView, toggle, close } = useMobileNav()
const { open: openCommandPalette } = useCommandPalette()
const colorMode = useColorMode()

const contextLabel = computed(() => {
  if (!isOpen.value) return ''
  if (activeView.value === 'docs') return $t('nav.docs_label')
  return ''
})

function handleSearchClick() {
  if (isOpen.value) close()
  nextTick(() => openCommandPalette())
}

function handleThemeClick() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <Teleport to="body">
    <div
      class="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-bg border-t border-border flex items-center gap-2 px-3 h-14"
      :style="{ '--mobile-bar-height': '3.5rem' }"
    >
      <NuxtLink
        v-if="!contextLabel"
        to="/"
        :aria-label="$t('header.home')"
        class="font-mono text-lg text-fg flex-shrink-0"
        @click="close"
      >
        <AppMark class="w-6 h-auto" />
      </NuxtLink>
      <div v-else class="flex items-center gap-2 flex-1 min-w-0">
        <AppMark class="w-6 h-auto flex-shrink-0" aria-hidden="true" />
        <span class="font-mono text-sm text-fg truncate">{{ contextLabel }}</span>
      </div>

      <div v-if="!contextLabel" class="flex-1" />

      <ButtonBase
        type="button"
        :aria-label="$t('nav.tap_to_search')"
        classicon="i-lucide:search"
        @click="handleSearchClick"
      />
      <ButtonBase
        type="button"
        :aria-label="colorMode.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
        :classicon="colorMode.value === 'dark' ? 'i-lucide:sun' : 'i-lucide:moon'"
        @click="handleThemeClick"
      />
      <ButtonBase
        type="button"
        :aria-label="isOpen ? $t('nav.close_menu') : $t('nav.open_menu')"
        :aria-expanded="isOpen"
        aria-controls="mobile-menu-sheet"
        :classicon="isOpen ? 'i-lucide:x' : 'i-lucide:menu'"
        @click="toggle"
      />
    </div>
  </Teleport>
</template>
