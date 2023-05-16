<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import {
  Bars3Icon,
  DocumentIcon,
  ClockIcon,
  Cog6ToothIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  PresentationChartLineIcon,
  UserCircleIcon,
  LifebuoyIcon,
} from '@heroicons/vue/24/outline'
import {
  MagnifyingGlassIcon,
  CheckIcon,
  ArrowRightIcon,
  EllipsisHorizontalIcon,
  LockClosedIcon,
  ChevronDoubleLeftIcon,
} from '@heroicons/vue/20/solid'
import { cloneDeep, find } from 'lodash-es'
import { useLocalStorage } from '@vueuse/core'
import { Idea, Team, Workspace } from '../types'
import { useRoute, useRouter } from 'vue-router'
import Dropdown from './Dropdown.vue'
import QuickCreateIdeaModal from './QuickCreateIdeaModal.vue'
import WorkspaceInviteModal from './WorkspaceInviteModal.vue'
import WorkspaceIcon from './WorkspaceIcon.vue'
import ResizeHandler from './ResizeHandler.vue'
import SearchModal from './SearchModal.vue'
import defaultTheme from '../helpers/default-theme'
import UpgradePreviewModal from './UpgradePreviewModal.vue'
import SideTriangle from './SideTriangle.vue'
import CreateTeamModal from './CreateTeamModal.vue'
import JoinTeamModal from './JoinTeamModal.vue'
import LeaveTeamModal from './LeaveTeamModal.vue'
import { dialogState } from '~/helpers/dialog-state'

const store = useStore()
const router = useRouter()
const route = useRoute()
const theme = useLocalStorage('theme', defaultTheme)
const sidebarToggled = useLocalStorage('sidebar-toggled', false)

const expandedTeams = useLocalStorage<Team['id'][]>('expanded-teams', [])
const { logout } = useLogout()
const { unreadNotificationsCount } = useInbox()
const workspaceInviteModalOpen = ref(false)
const upgradePreviewOpen = ref(false)
const createTeamModalOpen = ref(false)
const joinTeamModalOpen = ref(false)

const nav = ref<HTMLElement | null>(null)

const { user } = useUsers()
const { getTeamById } = useTeams()
const { workspaces, currentWorkspace, currentWorkspaceSlug } = useWorkspace()

const quickCreateIdeaModalOpen = computed<boolean>(() => store.state.base.quickCreateIdeaModalOpen)
const appSidebarOpenMobile = computed<boolean>(() => store.state.base.appSidebarOpenMobile)

const currentWorkspaceTeams = computed<Team[]>(() => store.getters['base/currentWorkspaceTeams'])
const favoriteIdeas = computed<Idea[]>(() => store.getters['base/favoriteIdeas'])

const activePublicTeams = computed(() =>
  currentWorkspaceTeams.value?.filter(({ users, personal }) => !personal && find(users, { id: user.value.id }))
)

const toggleExpandedTeam = (id: Team['id'], force = false) => {
  const teamBeingViewed = route.fullPath === `/${currentWorkspace.value.slug}/teams/${getTeamById(id)?.slug}/ideas/all`

  if (!teamBeingViewed && !force) {
    expandedTeams.value.push(id)
    return
  }

  if (expandedTeams.value.includes(id)) expandedTeams.value = expandedTeams.value.filter(teamId => teamId !== id)
  else expandedTeams.value.push(id)
}

const toggleQuickCreateIdeaModal = () => store.commit('base/toggleQuickCreateIdeaModal')
const toggleAppSidebarMobile = () => store.commit('base/toggleAppSidebarMobile')

const searchModalOpen = ref(false)

function setWorkspace(workspace: Workspace) {
  if (workspace.slug === currentWorkspace.value.slug) return
  location.href = `/${workspace.slug}/drafts`
}

const getTeamSlug = (teamId: string) => currentWorkspaceTeams.value?.find(({ id }) => id === teamId)?.slug ?? ''

function handleResize(e: MouseEvent) {
  const width = Math.max(200, Math.min(e.pageX, 350))

  theme.value.sidebarWidth = width
  document.documentElement.style.setProperty('--sidebar-width', `${width}px`)
}

const leaveTeamModalOpen = ref(false)
const teamToLeave = ref<Team | null>(null)

