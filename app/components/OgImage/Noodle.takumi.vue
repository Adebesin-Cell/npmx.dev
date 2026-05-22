<script setup lang="ts">
const {
  title,
  occasion = '',
  poster = '',
} = defineProps<{
  title: string
  occasion?: string
  poster?: string
}>()
</script>

<template>
  <OgLayout>
    <div class="px-15 py-12 flex justify-between gap-12 h-full">
      <div class="flex flex-col justify-center gap-8 max-w-[60%]">
        <OgBrand :height="40" />
        <div
          class="lg:text-6xl text-5xl tracking-tighter font-mono leading-tight"
          :style="{ lineClamp: 2, textOverflow: 'ellipsis' }"
        >
          {{ title }}
        </div>
        <div
          v-if="occasion"
          class="lg:text-2xl text-xl opacity-70 leading-snug"
          :style="{ lineClamp: 3, textOverflow: 'ellipsis' }"
        >
          {{ occasion }}
        </div>
      </div>

      <div v-if="poster" class="flex-1 max-w-[40%] flex items-center justify-center">
        <img :src="poster" alt="" class="max-w-full max-h-full object-contain" />
      </div>
    </div>
  </OgLayout>
</template>
