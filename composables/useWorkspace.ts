import { computed } from 'vue'
import { useStore } from 'vuex'
import { Team, Workspace } from '../types'
import axios from '~~/api'

export function useWorkspace() {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()
  const { user } = useUsers()
  const { setCurrentTeamFromLocalStorage } = useTeams()
  const { addUserListener, addWorkspaceListeners } = useWebSockets()

  const workspaces = computed<Workspace[]>(() => store.state.base.workspaces)
  const currentWorkspace = computed<Workspace>(() => store.getters['base/currentWorkspace'])
  const currentWorkspaceSlug = computed<string>(() => store.state.base.currentWorkspaceSlug)
  const currentWorkspaceTeams = computed<Team[]>(() => store.getters['base/currentWorkspaceTeams'])
  const userCurrentWorkspaceTeams = computed(() => store.getters['base/userCurrentWorkspaceTeams'])
  const loadAllWorkspaceContent = () => store.dispatch('base/loadAllWorkspaceContent')

  const workspaceContentLoaded = computed(() => store.state.base.workspaceContentLoaded)

  const workspaceIdeasCount = computed(() => store.state.base.ideas.length)
  const cantCreateNewIdeas = computed(() => currentWorkspace.value.plan === 'free' && workspaceIdeasCount.value >= 100)

  const getWorkspaceFromSlug = (slug: string) => workspaces.value?.find(workspace => workspace.slug === slug)

  function loadWorkspaceContent() {
    console.log('in loadWorkspaceContent')

    return new Promise((resolve, reject) => {
      console.log(`workspaceContentLoaded.value is: ${workspaceContentLoaded.value}`)

      if (workspaceContentLoaded.value) {
        resolve('Content loaded')
        return
      }

      console.log('workspace content not loaded')

      const requests = []

      if (!user.value) requests.push(axios.get('/user'))
      if (!currentWorkspace.value) requests.push(axios.get('/workspaces'))

      console.log(`requests.length is: ${requests.length}`)

      Promise.allSettled(requests)
        .then(([userResp, workspacesResp]) => {
          console.log(userResp, workspacesResp)

          if (userResp?.status === 'fulfilled') store.commit('base/setUser', userResp.value.data)
          if (workspacesResp?.status === 'fulfilled') store.commit('base/setWorkspaces', workspacesResp.value.data)

          if (userResp?.status === 'rejected' || workspacesResp?.status === 'rejected') {
            reject('Workspace load error')
            return
          }

          console.log('about to load remaining workspace content')

          loadAllWorkspaceContent().then(() => {
            console.log('loadAllWorkspaceContent successful')

            addUserListener()
            addWorkspaceListeners()
            setCurrentTeamFromLocalStorage()

            // If the user is not part of any teams and the current route is
            // a workspace route, redirect them to workspace onboarding.
            const needsWorkspaceOnboarding =
              !userCurrentWorkspaceTeams.value.length &&
              route.params.workspaceSlug &&
              route.fullPath !== `/${route.params.workspaceSlug}/welcome`

            if (needsWorkspaceOnboarding) router.push(`/${route.params.workspaceSlug}/welcome`)

            resolve('Content loaded')
          })
        })
        .catch(e => {
          console.log('loadAllWorkspaceContent errored', e)

          reject(e)
        })
    })
  }

  return {
    workspaces,
    currentWorkspace,
    currentWorkspaceSlug,
    getWorkspaceFromSlug,
    currentWorkspaceTeams,
    cantCreateNewIdeas,
    loadWorkspaceContent,
  }
}
