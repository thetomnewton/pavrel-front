import { useStore } from 'vuex'
import { Idea } from '../types'

export function useIdeaSubscriptions() {
  const store = useStore()

  const subscribeToIdea = (idea: Idea) => store.commit('base/subscribeToIdea', { idea })
  const unsubscribeFromIdea = (idea: Idea) => store.commit('base/unsubscribeFromIdea', idea)

  const unsubscribeFromIdeaAction = (idea: Idea) => {
    store.dispatch('base/unsubscribeFromIdea', idea)
  }

  const subscribeToIdeaAction = (idea: Idea) => {
    store.dispatch('base/subscribeToIdea', idea)
  }

  const userIsSubscribedTo = (idea: Idea) => store.getters['base/userIsSubscribedTo'](idea)

  const toggleIdeaSubscription = (idea: Idea) => {
    if (userIsSubscribedTo(idea)) unsubscribeFromIdeaAction(idea)
    else subscribeToIdeaAction(idea)
  }

  return {
    subscribeToIdea,
    unsubscribeFromIdea,
    subscribeToIdeaAction,
    unsubscribeFromIdeaAction,
    userIsSubscribedTo,
    toggleIdeaSubscription,
  }
}
