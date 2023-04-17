<script setup lang="ts">
defineProps<{
  size: number
}>()
</script>

<template>
  <div
    class="inline-flex cursor-default items-center justify-center bg-blue-500 font-medium uppercase text-white"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      minWidth: `${size}px`,
      fontSize: `${Math.ceil(size * 0.65)}px`,
      borderRadius: `${Math.floor(size / 4)}px`,
      textShadow: 'rgba(0, 0, 0, 0.5) 0.02rem 0.02rem 1px',
    }"
  >
    <slot />
  </div>
</template>
