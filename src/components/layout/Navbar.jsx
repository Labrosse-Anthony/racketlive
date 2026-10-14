import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import './Navbar.css'

const liens = [
  { to: '/calendrier', texte: 'Tournois' },
  { to: '/classements', texte: 'Classements' },
  { to: '/favoris', texte: 'Favoris' },
]

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navigation principale">
      <Link to="/calendrier" className="navbar__brand">
        Racket<span className="navbar__brand-live">Live</span>
      </Link>
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
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  )
}

export default Navbar