import TournamentCard from './TournamentCard.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import './TournamentList.css'

function TournamentList({ tournois }) {
  if (tournois.length === 0) {
    return <p>Aucun tournoi ne correspond à ces critères.</p>
  }

  return (
    <ul className="tournoi-list">
      {tournois.map((tournoi) => (
        <li key={tournoi.id}>
          <TournamentCard tournoi={tournoi} />
        </li>
      ))}
    </ul>
  )
}

export default TournamentList