<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import vClickOutside from '../directives/click-outside'

const props = defineProps<{
  open: boolean
  searchPlaceholder: string
  modelValue: string
  options: object[]
  position?: string
}>()

const defaultPosition = 'bottom'

const search = ref<HTMLInputElement | null>(null)

const emit = defineEmits(['close', 'update:modelValue'])

const positionClasses = computed(() => {
  const position = props.position || defaultPosition

  if (position === 'bottom') return 'top-[100%] left-0'
  else if (position === 'left') return 'top-0 right-[100%]'
})

watch(
  () => props.open,
  newStatus => {
    if (newStatus) search.value?.focus()
  }
)

function closeFromOutside() {
  if (props.open) emit('close')
}
</script>

<template>
  <div
    class="absolute z-50 origin-top rounded-md bg-white shadow transition-all duration-75 dark:bg-zinc-800"
    :class="[{ open, closed: !open }, positionClasses]"
    v-click-outside="closeFromOutside"
  >
    <span
      class="flex"
      :class="{
        'border-b border-slate-200 dark:border-zinc-700': options.length,
        'overflow-hidden rounded-b': !options.length,
      }"
    >
      <input
        type="text"
        ref="search"
        :tabindex="open ? 0 : -1"
        :value="modelValue"
        onclick="event.stopPropagation()"
        @input="$emit('update:modelValue', ($event?.target as HTMLInputElement)?.value)"
        class="rounded-t-md border-none text-[.8125rem] leading-[17px] focus:ring-0 dark:bg-zinc-800"
        :placeholder="searchPlaceholder"
      />
    </span>

    <div class="dropdown-options font-normal">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dropdown-options {
  max-height: 480px;
  overflow-y: auto;
}
.dropdown-options > :last-child {
  @apply rounded-b-md;
}
.closed {
  opacity: 0;
  transform: scale(0.9);
  pointer-events: none;
}
.open {
  opacity: 1;
  transform: 1;
}
</style>
