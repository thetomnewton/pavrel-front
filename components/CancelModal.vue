<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'

defineProps<{
  open: boolean
}>()

defineEmits(['close'])

function cancel() {
  //
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" class="relative z-10" @click.self="$emit('close')">
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
              <Button>Cancel subscription</Button>
            </p>
          </form>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
