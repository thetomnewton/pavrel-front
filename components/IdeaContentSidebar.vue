<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EyeIcon, EyeSlashIcon, Bars3BottomRightIcon, PlusIcon } from '@heroicons/vue/24/solid'
import api from '../api'
import IdeaLabel from '../components/IdeaLabel.vue'
import IdeaLabelDropdown from '../components/IdeaLabelDropdown.vue'
import IdeaStatusDropdown from '../components/IdeaStatusDropdown.vue'
import StatusIcon from '../components/StatusIcon.vue'
import { Idea, Label, Team } from '../types'
import dayjs from 'dayjs'
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'
import { ulid } from 'ulid'
import vClickOutside from '../directives/click-outside'

const emit = defineEmits(['close-sidebar', 'status-update', 'add-label', 'remove-label'])

const props = defineProps<{
  idea: Idea
  sidebarOpen?: boolean
  creating?: boolean
  hideMenuCloseIcon?: boolean
}>()

const { getUserById, userIsSubscribedTo } = useUsers()
const { currentWorkspace } = useWorkspace()
const { subscribeToIdeaAction, unsubscribeFromIdeaAction } = useIdeaSubscriptions()
const { addLabelToIdea, removeLabelFromIdea, saveIdeaLabel } = useIdeaLabels()

const labels = ref<string[]>([])

const { getTeamFromIdea } = useTeams()
const team = computed<Team | undefined>(() => getTeamFromIdea.value(props.idea))

const allTeamLabels = computed(() => team.value?.labels ?? [])

const formattedIdeaCreatedAt = computed(() => {
  const string = dayjs(props.idea.created_at).year() === dayjs().year() ? 'MMM DD' : 'MMM D YYYY'

  return dayjs(props.idea.created_at).format(string)
})

watch(
  () => props.idea.labels,
  value => {
    labels.value = value.map(value => (typeof value === 'string' ? value : value.id))
  },
  { deep: true }
)

watch(
  props.idea,
  newIdea => {
    labels.value = newIdea?.labels?.map(value => (typeof value === 'string' ? value : value.id))
  },
  { immediate: true, deep: true }
)

function toggleLabel(id: string) {
  if (!labels.value.includes(id)) {
    labels.value.push(id)

    attachLabelToIdea(id)
  } else {
    labels.value.splice(
      labels.value.findIndex(label => label === id),
      1
    )

    detachIdeaLabel(id)
  }
}

function attachLabelToIdea(id: Label['id']) {
  emit('add-label', id)

  if (props.creating) return

  addLabelToIdea({ ideaId: props.idea.id, labelId: id, labels: team.value?.labels ?? [] })

  api.post(`/workspaces/${currentWorkspace.value.id}/ideas/${props.idea.id}/labels`, { label_id: id })
}

function detachIdeaLabel(id: Label['id']) {
  emit('remove-label', id)

  if (props.creating) return

  removeLabelFromIdea({ ideaId: props.idea.id, labelId: id })

  // Detach the label from the idea in the database
  api.delete(`/workspaces/${currentWorkspace.value.id}/ideas/${props.idea.id}/labels/${id}`)
}

async function createAndSelectNewCustomLabel({ color, name }: { color: string; name: string }) {
  // Save the label to the database and the list of team labels
  const id = ulid()

  team.value?.labels.push({ id, name, color })

  labels.value.push(id)

  const newLabel = await saveIdeaLabel({ name, color, id })
  labels.value.splice(labels.value.length - 1, 1, newLabel.id)

  attachLabelToIdea(newLabel.id)
}

function closeViaOutsideClick() {
  if (props.sidebarOpen) emit('close-sidebar')
}
</script>

