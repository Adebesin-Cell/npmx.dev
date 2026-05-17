import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock vue-router's useRoute
const mockRoute = { value: { path: '/' } }
vi.mock('vue-router', () => ({
  useRoute: () => mockRoute.value,
}))

import { useMobileNav, __resetMobileNav } from '~/composables/useMobileNav'

describe('useMobileNav', () => {
  beforeEach(() => {
    mockRoute.value = { path: '/' }
    __resetMobileNav()
  })

  it('starts closed with root view', () => {
    const nav = useMobileNav()
    expect(nav.isOpen.value).toBe(false)
    expect(nav.activeView.value).toBe('root')
  })

  it('open() on a non-docs route starts in root view', () => {
    mockRoute.value = { path: '/package/nuxt' }
    const nav = useMobileNav()
    nav.open()
    expect(nav.isOpen.value).toBe(true)
    expect(nav.activeView.value).toBe('root')
  })

  it('open() on a /docs route starts in docs view', () => {
    mockRoute.value = { path: '/docs/getting-started' }
    const nav = useMobileNav()
    nav.open()
    expect(nav.isOpen.value).toBe(true)
    expect(nav.activeView.value).toBe('docs')
  })

  it('enterView() switches view while open', () => {
    const nav = useMobileNav()
    nav.open()
    nav.enterView('docs')
    expect(nav.activeView.value).toBe('docs')
  })

  it('back() returns to root from docs', () => {
    const nav = useMobileNav()
    nav.open()
    nav.enterView('docs')
    nav.back()
    expect(nav.activeView.value).toBe('root')
  })

  it('close() resets isOpen and activeView', () => {
    const nav = useMobileNav()
    nav.open()
    nav.enterView('docs')
    nav.close()
    expect(nav.isOpen.value).toBe(false)
    expect(nav.activeView.value).toBe('root')
  })

  it('toggle() opens when closed and closes when open', () => {
    const nav = useMobileNav()
    nav.toggle()
    expect(nav.isOpen.value).toBe(true)
    nav.toggle()
    expect(nav.isOpen.value).toBe(false)
  })
})
