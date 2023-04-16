export default defineNuxtRouteMiddleware(to => {
  if (!process.client) return

  if (localStorage.getItem('is-logged-in') === 'true') {
    // We are already logged in, so redirect elsewhere
    const lastWorkspace = localStorage.getItem('last-workspace')

    if (lastWorkspace) location.href = `/${lastWorkspace}/drafts`
    else location.href = '/welcome'
  }
})
