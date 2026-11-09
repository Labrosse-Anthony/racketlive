import { Link } from 'react-router-dom'
import JoueurLien from '../players/JoueurLien.jsx'
import { formaterDate } from '../../utils/dates.js'
import './UpcomingMatches.css'

function UpcomingMatches({ matchs }) {
  return (
    <ul className="matchs">
      {matchs.map((match) => (
        <li key={match.id} className="match">
          <p className="match__infos">
            {formaterDate(match.date)} ·{' '}
            <Link to={`/tournois/${match.tournoiId}`}>{match.tournoi}</Link> ·{' '}
            {match.tour}
          </p>
          <JoueurLien joueur={match.joueur1} className="match__joueur" />
          <span className="visuellement-cache"> contre </span>
          <JoueurLien joueur={match.joueur2} className="match__joueur" />
        </li>
      ))}
    </ul>
  )
}

export default UpcomingMatches
