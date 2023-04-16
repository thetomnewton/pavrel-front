export default defineNuxtRouteMiddleware(to => {
  if (!process.client) return

  if (localStorage.getItem('is-logged-in') !== 'true') location.href = '/login'
})
