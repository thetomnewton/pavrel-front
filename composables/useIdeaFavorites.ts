import { computed } from 'vue'
import { useStore } from 'vuex'
import { Idea } from '../types'

export function useIdeaFavorites() {
  const store = useStore()

  const isFavorite = computed<(idea: Idea) => boolean>(() => store.getters['base/isFavorite'])

  const toggleFavorite = (idea: Idea) => store.dispatch('base/toggleFavorite', idea)

  return { isFavorite, toggleFavorite }
}
