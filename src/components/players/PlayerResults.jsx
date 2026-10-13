import { Link } from 'react-router-dom'
import { drapeau } from '../../utils/flags.js'
import './PlayerMatches.css'

function PlayerResults({ resultats }) {
  if (resultats.length === 0) {
    return <p>Aucun résultat récent.</p>
  }

  return (
    <ul className="matchs">
      {resultats.map((match, index) => (
        <li key={index} className="match">
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
            <Link to={`/tournois/${match.tournoiId}`} className="match__lien">
              {match.tournoi}
            </Link>{' '}
            · {match.tour}
          </p>

          <p className="match__detail">
            contre{' '}
            <Link to={`/joueurs/${match.adversaire.id}`} className="match__lien">
              <span role="img" aria-label={match.adversaire.pays}>
                {drapeau(match.adversaire.pays)}
              </span>{' '}
              {match.adversaire.nom}
            </Link>{' '}
            <span className="match__score">· {match.score}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}

export default PlayerResults