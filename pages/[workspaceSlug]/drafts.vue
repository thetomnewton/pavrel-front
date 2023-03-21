<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { Idea, Team } from '../../types'

const store = useStore()
const tab = ref<'created' | 'subscribed'>('created')

const { user, userIsSubscribedTo } = useUsers()

const teamIdeas = computed<(id: Team['id']) => Idea[]>(() => store.getters['base/teamIdeas'])

const tabFilters = {
  created: (idea: Idea) => idea.creator_id === user.value.id,
  subscribed: (idea: Idea) => userIsSubscribedTo.value(idea),
}

const relevantIdeas = computed<Idea[]>(() => {
  if (!draftTeam.value) return []

  const ideas = teamIdeas.value(draftTeam.value?.id)

  return ideas.filter(idea => tabFilters[tab.value](idea) && idea.deleted_at === null)
})

const { draftTeam } = useTeams()

const { filters, applyFilter, applyFiltersToIdeas, updateFilter, removeFilter } = useIdeaFilters()

const workspaceContentLoaded = computed(() => store.state.base.workspaceContentLoaded)
const justUpgraded = ref(false)
const justUpgradedPlan = ref<string | null>(null)

function checkForRecentUpgrade() {
  const params = new URLSearchParams(location.search)
  if (params.get('upgrade') !== 'true') return

  justUpgraded.value = true
  justUpgradedPlan.value = params.get('plan')

  // Remove the query string from the URL
  history.replaceState(null, '', location.pathname)
}

checkForRecentUpgrade()
</script>

<template>
  <PageHeader
    show-filters
    show-options
    :ideas="relevantIdeas"
    :filters="filters"
    @apply-filter="applyFilter"
    @update-filter="updateFilter"
    @remove-filter="removeFilter"
    class="border-b"
    :class="[
      applyFiltersToIdeas(relevantIdeas).length
        ? 'border-slate-100 dark:border-zinc-700'
        : 'border-slate-50 dark:border-zinc-800',
    ]"
  >
    <span class="font-medium">Drafts</span>
  </PageHeader>

  <CategorisedIdeaBlock
    v-if="draftTeam && draftTeam.slug"
    :ideas="applyFiltersToIdeas(relevantIdeas)"
    :team-slug="draftTeam.slug"
    category-filter="all"
  />

  <JustUpgradedModal
    :open="justUpgraded && workspaceContentLoaded"
    :plan="justUpgradedPlan"
    @close="justUpgraded = false"
  />
</template>
