<script setup lang="ts">
import { TransitionChild } from '@headlessui/vue'
</script>

<template>
  <div class="fixed inset-0 p-6">
    <TransitionChild
      enter="duration-200 ease-out"
      enter-from="opacity-0 scale-95"
      enter-to="opacity-100 scale-100"
      leave="duration-150 ease-in"
      leave-from="opacity-100 scale-100"
      leave-to="opacity-0 scale-95"
    >
      <slot />
    </TransitionChild>
  </div>
</template>