function openLeaveTeamModal(team: Team) {
  teamToLeave.value = team
  leaveTeamModalOpen.value = true
}

function closeLeaveTeamModal() {
  teamToLeave.value = null
  leaveTeamModalOpen.value = false
}

function leaveTeam() {
  const teamJustLeft = cloneDeep(teamToLeave.value)
  closeLeaveTeamModal()

  if (route.params.teamSlug === teamJustLeft?.slug) router.push(`/${currentWorkspace.value.slug}/drafts`)
}

const keydownListener = (e: KeyboardEvent) => {
  if (
    // @ts-ignore
    ['input', 'textarea'].includes(e.target?.localName) ||
    // @ts-ignore
    e.target?.attributes?.contenteditable
  )
    return

  if (e.key === '/') {
    if (!quickCreateIdeaModalOpen.value && !workspaceInviteModalOpen.value) {
      e.preventDefault()
      e.stopPropagation()
      searchModalOpen.value = true
    }
  } else if (e.key.toLowerCase() === 'q') {
    e.preventDefault()
    e.stopPropagation()
    toggleQuickCreateIdeaModal()
  } else if (e.key.toLowerCase() === 'm') {
    e.preventDefault()
    e.stopPropagation()
    sidebarToggled.value = !sidebarToggled.value
  }
}

const cantCreateNewIdeas = computed(() => route.name === 'idea.create' || route.name === 'idea.edit')

function handleQuickCreateExpand() {
  if (appSidebarOpenMobile.value) toggleAppSidebarMobile()
}

function selectTeam(team: Team) {
  router.push(`/${currentWorkspace.value.slug}/teams/${team.slug}/ideas/all`)

  toggleExpandedTeam(team.id)
}

onMounted(() => {
  document.documentElement.style.setProperty('--sidebar-width', `${theme.value.sidebarWidth}px`)

  window.addEventListener('keydown', keydownListener)
})

onUnmounted(() => {
  window.removeEventListener('keydown', keydownListener)
})
</script>

