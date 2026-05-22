<script setup lang="ts">
const props = defineProps<{
  images: string[]
  alt?: string
}>()

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openAt(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function figLabel(index: number) {
  return `Fig. ${String(index + 1).padStart(2, '0')}`
}
</script>

<template>
  <figure v-for="(image, index) in images" :key="image" class="m-0 mb-12 sm:mb-16 last:mb-0">
    <button
      type="button"
      class="group block w-full cursor-pointer p-0 m-0 bg-transparent border-0"
      @click="openAt(index)"
    >
      <div
        class="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-bg-elevated transition-colors group-hover:border-border-hover"
      >
        <img
          :src="image"
          :alt="alt ? `${alt} — ${figLabel(index)}` : ''"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>
    </button>
    <figcaption class="mt-3 flex items-baseline gap-3 font-mono text-xs text-fg-subtle">
      <span class="uppercase tracking-widest">{{ figLabel(index) }}</span>
      <span v-if="alt" class="text-fg-muted normal-case truncate">{{ alt }}</span>
    </figcaption>
  </figure>
  <NoodleLightbox
    v-model:open="lightboxOpen"
    :images="images"
    :start-index="lightboxIndex"
    :alt="alt"
  />
</template>
