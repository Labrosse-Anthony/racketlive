import { useTheme } from '../../hooks/useTheme.js'

function ThemeToggle() {
  const { theme, basculer } = useTheme()
  const sombre = theme === 'dark'

  return (
    <button type="button" className="navbar__link" onClick={basculer}>
      <span className="navbar__icon" aria-hidden="true">
        {sombre ? '☀️' : '🌙'}
      </span>
      <span>{sombre ? 'Mode clair' : 'Mode sombre'}</span>
    </button>
  )
}

export default ThemeToggle