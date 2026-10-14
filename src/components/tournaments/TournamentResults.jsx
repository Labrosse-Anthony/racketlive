import { Link } from 'react-router-dom'
import { drapeau } from '../../utils/flags.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import './TournamentResults.css'

function Joueur({ joueur, gagnant = false }) {
  return (
    <Link
      to={`/joueurs/${joueur.id}`}
      className={
        gagnant ? 'resultat__joueur resultat__joueur--gagnant' : 'resultat__joueur'
      }
    >
      <span role="img" aria-label={joueur.pays}>
        {drapeau(joueur.pays)}
      </span>{' '}
      {joueur.nom}
      {gagnant && <span className="visuellement-cache"> (vainqueur)</span>}
    </Link>
  )
}

function TournamentResults({ resultats }) {
  if (resultats.length === 0) {
    return <p>Les résultats seront disponibles après le tournoi.</p>
  }

  return (
    <ul className="resultats">
      {resultats.map((match, index) => (
        <li key={index} className="resultat">
          <p className="resultat__tour">
            {match.tour}
            {match.categorie && ` · ${match.categorie}`}
          </p>
          <Joueur joueur={match.vainqueur} gagnant />
          <Joueur joueur={match.perdant} />
          <p className="resultat__score">{match.score}</p>
        </li>
      ))}
    </ul>
  )
}

export default TournamentResults