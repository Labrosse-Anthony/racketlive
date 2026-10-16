import { useState } from 'react'
import { getTournaments } from '../services/api/tournamentsApi.js'
import { PAYS } from '../utils/labels.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useChargement } from '../hooks/useChargement.js'
import TournamentFilters from '../components/tournaments/TournamentFilters.jsx'
import TournamentList from '../components/tournaments/TournamentList.jsx'
import MonthCalendar from '../components/tournaments/MonthCalendar.jsx'
import MessageErreur from '../components/ui/MessageErreur.jsx'
import './CalendrierPage.css'

const FILTRES_VIDES = { circuit: '', categorie: '', pays: '', mois: '' }

function CalendrierPage() {
  usePageTitle('Calendrier des tournois')

  const [filtres, setFiltres] = useState(FILTRES_VIDES)
  const [vue, setVue] = useState('liste')
  const [moisAffiche, setMoisAffiche] = useState(() => {
    const aujourdhui = new Date()
    return { annee: aujourdhui.getFullYear(), mois: aujourdhui.getMonth() }
  })

  const { donnees, chargement, erreur, reessayer } = useChargement(getTournaments)
  const tournois = donnees ?? []

  function changerFiltre(nom, valeur) {
    setFiltres({ ...filtres, [nom]: valeur })
  }

  function effacerFiltres() {
    setFiltres(FILTRES_VIDES)
  }

  function changerVue(nouvelleVue) {
    setVue(nouvelleVue)
    if (nouvelleVue === 'calendrier') {
      setFiltres({ ...filtres, mois: '' })
    }
  }

  function changerMois(decalage) {
    const date = new Date(moisAffiche.annee, moisAffiche.mois + decalage, 1)
    setMoisAffiche({ annee: date.getFullYear(), mois: date.getMonth() })
  }

  const codesPays = [...new Set(tournois.map((tournoi) => tournoi.pays))].sort(
    (a, b) => PAYS[a].localeCompare(PAYS[b], 'fr'),
  )

  const tournoisFiltres = tournois.filter((tournoi) => {
    if (filtres.circuit && tournoi.circuit !== filtres.circuit) return false
    if (filtres.categorie && tournoi.categorie !== filtres.categorie) return false
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

      <div className="calendrier__bascule">
        <button
          className={
            vue === 'liste'
              ? 'calendrier__bouton calendrier__bouton--actif'
              : 'calendrier__bouton'
          }
          aria-pressed={vue === 'liste'}
          onClick={() => changerVue('liste')}
        >
          Liste
        </button>
        <button
          className={
            vue === 'calendrier'
              ? 'calendrier__bouton calendrier__bouton--actif'
              : 'calendrier__bouton'
          }
          aria-pressed={vue === 'calendrier'}
          onClick={() => changerVue('calendrier')}
        >
          Calendrier
        </button>
      </div>

      <TournamentFilters
        filtres={filtres}
        codesPays={codesPays}
        onChange={changerFiltre}
        onReset={effacerFiltres}
        afficherMois={vue === 'liste'}
      />

      {chargement && <p>Chargement…</p>}

      {erreur && <MessageErreur onReessayer={reessayer} />}

      {!chargement && !erreur && vue === 'liste' && (
        <>
          <p aria-live="polite">{tournoisFiltres.length} tournoi(s)</p>
          <TournamentList tournois={tournoisFiltres} />
        </>
      )}

      {!chargement && !erreur && vue === 'calendrier' && (
        <MonthCalendar
          annee={moisAffiche.annee}
          mois={moisAffiche.mois}
          tournois={tournoisFiltres}
          onChangeMois={changerMois}
        />
      )}
    </section>
  )
}

export default CalendrierPage