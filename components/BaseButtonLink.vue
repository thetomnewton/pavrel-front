<script setup lang="ts">
import { computed } from 'vue'
import Spinner from './Spinner.vue'

const props = defineProps({
  href: { type: String },
  button: { type: String, default: 'tertiary' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
})

const classes = computed(() => {
  let base =
    'inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 justify-center '

  if (props.button === 'primary') base += 'bg-blue-600 hover:bg-blue-700 text-white '
  if (props.button === 'tertiary') base += 'text-slate-700 bg-white hover:shadow hover:text-slate-800 '
  if (props.button === 'tertiary' && !props.flat) base += 'border-slate-300 '
  if (props.button === 'tertiary' && props.flat) base += 'hover:border-slate-300 '
  if (!props.flat) base += 'shadow-sm '
  if (props.flat) base += 'hover:shadow-sm '
  if (props.disabled) base += 'opacity-50 pointer-events-none '

  return base
})
</script>

<template>
  <a :href="href" :class="classes">
    <Spinner v-if="loading" class="mr-2" />
    <slot />
  </a>
</template>
