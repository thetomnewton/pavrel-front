<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { CheckCircleIcon, InformationCircleIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { Workspace } from '../types'

const store = useStore()
const { getTeamFromIdea } = useTeams()

const toastType = computed<string>(() => store.state.base.toastType)
const toastData = computed(() => store.state.base.toastData)
const toastVisible = computed<boolean>(() => store.state.base.toastVisible)
const currentWorkspace = computed<Workspace>(() => store.getters['base/currentWorkspace'])

const hideToast = () => store.commit('base/hideToast')
</script>

<template>
  <transition
    enter-from-class="opacity-0 translate-y-[20px]"
    enter-active-class="transition duration-300"
    enter-to-class="opacity-1 translate-y-0"
    leave-from-class="opacity-1 translate-y-0"
    leave-to-class="translate-y-[20px] opacity-0"
    leave-active-class="transition duration-500"
  >
    <div
      v-if="toastVisible && toastData"
      class="fixed bottom-[24px] left-[50%] z-50 w-full max-w-[min(400px,calc(100%-2rem))] translate-x-[-50%] rounded-md border border-slate-900 bg-slate-800 px-4 py-3 text-sm text-white shadow-md dark:border-zinc-900 dark:bg-zinc-800"
    >
      <span
        class="absolute top-0 right-0 z-10 rounded-tr bg-slate-800 pr-[10px] pt-3 pl-1 pb-1 text-slate-300 hover:text-slate-400 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-400"
        @click="hideToast"
      >
        <XMarkIcon class="h-4 w-4" />
      </span>

      <div v-if="toastType === 'idea-creation'">
        <div class="flex items-start">
          <CheckCircleIcon class="-ml-1 h-[22px] w-[22px] min-w-[22px] text-green-600" />
          <div class="ml-[10px]">
            <div>
              Idea created:
              <span>{{ getTeamFromIdea(toastData)?.slug }}-{{ toastData.team_idea_id }}</span
              >:
              <span>{{ toastData.title }}</span>
            </div>

            <div class="mt-1">
              <RouterLink
                :to="`/${currentWorkspace.slug}/ideas/${getTeamFromIdea(toastData)?.slug}-${toastData.team_idea_id}`"
                class="font-medium text-blue-400 hover:text-blue-300"
                @click="hideToast"
              >
                View idea
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div v-if="toastType === 'copy-clipboard'">
        <div class="flex items-start">
          <InformationCircleIcon class="-ml-1 h-[22px] w-[22px] min-w-[22px] text-slate-300" />

          <div class="ml-2">
            <div class="leading-6">{{ toastData }}</div>
          </div>
        </div>
      </div>

      <div v-if="toastType === 'trash-idea'">
        <div class="flex items-start">
          <TrashIcon class="-ml-1 h-[22px] w-[22px] min-w-[22px] text-red-500" />

          <div class="ml-2">
            <div class="leading-6">Idea deleted: {{ toastData.teamIdeaId }}: {{ toastData.title }}</div>
          </div>
        </div>
      </div>

      <div v-if="toastType === 'workspace-update'">
        <div class="flex items-start">
          <CheckCircleIcon class="-ml-1 h-[22px] w-[22px] min-w-[22px] text-green-600" />
          <div class="ml-[10px]">Workspace updated successfully</div>
        </div>
      </div>

      <div v-if="toastType === 'profile-update'">
        <div class="flex items-start">
          <CheckCircleIcon class="-ml-1 h-[22px] w-[22px] min-w-[22px] text-green-600" />
          <div class="ml-[10px]">Profile updated successfully</div>
        </div>
      </div>

      <div v-if="toastType === 'team-creation'">
        <div class="flex items-start">
          <CheckCircleIcon class="-ml-1 h-[22px] w-[22px] min-w-[22px] text-green-600" />
          <div class="ml-[10px]">
            Team <span class="font-medium">{{ toastData.name }}</span> created successfully
          </div>
        </div>
      </div>

      <div v-if="toastType === 'workspace-logo-update'">
        <div class="flex items-start">
          <CheckCircleIcon class="-ml-1 h-[22px] w-[22px] min-w-[22px] text-green-600" />
          <div class="ml-[10px]">Workspace logo updated successfully</div>
        </div>
      </div>

      <div v-if="toastType === 'workspace-logo-removal'">
        <div class="flex items-start">
          <CheckCircleIcon class="-ml-1 h-[22px] w-[22px] min-w-[22px] text-green-600" />
          <div class="ml-[10px]">Workspace logo removed successfully</div>
        </div>
      </div>
    </div>
  </transition>
</template>
