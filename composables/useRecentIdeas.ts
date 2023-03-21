import { useLocalStorage } from '@vueuse/core'
import { Idea } from '../types'

export function useRecentIdeas() {
  const { currentWorkspace } = useWorkspace()

  const recentIdeas = useLocalStorage<{ [id: string]: string[] }>('recent-ideas', {})

  if (!(currentWorkspace.value.id in recentIdeas.value)) recentIdeas.value[currentWorkspace.value.id] = []

  async function pushToRecentIdeas(idea: Idea) {
    const index = recentIdeas.value[currentWorkspace.value.id].indexOf(idea.id)

    if (index >= 0) recentIdeas.value[currentWorkspace.value.id].splice(index, 1)

    recentIdeas.value[currentWorkspace.value.id].unshift(idea.id)
    recentIdeas.value[currentWorkspace.value.id].splice(6, recentIdeas.value[currentWorkspace.value.id].length - 6)
  }

  const getRecentIdeasFromStorage = () => JSON.parse(localStorage.getItem('recent-ideas') || '{}')

  return { recentIdeas, pushToRecentIdeas, getRecentIdeasFromStorage }
}
