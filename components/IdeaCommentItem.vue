<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs/esm'
import relative from 'dayjs/esm/plugin/relativeTime'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import DropdownDangerItem from './DropdownDangerItem.vue'
import Tiptap from './Tiptap.vue'
import { IdeaComment, User } from '../types'

dayjs.extend(relative)

const props = defineProps<{
  comment: IdeaComment
}>()

const emit = defineEmits(['show-delete', 'editing', 'edited'])

const store = useStore()

const editing = ref(false)
const editingContent = ref('')
const editBox = ref(null)

const userById = computed<(id: string) => User>(() => store.getters['base/userById'])
const canEdit = computed<boolean>(() => props.comment.creator_id === store.state.base.user.id)
const canDelete = computed<boolean>(() => props.comment.creator_id === store.state.base.user.id)

function relativeTime(timeString: string) {
  return dayjs(timeString).fromNow()
}

function showEdit() {
  editing.value = true
  editingContent.value = props.comment.comment
  emit('editing', true)

  setTimeout(() => {
    ;(editBox.value as any)?.focusEditor()
  })
}

function cancelEdit() {
  editing.value = false
  editingContent.value = ''
  emit('editing', false)
}

function saveEdit() {
  const newContent = editingContent.value
  cancelEdit()

  const newComment = cloneDeep(props.comment)
  newComment.comment = newContent
  newComment.updated_at = new Date().toISOString()

  store.dispatch('base/updateIdeaComment', {
    id: props.comment.id,
    comment: newComment,
  })
}

function handleEditEnterPress(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) saveEdit()
}

function copyLink() {
  navigator.clipboard.writeText(`${location.href}#comment-${props.comment.id}`)

  store.commit('base/showToast', {
    type: 'copy-clipboard',
    data: 'Comment URL copied to clipboard',
  })
}

function focusEditor() {
  ;(editBox.value as any)?.focusEditor()
}

function stopProp(event: Event) {
  event.stopPropagation
}
</script>

<template>
  <div :id="`comment-${comment.id}`" class="flex w-full items-start pb-1.5">
    <img
      class="min-w-5 mr-3 mt-[5px] h-5 w-5 rounded-full object-cover"
      :src="userById(comment.creator_id)?.profile_photo_url"
    />

    <div class="flex-1">
      <div class="mb-[2px] flex w-full items-center text-[.8125rem]">
        <div class="font-medium leading-7 text-slate-700 dark:text-zinc-300">
          {{ userById(comment.creator_id)?.name }}
        </div>
        <div class="ml-2 leading-7 text-slate-500 dark:text-zinc-400" v-if="!editing">
          {{ relativeTime(comment.created_at) }}
          <template v-if="comment.updated_at !== comment.created_at">(edited)</template>
        </div>

        <span class="ml-auto" v-if="!editing">
          <Dropdown>
            <template #trigger="{ open }">
              <div
                class="rounded px-2 py-[6px] leading-5 hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700/30"
                :class="{ 'bg-slate-200 dark:bg-zinc-700/30': open }"
              >
                <EllipsisHorizontalIcon class="min-w-4 h-4 w-4 text-slate-600 dark:text-zinc-400" />
              </div>
            </template>

            <template #content>
              <div class="font-medium leading-7 text-slate-700 dark:text-zinc-400">
                <DropdownItem v-if="canEdit" @click="showEdit">Edit</DropdownItem>
                <DropdownItem @click="copyLink"> Copy comment link </DropdownItem>

                <template v-if="canDelete">
                  <div class="my-1 h-px bg-slate-200 dark:bg-zinc-700"></div>

                  <DropdownDangerItem @click="$emit('show-delete')"> Delete </DropdownDangerItem>
                </template>
              </div>
            </template>
          </Dropdown>
        </span>
      </div>

      <div class="ProseMirror" v-if="!editing">
        <div v-html="comment.comment" class="text-[15px]"></div>
      </div>

      <div v-else>
        <form
          @submit.prevent="saveEdit"
          @keydown.enter="handleEditEnterPress"
          class="cursor-text rounded border border-slate-200 px-4 py-2 dark:border-zinc-700"
          @click="focusEditor"
        >
          <Tiptap ref="editBox" no-headings v-model="editingContent" class="text-slate-900 dark:text-zinc-300" />

          <div class="flex cursor-default items-center justify-end">
            <button
              @click="cancelEdit"
              type="button"
              class="mr-2 inline-flex cursor-default appearance-none rounded px-2 py-1 text-[.8125rem] font-medium leading-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-zinc-400 dark:hover:bg-transparent dark:hover:text-zinc-300 dark:active:text-white"
            >
              Cancel
            </button>
            <button
              @click="stopProp"
              type="submit"
              class="inline-flex cursor-default appearance-none rounded bg-blue-600 px-2 py-1 text-[.8125rem] font-medium leading-5 text-white hover:bg-blue-700 focus:ring-2 active:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/css/prose.css';
</style>
