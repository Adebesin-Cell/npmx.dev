import { ref, readonly } from 'vue'
import { useRoute } from '#imports'

export type MobileNavView = 'root' | 'docs'

const isOpen = ref(false)
const activeView = ref<MobileNavView>('root')

function deriveDefaultView(path: string): MobileNavView {
  if (path === '/docs' || path.startsWith('/docs/')) return 'docs'
  return 'root'
}

export function useMobileNav() {
  const route = useRoute()

  function open(view?: MobileNavView) {
    activeView.value = view ?? deriveDefaultView(route.path)
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    activeView.value = 'root'
  }

  function toggle() {
    if (isOpen.value) close()
    else open()
  }

  function enterView(view: MobileNavView) {
    activeView.value = view
  }

  function back() {
    activeView.value = 'root'
  }

  return {
    isOpen: readonly(isOpen),
    activeView: readonly(activeView),
    open,
    close,
    toggle,
    enterView,
    back,
  }
}

// Test helper: resets module-level state between tests.
// Needed because isOpen/activeView are module-level singletons; without resetting
// them, test state bleeds across cases when the mock replaces ref() with plain objects.
export function __resetMobileNav() {
  isOpen.value = false
  activeView.value = 'root'
}
