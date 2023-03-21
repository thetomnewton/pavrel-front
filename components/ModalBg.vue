<script setup lang="ts">
import { TransitionChild } from '@headlessui/vue'
</script>

<template>
  <TransitionChild
    enter="duration-200 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-150 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <div class="fixed inset-0 bg-slate-900/20 px-3 py-6 dark:bg-zinc-900/60" aria-hidden="true"></div>
  </TransitionChild>
</template>
