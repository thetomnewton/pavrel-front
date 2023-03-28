<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import Modal from './Modal.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { Idea, Team } from '../types'
import { debounce } from 'lodash-es'
import api from '../api'
import SearchResultIdea from './SearchResultIdea.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { cloneDeep } from 'lodash-es'
import { useLocalStorage } from '@vueuse/core'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])

const store = useStore()
const router = useRouter()

const { getRecentIdeasFromStorage } = useRecentIdeas()
const recentIdeaIds = ref<{ [id: string]: number[] }>({})

const recentIdeas = computed<Idea[]>(() =>
  recentIdeaIds.value[currentWorkspace.value.id].map(id => getCurrentTeamIdeaById.value(id)).filter(Boolean)
)

const searchInput = ref<HTMLInputElement | null>(null)

watch(
  () => props.open,
  value => {
    query.value = ''
    searchResults.value = []
    status.value = 'idle'
    currentKeyboardIndex.value = 0
    recentIdeaIds.value = cloneDeep(getRecentIdeasFromStorage())

    if (value) addKeyboardListeners()
    else removeKeyboardListeners()

    nextTick(() => {
      if (value) searchInput.value?.focus()
    })
  }
)

const status = ref('idle')
const searchResults = ref<Idea[]>([])
const query = ref('')

const currentKeyboardIndex = ref<number>(0)

const { currentWorkspace } = useWorkspace()

const recentSearches = useLocalStorage<{ [id: string]: { value: string; time: number }[] }>('recent-searches', {})
const getCurrentTeamIdeaById = computed(() => store.getters['base/getCurrentTeamIdeaById'])

if (!(currentWorkspace.value.id in recentSearches.value)) recentSearches.value[currentWorkspace.value.id] = []

recentSearches.value[currentWorkspace.value.id].splice(
  0,
  Math.max(0, recentSearches.value[currentWorkspace.value.id].length - 8)
)

const hasRecentlySearched = (newQuery: string) =>
  recentSearches.value[currentWorkspace.value.id]
    .map(({ value }) => value.toLowerCase())
    .includes(newQuery.toLowerCase())

const baseRunSearch = () => {
  if (!query.value.trim()) {
    status.value = 'idle'
    searchResults.value = []
    return
  }

  status.value = 'searching'

  if (!hasRecentlySearched(query.value)) {
    recentSearches.value[currentWorkspace.value.id].push({
      value: query.value,
      time: new Date().getTime(),
    })
    recentSearches.value[currentWorkspace.value.id].splice(
      0,
      Math.max(0, recentSearches.value[currentWorkspace.value.id].length - 8)
    )
  } else {
    const index = recentSearches.value[currentWorkspace.value.id].findIndex(
      ({ value }) => value.toLowerCase() === query.value.toLowerCase()
    )
    if (index > -1)
      recentSearches.value[currentWorkspace.value.id][index] = { time: new Date().getTime(), value: query.value }
  }

  api
    .get(`/workspaces/${currentWorkspace.value.id}/ideas/search?q=${query.value}`)
    .then(({ data }) => {
      status.value = 'searched'
      searchResults.value = data
      currentKeyboardIndex.value = 0
    })
    .catch(() => {
      status.value = 'error'
    })
}

const runSearch = debounce(baseRunSearch, 500)

function searchFor(value: string) {
  query.value = value
  baseRunSearch()
}

const resultsIdentifierWidth = ref('40px')

const recentIdeasIdentifierWidth = computed(() => {
  const ids = recentIdeaIds.value[currentWorkspace.value.id]
  if (!ids.length) return '0'

  const lengths = recentIdeas.value.map(idea => idea.team_idea_id)

  return `${40 + 5 * Math.max(...lengths).toString().length}px`
})

watch(searchResults, value => {
  if (!value || !value.length) return
  const lengths = value.map(idea => idea.team_idea_id)

  resultsIdentifierWidth.value = `${43 + 5 * Math.max(...lengths).toString().length}px`
})

function removeRecentSearch(time: number) {
  const index = recentSearches.value[currentWorkspace.value.id].findIndex(search => search.time === time)
  if (index > -1) recentSearches.value[currentWorkspace.value.id].splice(index, 1)

  if (!recentSearches.value[currentWorkspace.value.id].length) nextTick(() => searchInput.value?.focus())
}

interface SearchResult {
  time: number
  value: string
}

const arrowsContext = computed<(SearchResult | Idea)[]>(() => {
  // @ts-ignore
  if (status.value === 'idle') return recentSearches.value[currentWorkspace.value.id].concat(recentIdeas.value)
  if (status.value === 'searched') return searchResults.value
  return []
})

