<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid'

defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <div
    class="fixed inset-0 z-40 flex justify-end p-6 transition lg:p-8"
    :class="{ 'bg-black/20 dark:bg-black/50': open, 'pointer-events-none opacity-0': !open }"
    @click.self="emit('close')"
  >
    <div
      class="min-w-[350px] rounded-lg bg-white shadow-md transition dark:border dark:border-zinc-600 dark:bg-zinc-900 lg:min-w-[400px]"
      :class="{ 'translate-x-[20px]': !open }"
    >
      <h3 class="flex items-center px-8 pt-6 font-semibold">
        <span>Help & Support</span>
        <span class="ml-auto">
          <button
            type="button"
            @click="emit('close')"
            class="p-1 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </span>
      </h3>
    </div>
  </div>
</template>
