<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  align?: string
  width?: string
  contentClasses?: string[]
  dontCloseOnClick?: boolean
  triggerWrapperClasses?: string
}>()

const emit = defineEmits(['opened', 'closed'])

const open = ref(false)

const closeOnEscape = (e: KeyboardEvent) => {
  if (open.value && e.key === 'Escape') open.value = false
}

onMounted(() => document.addEventListener('keydown', closeOnEscape))
onUnmounted(() => document.removeEventListener('keydown', closeOnEscape))

const close = () => (open.value = false)
watch(open, value => {
  if (value) emit('opened')
  else emit('closed')
})

onMounted(() => document.addEventListener('keydown', closeOnEscape))
onUnmounted(() => document.removeEventListener('keydown', closeOnEscape))

const widthClass = computed(() => {
  return {
    48: 'w-48',
    '230px': 'w-[230px]',
    '250px': 'w-[250px]',
  }[props.width || '48']
})

const alignmentClasses = computed(() => {
  const align = props.align || 'right'

  if (align === 'left') return 'origin-top-left left-0'
  if (align === 'right') return 'origin-top-right right-0'
  if (align === 'top_left') return 'origin-bottom-left left-0 bottom-[calc(100%+4px)]'

  return 'origin-top'
})

function handleDropdownClick() {
  if (!props.dontCloseOnClick) open.value = false
}
</script>

<template>
  <div class="relative">
    <div @click.stop="open = !open" :class="triggerWrapperClasses">
      <slot name="trigger" :open="open" />
    </div>

    <!-- Full Screen Dropdown Overlay -->
    <div v-show="open" class="fixed inset-0 z-40 h-screen w-screen" @click.stop="open = false"></div>

    <Transition
      enter-active-class="transition ease-out duration-[50ms]"
      enter-from-class="transform opacity-0 scale-90"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-[50ms]"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-90"
    >
      <div
        v-show="open"
        class="absolute z-50 mt-2 rounded-md border border-slate-200 shadow-md dark:border-zinc-900"
        :class="[widthClass, alignmentClasses]"
        style="display: none"
        @click="handleDropdownClick"
      >
        <div class="rounded-md" :class="contentClasses || ['py-1', 'bg-white', 'dark:bg-zinc-800']">
          <slot name="content" :close="close" />
        </div>
      </div>
    </Transition>
  </div>
</template>
