<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import { Idea } from '../types'
import ModalBg from './ModalBg.vue'
import ModalWrapper from './ModalWrapper.vue'

defineProps<{
  open: boolean
  idea: Idea
  hash?: string
}>()

defineEmits(['close'])
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10" @click.self="$emit('close')">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel
          class="mx-auto w-full max-w-[550px] rounded-md bg-white px-8 py-6 shadow-3xl dark:border dark:border-zinc-700 dark:bg-zinc-900 md:mt-[12vh]"
        >
          <h3 class="mb-4 font-semibold">Idea history</h3>

          <p class="mb-6 text-sm text-slate-600 dark:text-zinc-300">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos eveniet sequi blanditiis, expedita nobis sed,
            quo perspiciatis doloribus praesentium, dignissimos consequatur dolore incidunt nostrum cumque illum unde
            iure velit eos.
          </p>

          <div class="mt-6 text-right">
            <ModalCancelButton @click="$emit('close')">Close</ModalCancelButton>
          </div>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
