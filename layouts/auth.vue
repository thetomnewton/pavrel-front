<script setup lang="ts">
import { watchForDarkMode } from '~/helpers/dark'
import { Workspace } from '~~/types'
import axios from '../api'

const router = useRouter()

useHead({
  bodyAttrs: {
    class: 'bg-white dark:bg-zinc-900 py-6 overflow-auto antialiased font-sans h-screen text-slate-900 py-6 sm:px-6',
  },
  title: 'Pavrel',
  meta: [
    {
      name: 'theme-color',
      media: '(prefers-color-scheme: light)',
      content: '#ffffff',
    },
    {
      name: 'theme-color',
      media: '(prefers-color-scheme: dark)',
      content: '#18181b',
    },
    { name: 'msapplication-TileColor', content: '#18181b' },
  ],
  link: [
    { rel: 'preload', href: '/fonts/Inter-roman.var.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'icon', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#18181b' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
  ],
})

if (process.client) {
  try {
    // If we are logged in:
    const { data: workspaces }: { data: Workspace[] } = await axios.get('/workspaces')
    localStorage.setItem('isLoggedIn', 'true')

    // If we have a recent workspace in storage, go there
    const storageLastWorkspace = process.client && localStorage.getItem('last-workspace')

    if (storageLastWorkspace && workspaces.map(({ slug }) => slug).includes('storageLastWorkspace'))
      router.push(`/${storageLastWorkspace}/drafts`)
    else {
      // Go to the most recent workspace in the list. If none exists, go to onboarding
      if (workspaces.length > 0) router.push(`/${(workspaces.at(-1) as Workspace).slug}/drafts`)
      else router.push(`/welcome`)
    }
  } catch (_) {}
}

watchForDarkMode()
</script>

<template>
  <section class="mx-auto w-full px-4 sm:max-w-sm">
    <div class="mb-6 mt-16 flex justify-center">
      <AuthenticationCardLogo />
    </div>

    <slot />
  </section>
</template>
