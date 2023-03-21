<script setup lang="ts">
import { computed, WritableComputedRef } from 'vue'

const emit = defineEmits(['update:checked'])

const props = defineProps<{
  checked: boolean
  value?: boolean
}>()

const proxyChecked: WritableComputedRef<boolean> = computed({
  get() {
    return props.checked
  },
  set(newValue) {
    emit('update:checked', newValue)
  },
})
</script>

<template>
  <input
    type="checkbox"
    :value="value"
    v-model="proxyChecked"
    class="rounded border-slate-300 text-blue-600 shadow-sm hover:border-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:ring-offset-0 dark:border-zinc-500 dark:bg-transparent dark:checked:border-blue-600 dark:checked:bg-blue-600 dark:focus:border-blue-600"
  />
</template>
