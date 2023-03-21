<script setup lang="ts">
import { ref, watch } from 'vue'
import { User } from '../types'

const props = defineProps<{
  items: User[]
  command: (object: object) => void
}>()

const selectedIndex = ref(0)

watch(
  () => props.items,
  () => (selectedIndex.value = 0)
)

function onKeyDown({ event }: { event: KeyboardEvent }) {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (['Enter', 'Tab'].includes(event.key)) {
    enterHandler()
    return true
  }

  return false
}

function upHandler() {
  selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length
}

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

function enterHandler() {
  selectItem(props.items[selectedIndex.value])
}

function selectItem(user: User) {
  // Run the TipTap command to select the user
  props.command({ id: user.id, label: user.name })
}

defineExpose({ onKeyDown })
</script>

<template>
  <div class="items max-h-[200px] overflow-auto" v-if="items.length">
    <button
      class="item inline-flex items-center"
      :class="{ 'is-selected': index === selectedIndex }"
      v-for="(user, index) in items"
      :key="index"
      @click="selectItem(user)"
    >
      <img class="min-w-5 mr-3 h-5 w-5 rounded-full object-cover" :src="user.profile_photo_url" />
      <span>
        {{ user.name }}
      </span>
    </button>
  </div>
  <div v-else></div>
</template>
