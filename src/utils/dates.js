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

export function aujourdhuiISO() {
  const maintenant = new Date()
  const mois = String(maintenant.getMonth() + 1).padStart(2, '0')
  const jour = String(maintenant.getDate()).padStart(2, '0')
  return `${maintenant.getFullYear()}-${mois}-${jour}`
}

// Tous les mois couverts par une période, au format AAAA-MM.
// Ex : moisCouverts('2026-12-28', '2027-01-03') donne ['2026-12', '2027-01']
export function moisCouverts(debut, fin) {
  const mois = []
  let annee = Number(debut.slice(0, 4))
  let numero = Number(debut.slice(5, 7))
  const dernier = fin.slice(0, 7)

  while (true) {
    const courant = `${annee}-${String(numero).padStart(2, '0')}`
    if (courant > dernier) break
    mois.push(courant)
    numero++
    if (numero > 12) {
      numero = 1
      annee++
    }
  }
  return mois
}
