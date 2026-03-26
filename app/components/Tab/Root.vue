<script setup lang="ts">
/**
 * Root container for the accessible Tabs compound component.
 *
 * Provides shared state to TabList, Tab, and TabPanel children
 * via provide/inject. Minimal JS — visual states are driven by
 * `data-selected` attributes on Tab and TabPanel elements.
 *
 * @example
 * <Tabs v-model="activeTab" default-value="overview">
 *   <TabList aria-label="Section navigation">
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="details">Details</Tab>
 *   </TabList>
 *   <TabPanel value="overview">Overview content</TabPanel>
 *   <TabPanel value="details">Details content</TabPanel>
 * </Tabs>
 */

defineOptions({ name: 'TabRoot' })

const props = withDefaults(
  defineProps<{
    /** Currently active tab value. */
    modelValue?: string
    /** Fallback value when modelValue is not provided. */
    defaultValue?: string
    /** Optional id prefix for generated tab/panel ids. */
    idPrefix?: string
  }>(),
  {
    idPrefix: 'tab',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const internalValue = shallowRef(props.defaultValue ?? '')

const selectedValue = computed({
  get: () => props.modelValue ?? internalValue.value,
  set: (v: string) => {
    internalValue.value = v
    emit('update:modelValue', v)
  },
})

function tabId(value: string): string {
  return `${props.idPrefix}-${value}`
}

function panelId(value: string): string {
  return `${props.idPrefix}-panel-${value}`
}

provide('tabs-selected', selectedValue)
provide('tabs-tab-id', tabId)
provide('tabs-panel-id', panelId)
</script>

<template>
  <div class="tab-root">
    <slot />
  </div>
</template>
