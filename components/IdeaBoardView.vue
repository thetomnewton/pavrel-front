<script setup lang="ts">
import { cloneDeep, groupBy } from 'lodash-es'
import { Idea, IdeaStatus, Team } from '~/types'
import { ideaStatusSort } from '~/helpers/ideas'
import { PlusIcon } from '@heroicons/vue/20/solid'
import { useStore } from 'vuex'

const props = defineProps<{
  ideas: Idea[]
  team: Team
  checkedIdeaIds: Idea['id'][]
}>()

const emit = defineEmits(['select-idea'])

const store = useStore()

const toggleQuickCreateIdeaModal = () => store.commit('base/toggleQuickCreateIdeaModal')

const ideasGroupedByStatus = computed(() => groupBy(props.ideas, 'status_id'))

const sortedTeamStatuses = computed(() =>
  cloneDeep(props.team.statuses).sort((a: IdeaStatus, b: IdeaStatus) => ideaStatusSort(a.category, b.category))
)

const mouseDown = ref(false)
const mouseDownInitCoords = ref({ x: 0, y: 0 })
const dragging = ref(false)
const dragEnd = ref(false)

function handleMousemove(e: MouseEvent) {
  // if mouse down and the mouse has moved more than 5px, start dragging
  if (mouseDown.value && !dragging.value && Math.abs(e.clientX - mouseDownInitCoords.value.x) > 5) {
    dragging.value = true
  }

  if (mouseDown.value && dragging.value) {
    console.log('dragging')
  }
}

function handleMousedown(e: MouseEvent) {
  console.log('mouse down')
  mouseDown.value = true
  mouseDownInitCoords.value = { x: e.clientX, y: e.clientY }
}

function handleMouseup(e: MouseEvent) {
  console.log('mouse up')
  mouseDown.value = false

  if (dragging.value) {
    dragging.value = false

    // For 50ms set that we just finished dragging, so that the subsequent click event does not fire
    dragEnd.value = true
    setTimeout(() => (dragEnd.value = false), 50)
  }
}

function selectIdea(idea: Idea) {
  if (dragEnd.value) return
  emit('select-idea', idea)
}
</script>

<template>
  <section
    class="max-h-[calc(100vh-53px)] w-full flex-1 overflow-x-auto pr-6 pl-6 lg:pl-10"
    @mousemove="handleMousemove"
    @mouseup="handleMouseup"
    :class="{ 'select-none': dragging }"
  >
    <div class="flex items-start">
      <div
        v-for="status in sortedTeamStatuses"
        :key="status.id"
        class="flex h-full w-[290px] min-w-[290px] max-w-[290px] flex-col pr-8 pt-6"
      >
        <div class="mb-6 flex items-center text-[13px] font-medium">
          <StatusIcon :category="status.category" class="mr-2" />
          <span>{{ status.name }}</span>

          <div class="ml-auto">
            <button
              type="button"
              class="cursor-default rounded p-0.5 text-slate-700 hover:bg-slate-100 active:bg-slate-150 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:text-zinc-300"
            >
              <PlusIcon class="h-[18px] w-[18px]" @click="toggleQuickCreateIdeaModal" />
            </button>
          </div>
        </div>

        <div class="max-h-[calc(100vh-127px)] flex-1 space-y-4 overflow-y-auto pb-6">
          <IdeaBoardItem
            v-for="idea in ideasGroupedByStatus[status.id] ?? []"
            :key="idea.id"
            :idea="idea"
            :team="team"
            :checked="checkedIdeaIds.includes(idea.id)"
            @click="selectIdea(idea)"
            @mousedown="handleMousedown"
          />
        </div>
      </div>
    </div>
  </section>
</template>
