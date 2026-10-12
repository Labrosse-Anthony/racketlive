import { NavLink } from 'react-router-dom'
import './Navbar.css'

const liens = [
  { to: '/calendrier', icone: '📅', texte: 'Tournois' },
  { to: '/classements', icone: '🏆', texte: 'Classements' },
  { to: '/favoris', icone: '❤️', texte: 'Favoris' },
]

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navigation principale">
      <span className="navbar__brand">RacketLive 🎾</span>
      <ul className="navbar__list">
        {liens.map((lien) => (
          <li key={lien.to}>
            <NavLink to={lien.to} className="navbar__link">
              <span className="navbar__icon" aria-hidden="true">
                {lien.icone}
              </span>
              <span>{lien.texte}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar