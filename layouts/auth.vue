<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'bg-white dark:bg-zinc-900 py-6 overflow-auto antialiased font-sans h-screen text-slate-900 py-6 sm:px-6',
  },
})
</script>

<template>
  <slot />
</template>
