import { Link } from 'react-router-dom'
import { drapeau } from '../../utils/flags.js'
import { formaterPeriode } from '../../utils/dates.js'
import { CIRCUITS, SURFACES, PAYS } from '../../utils/labels.js'
import { formaterEuros } from '../../utils/format.js'
import './TournamentCard.css'

function TournamentCard({ tournoi }) {
  const dotation = formaterEuros(tournoi.dotation)

  return (
    <article className="tournoi-card">
      <Link to={`/tournois/${tournoi.id}`} className="tournoi-card__lien">
        <h2 className="tournoi-card__titre">{tournoi.nom}</h2>
        <p className="tournoi-card__info">
          {formaterPeriode(tournoi.debut, tournoi.fin)}
        </p>
        <p className="tournoi-card__info">
          <span role="img" aria-label={PAYS[tournoi.pays]}>
            {drapeau(tournoi.pays)}
          </span>{' '}
          {tournoi.ville}, {PAYS[tournoi.pays]}
        </p>
        <div className="tournoi-card__badges">
          <span className={`badge badge--${tournoi.circuit}`}>
            {CIRCUITS[tournoi.circuit]}
          </span>
          <span className="badge badge--surface">
            {SURFACES[tournoi.surface]}
          </span>
          <span className="tournoi-card__dotation">{dotation}</span>
        </div>
      </Link>
    </article>
  )
}

export default TournamentCard