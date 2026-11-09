import { useState } from 'react'
import { getTournaments } from '../services/api/tournamentsApi.js'
import { PAYS } from '../utils/labels.js'
import { NOMS_MOIS, moisCouverts } from '../utils/dates.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useChargement } from '../hooks/useChargement.js'
import TournamentFilters from '../components/tournaments/TournamentFilters.jsx'
import TournamentList from '../components/tournaments/TournamentList.jsx'
import MonthCalendar from '../components/tournaments/MonthCalendar.jsx'
import MessageErreur from '../components/ui/MessageErreur.jsx'
import Squelette from '../components/ui/Squelette.jsx'
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

  // Les mois proposés dans le filtre : ceux où il y a au moins un tournoi
  const optionsMois = [
    ...new Set(tournois.flatMap((t) => moisCouverts(t.debut, t.fin))),
  ]
    .sort()
    .map((valeur) => ({
      valeur,
      texte: `${NOMS_MOIS[Number(valeur.slice(5, 7)) - 1]} ${valeur.slice(0, 4)}`,
    }))

  const tournoisFiltres = tournois.filter((tournoi) => {
    if (filtres.circuit && tournoi.circuit !== filtres.circuit) return false
    if (filtres.categorie && tournoi.categorie !== filtres.categorie) return false
    if (filtres.pays && tournoi.pays !== filtres.pays) return false

    if (filtres.mois) {
      // filtres.mois vaut « AAAA-MM » : on garde les tournois qui touchent ce mois
      const debut = tournoi.debut.slice(0, 7)
      const fin = tournoi.fin.slice(0, 7)
      if (filtres.mois < debut || filtres.mois > fin) return false
    }
    return true
  })

  // Pour la liste : les plus récents en haut, les plus anciens en bas.
  // Les dates sont au format AAAA-MM-JJ, donc on peut les comparer comme du texte.
  // À date égale, on trie par nom. [...tableau] fait une copie : on ne touche pas à l'original.
  const tournoisTries = [...tournoisFiltres].sort(
    (a, b) => b.debut.localeCompare(a.debut) || a.nom.localeCompare(b.nom, 'fr'),
  )

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
        optionsMois={optionsMois}
        onChange={changerFiltre}
        onReset={effacerFiltres}
        afficherMois={vue === 'liste'}
      />

      {chargement && <Squelette lignes={6} hauteur="6rem" />}

      {erreur && <MessageErreur onReessayer={reessayer} />}

      {!chargement && !erreur && vue === 'liste' && (
        <>
          <p aria-live="polite">{tournoisFiltres.length} tournoi(s)</p>
          <TournamentList tournois={tournoisTries} />
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