import Cookies from 'js-cookie'

export default defineNuxtRouteMiddleware(to => {
  if (process.server && hasLoginCookie()) {
    // We are already logged in, so redirect elsewhere
    const lastWorkspace = getLastWorkspaceFromStorage()

    if (lastWorkspace) return `/${lastWorkspace}/drafts`

    return '/welcome'
  }
})

function hasLoginCookie() {
  const { cookie } = useRequestHeaders(['cookie'])

  return cookie?.includes('remember_web_')
}

function getLastWorkspaceFromStorage() {
  return Cookies.get('last-workspace')
}
