<script setup lang="ts">
import { TagIcon } from '@heroicons/vue/20/solid'
import { Idea, Label, LabelAddedActivity, LabelRemovedActivity, Team } from '../types'
import { useStore } from 'vuex'

const props = defineProps<{
  activity: LabelAddedActivity | LabelRemovedActivity
}>()

const store = useStore()
const { getTeamFromIdea } = useTeams()

const { fromNow, initiatorName } = useIdeaActivities()

const relevantIdea = computed<Idea | undefined>(() =>
  (store.state.base.ideas as Idea[]).find(({ id }) => id === props.activity.idea_id)
)
const relevantTeam = computed<Team | undefined>(() =>
  relevantIdea.value ? getTeamFromIdea.value(relevantIdea.value) : undefined
)

const label = computed<Label | undefined>(() =>
  (relevantTeam.value?.labels ?? []).find(label => label.id === props.activity.meta.labelId)
)
</script>

<template>
  <div class="flex items-center">
    <div class="mr-3 flex w-5 justify-center">
      <TagIcon class="h-4 w-4 text-slate-500 dark:text-zinc-400" />
    </div>

    <div class="flex cursor-default items-center text-[.8125rem] leading-5 text-slate-500 dark:text-zinc-400">
      <span class="mr-1 font-medium text-slate-800 dark:text-zinc-300">{{ initiatorName(activity) }}</span>
      {{ activity.type === 'label.added' ? 'added' : 'removed' }} label
      <span class="ml-1.5 inline-flex items-center space-x-1 font-medium text-slate-800 dark:text-zinc-300">
        <span class="h-1 w-1 rounded-full" :style="{ backgroundColor: label?.color ?? '#e2e8f0' }"></span>
        <span :class="{ 'line-through': activity.type === 'label.removed' }">{{ label?.name ?? 'Unknown' }}</span></span
      >.
      <span class="ml-2">{{ fromNow(activity.created_at) }}</span>
    </div>
  </div>
</template>
