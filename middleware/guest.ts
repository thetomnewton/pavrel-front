import axios from '~/api'
import Cookies from 'js-cookie'
import { Workspace } from '~~/types'

export default defineNuxtRouteMiddleware(async to => {
  if (process.server && hasLoginCookie()) {
    // We are already logged in, so redirect elsewhere
    const lastWorkspace = getLastWorkspaceFromStorage()

    if (lastWorkspace) return `/${lastWorkspace}/drafts`
  }

  if (process.client) {
    try {
      // If we are logged in:
      const { data: workspaces }: { data: Workspace[] } = await axios.get('/workspaces')

      // If we have a recent workspace in storage, go there
      const storageLastWorkspace = Cookies.get('last-workspace')

      if (storageLastWorkspace && workspaces.map(({ slug }) => slug).includes('storageLastWorkspace'))
        return `/${storageLastWorkspace}/drafts`

      // Go to the most recent workspace in the list. If none exists, go to onboarding
      if (workspaces.length > 0) return `/${(workspaces.at(-1) as Workspace).slug}/drafts`

      return `/welcome`
    } catch (_) {}
  }
})

function hasLoginCookie() {
  const { cookie } = useRequestHeaders(['cookie'])

  return cookie?.includes('remember_web_')
}

function getLastWorkspaceFromStorage() {
  return Cookies.get('last-workspace')
}
