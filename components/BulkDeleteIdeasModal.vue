<script setup lang="ts">
import { Idea } from '../types'
import Modal from './Modal.vue'

defineEmits(['close', 'destroy'])

defineProps<{
  open: boolean
  ideaIds: Idea['id'][]
}>()
</script>

<template>
  <Modal :open="open" @close="$emit('close')">
    <div
      class="mx-auto mt-[100px] w-full max-w-[500px] rounded-lg bg-white px-8 py-6 text-[15px] font-normal leading-6 text-slate-800 shadow-3xl dark:bg-zinc-800 dark:text-zinc-200"
    >
      <div class="font-medium">
        Are you sure you want to delete {{ ideaIds.length }} {{ ideaIds.length !== 1 ? 'ideas' : 'idea' }}?
      </div>
      <div class="mt-3">This can't be undone.</div>
      <div class="mt-4 flex items-center justify-end">
        <ModalCancelButton class="mr-3" @click="$emit('close')">Cancel</ModalCancelButton>

        <button
          type="button"
          class="mr-3 inline-block cursor-default rounded bg-red-500 px-4 py-2 text-sm font-medium leading-[22px] text-white ring-red-500 hover:bg-red-600 active:ring-2"
          @click="$emit('destroy')"
        >
          Delete
        </button>
      </div>
    </div>
  </Modal>
</template>
