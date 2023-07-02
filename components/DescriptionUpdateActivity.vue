<script setup lang="ts">
import { PencilIcon } from '@heroicons/vue/24/solid'
import { ClockIcon } from '@heroicons/vue/24/outline'
import { IdeaActivity, IdeaHistory } from '@/types'
import { useStore } from 'vuex'

const props = defineProps<{
  activity: IdeaActivity
}>()

const emit = defineEmits(['view-history'])

const store = useStore()

type Meta = { newDescriptionHash: string }

const relatedHistoryEntry = computed(() =>
  (store.state.base.ideaHistory as IdeaHistory[]).find(
    ({ idea_id, hash }) =>
      idea_id === props.activity.idea_id && hash === (props.activity.meta as Meta).newDescriptionHash
  )
)

const { fromNow, initiatorName } = useIdeaActivities()
</script>

<template>
  <div class="flex items-center">
    <div class="mr-3">
      <div class="flex w-5 justify-center">
        <PencilIcon class="h-[14px] w-[14px] text-slate-500 dark:text-zinc-400" />
      </div>
    </div>

    <div class="flex flex-1 cursor-default flex-wrap items-center text-[.8125rem] text-slate-500 dark:text-zinc-400">
      <span class="mr-1 font-medium text-slate-800 dark:text-zinc-300">{{ initiatorName(activity) }} </span>
      <span>updated the description.</span>

      <span class="ml-2">{{ fromNow(activity.created_at) }}</span>

      <button
        type="button"
        @click="emit('view-history', (activity.meta as Meta).newDescriptionHash)"
        v-if="!!relatedHistoryEntry"
        class="ml-auto inline-flex appearance-none items-center rounded bg-slate-150 px-1.5 py-px text-[13px] font-medium text-slate-700 dark:bg-zinc-600 dark:text-zinc-300"
      >
        <ClockIcon class="mr-1 h-4 w-4 stroke-2" />
        <span>View</span>
      </button>
    </div>
  </div>
</template>
