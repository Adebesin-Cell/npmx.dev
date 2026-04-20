<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import type { NavigationConfigWithGroups } from '~/types'

const { links } = defineProps<{
  links: NavigationConfigWithGroups
}>()

const { isOpen, activeView, close, enterView, back } = useMobileNav()
const { open: openCommandPalette } = useCommandPalette()

const navRef = useTemplateRef('navRef')
const { activate, deactivate } = useFocusTrap(navRef, { allowOutsideClick: true })

function handleOpenCommandPalette() {
  close()
  nextTick(() => openCommandPalette())
}

function handleShowConnector() {
  const modal = document.querySelector<HTMLDialogElement>('#connector-modal')
  if (modal) {
    close()
    modal.showModal()
  }
}

function handleShowAuth() {
  const modal = document.querySelector<HTMLDialogElement>('#auth-modal')
  if (modal) {
    close()
    modal.showModal()
  }
}

const route = useRoute()
watch(() => route.fullPath, close)

onKeyStroke(
  e => isKeyWithoutModifiers(e, 'Escape') && isOpen.value,
  () => {
    if (activeView.value !== 'root') back()
    else close()
  },
)

const isLocked = useScrollLock(document)
watch(isOpen, open => (isLocked.value = open))
watch(isOpen, open => (open ? nextTick(activate) : deactivate()))
onUnmounted(deactivate)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-transform duration-200 ease-out motion-reduce:transition-none"
      leave-active-class="transition-transform duration-200 ease-in motion-reduce:transition-none"
      enter-from-class="translate-y-full"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="isOpen"
        id="mobile-menu-sheet"
        ref="navRef"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('nav.mobile_menu')"
        class="sm:hidden fixed inset-0 z-50 bg-bg flex flex-col overflow-hidden pb-[var(--mobile-bar-height,3.5rem)]"
      >
        <div
          class="flex-1 flex w-[200%] transition-transform duration-200 motion-reduce:transition-none"
          :style="{ transform: activeView === 'docs' ? 'translateX(-50%)' : 'translateX(0)' }"
        >
          <div class="w-1/2 flex flex-col">
            <HeaderMobileMenuRootView
              :links="links"
              @close="close"
              @enter-docs="enterView('docs')"
              @open-command-palette="handleOpenCommandPalette"
              @show-connector="handleShowConnector"
              @show-auth="handleShowAuth"
            />
          </div>
          <div class="w-1/2 flex flex-col">
            <HeaderMobileMenuDocsView @back="back" @close="close" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
