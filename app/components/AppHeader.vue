<script setup lang="ts">
import { LinkBase } from '#components'

const { open: openCommandPalette } = useCommandPalette()
const { commandPaletteShortcutLabel } = usePlatformModifierKey()

withDefaults(
  defineProps<{
    showLogo?: boolean
  }>(),
  {
    showLogo: true,
  },
)

const { isConnected, npmUser } = useConnector()

const { desktopLinks } = useGlobalNavLinks()

const showFullSearch = shallowRef(false)
const { env, prNumber } = useAppConfig().buildInfo

const route = useRoute()
const searchBoxRef = useTemplateRef('searchBoxRef')

const isOnHomePage = computed(() => route.name === 'index')
const isOnSearchPage = computed(() => route.name === 'search')

watch(
  isOnSearchPage,
  visible => {
    if (!visible) return

    searchBoxRef.value?.focus()
    nextTick(() => {
      searchBoxRef.value?.focus()
    })
  },
  { flush: 'sync' },
)

function handleSearchBlur() {
  showFullSearch.value = false
}

function handleSearchFocus() {
  showFullSearch.value = true
}

useShortcuts({
  'c': () => ({ name: 'compare' }),
  ',': () => ({ name: 'settings' }),
})
</script>

<template>
  <header class="hidden sm:block sticky top-0 z-50 border-b border-border">
    <div class="absolute inset-0 bg-bg/80 backdrop-blur-md" />
    <nav
      :aria-label="$t('nav.main_navigation')"
      class="relative container min-h-14 flex items-center gap-2 z-1 justify-end"
    >
      <!-- Desktop: Logo (navigates home) -->
      <LogoContextMenu v-if="showLogo" class="hidden sm:flex flex-shrink-0 items-center">
        <NuxtLink
          :to="{ name: 'index' }"
          :aria-label="$t('header.home')"
          dir="ltr"
          class="relative inline-flex items-center gap-1 py-2 header-logo font-mono text-lg font-medium text-fg hover:text-fg/90 transition-colors duration-200 me-4"
        >
          <AppLogo class="h-4.5 w-auto" />
          <span
            aria-hidden="true"
            class="scale-35 transform-origin-br font-mono tracking-wide text-accent absolute bottom-0.75 -inset-ie-1"
          >
            {{ env === 'release' ? 'alpha' : env }}
          </span>
        </NuxtLink>
      </LogoContextMenu>

      <NuxtLink
        v-if="showLogo && prNumber"
        :to="`https://github.com/npmx-dev/npmx.dev/pull/${prNumber}`"
        :aria-label="$t('header.pr', { prNumber })"
      >
        <span class="text-xs px-1.5 py-0.5 rounded badge-green font-sans font-medium">
          PR #{{ prNumber }}
        </span>
      </NuxtLink>

      <!-- Spacer when logo is hidden on desktop -->
      <span v-else class="hidden sm:block w-1" />

      <ButtonBase
        type="button"
        variant="secondary"
        class="hidden lg:inline-flex shrink-0 gap-2 px-2.5 me-3"
        :aria-label="$t('shortcuts.command_palette')"
        :title="$t('shortcuts.command_palette_description', { ctrlKey: $t('shortcuts.ctrl_key') })"
        @click="openCommandPalette"
      >
        <span>{{ $t('command_palette.quick_actions') }}</span>
        <span class="inline-flex items-center gap-1 text-xs text-fg-subtle">
          <kbd
            class="inline-flex items-center justify-center rounded border border-border bg-bg-muted px-1.5 py-0.5 font-mono text-[0.7rem] text-fg-muted"
          >
            {{ commandPaletteShortcutLabel }}
          </kbd>
        </span>
      </ButtonBase>

      <!-- Center: Search bar + nav items -->
      <div
        class="flex-1 flex items-center md:gap-6"
        :class="{
          'justify-end': isOnHomePage,
          'justify-center': !isOnHomePage,
        }"
      >
        <!-- Search bar -->
        <HeaderSearchBox
          ref="searchBoxRef"
          :class="{ 'max-w-md': !showFullSearch }"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        />
        <ul
          v-if="isConnected && npmUser"
          :class="{ hidden: showFullSearch }"
          class="hidden sm:flex items-center gap-4 sm:gap-6 list-none m-0 p-0"
        >
          <!-- Packages dropdown (when connected) -->
          <li v-if="isConnected && npmUser" class="flex items-center">
            <HeaderPackagesDropdown :username="npmUser" />
          </li>

          <!-- Orgs dropdown (when connected) -->
          <li v-if="isConnected && npmUser" class="flex items-center">
            <HeaderOrgsDropdown :username="npmUser" />
          </li>
        </ul>
      </div>

      <!-- End: Desktop nav items -->
      <div class="hidden sm:flex flex-shrink-0 items-center gap-2">
        <!-- Desktop: Explore link -->
        <LinkBase
          v-for="link in desktopLinks"
          :key="link.name"
          class="border-none"
          variant="button-secondary"
          :to="link.to"
          :aria-keyshortcuts="link.keyshortcut"
        >
          {{ link.label }}
        </LinkBase>

        <HeaderAccountMenu />
      </div>
    </nav>
  </header>
</template>
