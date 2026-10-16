import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { CODES_PAYS } from './codes-pays.mjs'

const DOSSIER = 'src/data/api/tournois'

const TOURS = {
  4: '1er tour',
  5: '2e tour',
  6: '3e tour',
  7: '4e tour',
  8: 'Phase de poules',
  9: 'Quart de finale',
  10: 'Demi-finale',
  12: 'Finale',
}


const ORDRE = { 12: 1, 10: 2, 9: 3, 8: 4, 7: 5, 6: 6, 5: 7, 4: 8 }
const classements = JSON.parse(readFileSync('src/data/rankings.json', 'utf-8'))
const idsAvecFiche = new Set([...classements.atp, ...classements.wta].map((j) => j.id))

function formaterScore(texte) {
  if (texte === 'w/o') return 'Forfait'
  return texte.replace('ret.', 'abandon')
}

function convertirJoueur(joueur) {
  const pays = CODES_PAYS[joueur.countryAcr] || ''
  return {
    id: joueur.id,
    nom: joueur.name === 'Unknown Player' ? 'Joueur à confirmer' : joueur.name,
    pays,
    classe: idsAvecFiche.has(joueur.id),
  }
}

const resultat = {}

for (const nomDossier of readdirSync(DOSSIER)) {
  const fichier = `${DOSSIER}/${nomDossier}/resultats.json`
  if (!existsSync(fichier)) continue

  const brut = JSON.parse(readFileSync(fichier, 'utf-8')).donnees

  const matchs = brut.singles
    .filter((match) => TOURS[match.roundId] && match.result)
    .sort(
      (a, b) =>
        ORDRE[a.roundId] - ORDRE[b.roundId] || b.date.localeCompare(a.date),
    )
    .map((match) => ({
      // Dans l'API, player1 est toujours le vainqueur
      tour: TOURS[match.roundId],
      vainqueur: convertirJoueur(match.player1),
      perdant: convertirJoueur(match.player2),
      score: formaterScore(match.result),
    }))

  const idTournoi = nomDossier.split('-')[1]
  resultat[idTournoi] = matchs
  console.log(`${nomDossier} : ${matchs.length} matchs`)
}

writeFileSync('src/data/results.json', JSON.stringify(resultat, null, 2))
console.log(`OK : résultats de ${Object.keys(resultat).length} tournoi(s)`)
