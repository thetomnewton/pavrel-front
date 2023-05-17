<script setup lang="ts">
const show = ref(false)
const hovering = ref(false)

const props = defineProps<{
  position?: 'top' | 'bottom'
}>()

const actualPos = computed(() => props.position ?? 'bottom')

const posStyles = {
  top: {
    top: 'calc((24px + .5rem) * -1)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  bottom: {
    top: 'calc(100% + .5rem)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}

function triggerShow() {
  hovering.value = true
  setTimeout(() => {
    if (hovering.value) show.value = true
  }, 500)
}

function triggerHide() {
  hovering.value = false
  show.value = false
}
</script>

<template>
  <div class="relative" @mouseenter="triggerShow" @mouseleave="triggerHide" @click="triggerHide">
    <slot name="default" />

    <Transition
      enter-active-class="transition"
      enter-from-class="transform opacity-0 scale-90"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-90"
    >
      <div
        v-if="show"
        class="pointer-events-none absolute z-20 flex min-h-[26px] items-center whitespace-nowrap rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs font-medium leading-4 text-slate-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        :style="posStyles[actualPos]"
      >
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>
