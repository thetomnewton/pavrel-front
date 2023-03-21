import { useStore } from 'vuex'
import { Subscription } from '../types'

export function useSubscriptions() {
  const store = useStore()

  const hasSubscription = (productId: string) =>
    store.state.base.subscriptions.find((subscription: Subscription) => subscription.name === productId)

  return {
    hasSubscription,
  }
}
