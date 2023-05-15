<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Idea, PossibleViewSorts, Team } from '~/types'
import { truncate } from 'lodash-es'
import { useLocalStorage } from '@vueuse/core'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const store = useStore()

const teamSlug = route.params.teamSlug as string
const filter = route.params.filter as 'all' | 'review' | 'backlog' | 'planning' | 'active'

const ideaView = useLocalStorage<'list' | 'board' | undefined>('idea-view-preference', 'list')

const ideas = computed<Idea[]>(() => store.state.base.ideas)

const title = computed(
  () =>
    ({
      all: 'All ideas',
      review: 'Review',
      backlog: 'Backlog',
      planning: 'Planning',
      active: 'Active ideas',
    }[filter] ?? 'Ideas')
)

const currentWorkspaceTeams = computed(() => store.getters['base/currentWorkspaceTeams'])

const team = computed<Team | undefined>(() =>
  currentWorkspaceTeams.value?.find(({ slug }: { slug: string }) => slug === teamSlug)
)

const { ideaUpvoteCount } = useIdeaUpvotes()

const { filters, applyFilter, applyFiltersToIdeas, updateFilter, removeFilter } = useIdeaFilters()

const options = computed<{ sort: PossibleViewSorts }>(() => store.state.base.viewOptions)

const sorts = {
  created: (a: Idea, b: Idea) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  updated: (a: Idea, b: Idea) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  upvotes: (a: Idea, b: Idea) => {
    if (ideaUpvoteCount.value(b) !== ideaUpvoteCount.value(a))
      return ideaUpvoteCount.value(b) - ideaUpvoteCount.value(a)

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  },
}

const relevantTeamIdeas = computed(() => {
  const filters = {
    all: (idea: Idea) => idea != null,
    review: (idea: Idea) => getIdeaStatusCategory(idea.status_id)?.category === 1,
    backlog: (idea: Idea) => getIdeaStatusCategory(idea.status_id)?.category === 2,
    planning: (idea: Idea) => getIdeaStatusCategory(idea.status_id)?.category === 3,
    active: (idea: Idea) => [4, 5].includes(getIdeaStatusCategory(idea.status_id)?.category || 0),
  }

  return ideas.value
    .filter(({ team_id }) => team_id === team.value?.id)
    .filter(idea => idea.deleted_at === null)
    .sort(sorts[options.value.sort])
    .filter(filters[filter ?? 'all'])
})

function getIdeaStatusCategory(statusId: string) {
  return (team.value?.statuses ?? []).find(({ id }) => id === statusId)
}

const heading = computed(() => `${truncate(team.value?.name ?? '', { length: 20 })} › ${title.value}`)

useHead({
  title: heading.value,
})
</script>

<template>
  <div class="flex flex-1 flex-col">
    <PageHeader
      :ideas="applyFiltersToIdeas(relevantTeamIdeas)"
      show-options
      show-filters
      :idea-view="filter === 'all' ? ideaView : undefined"
      @setIdeaView="($event: 'board' | 'list' | undefined) => (ideaView = $event)"
      :team="team"
      :filters="filters"
      @apply-filter="applyFilter"
      @update-filter="updateFilter"
      @remove-filter="removeFilter"
      class="border-b"
      :class="[
        applyFiltersToIdeas(relevantTeamIdeas).length
          ? 'border-slate-150 dark:border-zinc-700'
          : 'border-slate-50 dark:border-zinc-800',
      ]"
    >
      <span>
        <span class="font-medium">{{ heading }}</span>
      </span>
    </PageHeader>

    <IdeaViewWrapper
      v-if="ideaView && team"
      :view="ideaView"
      :ideas="applyFiltersToIdeas(relevantTeamIdeas)"
      :team="team"
      :category-filter="filter || 'all'"
    />
  </div>
</template>
