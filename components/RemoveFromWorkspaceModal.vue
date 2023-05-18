<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import { useOnline } from '@vueuse/core'
import { useStore } from 'vuex'
import { User } from '~/types'

const props = defineProps<{
  open: boolean
  user?: User
}>()

const online = useOnline()
const store = useStore()

const emit = defineEmits(['close'])

const removing = ref(false)

function attemptRemove() {
  if (!props.user) return

  removing.value = true

  store
    .dispatch('base/removeUserFromWorkspace', props.user)
    .then(response => {
      removing.value = false
      emit('close')
    })
    .catch(() => {
      removing.value = false
    })
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10" @click.self="$emit('close')">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel class="mx-auto w-full max-w-[500px] rounded-md bg-white shadow-3xl dark:bg-zinc-800 md:mt-[12vh]">
          <form @submit.prevent="attemptRemove" class="px-8 py-6" v-if="user">
            <p class="mb-4">
              Are you sure you want to remove <span class="font-semibold">{{ user.name }}</span> from this workspace?
            </p>

            <p class="mb-4">
              This may cause unintended consequences. Please ensure that if they are an admin of a team that you do not
              wish to be deleted, another admin is in place to manage the team.
            </p>

            <p class="mb-4" v-if="!online">
              <Alert>You must be online to perform this action</Alert>
            </p>

            <p class="flex items-center justify-end space-x-2">
              <button
                type="button"
                @click="emit('close')"
                class="cursor-default rounded-md px-4 py-2 text-sm font-medium leading-5 hover:bg-slate-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                Cancel
              </button>

              <Button type="submit" :disabled="!online">Remove member</Button>
            </p>
          </form>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
