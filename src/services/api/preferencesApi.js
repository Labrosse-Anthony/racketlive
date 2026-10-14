const CLE_THEME = 'racketlive-theme'

export function getSavedTheme() {
  try {
    const theme = localStorage.getItem(CLE_THEME)
    return theme === 'light' || theme === 'dark' ? theme : null
  } catch {
    return null
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(CLE_THEME, theme)
  } catch {

  }
}