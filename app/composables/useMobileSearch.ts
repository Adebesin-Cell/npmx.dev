import { ref, readonly } from 'vue'

const isOpen = ref(false)

let focusInput: (() => void) | null = null

export function useMobileSearch() {
  function registerInput(fn: (() => void) | null) {
    focusInput = fn
  }

  function open() {
    isOpen.value = true
    focusInput?.()
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen: readonly(isOpen),
    registerInput,
    open,
    close,
  }
}

export function __resetMobileSearch() {
  isOpen.value = false
  focusInput = null
}
