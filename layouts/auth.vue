<script setup lang="ts">
import { watchForDarkMode } from '~/helpers/dark'
import { Workspace } from '~~/types'
import { Ref } from 'vue'

const { api } = useApi()
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

const { data: workspaces, ...rest } = (await api('/workspaces')) as { data: Ref<Workspace[]> }
console.log(workspaces, rest)

// If we are logged in
if (workspaces.value) {
  // If we have a recent workspace in storage, go there
  const storageLastWorkspace = process.client && localStorage.getItem('last-workspace')

  if (storageLastWorkspace) router.push(`/${storageLastWorkspace}/drafts`)
  else {
    // Go to the most recent workspace in the list. If none exists, go to onboarding
    if (workspaces.value.length > 0) router.push(`/${(workspaces.value.at(-1) as Workspace).slug}/drafts`)
    else router.push(`/welcome`)
  }
}

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
