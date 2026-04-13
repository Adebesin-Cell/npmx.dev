import { computed, shallowRef, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export interface UseVisibleItemsOptions {
  /**
   * Called when expanding. Useful for loading remaining data on demand.
   * If it returns a promise, `isExpanding` will be `true` until it resolves.
   * Return `false` to signal a partial load — `showAll` stays false so
   * `hasMore` remains true and the user can retry.
   */
  onExpand?: () => void | boolean | Promise<void | boolean>
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
    let fullyLoaded = true
    if (options?.onExpand) {
      isExpanding.value = true
      try {
        const result = await options.onExpand()
        if (result === false) fullyLoaded = false
      } finally {
        isExpanding.value = false
      }
    }
    if (fullyLoaded) showAll.value = true
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
