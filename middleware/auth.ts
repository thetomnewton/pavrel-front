export default defineNuxtRouteMiddleware(to => {
  if (!process.client) return

  if (localStorage.getItem('isLoggedIn') !== 'true') location.href = '/login'
})
