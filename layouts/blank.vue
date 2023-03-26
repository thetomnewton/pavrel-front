<script setup lang="ts">
import { watchForDarkMode } from '~~/helpers/dark'

useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 dark:text-zinc-200' },
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'icon', href: '/favicon.svg' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
  ],
})

watchForDarkMode()
</script>

<template>
  <slot />
</template>
