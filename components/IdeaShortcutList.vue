<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Idea, Team } from '../types'
import { useStore } from 'vuex'
import StatusIcon from './StatusIcon.vue'

const props = defineProps<{
  items: Idea[]
  command: (object: object) => void
}>()

const store = useStore()

const currentWorkspaceTeams = computed<{ [id: number]: Team }>(() => store.getters['base/currentWorkspaceTeams'])

const selectedIndex = ref(0)

watch(
  () => props.items,
  () => (selectedIndex.value = 0)
)

const getIdeaTeamSlug = computed(() => store.getters['base/getIdeaTeamSlug'])

function onKeyDown({ event }: { event: KeyboardEvent }) {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (['Enter', 'Tab'].includes(event.key)) {
    enterHandler()
    return true
  }

  return false
}

function upHandler() {
  selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length
}

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

function enterHandler() {
  selectItem(props.items[selectedIndex.value])
}

function selectItem(idea: Idea) {
  // Run the TipTap command to select the idea
  props.command({ id: idea.id, label: idea.title })
}

function ideaStatusCategory(idea: Idea): number {
  const team = Object.values(currentWorkspaceTeams.value).find(team => team.id === idea.team_id)

  if (!team) return 1

  return team.statuses.find(status => status.id === idea.status_id)?.category || 1
}

defineExpose({ onKeyDown })
</script>

<template>
  <div class="items max-h-[200px] max-w-[500px] overflow-auto" v-if="items.length">
    <button
      class="item inline-flex items-center"
      :class="{ 'is-selected': index === selectedIndex }"
      v-for="(idea, index) in items"
      :key="index"
      @click="selectItem(idea)"
    >
      <StatusIcon :category="ideaStatusCategory(idea)" class="mr-2" />
      <span class="mr-2 whitespace-nowrap text-slate-500">{{ getIdeaTeamSlug(idea) }}-{{ idea.team_idea_id }}:</span>
      <span class="truncate font-medium text-slate-800">
        {{ idea.title }}
      </span>
    </button>
  </div>
  <div v-else></div>
</template>
