import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { getTournaments } from '../services/api/tournamentsApi.js'
import { getPlayersByIds } from '../services/api/playersApi.js'
import PlayerCard from '../components/players/PlayerCard.jsx'
import TournamentList from '../components/tournaments/TournamentList.jsx'
import './FavorisPage.css'

function FavorisPage() {
  usePageTitle('Mes favoris')

  const { favoris, pret, estFavori } = useFavorites()

  const [tournois, setTournois] = useState(null)
  const [joueurs, setJoueurs] = useState(null)

  useEffect(() => {
    let annule = false

    getTournaments().then((liste) => {
      if (!annule) setTournois(liste)
    })

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

  if (!pret || tournois === null || joueurs === null) {
    return (
      <section>
        <h1>Mes favoris</h1>
        <p>Chargement…</p>
      </section>
    )
  }

  const joueursFavoris = joueurs.filter((joueur) => estFavori('joueurs', joueur.id))
  const tournoisFavoris = tournois.filter((tournoi) =>
    estFavori('tournois', tournoi.id),
  )

  if (joueursFavoris.length === 0 && tournoisFavoris.length === 0) {
    return (
      <section>
        <h1>Mes favoris</h1>
        <div className="favoris__etat-vide">
          <span className="favoris__etat-vide-icone" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </span>
          <h2>Aucun favori pour le moment</h2>
          <p>
            Appuie sur le cœur d'un joueur ou d'un tournoi pour le retrouver
            ici.
          </p>
          <div className="favoris__etat-vide-liens">
            <Link to="/classements" className="favoris__bouton">
              Voir les classements
            </Link>
            <Link
              to="/calendrier"
              className="favoris__bouton favoris__bouton--secondaire"
            >
              Voir les tournois
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1>Mes favoris</h1>

      <section className="favoris__section">
        <h2>Joueurs ({joueursFavoris.length})</h2>
        {joueursFavoris.length === 0 ? (
          <p className="favoris__vide">Aucun joueur en favori.</p>
        ) : (
          <ul className="favoris__liste">
            {joueursFavoris.map((joueur) => (
              <li key={joueur.id}>
                <PlayerCard joueur={joueur} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="favoris__section">
        <h2>Tournois ({tournoisFavoris.length})</h2>
        {tournoisFavoris.length === 0 ? (
          <p className="favoris__vide">Aucun tournoi en favori.</p>
        ) : (
          <TournamentList tournois={tournoisFavoris} />
        )}
      </section>
    </section>
  )
}

export default FavorisPage