<template>
  <div
    v-click-outside="closeViaOutsideClick"
    class="absolute top-0 right-0 bottom-0 z-10 w-[250px] max-w-[250px] border-l border-slate-150 bg-white text-[.8125rem] shadow transition dark:border-zinc-800 dark:bg-zinc-900 lg:static lg:block lg:shadow-none lg:transition-none"
    :class="{
      'pointer-events-none translate-x-[50px] opacity-0 lg:pointer-events-auto lg:translate-x-0 lg:opacity-100':
        !sidebarOpen,
    }"
  >
    <div
      class="mx-6 flex cursor-default items-center border-b border-slate-150 py-2 font-medium leading-9 text-slate-500 dark:border-zinc-800 dark:text-zinc-400"
      v-if="idea && team"
    >
      <span v-if="!creating">{{ team.slug }}-{{ idea.team_idea_id }}</span>
      <span v-else>Details</span>

      <span class="ml-auto flex items-center space-x-1">
        <span
          v-if="!creating"
          @click="userIsSubscribedTo(idea) ? unsubscribeFromIdeaAction(idea) : subscribeToIdeaAction(idea)"
          class="cursor-default rounded p-[10px] hover:bg-slate-150 active:bg-slate-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 dark:active:bg-zinc-700/50"
        >
          <EyeSlashIcon v-if="userIsSubscribedTo(idea)" class="h-4 w-4" />
          <EyeIcon v-else class="h-4 w-4" />
        </span>

        <span
          v-if="hideMenuCloseIcon !== true"
          @click="$emit('close-sidebar')"
          class="rounded bg-slate-200 p-2 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300 lg:hidden"
        >
          <Bars3BottomRightIcon class="h-5 w-5 min-w-[1.25rem]" />
        </span>
      </span>
    </div>

    <div class="space-y-2 py-4 px-6" v-if="team">
      <div class="">
        <div class="text-xs text-slate-500 dark:text-zinc-400">Status</div>

        <div class="relative -ml-[10px]">
          <IdeaStatusDropdown
            :statuses="team.statuses"
            v-slot="{ open, toggleOpen }"
            @selected="$emit('status-update', $event)"
          >
            <div
              @click="toggleOpen"
              class="flex cursor-default items-center rounded py-1 px-[10px] leading-5 active:bg-slate-200 dark:active:bg-zinc-700/70"
              :class="{ 'bg-slate-200 dark:bg-zinc-700/70': open, 'hover:bg-slate-150 dark:hover:bg-zinc-800': !open }"
            >
              <StatusIcon :category="team.statuses.find(({ id }) => id === idea?.status_id)?.category" class="mr-2" />
              <span>{{ team.statuses.find(({ id }) => id === idea?.status_id)?.name }}</span>
            </div>
          </IdeaStatusDropdown>
        </div>
      </div>

      <div class="">
        <div class="text-xs text-slate-500 dark:text-zinc-400">Labels</div>
        <div class="flex max-w-[250px] flex-1 flex-wrap items-center leading-7">
          <div class="-ml-[5px] flex flex-wrap items-center">
            <IdeaLabel
              v-for="id in labels"
              :key="id"
              class="my-px mr-2"
              :color="allTeamLabels.find(label => label.id === id)?.color || '#fff'"
            >
              {{ allTeamLabels.find(label => label.id === id)?.name }}
            </IdeaLabel>

            <div class="relative inline-flex">
              <IdeaLabelDropdown
                v-slot="{ open, toggleOpen }"
                :labels="allTeamLabels"
                :selected="labels"
                position="left"
                @toggle="toggleLabel"
                @create-custom="createAndSelectNewCustomLabel"
              >
                <span
                  @click="toggleOpen"
                  class="inline-flex cursor-default whitespace-nowrap rounded py-1 px-[10px] leading-[18px] text-slate-900 active:bg-slate-200 dark:text-zinc-300 dark:active:bg-zinc-700/50"
                  :class="{
                    'bg-slate-200 dark:bg-zinc-700/50': open,
                    'hover:bg-slate-150 dark:hover:bg-zinc-800': !open,
                  }"
                >
                  <span
                    class="mr-[7px] -ml-[5px] inline-flex h-[17px] w-[17px] min-w-[17px] items-center justify-center"
                  >
                    <PlusIcon class="h-[14px] w-[14px] text-slate-500 dark:text-zinc-400" />
                  </span>

                  <span>Add label</span>
                </span>
              </IdeaLabelDropdown>
            </div>
          </div>
        </div>
      </div>

      <div class="">
        <div class="text-xs text-slate-500 dark:text-zinc-400">Creator</div>

        <div class="relative">
          <div class="flex items-center rounded py-1 pr-[10px]">
            <img
              :src="getUserById(idea.creator_id)?.profile_photo_url"
              class="h-[17px] w-[17px] min-w-[1rem] rounded-full"
            />

            <span class="ml-2 cursor-default leading-5">{{ getUserById(idea.creator_id)?.name }}</span>
          </div>
        </div>
      </div>

      <div class="" v-if="!creating">
        <div class="text-xs text-slate-500 dark:text-zinc-400">Added</div>

        <div class="relative">
          <div class="flex items-center">
            <CalendarDaysIcon class="ml-px mr-2 h-4 w-4 text-slate-500 dark:text-zinc-400" />
            <span class="cursor-default">{{ formattedIdeaCreatedAt }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
