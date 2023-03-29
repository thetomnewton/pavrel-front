<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import IdeaBody from './IdeaBody.vue'
import IdeaActivity from './IdeaActivity.vue'
import IdeaContentSidebar from './IdeaContentSidebar.vue'
import { Idea, Team } from '../types'
import IdeaUpvoter from './IdeaUpvoter.vue'

const props = defineProps<{
  idea: Idea
  sidebarOpen: boolean
  hasSidebar: boolean
  teamId: string
  contentClasses?: string
  hideSidebarCloseIcon?: boolean
}>()

const store = useStore()

const { ideaUpvoteCount, isIdeaUpvoted, toggleUpvoteIdea } = useIdeaUpvotes()

const { currentWorkspace } = useWorkspace()
const currentWorkspaceTeams = computed<Team[]>(() => store.getters['base/currentWorkspaceTeams'])

const team = computed<Team | undefined>(() =>
  currentWorkspaceTeams.value?.find((team: Team) => team.id === props.teamId)
)
</script>

<template>
  <div v-if="idea" class="relative flex" v-bind="$attrs">
    <section class="flex min-w-0 flex-1 flex-col">
      <div class="text-[.8125rem] font-medium">
        <slot />
      </div>

      <div class="flex-1 overflow-auto" :class="contentClasses">
        <div class="mx-auto max-w-4xl">
          <IdeaBody :idea="idea" class="min-h-[300px]" />
          <div class="mx-5 my-5">
            <IdeaUpvoter
              :count="ideaUpvoteCount(idea)"
              :is-upvoted="isIdeaUpvoted(idea)"
              @upvote="toggleUpvoteIdea(idea)"
            />
          </div>

          <IdeaActivity :idea="idea" class="mx-5 mt-8 border-t border-slate-150 pt-8 dark:border-zinc-800" />
        </div>
      </div>
    </section>

    <IdeaContentSidebar
      v-if="hasSidebar ?? true"
      :idea="idea"
      :sidebar-open="sidebarOpen"
      :hide-menu-close-icon="hideSidebarCloseIcon"
      @status-update="$emit('status-update', $event)"
      @add-label="$emit('add-label', $event)"
      @remove-label="$emit('remove-label', $event)"
      @close-sidebar="$emit('close-sidebar')"
    />
  </div>

  <div v-else class="grid flex-1 place-items-center">
    <div class="mb-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
        aria-hidden="true"
        class="mx-auto h-[72px] w-[72px]"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        ></path>
      </svg>

      <div class="mt-3 text-center text-[.8125rem] font-medium text-slate-800">Idea not found</div>
      <div class="text-center">
        <RouterLink
          :to="`/${currentWorkspace.slug}/teams/${team?.slug}/ideas/all`"
          class="text-[.8125rem] font-medium text-blue-500 hover:underline"
          >Go to all ideas</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<style>
@import '../assets/css/prose.css';
</style>
