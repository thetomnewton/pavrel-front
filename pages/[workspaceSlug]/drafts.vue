<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { Idea, Team } from '../../types'
import { useLocalStorage } from '@vueuse/core'

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Drafts',
})

const store = useStore()
const tab = ref<'created' | 'subscribed'>('created')

const { user, userIsSubscribedTo } = useUsers()

const teamIdeas = computed<(id: Team['id']) => Idea[]>(() => store.getters['base/teamIdeas'])

const ideaView = useLocalStorage<'list' | 'board' | undefined>('idea-view-preference', 'list')

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

const workspaceContentLoaded = computed<boolean>(() => store.state.base.workspaceContentLoaded)
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
    v-if="draftTeam"
    show-filters
    show-options
    :idea-view="ideaView"
    @setIdeaView="($event: 'board' | 'list' | undefined) => (ideaView = $event)"
    :ideas="relevantIdeas"
    :filters="filters"
    :team="draftTeam"
    @apply-filter="applyFilter"
    @update-filter="updateFilter"
    @remove-filter="removeFilter"
    class="border-b"
    :class="[
      applyFiltersToIdeas(relevantIdeas).length
        ? 'border-slate-150 dark:border-zinc-800'
        : 'border-slate-50 dark:border-zinc-800',
    ]"
  >
    <span class="font-medium">Drafts</span>
  </PageHeader>

  <IdeaViewWrapper
    v-if="ideaView && draftTeam"
    :view="ideaView"
    :ideas="applyFiltersToIdeas(relevantIdeas)"
    :team="draftTeam"
    :category-filter="ideaView === 'list' ? 'all' : undefined"
  />

  <JustUpgradedModal
    :open="justUpgraded && workspaceContentLoaded"
    :plan="justUpgradedPlan"
    @close="justUpgraded = false"
  />
</template>
