<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import { Team, User } from '../types'
import ModalBg from './ModalBg.vue'
import ModalWrapper from './ModalWrapper.vue'

defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])

const { publicTeamsToJoin, totalIdeasInTeam, joinTeam } = useTeams()
const { getUserById } = useUsers()

function attemptJoinTeam(id: Team['id']) {
  joinTeam(id)
  emit('close')
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10" @click.self="$emit('close')">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel
          class="mx-auto w-full max-w-[550px] rounded-md bg-white px-8 py-6 shadow-3xl dark:border dark:border-zinc-700 dark:bg-zinc-900 md:mt-[12vh]"
        >
          <h3 class="mb-4 font-semibold">Join a team</h3>

          <p class="mb-6 text-sm text-slate-600 dark:text-zinc-300">
            Select a public team from the list below. To join a private team, you must be added by an existing member.
          </p>

          <div v-if="publicTeamsToJoin.length" class="-mx-8 max-h-[300px] overflow-auto pt-1">
            <button
              type="button"
              v-for="team in publicTeamsToJoin"
              :key="team.id"
              @click="attemptJoinTeam(team.id)"
              class="group relative -mt-px flex w-full cursor-default appearance-none items-center border-y border-slate-200 px-8 py-4 text-left hover:z-10 hover:border-blue-200 hover:bg-blue-50 active:bg-blue-100 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:active:border-zinc-600"
            >
              <div>
                <div class="leading-6 group-hover:text-blue-600 dark:group-hover:text-zinc-100">{{ team.name }}</div>
                <div
                  class="text-xs text-slate-600 group-hover:text-blue-600 dark:text-zinc-300 dark:group-hover:text-zinc-200"
                >
                  <span
                    >{{ team.users.length }} {{ team.users.length === 1 ? 'member' : 'members' }},
                    {{ totalIdeasInTeam(team) }} ideas</span
                  >
                </div>
              </div>

              <div class="ml-auto">
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

          <div
            v-else
            class="flex cursor-default items-center justify-center rounded-md border border-slate-200 px-10 py-5 text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400"
          >
            No public teams to join
          </div>

          <div class="mt-6 text-right">
            <button
              type="button"
              class="cursor-default appearance-none rounded-md px-4 py-2 text-sm font-medium leading-5 text-slate-800 hover:bg-slate-100 active:bg-slate-150 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
              @click="$emit('close')"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
