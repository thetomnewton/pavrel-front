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

const workspaceLogoUploadInput = ref<HTMLInputElement | null>(null)

const workspaceName = ref(currentWorkspace.value?.name ?? '')
const saving = ref(false)

const newLogoPreview = ref<string | null>(null)
const newLogoSaveProgress = ref<'idle' | 'processing'>('idle')

function triggerFileOpen() {
  workspaceLogoUploadInput.value?.click()
}

function saveNewLogo() {
  newLogoSaveProgress.value = 'processing'

  if (!newLogoPreview.value) return

  api
    .post(`/workspaces/${currentWorkspace.value.id}/logo`, { logo: newLogoPreview.value })
    .then(() => {
      store.commit('base/showToast', { type: 'workspace-logo-update', data: {} })
    })
    .finally(() => {
      newLogoSaveProgress.value = 'idle'
    })
}

function cancelNewLogoUpload() {
  newLogoPreview.value = null
  if (workspaceLogoUploadInput.value) workspaceLogoUploadInput.value.value = ''
}

function updatePhotoPreview() {
  const img = workspaceLogoUploadInput.value?.files?.[0]

  if (!img) return

  const reader = new FileReader()

  reader.onload = e => {
    newLogoPreview.value = e.target?.result as string
  }

  reader.readAsDataURL(img)
}

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
    .catch(() => {})
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
          <Button :disabled="saving">Save</Button>
        </div>
      </form>
    </section>

    <section class="mt-10">
      <h2 class="mb-4 cursor-default text-lg font-medium">Workspace Logo</h2>

      <div class="mb-4 text-sm text-slate-700 dark:text-zinc-300">
        This image is used to identify your workspace in Pavrel.
      </div>

      <input type="file" ref="workspaceLogoUploadInput" accept="image/*" class="hidden" @change="updatePhotoPreview" />

      <div class="flex items-center space-x-6">
        <WorkspaceFallbackLogo v-if="!currentWorkspace.logo_path && !newLogoPreview" :size="64">
          {{ currentWorkspace.initial }}
        </WorkspaceFallbackLogo>

        <img
          v-else-if="currentWorkspace.logo_path && !newLogoPreview"
          :src="currentWorkspace.logo_path"
          :alt="currentWorkspace.name"
          class="inline-block h-[84px] w-[84px] rounded-lg"
        />

        <img
          class="inline-block h-[84px] w-[84px] rounded-lg"
          title="Workspace logo"
          :alt="currentWorkspace.name"
          :src="newLogoPreview"
          v-else-if="newLogoPreview"
        />

        <div>
          <button
            type="button"
            @click="triggerFileOpen"
            class="cursor-default whitespace-nowrap rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium leading-5 text-slate-800 shadow-sm transition active:translate-y-px active:bg-slate-50 active:shadow-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:transition-none dark:active:bg-zinc-800"
          >
            Upload new logo
          </button>

          <div class="mt-1.5 text-xs text-slate-500 dark:text-zinc-400">Recommended size is 280 x 280 pixels.</div>
        </div>
      </div>

      <div v-if="newLogoPreview" class="mt-4 space-x-3">
        <Button type="button" @click="saveNewLogo" :disabled="newLogoSaveProgress === 'processing'"
          >Save new logo</Button
        >

        <button
          type="button"
          @click="cancelNewLogoUpload"
          class="cursor-default whitespace-nowrap rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium leading-5 text-slate-800 shadow-sm transition active:translate-y-px active:bg-slate-50 active:shadow-none disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:transition-none dark:active:bg-zinc-800"
          :disabled="newLogoSaveProgress === 'processing'"
        >
          Cancel
        </button>
      </div>
    </section>
  </div>
</template>
