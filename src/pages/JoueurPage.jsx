import { Link, useParams } from 'react-router-dom'
import { getPlayerById } from '../services/api/playersApi.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useChargement } from '../hooks/useChargement.js'
import PlayerAvatar from '../components/players/PlayerAvatar.jsx'
import PlayerStats from '../components/players/PlayerStats.jsx'
import PlayerResults from '../components/players/PlayerResults.jsx'
import PlayerUpcoming from '../components/players/PlayerUpcoming.jsx'
import FavoriteButton from '../components/ui/FavoriteButton.jsx'
import MessageErreur from '../components/ui/MessageErreur.jsx'
import Flag from '../components/ui/Flag.jsx'
import { calculerAge } from '../utils/dates.js'
import { CIRCUITS, PAYS, MAINS } from '../utils/labels.js'
import Squelette from '../components/ui/Squelette.jsx'
import './JoueurPage.css'
import '../components/ui/Badge.css'

function JoueurPage() {
  const { id } = useParams()

  const { donnees: joueur, chargement, erreur, reessayer } = useChargement(
    () => getPlayerById(id),
    [id],
  )

  usePageTitle(joueur ? joueur.nom : 'Joueur')

  if (chargement) {
    return <Squelette lignes={4} hauteur="5rem" />
  }

  if (erreur) {
    return (
      <section>
        <h1>Joueur</h1>
        <MessageErreur onReessayer={reessayer} />
        <Link to="/classements">Retour aux classements</Link>
      </section>
    )
  }

  if (joueur === null) {
    return (
      <section>
        <h1>Joueur introuvable</h1>
        <p>Ce joueur n'existe pas.</p>
        <Link to="/classements">Retour aux classements</Link>
      </section>
    )
  }

  const { details } = joueur

  return (
    <article className="joueur">
      <Link to="/classements" className="joueur__retour">
        ← Retour aux classements
      </Link>

      <header className="joueur__entete">
        <PlayerAvatar nom={joueur.nom} />
        <div>
          <h1 className="joueur__nom">{joueur.nom}</h1>
          <span className={`badge badge--${joueur.circuit}`}>
            {CIRCUITS[joueur.circuit]}
          </span>
        </div>
        <div className="joueur__favori">
          <FavoriteButton type="joueurs" id={joueur.id} nom={joueur.nom} />
        </div>
      </header>

      <dl className="joueur__infos">
        <div>
          <dt>Classement</dt>
          <dd>
            n° {joueur.rang} · {joueur.points.toLocaleString('fr-FR')} pts
          </dd>
        </div>
        <div>
          <dt>Nationalité</dt>
          <dd>
            <Flag code={joueur.pays} />{' '}
            {PAYS[joueur.pays]}
          </dd>
        </div>
        {details && (
          <>
            <div>
              <dt>Âge</dt>
              <dd>{calculerAge(details.naissance)} ans</dd>
            </div>
            {details.taille && (
              <div>
                <dt>Taille</dt>
                <dd>{details.taille} cm</dd>
              </div>
            )}
            {details.main && (
              <div>
                <dt>Main</dt>
                <dd>{MAINS[details.main]}</dd>
              </div>
            )}
          </>
        )}
      </dl>

      {details ? (
        <>
          <h2>Statistiques</h2>
          <PlayerStats stats={details.stats} />

          <h2>Derniers résultats</h2>
          <PlayerResults resultats={details.derniersResultats} />

          {details.prochainsMatchs.length > 0 && (
            <>
              <h2>Prochains matchs</h2>
              <PlayerUpcoming matchs={details.prochainsMatchs} />
            </>
          )}
        </>
      ) : (
        <p>Les informations détaillées de ce joueur seront disponibles prochainement.</p>
      )}
    </article>
  )
}

export default JoueurPage