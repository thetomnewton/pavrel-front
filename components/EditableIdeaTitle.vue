<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { nextTick, onMounted, ref, Ref, onUnmounted } from 'vue'
import { debounce } from 'lodash'

defineProps({ modelValue: String })

const emit = defineEmits(['update:modelValue', 'entered'])

const value = ref(null) as Ref<HTMLTextAreaElement | null>

const resizeListener = debounce(() => {
  if (value.value) setHeight(value.value)
}, 25)

onMounted(() => {
  setTimeout(() => {
    const el = value.value
    if (el) setHeight(el)
  }, 50)

  window.addEventListener('resize', resizeListener)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeListener)
})

function input(event: Event) {
  nextTick(() => {
    setHeight(event.target as HTMLTextAreaElement)
  })

  emit('update:modelValue', (event.target as HTMLTextAreaElement)?.value)
}

function setHeight(el: HTMLTextAreaElement) {
  // Reset the height, to ensure it doesn't end up larger than it should be
  el.style.height = '0px'
  el.style.minHeight = '0px'

  el.style.height = `${el.scrollHeight}px`
  el.style.minHeight = `${el.scrollHeight}px`
}
</script>

<template>
  <div class="relative mt-6 mb-[14px] flex">
    <textarea
      :value="modelValue"
      v-bind="$attrs"
      @input="input"
      ref="value"
      @keydown.enter.prevent="$emit('entered', $event)"
      class="w-full resize-none border-none bg-transparent py-2 px-0 text-[26px] font-semibold leading-[35px] placeholder-slate-400 focus:ring-0 dark:placeholder-zinc-500"
    ></textarea>

    <div
      class="pointer-events-none absolute inset-0 py-2 px-0 text-[26px] font-semibold leading-[35px] text-slate-400 dark:text-zinc-500"
      v-if="!modelValue || !modelValue.length"
    >
      Idea title
    </div>
  </div>
</template>
