<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

definePageMeta({
  layout: 'settings',
  middleware: 'auth',
})

const route = useRoute()
const { getWorkspaceFromSlug } = useWorkspace()
const { users } = useUsers()

const workspace = getWorkspaceFromSlug(route.params.workspaceSlug as string)

const modalOpen = ref(false)

useHead({
  title: `Members › ${workspace?.name}`,
})

function niceDate(date: string) {
  return dayjs(date).format('MMM DD YYYY')
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
        <div v-for="user in users" :key="user.id" class="flex items-start">
          <img class="mr-3 h-6 w-6 min-w-[1.5rem] rounded-full object-cover" :src="user.profile_photo_url" />

          <div class="flex-1 lg:flex lg:items-center">
            <div class="min-w-[35%] cursor-default text-[14px] font-medium">{{ user.name }}</div>
            <div class="cursor-default text-[.8125rem] text-slate-600 dark:text-zinc-400 lg:ml-2">{{ user.email }}</div>
            <div class="text-[.8125rem] text-slate-600 dark:text-zinc-400 lg:ml-auto">
              Since {{ niceDate(user.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <WorkspaceInviteModal :open="modalOpen" @close="modalOpen = false" :workspace="workspace" />
  </div>
</template>