<template>
  <nav
    ref="nav"
    class="group/sidebar fixed top-0 left-0 z-20 flex h-full w-[300px] min-w-[200px] max-w-[80%] flex-col border-r border-slate-150 bg-[#fcfcfe] text-slate-700 shadow transition-[transform,margin] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 lg:relative lg:w-[200px] lg:shadow-none"
    :class="{
      'translate-x-[-100%] lg:translate-x-0': !appSidebarOpenMobile,
      'lg:ml-[calc(var(--sidebar-width)*-1)]': sidebarToggled,
      '': !sidebarToggled,
    }"
  >
    <ResizeHandler
      @resize="handleResize"
      class="absolute -right-[4px] z-10 hidden h-full w-[7px] cursor-ew-resize lg:block"
    />

    <!-- Primary Navigation Menu -->
    <div class="min-h-[54px]">
      <div class="py-3 px-[14px]" v-if="currentWorkspace && currentWorkspaceTeams">
        <div class="flex items-center">
          <div class="lg:hidden">
            <Bars3Icon class="mr-3 ml-2 h-5 w-5 text-slate-700 dark:text-zinc-400" @click="toggleAppSidebarMobile" />
          </div>

          <div class="flex flex-1">
            <div class="flex w-full items-center space-x-1">
              <!-- Workspace Selector -->
              <Dropdown width="230px" align="left" trigger-wrapper-classes="w-full" class="flex-1">
                <template #trigger="{ open }">
                  <div
                    class="group flex w-full items-center rounded"
                    :class="{
                      'bg-slate-200 dark:bg-zinc-800': open,
                      'hover:bg-slate-150 active:bg-slate-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-800': !open,
                    }"
                  >
                    <button class="flex flex-shrink-0 cursor-default items-center rounded py-[6px] pl-[10px] pr-2">
                      <img
                        v-if="currentWorkspace.logo_url"
                        :src="currentWorkspace.logo_url"
                        class="mr-[10px] inline-block h-[18px] w-[18px] min-w-[18px] rounded"
                      />

                      <WorkspaceIcon v-else class="mr-[10px] bg-blue-500" :initial="currentWorkspace.initial" />

                      <span
                        class="inline-block max-w-[125px] truncate whitespace-nowrap text-[.8125rem] font-medium leading-[18px]"
                      >
                        {{ currentWorkspace.name }}
                      </span>
                    </button>
                  </div>
                </template>

                <template #content>
                  <div class="px-2 py-1 text-[.8125rem]">
                    <div
                      v-for="workspace in workspaces"
                      :key="workspace.id"
                      @click="setWorkspace(workspace)"
                      class="flex cursor-default items-center rounded px-2 py-[6px] font-medium leading-[18px] hover:bg-slate-100 dark:hover:bg-zinc-700"
                    >
                      <img
                        v-if="workspace.logo_url"
                        :src="workspace.logo_url"
                        class="mr-[10px] inline-block h-[18px] w-[18px] min-w-[18px] rounded"
                      />

                      <WorkspaceIcon v-else class="mr-[10px] bg-blue-500" :initial="workspace.initial" />

                      <span>{{ workspace.name }}</span>

                      <CheckIcon
                        v-if="workspace.id === currentWorkspace.id"
                        class="ml-auto h-[18px] w-[18px] text-slate-500 dark:text-zinc-300"
                      />
                    </div>
                  </div>

                  <div class="my-1 border-t border-slate-100 dark:border-zinc-700"></div>

                  <div class="px-2 py-1 text-[.8125rem]">
                    <div
                      class="block cursor-default rounded p-2 leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      @click="workspaceInviteModalOpen = true"
                    >
                      Invite people
                    </div>

                    <NuxtLink
                      to="/workspaces/new"
                      class="block cursor-default rounded p-2 leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                      Create new workspace
                    </NuxtLink>

                    <form @submit.prevent="logout">
                      <button
                        type="submit"
                        class="block w-full cursor-default appearance-none rounded p-2 text-left leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      >
                        Log out
                      </button>
                    </form>
                  </div>
                </template>
              </Dropdown>

              <Tooltip>
                <button
                  type="button"
                  class="ml-auto hidden cursor-default rounded-md p-1 text-slate-500 hover:bg-slate-100 active:bg-slate-150 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:active:bg-zinc-700 group-hover/sidebar:lg:block"
                  @click="sidebarToggled = true"
                >
                  <ChevronDoubleLeftIcon class="h-5 w-5" />
                </button>

                <template #content>
                  <span>Hide sidebar</span>
                  <KeyboardShortcut class="ml-2">m</KeyboardShortcut>
                </template>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-4 mb-3 mt-1">
      <Tooltip>
        <button
          type="button"
          @click="toggleQuickCreateIdeaModal"
          :disabled="cantCreateNewIdeas"
          class="group inline-flex w-full cursor-default items-center rounded-md border border-slate-400 bg-slate-50 py-1.5 pl-[7px] text-[13px] font-medium leading-5 shadow-sm transition-shadow hover:shadow active:translate-y-px active:bg-slate-100 active:shadow-none disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-800/70"
        >
          <PlusIcon
            class="mr-[7px] h-[18px] w-[18px] text-slate-600 transition dark:text-zinc-300 dark:group-hover:text-zinc-200"
          />
          <span>New idea</span>
        </button>

        <template #content>
          <span>Create new idea</span>
          <KeyboardShortcut class="ml-2">q</KeyboardShortcut>
        </template>
      </Tooltip>
    </div>

    <!-- Nav Links -->
    <div class="px-4" v-if="currentWorkspace">
      <Tooltip>
        <button
          type="button"
          @click="searchModalOpen = true"
          class="group mb-px flex w-full cursor-default items-center rounded px-2 text-[.8125rem] font-medium leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
        >
          <MagnifyingGlassIcon
            class="mr-[9px] ml-px h-4 w-4 text-slate-500 group-hover:text-slate-800 dark:text-zinc-400 dark:group-hover:text-slate-200"
          />
          <span>Search</span>
        </button>

        <template #content>
          <span>Search ideas</span>
          <KeyboardShortcut class="ml-2">/</KeyboardShortcut>
        </template>
      </Tooltip>

      <NuxtLink
        :to="`/${currentWorkspace.slug}/inbox`"
        class="group mb-px flex w-full cursor-default items-center rounded px-2 text-[.8125rem] font-medium leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
        :class="{ 'bg-slate-150 dark:bg-zinc-800': $route.name === 'workspaceSlug-inbox' }"
      >
        <ClockIcon
          class="mr-[9px] ml-px -mt-px h-[17px] w-[17px] text-slate-500 group-hover:text-slate-800 dark:text-zinc-400 dark:group-hover:text-slate-200"
        />
        <span>Updates</span>

        <span
          class="ml-auto -mr-[4px] rounded bg-blue-100 px-[6px] text-[11px] font-semibold leading-[20px] text-blue-700"
          v-if="unreadNotificationsCount"
        >
          {{ unreadNotificationsCount < 100 ? unreadNotificationsCount : '99+' }}
        </span>
      </NuxtLink>

      <NuxtLink
        :to="`/${currentWorkspace.slug}/drafts`"
        class="group mb-px flex w-full cursor-default items-center rounded px-2 text-[.8125rem] font-medium leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
        :class="{ 'bg-slate-150 dark:bg-zinc-800': $route.name === 'workspaceSlug-drafts' }"
      >
        <DocumentIcon
          class="mr-[9px] ml-px -mt-px h-[17px] w-[17px] text-slate-500 group-hover:text-slate-800 dark:text-zinc-400 dark:group-hover:text-slate-200"
        />
        <span>Drafts</span>
      </NuxtLink>

      <NuxtLink
        :to="`/${currentWorkspace.slug}/settings/general`"
        class="group mb-px flex w-full cursor-default items-center rounded px-2 text-[.8125rem] font-medium leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
      >
        <Cog6ToothIcon
          class="mr-[9px] ml-px -mt-px h-[17px] w-[17px] text-slate-500 group-hover:text-slate-800 dark:text-zinc-400 dark:group-hover:text-slate-200"
        />
        <span>Settings</span>
      </NuxtLink>
    </div>

    <div class="mt-4 px-4" v-if="favoriteIdeas.length && currentWorkspaceTeams">
      <div class="mb-px cursor-default rounded px-2 text-xs font-medium leading-6 text-slate-500 dark:text-zinc-400">
        Starred
      </div>

      <NuxtLink
        v-for="{ id, title, team_id, team_idea_id } in favoriteIdeas"
        :to="`/${currentWorkspace.slug}/ideas/${getTeamSlug(team_id)}-${team_idea_id}`"
        :key="id"
        class="mb-px flex cursor-default items-center rounded px-2 text-[.8125rem] font-medium leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
        :class="{
          'bg-slate-150 dark:bg-zinc-800':
            $route.fullPath === `/${currentWorkspaceSlug}/ideas/${getTeamSlug(team_id)}-${team_idea_id}`,
        }"
      >
        <span class="overflow-hidden whitespace-nowrap">{{ title }}</span>
      </NuxtLink>
    </div>

    <div class="mt-4 px-4">
      <div
        class="mb-px flex cursor-default items-center rounded px-2 text-xs font-medium leading-6 text-slate-500 dark:text-zinc-400"
      >
        <span>Teams</span>

        <div class="ml-auto mr-[2px]">
          <Dropdown align="left">
            <template #trigger="{ open }">
              <button
                type="button"
                class="-mr-[4px] ml-1 flex cursor-default items-center justify-center rounded-[3px] p-1"
                :class="[
                  open
                    ? 'bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-200'
                    : 'text-slate-500 hover:bg-slate-200 hover:text-slate-600 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200',
                ]"
              >
                <EllipsisHorizontalIcon class="h-3 w-3" />
              </button>
            </template>

            <template #content>
              <div class="px-2 py-1 text-[.8125rem]">
                <button
                  type="button"
                  class="flex w-full cursor-default appearance-none items-center rounded p-2 text-left leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  @click="createTeamModalOpen = true"
                >
                  <PlusIcon class="mr-2 h-5 w-5" />
                  <span>Create new team</span>
                </button>

                <button
                  type="button"
                  class="flex w-full cursor-default appearance-none items-center rounded p-2 text-left leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  @click="joinTeamModalOpen = true"
                >
                  <UserPlusIcon class="mr-2 h-5 w-5" />
                  <span>Join a team</span>
                </button>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>

      <div v-for="team in activePublicTeams" :key="team.id" class="text-[.8125rem] font-medium">
        <button
          type="button"
          @click="selectTeam(team)"
          class="group mb-px flex w-full cursor-default items-center rounded px-[10px] text-[.8125rem] font-medium leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
          :class="{
            'bg-slate-150 dark:bg-zinc-800':
              $route.fullPath === `/${currentWorkspace.slug}/teams/${team.slug}/ideas/all`,
          }"
        >
          <span
            class="-ml-[2px] mr-[8px] rounded-[3px] py-[6px] pl-[6px] pr-[6px] text-slate-500 hover:bg-slate-300 hover:text-slate-600 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
            @click.stop="toggleExpandedTeam(team.id, true)"
          >
            <SideTriangle class="h-2 w-2" :class="[expandedTeams.includes(team.id) ? 'rotate-180' : 'rotate-90']" />
          </span>

          <div class="overflow-hidden truncate">{{ team.name }}</div>

          <span class="ml-auto flex items-center pl-1">
            <div v-if="team.privacy === 'private'" class="-mt-px">
              <LockClosedIcon class="h-[11px] w-[11px] text-slate-500 dark:text-zinc-300" />
            </div>

            <Dropdown width="230px" align="left" trigger-wrapper-classes="w-full">
              <template #trigger="{ open }">
                <button
                  type="button"
                  class="-mr-[4px] ml-1 flex cursor-default items-center justify-center rounded-[3px] p-1"
                  :class="[
                    open
                      ? 'bg-slate-300 text-slate-600 dark:bg-zinc-700 dark:text-zinc-200'
                      : 'text-slate-500 hover:bg-slate-300 hover:text-slate-600 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200',
                  ]"
                >
                  <EllipsisHorizontalIcon class="h-3 w-3" />
                </button>
              </template>

              <template #content>
                <div class="px-2 py-1 text-[.8125rem]">
                  <button
                    @click.stop="router.push(`/${currentWorkspace.slug}/settings/teams/${team.slug}`)"
                    class="flex w-full cursor-default items-center rounded p-2 text-left leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    <Cog6ToothIcon class="mr-2 h-5 w-5" />
                    <span>Team settings</span>
                  </button>

                  <button
                    class="flex w-full cursor-default appearance-none items-center rounded p-2 text-left leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    @click.stop="openLeaveTeamModal(team)"
                  >
                    <ArrowRightOnRectangleIcon class="mr-2 h-5 w-5" />
                    <span>Leave team...</span>
                  </button>
                </div>
              </template>
            </Dropdown>
          </span>
        </button>

        <Transition
          enter-from-class="h-0"
          enter-active-class="transition-all"
          enter-to-class="h-[115px]"
          leave-active-class="transition-all"
          leave-from-class="h-[115px]"
          leave-to-class="h-0"
        >
          <div
            v-if="expandedTeams.includes(team.id)"
            class="ml-[18px] overflow-hidden border-l border-slate-150 pl-[9px] dark:border-zinc-700"
          >
            <NuxtLink
              :to="`/${currentWorkspace.slug}/teams/${team.slug}/ideas/review`"
              class="group mb-px flex cursor-default rounded px-2 leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
              :class="{
                'bg-slate-150 dark:bg-zinc-800':
                  $route.fullPath === `/${currentWorkspace.slug}/teams/${team.slug}/ideas/review`,
              }"
            >
              <div>Review</div>
            </NuxtLink>

            <NuxtLink
              :to="`/${currentWorkspace.slug}/teams/${team.slug}/ideas/backlog`"
              class="group mb-px flex cursor-default rounded px-2 leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
              :class="{
                'bg-slate-150 dark:bg-zinc-800':
                  $route.fullPath === `/${currentWorkspace.slug}/teams/${team.slug}/ideas/backlog`,
              }"
            >
              <div>Backlog</div>
            </NuxtLink>

            <NuxtLink
              :to="`/${currentWorkspace.slug}/teams/${team.slug}/ideas/planning`"
              class="group mb-px flex cursor-default rounded px-2 leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
              :class="{
                'bg-slate-150 dark:bg-zinc-800':
                  $route.fullPath === `/${currentWorkspace.slug}/teams/${team.slug}/ideas/planning`,
              }"
            >
              <div>Planning</div>
            </NuxtLink>

            <NuxtLink
              :to="`/${currentWorkspace.slug}/teams/${team.slug}/ideas/active`"
              class="group mb-px flex cursor-default rounded px-2 leading-7 hover:bg-slate-150 dark:hover:bg-zinc-800"
              :class="{
                'bg-slate-150 dark:bg-zinc-800':
                  $route.fullPath === `/${currentWorkspace.slug}/teams/${team.slug}/ideas/active`,
              }"
            >
              <div>Active</div>
            </NuxtLink>
          </div>
        </Transition>
      </div>
    </div>

    <div class="mt-auto">
      <div v-if="currentWorkspace.plan === 'free'" class="py-4">
        <button
          type="button"
          @click="upgradePreviewOpen = true"
          class="flex w-full cursor-default items-center border-y border-slate-150 bg-white py-3 pr-4 pl-6 text-[13px] font-medium active:translate-y-px dark:border-zinc-800 dark:bg-zinc-800"
        >
          <PresentationChartLineIcon class="mr-2 h-[18px] w-[18px] text-slate-700 dark:text-zinc-300" />
          <span>Free plan</span>
          <span class="ml-auto text-slate-600 dark:text-zinc-400">
            <ArrowRightIcon class="h-4 w-4" />
          </span>
        </button>
      </div>

      <div class="px-2 pb-2">
        <Dropdown
          width="230px"
          align="top_left"
          trigger-wrapper-classes="pt-2 pb-0.5 border-t border-slate-150 dark:border-zinc-800"
        >
          <template #trigger="{ open }">
            <button
              class="group flex w-full cursor-default items-center space-x-1.5 rounded-md px-4 py-3 text-[13px] font-medium text-slate-700 disabled:pointer-events-none disabled:opacity-50 dark:text-zinc-300"
              :class="[
                open
                  ? 'bg-slate-200 dark:bg-zinc-800'
                  : 'hover:bg-slate-200/60 active:bg-slate-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-800',
              ]"
            >
              <img :src="user.profile_photo_url" class="min-w-6 mr-2 h-6 w-6 rounded-full object-cover" />
              <span>{{ user.name }}</span>
            </button>
          </template>

          <template #content>
            <div class="px-2 py-1 text-[.8125rem] font-medium">
              <NuxtLink
                :to="`/${currentWorkspace.slug}/user/profile`"
                class="flex cursor-default items-center rounded p-2 leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <UserCircleIcon class="mr-2 h-5 w-5" />
                <span>View profile</span>
              </NuxtLink>

              <button
                type="button"
                @click="dialogState.helpModalOpen = true"
                class="flex w-full cursor-default items-center rounded p-2 leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <LifebuoyIcon class="mr-2 h-5 w-5" />
                <span>Help & support</span>
              </button>

              <form @submit.prevent="logout">
                <button
                  type="submit"
                  class="flex w-full cursor-default appearance-none items-center rounded p-2 text-left leading-[15px] text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <ArrowRightOnRectangleIcon class="mr-2 h-5 w-5" />
                  <span>Log out</span>
                </button>
              </form>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
  </nav>

  <div
    v-if="appSidebarOpenMobile"
    class="fixed inset-0 z-10 transition lg:hidden"
    @click="toggleAppSidebarMobile"
  ></div>

  <QuickCreateIdeaModal
    :open="quickCreateIdeaModalOpen"
    @close="toggleQuickCreateIdeaModal"
    @expand="handleQuickCreateExpand"
  />

  <WorkspaceInviteModal
    :open="workspaceInviteModalOpen"
    :workspace="currentWorkspace"
    @close="workspaceInviteModalOpen = false"
  />

  <SearchModal v-if="currentWorkspace" :open="searchModalOpen" @close="searchModalOpen = false" />

  <UpgradePreviewModal v-if="currentWorkspace" :open="upgradePreviewOpen" @close="upgradePreviewOpen = false" />

  <CreateTeamModal v-if="currentWorkspace" :open="createTeamModalOpen" @close="createTeamModalOpen = false" />

  <JoinTeamModal v-if="currentWorkspace" :open="joinTeamModalOpen" @close="joinTeamModalOpen = false" />

  <LeaveTeamModal
    v-if="currentWorkspace && teamToLeave"
    :open="leaveTeamModalOpen"
    :team="teamToLeave"
    @close="closeLeaveTeamModal"
    @leave="leaveTeam"
  />
</template>

<style scoped>
@media (min-width: 768px) {
  nav {
    width: var(--sidebar-width);
  }
}
nav * {
  user-select: none;
}
</style>
