import { drapeau } from '../../utils/flags.js'
import { NOMS_MOIS } from '../../utils/dates.js'
import { CIRCUITS, SURFACES, PAYS } from '../../utils/labels.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
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

function TournamentFilters({ filtres, codesPays, onChange, onReset }) {
  const optionsPays = codesPays.map((code) => ({
    valeur: code,
    texte: `${drapeau(code)} ${PAYS[code]}`,
  }))

  // Les mois : "1" = Janvier, "2" = Février...
  const optionsMois = NOMS_MOIS.map((texte, index) => ({
    valeur: String(index + 1),
    texte,
  }))

  // Y a-t-il au moins un filtre actif ?
  const filtreActif = Object.values(filtres).some((valeur) => valeur !== '')

  return (
    <div className="filtres">
      <Choix
        nom="circuit"
        label="Circuit"
        valeur={filtres.circuit}
        options={versOptions(CIRCUITS)}
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
      <Choix
        nom="mois"
        label="Mois"
        valeur={filtres.mois}
        options={optionsMois}
        onChange={onChange}
      />
      {filtreActif && (
        <button className="filtres__reset" onClick={onReset}>
          Effacer les filtres
        </button>
      )}
    </div>
  )
}

export default TournamentFilters