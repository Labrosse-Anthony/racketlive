// Met un texte en minuscules et sans accents : « Iga Świątek » -> « iga swiatek »
export function normaliser(texte) {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .toLowerCase()
    .trim()
}

// Cherche des joueurs dont le nom contient tous les mots tapés (dans n'importe quel ordre).
// Les noms qui commencent par la recherche passent en premier.
export function chercherJoueurs(joueurs, saisie, limite = 8) {
  const mots = normaliser(saisie).split(/\s+/).filter(Boolean)
  if (mots.length === 0) return []

  const trouves = []
  for (const joueur of joueurs) {
    const nom = normaliser(joueur.nom)
    if (mots.every((mot) => nom.includes(mot))) {
      trouves.push({ joueur, debut: nom.startsWith(mots[0]) || nom.includes(' ' + mots[0]) })
    }
  }

  trouves.sort((a, b) => Number(b.debut) - Number(a.debut))
  return trouves.slice(0, limite).map((t) => t.joueur)
}
