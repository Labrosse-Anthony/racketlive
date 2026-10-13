import { Link } from 'react-router-dom'
import { drapeau } from '../../utils/flags.js'
import { formaterDate } from '../../utils/dates.js'
import './PlayerMatches.css'

function PlayerUpcoming({ matchs }) {
  if (matchs.length === 0) {
    return <p>Aucun match programmé.</p>
  }

  return (
    <ul className="matchs">
      {matchs.map((match, index) => (
        <li key={index} className="match match--simple">
          <p className="match__titre">
            <Link to={`/tournois/${match.tournoiId}`} className="match__lien">
              {match.tournoi}
            </Link>{' '}
            · {match.tour}
          </p>

          <p className="match__detail">
            {formaterDate(match.date)} contre{' '}
            <Link to={`/joueurs/${match.adversaire.id}`} className="match__lien">
              <span role="img" aria-label={match.adversaire.pays}>
                {drapeau(match.adversaire.pays)}
              </span>{' '}
              {match.adversaire.nom}
            </Link>
          </p>
        </li>
      ))}
    </ul>
  )
}

export default PlayerUpcoming