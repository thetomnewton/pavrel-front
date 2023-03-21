<script setup lang="ts">
import { useStore } from 'vuex'

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

loadWorkspaceContent()
</script>

<template>
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
</template>
