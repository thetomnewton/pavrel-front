<script setup lang="ts">
import PopoutDropdown from '../components/PopoutDropdown.vue'
import PopoutDropdownOption from '../components/PopoutDropdownOption.vue'
import StatusIcon from '../components/StatusIcon.vue'
import { computed, ref } from 'vue'
import { IdeaStatus } from '../types'
import { useStore } from 'vuex'

const emit = defineEmits(['selected'])

defineProps<{
  statuses: IdeaStatus[]
}>()

const open = ref(false)
const status = ref('')

const store = useStore()

const sortedStatuses = computed<IdeaStatus[]>(() => store.getters['base/currentTeamStatuses'])

const filteredStatuses = computed(() => {
  if (!status.value) return sortedStatuses.value

  return sortedStatuses.value.filter(({ name }) => name.toLowerCase().includes(status.value.toLowerCase()))
})

function handleClose() {
  open.value = false
  resetSearch()
}

function resetSearch() {
  setTimeout(() => {
    status.value = ''
  }, 150)
}

function selectStatus(id: IdeaStatus['id']) {
  emit('selected', id)
  handleClose()
}

function toggleOpen(e: Event) {
  e.stopPropagation()

  open.value = !open.value
}
</script>

<template>
  <slot :open="open" :toggleOpen="toggleOpen" />

  <PopoutDropdown
    :model-value="status"
    :open="open"
    :options="filteredStatuses"
    search-placeholder="Set status..."
    @update:model-value="status = $event"
    @close="handleClose"
  >
    <PopoutDropdownOption
      v-for="{ name, id, category } in filteredStatuses"
      :key="id"
      @click.native.stop="selectStatus(id)"
      class="flex items-center px-3"
    >
      <StatusIcon :category="category" class="mr-2" />
      <span>{{ name }}</span>
    </PopoutDropdownOption>
  </PopoutDropdown>
</template>
