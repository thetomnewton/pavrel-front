<script setup lang="ts">
import { Idea, Team } from '../types'
import { useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Tiptap from './Tiptap.vue'

const router = useRouter()
const store = useStore()

defineProps<{
  idea: Idea
}>()

const { currentWorkspace } = useWorkspace()
const ideas = computed<Idea[]>(() => store.state.base.ideas)
const getTeamFromIdea = computed<(idea: Idea) => Team | undefined>(() => store.getters['base/getTeamFromIdea'])

onMounted(() => {
  const tags = document.querySelectorAll('.ProseMirror span.tag')

  Array.from([...tags]).forEach(node => {
    node.addEventListener('click', e => {
      // @ts-ignore
      const idea = ideas.value.find(idea => idea.id === e.target.dataset.id)

      if (idea) {
        const team = getTeamFromIdea.value(idea)

        if (team) router.push(`/${currentWorkspace.value.slug}/ideas/${team.slug}-${idea?.team_idea_id}`)
      }
    })
  })
})
</script>

<template>
  <div class="mx-5">
    <div class="mt-6 mb-[14px] py-2 text-[26px] font-semibold leading-[35px]">
      {{ idea.title }}
    </div>

    <div class="flex">
      <Tiptap :model-value="idea.description ?? undefined" :editable="false" placeholder="Add description..." />
    </div>
  </div>
</template>
