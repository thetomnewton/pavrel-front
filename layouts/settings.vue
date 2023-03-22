<script setup lang="ts">
import { watchForDarkMode } from '~/helpers/dark'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { Bars3Icon } from '@heroicons/vue/24/outline'

useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 dark:text-zinc-200' },
})

const store = useStore()
const { addUserListener, addWorkspaceListeners } = useWebSockets()

const workspaceContentLoaded = computed(() => store.state.base.workspaceContentLoaded)
const workspaceContentError = computed(() => store.state.base.workspaceContentError)

if (!workspaceContentLoaded.value)
  store.dispatch('base/loadAllWorkspaceContent').then(() => {
    addUserListener()
    addWorkspaceListeners()
  })

const sidebarOpen = ref(false)

watchForDarkMode()
</script>

<template>
  <Overlay v-if="!workspaceContentLoaded" :error="workspaceContentError" />

  <div v-if="workspaceContentLoaded" class="flex h-screen w-full flex-col bg-white dark:bg-zinc-900">
    <div class="flex items-center border-b border-slate-200 py-4 px-6 dark:border-zinc-700 md:hidden">
      <Bars3Icon class="h-5 w-5 text-slate-800 dark:text-zinc-400" @click="sidebarOpen = true" />

      <div class="ml-5">Settings</div>
    </div>

    <div class="flex h-full w-full flex-1">
      <SettingsSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

      <main class="min-w-0 flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
