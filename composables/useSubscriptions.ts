import { useStore } from 'vuex'
import { Subscription } from '../types'

export function useSubscriptions() {
  const store = useStore()
  const { currentWorkspace } = useWorkspace()

  const hasSubscription = (productId: string) =>
    store.state.base.subscriptions.find((subscription: Subscription) => subscription.name === productId)

  const isPro = computed<boolean>(() => currentWorkspace.value.plan !== 'free')

  return {
    hasSubscription,
    isPro,
  }
}
