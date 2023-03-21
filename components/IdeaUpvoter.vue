<script setup lang="ts">
import { ArrowUpIcon } from '@heroicons/vue/20/solid'

const emit = defineEmits(['upvote'])

defineProps<{
  count: number
  isUpvoted: boolean
}>()

function upvote() {
  emit('upvote')
}
</script>

<template>
  <div
    @click="upvote"
    class="inline-flex items-center rounded-md border border-transparent py-px pl-[4px] pr-[5px]"
    :class="[
      isUpvoted
        ? 'bg-green-100 text-green-800 active:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:active:bg-green-800'
        : 'hover:border-slate-200 hover:bg-white active:bg-slate-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800',
    ]"
  >
    <ArrowUpIcon class="mr-[2px] h-3 w-3" />

    <span class="min-w-[9px] select-none text-center text-[.8125rem] leading-5">{{ count }}</span>
  </div>
</template>
