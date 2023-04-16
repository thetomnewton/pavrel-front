<script setup lang="ts">
import { CommandLineIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Idea } from '../types'

const emit = defineEmits(['show-actions-modal', 'cancel'])

defineProps<{
  ideaIds: Idea['id'][]
}>()
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    leave-active-class="transition duration-200 ease-in-out"
    enter-from-class="translate-y-[10px] opacity-0"
    leave-to-class="translate-y-[10px] opacity-0"
  >
    <div
      v-if="ideaIds.length"
      class="fixed left-0 bottom-4 z-40 w-full border border-slate-900 bg-slate-800 px-6 py-[10px] text-sm font-medium text-white shadow-md dark:border-zinc-900 dark:bg-zinc-800 sm:left-[50%] sm:w-auto sm:translate-x-[-50%] sm:rounded-lg"
    >
      <div class="flex items-center">
        <span class="cursor-default whitespace-nowrap">{{ ideaIds.length }} selected</span>
        <button
          type="button"
          class="ml-auto inline-flex cursor-default appearance-none items-center rounded-md border border-slate-500 px-2 py-[6px] text-center text-sm font-medium leading-5 hover:border-slate-400 active:bg-slate-900 dark:border-zinc-500 dark:hover:bg-zinc-700/20 dark:active:bg-zinc-700/50 sm:ml-4"
          @click="emit('show-actions-modal')"
        >
          <CommandLineIcon class="mr-2 h-5 w-5 text-slate-300 dark:text-zinc-300" />
          <span>Actions...</span>
        </button>

        <span
          class="ml-[6px] -mr-[10px] p-2 text-slate-200 hover:text-slate-400 dark:text-zinc-200 dark:hover:text-zinc-400"
          @click="emit('cancel')"
        >
          <XMarkIcon class="h-4 w-4" />
        </span>
      </div>
    </div>
  </Transition>
</template>
