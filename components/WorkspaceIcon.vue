<script setup lang="ts">
defineProps<{
  initial: string
  size?: number
}>()

const defaultSize = 18
</script>

<template>
  <span
    class="inline-flex items-center justify-center rounded text-[11px] text-white"
    :style="{
      width: `${size || defaultSize}px`,
      minWidth: `${size || defaultSize}px`,
      height: `${size || defaultSize}px`,
    }"
  >
    <span style="text-shadow: 0.02rem 0.02rem 1px rgba(0, 0, 0, 0.5)">
      {{ initial }}
    </span>
  </span>
</template>
