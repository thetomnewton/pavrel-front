<script setup lang="ts">
import { useStore } from 'vuex'
import { Idea, Team } from '../types'
import { useOnline } from '@vueuse/core'

const props = defineProps<{
  open: boolean
  idea: Idea
}>()

const emit = defineEmits(['close', 'moved'])

const store = useStore()
const { user } = useUsers()
const online = useOnline()
const { currentWorkspaceTeams } = useWorkspace()
const movingStatus = ref<'idle' | 'processing' | 'error'>('idle')

const teamsToMoveTo = computed(() =>
  currentWorkspaceTeams.value.filter(
    ({ id, users }) => id !== team.value?.id && users.map(u => u.id).includes(user.value.id)
  )
)

const team = computed<Team | undefined>(() =>
  currentWorkspaceTeams.value.find(({ id }: Team) => id === props.idea.team_id)
)

function attemptMove(team: Team) {
  movingStatus.value = 'processing'

  store
    .dispatch('base/moveIdeaToTeam', { idea: props.idea, team })
    .then(() => {
      movingStatus.value = 'idle'
      emit('moved', team)
    })
    .catch(() => {
      movingStatus.value = 'error'
    })
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

      <template v-if="!online">
        <div
          class="mt-6 rounded-md border border-slate-200 py-4 text-center text-slate-600 dark:border-zinc-800 dark:text-zinc-300"
        >
          Please go online to move ideas between teams.
        </div>
      </template>

      <template v-else>
        <div class="mt-6">
          <Alert v-if="movingStatus === 'error'" class="mb-6">
            Something went wrong when moving this team. Please try again.
          </Alert>

          <div class="relative -mx-8">
            <div class="max-h-400px overflow-y-auto">
              <TeamList :teams="teamsToMoveTo" @select-team="attemptMove" />
            </div>

            <div
              v-if="movingStatus === 'processing'"
              class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-slate-100/70 dark:bg-zinc-800/90"
            >
              <div class="cursor-default text-[13px] font-medium text-slate-600 dark:text-zinc-400">Processing...</div>
            </div>
          </div>

          <div
            v-if="!teamsToMoveTo.length"
            class="flex cursor-default items-center justify-center rounded-md border border-slate-200 px-10 py-5 text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400"
          >
            No teams available.
          </div>
        </div>
      </template>
    </div>
  </Modal>
</template>
