import { useEffect, useState } from 'react'
import { getRanking } from '../services/api/rankingsApi.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import RankingsTable from '../components/rankings/RankingsTable.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import './ClassementsPage.css'

const JOUEURS_PAR_PAGE = 8

function ClassementsPage() {
  usePageTitle('Classements')

  const [circuit, setCircuit] = useState('atp')
  const [joueurs, setJoueurs] = useState([])
  const [chargement, setChargement] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let annule = false

    getRanking(circuit).then((donnees) => {
      if (annule) return
      setJoueurs(donnees)
      setChargement(false)
    })

    return () => {
      annule = true
    }
  }, [circuit])

  function changerCircuit(nouveauCircuit) {
    if (nouveauCircuit === circuit) return
    setCircuit(nouveauCircuit)
    setChargement(true)
    setRecherche('')
    setPage(1)
  }

  function changerRecherche(evenement) {
    setRecherche(evenement.target.value)
    setPage(1)
  }

  const texte = recherche.trim().toLowerCase()
  const joueursFiltres = joueurs.filter((joueur) =>
    joueur.nom.toLowerCase().includes(texte),
  )

  const nombrePages = Math.max(
    1,
    Math.ceil(joueursFiltres.length / JOUEURS_PAR_PAGE),
  )
  const indexDepart = (page - 1) * JOUEURS_PAR_PAGE
  const joueursAffiches = joueursFiltres.slice(
    indexDepart,
    indexDepart + JOUEURS_PAR_PAGE,
  )

  const joueursAvecRang = joueursAffiches.map((joueur) => ({
    ...joueur,
    rang: joueurs.indexOf(joueur) + 1,
  }))

  return (
    <section>
      <h1>Classements</h1>

      <div className="classements__onglets">
        <button
          className={circuit === 'atp' ? 'onglet onglet--actif' : 'onglet'}
          aria-pressed={circuit === 'atp'}
          onClick={() => changerCircuit('atp')}
        >
          Hommes (ATP)
        </button>
        <button
          className={circuit === 'wta' ? 'onglet onglet--actif' : 'onglet'}
          aria-pressed={circuit === 'wta'}
          onClick={() => changerCircuit('wta')}
        >
          Femmes (WTA)
        </button>
      </div>

      <input
        type="search"
        className="classements__recherche"
        placeholder="Rechercher un joueur…"
        aria-label="Rechercher un joueur"
        value={recherche}
        onChange={changerRecherche}
      />

      {chargement && <p>Chargement…</p>}

      {!chargement && joueursFiltres.length === 0 && (
        <p>Aucun joueur ne correspond à « {recherche} ».</p>
      )}

      {!chargement && joueursFiltres.length > 0 && (
        <>
          <RankingsTable joueurs={joueursAvecRang} />
          <Pagination
            page={page}
            nombrePages={nombrePages}
            onChange={setPage}
          />
        </>
      )}
    </section>
  )
}

export default ClassementsPage