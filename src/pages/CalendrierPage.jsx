import { useEffect, useState } from 'react'
import { getTournaments } from '../services/api/tournamentsApi.js'
import { PAYS } from '../utils/labels.js'
import TournamentFilters from '../components/tournaments/TournamentFilters.jsx'
import TournamentList from '../components/tournaments/TournamentList.jsx'

const FILTRES_VIDES = { circuit: '', surface: '', pays: '', mois: '' }

function CalendrierPage() {
  const [tournois, setTournois] = useState([])
  const [chargement, setChargement] = useState(true)
  const [filtres, setFiltres] = useState(FILTRES_VIDES)

  useEffect(() => {
    getTournaments().then((donnees) => {
      setTournois(donnees)
      setChargement(false)
    })
  }, [])

  function changerFiltre(nom, valeur) {
    setFiltres({ ...filtres, [nom]: valeur })
  }

  function effacerFiltres() {
    setFiltres(FILTRES_VIDES)
  }

  const codesPays = [...new Set(tournois.map((tournoi) => tournoi.pays))].sort(
    (a, b) => PAYS[a].localeCompare(PAYS[b], 'fr'),
  )

  const tournoisFiltres = tournois.filter((tournoi) => {
    if (filtres.circuit && tournoi.circuit !== filtres.circuit) return false
    if (filtres.surface && tournoi.surface !== filtres.surface) return false
    if (filtres.pays && tournoi.pays !== filtres.pays) return false

    if (filtres.mois) {
      const mois = Number(filtres.mois)
      const moisDebut = Number(tournoi.debut.slice(5, 7))
      const moisFin = Number(tournoi.fin.slice(5, 7))
      if (mois < moisDebut || mois > moisFin) return false
    }
    return true
  })

  return (
    <section>
      <h1>Calendrier des tournois</h1>

      <TournamentFilters
        filtres={filtres}
        codesPays={codesPays}
        onChange={changerFiltre}
        onReset={effacerFiltres}
      />

      {chargement ? (
        <p>Chargement…</p>
      ) : (
        <>
          <p aria-live="polite">{tournoisFiltres.length} tournoi(s)</p>
          <TournamentList tournois={tournoisFiltres} />
        </>
      )}
    </section>
  )
}

export default CalendrierPage