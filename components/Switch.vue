<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  size: { type: Number, default: 12 },
})

const emit = defineEmits(['update:modelValue'])

const width = computed(() => props.size * 2 + 4)

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    role="switch"
    class="rounded-full p-[2px] transition-colors"
    :class="[modelValue ? 'bg-blue-600' : 'bg-slate-300 dark:bg-zinc-700']"
    :style="{ height: `${size + 4}px`, width: `${width}px` }"
    @click="toggle"
  >
    <div class="relative h-full w-full">
      <span
        class="absolute top-0 left-0 rounded-full bg-white shadow transition"
        :class="{ 'translate-x-[100%]': modelValue }"
        :style="{ width: `${size}px`, height: `${size}px` }"
      ></span>
    </div>
  </div>
</template>
