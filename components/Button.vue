<script setup lang="ts">
defineProps<{
  type?: 'submit' | 'reset' | 'button'
}>()

const defaultType: 'submit' = 'submit'
</script>

<template>
  <button
    :type="type || defaultType"
    class="border-md inline-flex cursor-default items-center justify-center whitespace-nowrap rounded-md border-transparent bg-blue-600 py-2 px-4 text-sm font-medium leading-5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
  >
    <slot />
  </button>
</template>
