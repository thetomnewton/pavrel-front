<script setup lang="ts">
import IdeaListItem from '../components/IdeaListItem.vue'
import { last } from 'lodash-es'
import { Idea, Team } from '../types'
import { computed, ref, watch } from 'vue'
import store from '../store'

const props = defineProps<{
  ideas: Idea[]
  checked: Idea['id'][]
  team: Team
}>()

const emit = defineEmits(['select-idea', 'toggle-checked'])

const columnWidth = ref('40px')

const teamIdeas = computed<(id: Team['id']) => Idea[]>(() => store.getters['base/teamIdeas'])
const currentTeamIdeas = computed<Idea[]>(() => teamIdeas.value(props.team.id))

function openIdea(idea: Idea) {
  emit('select-idea', idea)
}

watch(
  currentTeamIdeas,
  (newIdeas: Idea[]) => {
    const latestIdea = last(newIdeas)
    if (!latestIdea) return '25px'

    const mostRecentIdeaIdStringLength = last(newIdeas)?.team_idea_id.toString().length || 1

    // Set the CSS variable for the column width, based
    // on the biggest ID of the visible ideas
    columnWidth.value = `${43 + 5 * mostRecentIdeaIdStringLength}px`
  },
  { deep: true, immediate: true }
)

function toggleChecked(idea: Idea, value: boolean) {
  emit('toggle-checked', { idea, value })
}
</script>

<template>
  <div>
    <IdeaListItem
      v-for="idea in ideas"
      :idea="idea"
      :team="team"
      :checked="checked.includes(idea.id)"
      :key="idea.id"
      :column-width="columnWidth"
      @click.native="openIdea(idea)"
      @toggle-checked="toggleChecked(idea, $event)"
    />
  </div>
</template>
