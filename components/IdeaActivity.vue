<script setup lang="ts">
import { ulid } from 'ulid'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { Idea, IdeaActivity } from '../types'
import AddIdeaCommentInput from './AddIdeaCommentInput.vue'
import IdeaActivityStream from './IdeaActivityStream.vue'
import dayjs from 'dayjs/esm'

const store = useStore()
const ideaActivities = computed<IdeaActivity[]>(() => store.state.base.ideaActivities)
const { currentWorkspace } = useWorkspace()

const props = defineProps<{
  idea: Idea
}>()

const editing = ref(false)
const setEditing = (value: boolean) => (editing.value = value)

const comments = computed(() => store.getters['base/ideaComments'](props.idea.id))

const activities = computed(() => {
  const out = ideaActivities.value.filter(activity => activity.idea_id === props.idea.id)
  out.unshift({
    id: ulid(),
    workspace_id: currentWorkspace.value.id,
    idea_id: props.idea.id,
    type: 'idea.created',
    created_at: dayjs(props.idea.created_at).format('YYYY-MM-DD HH:mm:ss'),
    initiator_id: props.idea.creator_id,
    initiator_type: 'user',
    meta: {},
  })

  return out
})
</script>

<template>
  <div class="text-slate-800 dark:text-zinc-300">
    <div class="mb-3 text-sm font-medium text-slate-700 dark:text-zinc-300">Activity</div>

    <IdeaActivityStream :comments="comments" :activities="activities ?? []" @editing="setEditing" />

    <AddIdeaCommentInput v-if="!editing" :idea="idea" class="mt-6 mb-16" />
  </div>
</template>
