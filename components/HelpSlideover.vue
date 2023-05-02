<script setup lang="ts">
defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <div
    class="fixed inset-0 z-40 flex justify-end p-6 transition lg:p-8"
    :class="{ 'bg-black/20': open, 'pointer-events-none opacity-0': !open }"
    @click.self="emit('close')"
  >
    <div
      class="rounded-lg border bg-white shadow-md transition dark:bg-zinc-900"
      :class="{ 'translate-x-[20px]': !open }"
    >
      help
    </div>
  </div>
</template>
