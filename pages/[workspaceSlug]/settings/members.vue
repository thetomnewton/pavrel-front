<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { User } from '@/types'

definePageMeta({
  layout: 'settings',
  middleware: 'auth',
})

const route = useRoute()
const { getWorkspaceFromSlug } = useWorkspace()
const { user, users } = useUsers()

const workspace = getWorkspaceFromSlug(route.params.workspaceSlug as string)

const modalOpen = ref(false)

useHead({
  title: `Members › ${workspace?.name}`,
})

function niceDate(date: string) {
  return dayjs(date).format('MMM DD YYYY')
}

const removeUserModalOpen = ref(false)
const userToRemove = ref<User>()

function openRemoveUserFromWorkspaceModal(user: User) {
  removeUserModalOpen.value = true
  userToRemove.value = user
}

function openLeaveWorkspaceModal() {
  //
}

function closeRemoveUserModal() {
  removeUserModalOpen.value = false
  userToRemove.value = undefined
}
</script>

<template>
  <div class="mx-auto max-w-3xl py-10 px-6 lg:px-8" v-if="workspace">
    <div class="mb-8 border-b border-slate-200 pb-8 dark:border-zinc-700">
      <div class="text-[22px] font-medium">Members</div>
    </div>

    <div>
      <div class="mb-5 items-center md:flex">
        <div class="mb-3 md:mb-0">
          <div class="mb-[4px] text-[15px] font-medium">Workspace members</div>
          <p class="text-[.8125rem] text-slate-600 dark:text-zinc-400">
            Manage who has access to the {{ workspace.name }} workspace.
          </p>
        </div>

        <span class="ml-auto">
          <Button @click.native="modalOpen = true"> Invite people </Button>
        </span>
      </div>

      <div class="space-y-4">
        <div v-for="workspaceUser in users" :key="workspaceUser.id" class="flex items-center">
          <div class="mr-4">
            <img class="block h-8 w-8 min-w-[2rem] rounded-full object-cover" :src="workspaceUser.profile_photo_url" />
          </div>

          <div class="mr-6">
            <div class="truncate lg:max-w-[200px]">{{ workspaceUser.name }}</div>
            <div class="text-[13px] leading-5 text-slate-600 dark:text-zinc-400">{{ workspaceUser.email }}</div>
          </div>

          <div class="ml-auto">
            <Listbox
              class="min-w-[150px]"
              disabled
              :options="[
                { value: 'member', text: 'Member' },
                { value: 'admin', text: 'Admin' },
              ]"
              :value="workspaceUser.pivot.role"
            ></Listbox>
          </div>

          <div class="ml-6 max-w-[180px]">
            <div class="text-[.8125rem] text-slate-600 dark:text-zinc-400">
              Since {{ niceDate(workspaceUser.created_at) }}
            </div>
          </div>

          <div class="ml-6" v-if="workspace.pivot.user_id === user.id && workspace.pivot.role === 'admin'">
            <template v-if="workspaceUser.id !== user.id">
              <button
                @click="openRemoveUserFromWorkspaceModal(workspaceUser)"
                class="min-w-[55px] cursor-pointer appearance-none text-left text-sm font-medium text-red-500 hover:underline"
              >
                Remove
              </button>
            </template>

            <template v-else>
              <button
                @click="openLeaveWorkspaceModal"
                class="min-w-[55px] cursor-pointer appearance-none text-left text-sm font-medium text-red-500 hover:underline"
              >
                Leave
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <WorkspaceInviteModal :open="modalOpen" @close="modalOpen = false" :workspace="workspace" />
    <RemoveFromWorkspaceModal :open="removeUserModalOpen" :user="userToRemove" @close="closeRemoveUserModal" />
  </div>
</template>
