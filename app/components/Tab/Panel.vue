<script setup lang="ts">
/**
 * TabPanel — content panel associated with a Tab.
 *
 * Automatically shows/hides based on the selected tab value.
 * Uses `data-selected` for CSS-driven visibility when needed.
 */

defineOptions({ name: 'TabPanel' })

const props = defineProps<{
  /** Must match the corresponding Tab's value. */
  value: string
  /** Optional explicit element id (default: auto-generated from Tabs idPrefix). */
  panelId?: string
}>()

const selected = inject<WritableComputedRef<string>>('tabs-selected')!
const getTabId = inject<(value: string) => string>('tabs-tab-id')!
const getPanelId = inject<(value: string) => string>('tabs-panel-id')!

const isSelected = computed(() => selected.value === props.value)
const resolvedPanelId = computed(() => props.panelId ?? getPanelId(props.value))
const resolvedTabId = computed(() => getTabId(props.value))
</script>

<template>
  <div
    v-show="isSelected"
    :id="resolvedPanelId"
    role="tabpanel"
    :aria-labelledby="resolvedTabId"
    :data-selected="isSelected ? '' : undefined"
    :tabindex="0"
  >
    <slot />
  </div>
</template>
