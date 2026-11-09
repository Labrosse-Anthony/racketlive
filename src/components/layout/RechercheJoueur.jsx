import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRanking } from '../../services/api/rankingsApi.js'
import { chercherJoueurs } from '../../utils/recherche.js'
import Flag from '../ui/Flag.jsx'
import './RechercheJoueur.css'

// Bouton loupe dans l'en-tête + fenêtre de recherche de joueur.
// On utilise la balise <dialog> : le navigateur gère le focus, la touche Échap
// et l'accessibilité au lecteur d'écran.
function RechercheJoueur() {
  const fenetre = useRef(null)
  const champ = useRef(null)
  const [saisie, setSaisie] = useState('')
  const [joueurs, setJoueurs] = useState([])

  async function ouvrir() {
    fenetre.current.showModal()
    champ.current.focus()
    // On charge la liste des joueurs seulement à la première ouverture
    if (joueurs.length === 0) {
      const [atp, wta] = await Promise.all([getRanking('atp'), getRanking('wta')])
      setJoueurs([...atp, ...wta])
    }
  }

  function fermer() {
    fenetre.current.close()
    setSaisie('')
  }

  const resultats = chercherJoueurs(joueurs, saisie)

  return (
    <>
      <button
        type="button"
        className="theme-toggle"
        onClick={ouvrir}
        aria-label="Rechercher un joueur"
        title="Rechercher un joueur"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>

      <dialog
        ref={fenetre}
        className="recherche"
        aria-labelledby="recherche-titre"
        onClose={() => setSaisie('')}
        onClick={(e) => e.target === fenetre.current && fermer()}
      >
        <h2 id="recherche-titre" className="recherche__titre">
          Rechercher un joueur
        </h2>
        <input
          ref={champ}
          type="search"
          className="recherche__champ"
          placeholder="Ex. Sinner, Swiatek…"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          aria-label="Nom du joueur"
        />

        {/* aria-live : le lecteur d'écran annonce le nombre de résultats */}
        <p className="recherche__info" aria-live="polite">
          {saisie.trim() === ''
            ? 'Tape un nom pour chercher parmi les joueurs classés.'
            : resultats.length === 0
              ? 'Aucun joueur trouvé.'
              : `${resultats.length} résultat${resultats.length > 1 ? 's' : ''}`}
        </p>

        <ul className="recherche__liste">
          {resultats.map((joueur) => (
            <li key={joueur.id}>
              <Link to={`/joueurs/${joueur.id}`} onClick={fermer}>
                <Flag code={joueur.pays} /> {joueur.nom}
              </Link>
            </li>
          ))}
        </ul>

        <button type="button" className="recherche__fermer" onClick={fermer}>
          Fermer
        </button>
      </dialog>
    </>
  )
}

export default RechercheJoueur
