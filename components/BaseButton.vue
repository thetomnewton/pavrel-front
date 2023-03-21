<script setup lang="ts">
import { computed } from 'vue'
import Spinner from './Spinner.vue'

type ButtonType = 'button' | 'submit' | 'reset'

const props = defineProps({
  type: { type: String, default: 'button' },
  button: { type: String, default: 'tertiary' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
  size: { type: String, default: 'sm' },
})

const classes = computed(() => {
  let base =
    'inline-flex items-center border border-transparent font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 justify-center '

  if (props.button === 'primary') base += 'bg-blue-600 hover:bg-blue-700 text-white '
  if (props.button === 'tertiary') base += 'text-slate-700 bg-white hover:shadow hover:text-slate-800 '
  if (props.button === 'tertiary' && !props.flat) base += 'border-slate-300 '
  if (props.button === 'tertiary' && props.flat) base += 'hover:border-slate-300 '
  if (!props.flat) base += 'shadow-sm '
  if (props.flat) base += 'hover:shadow-sm '
  if (props.disabled) base += 'opacity-50 pointer-events-none '
  if (props.size === 'sm') base += 'px-[10px] py-1 text-xs leading-5 rounded '
  else if (props.size === 'md') base += 'px-4 py-2 text-[14px] leading-5 rounded-md'

  return base
})
</script>

<template>
  <button :type="(type as ButtonType)" :class="classes">
    <Spinner v-if="loading" class="mr-2" />
    <slot />
  </button>
</template>
