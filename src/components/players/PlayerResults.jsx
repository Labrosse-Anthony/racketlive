import { Link } from 'react-router-dom'
import Flag from '../ui/Flag.jsx'
import './PlayerMatches.css'

function LienOuTexte({ vers, className, children }) {
  if (!vers) return <span>{children}</span>

  return (
    <Link to={vers} className={className}>
      {children}
    </Link>
  )
}

function PlayerResults({ resultats }) {
  if (resultats.length === 0) {
    return <p>Aucun résultat récent.</p>
  }

  return (
    <ul className="matchs">
      {resultats.map((match) => (
        <li
          key={`${match.tournoi}-${match.tour}-${match.adversaire.id}`}
          className="match"
        >
          <span
            className={
              match.victoire
                ? 'match__issue match__issue--victoire'
                : 'match__issue match__issue--defaite'
            }
          >
            <span aria-hidden="true">{match.victoire ? 'V' : 'D'}</span>
            <span className="visuellement-cache">
              {match.victoire ? 'Victoire' : 'Défaite'}
            </span>
          </span>

          <p className="match__titre">
            <LienOuTexte
              vers={match.tournoiId ? `/tournois/${match.tournoiId}` : null}
              className="match__lien"
            >
              {match.tournoi}
            </LienOuTexte>{' '}
            · {match.tour}
          </p>

          <p className="match__detail">
            contre{' '}
            <LienOuTexte
              vers={match.adversaire.classe ? `/joueurs/${match.adversaire.id}` : null}
              className="match__lien"
            >
              <Flag code={match.adversaire.pays} /> {match.adversaire.nom}
            </LienOuTexte>{' '}
            <span className="match__score">· {match.score}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}

export default PlayerResults
