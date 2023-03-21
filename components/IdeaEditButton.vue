<script setup lang="ts">
import { PencilIcon } from '@heroicons/vue/24/solid'

defineProps<{
  url: string
}>()
</script>

<template>
  <RouterLink
    :to="url"
    class="group inline-flex cursor-default items-center rounded p-[6px] leading-4 hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700/70"
  >
    <PencilIcon
      class="-mt-px h-[14px] w-[14px] text-slate-500 group-hover:text-slate-800 dark:text-zinc-500 dark:group-hover:text-zinc-400"
    />
    <div
      class="ml-1 hidden text-slate-700 group-hover:text-slate-900 dark:text-zinc-300 dark:group-hover:text-zinc-200 xs:block"
    >
      Edit
    </div>
  </RouterLink>
</template>
