<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ulid } from 'ulid'
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import { DocumentIcon, PresentationChartLineIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { Idea, Label, PartialIdea, Team } from '../types'
import { generateTempIdea } from '../helpers/ideas'
import Tiptap from './Tiptap.vue'
import IdeaLabelDropdown from './IdeaLabelDropdown.vue'
import IdeaStatusDropdown from './IdeaStatusDropdown.vue'
import StatusIcon from './StatusIcon.vue'
import ModalBg from './ModalBg.vue'
import ModalWrapper from './ModalWrapper.vue'
import TeamDropdown from './TeamDropdown.vue'

const props = defineProps<{
  open: boolean
}>()

interface NewIdea {
  id: string | null
  title: string
  team_id: string | null
  description: string
  status_id: string | null
  labels: Label[]
  created_at: string | null
  updated_at: string | null
  creator_id: string | null
  team_idea_id: number | null
}

const newIdea = ref<NewIdea>({
  id: null,
  title: '',
  team_id: null,
  description: '',
  status_id: null,
  labels: [],
  created_at: null,
  updated_at: null,
  creator_id: null,
  team_idea_id: null,
})

const emit = defineEmits(['close', 'expand'])

const store = useStore()
const router = useRouter()
const { currentTeam, setCurrentTeam } = useTeams()
const { currentWorkspace, cantCreateNewIdeas } = useWorkspace()

const currentTeamIdeas = computed<Idea[]>(() => store.getters['base/currentTeamIdeas'])
const baseIdea = computed(() => store.state.newIdea.idea)

const allLabels = computed(() => currentTeam.value.labels)

const ideaTitle = ref<HTMLInputElement | null>(null)
const descriptionElement = ref<HTMLInputElement | null>(null)

watch(
  () => props.open,
  status => {
    if (status) {
      const defaultStatus = currentTeam.value.statuses.find(status => status.default)
      if (!defaultStatus) throw new Error('Missing default team status')

      newIdea.value.status_id = defaultStatus.id
      newIdea.value.team_id = currentTeam.value.id
      newIdea.value.title = baseIdea.value.title
      newIdea.value.description = baseIdea.value.description
      newIdea.value.labels = baseIdea.value.labels
      newIdea.value.creator_id = store.state.base.user.id
    }
  }
)

watch(currentTeam, value => {
  if (!value.statuses.map(s => s.id).includes(newIdea.value.status_id || ''))
    newIdea.value.status_id = value.statuses.find(status => status.default === true)?.id || null

  newIdea.value.labels = []
})

watch(newIdea, idea => setIdea(idea as Idea), { deep: true })

const setIdea = (idea: Idea) => store.commit('newIdea/setIdea', idea)

const addIdeas = (ideas: Idea[]) => store.commit('base/addIdeas', ideas)
const { subscribeToIdea } = useIdeaSubscriptions()
const showToast = (data: { type: string; data: unknown }) => store.commit('base/showToast', data)

const saveNewIdea = async ({ team, idea }: { team: Team; idea: Idea }) =>
  store.dispatch('base/saveNewIdea', { team, idea })
const saveLabel = async (label: Label) => store.dispatch('base/saveLabel', label)

const close = () => emit('close')

function openExpandedView() {
  const url = `/${currentWorkspace.value.slug}/new`
  router.push(url)
  emit('expand')
  close()
}

function selectStatus(id: string) {
  newIdea.value.status_id = id
}

function selectTeam(id: Team['id']) {
  setCurrentTeam({ workspaceId: currentWorkspace.value.id, teamId: id })
}

function toggleLabel(id: string) {
  if (!newIdea.value.labels.find(label => label.id === id)) {
    const label = allLabels.value.find(label => label.id === id)
    if (label) newIdea.value.labels.push(label)
  } else {
    newIdea.value.labels.splice(
      newIdea.value.labels.findIndex(label => label.id === id),
      1
    )
  }
}

async function createAndSelectNewCustomLabel({ color, name }: { color: string; name: string }) {
  // Save the label to the database and the list of team labels
  const id = ulid()

  const label = {
    id,
    name,
    color,
  }

  currentTeam.value.labels.push(label)

  newIdea.value.labels.push(label)

  const newLabel = await saveLabel({ id, name, color })
  newIdea.value.labels.splice(newIdea.value.labels.length - 1, 1, newLabel)
}

async function saveIdea() {
  // Scaffold a temporary idea until the server request comes back
  const idea = generateTempIdea(newIdea.value as PartialIdea, currentTeam.value, currentTeamIdeas.value)

  addIdeas([idea])
  subscribeToIdea(idea)

  emit('close')

  showToast({ type: 'idea-creation', data: idea })

  saveNewIdea({ team: currentTeam.value, idea })

  reset()
}

function reset() {
  const defaultStatus = currentTeam.value.statuses.find(status => status.default)
  if (!defaultStatus) throw new Error('Missing default team status')

  newIdea.value = {
    id: null,
    title: '',
    team_id: currentTeam.value.id,
    description: '',
    status_id: defaultStatus.id,
    labels: [],
    created_at: null,
    updated_at: null,
    creator_id: null,
    team_idea_id: null,
  }
}

function handleTitleEnterPress(e: KeyboardEvent) {
  if (e.key !== 'Enter') return

  if (!(e.ctrlKey || e.metaKey)) {
    e.preventDefault()

    // @ts-ignore
    descriptionElement.value?.focusEditor()
  } else if (e.ctrlKey || e.metaKey) {
    e.preventDefault()

    saveIdea()
  }
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" @close="close" class="relative z-10" @click.self="close" :initial-focus="ideaTitle">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel
          class="mx-auto w-full max-w-[600px] rounded-lg bg-white shadow-3xl dark:border dark:border-zinc-600 dark:bg-zinc-800 md:mt-[12vh]"
        >
          <form class="relative flex w-full flex-col" @submit.prevent="saveIdea">
            <span class="absolute top-6 right-6 z-10 flex bg-white dark:bg-zinc-800">
              <button
                type="button"
                @click="openExpandedView"
                class="group mr-[6px] flex w-[30px] cursor-default appearance-none items-center justify-center rounded p-[6px] hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-zinc-700 dark:active:bg-zinc-700"
              >
                <svg
                  class="h-3 w-4 text-slate-500 group-hover:text-slate-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.75 0.75C7.75 0.335786 8.08579 0 8.5 0H11.25C11.6642 0 12 0.335786 12 0.75V3.5C12 3.91421 11.6642 4.25 11.25 4.25C10.8358 4.25 10.5 3.91421 10.5 3.5V2.56066L7.78033 5.28033C7.48744 5.57322 7.01256 5.57322 6.71967 5.28033C6.42678 4.98744 6.42678 4.51256 6.71967 4.21967L9.43934 1.5H8.5C8.08579 1.5 7.75 1.16421 7.75 0.75ZM5.28033 6.71967C5.57322 7.01256 5.57322 7.48744 5.28033 7.78033L2.56066 10.5H3.5C3.91421 10.5 4.25 10.8358 4.25 11.25C4.25 11.6642 3.91421 12 3.5 12H0.75C0.335786 12 0 11.6642 0 11.25V8.5C0 8.08579 0.335786 7.75 0.75 7.75C1.16421 7.75 1.5 8.08579 1.5 8.5V9.43934L4.21967 6.71967C4.51256 6.42678 4.98744 6.42678 5.28033 6.71967Z"
                  ></path>
                </svg>
              </button>

              <button
                type="button"
                class="group cursor-default appearance-none rounded p-[6px] hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-zinc-700 dark:active:bg-zinc-700"
                @click="$emit('close')"
              >
                <XMarkIcon
                  class="h-[18px] w-[18px] text-slate-500 group-hover:text-slate-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
                />
              </button>
            </span>

            <div class="px-6 pb-3 pt-6">
              <input
                ref="ideaTitle"
                type="text"
                :tabindex="open ? 0 : -1"
                placeholder="Title"
                v-model="newIdea.title"
                required
                @keydown.enter="handleTitleEnterPress"
                class="mb-3 block w-full border-none p-0 pr-[76px] text-[18px] font-medium leading-7 placeholder-slate-400 focus:border-none focus:ring-0 dark:bg-zinc-800 dark:placeholder-zinc-500"
              />

              <Tiptap
                ref="descriptionElement"
                @save="saveIdea"
                v-model="newIdea.description"
                class="max-h-[500px] min-h-[60px] overflow-y-auto"
              />
            </div>

            <div class="flex items-center px-6 pb-5 pt-[6px] text-xs" v-if="currentTeam">
              <div class="relative">
                <TeamDropdown v-slot="{ open, toggleOpen }" @selected="selectTeam">
                  <button
                    type="button"
                    class="mr-2 inline-flex cursor-default appearance-none items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-xs leading-7 text-slate-700 dark:border-none dark:bg-zinc-700 dark:text-zinc-200"
                    @click="toggleOpen"
                  >
                    <DocumentIcon class="mr-1 h-[13px] w-[13px]" />
                    <span>{{ currentTeam.name }}</span>
                  </button>
                </TeamDropdown>
              </div>

              <div class="relative">
                <IdeaStatusDropdown
                  :statuses="currentTeam.statuses"
                  v-slot="{ open, toggleOpen }"
                  @selected="selectStatus"
                >
                  <button
                    type="button"
                    class="inline-flex cursor-default appearance-none items-center rounded-md border border-slate-200 bg-slate-50 px-3 leading-7 text-slate-700 dark:border-none dark:bg-zinc-700 dark:text-zinc-200"
                    @click="toggleOpen"
                    :class="{ 'bg-slate-200': open }"
                  >
                    <StatusIcon
                      :category="currentTeam?.statuses.find(({ id }) => id === newIdea.status_id)?.category"
                      class="mr-1.5"
                    />
                    <span>{{ currentTeam?.statuses.find(({ id }) => id === newIdea.status_id)?.name }}</span>
                  </button>
                </IdeaStatusDropdown>
              </div>

              <div class="relative ml-2">
                <IdeaLabelDropdown
                  v-if="allLabels"
                  v-slot="{ open, toggleOpen }"
                  :labels="allLabels"
                  :selected="newIdea.labels.map(({ id }) => id)"
                  position="bottom"
                  @toggle="toggleLabel"
                  @create-custom="createAndSelectNewCustomLabel"
                >
                  <button
                    type="button"
                    class="inline-block cursor-default appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 leading-7 text-slate-700 dark:border-none dark:bg-zinc-700 dark:text-zinc-200"
                    @click="toggleOpen"
                    :class="{ 'bg-slate-200': open }"
                  >
                    <span :class="{ 'mr-1': newIdea.labels.length }">
                      <template v-if="!newIdea.labels.length">Labels</template>
                      <template v-else-if="newIdea.labels.length === 1">
                        {{ newIdea.labels[0].name }}
                      </template>
                      <template v-else="newIdea.labels.length === 1"> {{ newIdea.labels.length }} Labels </template>
                    </span>

                    <template v-if="newIdea.labels.length">
                      <span
                        v-for="label in newIdea.labels"
                        :key="label.id"
                        class="mr-1 inline-block h-2 w-2 rounded-full"
                        :style="{ backgroundColor: label.color }"
                      ></span>
                    </template>
                  </button>
                </IdeaLabelDropdown>
              </div>
            </div>

            <div
              class="flex items-center rounded-b-lg border-t border-slate-150 bg-[#fafbfe] py-[14px] px-6 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <NuxtLink
                :href="`/${currentWorkspace.slug}/settings/plans`"
                v-if="cantCreateNewIdeas"
                class="flex cursor-default items-center rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium leading-5 text-blue-800"
              >
                <PresentationChartLineIcon class="mr-2 h-[18px] w-[18px]" />
                <span>Upgrade to add new ideas</span>
              </NuxtLink>

              <div class="ml-auto">
                <button
                  type="submit"
                  class="inline-flex cursor-default whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm active:translate-y-px active:shadow-none dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:shadow"
                  :disabled="cantCreateNewIdeas"
                >
                  Save idea
                </button>
              </div>
            </div>
          </form>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
