<script setup lang="ts">
import { useStore } from 'vuex'
import { watchForDarkMode } from '~/helpers/dark'

useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 dark:text-zinc-200' },
})

const store = useStore()
const route = useRoute()
const router = useRouter()
const { setCurrentTeamFromLocalStorage } = useTeams()

const workspaceContentLoaded = computed(() => store.state.base.workspaceContentLoaded)
const workspaceContentError = computed(() => store.state.base.workspaceContentError)
const userCurrentWorkspaceTeams = computed(() => store.getters['base/userCurrentWorkspaceTeams'])

const loadAllWorkspaceContent = () => store.dispatch('base/loadAllWorkspaceContent')

const { addUserListener, addWorkspaceListeners } = useWebSockets()

if (!workspaceContentLoaded.value) loadAllWorkspaceContent()

watch(workspaceContentLoaded, value => {
  if (!value) return

  if (!store.state.base.teams.length && route.name !== 'workspace.onboarding' && route.params.workspaceSlug)
    router.push({ path: `/${route.params.workspaceSlug}/welcome` })
})

function loadWorkspaceContent() {
  if (workspaceContentLoaded.value) return

  loadAllWorkspaceContent().then(() => {
    addUserListener()
    addWorkspaceListeners()
    setCurrentTeamFromLocalStorage()

    // If the user is not part of any teams and the current route is
    // a workspace route, redirect them to workspace onboarding.
    const needsWorkspaceOnboarding =
      !userCurrentWorkspaceTeams.value.length &&
      route.meta.auth &&
      route.params.workspaceSlug &&
      route.name !== 'workspace.onboarding'

    if (needsWorkspaceOnboarding)
      router.push({ name: 'workspace.onboarding', params: { workspaceSlug: route.params.workspaceSlug } })
  })
}

watchForDarkMode()
</script>

<template>
  <div>
    <Head>
      <link rel="icon" href="/favicon.svg" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#18181b" />
    </Head>

    <Transition leave-active-class="transition" leave-to-class="opacity-0 pointer-events-none">
      <Overlay v-if="!workspaceContentLoaded" :error="workspaceContentError" />
    </Transition>

    <div
      v-if="workspaceContentLoaded"
      class="fixed inset-0 z-0 flex h-full w-full flex-col overflow-hidden bg-white dark:bg-zinc-900"
    >
      <div class="flex h-full min-h-full w-full flex-1 overflow-hidden">
        <Sidebar />

        <main class="flex min-w-0 flex-1 flex-col">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
