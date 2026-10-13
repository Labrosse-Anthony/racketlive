import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTournamentById } from '../services/api/tournamentsApi.js'
import { drapeau } from '../utils/flags.js'
import { formaterPeriode } from '../utils/dates.js'
import { formaterEuros } from '../utils/format.js'
import { CIRCUITS, SURFACES, PAYS } from '../utils/labels.js'
import './TournoiDetailPage.css'

function TournoiDetailPage() {
  const { id } = useParams()

  const [donnees, setDonnees] = useState(null)

  useEffect(() => {
    let annule = false

    getTournamentById(id).then((tournoi) => {
      if (annule) return
      setDonnees({ id, tournoi })
    })

    return () => {
      annule = true
    }
  }, [id])

  const chargement = donnees === null || donnees.id !== id
  const tournoi = donnees === null ? null : donnees.tournoi

  if (chargement) {
    return <p>Chargement…</p>
  }

  if (tournoi === null) {
    return (
      <section>
        <h1>Tournoi introuvable</h1>
        <p>Ce tournoi n'existe pas.</p>
        <Link to="/calendrier">Retour au calendrier</Link>
      </section>
    )
  }

  return (
    <article className="tournoi-detail">
      <Link to="/calendrier" className="tournoi-detail__retour">
        ← Retour au calendrier
      </Link>

      <h1>{tournoi.nom}</h1>

      <div className="tournoi-detail__badges">
        <span className={`badge badge--${tournoi.circuit}`}>
          {CIRCUITS[tournoi.circuit]}
        </span>
        <span className="badge badge--surface">
          {SURFACES[tournoi.surface]}
        </span>
      </div>

      <dl className="tournoi-detail__infos">
        <div>
          <dt>Dates</dt>
          <dd>{formaterPeriode(tournoi.debut, tournoi.fin)}</dd>
        </div>
        <div>
          <dt>Lieu</dt>
          <dd>
            <span role="img" aria-label={PAYS[tournoi.pays]}>
              {drapeau(tournoi.pays)}
            </span>{' '}
            {tournoi.ville}, {PAYS[tournoi.pays]}
          </dd>
        </div>
        <div>
          <dt>Surface</dt>
          <dd>{SURFACES[tournoi.surface]}</dd>
        </div>
        <div>
          <dt>Dotation</dt>
          <dd>{formaterEuros(tournoi.dotation)}</dd>
        </div>
      </dl>
    </article>
  )
}

export default TournoiDetailPage