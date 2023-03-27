export function watchForDarkMode() {
  try {
    const hasDarkThemeSetting = localStorage.colorTheme === 'dark'
    const usingSystemDarkSettings = !('colorTheme' in localStorage)
    const hasSystemDarkTheme =
      !('colorTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches

    const doc = document.documentElement

    if (hasDarkThemeSetting || (usingSystemDarkSettings && hasSystemDarkTheme)) doc.classList.add('dark')
    else doc.classList.remove('dark')

    // If using system colours and the dark mode settings change, update the theme accordingly.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!usingSystemDarkSettings) return

      if (e.matches) doc.classList.add('dark')
      else doc.classList.remove('dark')
    })
  } catch (_) {}
}
