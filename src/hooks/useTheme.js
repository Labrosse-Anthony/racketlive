import { useEffect, useState } from 'react'
import { getSavedTheme, saveTheme } from '../services/api/preferencesApi.js'

function themeInitial() {
  const sauvegarde = getSavedTheme()
  if (sauvegarde) return sauvegarde

  const systemeSombre = window.matchMedia('(prefers-color-scheme: dark)').matches
  return systemeSombre ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(themeInitial)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function basculer() {
    const nouveauTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nouveauTheme)
    saveTheme(nouveauTheme)
  }

  return { theme, basculer }
}