<script setup lang="ts">
import PopoutDropdown from '../components/PopoutDropdown.vue'
import PopoutDropdownOption from '../components/PopoutDropdownOption.vue'
import { computed, ref } from 'vue'
import { IdeaStatus } from '../types'
import { useStore } from 'vuex'

const emit = defineEmits(['selected'])

const open = ref(false)
const team = ref('')

const { currentWorkspaceTeams } = useTeams()

const store = useStore()

const filteredTeams = computed(() => {
  if (!team.value) return currentWorkspaceTeams.value

  return currentWorkspaceTeams.value.filter(({ name }) => name.toLowerCase().includes(team.value.toLowerCase()))
})

function handleClose() {
  open.value = false
  resetSearch()
}

function resetSearch() {
  setTimeout(() => {
    team.value = ''
  }, 150)
}

function selectTeam(id: IdeaStatus['id']) {
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
    :model-value="team"
    :open="open"
    :options="currentWorkspaceTeams"
    search-placeholder="Search teams..."
    @update:model-value="team = $event"
    @close="handleClose"
  >
    <PopoutDropdownOption
      v-for="{ name, id } in filteredTeams"
      :key="id"
      @click.native.stop="selectTeam(id)"
      class="flex items-center px-3"
    >
      <span>{{ name }}</span>
    </PopoutDropdownOption>
  </PopoutDropdown>
</template>
