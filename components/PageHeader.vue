<script setup lang="ts">
import { useStore } from 'vuex'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/solid'
import { PlusIcon } from '@heroicons/vue/20/solid'
import ActiveFilter from './ActiveFilter.vue'
import Dropdown from './Dropdown.vue'
import { computed, ref } from 'vue'
import IdeaFilterDropdown from './IdeaFilterDropdown.vue'
import { IdeaFilter, Idea } from '../types'
import StatusIcon from './StatusIcon.vue'
import ContentFilterModal from './ContentFilterModal.vue'
import { ulid } from 'ulid'
import { truncate } from 'lodash-es'

const store = useStore()

const emit = defineEmits(['apply-filter', 'update-filter', 'remove-filter'])

defineProps<{
  showOptions: boolean
  showFilters: boolean
  ideas?: Idea[]
  filters?: IdeaFilter[]
}>()

const options = computed(() => store.state.base.viewOptions)
const setViewOptions = (options: object) => store.commit('base/setViewOptions', options)

const { currentTeam } = useTeams()
const { currentWorkspace } = useWorkspace()

const toggleAppSidebar = () => store.commit('base/toggleAppSidebar')
const applyFilter = (filter: IdeaFilter) => emit('apply-filter', filter)
const updateFilter = (filter: IdeaFilter) => emit('update-filter', filter)

const contentFilterModalOpen = ref(false)

const openModal = (name: 'content-filter') => {
  if (name === 'content-filter') contentFilterModalOpen.value = true
}

const applyContentFilter = (value: string) => {
  applyFilter({
    id: ulid(),
    type: 'select_content',
    data: value,
  })
}
</script>

<template>
  <div class="text-[.8125rem]">
    <div class="flex items-center py-2 pr-6 pl-6 leading-[36px] lg:pl-10">
      <Bars3Icon
        class="mr-5 -ml-1 h-5 w-5 min-w-[1.25rem] text-slate-700 dark:text-zinc-400 lg:hidden"
        @click="toggleAppSidebar"
      />
      <slot />

      <span v-if="ideas && (showFilters ?? true)" class="ml-2">
        <IdeaFilterDropdown
          :team="currentTeam"
          :workspace="currentWorkspace"
          :active-filters="filters ?? []"
          :ideas="ideas"
          @apply-filter="applyFilter"
          @update-filter="updateFilter"
          @open-modal="openModal"
        />
      </span>

      <span class="ml-auto -mr-1 flex" v-if="showOptions ?? true">
        <Dropdown width="250px" align="right" dont-close-on-click trigger-wrapper-classes="flex">
          <template #trigger="{ open }">
            <button
              type="button"
              class="cursor-default appearance-none rounded px-2 py-[5px] text-[.8125rem] font-medium leading-5 text-slate-800 hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700/50 dark:active:text-zinc-300"
              :class="open ? 'bg-slate-200 dark:bg-zinc-700/50 dark:text-zinc-300' : 'dark:text-zinc-400'"
            >
              <AdjustmentsHorizontalIcon class="h-[18px] w-[18px]" />
            </button>
          </template>

          <template #content>
            <div class="py-1">
              <div class="flex w-full items-center px-3">
                <label class="text-xs font-medium text-slate-600 dark:text-zinc-300">Sort by:</label>
                <select
                  :value="options.sort"
                  @change="setViewOptions({ sort: ($event.target as HTMLInputElement).value })"
                  class="ml-auto appearance-none rounded border-none bg-slate-100 p-0 pl-2 pr-8 text-xs leading-6 dark:bg-zinc-700"
                >
                  <option value="created">Date created</option>
                  <option value="updated">Last updated</option>
                  <option value="upvotes">Most upvotes</option>
                </select>
              </div>
            </div>
          </template>
        </Dropdown>
      </span>
    </div>

    <div v-if="(showFilters ?? true) && (filters ?? []).length" class="text-xs text-slate-700">
      <div class="flex items-center space-x-2 pb-3 pl-6 lg:pl-10">
        <ActiveFilter v-for="filter in filters" :filter="filter" @remove="emit('remove-filter', filter)">
          <template v-if="filter.type === 'select_status'">
            <span class="flex items-center">
              <StatusIcon :category="filter.data.category" />
              <span class="ml-1">{{ filter.data.name }}</span>
            </span>
          </template>

          <template v-if="filter.type === 'select_creator'">
            <span class="flex items-center">
              <img
                class="ml-1 h-[17px] w-[17px] min-w-[17px] rounded-full object-cover"
                :src="filter.data.profile_photo_url"
              />
              <span class="ml-1">{{ filter.data.name }}</span>
            </span>
          </template>

          <template v-if="filter.type === 'select_labels'">
            <span class="flex items-center">
              <span class="mr-[6px] flex items-center space-x-[3px]">
                <span
                  v-for="label in filter.data"
                  :key="label.id"
                  class="h-2 w-2 rounded-full"
                  :style="{ backgroundColor: label.color }"
                ></span>
              </span>

              <span>
                <template v-if="filter.data.length > 1"> {{ filter.data.length }} labels </template>
                <template v-else>{{ filter.data[0].name }}</template>
              </span>
            </span>
          </template>

          <template v-if="filter.type === 'select_content'">
            <span>
              {{ truncate(filter.data) }}
            </span>
          </template>
        </ActiveFilter>

        <IdeaFilterDropdown
          v-if="ideas && (showFilters ?? true)"
          :team="currentTeam"
          :workspace="currentWorkspace"
          :active-filters="filters ?? []"
          :ideas="ideas"
          @apply-filter="applyFilter"
          @update-filter="updateFilter"
          @open-modal="openModal"
        >
          <PlusIcon class="h-4 w-4 dark:text-zinc-400" />
        </IdeaFilterDropdown>
      </div>
    </div>

    <ContentFilterModal
      :open="contentFilterModalOpen"
      @close="contentFilterModalOpen = false"
      @apply="applyContentFilter"
    />
  </div>
</template>
