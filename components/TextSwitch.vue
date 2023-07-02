<script setup lang="ts">
defineProps<{
  value: boolean
}>()

defineEmits(['change'])
</script>

<template>
  <div class="inline-flex rounded-xl bg-slate-200 p-0.5 dark:bg-zinc-600">
    <button
      type="button"
      @click="$emit('change', true)"
      class="rounded-l-[10px] px-4 py-1.5 text-[13px] font-medium"
      :class="{
        'bg-white dark:bg-zinc-600 dark:text-zinc-100': value,
        'text-slate-600 dark:bg-zinc-900 dark:text-zinc-400': !value,
      }"
    >
      <slot name="option1" />
    </button>

    <button
      type="button"
      @click="$emit('change', false)"
      class="rounded-r-[10px] px-4 py-1.5 text-[13px] font-medium"
      :class="{
        'bg-white dark:bg-zinc-600 dark:text-zinc-100': !value,
        'text-slate-600 dark:bg-zinc-900 dark:text-zinc-400': value,
      }"
    >
      <slot name="option2" />
    </button>
  </div>
</template>
