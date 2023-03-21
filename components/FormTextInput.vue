<script setup lang="ts">
import { ref, watch } from 'vue'

const input = ref<HTMLInputElement | null>(null)

const props = defineProps<{
  modelValue: string
  focus?: boolean
}>()

watch(
  () => props.focus,
  newValue => {
    if (newValue) input.value?.focus()
  }
)

defineExpose(input)
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
    ref="input"
    class="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 sm:text-sm"
  />
</template>
