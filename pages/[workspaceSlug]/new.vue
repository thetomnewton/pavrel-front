<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { generateTempIdea } from '../../helpers/ideas'
import { Idea, PartialIdea, Team } from '../../types'
import { ulid } from 'ulid'
import { Bars3BottomRightIcon } from '@heroicons/vue/24/solid'
import { PresentationChartLineIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'auth',
})

useHead({
  title: 'New idea',
})

const store = useStore()
const router = useRouter()

const { user } = useUsers()
const { currentWorkspace, cantCreateNewIdeas } = useWorkspace()
const team = computed<Team>(() => store.getters['base/currentTeam'])
const idea = computed(() => store.state.newIdea.idea)
const defaultStatus = computed(() => team.value?.statuses.find(status => status.default))
const showToast = (data: { type: string; data: object }) => store.commit('base/showToast', data)
const resetIdea = () => store.commit('newIdea/resetIdea')
const titleEl = ref(null)
const content = ref(null)
const sidebarOpen = ref(false)

const newIdea = ref<Idea>({
  id: ulid(),
  title: idea.value.title,
  description: idea.value.description,
  status_id: idea.value.status_id,
  labels: idea.value.labels,
  creator_id: user.value.id,
  team_id: team.value?.id,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  team_idea_id: 0,
})

function updateStatus(id: string) {
  newIdea.value.status_id = id
}

watch(defaultStatus, async newStatus => {
  if (newStatus != null && newIdea.value.status_id == null) newIdea.value.status_id = newStatus.id
})

watch(team, newTeam => (newIdea.value.team_id = newTeam.id))

async function create() {
  const idea = generateTempIdea(newIdea.value as PartialIdea, team.value, store.state.base.ideas)

  store.commit('base/addIdeas', [idea])
  store.commit('base/subscribeToIdea', { idea })

  showToast({ type: 'idea-creation', data: idea })

  store.dispatch('base/saveNewIdea', {
    team: team.value,
    idea,
  })

  resetIdea()

  router.push(`/${currentWorkspace.value.slug}/ideas/${team.value.slug}-${idea.team_idea_id}`)
}

function addLabel(id: string) {
  const label = team.value.labels.find(label => label.id === id)
  if (label) newIdea.value.labels.push(label)
}

function removeLabel(id: string) {
  const index = newIdea.value.labels.findIndex(item => item.id === id)
  if (index >= 0) newIdea.value.labels.splice(index, 1)
}

function handleTitleEnterPress(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) {
    create()
  } else {
    // @ts-ignore
    content.value?.focusEditor()
  }
}

onMounted(() => {
  setTimeout(() => {
    if (!newIdea.value.title) document.querySelector('textarea')?.focus()
    // @ts-ignore
    else content.value?.focusEditor()
  }, 500)
})
</script>

<template>
  <div class="flex h-full" v-if="team">
    <section class="flex min-w-0 flex-1 flex-col">
      <div class="w-full text-[.8125rem] font-medium">
        <PageHeader :show-options="false" :show-filters="false">
          <span>
            <span class="cursor-default">{{ team.name }}</span>
            <span class="mx-1 inline-block">›</span>
            <span class="cursor-default">New idea</span>
          </span>

          <span class="ml-auto flex items-center">
            <RouterLink
              v-if="currentWorkspace && team"
              class="mr-2 cursor-default rounded px-[10px] py-1 text-xs font-medium leading-[22px] text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 dark:active:bg-zinc-700/50 dark:active:text-zinc-200"
              :to="`/${currentWorkspace.slug}/teams/${team.slug}/ideas/all`"
            >
              Cancel
            </RouterLink>

            <BaseButton
              @click="create"
              type="button"
              button="primary"
              class="cursor-default leading-5"
              :disabled="cantCreateNewIdeas"
            >
              Save
            </BaseButton>

            <span class="ml-2 rounded py-[5px] px-[6px] hover:bg-slate-100 lg:hidden" @click="sidebarOpen = true">
              <Bars3BottomRightIcon class="h-5 w-5 min-w-[1.25rem] text-slate-600" />
            </span>
          </span>
        </PageHeader>
      </div>

      <div class="flex w-full flex-1 overflow-y-auto">
        <div class="mx-auto flex w-full max-w-4xl flex-col pl-6 pr-6 lg:pl-10">
          <NuxtLink
            :href="`/${currentWorkspace.slug}/settings/plans`"
            v-if="cantCreateNewIdeas"
            class="flex max-w-[205px] cursor-default items-center rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium leading-5 text-blue-800"
          >
            <PresentationChartLineIcon class="mr-2 h-[18px] w-[18px]" />
            <span>Upgrade to add new ideas</span>
          </NuxtLink>

          <EditableIdeaTitle @entered="handleTitleEnterPress" v-model="newIdea.title" ref="titleEl" required />

          <Tiptap ref="content" v-model="(newIdea.description as string)" @save="create" />
        </div>
      </div>
    </section>

    <IdeaContentSidebar
      :creating="true"
      :sidebar-open="sidebarOpen"
      :idea="newIdea"
      @status-update="updateStatus"
      @add-label="addLabel"
      @remove-label="removeLabel"
      @close-sidebar="sidebarOpen = false"
    />
  </div>
</template>
