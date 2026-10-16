import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { getTournaments } from '../services/api/tournamentsApi.js'
import { getRanking } from '../services/api/rankingsApi.js'
import { getPlayersByIds } from '../services/api/playersApi.js'
import { aujourdhuiISO } from '../utils/dates.js'
import PlayerCard from '../components/players/PlayerCard.jsx'
import TournamentList from '../components/tournaments/TournamentList.jsx'
import RankingsList from '../components/rankings/RankingsList.jsx'
import './HomePage.css'

const NOMBRE_CLASSES = 5
const NOMBRE_A_VENIR = 4
const NOMBRE_FAVORIS_MAX = 4

function top(joueurs) {
  return joueurs
    .slice(0, NOMBRE_CLASSES)
    .map((joueur, index) => ({ ...joueur, rang: index + 1 }))
}

function HomePage() {
  usePageTitle()

  const { favoris, pret, estFavori } = useFavorites()

  const [donnees, setDonnees] = useState(null)
  const [joueurs, setJoueurs] = useState([])

  useEffect(() => {
    let annule = false

    Promise.all([getTournaments(), getRanking('atp'), getRanking('wta')]).then(
      ([tournois, atp, wta]) => {
        if (!annule) setDonnees({ tournois, atp, wta })
      },
    )

    return () => {
      annule = true
    }
  }, [])

  useEffect(() => {
    if (!pret) return
    let annule = false

    getPlayersByIds(favoris.joueurs).then((liste) => {
      if (!annule) setJoueurs(liste)
    })

    return () => {
      annule = true
    }
  }, [pret, favoris.joueurs])

  const presentation = (
    <section className="accueil__presentation">
      <h1>Le tennis ATP et WTA, simplement.</h1>
      <p>
        Calendrier des tournois, classements et fiches joueurs, sur mobile
        comme sur ordinateur.
      </p>
      <div className="accueil__boutons">
        <Link to="/calendrier" className="accueil__bouton accueil__bouton--principal">
          Voir le calendrier
        </Link>
        <Link to="/classements" className="accueil__bouton">
          Voir les classements
        </Link>
      </div>
    </section>
  )

  if (donnees === null) {
    return (
      <div className="accueil">
        {presentation}
        <p>Chargement…</p>
      </div>
    )
  }

  const aujourdhui = aujourdhuiISO()

  const enCours = donnees.tournois.filter(
    (tournoi) => tournoi.debut <= aujourdhui && tournoi.fin >= aujourdhui,
  )

  const aVenir = donnees.tournois
    .filter((tournoi) => tournoi.debut > aujourdhui)
    .slice(0, NOMBRE_A_VENIR)

  const joueursFavoris = joueurs
    .filter((joueur) => estFavori('joueurs', joueur.id))
    .slice(0, NOMBRE_FAVORIS_MAX)

  const tournoisFavoris = donnees.tournois
    .filter((tournoi) => estFavori('tournois', tournoi.id))
    .slice(0, NOMBRE_FAVORIS_MAX)

  const aDesFavoris = joueursFavoris.length > 0 || tournoisFavoris.length > 0

  return (
    <div className="accueil">
      {presentation}

      {aDesFavoris && (
        <section aria-labelledby="titre-favoris">
          <div className="accueil__entete">
            <h2 id="titre-favoris">Mes favoris</h2>
            <Link to="/favoris">Tous mes favoris</Link>
          </div>

          {joueursFavoris.length > 0 && (
            <ul className="accueil__joueurs">
              {joueursFavoris.map((joueur) => (
                <li key={joueur.id}>
                  <PlayerCard joueur={joueur} />
                </li>
              ))}
            </ul>
          )}

          {tournoisFavoris.length > 0 && (
            <TournamentList tournois={tournoisFavoris} titre="h3" />
          )}
        </section>
      )}

      <section aria-labelledby="titre-en-cours">
        <h2 id="titre-en-cours">En ce moment</h2>
        {enCours.length === 0 ? (
          <p>Aucun tournoi en cours cette semaine.</p>
        ) : (
          <TournamentList tournois={enCours} titre="h3" />
        )}
      </section>

      <section aria-labelledby="titre-classements">
        <div className="accueil__entete">
          <h2 id="titre-classements">Classements</h2>
          <Link to="/classements">Classement complet</Link>
        </div>
        <div className="accueil__classements">
          <div>
            <h3>Hommes (ATP)</h3>
            <RankingsList joueurs={top(donnees.atp)} />
          </div>
          <div>
            <h3>Femmes (WTA)</h3>
            <RankingsList joueurs={top(donnees.wta)} />
          </div>
        </div>
      </section>

      <section aria-labelledby="titre-a-venir">
        <div className="accueil__entete">
          <h2 id="titre-a-venir">Prochains tournois</h2>
          <Link to="/calendrier">Tout le calendrier</Link>
        </div>
        <TournamentList tournois={aVenir} titre="h3" />
      </section>
    </div>
  )
}

export default HomePage