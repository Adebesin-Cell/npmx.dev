<script setup lang="ts">
import type { IconClass } from '~/types'

/**
 * Tab — a single tab button. Must be used inside TabList, within a TabRoot.
 *
 * Styling is driven by `data-selected` attribute — no conditional class logic.
 * Extra classes and attrs are passed through to ButtonBase.
 */

defineOptions({ name: 'TabItem', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Unique value identifying this tab. Must match a TabPanel's value. */
    value: string
    /** Optional icon class displayed before the label. */
    icon?: IconClass
    /** Optional explicit element id (default: auto-generated from TabRoot idPrefix). */
    tabId?: string
    /** @default "secondary" */
    variant?: 'primary' | 'secondary'
    /** @default "md" */
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'secondary',
    size: 'md',
  },
)

const attrs = useAttrs()

const selected = inject<WritableComputedRef<string>>('tabs-selected')!
const getTabId = inject<(value: string) => string>('tabs-tab-id')!
const getPanelId = inject<(value: string) => string>('tabs-panel-id')!

const isSelected = computed(() => selected.value === props.value)
const resolvedTabId = computed(() => props.tabId ?? getTabId(props.value))
const resolvedPanelId = computed(() => getPanelId(props.value))

function select() {
  selected.value = props.value
}
</script>

<template>
  <ButtonBase
    :id="resolvedTabId"
    role="tab"
    :aria-selected="isSelected ? 'true' : 'false'"
    :aria-controls="resolvedPanelId"
    :tabindex="isSelected ? -1 : 0"
    :data-selected="isSelected ? '' : undefined"
    :variant
    :size
    class="tab-item"
    v-bind="attrs"
    @click="select"
  >
    <span v-if="icon" :class="icon" class="size-[1em]" aria-hidden="true" />
    <slot />
  </ButtonBase>
</template>

<style scoped>
.tab-item {
  border-radius: var(--radius, 0.375rem);
  border-style: solid;
  border-color: transparent;
  color: var(--fg-subtle);
  transition:
    color 150ms,
    background-color 150ms,
    border-color 150ms;
}

.tab-item:hover {
  color: var(--fg);
}

.tab-item[data-selected] {
  background-color: var(--bg);
  border-color: var(--border);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  color: var(--fg);
}
</style>
