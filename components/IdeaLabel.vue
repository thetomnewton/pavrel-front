<script setup lang="ts">
defineProps<{
  color: string
}>()
</script>

<template>
  <span
    class="inline-flex cursor-default select-none items-center rounded border border-transparent bg-transparent px-[8px] leading-[24px] text-slate-800 dark:text-zinc-400"
  >
    <span class="mr-[10px] h-[6px] w-[6px] min-w-[6px] rounded-full" :style="{ backgroundColor: color }"></span>

    <slot />
  </span>
</template>
