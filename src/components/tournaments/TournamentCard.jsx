import { Link } from 'react-router-dom'
import Flag from '../ui/Flag.jsx'
import { formaterPeriode } from '../../utils/dates.js'
import { CIRCUITS, SURFACES, PAYS } from '../../utils/labels.js'
import FavoriteButton from '../ui/FavoriteButton.jsx'
import './TournamentCard.css'

function TournamentCard({ tournoi, titre: Titre = 'h2' }) {
  return (
    <article className="tournoi-card">
      <Link to={`/tournois/${tournoi.id}`} className="tournoi-card__lien">
        <Titre className="tournoi-card__titre">{tournoi.nom}</Titre>
        <p className="tournoi-card__info">
          {formaterPeriode(tournoi.debut, tournoi.fin)}
        </p>
        <p className="tournoi-card__info">
          <Flag code={tournoi.pays} />{' '}
          {tournoi.ville}, {PAYS[tournoi.pays]}
        </p>
        <div className="tournoi-card__badges">
          <span className={`badge badge--${tournoi.circuit}`}>
            {CIRCUITS[tournoi.circuit]}
          </span>
          {tournoi.categorie && (
            <span className="badge badge--categorie">
              {CIRCUITS[tournoi.circuit]} {tournoi.categorie}
            </span>
          )}
          <span className="badge badge--surface">
            {SURFACES[tournoi.surface]}
          </span>
        </div>
      </Link>

      <div className="tournoi-card__favori">
        <FavoriteButton type="tournois" id={tournoi.id} nom={tournoi.nom} />
      </div>
    </article>
  )
}

export default TournamentCard