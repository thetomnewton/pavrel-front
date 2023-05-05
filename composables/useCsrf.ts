import { csrf } from '~/helpers/auth'

export function useCsrf() {
  const csrfInterval = ref<ReturnType<typeof setInterval> | null>(null)

  onMounted(() => {
    csrfInterval.value = setInterval(csrf, 1000 * 60 * 10)
    window.addEventListener('focus', csrf)
  })

  onUnmounted(() => {
    if (csrfInterval.value) clearInterval(csrfInterval.value)
  })

  return { csrf }
}
