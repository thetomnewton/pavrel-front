export function watchForDarkMode() {
  try {
    const hasDarkThemeSetting = localStorage.colorTheme === 'dark'
    const usingSystemDarkSettings = !('colorTheme' in localStorage)
    const hasSystemDarkTheme =
      !('colorTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches

    if (hasDarkThemeSetting || (usingSystemDarkSettings && hasSystemDarkTheme))
      document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')

    // If using system colours and the dark mode settings change, update the theme accordingly.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!usingSystemDarkSettings) return

      if (e.matches) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    })
  } catch (_) {}
}
