<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { Bars3BottomRightIcon } from '@heroicons/vue/24/solid'
import { Idea, Label, Team } from '../../../../types'

definePageMeta({
  middleware: 'auth',
})

const store = useStore()
const router = useRouter()
const route = useRoute()

const workspaceSlug = route.params.workspaceSlug
const ideaSlug = route.params.ideaSlug as string
const teamSlug = ideaSlug.split('-')[0]
const teamIdeaId = +ideaSlug.split('-')[1]

const { pushToRecentIdeas } = useRecentIdeas()

const newIdea = ref<Idea | null>(null)
const sidebarOpen = ref(false)

const currentWorkspace = computed(() => store.getters['base/currentWorkspace'])
const currentWorkspaceTeams = computed(() => store.getters['base/currentWorkspaceTeams'])
const isFavorite = computed(() => store.getters['base/isFavorite'])
const ideas = computed<Idea[]>(() => store.state.base.ideas)

const idea = computed<Idea | undefined>(() => ideas.value.find(idea => idea.team_idea_id === +teamIdeaId))
const team = computed<Team>(() => currentWorkspaceTeams.value?.find((team: Team) => team.slug === teamSlug))

const updateIdea = (idea: Idea) => store.dispatch('base/updateIdea', idea)
const toggleFavorite = (idea: Idea) => store.dispatch('base/toggleFavorite', idea)

useHead({
  title: `${team.value?.slug}-${idea.value?.team_idea_id}: ${idea.value?.title}`,
})

function updateStatus(id: string) {
  if (!newIdea.value) return

  newIdea.value.status_id = id
  updateIdea(newIdea.value)
}

function addLabel(id: string) {
  const label = team.value.labels.find((label: Label) => label.id === id)

  if (label) newIdea.value?.labels.push(label)
}

function removeLabel(id: string) {
  if (!newIdea.value) return

  newIdea.value.labels.splice(
    newIdea.value.labels.findIndex(item => item.id === id),
    1
  )
}

function handleDeletion() {
  router.push(`/${workspaceSlug}/drafts`)
}

if (idea.value) newIdea.value = cloneDeep(idea.value)

watch(
  idea,
  value => {
    if (!value) newIdea.value = null
    else {
      newIdea.value = cloneDeep(value)
      pushToRecentIdeas(value)
    }
  },
  { immediate: true }
)
</script>

<template>
  <IdeaContent
    v-if="team && newIdea"
    :idea="newIdea"
    :team-id="team.id"
    :sidebar-open="sidebarOpen"
    has-sidebar
    class="h-full lg:px-5"
    content-classes="pt-[52px]"
    @status-update="updateStatus"
    @add-label="addLabel"
    @remove-label="removeLabel"
    @close-sidebar="sidebarOpen = false"
  >
    <PageHeader
      :show-options="false"
      :show-filters="false"
      v-if="idea"
      class="alongside-sidebar fixed left-0 top-0 right-0 z-10 bg-white/80 backdrop-blur dark:border-b dark:border-zinc-800 dark:bg-zinc-900 lg:right-[270px] xl:right-[270px]"
    >
      <div class="flex min-w-0 items-center">
        <div class="hidden cursor-default truncate whitespace-nowrap xs:block">{{ team.name }}</div>
        <div class="mx-1 hidden xs:block">›</div>
        <div class="cursor-default whitespace-nowrap">#{{ idea.team_idea_id }}</div>
      </div>

      <FavoriteButton class="ml-4" @click="idea ? toggleFavorite(idea) : ''" :on="isFavorite(idea)" />

      <span class="ml-auto flex items-center">
        <IdeaEditButton :url="`/${currentWorkspace.slug}/ideas/${team.slug}-${idea.team_idea_id}/edit`" />

        <IdeaActionsDropdown :idea="idea" @delete-idea="handleDeletion" />

        <span @click="sidebarOpen = !sidebarOpen" class="ml-2 rounded py-1 px-[6px] lg:hidden">
          <Bars3BottomRightIcon class="h-5 w-5 min-w-[1.25rem] text-slate-700 dark:text-zinc-400" />
        </span>
      </span>
    </PageHeader>
  </IdeaContent>

  <div v-else-if="team && !newIdea">
    <div class="flex h-screen w-full items-center px-6 text-center">
      <div class="w-full pb-16">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="mt-3 text-sm">
          <div class="mt-3 mb-1 font-medium text-slate-800">Idea not found.</div>

          <RouterLink :to="`/${currentWorkspace.slug}/drafts`" class="font-medium text-blue-500 hover:underline">
            Go to my drafts
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .alongside-sidebar {
    left: var(--sidebar-width);
  }
}
</style>
