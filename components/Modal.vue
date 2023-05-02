<script setup lang="ts">
import { watch } from 'vue'
import { dialogState } from '~/helpers/dialog-state'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const listener = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  newValue => {
    dialogState.modalOpen = !!newValue

    if (newValue) window.addEventListener('keydown', listener)
    else window.removeEventListener('keydown', listener)
  }
)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition"
      leave-active-class="transition"
      enter-from-class="opacity-0 pointer-events-none"
      leave-to-class="opacity-0 pointer-events-none"
    >
      <div
        v-if="open"
        v-bind="$attrs"
        class="fixed inset-0 z-50 bg-slate-900/20 px-3 py-6 dark:bg-zinc-900/50"
        @click.self="$emit('close')"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
