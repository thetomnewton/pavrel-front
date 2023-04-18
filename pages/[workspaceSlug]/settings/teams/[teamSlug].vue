<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { ref, computed, watch } from 'vue'
import { Team, TeamUserRoles, User } from '../../../../types'
import { LockClosedIcon, UsersIcon } from '@heroicons/vue/24/solid'
import { InformationCircleIcon, PlusIcon } from '@heroicons/vue/20/solid'

definePageMeta({
  layout: 'settings',
  middleware: 'auth',
})

const { currentWorkspace } = useWorkspace()
const { currentWorkspaceTeams, updateTeam, updateTeamUserRole, joinTeam, totalIdeasInTeam } = useTeams()
const { user, getUserById } = useUsers()
const route = useRoute()
const router = useRouter()

const teamUpdateStatus = ref<'idle' | 'updating'>('idle')

const team = computed<Team | undefined>(() =>
  currentWorkspaceTeams.value.find(team => team.slug === route.params.teamSlug)
)

useHead({
  title: `Team Settings › ${team.value?.name}`,
})

const slugAlreadyExists = computed(() =>
  currentWorkspaceTeams.value.find(
    team => newTeam.value && team.id !== newTeam.value.id && team.slug === newTeam.value.slug
  )
)
const newTeam = ref<Team | null>(null)

function updatePrivacy(value: Team['privacy']) {
  if (newTeam.value) newTeam.value.privacy = value
}

function attemptTeamUpdate() {
  teamUpdateStatus.value = 'updating'

  const origTeamSlug = team.value?.slug

  if (newTeam.value)
    updateTeam({
      ...newTeam.value,
      ...{ users: team.value?.users ?? [], labels: team.value?.labels ?? [], statuses: team.value?.statuses ?? [] },
    })

  if (newTeam.value?.slug && newTeam.value.slug !== origTeamSlug)
    router.push(`/${currentWorkspace.value.slug}/settings/teams/${newTeam.value.slug}`)

  teamUpdateStatus.value = 'idle'
}

const leaveTeamModalOpen = ref(false)
function openLeaveTeamModal() {
  leaveTeamModalOpen.value = true
}

const removeFromTeamModalOpen = ref(false)
const userToRemoveFromTeam = ref<User | null>(null)
function openRemoveFromTeamModal(userId: User['id']) {
  const user = getUserById(userId)

  if (user) {
    removeFromTeamModalOpen.value = true
    userToRemoveFromTeam.value = user
  }
}

function changeTeamMemberRole(id: User['id'], role: TeamUserRoles) {
  if (team.value) updateTeamUserRole({ teamId: team.value.id, userId: id, role })
}

const iAmTeamAdmin = computed<boolean>(
  () => team.value?.users.find(({ id }) => id === user.value.id)?.pivot.role === 'admin'
)

const isMemberOfTeam = computed<boolean>(() => !!team.value?.users.find(({ id }) => user.value.id === id))
const addTeamMembersModalOpen = ref(false)

watch(
  team,
  value => {
    // if newTeam is not set, or if newTeam is based on a different team, update newTeam
    if (value && (!newTeam.value || newTeam.value.id !== value.id)) newTeam.value = cloneDeep(value)
  },
  { immediate: true }
)
</script>

