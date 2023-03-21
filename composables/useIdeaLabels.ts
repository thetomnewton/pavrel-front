import { useStore } from 'vuex'
import { Idea, Label } from '../types'

export function useIdeaLabels() {
  const store = useStore()
  const { currentWorkspace } = useWorkspace()
  const { user } = useUsers()

  const addLabelToIdea = (obj: { ideaId: Idea['id']; labelId: Label['id']; labels: Label[] }) => {
    store.commit('base/addLabelToIdea', obj)
    store.commit('base/labelCreationActivity', {
      ideaId: obj.ideaId,
      labelId: obj.labelId,
      workspaceId: currentWorkspace.value.id,
      initiatorId: user.value.id,
    })
  }

  const removeLabelFromIdea = (obj: { ideaId: Idea['id']; labelId: Label['id'] }) => {
    store.commit('base/removeLabelFromIdea', obj)
    store.commit('base/labelRemovalActivity', {
      ideaId: obj.ideaId,
      labelId: obj.labelId,
      workspaceId: currentWorkspace.value.id,
      initiatorId: user.value.id,
    })
  }

  const saveIdeaLabel: (label: Label) => Promise<Label> = (label: Label) => store.dispatch('base/saveLabel', label)

  return {
    addLabelToIdea,
    removeLabelFromIdea,
    saveIdeaLabel,
  }
}
