<script setup lang="ts">
import { useOnline } from '@vueuse/core'
import api from '../api'
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'

defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])

const cancelling = ref(false)

const online = useOnline()
const { currentWorkspace } = useWorkspace()

function cancel() {
  cancelling.value = true

  api
    .post(`/workspaces/${currentWorkspace.value.id}/subscriptions/cancel`)
    .then(() => {
      emit('close')

      setTimeout(() => {
        cancelling.value = false
      }, 150)
    })
    .catch(() => {
      // todo: error handling
      cancelling.value = false
    })
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" class="relative z-10" @click="$emit('close')">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel
          class="mx-auto w-full max-w-[500px] rounded-md bg-white shadow-3xl dark:border dark:border-zinc-700 dark:bg-zinc-900 md:mt-[12vh]"
        >
          <form @submit.prevent="cancel" class="px-8 py-6">
            <p class="mb-4">Are you sure you wish to cancel your subscription?</p>

            <p class="mb-4">You will lose access to all Pro features.</p>

            <p class="flex items-center justify-end space-x-2">
              <button
                type="button"
                @click="$emit('close')"
                class="cursor-default rounded-md px-4 py-2 text-sm font-medium leading-5 active:bg-slate-100 dark:active:bg-zinc-800"
              >
                Close
              </button>

              <Button :disabled="!online || cancelling">Cancel subscription</Button>
            </p>
          </form>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
