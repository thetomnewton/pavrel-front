import Cookies from 'js-cookie'

export function getSsrColorTheme() {
  if (process.client) return

  const headers = useRequestHeaders(['cookie'])

  if (headers.cookie) {
    const split = headers.cookie.split('colorTheme=')
    if (split.length < 2) return
    if (split[1].split(';')[0] === 'dark') return 'dark'
  }
}

export function watchForDarkMode() {
  if (!process.client) return

  try {
    const hasDarkThemeSetting = localStorage.colorTheme === 'dark'
    const usingSystemDarkSettings = !('colorTheme' in localStorage)
    const hasSystemDarkTheme =
      !('colorTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches

    const doc = document.documentElement

    if (hasDarkThemeSetting || (usingSystemDarkSettings && hasSystemDarkTheme)) {
      doc.classList.add('dark')
      Cookies.set('colorTheme', 'dark')
    } else {
      doc.classList.remove('dark')
      Cookies.remove('colorTheme')
    }

    // If using system colours and the dark mode settings change, update the theme accordingly.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!usingSystemDarkSettings) return

      if (e.matches) {
        doc.classList.add('dark')
        Cookies.set('colorTheme', 'dark')
      } else {
        doc.classList.remove('dark')
        Cookies.remove('colorTheme')
      }
    })
  } catch (_) {}
}
