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

const team = computed<Team | undefined>(() =>
  currentWorkspaceTeams.value.find((team: Team) => team.id === props.idea.team_id)
)

const deleteIdea = (idea: Idea) => store.commit('base/deleteIdea', idea)

function destroy() {
  if (!team.value) return
  const { id, team_idea_id, title } = props.idea

  deleteIdea(props.idea)
  emit('delete')
  store.commit('base/showToast', {
    type: 'trash-idea',
    data: {
      ideaId: id,
      teamIdeaId: `${team.value.slug}-${team_idea_id}`,
      title,
    },
  })
  store.dispatch('base/deleteIdea', props.idea)
}
</script>

<template>
  <Modal :open="!!(open && idea && team)" @close="$emit('close')">
    <div
      class="mx-auto mt-[100px] w-full max-w-[500px] rounded-lg bg-white px-8 py-6 text-[15px] font-normal leading-6 text-slate-800 shadow-3xl dark:border dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
    >
      <div>
        Are you sure you want to delete the idea
        <span class="font-semibold">{{ team?.slug ?? 'Unknown Team' }}-{{ idea.team_idea_id }} - {{ idea.title }}</span
        >?
      </div>

      <div class="mt-3">This can't be undone.</div>

      <div class="mt-4 flex items-center justify-end">
        <form @submit.prevent="destroy" class="flex items-center">
          <ModalCancelButton class="mr-2" @click="$emit('close')">Cancel</ModalCancelButton>

          <DangerButton type="submit">Delete</DangerButton>
        </form>
      </div>
    </div>
  </Modal>
</template>
