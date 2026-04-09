import { computed, shallowRef, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export interface UseVisibleItemsOptions {
  /**
   * Called when expanding. Useful for loading remaining data on demand.
   * If it returns a promise, `isExpanding` will be `true` until it resolves.
   */
  onExpand?: () => void | Promise<void>
}

export function useVisibleItems<T>(
  items: MaybeRefOrGetter<T[]>,
  limit: number,
  options?: UseVisibleItemsOptions,
) {
  const showAll = shallowRef(false)
  const isExpanding = shallowRef(false)

  const visibleItems = computed(() => {
    const list = toValue(items)
    return showAll.value ? list : list.slice(0, limit)
  })

  const hiddenCount = computed(() =>
    showAll.value ? 0 : Math.max(0, toValue(items).length - limit),
  )

  const hasMore = computed(() => !showAll.value && toValue(items).length > limit)

  const expand = async () => {
    if (showAll.value) return
    if (options?.onExpand) {
      isExpanding.value = true
      try {
        await options.onExpand()
      } finally {
        isExpanding.value = false
      }
    }
    showAll.value = true
  }
  const collapse = () => {
    showAll.value = false
  }
  const toggle = async () => {
    if (showAll.value) {
      collapse()
    } else {
      await expand()
    }
  }

  return { visibleItems, hiddenCount, hasMore, isExpanding, showAll, expand, collapse, toggle }
}
