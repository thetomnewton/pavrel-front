<script setup lang="ts">
import { groupBy, truncate } from 'lodash-es'
import { Idea, Label, Team } from '~/types'
import { ideaStatusSort } from '~/helpers/ideas'

const props = defineProps<{
  ideas: Idea[]
  team: Team
}>()

const { isIdeaUpvoted, ideaUpvoteCount, toggleUpvoteIdea } = useIdeaUpvotes()

const visibleStatuses = computed(() =>
  props.team.statuses.filter(({ id }) => props.ideas.filter(({ status_id }) => status_id === id).length > 0)
)

const ideasGroupedByStatus = computed(() => groupBy(props.ideas, 'status_id'))

const previewModalOpen = ref(false)
const selectedIdea = ref<string | null>(null)

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

function ideaLabels(ids: Label[]): Label[] {
  const isLabel = (label: Label | undefined): label is Label => !!label

  return ids.map(({ id }) => props.team.labels.find(label => label.id === id)).filter(isLabel)
}
</script>

<template>
  <section
    v-if="visibleStatuses.length"
    class="max-h-[calc(100vh-53px)] w-full flex-1 overflow-x-auto py-6 pr-6 pl-6 lg:pl-10"
  >
    <div class="flex items-start">
      <div v-for="status in visibleStatuses" :key="status.id" class="min-w-[280px] pr-8">
        <div class="mb-6 flex items-center text-[13px] font-medium">
          <StatusIcon :category="status.category" class="mr-2" />
          <span>{{ status.name }}</span>
        </div>

        <div class="space-y-4">
          <!-- IdeaBoardItem -->
          <div
            v-for="idea in ideasGroupedByStatus[status.id] ?? []"
            :key="idea.id"
            @click="selectIdea(idea)"
            class="cursor-default rounded-md border border-slate-300 bg-slate-50 py-2 px-3 shadow-sm dark:border-zinc-600 dark:bg-zinc-800"
          >
            <div class="flex items-start">
              <div class="text-[13px] font-medium text-slate-800 dark:text-zinc-300">
                {{ truncate(idea.title, { length: 30 }) }}
              </div>
              <div class="ml-auto whitespace-nowrap pt-0.5 pl-2 text-xs text-slate-500 dark:text-zinc-400">
                {{ team.slug }}-{{ idea.team_idea_id }}
              </div>
            </div>

            <div class="mt-2 flex items-center text-[13px]">
              <template v-if="idea.labels.length <= 2">
                <IdeaLabel v-for="{ name, color } in ideaLabels(idea.labels)" :color="color" class="-ml-1.5 truncate">
                  {{ name }}
                </IdeaLabel>
              </template>

              <template v-else>
                <div class="flex items-center px-1">
                  <span class="inline-flex items-center">
                    <span
                      v-for="{ color } in ideaLabels(idea.labels)"
                      :style="{ backgroundColor: color }"
                      class="mr-1 h-[6px] w-[6px] rounded-full"
                    ></span>
                    <span class="ml-[6px] text-slate-800 dark:text-zinc-400">{{ idea.labels.length }} Labels</span>
                  </span>
                </div>
              </template>
            </div>

            <div class="mt-1 flex justify-end">
              <IdeaUpvoter
                :count="ideaUpvoteCount(idea)"
                :is-upvoted="isIdeaUpvoted(idea)"
                @click.stop="toggleUpvoteIdea(idea)"
                class="ml-auto xs:ml-1"
              />
            </div>
          </div>
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

  <IdeasEmptyState v-else />
</template>
