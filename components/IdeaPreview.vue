<script setup lang="ts">
import { ChevronUpIcon, ChevronDownIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { Idea, Team, Workspace } from '../types'

const props = defineProps<{
  open: boolean
  ideaId?: string
  ideaIndex: number | null
  totalIdeas: number
}>()

const emit = defineEmits(['close', 'prev-idea', 'next-idea'])

const store = useStore()
const router = useRouter()
const { pushToRecentIdeas } = useRecentIdeas()

const previousUrl = ref<string | null>(null)
const sidebarOpen = ref(false)
const keydownListener = ref((e: KeyboardEvent) => {
  if (
    // @ts-ignore
    ['input', 'textarea'].includes(e.target?.localName) ||
    // @ts-ignore
    e.target?.attributes?.contenteditable
  )
    return

  if (e.key === 'Escape') close()
  if (e.key.toUpperCase() === 'J') emit('prev-idea')
  if (e.key.toUpperCase() === 'K') emit('next-idea')
})

const ideas = computed<Idea[]>(() => store.state.base.ideas)

const hasNext = computed(() => (props.ideaIndex || 0) < props.totalIdeas - 1)
const hasPrev = computed(() => (props.ideaIndex || 0) > 0)
const getTeamFromIdea = computed<(idea: Idea) => Team>(() => store.getters['base/getTeamFromIdea'])
const currentWorkspace = computed<Workspace>(() => store.getters['base/currentWorkspace'])
const isFavorite = computed<(idea: Idea) => boolean>(() => store.getters['base/isFavorite'])

const team = computed(() => {
  if (!ideas.value || !idea.value) return null

  return getTeamFromIdea.value(idea.value)
})

const idea = computed(() => ideas.value.find(({ id }) => id === props.ideaId))

watch(
  () => props.open,
  newState => {
    if (newState) handleOpen()
  },
  { immediate: true }
)

watch(idea, (value, oldValue) => {
  if (value) {
    setUrl()
    pushToRecentIdeas(value)
  }
  if (!value && oldValue) close()
})

onBeforeMount(() => (previousUrl.value = location.pathname))

const updateIdea = (idea: Idea) => store.dispatch('base/updateIdea', idea)
const toggleFavorite = (idea: Idea) => store.dispatch('base/toggleFavorite', idea)

function handleEdit() {
  const url = `/${currentWorkspace.value.slug}/teams/${team.value?.slug}/new`
  router.push(url)
}

function handleOpen() {
  window.addEventListener('keydown', keydownListener.value)

  setUrl()
}

function close() {
  emit('close')
  window.history.pushState({}, 'Idea', previousUrl.value)
  window.removeEventListener('keydown', keydownListener.value)
}

function updateStatus(id: string) {
  if (!idea.value) return

  updateIdea({ ...idea.value, ...{ status_id: id } })
}

function showViewHistory() {
  // todo: show view history modal
}

function setUrl() {
  // todo: refactor to implement vue router
  window.history.pushState(
    {},
    'Idea',
    `/${currentWorkspace.value.slug}/ideas/${team.value?.slug}-${idea.value?.team_idea_id}`
  )
}

function handleTeamMove(team: Team) {
  if (!team.personal) router.push(`/${currentWorkspace.value.slug}/teams/${team.slug}/ideas/all`)
  else router.push(`/${currentWorkspace.value.slug}/drafts`)
}
</script>

<template>
  <div
    class="overlaps-sidebar fixed inset-0 z-40 flex items-start bg-slate-100/70 dark:bg-zinc-900/90 lg:transition lg:duration-200"
    :class="{ 'pointer-events-none opacity-0': !open }"
    @click.self="close"
  >
    <Transition
      enter-from-class="lg:scale-95"
      leave-to-class="lg:scale-95"
      enter-active-class="lg:transition lg:origin-center"
      leave-active-class="lg:transition lg:origin-center"
    >
      <div
        class="mx-auto flex h-full w-full max-w-[1280px] flex-col overflow-hidden rounded-lg bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:lg:border dark:lg:border-zinc-700"
        v-if="open"
      >
        <div class="flex items-center border-b border-slate-150 px-[18px] py-[10px] dark:border-zinc-800">
          <button
            type="button"
            class="mr-[6px] flex cursor-default items-center rounded border border-slate-300 px-[3px] py-[3px] font-medium leading-[20px] hover:bg-slate-50 active:border-slate-400 active:bg-slate-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 dark:active:border-zinc-600 dark:active:bg-zinc-700/70"
            :class="{ 'pointer-events-none opacity-40': !hasPrev }"
            :disabled="!hasPrev"
            @click="$emit('prev-idea')"
          >
            <ChevronUpIcon class="h-5 w-5 text-slate-600 dark:text-zinc-300" />
          </button>

          <button
            type="button"
            class="flex cursor-default items-center rounded border border-slate-300 px-[3px] py-[3px] font-medium leading-[20px] hover:bg-slate-50 active:border-slate-400 active:bg-slate-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 dark:active:border-zinc-600 dark:active:bg-zinc-700/70"
            :class="{ 'pointer-events-none opacity-40': !hasNext }"
            :disabled="!hasNext"
            @click="$emit('next-idea')"
          >
            <ChevronDownIcon class="h-5 w-5 text-slate-600 dark:text-zinc-300" />
          </button>

          <span class="ml-3 text-xs text-slate-500 dark:text-zinc-500">
            <span class="text-slate-600 dark:text-zinc-300">{{ (ideaIndex || 0) + 1 }}</span>
            <span> / {{ totalIdeas }}</span>
          </span>

          <span
            class="group ml-auto rounded p-[4px] hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-zinc-700/50 dark:active:bg-zinc-700/70"
            @click="close"
          >
            <XMarkIcon
              class="h-5 w-5 text-slate-600 group-hover:text-slate-800 dark:text-zinc-300 dark:group-hover:text-zinc-300"
            />
          </span>
        </div>

        <IdeaContent
          v-if="idea && team"
          :idea="idea"
          :team-id="team.id"
          :sidebar-open="sidebarOpen"
          has-sidebar
          class="flex-1 overflow-hidden"
          @edit="handleEdit"
          @status-update="updateStatus"
          @close-sidebar="sidebarOpen = false"
        >
          <div
            class="mx-auto flex max-w-4xl flex-1 items-center border-b border-slate-150 px-5 py-3 text-[.8125rem] font-medium leading-7 dark:border-zinc-800"
          >
            <span>
              <span class="cursor-default">{{ team.name }}</span>
              <span class="mx-1 cursor-default">›</span>
              <span class="cursor-default whitespace-nowrap">{{ team.slug }}-{{ idea.team_idea_id }}</span>
            </span>

            <FavoriteButton class="ml-4" @click="idea ? toggleFavorite(idea) : ''" :on="isFavorite(idea)" />

            <span class="ml-auto flex items-center">
              <IdeaEditButton :url="`/${currentWorkspace?.slug}/ideas/${team?.slug}-${idea.team_idea_id}/edit`" />

              <IdeaActionsDropdown :idea="idea" @move-teams="handleTeamMove" @view-history="showViewHistory" />

              <span
                @click="sidebarOpen = !sidebarOpen"
                class="ml-2 rounded px-[6px] py-1 hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-zinc-800/70 dark:active:bg-zinc-800 lg:hidden"
              >
                <Bars3BottomRightIcon class="h-5 w-5 min-w-[1.25rem] text-slate-600 dark:text-zinc-400" />
              </span>
            </span>
          </div>
        </IdeaContent>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .overlaps-sidebar {
    padding: 24px 64px;
  }
}
</style>
