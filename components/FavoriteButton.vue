<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'

defineProps<{
  on: boolean
}>()
</script>

<template>
  <span>
    <StarIcon class="h-[14px] w-[14px] text-slate-500 hover:text-yellow-500 dark:text-zinc-400" v-if="!on" />
    <StarIconSolid class="-ml-px h-[16px] w-[16px] text-yellow-500" v-else />
  </span>
</template>
