<script setup lang="ts">
import { ref } from 'vue'
import { Idea, WorkspaceNotification } from '../types'
import IdeaContent from './IdeaContent.vue'
import { Bars3BottomRightIcon } from '@heroicons/vue/24/outline'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, EnvelopeOpenIcon } from '@heroicons/vue/24/solid'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import FavoriteButton from './FavoriteButton.vue'
import IdeaEditButton from './IdeaEditButton.vue'
import IdeaActionsDropdown from './IdeaActionsDropdown.vue'

defineEmits(['back'])

const props = defineProps<{
  idea: Idea
  notification: WorkspaceNotification
}>()

const { currentWorkspace } = useWorkspace()
const { getTeamFromIdea } = useTeams()
const { markNotificationAsRead, markNotificationAsUnread, deleteNotification } = useInbox()
const { userIsSubscribedTo, toggleIdeaSubscription } = useIdeaSubscriptions()
const { isFavorite, toggleFavorite } = useIdeaFavorites()

const hasSidebar = ref(false)
const showSidebar = ref(true)

function toggleNotificationRead() {
  if (props.notification.read_at == null) markNotificationAsRead(props.notification)
  else markNotificationAsUnread(props.notification)
}

function showViewHistory() {
  // todo: show view history modal
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex min-h-[53px] items-center border-b border-slate-100 px-6 py-2 leading-[36px] dark:border-zinc-800">
      <div class="mr-3 flex items-center">
        <button
          class="-ml-2 mr-2 inline-flex cursor-default appearance-none items-center whitespace-nowrap rounded-full bg-white p-2 text-[.8125rem] font-medium leading-5 text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:active:bg-zinc-700/30 lg:hidden"
          @click="$emit('back')"
        >
          <ArrowLeftIcon class="h-4 w-4" />
        </button>

        <button
          type="button"
          class="inline-flex cursor-default appearance-none items-center whitespace-nowrap rounded border border-slate-300 bg-white px-[10px] py-1 text-[.8125rem] font-medium leading-5 text-slate-700 active:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300 dark:active:bg-zinc-700/30"
          @click="toggleNotificationRead"
        >
          <template v-if="notification.read_at == null">
            <EnvelopeOpenIcon class="mr-[6px] h-4 w-4 text-slate-600 dark:text-zinc-400" />
            <span>Mark as read</span>
          </template>

          <template v-else>
            <EnvelopeIcon class="mr-[6px] h-4 w-4 text-slate-600 dark:text-zinc-400" />
            <span>Mark unread</span>
          </template>
        </button>

        <button
          type="button"
          class="ml-3 inline-flex cursor-default appearance-none items-center whitespace-nowrap rounded border border-slate-300 bg-white px-[10px] py-1 text-[.8125rem] font-medium leading-5 text-slate-700 active:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300 dark:active:bg-zinc-700/30"
          @click="toggleIdeaSubscription(idea)"
        >
          <template v-if="userIsSubscribedTo(idea)">
            <EyeSlashIcon class="mr-[6px] h-4 w-4 text-slate-600 dark:text-zinc-400" />
            <span>Unsubscribe</span>
          </template>

          <template v-else>
            <EyeIcon class="mr-[6px] h-4 w-4 text-slate-600 dark:text-zinc-400" />
            <span>Subscribe</span>
          </template>
        </button>

        <button
          type="button"
          class="group ml-3 inline-flex cursor-default appearance-none items-center whitespace-nowrap rounded border border-slate-300 bg-white px-[10px] py-1 text-[.8125rem] font-medium leading-5 text-slate-700 active:border-rose-700 active:bg-rose-50 active:text-rose-800 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300 dark:active:bg-rose-700 dark:active:text-white"
          @click="deleteNotification(notification)"
        >
          <XMarkIcon class="mr-[6px] h-4 w-4 text-rose-700 dark:group-active:text-rose-300" />
          <span>Delete notification</span>
        </button>
      </div>

      <div class="ml-auto flex">
        <span
          class="rounded p-[6px] active:bg-slate-200 dark:active:bg-zinc-700/30"
          :class="[
            hasSidebar
              ? 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
              : 'text-slate-600 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-300',
          ]"
          @click="hasSidebar = !hasSidebar"
        >
          <Bars3BottomRightIcon class="h-5 w-5" />
        </span>
      </div>
    </div>

    <IdeaContent
      :idea="idea"
      :team-id="idea.team_id"
      :has-sidebar="hasSidebar"
      :sidebar-open="showSidebar"
      :hide-sidebar-close-icon="true"
      class="flex-1 overflow-hidden"
    >
      <div class="mx-6 flex items-center border-b border-slate-100 py-2 leading-[36px] dark:border-zinc-800">
        <div class="flex items-center">
          <span class="cursor-default">{{ getTeamFromIdea(idea)?.name ?? 'N/A' }}</span>
          <span class="mx-1 cursor-default">›</span>
          <span class="cursor-default whitespace-nowrap"
            >{{ getTeamFromIdea(idea)?.slug ?? 'N/A' }}-{{ idea.team_idea_id }}</span
          >
        </div>

        <div class="ml-4">
          <FavoriteButton :on="isFavorite(idea)" @click="toggleFavorite(idea)" />
        </div>

        <div class="ml-auto flex items-center">
          <IdeaEditButton
            :url="`/${currentWorkspace?.slug}/ideas/${getTeamFromIdea(idea)?.slug}-${idea.team_idea_id}/edit`"
          />
          <IdeaActionsDropdown :idea="idea" @view-history="showViewHistory" />
        </div>
      </div>
    </IdeaContent>
  </div>
</template>
