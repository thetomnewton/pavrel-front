<script setup lang="ts">
import { useStore } from 'vuex'
import { Idea, PossibleCategoryFilters, Team } from '~/types'
import { ideaStatusSort } from '../helpers/ideas'

const props = defineProps<{
  view: 'list' | 'board'
  ideas: Idea[]
  team: Team
  categoryFilter: PossibleCategoryFilters | undefined
}>()

const router = useRouter()
const { currentWorkspaceTeams } = useWorkspace()

const store = useStore()

watch(
  () => props.categoryFilter,
  () => {
    checkedIdeaIds.value = []
  }
)

const quickCreateOpen = computed(() => store.state.base.quickCreateIdeaModalOpen)

const checkedIdeaIds = ref<Idea['id'][]>([])

const previewModalOpen = ref(false)

const selectedIdea = ref<string | null>(null)

const selectedIdeaIndex = computed(() => {
  if (!selectedIdea.value) return null

  return ideasListFlattened.value.findIndex(({ id }) => id === selectedIdea.value)
})

function checkAllIdeas() {
  checkedIdeaIds.value = [...new Set(props.ideas.map(idea => idea.id))]
}

function uncheckAllIdeas() {
  checkedIdeaIds.value = []
}

const selectAllListener = (e: KeyboardEvent) => {
  if (quickCreateOpen.value || previewModalOpen.value) return

  if (e.key.toLowerCase() === 'a' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    e.stopPropagation()
    checkAllIdeas()
  }
}

const escapeListener = (e: KeyboardEvent) => {
  if (quickCreateOpen.value || previewModalOpen.value) return

  if (e.key.toLowerCase() === 'escape') uncheckAllIdeas()
}

const ideasListFlattened = computed(() => {
  if (!props.team) return []

  return props.ideas.sort((a, b) => {
    // Check the status category
    const categoryA = props.team.statuses.find(({ id }) => id === a.status_id)?.category || 0
    const categoryB = props.team.statuses.find(({ id }) => id === b.status_id)?.category || 0

    if (categoryA !== categoryB) return ideaStatusSort(categoryA, categoryB)

    return +b.id - +a.id
  })
})

function toggleIdeaChecked({ idea, value }: { idea: Idea; value: boolean }) {
  if (value) checkedIdeaIds.value.push(idea.id)
  else checkedIdeaIds.value.splice(checkedIdeaIds.value.indexOf(idea.id), 1)
}

onMounted(() => {
  document.addEventListener('keydown', selectAllListener)
  document.addEventListener('keydown', escapeListener)
})

onUnmounted(() => {
  document.removeEventListener('keydown', selectAllListener)
  document.removeEventListener('keydown', escapeListener)
})

function prevIdea() {
  if (selectedIdeaIndex.value == null || ideasListFlattened.value[selectedIdeaIndex.value - 1] == null) return
  selectedIdea.value = ideasListFlattened.value[selectedIdeaIndex.value - 1].id
}

function nextIdea() {
  if (selectedIdeaIndex.value == null || ideasListFlattened.value[selectedIdeaIndex.value + 1] == null) return
  selectedIdea.value = ideasListFlattened.value[selectedIdeaIndex.value + 1].id
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

const ideaActionsModalOpen = ref(false)
const bulkDeleteIdeasModalOpen = ref(false)

const bulkDeleteIdeas = (ids: Idea['id'][]) => store.dispatch('base/bulkDeleteIdeas', ids)

function showActionsModal() {
  ideaActionsModalOpen.value = true
}

function confirmBulkDeleteIdeas() {
  bulkDeleteIdeas(checkedIdeaIds.value)
  bulkDeleteIdeasModalOpen.value = false
  uncheckAllIdeas()
}
</script>

<template>
  <IdeasEmptyState v-if="!ideas.length" />

  <template v-else>
    <IdeaListView
      v-if="view === 'list'"
      :ideas="ideas"
      :team="team"
      :categoryFilter="categoryFilter"
      :checkedIdeaIds="checkedIdeaIds"
      @select-idea="selectIdea"
      @toggle-checked="toggleIdeaChecked"
    />

    <IdeaBoardView v-else :ideas="ideas" :team="team" @select-idea="selectIdea" :checkedIdeaIds="checkedIdeaIds" />

    <IdeaPreview
      :open="previewModalOpen"
      :idea-id="selectedIdea ?? undefined"
      :idea-index="selectedIdeaIndex"
      :total-ideas="ideasListFlattened.length"
      @close="closeIdeaPreviewModal"
      @prev-idea="prevIdea"
      @next-idea="nextIdea"
    />

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

    <IdeaActionsToast :idea-ids="checkedIdeaIds" @show-actions-modal="showActionsModal" @cancel="uncheckAllIdeas" />
  </template>
</template>
