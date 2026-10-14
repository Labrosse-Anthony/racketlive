import { NOMS_MOIS } from '../../utils/dates.js'
import TournamentList from './TournamentList.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import './MonthCalendar.css'

const INITIALES_JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function deuxChiffres(nombre) {
  return String(nombre).padStart(2, '0')
}

function MonthCalendar({ annee, mois, tournois, onChangeMois }) {
  const decalage = (new Date(annee, mois, 1).getDay() + 6) % 7
  const nombreJours = new Date(annee, mois + 1, 0).getDate()
  const moisTexte = `${annee}-${deuxChiffres(mois + 1)}`

  const cases = []
  for (let i = 0; i < decalage; i++) cases.push(null)
  for (let jour = 1; jour <= nombreJours; jour++) cases.push(jour)

  const tournoisDuMois = tournois.filter(
    (tournoi) =>
      tournoi.debut.slice(0, 7) <= moisTexte &&
      moisTexte <= tournoi.fin.slice(0, 7),
  )

  return (
    <div>
      <div className="mois__navigation">
        <button onClick={() => onChangeMois(-1)} aria-label="Mois précédent">
          ←
        </button>
        <div className="mois__titre" aria-live="polite">
          {NOMS_MOIS[mois]} {annee}
        </div>
        <button onClick={() => onChangeMois(1)} aria-label="Mois suivant">
          →
        </button>
      </div>

      <div className="mois__grille" aria-hidden="true">
        {INITIALES_JOURS.map((initiale, index) => (
          <div key={index} className="mois__jour-nom">
            {initiale}
          </div>
        ))}

        {cases.map((jour, index) => {
          if (jour === null) return <div key={`vide-${index}`} />

          const dateISO = `${moisTexte}-${deuxChiffres(jour)}`
          const tournoisDuJour = tournois.filter(
            (tournoi) => tournoi.debut <= dateISO && dateISO <= tournoi.fin,
          )

          return (
            <div key={dateISO} className="mois__case">
              <span>{jour}</span>
              <div className="mois__points">
                {tournoisDuJour.map((tournoi) => (
                  <span
                    key={tournoi.id}
                    className={`point point--${tournoi.circuit}`}
                    title={tournoi.nom}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mois__legende">
        <span className="badge badge--atp">ATP</span>{' '}
        <span className="badge badge--wta">WTA</span>{' '}
        <span className="badge badge--grand-chelem">Grand Chelem</span>
      </p>

      <p aria-live="polite">
        {tournoisDuMois.length} tournoi(s) en {NOMS_MOIS[mois].toLowerCase()}
      </p>
      <TournamentList tournois={tournoisDuMois} />
    </div>
  )
}

export default MonthCalendar