<script setup lang="ts">
import { FunnelIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'
import { IdeaFilter, Idea, IdeaStatus, Team, User, Workspace, Label } from '../types'
import StatusIcon from './StatusIcon.vue'
import { ulid } from 'ulid'
import { cloneDeep } from 'lodash-es'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const { getUserById } = useUsers()

const props = defineProps<{
  team: Team
  workspace: Workspace
  ideas: Idea[]
  activeFilters?: IdeaFilter[]
}>()

const emit = defineEmits(['apply-filter', 'update-filter', 'open-modal'])

const screen = ref('base')

function openScreen(name: string) {
  screen.value = name
}

function resetScreen() {
  setTimeout(() => (screen.value = 'base'), 150)
}

const allIdeaStatuses = computed(() => [...new Set(props.ideas.map(idea => idea.status_id))])
const possibleIdeaStatuses = computed(() => props.team.statuses.filter(({ id }) => allIdeaStatuses.value.includes(id)))
const statusCount = (id: IdeaStatus['id']) => props.ideas.filter(idea => idea.status_id === id).length
const applyFilter = (filter: IdeaFilter) => {
  emit('apply-filter', filter)
  resetScreen()
}

const possibleIdeaCreators = computed<User[]>(() => {
  const isUser = (user: User | undefined): user is User => !!user

  return [...new Set(props.ideas.map(idea => idea.creator_id))].map(id => getUserById(id)).filter(isUser)
})
const ideaCount = (id: User['id']) => props.ideas.filter(idea => idea.creator_id === id).length

const ideasMatchingLabel = (label: Label) =>
  props.ideas.filter(idea => idea.labels.map(l => l.id).includes(label.id)).length

const toggleOrUpdateLabelFilter = (label: Label, callback = () => {}) => {
  const index = props.activeFilters?.findIndex(f => f.type === 'select_labels')

  // If there is no label filter, create one and apply the selected label
  if (index === undefined || index === -1) {
    emit('apply-filter', {
      id: ulid(),
      type: 'select_labels',
      data: [label],
    })

    callback()
    return
  }

  if (props.activeFilters === undefined) return

  let data = cloneDeep(props.activeFilters[index]).data

  if (!Array.isArray(data)) return

  // If this label is already selected within the labels, remove it. Else, add it
  if (data.map(l => l.id).includes(label.id)) data = data.filter(l => l.id !== label.id)
  else data.push(label)

  emit('update-filter', {
    id: props.activeFilters[index].id,
    type: props.activeFilters[index].type,
    data,
  })

  callback()
}

function hasLabelFilterFor(label: Label) {
  return !!props.activeFilters?.find(
    filter => filter.type === 'select_labels' && filter.data.map(f => f.id).includes(label.id)
  )
}

const openContentFilterModal = () => {
  emit('open-modal', 'content-filter')
  resetScreen()
}
</script>

<template>
  <Menu as="div" class="relative flex">
    <MenuButton
      as="div"
      @click="screen = 'base'"
      class="cursor-default rounded px-2 py-[5px] text-[.8125rem] font-medium leading-5 hover:bg-slate-100 active:bg-slate-200 ui-open:bg-slate-200 dark:hover:bg-zinc-800 dark:ui-open:bg-zinc-700/50"
    >
      <slot>
        <FunnelIcon class="h-[18px] w-[18px] text-slate-800 dark:text-zinc-400" />
      </slot>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute left-0 top-[calc(100%+4px)] z-10 w-[190px] rounded border border-slate-200 bg-white py-1 text-[.8125rem] text-slate-900 shadow outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      >
        <div v-if="screen === 'base'">
          <MenuItem
            as="div"
            v-slot="{ active }"
            v-if="!activeFilters?.map(({ type }) => type).includes('select_status')"
          >
            <div
              class="cursor-default px-3 leading-7 active:bg-slate-200 dark:active:bg-zinc-700"
              :class="[
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-zinc-700/50 dark:text-zinc-200'
                  : 'text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200',
              ]"
              @click.stop="openScreen('select_status')"
              @keydown.enter.stop="openScreen('select_status')"
            >
              Status
            </div>
          </MenuItem>

          <MenuItem
            as="div"
            v-slot="{ active }"
            v-if="!activeFilters?.map(({ type }) => type).includes('select_creator')"
          >
            <div
              class="cursor-default px-3 leading-7 active:bg-slate-200 dark:active:bg-zinc-700"
              :class="[
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-zinc-700/50 dark:text-zinc-200'
                  : 'text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200',
              ]"
              @click.stop="openScreen('select_creator')"
            >
              Creator
            </div>
          </MenuItem>

          <MenuItem as="div" v-slot="{ active }">
            <div
              class="cursor-default px-3 leading-7 active:bg-slate-200 dark:active:bg-zinc-700"
              :class="[
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-zinc-700/50 dark:text-zinc-200'
                  : 'text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200',
              ]"
              @click.stop="openScreen('select_labels')"
            >
              Labels
            </div>
          </MenuItem>

          <MenuItem as="div" v-slot="{ active }">
            <div
              class="cursor-default px-3 leading-7 active:bg-slate-200 dark:active:bg-zinc-700"
              :class="[
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-zinc-700/50 dark:text-zinc-200'
                  : 'text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200',
              ]"
            >
              Date created
            </div>
          </MenuItem>

          <MenuItem as="div" v-slot="{ active }">
            <div
              class="cursor-default px-3 leading-7 active:bg-slate-200 dark:active:bg-zinc-700"
              :class="[
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-zinc-700/50 dark:text-zinc-200'
                  : 'text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200',
              ]"
              @click="openContentFilterModal"
            >
              Content
            </div>
          </MenuItem>

          <MenuItem as="div" v-slot="{ active }">
            <div
              class="cursor-default px-3 leading-7 active:bg-slate-200 dark:active:bg-zinc-700"
              :class="[
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-zinc-700/50 dark:text-zinc-200'
                  : 'text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200',
              ]"
            >
              Upvotes
            </div>
          </MenuItem>
        </div>

        <div v-if="screen === 'select_status'">
          <MenuItem
            as="div"
            v-slot="{ active }"
            v-for="status in possibleIdeaStatuses"
            :key="status.id"
            @click="
              applyFilter({
                id: ulid(),
                type: 'select_status',
                data: status,
              })
            "
          >
            <div
              class="flex cursor-default items-center px-3 leading-7 active:bg-slate-200 dark:active:bg-zinc-700"
              :class="[
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-zinc-700/50 dark:text-zinc-200'
                  : 'text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200',
              ]"
            >
              <StatusIcon :category="status.category" />
              <span class="ml-3">{{ status.name }}</span>
              <span class="ml-2 font-normal text-slate-500">{{ statusCount(status.id) }}</span>
            </div>
          </MenuItem>
        </div>

        <div v-if="screen === 'select_creator'">
          <MenuItem as="div" v-for="user in possibleIdeaCreators" :key="user.id" v-slot="{ active }">
            <div
              class="flex cursor-default items-center px-3 leading-7 active:bg-slate-200 dark:active:bg-zinc-700"
              :class="[
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-zinc-700/50 dark:text-zinc-200'
                  : 'text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200',
              ]"
              @click="
                applyFilter({
                  id: ulid(),
                  type: 'select_creator',
                  data: user,
                })
              "
            >
              <img class="min-w-5 h-5 w-5 rounded-full object-cover" :src="user.profile_photo_url" />
              <span class="ml-3">{{ user.name }}</span>
              <span class="ml-2 font-normal text-slate-500">{{ ideaCount(user.id) }}</span>
            </div>
          </MenuItem>
        </div>

        <div v-if="screen === 'select_labels'">
          <MenuItem as="div" v-slot="{ active }" v-for="label in team.labels" :key="label.id">
            <div
              class="flex cursor-default items-center px-3 leading-7 active:bg-slate-200 dark:active:bg-zinc-700"
              :class="[
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-zinc-700/50 dark:text-zinc-200'
                  : 'text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200',
              ]"
              @click="toggleOrUpdateLabelFilter(label)"
            >
              <Checkbox
                @click.stop=""
                :checked="hasLabelFilterFor(label)"
                @update:checked="toggleOrUpdateLabelFilter(label)"
                class="mr-3"
              />
              <span class="mr-2 h-2 w-2 rounded-full" :style="{ backgroundColor: label.color }"></span>
              <span>{{ label.name }}</span>
              <span class="ml-2 font-normal text-slate-500">{{ ideasMatchingLabel(label) }}</span>
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
