<script setup lang="ts">
import { watchForDarkMode } from '~~/helpers/dark'

useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 dark:text-zinc-200' },
  title: 'Pavrel',
  meta: [
    { name: 'msapplication-TileColor', content: '#0f172a' },
    { name: 'theme-color', content: '#0f172a' },
  ],
  link: [
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'icon', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#0f172a' },
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
