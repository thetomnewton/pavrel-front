<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/20/solid'
import { computed } from 'vue'
import { IdeaFilter } from '../types'

const emit = defineEmits(['remove'])

const props = defineProps<{
  filter: IdeaFilter
}>()

const filterName = computed(
  () =>
    ({
      select_status: 'Status',
      select_creator: 'Creator',
      select_labels: 'Labels',
      select_content: 'Content contains',
    }[props.filter.type])
)
</script>

<template>
  <div
    class="flex cursor-default items-center rounded-xl border border-dashed border-slate-300 pr-1 pl-2 leading-6 dark:border-zinc-600 dark:text-zinc-300"
  >
    <span class="mr-[6px]">{{ filterName }}:</span>

    <slot />

    <span
      class="ml-2 flex items-center text-slate-500 hover:text-slate-600 active:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-400 dark:active:text-zinc-300"
      @click="emit('remove')"
    >
      <XCircleIcon class="h-[17px] w-[17px]" />
    </span>
  </div>
</template>
