import { computed } from 'vue'
import { useStore } from 'vuex'
import { Idea } from '../types'

export function useIdeaUpvotes() {
  const store = useStore()

  const isIdeaUpvoted = computed(() => store.getters['base/isIdeaUpvoted'])
  const ideaUpvoteCount = computed(() => store.getters['base/ideaUpvoteCount'])
  const toggleUpvoteIdea = (idea: Idea) => store.dispatch('base/toggleUpvoteIdea', idea)

  return {
    isIdeaUpvoted,
    ideaUpvoteCount,
    toggleUpvoteIdea,
  }
}
