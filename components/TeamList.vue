<script setup lang="ts">
import { Team, User } from '~~/types'

defineProps<{
  teams: Team[]
}>()

defineEmits(['select-team'])

const { totalIdeasInTeam } = useTeams()
const { getUserById } = useUsers()
</script>

<template>
  <div>
    <button
      v-for="team in teams"
      :key="team.id"
      @click="$emit('select-team', team)"
      class="group relative -mt-px flex w-full cursor-default appearance-none items-center border-y border-slate-200 px-8 py-4 text-left hover:z-10 hover:border-blue-200 hover:bg-blue-50 active:bg-blue-100 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:active:border-zinc-600"
    >
      <div>
        <div class="leading-6 group-hover:text-blue-600 dark:group-hover:text-zinc-100">{{ team.name }}</div>
        <div class="text-xs text-slate-600 group-hover:text-blue-600 dark:text-zinc-300 dark:group-hover:text-zinc-200">
          <span
            >{{ team.users.length }} {{ team.users.length === 1 ? 'member' : 'members' }},
            {{ totalIdeasInTeam(team) }} ideas</span
          >
        </div>
      </div>

      <div class="ml-auto flex items-center space-x-1">
        <div v-for="user in team.users.slice(0, 3)" :key="user.id">
          <template v-if="getUserById(user.id)">
            <img
              :src="(getUserById(user.id) as User).profile_photo_url"
              class="h-5 w-5 min-w-[1.25rem] rounded-full object-cover"
            />
          </template>
        </div>
      </div>
    </button>
  </div>
</template>