const arrowsListener = (e: KeyboardEvent) => {
  if (!arrowsContext.value?.length) return
  if (!['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) return

  e.preventDefault()

  if (e.key === 'ArrowUp') {
    currentKeyboardIndex.value = Math.max(0, currentKeyboardIndex.value - 1)
  } else if (e.key === 'ArrowDown') {
    currentKeyboardIndex.value = Math.min(arrowsContext.value?.length - 1 || 0, currentKeyboardIndex.value + 1)
  } else if (e.key === 'Enter') {
    const searches = cloneDeep(recentSearches.value[currentWorkspace.value.id]).sort((a, b) => b.time - a.time)

    if (status.value === 'idle') {
      if (searches[currentKeyboardIndex.value]) searchFor(searches[currentKeyboardIndex.value].value)
      else openIdea(arrowsContext.value[currentKeyboardIndex.value] as Idea)
    } else if (status.value === 'searched') {
      if (searchResults.value[currentKeyboardIndex.value]) openIdea(searchResults.value[currentKeyboardIndex.value])
    }
  }
}

function addKeyboardListeners() {
  window.addEventListener('keydown', arrowsListener)
}

function removeKeyboardListeners() {
  window.removeEventListener('keydown', arrowsListener)
}

const getTeamFromIdea = computed<(idea: Idea) => Team>(() => store.getters['base/getTeamFromIdea'])

function openIdea(idea: Idea) {
  const team = getTeamFromIdea.value(idea)
  router.push(`/${currentWorkspace.value.slug}/ideas/${team?.slug}-${idea.team_idea_id}`)
  emit('close')
}
</script>

<template>
  <Modal :open="open" @close="$emit('close')">
    <div class="mx-auto mt-12 w-[90%] max-w-[550px] overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-800">
      <div class="relative">
        <MagnifyingGlassIcon
          v-if="status !== 'searching'"
          class="pointer-events-none absolute top-4 left-[14px] h-5 w-5 text-slate-400 dark:text-zinc-400"
        />

        <Transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="transform opacity-0"
          enter-to-class="transform opacity-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform opacity-100"
          leave-to-class="transform opacity-0"
        >
          <LoadingSpinner
            v-if="status === 'searching'"
            :size="18"
            class="pointer-events-none !absolute top-4 left-[15px]"
          />
        </Transition>

        <input
          ref="searchInput"
          v-model="query"
          @input="runSearch"
          type="text"
          class="block w-full appearance-none rounded-t-lg border-none py-4 pr-4 pl-[44px] text-base leading-5 outline-none focus:ring-0 dark:bg-zinc-800"
          placeholder="Search ideas"
        />
      </div>

      <div
        class="max-h-[min(calc(100vh-196px),368px)] overflow-auto text-sm"
        :class="{
          'border-t border-slate-200 dark:border-zinc-700':
            status === 'error' ||
            (status === 'idle' &&
              (recentSearches[currentWorkspace.id].length || recentIdeaIds[currentWorkspace.id].length)) ||
            searchResults.length,
        }"
      >
        <div v-if="status === 'idle'">
          <div v-if="recentSearches[currentWorkspace.id].length">
            <div class="px-4 py-1 text-xs text-slate-600 dark:text-zinc-400">Recent searches</div>
            <div
              v-for="(search, index) in cloneDeep(recentSearches[currentWorkspace.id]).sort((a, b) => b.time - a.time)"
              :key="search.time"
              @click="searchFor(search.value)"
              @mouseenter="currentKeyboardIndex = index"
              class="flex w-full items-center px-4 py-1 active:bg-slate-100"
              :class="{ 'bg-slate-50 dark:bg-zinc-700': currentKeyboardIndex === index }"
            >
              <span>
                {{ search.value }}
              </span>
              <span class="ml-auto -mr-2 flex">
                <span
                  class="p-2 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                  @click.stop="removeRecentSearch(search.time)"
                >
                  <XMarkIcon class="h-4 w-4" />
                </span>
              </span>
            </div>
          </div>

          <div v-if="recentIdeas.length" :class="{ 'mt-1': recentSearches[currentWorkspace.id].length }" class="-mb-px">
            <div class="px-4 py-1 text-xs text-slate-600 dark:text-zinc-400">Recent ideas</div>
            <SearchResultIdea
              v-for="(idea, index) in recentIdeas"
              :key="idea.id"
              :idea="idea"
              :identifier-width="recentIdeasIdentifierWidth"
              @opened="openIdea(idea)"
              @mouseenter="currentKeyboardIndex = index + recentSearches[currentWorkspace.id].length"
              :class="{
                'bg-slate-50 dark:bg-zinc-700':
                  currentKeyboardIndex === index + recentSearches[currentWorkspace.id].length,
              }"
            />
          </div>
        </div>

        <div v-else-if="searchResults.length">
          <SearchResultIdea
            v-for="(result, index) in searchResults"
            :class="{ 'bg-slate-50 dark:bg-zinc-700': currentKeyboardIndex === index }"
            @mouseenter="currentKeyboardIndex = index"
            :key="result.id"
            :idea="result"
            @opened="openIdea(result)"
            :identifier-width="resultsIdentifierWidth"
          />
        </div>

        <div v-else-if="status === 'error'" class="p-4">
          Sorry, something went wrong with your search. Please try again.
        </div>
      </div>
    </div>
  </Modal>
</template>
