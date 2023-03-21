<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { groupBy } from 'lodash'
import { ideaStatusSort } from '../helpers/ideas'
import IdeasList from './IdeasList.vue'
import IdeaPreview from './IdeaPreview.vue'
import IdeasEmptyState from './IdeasEmptyState.vue'
import StatusIcon from './StatusIcon.vue'
import IdeaActionsToast from './IdeaActionsToast.vue'
import { Idea, IdeaStatus, PossibleCategoryFilters, Team } from '../types'
import { useStore } from 'vuex'
import IdeaActionsModal from './IdeaActionsModal.vue'
import BulkDeleteIdeasModal from './BulkDeleteIdeasModal.vue'

const store = useStore()

const props = defineProps<{
  ideas: Idea[]
  categoryFilter: PossibleCategoryFilters
  teamSlug: string
}>()

watch(
  () => props.categoryFilter,
  () => {
    checkedIdeaIds.value = []
  }
)

function checkAllIdeas() {
  checkedIdeaIds.value = [...new Set(props.ideas.map(idea => idea.id))]
}

function uncheckAllIdeas() {
  checkedIdeaIds.value = []
}

const quickCreateIdeaModalOpen = computed(() => store.state.base.quickCreateIdeaModalOpen)

const selectAllListener = (e: KeyboardEvent) => {
  if (quickCreateIdeaModalOpen.value || previewModalOpen.value) return

  if (e.key.toLowerCase() === 'a' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    e.stopPropagation()
    checkAllIdeas()
  }
}

const escapeListener = (e: KeyboardEvent) => {
  if (quickCreateIdeaModalOpen.value || previewModalOpen.value) return

  if (e.key.toLowerCase() === 'escape') {
    uncheckAllIdeas()
  }
}

onMounted(() => {
  document.addEventListener('keydown', selectAllListener)
  document.addEventListener('keydown', escapeListener)
})

onUnmounted(() => {
  document.removeEventListener('keydown', selectAllListener)
  document.removeEventListener('keydown', escapeListener)
})

const router = useRouter()
const { currentWorkspaceTeams } = useWorkspace()

const previewModalOpen = ref(false)
const selectedIdea = ref<string | null>(null)

const team = computed<Team | undefined>(() =>
  currentWorkspaceTeams.value?.find(({ slug }: Team) => slug === props.teamSlug)
)

const checkedIdeaIds = ref<Idea['id'][]>([])

const ideasGroupedByStatus = computed(() => groupBy(props.ideas, 'status_id'))

const ideaStatusesSortedByCategory = computed(() => {
  if (team.value == null) return []

  return team.value.statuses
    .sort((a: IdeaStatus, b: IdeaStatus) => ideaStatusSort(a.category, b.category))
    .map(({ id }) => id)
})

const ideasListFlattened = computed(() => {
  if (!team.value) return []

  return props.ideas.sort((a, b) => {
    // Check the status category
    const categoryA = team.value?.statuses.find(({ id }) => id === a.status_id)?.category || 0
    const categoryB = team.value?.statuses.find(({ id }) => id === b.status_id)?.category || 0

    if (categoryA !== categoryB) return ideaStatusSort(categoryA, categoryB)

    return +b.id - +a.id
  })
})

const selectedIdeaIndex = computed(() => {
  if (!selectedIdea.value) return null

  return ideasListFlattened.value.findIndex(({ id }) => id === selectedIdea.value)
})

const prevState = router.options.history.state

if (typeof prevState?.back === 'string') {
  const match = prevState.back?.match(/(.*)(\/ideas\/)(.*)(\/edit)/)

  // If we have come here from the edit idea page without refreshing, re-open the preview modal for the idea
  if (match && prevState.scroll === null) {
    const team = currentWorkspaceTeams.value.find(({ slug }: { slug: string }) => slug === match[3].split('-')[0])
    const idea = props.ideas.find(idea => idea.team_id === team?.id && idea.team_idea_id === +match[3].split('-')[1])

    if (idea) selectIdea(idea)
  }
}

function closeIdeaPreviewModal() {
  previewModalOpen.value = false
  selectedIdea.value = null
}

function selectIdea({ id }: Idea) {
  selectedIdea.value = id
  previewModalOpen.value = true
  checkedIdeaIds.value = []
}

function prevIdea() {
  if (selectedIdeaIndex.value == null || ideasListFlattened.value[selectedIdeaIndex.value - 1] == null) return
  selectedIdea.value = ideasListFlattened.value[selectedIdeaIndex.value - 1].id
}

function nextIdea() {
  if (selectedIdeaIndex.value == null || ideasListFlattened.value[selectedIdeaIndex.value + 1] == null) return
  selectedIdea.value = ideasListFlattened.value[selectedIdeaIndex.value + 1].id
}

function toggleIdeaChecked({ idea, value }: { idea: Idea; value: boolean }) {
  if (value) checkedIdeaIds.value.push(idea.id)
  else checkedIdeaIds.value.splice(checkedIdeaIds.value.indexOf(idea.id), 1)
}

const ideaActionsModalOpen = ref(false)
const bulkDeleteIdeasModalOpen = ref(false)

const bulkDeleteIdeas = (ids: Idea['id'][]) => store.dispatch('base/bulkDeleteIdeas', ids)

function showActionsModal() {
  ideaActionsModalOpen.value = true
}

function confirmBulkDeleteIdeas() {
  bulkDeleteIdeas(checkedIdeaIds.value)
  bulkDeleteIdeasModalOpen.value = false
  checkedIdeaIds.value = []
}
</script>

<template>
  <section v-if="ideas.length" class="flex-1 overflow-auto">
    <template v-for="statusId in ideaStatusesSortedByCategory" :key="statusId">
      <div v-if="ideasGroupedByStatus[statusId]">
        <div
          class="flex cursor-default items-center bg-slate-50 py-2 pl-[22px] pr-6 text-[.8125rem] font-medium leading-[14px] text-slate-700 dark:bg-zinc-700/50 dark:text-zinc-200 lg:pl-10"
        >
          <StatusIcon :category="team?.statuses.find(({ id }) => id === statusId)?.category" class="mr-2" />
          <span>{{ team?.statuses.find(({ id }) => id === statusId)?.name }}</span>
        </div>

        <IdeasList
          v-if="team"
          :ideas="ideasGroupedByStatus[statusId]"
          :team="team"
          :checked="checkedIdeaIds"
          @select-idea="selectIdea($event)"
          @toggle-checked="toggleIdeaChecked"
        />
      </div>
    </template>

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

  <IdeasEmptyState v-else />

  <IdeaActionsToast :idea-ids="checkedIdeaIds" @show-actions-modal="showActionsModal" @cancel="checkedIdeaIds = []" />

  <IdeaActionsModal
    :open="ideaActionsModalOpen"
    :idea-ids="checkedIdeaIds"
    @close="ideaActionsModalOpen = false"
    @open-bulk-delete-ideas-modal="bulkDeleteIdeasModalOpen = true"
  />

  <BulkDeleteIdeasModal
    :open="bulkDeleteIdeasModalOpen"
    :idea-ids="checkedIdeaIds"
    @close="bulkDeleteIdeasModalOpen = false"
    @destroy="confirmBulkDeleteIdeas"
  />
</template>
