<script setup lang="ts">
import { cloneDeep, groupBy, truncate } from 'lodash-es'
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
function updateStatus(idea: Idea, statusId: Idea['status_id']) {
  store.dispatch('base/updateIdea', { ...idea, ...{ status_id: statusId } })
}

const toggleQuickCreateIdeaModal = () => store.commit('base/toggleQuickCreateIdeaModal')

const ideasGroupedByStatus = computed(() => groupBy(props.ideas, 'status_id'))

const sortedTeamStatuses = computed(() =>
  cloneDeep(props.team.statuses).sort((a: IdeaStatus, b: IdeaStatus) => ideaStatusSort(a.category, b.category))
)

const mouseDown = ref(false)
const mouseDownInitCoords = ref({ x: 0, y: 0 })
const dragging = ref(false)
const draggingIdea = ref<Idea | null>(null)
const dragElCoords = ref({ x: 0, y: 0 })
const dragCoords = ref({ x: 0, y: 0 })
const dragEnd = ref(false)
const dragWidth = ref<number>(0)

function handleMousemove(e: MouseEvent) {
  // if mouse down and the mouse has moved more than 5px, start dragging
  if (mouseDown.value && !dragging.value && Math.abs(e.clientX - mouseDownInitCoords.value.x) > 5) {
    dragging.value = true
  }

  if (mouseDown.value && dragging.value) {
    dragCoords.value = { x: e.clientX, y: e.clientY }

    const statusColumns: Element[] = [...document.querySelectorAll('.status-column-list')]
    statusColumns.forEach(col => {
      const rect = (col as HTMLElement).getBoundingClientRect()

      // If we are hovering over a status column, highlight it
      if (e.clientX > rect.x && e.clientX < rect.x + rect.width) col.classList.add('drag-hovered')
      else col.classList.remove('drag-hovered')
    })
  }
}

function handleMousedown(e: MouseEvent, idea: Idea) {
  mouseDown.value = true
  mouseDownInitCoords.value = { x: e.clientX, y: e.clientY }
  dragElCoords.value = {
    x: e.clientX - (e.target as HTMLElement).getBoundingClientRect().x,
    y: e.clientY - (e.target as HTMLElement).getBoundingClientRect().y,
  }
  draggingIdea.value = idea
  dragWidth.value = (e.target as HTMLElement).getBoundingClientRect().width
}

function handleMouseup(e: MouseEvent) {
  mouseDown.value = false

  if (dragging.value) {
    dragging.value = false

    // Deduce which section we have dropped the element over
    // If it's a relevant status column, update the idea's status to the new one
    const cols = [...document.querySelectorAll('.status-column-list')]

    cols.forEach(col => col.classList.remove('drag-hovered'))

    const col = cols.find(col => {
      const rect = (col as HTMLElement).getBoundingClientRect()
      return e.clientX > rect.x && e.clientX < rect.x + rect.width
    })

    if (col) {
      const statusId = (col as HTMLElement).dataset?.statusid
      if (statusId && draggingIdea.value) {
        updateStatus(draggingIdea.value, statusId)
      }
    }

    // For 50ms set that we just finished dragging,
    // so that the subsequent click event does not fire
    dragEnd.value = true
    draggingIdea.value = null
    dragWidth.value = 0
    dragElCoords.value = { x: 0, y: 0 }
    dragCoords.value = { x: 0, y: 0 }

    setTimeout(() => (dragEnd.value = false), 50)
  }
}

function selectIdea(idea: Idea) {
  if (dragEnd.value) return
  emit('select-idea', idea)
}

const keydownListener = (e: KeyboardEvent) => {
  if (
    // @ts-ignore
    ['input', 'textarea'].includes(e.target?.localName) ||
    // @ts-ignore
    e.target?.attributes?.contenteditable
  )
    return

  // If we're dragging and press escape, cancel everything
  if (e.key === 'Escape' && mouseDown.value && dragging.value) {
    mouseDown.value = false
    dragging.value = false
    draggingIdea.value = null
    dragWidth.value = 0
    dragElCoords.value = { x: 0, y: 0 }
    dragCoords.value = { x: 0, y: 0 }

    const cols = [...document.querySelectorAll('.status-column-list')]
    cols.forEach(col => col.classList.remove('drag-hovered'))
  }
}

onMounted(() => {
  window.addEventListener('keydown', keydownListener)
})

onUnmounted(() => {
  window.removeEventListener('keydown', keydownListener)
})
</script>

<template>
  <section
    class="max-h-[calc(100vh-53px)] w-full flex-1 overflow-x-auto bg-[#fcfcfe] pr-6 pl-6 dark:bg-inherit lg:pl-10"
    @mousemove="handleMousemove"
    @mouseup="handleMouseup"
    :class="{ 'select-none': dragging }"
  >
    <div class="flex h-full items-start">
      <div
        v-for="status in sortedTeamStatuses"
        :key="status.id"
        class="mr-8 flex h-full w-[290px] min-w-[290px] max-w-[290px] flex-col pt-6"
      >
        <div class="mb-6 flex items-center text-[13px] font-medium">
          <StatusIcon :category="status.category" class="mr-2" />
          <span>{{ status.name }}</span>

          <div class="ml-auto">
            <button
              type="button"
              @click="toggleQuickCreateIdeaModal"
              class="cursor-default rounded p-0.5 text-slate-700 hover:bg-slate-100 active:bg-slate-150 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:text-zinc-300"
            >
              <PlusIcon class="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        <div
          class="status-column-list max-h-[calc(100vh-127px)] flex-1 overflow-y-auto pb-6"
          :data-statusid="status.id"
        >
          <template v-for="idea in ideasGroupedByStatus[status.id] ?? []">
            <IdeaBoardItem
              :idea="idea"
              :team="team"
              :checked="checkedIdeaIds.includes(idea.id)"
              :dragging="dragging && draggingIdea?.id === idea.id"
              @click="selectIdea(idea)"
              :style="{
                left: dragging && draggingIdea?.id === idea.id ? `${dragCoords.x - dragElCoords.x}px` : null,
                top: dragging && draggingIdea?.id === idea.id ? `${dragCoords.y - dragElCoords.y}px` : null,
                width: dragging && draggingIdea?.id === idea.id ? `${dragWidth}px` : null,
              }"
              @mousedown="$event => handleMousedown($event, idea)"
            />

            <div
              v-if="dragging && draggingIdea?.id === idea.id"
              class="mb-4 w-full cursor-default rounded-md border border-dashed border-slate-200 py-2 px-3 text-[13px] text-slate-500 dark:border-zinc-700 dark:text-zinc-500"
            >
              <div class="flex items-start">
                <div>{{ truncate(idea.title, { length: 60 }) }}</div>

                <div class="ml-auto whitespace-nowrap pt-0.5 pl-2 text-xs text-slate-500 dark:text-zinc-500">
                  {{ team.slug }}-{{ idea.team_idea_id }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.drag-hovered {
  @apply bg-slate-50 dark:bg-zinc-800;
}
</style>
