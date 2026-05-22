<script setup lang="ts">
const props = defineProps<{
  images: string[]
  alt?: string
}>()

const scroller = useTemplateRef<HTMLElement>('scroller')
const activeIndex = shallowRef(0)
const atStart = computed(() => activeIndex.value === 0)
const atEnd = computed(() => activeIndex.value >= props.images.length - 1)

function scrollTo(index: number) {
  const el = scroller.value
  if (!el) return
  const clamped = Math.max(0, Math.min(index, props.images.length - 1))
  const slide = el.children[clamped] as HTMLElement | undefined
  slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
}

function onScroll() {
  const el = scroller.value
  if (!el) return
  const width = el.clientWidth
  if (width === 0) return
  activeIndex.value = Math.round(el.scrollLeft / width)
}

function prev() {
  scrollTo(activeIndex.value - 1)
}
function next() {
  scrollTo(activeIndex.value + 1)
}

function figLabel(index: number) {
  return `Fig. ${String(index + 1).padStart(2, '0')}`
}
</script>

<template>
  <section v-if="images.length" class="relative">
    <div
      ref="scroller"
      class="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @scroll.passive="onScroll"
    >
      <figure v-for="(image, index) in images" :key="image" class="shrink-0 w-full snap-start m-0">
        <div
          class="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-bg-elevated"
        >
          <img
            :src="image"
            :alt="alt ? `${alt} — ${figLabel(index)}` : ''"
            :loading="index === 0 ? 'eager' : 'lazy'"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <figcaption
          class="mt-3 flex items-baseline justify-between font-mono text-xs text-fg-subtle"
        >
          <span class="uppercase tracking-widest">{{ figLabel(index) }}</span>
          <span class="text-fg-muted">{{ index + 1 }} / {{ images.length }}</span>
        </figcaption>
      </figure>
    </div>

    <div
      v-if="images.length > 1"
      class="absolute inset-y-0 inset-is-0 flex items-center pe-2 pointer-events-none"
    >
      <ButtonBase
        type="button"
        classicon="i-lucide:chevron-left"
        class="rtl-flip pointer-events-auto -translate-x-2 sm:-translate-x-4 backdrop-blur"
        :aria-label="$t('noodles.carousel_prev')"
        :disabled="atStart"
        @click="prev"
      />
    </div>
    <div
      v-if="images.length > 1"
      class="absolute inset-y-0 inset-ie-0 flex items-center ps-2 pointer-events-none"
    >
      <ButtonBase
        type="button"
        classicon="i-lucide:chevron-right"
        class="rtl-flip pointer-events-auto translate-x-2 sm:translate-x-4 backdrop-blur"
        :aria-label="$t('noodles.carousel_next')"
        :disabled="atEnd"
        @click="next"
      />
    </div>

    <ol
      v-if="images.length > 1"
      class="flex justify-center gap-2 mt-4 list-none p-0 m-0"
      :aria-label="$t('noodles.carousel_dots')"
    >
      <li v-for="(_, index) in images" :key="index">
        <button
          type="button"
          class="block w-2 h-2 rounded-full transition-colors cursor-pointer"
          :class="index === activeIndex ? 'bg-fg' : 'bg-fg-subtle/40 hover:bg-fg-subtle'"
          :aria-label="$t('noodles.carousel_jump', { index: index + 1 })"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="scrollTo(index)"
        />
      </li>
    </ol>
  </section>
</template>
