<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { Team, User } from '../types'
import ModalBg from './ModalBg.vue'
import ModalWrapper from './ModalWrapper.vue'

const props = defineProps<{
  open: boolean
  team: Team
}>()

const emit = defineEmits(['close'])

const store = useStore()
const { addMembersToTeam } = useTeams()

const usersNotInTeam = computed(() =>
  (store.state.base.users as User[]).filter(user => !props.team.users.find(({ id }) => id === user.id))
)

const userIdsToAdd = ref<User['id'][]>([])

function toggleUserId(userId: User['id'], value: boolean) {
  if (value) userIdsToAdd.value.push(userId)
  else userIdsToAdd.value = userIdsToAdd.value.filter(id => id !== userId)
}

function attemptAddTeamMembers() {
  addMembersToTeam(userIdsToAdd.value, props.team.id)
  userIdsToAdd.value = []
  emit('close')
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10" @click.self="$emit('close')">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel
          class="mx-auto w-full max-w-[500px] rounded-md bg-white shadow-3xl dark:border dark:border-zinc-600 dark:bg-zinc-900 md:mt-[12vh]"
        >
          <h3 class="mx-8 mb-6 pt-6 font-semibold">Add people to {{ team.name }}</h3>

          <form @submit.prevent="attemptAddTeamMembers" v-if="team">
            <div class="max-h-300px overflow-auto pt-1" v-if="usersNotInTeam.length">
              <label
                v-for="user in usersNotInTeam"
                :key="user.id"
                class="-mt-px flex w-full items-center border-y border-slate-200 px-8 py-4 hover:border-blue-200 hover:bg-blue-50 active:bg-blue-100 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:active:border-zinc-600"
              >
                <Checkbox
                  :checked="userIdsToAdd.includes(user.id)"
                  @update:checked="$event => toggleUserId(user.id, $event)"
                />
                <div class="ml-4">{{ user.name }}</div>

                <div class="ml-auto">
                  <img :src="user.profile_photo_url" class="h-5 w-5 min-w-[1.25rem] rounded-full object-cover" />
                </div>
              </label>
            </div>

            <div v-if="!usersNotInTeam.length" class="mx-8 text-slate-700 dark:text-zinc-300">
              There is nobody in this workspace who can be added to this team. To add someone who is not already a
              member of this team, please invite them to the workspace first.
            </div>

            <div class="flex items-center justify-end space-x-2 px-8 py-6">
              <button
                type="button"
                @click="$emit('close')"
                class="inline-flex cursor-default appearance-none items-center rounded-md px-4 py-2 text-sm font-medium leading-5 text-slate-600 hover:bg-slate-100 active:bg-slate-150 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
              >
                Close
              </button>

              <Button v-if="usersNotInTeam.length">Add members</Button>
            </div>
          </form>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
