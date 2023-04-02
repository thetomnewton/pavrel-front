<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import Modal from '../components/Modal.vue'
import { Idea, Team } from '../types'

const props = defineProps<{
  open: boolean
  idea: Idea
}>()

const emit = defineEmits(['close', 'delete'])

const store = useStore()
const { currentWorkspaceTeams } = useWorkspace()

const teamsToMoveTo = computed(() => currentWorkspaceTeams.value.filter(({ id }) => id !== team.value?.id))

const team = computed<Team | undefined>(() =>
  currentWorkspaceTeams.value.find((team: Team) => team.id === props.idea.team_id)
)

function attemptMove(team: Team) {
  store.commit('base/moveIdeaToTeam', { idea: props.idea, team })
  store.dispatch('base/moveIdeaToTeam', { idea: props.idea, team })
  emit('close')
}
</script>

<template>
  <Modal :open="!!(open && idea && team)" @close="$emit('close')">
    <div
      class="mx-auto mt-[100px] w-full max-w-[500px] rounded-lg bg-white px-8 py-6 text-[15px] font-normal leading-6 text-slate-800 shadow-3xl dark:border dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
    >
      <div>
        Move
        <span class="font-semibold">{{ idea.title }}</span>
        from <span class="font-semibold">{{ team?.name ?? 'Unknown Team' }}</span>
        to which team?
      </div>

      <div class="mt-6">
        <TeamList class="-mx-8" :teams="teamsToMoveTo" @select-team="attemptMove" />

        <div
          v-if="!teamsToMoveTo.length"
          class="flex cursor-default items-center justify-center rounded-md border border-slate-200 px-10 py-5 text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          No teams available
        </div>
      </div>
    </div>
  </Modal>
</template>
