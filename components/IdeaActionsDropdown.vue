<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import { Idea, Team } from '../types'

const store = useStore()

const props = defineProps<{
  idea: Idea
}>()

const emit = defineEmits(['delete-idea', 'move-teams'])

const deleting = ref(false)
const movingTeam = ref(false)

function handleDeletion() {
  deleting.value = false
  emit('delete-idea', props.idea)
}

function handleMove(newTeam: Team) {
  movingTeam.value = false
  emit('move-teams', newTeam)
}

function copyLink() {
  navigator.clipboard.writeText(location.href)

  store.commit('base/showToast', {
    type: 'copy-clipboard',
    data: 'Idea URL copied to clipboard',
  })
}
</script>

<template>
  <Menu as="div" class="relative flex">
    <MenuButton
      as="div"
      class="group ml-2 inline-flex cursor-default items-center rounded p-[6px] leading-4 text-slate-500 hover:bg-slate-100 active:bg-slate-200 ui-open:bg-slate-200 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:active:bg-zinc-700/70 dark:ui-open:bg-zinc-800"
    >
      <EllipsisHorizontalIcon
        class="-mt-px h-[14px] w-[14px] group-hover:text-slate-800 dark:group-hover:text-zinc-400"
      />
      <div
        class="ml-1 hidden text-slate-700 group-hover:text-slate-900 dark:text-zinc-300 dark:group-hover:text-zinc-200 xs:block"
      >
        Actions
      </div>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 top-[calc(100%+4px)] z-10 w-[190px] rounded border border-slate-200 bg-white py-1 shadow outline-none dark:border-zinc-700 dark:bg-zinc-800"
      >
        <MenuItem as="div" @click="copyLink" v-slot="{ active }">
          <div
            class="cursor-default px-3 leading-7 text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-zinc-300 dark:hover:bg-zinc-700/70 dark:hover:text-zinc-200 dark:active:bg-zinc-700"
            :class="{ 'bg-slate-200 text-slate-900': active }"
          >
            Copy idea link
          </div>
        </MenuItem>

        <MenuItem as="div" @click="movingTeam = true" v-slot="{ active }">
          <div
            class="cursor-default px-3 leading-7 text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-zinc-300 dark:hover:bg-zinc-700/70 dark:hover:text-zinc-200 dark:active:bg-zinc-700"
            :class="{ 'bg-slate-200 text-slate-900': active }"
          >
            Move to team...
          </div>
        </MenuItem>

        <MenuItem as="div" @click="movingTeam = true" v-slot="{ active }">
          <div
            class="cursor-default px-3 leading-7 text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-zinc-300 dark:hover:bg-zinc-700/70 dark:hover:text-zinc-200 dark:active:bg-zinc-700"
            :class="{ 'bg-slate-200 text-slate-900': active }"
          >
            View history
          </div>
        </MenuItem>

        <div class="my-1 h-px bg-slate-100 dark:bg-zinc-700"></div>

        <MenuItem as="div" @click="deleting = true" v-slot="{ active }">
          <div
            class="cursor-default px-3 leading-7 hover:bg-red-500 hover:text-white active:bg-red-600"
            :class="{ 'bg-red-600 text-white': active, 'text-red-500': !active }"
          >
            Delete
          </div>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>

  <DeleteIdeaModal :open="deleting" :idea="idea" @close="deleting = false" @delete="handleDeletion" />
  <MoveTeamsModal :open="movingTeam" :idea="idea" @close="movingTeam = false" @moved="handleMove" />
</template>
