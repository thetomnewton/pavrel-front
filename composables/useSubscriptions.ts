import { useStore } from 'vuex'
import { Subscription } from '../types'

export function useSubscriptions() {
  const store = useStore()
  const { currentWorkspace } = useWorkspace()

  const hasActiveSubscription = (productId: string) =>
    store.state.base.subscriptions.find((subscription: Subscription) => subscription.name === productId)

  const subscriptionIsEnding = (productId: string) => {
    const subscription = store.state.base.subscriptions.find(
      (subscription: Subscription) => subscription.name === productId
    ) as Subscription | undefined

    if (!subscription || !subscription.ends_at) return false

    return new Date(subscription.ends_at) < new Date()
  }

  const isPro = computed<boolean>(() => currentWorkspace.value.plan !== 'free')

  return {
    hasActiveSubscription,
    subscriptionIsEnding,
    isPro,
  }
}
