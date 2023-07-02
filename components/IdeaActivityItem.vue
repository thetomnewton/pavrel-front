<script setup lang="ts">
import {
  IdeaActivity,
  LabelAddedActivity as LabelAddedActivityType,
  LabelRemovedActivity as LabelRemovedActivityType,
  StatusUpdateActivity as StatusUpdateActivityType,
  TitleUpdateActivity as TitleUpdateActivityType,
} from '../types'
import DescriptionUpdateActivity from './DescriptionUpdateActivity.vue'
import IdeaCreatedActivity from './IdeaCreatedActivity.vue'
import LabelAddedActivity from './LabelAddedActivity.vue'
import StatusUpdateActivity from './StatusUpdateActivity.vue'
import TitleUpdateActivity from './TitleUpdateActivity.vue'

defineProps<{
  activity: IdeaActivity
}>()

defineEmits(['view-history'])
</script>

<template>
  <template v-if="activity.type === 'idea.created'">
    <IdeaCreatedActivity :activity="activity" />
  </template>

  <template v-else-if="activity.type === 'status.updated'">
    <StatusUpdateActivity :activity="(activity as StatusUpdateActivityType)" />
  </template>

  <template v-else-if="activity.type === 'title.updated'">
    <TitleUpdateActivity :activity="(activity as TitleUpdateActivityType)" />
  </template>

  <template v-else-if="activity.type === 'description.updated'">
    <DescriptionUpdateActivity :activity="activity" @view-history="$event => $emit('view-history', $event)" />
  </template>

  <template v-else-if="activity.type === 'label.added' || activity.type === 'label.removed'">
    <LabelAddedActivity :activity="(activity as LabelAddedActivityType | LabelRemovedActivityType)" />
  </template>
</template>
