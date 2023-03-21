<script setup lang="ts">
import { computed } from 'vue'
import { StatusUpdateActivity, IdeaStatus } from '../types'
import StatusIcon from './StatusIcon.vue'
import dayjs from 'dayjs/esm'
import relative from 'dayjs/esm/plugin/relativeTime'

dayjs.extend(relative)

const props = defineProps<{
  activity: StatusUpdateActivity
}>()

const { fromNow, initiatorName } = useIdeaActivities()
const { currentTeam } = useTeams()

const oldStatus = computed<IdeaStatus | undefined>(() => {
  return currentTeam.value.statuses.find(({ id }) => id === props.activity.meta.prevStatusId)
})

const newStatus = computed<IdeaStatus | undefined>(() => {
  return currentTeam.value.statuses.find(({ id }) => id === props.activity.meta.newStatusId)
})
</script>

<template>
  <div class="flex items-center">
    <div class="flex w-8 justify-center pr-3">
      <template v-if="newStatus !== undefined">
        <StatusIcon :category="newStatus.category" />
      </template>
    </div>

    <div class="cursor-default text-[.8125rem] leading-5 text-slate-500 dark:text-zinc-400">
      <span class="font-medium text-slate-800 dark:text-zinc-300">{{ initiatorName(activity) }}</span> changed status
      from
      <span class="font-medium text-slate-800 dark:text-zinc-300">{{ oldStatus?.name ?? 'Unknown status' }}</span> to
      <span class="font-medium text-slate-800 dark:text-zinc-300">{{ newStatus?.name ?? 'Unknown status' }}</span
      >.
      <span class="ml-2">{{ fromNow(activity.created_at) }}</span>
    </div>
  </div>
</template>
