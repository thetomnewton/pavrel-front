<script setup lang="ts">
import { watchForDarkMode } from '~/helpers/dark'
import api from '../api'

const router = useRouter()

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: 'bg-white dark:bg-zinc-900 py-6 overflow-auto antialiased font-sans h-screen text-slate-900 py-6 sm:px-6',
  },
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

// If already logged in, redirect to logged-in area
onMounted(() => {
  api
    .get('/workspaces')
    .then(({ data }) => router.push(`/${localStorage.getItem('last-workspace') ?? data[data.length - 1].slug}/drafts`))
    .catch(() => {})
})

watchForDarkMode()
</script>

<template>
  <section class="mx-auto w-full px-4 sm:max-w-sm">
    <div class="mb-6 mt-12 flex justify-center">
      <AuthenticationCardLogo />
    </div>

    <slot />
  </section>
</template>
