<script setup lang="ts">
import { ref } from 'vue'
import api from '../../../api'
import { useStore } from 'vuex'

definePageMeta({
  layout: 'settings',
  middleware: 'auth',
})

const store = useStore()
const { currentWorkspace } = useWorkspace()

const workspaceName = ref(currentWorkspace.value?.name ?? '')
const saving = ref(false)

useHead({
  title: `Settings › ${workspaceName.value}`,
})

const attemptWorkspaceNameUpdate = () => {
  saving.value = true

  api
    .post(`/workspaces/${currentWorkspace.value.id}`, { name: workspaceName.value })
    .then(() => {
      const newWorkspace = { ...currentWorkspace.value, ...{ name: workspaceName.value } }
      store.commit('base/updateWorkspace', newWorkspace)
      store.commit('base/showToast', {
        type: 'workspace-update',
        data: newWorkspace,
      })
    })
    .catch(() => {
      //
    })
    .finally(() => {
      saving.value = false
    })
}
</script>

<template>
  <div class="mx-auto max-w-xl px-6 py-10 lg:px-8">
    <div class="mb-8 border-b border-slate-200 pb-8 dark:border-zinc-700">
      <div class="cursor-default text-[22px] font-medium">{{ currentWorkspace.name }} Workspace</div>
    </div>

    <section>
      <h2 class="mb-4 cursor-default text-lg font-medium">Basic details</h2>

      <form @submit.prevent="attemptWorkspaceNameUpdate">
        <div>
          <FormLabel for="workspaceName" class="mb-1 block">Workspace name</FormLabel>

          <div>
            <FormTextInput id="workspaceName" v-model="workspaceName" />
          </div>
        </div>

        <div class="mt-4">
          <Button :disabled="saving"> Save </Button>
        </div>
      </form>
    </section>
  </div>
</template>
