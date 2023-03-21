<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import api from '../../api'
import { nextTick, onMounted, ref } from 'vue'
import { Workspace } from '../../types'
import { useStore } from 'vuex'

definePageMeta({
  layout: 'blank',
})

const store = useStore()

const showForm = ref(false)
const saving = ref(false)
const newWorkspace = ref({
  name: '',
})
const focusInput = ref(false)

onMounted(() => {
  showForm.value = true
  nextTick(() => (focusInput.value = true))
})

function back() {
  history.back()
}

async function storeWorkspace() {
  saving.value = true

  const { data } = await api.post('/workspaces', newWorkspace.value)

  let workspaces: Workspace[] = cloneDeep(store.state.base.workspaces)

  if (Array.isArray(workspaces)) workspaces.push(data)
  else workspaces = [data]

  store.commit('base/setWorkspaces', workspaces)

  location.href = `/${data.slug}/drafts`
}
</script>

<style scoped>
.v-enter-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.v-enter-from {
  transform: translateY(-24px) scale(0.98);
  opacity: 0;
}
</style>

<template>
  <div class="absolute inset-0 z-50 flex min-h-screen flex-col bg-white px-6 pb-6 pt-4 text-[15px] dark:bg-zinc-900">
    <div>
      <div
        class="-ml-2 inline-flex cursor-default items-center rounded py-2 pr-4 pl-3 text-[.8125rem] font-medium hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-zinc-800/70 dark:active:bg-zinc-800"
        @click="back"
      >
        <ChevronLeftIcon class="-ml-1 mr-1 h-4 w-4 text-slate-500 dark:text-zinc-400" />
        <span>Go back</span>
      </div>
    </div>

    <div class="flex h-full flex-1 items-center justify-center">
      <Transition>
        <div class="mb-[200px] w-full max-w-md" v-if="showForm">
          <div>
            <LogoColor class="mx-auto mb-4 h-12 w-12 md:mb-6" />
          </div>

          <h1 class="mb-4 text-center text-[20px] font-medium">Create a new workspace</h1>

          <p class="mb-5 text-center text-slate-600 dark:text-zinc-400">
            Create a new space for you and others to track, shape and collaborate on ideas.
          </p>

          <form @submit.prevent="storeWorkspace">
            <div class="mb-1">
              <FormLabel for="workspaceName">Workspace name</FormLabel>
            </div>

            <div class="mb-4">
              <FormTextInput id="workspaceName" :focus="focusInput" v-model="newWorkspace.name" required />
            </div>

            <div class="text-right">
              <BaseButton type="submit" button="primary" size="md" :disabled="saving"> Create workspace </BaseButton>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </div>
</template>
