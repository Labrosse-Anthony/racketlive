import { Link } from 'react-router-dom'
import Flag from '../ui/Flag.jsx'
import { formaterDate } from '../../utils/dates.js'
import './PlayerMatches.css'

function PlayerUpcoming({ matchs }) {
  if (matchs.length === 0) {
    return <p>Aucun match programmé.</p>
  }

  return (
    <ul className="matchs">
      {matchs.map((match) => (
        <li
          key={`${match.tournoiId}-${match.date}`}
          className="match match--simple"
        >
          <p className="match__titre">
            <Link to={`/tournois/${match.tournoiId}`} className="match__lien">
              {match.tournoi}
            </Link>{' '}
            · {match.tour}
          </p>

          <p className="match__detail">
            {formaterDate(match.date)} contre{' '}
            <Link to={`/joueurs/${match.adversaire.id}`} className="match__lien">
              <Flag code={match.adversaire.pays} />{' '}
              {match.adversaire.nom}
            </Link>
          </p>
        </li>
      ))}
    </ul>
  )
}

export default PlayerUpcoming