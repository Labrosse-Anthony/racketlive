export const NOMS_MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

export function lireDate(texte) {
  return new Date(`${texte}T12:00:00`)
}

export function formaterPeriode(debut, fin) {
  const jourMois = { day: 'numeric', month: 'short' }
  const complet = { day: 'numeric', month: 'short', year: 'numeric' }
  const texteDebut = lireDate(debut).toLocaleDateString('fr-FR', jourMois)
  const texteFin = lireDate(fin).toLocaleDateString('fr-FR', complet)
  return `${texteDebut} – ${texteFin}`
}