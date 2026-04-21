<script setup lang="ts">
const { isOpen, activeView, toggle, close, back } = useMobileNav()
const { open: openCommandPalette } = useCommandPalette()
const colorMode = useColorMode()

const contextLabel = computed(() => {
  if (!isOpen.value) return ''
  if (activeView.value === 'docs') return $t('nav.docs_label')
  return ''
})

const hidden = shallowRef(false)
const SCROLL_THRESHOLD = 24

if (typeof window !== 'undefined') {
  let lastY = window.scrollY
  const onScroll = () => {
    if (isOpen.value) {
      hidden.value = false
      lastY = window.scrollY
      return
    }
    const y = window.scrollY
    if (y < SCROLL_THRESHOLD) {
      hidden.value = false
    } else if (y > lastY) {
      hidden.value = true
    } else if (y < lastY) {
      hidden.value = false
    }
    lastY = y
  }
  useEventListener(window, 'scroll', onScroll, { passive: true })
}

watch(isOpen, open => {
  if (open) hidden.value = false
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
      class="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-bg border-t border-border flex items-center gap-2 px-3 h-14 pb-[env(safe-area-inset-bottom)] transition-transform duration-200 ease-out motion-reduce:transition-none"
      :class="hidden ? 'translate-y-full' : 'translate-y-0'"
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
      <button
        v-else
        type="button"
        class="flex items-center gap-2 flex-1 min-w-0 px-2 py-1 -mx-2 rounded-md hover:bg-bg-subtle transition-colors duration-200 text-start"
        :aria-label="$t('nav.back_to_main_menu')"
        @click="back"
      >
        <span
          class="i-lucide:arrow-left rtl-flip w-4 h-4 text-fg-muted flex-shrink-0"
          aria-hidden="true"
        />
        <span class="font-mono text-sm text-fg truncate">{{ contextLabel }}</span>
      </button>

      <div v-if="!contextLabel" class="flex-1" />

      <ButtonBase
        type="button"
        :aria-label="$t('nav.tap_to_search')"
        classicon="i-lucide:search"
        @click="handleSearchClick"
      />
      <ButtonBase
        type="button"
        :aria-label="
          colorMode.value === 'dark'
            ? $t('nav.switch_to_light_theme')
            : $t('nav.switch_to_dark_theme')
        "
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
