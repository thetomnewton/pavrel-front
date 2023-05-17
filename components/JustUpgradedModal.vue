<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'
import BaseDialog from './BaseDialog.vue'

defineProps<{
  open: boolean
  plan: string | null
}>()

defineEmits(['close'])
</script>

<template>
  <BaseDialog :open="open" @close="$emit('close')">
    <div
      class="mx-auto mt-12 flex w-[90%] max-w-[550px] flex-col overflow-hidden rounded-lg bg-white py-10 px-8 text-center text-slate-800 shadow-xl dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
    >
      <div class="mb-4 flex justify-center">
        <CheckBadgeIcon class="h-10 w-10 text-green-600" />
      </div>
      <div class="mb-2 text-sm font-medium">Success! Your workspace has been upgraded.</div>
      <p class="text-sm text-slate-600 dark:text-zinc-400">
        Please check your email for confirmation.<br />We hope your team enjoys Pavrel Pro!
      </p>

      <div class="mt-6">
        <button
          type="button"
          @click="$emit('close')"
          class="inline-flex cursor-default appearance-none items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium leading-5 text-white hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  </BaseDialog>
</template>
