<script setup lang="ts">
import { PencilIcon } from '@heroicons/vue/24/solid'
import { TitleUpdateActivity } from '../types'

defineProps<{
  activity: TitleUpdateActivity
}>()

const { initiatorName, fromNow } = useIdeaActivities()
</script>

<template>
  <div class="flex items-center">
    <div class="mr-3">
      <div class="flex w-5 justify-center">
        <PencilIcon class="h-[14px] w-[14px] text-slate-500" />
      </div>
    </div>

    <div class="cursor-default text-[.8125rem] text-slate-500 dark:text-zinc-400">
      <span class="font-medium text-slate-800 dark:text-zinc-300">{{ initiatorName(activity) }}</span> updated the idea
      title from
      <span class="font-medium text-slate-800 line-through dark:text-zinc-300">{{ activity.meta.prevTitle }}</span> to
      <span class="font-medium text-slate-800 dark:text-zinc-300">{{ activity.meta.newTitle }}</span
      >.
      <span class="ml-2">{{ fromNow(activity.created_at) }}</span>
    </div>
  </div>
</template>
