<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid'

defineProps<{
  open: boolean
}>()

const helpBg = ref<HTMLDivElement | null>(null)

defineEmits(['close'])
</script>

<template>
  <Transition
    enter-from-class="opacity-0 translate-x-[20px]"
    enter-active-class="transition"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-active-class="transition"
    leave-to-class="opacity-0"
  >
    <div v-if="open" ref="helpBg" class="fixed inset-0 z-20 flex justify-end bg-black/10" @click.self="$emit('close')">
      <div
        class="m-6 min-w-[350px] rounded-lg border border-slate-200 bg-white py-5 px-6 shadow-md dark:border-zinc-600 dark:bg-zinc-900"
      >
        <div class="flex items-center font-medium">
          <span>Help</span>

          <span class="ml-auto">
            <button type="button" @click="$emit('close')" class="cursor-default rounded p-1 dark:hover:bg-zinc-800">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>
