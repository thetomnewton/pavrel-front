<script setup lang="ts">
import { computed } from 'vue'
import { Idea, WorkspaceNotification } from '../types'
import store from '../store'
import dayjs from 'dayjs/esm'
import relative from 'dayjs/esm/plugin/relativeTime'

const props = defineProps<{
  notification: WorkspaceNotification
  selected: boolean
}>()

dayjs.extend(relative)

function relativeTime(timeString: string) {
  return dayjs(timeString).fromNow(true)
}

const { getUserById } = useUsers()

const creator = computed(() => getUserById(props.notification.meta.creator_id))
const creatorName = computed(() => creator.value?.name || 'Unknown')

const { getTeamFromIdea } = useTeams()
const getCurrentTeamIdeaById = computed(() => store.getters['base/getCurrentTeamIdeaById'])

const notificationIdea = computed<Idea | null>(() => {
  if (props.notification.type === 'idea.update') {
    return getCurrentTeamIdeaById.value(props.notification.meta.source_id)
  } else if (props.notification.type === 'comment.mention') {
    const comment = store.state.base.ideaComments.find(({ id }) => id === props.notification.meta.source_id)
    if (!comment) return null
    return getCurrentTeamIdeaById.value(comment.parent_id)
  } else if (props.notification.type === 'idea.comment') {
    return getCurrentTeamIdeaById.value(props.notification.meta.parent_id)
  } else {
    return null
  }
})

const notificationTitle = computed(() => {
  return (
    {
      'idea.update': `${creatorName.value} made updates`,
      'comment.mention': `${creatorName.value} mentioned you`,
      'idea.comment': `${creatorName.value} commented`,
    }[props.notification.type] || ''
  )
})
</script>

<template>
  <div
    class="relative cursor-default border-l-2 border-b border-b-slate-100 px-6 py-3 dark:border-b-slate-800"
    :class="[
      selected
        ? 'border-l-blue-600 bg-blue-50 text-blue-800 dark:border-l-blue-500 dark:bg-blue-700 dark:text-blue-200'
        : 'border-l-transparent bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800',
    ]"
  >
    <span
      v-if="!notification.read_at"
      class="absolute left-[8px] top-[16px] h-[8px] w-[8px] rounded-full bg-blue-600"
    ></span>

    <div class="mb-2 flex min-w-0 items-center text-xs" :class="{ 'text-slate-700 dark:text-zinc-400': !selected }">
      <span v-if="notificationIdea" class="mr-4 truncate">
        {{ getTeamFromIdea(notificationIdea)?.slug }}-{{ notificationIdea.team_idea_id }}:
        {{ notificationIdea.title }}
      </span>

      <span class="ml-auto whitespace-nowrap">{{ relativeTime(notification.created_at) }}</span>
    </div>

    <div class="flex items-start">
      <span class="mr-2 text-[14px] font-medium leading-5">{{ notificationTitle }}</span>

      <img
        v-if="getUserById(notification.meta.creator_id) != undefined"
        class="min-w-5 ml-auto h-5 w-5 rounded-full object-cover"
        :src="getUserById(notification.meta.creator_id)?.profile_photo_url"
      />
    </div>
  </div>
</template>
