<script setup lang="ts">
import { cloneDeep, groupBy } from 'lodash-es'
import { Idea, IdeaStatus, Team } from '~/types'
import { ideaStatusSort } from '~/helpers/ideas'
import { PlusIcon } from '@heroicons/vue/20/solid'
import { useStore } from 'vuex'

const props = defineProps<{
  ideas: Idea[]
  team: Team
}>()

const store = useStore()

const toggleQuickCreateIdeaModal = () => store.commit('base/toggleQuickCreateIdeaModal')

const ideasGroupedByStatus = computed(() => groupBy(props.ideas, 'status_id'))

const previewModalOpen = ref(false)
const selectedIdea = ref<string | null>(null)

const sortedTeamStatuses = computed(() => {
  return cloneDeep(props.team.statuses).sort((a: IdeaStatus, b: IdeaStatus) => ideaStatusSort(a.category, b.category))
})

const ideasListFlattened = computed(() => {
  if (!props.team) return []

  return props.ideas.sort((a, b) => {
    // Check the status category
    const categoryA = props.team?.statuses.find(({ id }) => id === a.status_id)?.category || 0
    const categoryB = props.team?.statuses.find(({ id }) => id === b.status_id)?.category || 0

    if (categoryA !== categoryB) return ideaStatusSort(categoryA, categoryB)

    return +b.id - +a.id
  })
})

const selectedIdeaIndex = computed(() => {
  if (!selectedIdea.value) return null

  return ideasListFlattened.value.findIndex(({ id }) => id === selectedIdea.value)
})

function closeIdeaPreviewModal() {
  previewModalOpen.value = false
  selectedIdea.value = null
}

function selectIdea({ id }: Idea) {
  selectedIdea.value = id
  previewModalOpen.value = true
}

function prevIdea() {
  if (selectedIdeaIndex.value == null || ideasListFlattened.value[selectedIdeaIndex.value - 1] == null) return
  selectedIdea.value = ideasListFlattened.value[selectedIdeaIndex.value - 1].id
}

function nextIdea() {
  if (selectedIdeaIndex.value == null || ideasListFlattened.value[selectedIdeaIndex.value + 1] == null) return
  selectedIdea.value = ideasListFlattened.value[selectedIdeaIndex.value + 1].id
}
</script>

<template>
  <section class="max-h-[calc(100vh-53px)] w-full flex-1 overflow-x-auto pr-6 pl-6 lg:pl-10">
    <div class="flex items-start">
      <div
        v-for="status in sortedTeamStatuses"
        :key="status.id"
        class="flex h-full w-[290px] min-w-[290px] max-w-[290px] flex-col pr-8 pt-6"
      >
        <div class="mb-6 flex items-center text-[13px] font-medium">
          <StatusIcon :category="status.category" class="mr-2" />
          <span>{{ status.name }}</span>

          <div class="ml-auto">
            <button
              type="button"
              class="cursor-default rounded p-0.5 text-slate-700 hover:bg-slate-100 active:bg-slate-150 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:text-zinc-300"
            >
              <PlusIcon class="h-[18px] w-[18px]" @click="toggleQuickCreateIdeaModal" />
            </button>
          </div>
        </div>

        <div class="max-h-[calc(100vh-127px)] flex-1 space-y-4 overflow-y-auto pb-6">
          <IdeaBoardItem
            v-for="idea in ideasGroupedByStatus[status.id] ?? []"
            :key="idea.id"
            :idea="idea"
            :team="team"
            @click="selectIdea(idea)"
          />
        </div>
      </div>
    </div>

    <IdeaPreview
      :open="previewModalOpen"
      :idea-id="selectedIdea ?? undefined"
      :idea-index="selectedIdeaIndex"
      :total-ideas="ideasListFlattened.length"
      @close="closeIdeaPreviewModal"
      @prev-idea="prevIdea"
      @next-idea="nextIdea"
    />
  </section>
</template>
