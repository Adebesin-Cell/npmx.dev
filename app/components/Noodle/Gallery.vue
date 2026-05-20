<script setup lang="ts">
const props = defineProps<{
  images: string[]
  alt?: string
}>()

const VISIBLE = 4
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const previewImages = computed(() => props.images.slice(0, VISIBLE))
const overflow = computed(() => Math.max(0, props.images.length - VISIBLE))

function openAt(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}
</script>

<template>
  <div v-if="images.length" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
    <button
      v-for="(image, index) in previewImages"
      :key="image"
      type="button"
      class="group relative aspect-square overflow-hidden rounded-md border border-border bg-bg-elevated transition-colors hover:border-border-hover cursor-pointer"
      @click="openAt(index)"
    >
      <img
        :src="image"
        :alt="alt ? `${alt} — ${index + 1}` : ''"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
      />
      <div
        v-if="index === VISIBLE - 1 && overflow > 0"
        class="absolute inset-0 flex items-center justify-center bg-black/55 text-fg font-mono text-lg"
      >
        +{{ overflow }}
      </div>
    </button>
  </div>
  <NoodleLightbox
    v-model:open="lightboxOpen"
    :images="images"
    :start-index="lightboxIndex"
    :alt="alt"
  />
</template>
