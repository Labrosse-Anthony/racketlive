import { Link } from 'react-router-dom'
import Flag from '../ui/Flag.jsx'
import './TournamentResults.css'

function Joueur({ joueur, gagnant = false }) {
  const classe = gagnant
    ? 'resultat__joueur resultat__joueur--gagnant'
    : 'resultat__joueur'

  const contenu = (
    <>
      <Flag code={joueur.pays} /> {joueur.nom}
      {gagnant && <span className="visuellement-cache"> (vainqueur)</span>}
    </>
  )

  if (!joueur.classe) {
    return <span className={classe}>{contenu}</span>
  }

  return (
    <Link to={`/joueurs/${joueur.id}`} className={classe}>
      {contenu}
    </Link>
  )
}

function TournamentResults({ resultats }) {
  if (resultats.length === 0) {
    return <p>Aucun résultat disponible pour ce tournoi pour le moment.</p>
  }

  return (
    <ul className="resultats">
      {resultats.map((match) => (
        <li
          key={`${match.tour}-${match.vainqueur.id}-${match.perdant.id}`}
          className="resultat"
        >
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
