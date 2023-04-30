<script setup lang="ts">
import { ref, computed } from 'vue'
import { groupBy } from 'lodash-es'
import { ideaStatusSort } from '@/helpers/ideas'
import { Idea, IdeaStatus, PossibleCategoryFilters, Team } from '@/types'

const props = defineProps<{
  ideas: Idea[]
  categoryFilter: PossibleCategoryFilters | undefined
  team: Team
  checkedIdeaIds: Idea['id'][]
}>()

defineEmits(['select-idea', 'toggle-checked'])

const ideasGroupedByStatus = computed(() => groupBy(props.ideas, 'status_id'))

const ideaStatusesSortedByCategory = computed(() => {
  if (props.team == null) return []

  return props.team.statuses
    .sort((a: IdeaStatus, b: IdeaStatus) => ideaStatusSort(a.category, b.category))
    .map(({ id }) => id)
})
</script>

<template>
  <section class="max-h-[calc(100vh-53px)] flex-1 overflow-auto">
    <template v-for="statusId in ideaStatusesSortedByCategory" :key="statusId">
      <div v-if="ideasGroupedByStatus[statusId]">
        <div
          class="flex cursor-default items-center bg-slate-50 py-2 pl-[22px] pr-6 text-[.8125rem] font-medium leading-[14px] text-slate-700 dark:bg-zinc-700/50 dark:text-zinc-200 lg:pl-10"
        >
          <StatusIcon :category="team.statuses.find(({ id }) => id === statusId)?.category" class="mr-2" />
          <span>{{ team.statuses.find(({ id }) => id === statusId)?.name }}</span>
        </div>

        <IdeasList
          v-if="team"
          :ideas="ideasGroupedByStatus[statusId]"
          :team="team"
          :checked="checkedIdeaIds"
          @select-idea="$emit('select-idea', $event)"
          @toggle-checked="$emit('toggle-checked', $event)"
        />
      </div>
    </template>
  </section>
</template>
