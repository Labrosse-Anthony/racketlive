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

export function calculerAge(naissance) {
  const aujourdhui = new Date()
  const date = lireDate(naissance)

  let age = aujourdhui.getFullYear() - date.getFullYear()

  const anniversairePasse =
    aujourdhui.getMonth() > date.getMonth() ||
    (aujourdhui.getMonth() === date.getMonth() &&
      aujourdhui.getDate() >= date.getDate())

  if (!anniversairePasse) age--
  return age
}

export function formaterDate(texte) {
  return lireDate(texte).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}