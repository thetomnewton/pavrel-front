import { csrf } from '~/helpers/auth'

export function useCsrf() {
  const csrfInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const lastCsrfPing = ref<number | null>(null)

  function pingCsrf() {
    // Do nothing if the CSRF cookie was pinged in the last 5 minutes
    if (Date.now() - (lastCsrfPing.value ?? 0) < 1000 * 60 * 5) return

    csrf()
    lastCsrfPing.value = Date.now()
  }

  onMounted(() => {
    // Ping the CSRF cookie randomly every 20 minutes
    csrfInterval.value = setInterval(pingCsrf, 1000 * 60 * 20)

    // Ping the CSRF cookie when the window is focused
    window.addEventListener('focus', pingCsrf)
  })

  onUnmounted(() => {
    if (csrfInterval.value) clearInterval(csrfInterval.value)
  })

  return { csrf }
}
