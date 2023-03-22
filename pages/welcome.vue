<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import api from '../api'

definePageMeta({
  layout: 'blank',
})

const store = useStore()
const router = useRouter()

const { workspaces } = useWorkspace()

const newWorkspace = ref(workspaces.value?.[0] ?? { name: '' })

const saving = ref(false)
const showForm = ref(false)
const focusInput = ref(false)

onMounted(() => {
  showForm.value = true
  nextTick(() => (focusInput.value = true))
})

async function saveWorkspace() {
  saving.value = true

  const { data } = await api.post('/workspaces', {
    name: newWorkspace.value.name,
  })

  store.commit('base/setWorkspaces', [data])

  router.push(`/${data.slug}/welcome`)
}

function logout() {
  api.post('/logout')

  setTimeout(() => {
    router.push('/login')
  }, 500)
}
</script>

<style scoped>
.v-enter-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.v-enter-from {
  transform: translateY(24px) scale(0.98);
  opacity: 0;
}
</style>

<template>
  <main class="absolute inset-0 z-50 flex min-h-screen justify-center bg-slate-50 dark:bg-zinc-900">
    <div class="mx-4 mt-4">
      <button
        @click="logout"
        class="inline-flex cursor-default items-center rounded bg-slate-100 px-3 py-[6px] text-[.8125rem] font-medium leading-5 text-slate-700 hover:text-slate-900 active:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:active:bg-zinc-700"
      >
        <span><ChevronLeftIcon class="mr-1 -ml-[2px] h-4 w-4" /></span>
        <span>Log out</span>
      </button>
    </div>

    <div class="mx-auto w-full max-w-md px-6 py-12 text-center md:py-[100px]">
      <Transition>
        <div v-if="showForm">
          <div>
            <LogoColor class="mx-auto mb-4 h-12 w-12 md:mb-8" />
          </div>

          <div>
            <h1 class="mb-3 text-[22px] font-medium text-slate-900 dark:text-zinc-200">Welcome to Pavrel</h1>
            <p class="mb-6 text-[15px] text-slate-700 dark:text-zinc-400">
              We're delighted to have you on board. Please enter the name of your first workspace below.
            </p>

            <form @submit.prevent="saveWorkspace">
              <div class="mb-4">
                <FormLabel for="firstWorkspaceName" class="mb-1 block text-left">Workspace name</FormLabel>

                <FormTextInput
                  id="firstWorkspaceName"
                  v-model="newWorkspace.name"
                  class="block w-full"
                  :focus="focusInput"
                  required
                />
              </div>

              <div class="flex justify-end">
                <BaseButton type="submit" button="primary" size="md" :disabled="saving"> Save & continue </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </main>
</template>
