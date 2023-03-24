<script setup lang="ts">
import { debounce } from 'lodash-es'
import { onMounted, onUnmounted, ref } from 'vue'

const isMouseDown = ref(false)

const emit = defineEmits(['resize'])

function handleMousedown() {
  isMouseDown.value = true
}

const resizeListener = (e: MouseEvent) => {
  if (isMouseDown.value) emit('resize', e)
}

const debouncedResizeListener = debounce(resizeListener, 1)

const mouseupListener = (e: MouseEvent) => {
  if (isMouseDown.value) isMouseDown.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', debouncedResizeListener)
  window.addEventListener('mouseup', mouseupListener)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', debouncedResizeListener)
  window.removeEventListener('mouseup', mouseupListener)
})
</script>

<template>
  <div @mousedown="handleMousedown"></div>
</template>
