import { useState } from 'react'
import { drapeau } from '../../utils/flags.js'
import { NOMS_MOIS } from '../../utils/dates.js'
import { CIRCUITS, SURFACES, PAYS, CATEGORIES } from '../../utils/labels.js'
import './TournamentFilters.css'

function Choix({ nom, label, valeur, options, onChange }) {
  return (
    <label className="filtres__champ">
      <span>{label}</span>
      <select value={valeur} onChange={(e) => onChange(nom, e.target.value)}>
        <option value="">Tous</option>
        {options.map((option) => (
          <option key={option.valeur} value={option.valeur}>
            {option.texte}
          </option>
        ))}
      </select>
    </label>
  )
}

function versOptions(objet) {
  return Object.entries(objet).map(([valeur, texte]) => ({ valeur, texte }))
}

function TournamentFilters({
  filtres,
  codesPays,
  onChange,
  onReset,
  afficherMois = true,
}) {

  const [ouvert, setOuvert] = useState(false)

  const optionsPays = codesPays.map((code) => ({
    valeur: code,
    texte: `${drapeau(code)} ${PAYS[code]}`,
  }))

  const optionsMois = NOMS_MOIS.map((texte, index) => ({
    valeur: String(index + 1),
    texte,
  }))

  const nombreActifs = Object.entries(filtres).filter(
    ([nom, valeur]) => valeur !== '' && (nom !== 'mois' || afficherMois),
  ).length

  return (
    <div className="filtres">
      <button
        type="button"
        className="filtres__bascule"
        aria-expanded={ouvert}
        aria-controls="filtres-panneau"
        onClick={() => setOuvert(!ouvert)}
      >
        <span>Filtres</span>
        {nombreActifs > 0 && (
          <span className="filtres__compteur">
            <span aria-hidden="true">{nombreActifs}</span>
            <span className="visuellement-cache"> {nombreActifs} actif(s)</span>
          </span>
        )}
        <svg
          className="filtres__chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        id="filtres-panneau"
        className={
          ouvert ? 'filtres__panneau filtres__panneau--ouvert' : 'filtres__panneau'
        }
      >
        <Choix
          nom="circuit"
          label="Circuit"
          valeur={filtres.circuit}
          options={versOptions(CIRCUITS)}
          onChange={onChange}
        />
        <Choix
          nom="categorie"
          label="Catégorie"
          valeur={filtres.categorie}
          options={versOptions(CATEGORIES)}
          onChange={onChange}
        />
        <Choix
          nom="surface"
          label="Surface"
          valeur={filtres.surface}
          options={versOptions(SURFACES)}
          onChange={onChange}
        />
        <Choix
          nom="pays"
          label="Pays"
          valeur={filtres.pays}
          options={optionsPays}
          onChange={onChange}
        />
        {afficherMois && (
          <Choix
            nom="mois"
            label="Mois"
            valeur={filtres.mois}
            options={optionsMois}
            onChange={onChange}
          />
        )}
        {nombreActifs > 0 && (
          <button type="button" className="filtres__reset" onClick={onReset}>
            Effacer les filtres
          </button>
        )}
      </div>
    </div>
  )
}

export default TournamentFilters