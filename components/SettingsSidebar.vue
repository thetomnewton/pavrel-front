<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { Team, Workspace } from '../types'
import { Bars3Icon } from '@heroicons/vue/24/solid'
import vClickOutside from '../directives/click-outside'
import { useRoute, useRouter } from 'vue-router'
import { PlusIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])

const store = useStore()
const router = useRouter()

const currentWorkspace = computed<Workspace>(() => store.getters['base/currentWorkspace'])
const { currentWorkspaceTeams } = useTeams()
const { user } = useUsers()

const myTeams = computed(() =>
  currentWorkspaceTeams.value.filter(team => !team.personal && team.users.find(({ id }) => id === user.value.id))
)
const notMyTeams = computed(() =>
  currentWorkspaceTeams.value.filter(team => !team.personal && !team.users.find(({ id }) => id === user.value.id))
)

const createTeamModalOpen = ref(false)

function closeViaOutsideClick() {
  if (props.open) emit('close')
}

const route = useRoute()

function openNewTeamSettings(team: Team) {
  router.push(`/${currentWorkspace.value.slug}/settings/teams/${team.slug}`)
}

watch(
  () => route.path,
  () => {
    emit('close')
  }
)
</script>

<template>
  <nav
    class="fixed top-0 left-0 bottom-0 z-10 min-w-[200px] border-r border-slate-150 bg-white px-4 py-4 text-slate-700 shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 md:static md:shadow-none"
    :class="{ 'pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100': !open }"
    v-click-outside="closeViaOutsideClick"
  >
    <div class="-mx-4 mb-2 flex px-2 md:hidden">
      <div class="px-4 pb-2 pt-[2px]" @click="emit('close')">
        <Bars3Icon class="h-5 w-5 text-slate-800 dark:text-zinc-400" />
      </div>
    </div>

    <div class="mb-6">
      <NuxtLink
        :to="`/${currentWorkspace?.slug}/drafts`"
        class="flex cursor-default items-center text-[18px] font-medium"
      >
        <ChevronLeftIcon class="mr-2 mt-px h-[14px] w-[14px] text-slate-600 dark:text-zinc-300" />
        <span>Settings</span>
      </NuxtLink>
    </div>

    <div class="space-y-6" v-if="currentWorkspace">
      <div>
        <div class="mb-[2px] ml-2 text-[.8125rem] font-medium text-slate-500 dark:text-zinc-400">Account</div>

        <NuxtLink
          :to="`/${currentWorkspace.slug}/user/profile`"
          class="mb-px block w-full cursor-default rounded px-2 py-1 text-[14px] font-medium hover:bg-slate-150 dark:hover:bg-zinc-800"
          :class="{
            'bg-slate-150 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200':
              $route.fullPath === `/${currentWorkspace.slug}/user/profile`,
          }"
        >
          My account
        </NuxtLink>

        <NuxtLink
          :to="`/${currentWorkspace.slug}/user/preferences`"
          class="mb-px block w-full cursor-default rounded px-2 py-1 text-[14px] font-medium hover:bg-slate-150 dark:hover:bg-zinc-800"
          :class="{
            'bg-slate-150 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200':
              $route.fullPath === `/${currentWorkspace.slug}/user/preferences`,
          }"
        >
          Preferences
        </NuxtLink>
      </div>

      <div>
        <div class="mb-[2px] ml-2 text-[.8125rem] font-medium text-slate-500 dark:text-zinc-400">Workspace</div>

        <NuxtLink
          :to="`/${currentWorkspace.slug}/settings/general`"
          class="mb-px block w-full cursor-default rounded px-2 py-1 text-[14px] font-medium hover:bg-slate-150 dark:hover:bg-zinc-800"
          :class="{
            'bg-slate-150 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200':
              $route.fullPath === `/${currentWorkspace.slug}/settings/general`,
          }"
        >
          General
        </NuxtLink>

        <NuxtLink
          :to="`/${currentWorkspace.slug}/settings/members`"
          class="mb-px block w-full cursor-default rounded px-2 py-1 text-[14px] font-medium hover:bg-slate-150 dark:hover:bg-zinc-800"
          :class="{
            'bg-slate-150 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200':
              $route.fullPath === `/${currentWorkspace.slug}/settings/members`,
          }"
        >
          Members
        </NuxtLink>

        <NuxtLink
          :to="`/${currentWorkspace.slug}/settings/plans`"
          class="mb-px block w-full cursor-default rounded px-2 py-1 text-[14px] font-medium hover:bg-slate-150 dark:hover:bg-zinc-800"
          :class="{
            'bg-slate-150 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200':
              $route.fullPath === `/${currentWorkspace.slug}/settings/plans`,
          }"
        >
          Upgrade
        </NuxtLink>

        <NuxtLink
          :to="`/${currentWorkspace.slug}/settings/billing`"
          class="mb-px block w-full cursor-default rounded px-2 py-1 text-[14px] font-medium hover:bg-slate-150 dark:hover:bg-zinc-800"
          :class="{
            'bg-slate-150 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200':
              $route.fullPath === `/${currentWorkspace.slug}/settings/billing`,
          }"
        >
          Billing
        </NuxtLink>
      </div>

      <div>
        <div class="mb-[2px] ml-2 text-[.8125rem] font-medium text-slate-500 dark:text-zinc-400">Your teams</div>

        <template v-for="team in myTeams">
          <NuxtLink
            :to="`/${currentWorkspace.slug}/settings/teams/${team.slug}`"
            class="mb-px block w-full max-w-[175px] cursor-default truncate rounded px-2 py-1 text-sm font-medium hover:bg-slate-150 dark:hover:bg-zinc-800"
            :class="{
              'bg-slate-150 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200':
                $route.fullPath === `/${currentWorkspace.slug}/settings/teams/${team.slug}`,
            }"
          >
            {{ team.name }}
          </NuxtLink>
        </template>

        <div
          class="mt-1 flex cursor-default items-center rounded px-2 py-1 text-sm font-medium hover:bg-slate-150 dark:hover:bg-zinc-800"
          @click="createTeamModalOpen = true"
        >
          <PlusIcon class="mr-1.5 h-4 w-4" />
          <span>New team</span>
        </div>
      </div>

      <div v-if="notMyTeams?.length">
        <div class="mb-[2px] ml-2 text-[.8125rem] font-medium text-slate-500 dark:text-zinc-400">Other teams</div>

        <template v-for="team in notMyTeams">
          <NuxtLink
            :to="`/${currentWorkspace.slug}/settings/teams/${team.slug}`"
            class="mb-px block w-full cursor-default rounded px-2 py-1 text-[14px] font-medium hover:bg-slate-150 dark:hover:bg-zinc-800"
            :class="{
              'bg-slate-150 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200':
                $route.fullPath === `/${currentWorkspace.slug}/settings/teams/${team.slug}`,
            }"
          >
            {{ team.name }}
          </NuxtLink>
        </template>
      </div>
    </div>

    <CreateTeamModal
      v-if="currentWorkspace"
      :open="createTeamModalOpen"
      @close="createTeamModalOpen = false"
      @saved="openNewTeamSettings"
    />
  </nav>
</template>
