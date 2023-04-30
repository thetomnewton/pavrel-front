<script setup lang="ts">
import { truncate } from 'lodash-es'
import { Idea, Label, Team } from '~~/types'

const props = defineProps<{
  team: Team
  idea: Idea
}>()

const { isIdeaUpvoted, ideaUpvoteCount, toggleUpvoteIdea } = useIdeaUpvotes()

function ideaLabels(ids: Label[]): Label[] {
  const isLabel = (label: Label | undefined): label is Label => !!label
  return ids.map(({ id }) => props.team.labels.find(label => label.id === id)).filter(isLabel)
}

const mousedown = ref(false)
const dragging = ref(false)
const initElXY = ref<[number | null, number | null]>([null, null])
const initMouseXY = ref<[number | null, number | null]>([null, null])
const newMouseXY = ref<[number | null, number | null]>([null, null])

const diff = computed<[number, number]>(() => {
  return [initMouseXY.value[0] - initElXY.value[0], initMouseXY.value[1] - initElXY.value[1]]
})

const handleMousedown = (e: MouseEvent) => {
  mousedown.value = true
  const rect = (e.target as HTMLDivElement).getBoundingClientRect()

  initElXY.value = [rect.x, rect.y]
  initMouseXY.value = [e.clientX, e.clientY]
}

const handleClick = () => {
  // mousedown.value = false
  // initMouseXY.value = [null, null]
}

const handleMouseMove = (e: MouseEvent) => {
  if (!mousedown.value) return

  dragging.value = true
  newMouseXY.value = [e.clientX, e.clientY]
}

const handleMouseUp = (e: MouseEvent) => {
  if (dragging.value) {
    e.stopPropagation()
    dragging.value = false
  }
}
</script>

<template>
  <div
    class="cursor-default rounded-md border border-slate-300 bg-slate-50 py-2 px-3 shadow-sm dark:border-zinc-600 dark:bg-zinc-800"
    :class="{ 'fixed z-20': dragging }"
    :style="{
      top: dragging ? `${newMouseXY[1] - diff[1]}px` : 'auto',
      left: dragging ? `${newMouseXY[0] - diff[0]}px` : 'auto',
    }"
    @click="handleClick"
    @mousedown="handleMousedown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <div class="flex items-start">
      <div class="text-[13px] font-medium text-slate-800 dark:text-zinc-300">
        {{ truncate(idea.title, { length: 60 }) }}
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
</template>
