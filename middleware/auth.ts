export default defineNuxtRouteMiddleware(to => {
  if (process.server && !hasLoginCookie) return '/login'
})

function hasLoginCookie() {
  const { cookie } = useRequestHeaders(['cookie'])

  return cookie?.includes('remember_web_')
}
