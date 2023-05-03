<script setup lang="ts">
import { truncate } from 'lodash-es'
import { Idea, Team } from '~/types'

defineProps<{
  team: Team
  idea: Idea
  checked: boolean
  dragging: boolean
}>()

const { isIdeaUpvoted, ideaUpvoteCount, toggleUpvoteIdea } = useIdeaUpvotes()
const { ideaLabels } = useIdeaLabels()
</script>

<template>
  <div
    class="w-full cursor-default rounded-md border py-2 px-3 shadow-sm active:translate-y-px"
    :class="{
      'border-blue-300 bg-blue-100 dark:border-blue-600 dark:bg-blue-900': checked,
      'border-slate-300 bg-slate-50 dark:border-zinc-600 dark:bg-zinc-800': !checked,
      'fixed z-50 shadow-xl': dragging,
      'mb-4 active:shadow-none': !dragging,
    }"
  >
    <div class="pointer-events-none flex items-start">
      <div class="text-[13px] font-medium text-slate-800 dark:text-zinc-300">
        {{ truncate(idea.title, { length: 60 }) }}
      </div>
      <div class="ml-auto whitespace-nowrap pt-0.5 pl-2 text-xs text-slate-500 dark:text-zinc-400">
        {{ team.slug }}-{{ idea.team_idea_id }}
      </div>
    </div>

    <div class="pointer-events-none mt-2 flex items-center text-[13px]">
      <template v-if="idea.labels.length <= 2">
        <IdeaLabel
          v-for="{ name, color } in ideaLabels(idea.labels, team.labels)"
          :color="color"
          class="-ml-1.5 truncate"
        >
          {{ name }}
        </IdeaLabel>
      </template>

      <template v-else>
        <div class="flex items-center px-1">
          <span class="inline-flex items-center">
            <span
              v-for="{ color } in ideaLabels(idea.labels, team.labels)"
              :style="{ backgroundColor: color }"
              class="mr-1 h-[6px] w-[6px] rounded-full"
            ></span>
            <span class="ml-[6px] text-slate-800 dark:text-zinc-400">{{ idea.labels.length }} Labels</span>
          </span>
        </div>
      </template>
    </div>

    <div class="pointer-events-none mt-1 flex justify-end">
      <IdeaUpvoter
        :count="ideaUpvoteCount(idea)"
        :is-upvoted="isIdeaUpvoted(idea)"
        @click.stop="toggleUpvoteIdea(idea)"
        class="pointer-events-auto ml-auto xs:ml-1"
      />
    </div>
  </div>
</template>
