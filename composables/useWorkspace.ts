import { computed } from 'vue'
import { useStore } from 'vuex'
import { Team, Workspace } from '../types'

export function useWorkspace() {
  const store = useStore()

  const workspaces = computed<Workspace[]>(() => store.state.base.workspaces)
  const currentWorkspace = computed<Workspace>(() => store.getters['base/currentWorkspace'])
  const currentWorkspaceSlug = computed<string>(() => store.state.base.currentWorkspaceSlug)
  const currentWorkspaceTeams = computed<Team[]>(() => store.getters['base/currentWorkspaceTeams'])

  const workspaceIdeasCount = computed(() => store.state.base.ideas.length)
  const cantCreateNewIdeas = computed(() => currentWorkspace.value.plan === 'free' && workspaceIdeasCount.value >= 100)

  const getWorkspaceFromSlug = (slug: string) => workspaces.value?.find(workspace => workspace.slug === slug)

  return {
    workspaces,
    currentWorkspace,
    currentWorkspaceSlug,
    getWorkspaceFromSlug,
    currentWorkspaceTeams,
    cantCreateNewIdeas,
  }
}
