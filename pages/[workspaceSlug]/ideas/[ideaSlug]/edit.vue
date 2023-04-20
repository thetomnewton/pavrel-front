<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { RouteLocationNormalized, useRouter } from 'vue-router'
import { Bars3BottomRightIcon } from '@heroicons/vue/24/solid'
import { cloneDeep } from 'lodash-es'
import { Idea, Team } from '../../../../types'

definePageMeta({
  middleware: 'auth',
})

const store = useStore()
const route = useRoute()
const router = useRouter()

const ideaSlug = route.params.ideaSlug as string
const [teamSlug, teamIdeaId] = ideaSlug.split('-')

const { currentWorkspace } = useWorkspace()
const team = computed(() => (store.state.base.teams as Team[] | undefined)?.find(({ slug }) => slug === teamSlug))
const idea = computed<Idea | undefined>(() =>
  store.state.base.ideas.find(
    ({ team_id, team_idea_id }: Idea) => team_idea_id === +teamIdeaId && team_id === team.value?.id
  )
)

const newIdea = ref<Idea | null>(null)
const sidebarOpen = ref(false)

if (idea?.value) {
  newIdea.value = cloneDeep(idea.value)
}

watch(idea, async newValue => {
  if (!newValue) return
  if (newIdea.value === null) newIdea.value = cloneDeep(newValue)
})

useHead({
  title: `${team.value?.slug}-${idea.value?.team_idea_id}: ${idea.value?.title}`,
})

function closeSidebar() {
  sidebarOpen.value = false
}

async function updateStatus(id: string) {
  if (newIdea.value) newIdea.value.status_id = id
  await store.dispatch('base/updateIdea', { ...idea.value, ...{ status_id: id } })
}

async function update() {
  store.dispatch('base/updateIdea', { ...idea.value, ...newIdea.value })

  await router.push(`/${currentWorkspace.value.slug}/ideas/${team.value?.slug}-${teamIdeaId}`)
}

const content = ref<{ focusEditor: () => void } | null>(null)
</script>

<script lang="ts">
let fromRoute: RouteLocationNormalized | null = null

export default {
  data() {
    return {
      from: null,
    }
  },

  beforeRouteEnter(to, from, next) {
    fromRoute = from
    next()
  },

  methods: {
    cancel() {
      if (fromRoute?.name) this.$router.push({ name: fromRoute.name, params: fromRoute.params })
      else this.$router.back()
    },
  },
}
</script>

<template>
  <div class="flex h-full" v-if="idea && team">
    <section class="flex min-w-0 flex-1 flex-col">
      <PageHeader
        :team="team"
        :show-options="false"
        :show-filters="false"
        class="alongside-sidebar fixed left-0 top-0 right-0 z-10 bg-white/80 backdrop-blur dark:border-b dark:border-zinc-800 dark:bg-zinc-900 lg:right-[250px] xl:right-[250px]"
      >
        <span class="cursor-default font-medium text-slate-700 dark:text-zinc-300">
          Edit {{ team.slug }}-{{ idea.team_idea_id }}
        </span>

        <span class="ml-auto flex items-center">
          <button
            type="button"
            class="mr-2 cursor-default rounded-md px-[10px] py-1 text-xs font-medium leading-[22px] text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 dark:active:bg-zinc-700/50 dark:active:text-zinc-200"
            @click="cancel"
          >
            Cancel
          </button>

          <button
            class="border-md inline-flex cursor-default items-center justify-center whitespace-nowrap rounded-md border-transparent bg-blue-600 py-1 px-[10px] text-xs font-medium leading-5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
            @click="update"
            type="button"
          >
            Save
          </button>

          <span
            @click="sidebarOpen = true"
            class="group ml-2 rounded py-[5px] px-[6px] hover:bg-slate-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700/50 lg:hidden"
          >
            <Bars3BottomRightIcon
              class="h-5 w-5 min-w-[1.25rem] text-slate-600 dark:text-zinc-400 dark:group-hover:text-zinc-300"
            />
          </span>
        </span>
      </PageHeader>

      <div class="w-full flex-1 overflow-y-auto pt-[52px] pb-[200px]">
        <div class="mx-auto flex w-full max-w-4xl">
          <div class="mr-6 ml-6 flex w-full flex-col md:ml-10">
            <template v-if="newIdea">
              <EditableIdeaTitle v-model="newIdea.title" @entered="content?.focusEditor()" />

              <Tiptap
                ref="content"
                :model-value="newIdea.description ?? undefined"
                @update:model-value="(newValue: string) => (newIdea ? (newIdea.description = newValue) : '')"
                @save="update"
              />
            </template>
          </div>
        </div>
      </div>
    </section>

    <IdeaContentSidebar
      :idea="idea"
      :sidebar-open="sidebarOpen"
      @status-update="updateStatus"
      @close-sidebar="closeSidebar"
    />
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .alongside-sidebar {
    left: var(--sidebar-width);
  }
}
</style>
