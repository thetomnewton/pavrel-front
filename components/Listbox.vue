<script setup lang="ts">
import { computed, FunctionalComponent } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  options: { text: string; value: string; icon?: FunctionalComponent }[]
  value: string
  disabled?: boolean
}>()

defineEmits(['update-value'])

const selectedOption = computed(() => props.options.find(option => option.value === props.value))
</script>

<template>
  <Listbox :modelValue="selectedOption" @update:modelValue="$emit('update-value', $event)">
    <div class="relative mt-1">
      <ListboxButton
        class="relative flex w-full cursor-default items-center space-x-3 rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-left font-medium shadow-sm focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:border-zinc-700 dark:bg-zinc-800 dark:focus-visible:ring-zinc-700 sm:text-sm"
        :class="{ 'pointer-events-none opacity-50': !!disabled }"
      >
        <span v-if="selectedOption?.icon">
          <component :is="selectedOption?.icon" class="h-4 w-4" />
        </span>
        <span class="block truncate" v-html="selectedOption?.text"></span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-zinc-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800 sm:text-sm"
          :class="{ hidden: !!disabled }"
        >
          <ListboxOption
            v-slot="{ active }"
            v-for="option in options"
            :key="option.text"
            :value="option.value"
            as="template"
            :disabled="!!disabled"
          >
            <li
              :class="[
                active
                  ? 'bg-blue-50 text-blue-900 dark:bg-zinc-700 dark:text-zinc-200'
                  : 'text-zinc-900 dark:text-zinc-300',
                'relative flex cursor-default select-none items-center space-x-3 py-2 pr-10 pl-4',
              ]"
            >
              <span v-if="option.icon">
                <component :is="option.icon" class="h-4 w-4" />
              </span>

              <span
                :class="[value === option.value ? 'font-medium dark:text-zinc-100' : 'font-normal', 'block truncate']"
                v-html="option.text"
              ></span>
              <span
                v-if="value === option.value"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 dark:text-zinc-300"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
