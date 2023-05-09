<script setup lang="ts">
import { useStore } from 'vuex'
import { getSsrColorTheme, watchForDarkMode } from '~/helpers/dark'
import { dialogState } from '~/helpers/dialog-state'

watchForDarkMode()
useCsrf()

useHead({
  htmlAttrs: { class: getSsrColorTheme() ?? '' },
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

const keyupListener = (e: KeyboardEvent) => {
  if (dialogState.ideaPreviewOpen || dialogState.ideaQuickCreateOpen || dialogState.modalOpen) return
  if (e.key !== '?' && e.key !== 'Escape') return

  if (
    // @ts-ignore
    ['input', 'textarea'].includes(e.target?.localName) ||
    // @ts-ignore
    e.target?.attributes?.contenteditable
  )
    return

  if (e.key === '?') dialogState.helpModalOpen = !dialogState.helpModalOpen
  else if (e.key === 'Escape') dialogState.helpModalOpen = false
}

onMounted(() => {
  document.addEventListener('keyup', keyupListener)
})

onUnmounted(() => {
  document.removeEventListener('keyup', keyupListener)
})
</script>

<template>
  <div>
    <Transition leave-active-class="transition" leave-to-class="opacity-0 pointer-events-none">
      <Overlay v-if="!workspaceContentLoaded" :error="workspaceContentError" />
    </Transition>

    <ClientOnly>
      <div
        v-if="workspaceContentLoaded"
        class="fixed inset-0 z-0 flex h-full w-full flex-col overflow-hidden bg-white dark:bg-zinc-900"
      >
        <div class="flex h-full min-h-full w-full flex-1 overflow-hidden">
          <Sidebar />
          <Toast />

          <HelpSlideover :open="dialogState.helpModalOpen" @close="dialogState.helpModalOpen = false" />

          <main class="flex min-w-0 flex-1 flex-col">
            <slot />
          </main>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
