import { useStore } from 'vuex'
import { Idea, Label } from '../types'

export function useIdeaLabels() {
  const store = useStore()
  const { currentWorkspace } = useWorkspace()
  const { user } = useUsers()

  function addLabelToIdea(obj: { ideaId: Idea['id']; labelId: Label['id']; labels: Label[] }) {
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

  function saveIdeaLabel(label: Label): Promise<Label> {
    return store.dispatch('base/saveLabel', label)
  }

  function isLabel(label: Label | undefined): label is Label {
    return !!label
  }

  function ideaLabels(ids: Label[], possibleLabels: Label[]): Label[] {
    return ids.map(({ id }) => possibleLabels.find(label => label.id === id)).filter(isLabel)
  }

  return {
    addLabelToIdea,
    removeLabelFromIdea,
    saveIdeaLabel,
    ideaLabels,
  }
}
