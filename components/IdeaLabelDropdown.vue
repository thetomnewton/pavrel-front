<script setup lang="ts">
import { ref, computed, Ref, DefineComponent } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { colors as labelColors } from '../helpers/idea-labels'
import PopoutDropdown from '../components/PopoutDropdown.vue'
import PopoutDropdownOption from '../components/PopoutDropdownOption.vue'
import { Label } from '../types'

const props = defineProps<{
  labels: Label[]
  selected: string[]
  position: string
}>()

const emit = defineEmits(['toggle', 'create-custom'])

const open = ref(false)
const search = ref('')
const creatingLabel = ref(false)
const creatingLabelName = ref('')
const labelDropdown = ref(null) as Ref<DefineComponent | null>

const filteredLabels = computed(() =>
  props.labels.filter(({ name }) => name.toLowerCase().includes(search.value.toLowerCase()))
)
const labelColorOptions = computed(() => labelColors)
const filteredLabelColorOptions = computed(() =>
  labelColorOptions.value.filter(({ name }) => name.toLowerCase().includes(search.value.toLowerCase()))
)

function toggleOpen() {
  open.value = !open.value
}

function startCreatingLabel() {
  creatingLabel.value = true
  creatingLabelName.value = search.value
  search.value = ''

  // todo: fix
  labelDropdown.value?.$refs.search.focus()
}

function handleClose() {
  open.value = false

  setTimeout(() => {
    search.value = ''
    creatingLabel.value = false
    creatingLabelName.value = ''
  }, 150)
}

function toggle(id: string, close = true) {
  emit('toggle', id)
  if (close) handleClose()
}

function createAndSelectNewCustomLabel(color: string) {
  emit('create-custom', { color, name: creatingLabelName.value })

  handleClose()
}
</script>

<template>
  <slot :open="open" :toggle-open="toggleOpen" />

  <PopoutDropdown
    :model-value="search"
    @update:model-value="search = $event"
    :open="open"
    :options="filteredLabels"
    :search-placeholder="creatingLabel ? `Choose label color` : `Add label...`"
    :position="position"
    class="mr-2"
    @close="handleClose"
    ref="labelDropdown"
  >
    <template v-if="creatingLabel">
      <PopoutDropdownOption
        v-for="{ name, color } in filteredLabelColorOptions"
        class="flex items-center px-3"
        @click.native="createAndSelectNewCustomLabel(color)"
      >
        <span class="mr-3 h-[8px] w-[8px] min-w-[8px] rounded-full" :style="{ backgroundColor: color }"></span>
        <span>{{ name }}</span>
      </PopoutDropdownOption>
    </template>

    <template v-if="filteredLabels.length && !creatingLabel">
      <PopoutDropdownOption v-for="{ name, color, id } in filteredLabels" :key="id" class="flex items-center">
        <span class="px-3">
          <Checkbox :checked="selected.includes(id)" @update:checked="toggle(id, false)" class="mb-1 mt-px" />
        </span>

        <span @click="toggle(id)" class="flex flex-1 items-center pr-3">
          <span class="mr-3 h-2 w-2 rounded-full" :style="{ backgroundColor: color }"></span>

          <span>{{ name }}</span>
        </span>
      </PopoutDropdownOption>
    </template>

    <template v-if="!creatingLabel && (!filteredLabels.length || search.length)">
      <PopoutDropdownOption class="flex items-center border-t bg-slate-50 px-3" @click.native="startCreatingLabel">
        <PlusIcon class="h-4 w-4" />

        <span class="ml-2">
          Create label: "<span class="text-slate-600">{{ search }}</span> "</span
        >
      </PopoutDropdownOption>
    </template>
  </PopoutDropdown>
</template>
