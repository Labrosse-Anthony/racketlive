import { Link } from 'react-router-dom'
import PlayerAvatar from './PlayerAvatar.jsx'
import FavoriteButton from '../ui/FavoriteButton.jsx'
import { drapeau } from '../../utils/flags.js'
import { CIRCUITS, PAYS } from '../../utils/labels.js'
import './PlayerCard.css'

function PlayerCard({ joueur }) {
  return (
    <article className="joueur-card">
      <Link to={`/joueurs/${joueur.id}`} className="joueur-card__lien">
        <PlayerAvatar nom={joueur.nom} />
        <div>
          <h3 className="joueur-card__nom">{joueur.nom}</h3>
          <p className="joueur-card__info">
            <span role="img" aria-label={PAYS[joueur.pays]}>
              {drapeau(joueur.pays)}
            </span>{' '}
            {PAYS[joueur.pays]} · n° {joueur.rang} {CIRCUITS[joueur.circuit]}
          </p>
        </div>
      </Link>

      <div className="joueur-card__favori">
        <FavoriteButton type="joueurs" id={joueur.id} nom={joueur.nom} />
      </div>
    </article>
  )
}

export default PlayerCard