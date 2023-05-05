<script setup lang="ts">
import { getSsrColorTheme, watchForDarkMode } from '~/helpers/dark'
import api from '../api'
import { useStore } from 'vuex'

watchForDarkMode()

useHead({
  htmlAttrs: { class: getSsrColorTheme() ?? '' },
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
      href: '/icons/apple-icon-180.png',
    },
  ],
})

const store = useStore()
const ready = ref(false)

if (process.client) {
  api
    .all([api.get('/user'), api.get('/workspaces')])
    .then(([{ data: user }, { data: workspaces }]) => {
      // We're logged in
      store.commit('base/setUser', user)
      store.commit('base/setWorkspaces', workspaces)
      ready.value = true
    })
    .catch(() => {
      // We're not logged in
      ready.value = true
    })
}
</script>

<template>
  <Overlay v-if="!ready" :error="false" />

  <ClientOnly>
    <section v-if="ready" class="mx-auto w-full px-4 sm:max-w-sm">
      <div class="mb-6 mt-16 flex justify-center">
        <AuthenticationCardLogo />
      </div>

      <slot />
    </section>
  </ClientOnly>
</template>
