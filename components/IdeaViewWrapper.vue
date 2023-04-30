<script setup lang="ts">
import { Idea, PossibleCategoryFilters, Team } from '~/types'

defineProps<{
  view: 'list' | 'board'
  ideas: Idea[]
  team: Team
  categoryFilter: PossibleCategoryFilters | undefined
}>()
</script>

<template>
  <template v-if="view === 'list'">
    <IdeaListView :ideas="ideas" :teamSlug="team.slug" :categoryFilter="categoryFilter" />
  </template>

  <template v-else>
    <IdeaBoardView :ideas="ideas" :team="team" />
  </template>
</template>
