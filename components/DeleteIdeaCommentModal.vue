<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { IdeaComment } from '../types'
import Modal from './Modal.vue'

const props = defineProps<{
  open: boolean
  comment: IdeaComment | null
}>()

const deleting = ref(false)

const emit = defineEmits(['close'])

const store = useStore()

function destroy() {
  if (deleting.value) return

  deleting.value = true

  store.dispatch('base/deleteIdeaComment', props.comment).then(() => {
    deleting.value = false
  })

  emit('close')
}
</script>

<template>
  <Modal :open="open" @close="$emit('close')" v-if="comment">
    <div class="mx-auto w-full max-w-[500px] rounded-lg bg-white px-8 py-6 shadow-3xl md:mt-[12vh]">
      <div>Are you sure you want to delete this comment?</div>
      <div class="mt-3">This can't be undone.</div>

      <div class="mt-4 flex items-center justify-end">
        <form @submit.prevent="destroy" class="flex items-center">
          <span
            class="mr-3 inline-block cursor-pointer rounded px-4 py-2 text-sm font-medium leading-[22px] hover:bg-slate-100 active:bg-slate-200"
            @click="$emit('close')"
          >
            Cancel
          </span>

          <button
            type="submit"
            :disabled="deleting"
            class="mr-3 inline-block cursor-pointer rounded bg-red-500 px-4 py-2 text-sm font-medium leading-[22px] text-white ring-red-500 hover:bg-red-600 active:ring-2"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  </Modal>
</template>
