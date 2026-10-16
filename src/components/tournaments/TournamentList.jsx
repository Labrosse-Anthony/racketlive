import TournamentCard from './TournamentCard.jsx'
import './TournamentList.css'

function TournamentList({ tournois, titre }) {
  if (tournois.length === 0) {
    return <p>Aucun tournoi ne correspond à ces critères.</p>
  }

  return (
    <ul className="tournoi-list">
      {tournois.map((tournoi) => (
        <li key={tournoi.id}>
          <TournamentCard tournoi={tournoi} titre={titre} />
        </li>
      ))}
    </ul>
  )
}

export default TournamentList