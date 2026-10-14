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
    <header className="entete">
      <Link to="/calendrier" className="entete__marque">
        <img
          src="/favicon.svg"
          alt=""
          width="36"
          height="36"
          className="entete__logo"
        />
        <span>
          Racket<span className="entete__marque-live">Live</span>
        </span>
      </Link>

      <nav className="navbar" aria-label="Navigation principale">
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

      <ThemeToggle />
    </header>
  )
}

export default Navbar