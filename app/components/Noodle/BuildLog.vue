<script setup lang="ts">
type BuildLogItem = {
  src: string
  version?: string
  caption?: string
  shipped?: boolean
}

const props = defineProps<{
  items: BuildLogItem[]
  alt?: string
}>()

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const lightboxImages = computed(() => props.items.map(i => i.src))

function openAt(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}
</script>

<template>
  <div v-if="items.length" class="relative">
    <ul
      role="list"
      class="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 list-none p-0 m-0 [scrollbar-width:thin]"
    >
      <li v-for="(item, index) in items" :key="item.src" class="snap-start shrink-0 w-64 sm:w-72">
        <button
          type="button"
          class="group w-full text-start flex flex-col gap-2 cursor-pointer"
          @click="openAt(index)"
        >
          <div
            class="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-bg-elevated transition-colors group-hover:border-border-hover"
          >
            <img
              :src="item.src"
              :alt="alt ? `${alt} — ${item.version ?? index + 1}` : ''"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <span
              v-if="item.shipped"
              class="absolute top-2 end-2 text-3xs font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-accent text-bg"
            >
              shipped
            </span>
          </div>
          <div class="flex items-baseline gap-2 min-w-0">
            <span v-if="item.version" class="font-mono text-xs text-fg-muted shrink-0">
              {{ item.version }}
            </span>
            <span v-if="item.caption" class="text-xs text-fg-subtle truncate" :title="item.caption">
              {{ item.caption }}
            </span>
          </div>
        </button>
      </li>
    </ul>
    <NoodleLightbox
      v-model:open="lightboxOpen"
      :images="lightboxImages"
      :start-index="lightboxIndex"
      :alt="alt"
    />
  </div>
</template>
