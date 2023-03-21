<script setup lang="ts">
import { IdeaActivity } from '../types'

defineProps<{
  activity: IdeaActivity
}>()

const { fromNow, initiatorName } = useIdeaActivities()
const { getUserById } = useUsers()
</script>

<template>
  <div class="flex items-center">
    <div class="mr-3 flex w-5 justify-center">
      <img
        class="min-w-4 h-4 w-4 rounded-full object-cover"
        :src="getUserById(activity.initiator_id)?.profile_photo_url"
      />
    </div>
    <div class="cursor-default text-[.8125rem] leading-5 text-slate-500 dark:text-zinc-400">
      <span class="font-medium text-slate-800 dark:text-zinc-300">{{ initiatorName(activity) }}</span> created the idea.
      <span class="ml-2">
        {{ fromNow(activity.created_at) }}
      </span>
    </div>
  </div>
</template>
