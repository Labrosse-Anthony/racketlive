import { Link, useParams } from 'react-router-dom'
import {
  getTournamentById,
  getTournamentResults,
} from '../services/api/tournamentsApi.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useChargement } from '../hooks/useChargement.js'
import TournamentResults from '../components/tournaments/TournamentResults.jsx'
import FavoriteButton from '../components/ui/FavoriteButton.jsx'
import MessageErreur from '../components/ui/MessageErreur.jsx'
import Flag from '../components/ui/Flag.jsx'
import { formaterPeriode } from '../utils/dates.js'
import { CIRCUITS, SURFACES, PAYS, CATEGORIES } from '../utils/labels.js'
import Squelette from '../components/ui/Squelette.jsx'
import '../components/tournaments/TournamentCard.css'
import './TournoiDetailPage.css'

function TournoiDetailPage() {
  const { id } = useParams()

  const { donnees, chargement, erreur, reessayer } = useChargement(
    () => Promise.all([getTournamentById(id), getTournamentResults(id)]),
    [id],
  )
  const tournoi = donnees ? donnees[0] : null
  const resultats = donnees ? donnees[1] : []

  let titre = 'Tournoi'
  if (!chargement && !erreur) {
    titre = tournoi === null ? 'Tournoi introuvable' : tournoi.nom
  }
  usePageTitle(titre)

  if (chargement) {
    return <Squelette lignes={5} hauteur="4rem" />
  }

  if (erreur) {
    return (
      <section>
        <h1>Tournoi</h1>
        <MessageErreur onReessayer={reessayer} />
        <Link to="/calendrier">Retour au calendrier</Link>
      </section>
    )
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

      <div className="tournoi-detail__titre">
        <h1>{tournoi.nom}</h1>
        <FavoriteButton type="tournois" id={tournoi.id} nom={tournoi.nom} />
      </div>

      <div className="tournoi-detail__badges">
        <span className={`badge badge--${tournoi.circuit}`}>
          {CIRCUITS[tournoi.circuit]}
        </span>
        {tournoi.categorie && (
          <span className="badge badge--categorie">
            {CATEGORIES[tournoi.categorie]}
          </span>
        )}
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
            <Flag code={tournoi.pays} />{' '}
            {tournoi.ville}, {PAYS[tournoi.pays]}
          </dd>
        </div>
        <div>
          <dt>Surface</dt>
          <dd>{SURFACES[tournoi.surface]}</dd>
        </div>
      </dl>

      <h2>Résultats</h2>
      <TournamentResults resultats={resultats} />
    </article>
  )
}

export default TournoiDetailPage