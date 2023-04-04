<script setup lang="ts">
import { useStore } from 'vuex'
import { watchForDarkMode } from '~/helpers/dark'

useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 dark:text-zinc-200' },
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
  ],
  link: [
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'icon', href: '/favicon.svg' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
  ],
})

const store = useStore()
const route = useRoute()
const router = useRouter()

const { loadWorkspaceContent } = useWorkspace()

const workspaceContentLoaded = computed(() => store.state.base.workspaceContentLoaded)
const workspaceContentError = computed(() => store.state.base.workspaceContentError)

onMounted(() => {
  if (workspaceContentLoaded.value) return

  if (!store.state.base.currentWorkspaceSlug)
    store.commit('base/setCurrentWorkspaceFromSlug', route.params.workspaceSlug ?? location.pathname.split('/')[1])

  loadWorkspaceContent()
    .then(() => {
      if (!store.state.base.workspaces.length && route.fullPath !== '/welcome') router.push('/welcome')
      else if (
        !store.state.base.teams.length &&
        route.fullPath !== `/${route.params.workspaceSlug}/welcome` &&
        route.params.workspaceSlug
      )
        router.push(`/${route.params.workspaceSlug}/welcome`)
    })
    .catch(() => router.push('/login'))
})

watchForDarkMode()
</script>

<template>
  <div>
    <Transition leave-active-class="transition" leave-to-class="opacity-0 pointer-events-none">
      <Overlay v-if="!workspaceContentLoaded" :error="workspaceContentError" />
    </Transition>

    <div
      v-if="workspaceContentLoaded"
      class="fixed inset-0 z-0 flex h-full w-full flex-col overflow-hidden bg-white dark:bg-zinc-900"
    >
      <div class="flex h-full min-h-full w-full flex-1 overflow-hidden">
        <Sidebar />
        <Toast />

        <main class="flex min-w-0 flex-1 flex-col">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
