<script setup lang="ts">
import { computed, ref } from 'vue'
import { IdeaActivity, IdeaComment } from '../types'
import DeleteIdeaCommentModal from './DeleteIdeaCommentModal.vue'
import IdeaCommentItem from './IdeaCommentItem.vue'
import IdeaActivityItem from './IdeaActivityItem.vue'
import dayjs from 'dayjs'
import { groupBy } from 'lodash-es'

const props = defineProps<{
  comments: IdeaComment[]
  activities: IdeaActivity[]
}>()

const emit = defineEmits(['editing'])

const deleteIdeaComment = ref<{
  open: boolean
  comment: IdeaComment | null
}>({
  open: false,
  comment: null,
})

type StreamCommentItem = {
  type: 'comment'
  item: IdeaComment
}

type StreamActivityItem = {
  type: 'activity'
  item: IdeaActivity
}

type ActivityStreamItem = StreamCommentItem | StreamActivityItem

const stream = computed<ActivityStreamItem[][]>(() => {
  const mappedComments: StreamCommentItem[] = props.comments.map(comment => ({ type: 'comment', item: comment }))

  const mappedActivities: StreamActivityItem[] = props.activities.map(activity => ({
    type: 'activity',
    item: activity,
  }))

  const out: ActivityStreamItem[] = mappedComments
    .concat(mappedActivities as [])
    .sort((a, b) => new Date(a.item.created_at).getTime() - new Date(b.item.created_at).getTime())
    .map(item => ({ ...item, ...{ day: dayjs(item.item.created_at).format('YYYYMMDD') } }))

  return Object.values(groupBy(out, 'day'))
})

function openDeleteCommentModal(comment: IdeaComment) {
  deleteIdeaComment.value.open = true
  deleteIdeaComment.value.comment = comment
}

function emitEditing(value: boolean) {
  emit('editing', value)
}
</script>

<template>
  <div class="mb-4">
    <div class="space-y-5">
      <div v-for="streamDay in stream" class="relative space-y-3">
        <div class="absolute top-[calc(100%+3px)] left-[10px] h-4 w-px bg-slate-200 dark:bg-zinc-700"></div>
        <div v-for="{ type, item } in streamDay">
          <template v-if="type === 'comment'">
            <IdeaCommentItem
              :comment="(item as IdeaComment)"
              :key="item.id"
              @show-delete="openDeleteCommentModal(item as IdeaComment)"
              @editing="emitEditing"
            />
          </template>

          <template v-if="type === 'activity'">
            <IdeaActivityItem :activity="(item as IdeaActivity)" />
          </template>
        </div>
      </div>
    </div>

    <DeleteIdeaCommentModal
      :open="deleteIdeaComment.open"
      :comment="deleteIdeaComment.comment"
      @close="deleteIdeaComment.open = false"
    />
  </div>
</template>
