<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import { useOnline } from '@vueuse/core'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Idea, Team } from '../types'
import ModalBg from './ModalBg.vue'
import ModalWrapper from './ModalWrapper.vue'

const online = useOnline()

const props = defineProps<{
  open: boolean
  team: Team | null
}>()

const emit = defineEmits(['close'])

const store = useStore()
const { leaveTeam, disbandTeam } = useTeams()
const teamIdeas = computed<Idea[]>(() => (props.team ? store.getters['base/teamIdeas'](props.team.id) : []))

function attemptLeaveTeam() {
  if (!props.team) return

  if (props.team.users.length === 1) disbandTeam(props.team)
  else leaveTeam(props.team)

  emit('close')
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10" @click.self="$emit('close')">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel class="mx-auto w-full max-w-[500px] rounded-md bg-white shadow-3xl dark:bg-zinc-800 md:mt-[12vh]">
          <form @submit.prevent="attemptLeaveTeam" class="px-8 py-6" v-if="team">
            <div class="space-y-4">
              <p>
                Are you sure you wish to leave the team <span class="font-semibold">{{ team.name }}</span
                >?
              </p>

              <template v-if="team.users.length > 1">
                <p>You will lose access to all ideas in this team ({{ teamIdeas.length }} total).</p>
              </template>

              <template v-else>
                <p>
                  Since you are the only member of this team,
                  <strong class="font-semibold"
                    >the team will be disbanded and {{ teamIdeas.length }} idea(s) will be deleted</strong
                  >. This cannot be undone.
                </p>
              </template>
            </div>

            <div
              v-if="!online"
              class="mb-6 mt-4 flex items-start rounded-md bg-red-100 px-6 py-4 text-sm font-medium text-red-800"
            >
              <ExclamationTriangleIcon class="mr-2 mt-px h-6 w-6" />
              <span>You can't do this because you're currently offline.</span>
            </div>

            <div class="mt-6 text-right">
              <button
                type="button"
                @click="$emit('close')"
                class="mr-2 cursor-default px-4 py-2 text-sm font-medium leading-5 text-slate-600 hover:text-slate-800 dark:text-zinc-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="!online"
                class="inline-block cursor-default rounded bg-red-500 px-4 py-2 text-sm font-medium leading-[22px] text-white ring-red-500 hover:bg-red-600 active:ring-2 disabled:pointer-events-none disabled:opacity-50"
              >
                <template v-if="team.users.length > 1">Leave team</template>
                <template v-else>Leave & delete team</template>
              </button>
            </div>
          </form>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
