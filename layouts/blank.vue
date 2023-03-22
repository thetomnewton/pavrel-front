<script setup lang="ts">
import { watchForDarkMode } from '~~/helpers/dark'

useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 dark:text-zinc-200' },
})

watchForDarkMode()
</script>

<template>
  <slot />
</template>
