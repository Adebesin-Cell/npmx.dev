<script setup lang="ts">
const props = defineProps<{
  images: string[]
  open: boolean
  startIndex?: number
  alt?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')
const currentIndex = ref(props.startIndex ?? 0)

watch(
  () => [props.open, props.startIndex] as const,
  ([open, startIndex]) => {
    if (!open) {
      dialogRef.value?.close()
      return
    }
    currentIndex.value = startIndex ?? 0
    if (!dialogRef.value?.open) dialogRef.value?.showModal()
  },
)

function close() {
  emit('update:open', false)
}

function prev() {
  if (props.images.length < 2) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function next() {
  if (props.images.length < 2) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') prev()
  else if (event.key === 'ArrowRight') next()
}

const currentImage = computed(() => props.images[currentIndex.value])
</script>

<template>
  <dialog
    ref="dialogRef"
    class="bg-transparent p-0 m-0 max-w-none max-h-none w-screen h-screen backdrop:bg-black/85"
    :aria-label="$t('noodles.lightbox.label')"
    @close="close"
    @click.self="close"
    @keydown="onKeydown"
  >
    <div class="relative w-full h-full flex items-center justify-center">
      <img
        v-if="currentImage"
        :src="currentImage"
        :alt="alt ?? ''"
        class="max-w-[90vw] max-h-[90vh] object-contain"
      />
      <ButtonBase
        class="absolute top-4 inset-ie-4 z-10"
        :aria-label="$t('noodles.lightbox.close')"
        @click="close"
      >
        <span class="i-lucide:x w-5 h-5" aria-hidden="true" />
      </ButtonBase>
      <template v-if="images.length > 1">
        <ButtonBase
          class="absolute inset-is-4 top-1/2 -translate-y-1/2 z-10"
          :aria-label="$t('noodles.lightbox.prev')"
          @click.stop="prev"
        >
          <span class="i-lucide:chevron-left w-5 h-5" aria-hidden="true" />
        </ButtonBase>
        <ButtonBase
          class="absolute inset-ie-4 top-1/2 -translate-y-1/2 z-10"
          :aria-label="$t('noodles.lightbox.next')"
          @click.stop="next"
        >
          <span class="i-lucide:chevron-right w-5 h-5" aria-hidden="true" />
        </ButtonBase>
        <div
          class="absolute bottom-6 inset-is-1/2 -translate-x-1/2 text-fg-muted text-xs font-mono bg-bg/60 px-2 py-1 rounded"
        >
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </template>
    </div>
  </dialog>
</template>
