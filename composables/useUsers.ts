import { useStore } from 'vuex'
import { Idea, User } from '../types'

export function useUsers() {
  const store = useStore()

  const user = computed<User>(() => store.state.base.user)
  const users = computed<User[]>(() => store.state.base.users)
  const getUserById = (id: string): User | undefined => store.state.base.users.find((user: User) => user.id === id)
  const userIsSubscribedTo = computed<(idea: Idea) => boolean>(() => store.getters['base/userIsSubscribedTo'])
  const userInTeam = computed<boolean>(() => store.getters['base/userInTeam'])

  return { user, users, getUserById, userIsSubscribedTo, userInTeam }
}
