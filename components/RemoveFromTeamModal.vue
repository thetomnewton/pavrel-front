<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import { useOnline } from '@vueuse/core'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Idea, Team, User } from '../types'
import ModalBg from './ModalBg.vue'
import ModalWrapper from './ModalWrapper.vue'

const online = useOnline()

const props = defineProps<{
  open: boolean
  user: User
  team: Team | null
}>()

const emit = defineEmits(['close'])

const store = useStore()
const { removeUserFromTeam } = useTeams()
const teamIdeas = computed<Idea[]>(() => (props.team ? store.getters['base/teamIdeas'](props.team.id) : []))

function attemptRemoveFromTeam() {
  if (!props.team) return

  removeUserFromTeam({ user: props.user, team: props.team })

  emit('close')
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10" @click.self="$emit('close')">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel class="mx-auto w-full max-w-[500px] rounded-md bg-white shadow-3xl dark:bg-zinc-800 md:mt-[12vh]">
          <form @submit.prevent="attemptRemoveFromTeam" class="px-8 py-6" v-if="team">
            <div class="space-y-4">
              <p>
                Are you sure you want to remove <span class="font-semibold">{{ user.name }}</span> from the team
                <span class="font-semibold">{{ team.name }}</span
                >?
              </p>

              <p>They will lose access to all ideas in this team ({{ teamIdeas.length }} total).</p>
            </div>

            <div
              v-if="!online"
              class="mb-6 mt-4 flex items-start rounded-md bg-red-100 px-6 py-4 text-sm font-medium text-red-800"
            >
              <ExclamationTriangleIcon class="mr-2 mt-px h-6 w-6" />
              <span>You can't do this because you're currently offline.</span>
            </div>

            <div class="mt-6 text-right">
              <ModalCancelButton @click="$emit('close')" class="mr-2">Cancel</ModalCancelButton>

              <button
                type="submit"
                :disabled="!online"
                class="inline-block cursor-default rounded bg-red-500 px-4 py-2 text-sm font-medium leading-[22px] text-white ring-red-500 hover:bg-red-600 active:ring-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Remove from team
              </button>
            </div>
          </form>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
