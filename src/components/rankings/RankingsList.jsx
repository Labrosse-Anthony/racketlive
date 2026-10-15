import { Link } from 'react-router-dom'
import { drapeau } from '../../utils/flags.js'
import FavoriteButton from '../ui/FavoriteButton.jsx'
import './RankingsList.css'

function Evolution({ valeur }) {
  if (valeur === 0) {
    return (
      <span className="evolution evolution--same">
        <span aria-hidden="true">–</span>
        <span className="visuellement-cache">Classement inchangé</span>
      </span>
    )
  }

  const monte = valeur > 0
  const places = Math.abs(valeur)

  return (
    <span className={monte ? 'evolution evolution--up' : 'evolution evolution--down'}>
      <span aria-hidden="true">
        {monte ? '▲' : '▼'} {places}
      </span>
      <span className="visuellement-cache">
        {monte ? 'Gagne' : 'Perd'} {places} place{places > 1 ? 's' : ''}
      </span>
    </span>
  )
}

function RankingsList({ joueurs }) {
  return (
    <ol className="classement" role="list">
      {joueurs.map((joueur) => (
        <li key={joueur.id} className="classement__ligne">
          <span
            className={
              joueur.rang <= 3
                ? 'classement__rang classement__rang--podium'
                : 'classement__rang'
            }
          >
            <span className="visuellement-cache">Rang </span>
            {joueur.rang}
          </span>

          <div className="classement__infos">
            <Link to={`/joueurs/${joueur.id}`} className="classement__nom">
              {joueur.nom}
            </Link>
            <p className="classement__details">
              <span role="img" aria-label={joueur.pays}>
                {drapeau(joueur.pays)}
              </span>{' '}
              {joueur.points.toLocaleString('fr-FR')} pts
            </p>
          </div>

          <Evolution valeur={joueur.evolution} />

          <FavoriteButton type="joueurs" id={joueur.id} nom={joueur.nom} />
        </li>
      ))}
    </ol>
  )
}

export default RankingsList