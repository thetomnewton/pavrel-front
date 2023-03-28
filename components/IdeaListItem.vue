<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import IdeaLabel from '../components/IdeaLabel.vue'
import IdeaStatusDropdown from '../components/IdeaStatusDropdown.vue'
import IdeaUpvoter from '../components/IdeaUpvoter.vue'
import StatusIcon from '../components/StatusIcon.vue'
import { Idea, Label, Team } from '../types'

const props = defineProps<{
  idea: Idea
  team: Team
  columnWidth: string
  checked?: boolean
}>()

const emit = defineEmits(['toggle-checked'])

const store = useStore()
const { isIdeaUpvoted, ideaUpvoteCount, toggleUpvoteIdea } = useIdeaUpvotes()

const ideaIdentifier = computed(() => `${props.team.slug}-${props.idea.team_idea_id}`)

const statusCategory = computed(() => props.team.statuses.find(status => status.id === props.idea.status_id)?.category)

function ideaLabels(ids: Label[]): Label[] {
  const isLabel = (label: Label | undefined): label is Label => !!label

  return ids.map(({ id }) => props.team.labels.find(label => label.id === id)).filter(isLabel)
}

function updateStatus(id: string) {
  updateIdea({ ...props.idea, ...{ status_id: id } })
}

function toggleChecked(value: boolean) {
  emit('toggle-checked', value)
}

const updateIdea = (idea: Idea) => store.dispatch('base/updateIdea', idea)
</script>

<template>
  <div
    class="flex cursor-default items-center border-b pr-6 text-[.8125rem] leading-[42px]"
    :class="{
      'border-blue-50 bg-blue-50 dark:border-zinc-800 dark:bg-zinc-800': checked,
      'border-slate-50 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50': !checked,
    }"
  >
    <label class="group flex h-[43px] items-center justify-center pl-6 pr-2 lg:pl-[13px] lg:pr-[13px]" @click.stop="">
      <Checkbox
        @click.stop=""
        :checked="!!checked"
        @update:checked="toggleChecked"
        class="block h-[14px] w-[14px] shadow-none lg:group-hover:opacity-100"
        :class="{ 'lg:opacity-0': !checked }"
      />
    </label>

    <span class="identifier mr-[5px] hidden whitespace-nowrap text-slate-500 dark:text-zinc-400 sm:block">
      {{ ideaIdentifier }}
    </span>

    <div class="relative">
      <IdeaStatusDropdown :statuses="team.statuses" v-slot="{ toggleOpen }" @selected="updateStatus">
        <StatusIcon @click.stop="toggleOpen" :category="statusCategory" />
      </IdeaStatusDropdown>
    </div>

    <span class="ml-2 truncate font-medium text-slate-800 dark:text-zinc-300">{{ idea.title }}</span>

    <span class="ml-auto hidden items-center xs:flex">
      <template v-if="idea.labels.length <= 2">
        <IdeaLabel v-for="{ name, color } in ideaLabels(idea.labels)" :color="color" class="truncate">
          {{ name }}
        </IdeaLabel>
      </template>

      <template v-else>
        <div class="flex items-center px-2">
          <span class="inline-flex items-center">
            <span
              v-for="{ color } in ideaLabels(idea.labels)"
              :style="{ backgroundColor: color }"
              class="mr-1 h-[6px] w-[6px] rounded-full"
            ></span>
            <span class="ml-[6px] text-slate-800 dark:text-zinc-400">{{ idea.labels.length }} Labels</span>
          </span>
        </div>
      </template>
    </span>

    <IdeaUpvoter
      :count="ideaUpvoteCount(idea)"
      :is-upvoted="isIdeaUpvoted(idea)"
      @click.stop="toggleUpvoteIdea(idea)"
      class="ml-auto xs:ml-1"
    />
  </div>
</template>

<style scoped>
.identifier {
  min-width: v-bind(columnWidth);
}
</style>
