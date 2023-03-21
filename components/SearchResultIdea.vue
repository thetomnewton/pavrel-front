<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Idea, Team } from '../types'
import StatusIcon from './StatusIcon.vue'

const props = defineProps<{
  idea: Idea
  identifierWidth: string
}>()

const emit = defineEmits(['opened'])

const store = useStore()

const getTeamFromIdea = computed<(idea: Idea) => Team>(() => store.getters['base/getTeamFromIdea'])
const team = computed<Team>(() => getTeamFromIdea.value(props.idea))

const statusCategory = computed(() => team.value?.statuses.find(({ id }) => id === props.idea.status_id)?.category)

function openIdea() {
  emit('opened')
}
</script>

<template>
  <div
    @click="openIdea"
    class="flex w-full cursor-default items-center border-b border-slate-50 px-4 py-2 text-[.8125rem] leading-[29px] active:bg-slate-100 dark:border-zinc-700"
  >
    <span class="mr-[5px] whitespace-nowrap text-slate-500 dark:text-zinc-400" :style="{ minWidth: identifierWidth }"
      >{{ getTeamFromIdea(idea)?.slug }}-{{ idea.team_idea_id }}</span
    >
    <StatusIcon :category="statusCategory" />
    <span class="ml-2 truncate font-medium">{{ idea.title }}</span>
  </div>
</template>
