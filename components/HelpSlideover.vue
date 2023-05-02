<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { BookOpenIcon, InboxArrowDownIcon } from '@heroicons/vue/24/outline'

defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <div
    class="fixed inset-0 z-40 flex justify-end transition"
    :class="{ 'bg-black/20 dark:bg-black/50': open, 'pointer-events-none opacity-0': !open }"
    @click.self="emit('close')"
  >
    <div
      class="min-w-[350px] bg-white shadow-md transition dark:border-l dark:border-zinc-600 dark:bg-zinc-900 lg:min-w-[400px]"
      :class="{ 'translate-x-[20px]': !open }"
    >
      <h3 class="mb-6 flex items-center px-8 pt-6 font-semibold">
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

      <div class="space-y-4 px-8">
        <NuxtLink
          href="/docs"
          target="_blank"
          rel="noreferrer"
          class="flex w-full cursor-pointer items-center rounded-md border border-slate-200 px-4 py-3 text-sm font-medium leading-6 text-slate-800 hover:border-slate-300 dark:border-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <BookOpenIcon class="mr-3 h-6 w-6" />
          <span>View documentation</span>
          <span class="ml-auto pl-2">
            <ArrowTopRightOnSquareIcon class="h-5 w-5 text-slate-500 dark:text-zinc-400" />
          </span>
        </NuxtLink>

        <a
          href="mailto:support@pavrel.com"
          target="_blank"
          rel="noreferrer"
          class="flex w-full cursor-pointer items-center rounded-md border border-slate-200 px-4 py-3 text-sm font-medium leading-6 text-slate-800 hover:border-slate-300 dark:border-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <InboxArrowDownIcon class="mr-3 h-6 w-6" />
          <span>Email us</span>
          <span class="ml-auto pl-2">
            <ArrowTopRightOnSquareIcon class="h-5 w-5 text-slate-500 dark:text-zinc-400" />
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
