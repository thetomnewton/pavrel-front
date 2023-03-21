<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import ModalBg from './ModalBg.vue'
import ModalWrapper from './ModalWrapper.vue'

defineProps<{
  open: boolean
  initialFocus?: HTMLElement
}>()

const emit = defineEmits(['close'])
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog
      as="div"
      @close="emit('close')"
      class="relative z-40"
      @click.self="emit('close')"
      :initial-focus="initialFocus"
    >
      <ModalBg />

      <ModalWrapper>
        <DialogPanel v-bind="$attrs">
          <slot />
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
