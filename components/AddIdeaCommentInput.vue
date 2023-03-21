<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import Tiptap from './Tiptap.vue'

const props = defineProps({
  idea: { type: Object, required: true },
})

const store = useStore()

const { user } = useUsers()

const commentForm = ref(null)
const inputBox = ref(null)
const newComment = ref('')
const commentBoxFocused = ref(false)

function addComment() {
  if (!newComment.value) return

  store.dispatch('base/addIdeaComment', {
    ideaId: props.idea.id,
    comment: {
      comment: newComment.value,
    },
  })

  newComment.value = ''
}

function handleEnterPress(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) addComment()
}

function focusCommentBox() {
  // @ts-ignore
  inputBox.value?.focusEditor()
}

function handleFocus() {
  commentBoxFocused.value = true
}

function handleBlur() {
  commentBoxFocused.value = false
}
</script>

<template>
  <div class="flex items-start">
    <img class="min-w-5 mr-3 mt-[5px] h-5 w-5 rounded-full object-cover" :src="user.profile_photo_url" />

    <div
      class="flex-1 cursor-text overflow-hidden rounded border border-slate-200 bg-white px-3 pt-2 pb-3 dark:border-zinc-700 dark:bg-zinc-900"
      :class="[commentBoxFocused ? 'border-blue-500 ring-1 ring-blue-500' : '']"
    >
      <form @submit.prevent="addComment" @keydown.enter="handleEnterPress" @click="focusCommentBox" ref="commentForm">
        <Tiptap
          ref="inputBox"
          v-model="newComment"
          placeholder="Add comment..."
          no-headings
          @focus="handleFocus"
          @blur="handleBlur"
        />

        <div class="mt-2 flex justify-end">
          <button
            type="submit"
            class="inline-flex cursor-default appearance-none rounded px-3 py-[6px] text-sm font-medium leading-5 ring-blue-500 focus:ring-2"
            :class="[
              commentBoxFocused
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-slate-300 bg-white text-slate-700 focus:border-none active:border-none active:bg-blue-700 active:text-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300',
            ]"
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
