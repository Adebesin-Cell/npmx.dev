<script setup lang="ts">
const { isOpen, registerInput, close } = useMobileSearch()
const { model: searchQuery, startSearch } = useGlobalSearch('header')

const inputRef = useTemplateRef('inputRef')

onMounted(() => registerInput(() => inputRef.value?.focus()))
onUnmounted(() => registerInput(null))

function handleSubmit() {
  if (!searchQuery.value.trim()) return
  startSearch()
  close()
}

const route = useRoute()
watch(() => route.fullPath, close)

onKeyStroke(e => isKeyWithoutModifiers(e, 'Escape') && isOpen.value, close)

const isLocked = useScrollLock(document)
watch(isOpen, open => (isLocked.value = open))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 motion-reduce:transition-none"
      leave-active-class="transition-opacity duration-150 motion-reduce:transition-none"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <button
        v-if="isOpen"
        type="button"
        class="sm:hidden fixed inset-0 z-[60] bg-black/50 cursor-default"
        style="bottom: calc(3.5rem + env(safe-area-inset-bottom))"
        :aria-label="$t('common.close')"
        @click="close"
      />
    </Transition>

    <div
      role="dialog"
      aria-modal="true"
      :aria-hidden="!isOpen"
      :aria-label="$t('search.label')"
      class="sm:hidden fixed inset-x-0 z-[70] bg-bg border-t border-border p-3 rounded-t-lg transition-transform duration-200 ease-out motion-reduce:transition-none"
      :class="isOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'"
      style="bottom: calc(3.5rem + env(safe-area-inset-bottom))"
    >
      <form
        method="GET"
        action="/search"
        class="flex items-center gap-2"
        @submit.prevent="handleSubmit"
      >
        <label for="mobile-search" class="sr-only">{{ $t('search.label') }}</label>
        <div class="search-box relative flex items-center flex-1 min-w-0">
          <kbd
            class="absolute inset-is-3 text-fg-subtle font-mono text-sm pointer-events-none group-focus-within:text-accent z-1 rounded"
            aria-hidden="true"
          >
            /
          </kbd>
          <InputBase
            id="mobile-search"
            ref="inputRef"
            v-model="searchQuery"
            type="search"
            name="q"
            :placeholder="$t('search.placeholder')"
            no-correct
            size="sm"
            class="w-full ps-7"
            :tabindex="isOpen ? 0 : -1"
            ariaKeyshortcuts="/"
          />
        </div>
        <ButtonBase
          type="submit"
          variant="primary"
          classicon="i-lucide:search"
          :aria-label="$t('search.button')"
          :tabindex="isOpen ? 0 : -1"
        />
        <ButtonBase
          type="button"
          classicon="i-lucide:x"
          :aria-label="$t('common.close')"
          :tabindex="isOpen ? 0 : -1"
          @click="close"
        />
      </form>
    </div>
  </Teleport>
</template>
