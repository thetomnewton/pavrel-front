<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    class="inline-flex cursor-default items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 focus:border-red-700 focus:outline-none focus:ring focus:ring-red-200 disabled:opacity-25"
  >
    <slot></slot>
  </button>
</template>