<template>
  <div class="mx-auto max-w-4xl px-6 py-10 lg:px-8" v-if="team && newTeam">
    <div class="mb-8 border-b border-slate-200 pb-8 dark:border-zinc-700">
      <h2 class="text-[22px] font-medium">Team Settings › {{ team.name }}</h2>
    </div>

    <template v-if="isMemberOfTeam">
      <div
        class="mb-10 space-y-6 border-b border-slate-200 pb-10 dark:border-zinc-700 md:flex md:space-x-6 md:space-y-0"
      >
        <div class="md:w-1/3">
          <h3 class="text-lg font-medium text-slate-900 dark:text-zinc-200">Team details</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-zinc-400">Set the basic information for the team.</p>
        </div>

        <div class="md:w-2/3">
          <form @submit.prevent="attemptTeamUpdate" class="max-w-[350px] space-y-6">
            <div>
              <FormLabel for="teamName">Team name</FormLabel>
              <div className="mt-1">
                <FormTextInput id="teamName" v-model="newTeam.name" required />
              </div>
            </div>

            <div>
              <FormLabel for="teamIdentifier">Team identifier</FormLabel>
              <div className="mt-1 flex items-start">
                <FormTextInput
                  id="teamIdentifier"
                  :model-value="newTeam.slug"
                  @update:model-value="newTeam ? (newTeam.slug = $event.toUpperCase()) : ''"
                  class="max-w-[75px]"
                  required
                />

                <div class="mt-0.5 ml-4 text-xs text-slate-500 dark:text-zinc-400">
                  Updating this may cause old idea links to become invalid.
                </div>
              </div>
            </div>

            <div
              class="mt-2 flex items-center rounded-md bg-red-100 px-4 py-2 text-sm font-medium leading-5 text-red-800"
              v-if="slugAlreadyExists"
            >
              <InformationCircleIcon class="mr-2 h-5 w-5 stroke-[2px]" />
              <span
                >That identifier is already being used by <span class="font-semibold">{{ slugAlreadyExists.name }}</span
                >.</span
              >
            </div>

            <div>
              <FormLabel>Team privacy</FormLabel>
              <div className="mt-1">
                <Listbox
                  :value="newTeam.privacy"
                  @update-value="updatePrivacy"
                  :options="[
                    { text: 'Public', value: 'public', icon: UsersIcon },
                    { text: 'Private', value: 'private', icon: LockClosedIcon },
                  ]"
                ></Listbox>
              </div>

              <div class="mt-1.5 text-xs text-slate-500 dark:text-zinc-400">
                <template v-if="newTeam.privacy === 'public'">
                  Anyone can view or join a public team at any time.
                </template>

                <template v-else-if="newTeam.privacy === 'private'">
                  Private teams cannot ve viewed or joined by others. New members can only be added by existing members.
                </template>
              </div>
            </div>

            <div>
              <Button
                :disabled="!newTeam.name || !newTeam.slug || slugAlreadyExists || teamUpdateStatus === 'updating'"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div
        class="mb-10 space-y-6 border-b border-slate-200 pb-10 dark:border-zinc-700 md:flex md:space-x-6 md:space-y-0"
      >
        <div class="md:w-1/3">
          <h3 class="text-lg font-medium text-slate-900 dark:text-zinc-200">Members</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-zinc-400">Set who has access to the team.</p>
        </div>

        <div class="md:w-2/3">
          <div class="space-y-6">
            <div
              v-for="teamUser in team.users"
              :key="teamUser.id"
              class="w-full space-y-2 lg:flex lg:items-center lg:space-y-0"
            >
              <template v-if="getUserById(teamUser.id)">
                <div class="lg:mr-4">
                  <img
                    :src="getUserById(teamUser.id)?.profile_photo_url"
                    class="block h-8 w-8 min-w-[2rem] rounded-full object-cover"
                  />
                </div>

                <div>
                  <div class="truncate lg:max-w-[200px]">{{ getUserById(teamUser.id)?.name }}</div>
                  <div class="text-[13px] leading-5 text-slate-600 dark:text-zinc-400">
                    {{ getUserById(teamUser.id)?.email }}
                  </div>
                </div>

                <div class="lg:ml-auto lg:flex lg:items-center">
                  <div class="max-w-[350px]">
                    <Listbox
                      class="min-w-[150px]"
                      :value="teamUser.pivot.role"
                      :disabled="!iAmTeamAdmin"
                      @update-value="changeTeamMemberRole(teamUser.id, $event)"
                      :options="[
                        { value: 'admin', text: 'Admin' },
                        { value: 'member', text: 'Member' },
                      ]"
                    />
                  </div>

                  <div class="mt-2 min-w-[70px] lg:ml-8 lg:mt-0">
                    <template v-if="user.id === teamUser.id">
                      <button
                        type="button"
                        class="appearance-none text-sm font-medium text-red-500 hover:underline"
                        @click="openLeaveTeamModal"
                      >
                        Leave
                      </button>
                    </template>

                    <template v-else>
                      <button
                        type="button"
                        v-if="iAmTeamAdmin"
                        class="appearance-none text-sm font-medium text-red-500 hover:underline"
                        @click="openRemoveFromTeamModal(teamUser.id)"
                      >
                        Remove
                      </button>
                    </template>
                  </div>
                </div>
              </template>
            </div>

            <div class="mt-4">
              <button
                type="button"
                @click="addTeamMembersModalOpen = true"
                class="inline-flex cursor-default items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium leading-5 text-slate-800 shadow-sm active:translate-y-px active:border-slate-400 active:shadow-none dark:border-zinc-600 dark:text-zinc-100"
              >
                <PlusIcon class="mr-1 -ml-1 h-5 w-5 text-slate-500 dark:text-zinc-400" />
                <span>Add members</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <LeaveTeamModal
        v-if="team"
        :team="team"
        :open="leaveTeamModalOpen"
        @close="leaveTeamModalOpen = false"
        @leave="leaveTeamModalOpen = false"
      />

      <RemoveFromTeamModal
        v-if="team && userToRemoveFromTeam"
        :team="team"
        :user="userToRemoveFromTeam"
        :open="removeFromTeamModalOpen"
        @close="removeFromTeamModalOpen = false"
      />

      <AddTeamMembersModal
        v-if="team"
        :team="team"
        :open="addTeamMembersModalOpen"
        @close="addTeamMembersModalOpen = false"
      />
    </template>

    <template v-else>
      <div class="mx-auto mt-12 max-w-lg rounded-lg border py-8 text-center shadow">
        <div class="mb-3">
          You are not yet a member of <span class="font-medium">{{ team.name }}</span
          >.
        </div>

        <div class="mb-4 flex items-center justify-center space-x-3 text-sm">
          <div>{{ team.users.length }} member{{ team.users.length === 1 ? '' : 's' }}</div>
          <div>{{ totalIdeasInTeam(team) }} ideas</div>
        </div>

        <div>
          <Button @click="team ? joinTeam(team.id) : ''"> Join team </Button>
        </div>
      </div>
    </template>
  </div>
</template>
