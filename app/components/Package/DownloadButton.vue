<script setup lang="ts">
import type { SlimPackumentVersion } from '#shared/types'

const props = defineProps<{
  packageName: string
  version: SlimPackumentVersion
}>()

const loading = shallowRef(false)

async function downloadPackage() {
  const tarballUrl = props.version.dist.tarball
  if (!tarballUrl) return

  if (loading.value) return
  loading.value = true

  try {
    const response = await fetch(tarballUrl)
    if (!response.ok) {
      loading.value = false
      throw new Error(`Failed to fetch tarball (${response.status})`)
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${props.packageName.replace(/\//g, '__')}-${props.version.version}.tgz`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch {
    // Fallback to direct link for non-CORS or other issues, though download attribute may be ignored
    const link = document.createElement('a')
    link.href = tarballUrl
    link.download = `${props.packageName.replace(/\//g, '__')}-${props.version.version}.tgz`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  loading.value = false
}
</script>

<template>
  <TooltipApp :text="$t('package.download.tarball')">
    <ButtonBase
      ref="triggerRef"
      v-bind="$attrs"
      type="button"
      @click="downloadPackage"
      :disabled="loading"
      class="border-border-subtle bg-bg-subtle! text-xs text-fg-muted hover:enabled:(text-fg border-border-hover)"
    >
      <span
        class="size-[1em]"
        aria-hidden="true"
        :class="loading ? 'i-lucide:loader-circle animate-spin' : 'i-lucide:download'"
      />
      {{ $t('package.download.button') }}
    </ButtonBase>
  </TooltipApp>
</template>
