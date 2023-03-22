<script>
import api from '../../api'
import { mapState, mapGetters, mapMutations } from 'vuex'

definePageMeta({
  middleware: 'auth',
})

export default {
  props: {
    workspaceSlug: String,
  },

  data() {
    return {
      saving: false,
      showForm: false,
      newTeam: {
        name: '',
      },
      selectedTeams: [],
    }
  },

  computed: {
    ...mapState('base', ['user', 'workspaceContentLoaded']),
    ...mapGetters('base', ['currentWorkspace', 'currentWorkspaceTeams', 'userCurrentWorkspaceTeams']),

    page() {
      return this.currentWorkspaceTeams?.length ? 'select_team' : 'create_team'
    },
  },

  watch: {
    workspaceContentLoaded: {
      immediate: true,
      handler(value) {
        if (value) this.showForm = true
        if (value && this.userCurrentWorkspaceTeams?.length)
          this.$router.push({ name: 'drafts', params: { workspaceSlug: this.currentWorkspace.slug } })
      },
    },
  },

  methods: {
    ...mapMutations('base', ['setWorkspaceTeams']),

    saveTeam() {
      this.saving = true

      api
        .post(`/workspaces/${this.currentWorkspace.id}/teams`, {
          name: this.newTeam.name,
        })
        .then(({ data }) => {
          this.setWorkspaceTeams({
            teams: [data],
          })

          this.$router.push(`/${this.currentWorkspace.slug}/drafts`)
        })
    },

    selectTeams() {
      api
        .post(`/workspace/${this.currentWorkspace.id}/teams/join`, {
          teams: this.selectedTeams,
        })
        .then(({ data }) => {
          this.$store.dispatch('base/getCurrentWorkspaceTeams').then(() => {
            this.$router.push(`/${this.currentWorkspace.slug}/drafts`)
          })
        })
    },

    toggleTeamSelected(id) {
      if (!this.selectedTeams.includes(id)) {
        this.selectedTeams.push(id)
        return
      }

      this.selectedTeams.splice(
        this.selectedTeams.findIndex(x => x === id),
        1
      )
    },
  },
}
</script>

<style scoped>
.v-enter-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.v-enter-from {
  transform: translateY(-24px) scale(0.98);
  opacity: 0;
}
</style>

<template>
  <main class="absolute inset-0 z-50 flex min-h-screen justify-center bg-slate-50 dark:bg-zinc-900">
    <Transition>
      <div class="mx-auto w-full max-w-md px-6 py-12 text-center md:py-[80px]" v-if="showForm">
        <div>
          <LogoColor class="mx-auto mb-4 h-12 w-12 md:mb-8" />
        </div>

        <h1 class="mb-3 text-[22px] font-medium text-slate-900 dark:text-zinc-100">Almost there...</h1>

        <div v-if="page === 'create_team'">
          <p class="mb-6 text-slate-700 dark:text-zinc-300">
            Create a team for the
            <span class="font-medium text-slate-900 dark:text-zinc-300">{{ currentWorkspace.name }}</span> workspace.
          </p>

          <form @submit.prevent="saveTeam">
            <div class="mb-4">
              <FormLabel class="mb-1 block text-left">Team name</FormLabel>
              <FormTextInput
                ref="teamNameInput"
                v-model="newTeam.name"
                class="block w-full"
                placeholder="e.g. Developers, Marketing, Personal"
                required
              />
            </div>

            <div class="flex justify-end">
              <BaseButton type="submit" button="primary" size="md" :disabled="saving">Save & finish</BaseButton>
            </div>
          </form>
        </div>

        <div v-else-if="page === 'select_team'">
          <p class="mb-8 text-slate-700 dark:text-zinc-300">
            Select which teams on the
            <span class="font-medium text-slate-900 dark:text-zinc-100">{{ currentWorkspace.name }}</span> workspace
            you'd like to join.
          </p>

          <form @submit.prevent="selectTeams">
            <div
              class="mb-4 rounded-md border border-slate-200 bg-white text-left text-[14px] dark:border-zinc-700 dark:bg-zinc-800"
            >
              <template v-for="(team, key) in currentWorkspaceTeams">
                <label
                  v-if="!team?.personal && team?.privacy !== 'private'"
                  class="flex items-center px-4 py-3"
                  :class="{ 'border-b border-slate-200 dark:border-zinc-700': key < currentWorkspaceTeams.length - 1 }"
                >
                  <Checkbox class="mr-3" @update:checked="toggleTeamSelected(team.id)" />
                  <span class="font-medium">{{ team.name }}</span>
                  <span class="ml-auto text-xs text-slate-600 dark:text-zinc-400">
                    {{ team.users?.length ?? 0 }}
                    {{ team.users?.length === 1 ? 'member' : 'members' }}
                  </span>
                </label>
              </template>
            </div>

            <div class="flex justify-end">
              <BaseButton type="submit" button="primary" size="md" :disabled="saving || !selectedTeams.length">
                Save & finish
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </main>
</template>
