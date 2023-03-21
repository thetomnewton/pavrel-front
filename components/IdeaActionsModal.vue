<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Idea } from '../types'
import Modal from './Modal.vue'
import ActionModalListItem from './ActionModalListItem.vue'

const emit = defineEmits(['close', 'open-bulk-delete-ideas-modal'])

const props = defineProps<{
  open: boolean
  ideaIds: Idea['id'][]
}>()

const store = useStore()

const getWorkspaceIdeaById = computed<(id: Idea['id']) => Idea>(() => store.getters['base/getWorkspaceIdeaById'])

const singleIdea = computed<Idea | undefined>(() => {
  if (props.ideaIds.length !== 1) return undefined

  return getWorkspaceIdeaById.value(props.ideaIds[0])
})

const { getTeamFromIdea } = useTeams()

function openBulkDeleteModal() {
  emit('close')
  emit('open-bulk-delete-ideas-modal')
}
</script>

<template>
  <Modal :open="open" @close="$emit('close')">
    <div class="mx-auto mt-12 w-[90%] max-w-[550px] overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-800">
      <div class="flex items-center px-6 py-4">
        <div
          class="cursor-default rounded bg-slate-100 px-2 py-1 text-xs font-medium leading-5 text-slate-500 dark:bg-zinc-700 dark:text-zinc-300"
        >
          <template v-if="!singleIdea">{{ ideaIds.length }} ideas</template>
          <template v-else>
            {{ getTeamFromIdea(singleIdea)?.slug }}-{{ singleIdea?.team_idea_id }}: {{ singleIdea?.title }}
          </template>
        </div>
      </div>

      <div class="border-t border-slate-200 dark:border-zinc-700">
        <ActionModalListItem @click="openBulkDeleteModal">
          <TrashIcon class="mr-3 h-5 w-5" />
          <span>Delete ideas...</span>
        </ActionModalListItem>
      </div>
    </div>
  </Modal>
</template>
