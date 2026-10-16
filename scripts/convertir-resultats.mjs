import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { CODES_PAYS } from './codes-pays.mjs'
import { TOURS, ORDRE, formaterScore } from './tours.mjs'

const DOSSIER = 'src/data/api/tournois'
const SORTIE = 'public/data/resultats'

mkdirSync(SORTIE, { recursive: true })

const classements = JSON.parse(readFileSync('src/data/rankings.json', 'utf-8'))
const idsAvecFiche = new Set([...classements.atp, ...classements.wta].map((j) => j.id))

function convertirJoueur(joueur) {
  const pays = CODES_PAYS[joueur.countryAcr] || ''
  return {
    id: joueur.id,
    nom: joueur.name === 'Unknown Player' ? 'Joueur à confirmer' : joueur.name,
    pays,
    classe: idsAvecFiche.has(joueur.id),
  }
}

let nombre = 0

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
      tour: TOURS[match.roundId],
      vainqueur: convertirJoueur(match.player1),
      perdant: convertirJoueur(match.player2),
      score: formaterScore(match.result),
    }))

  // Un fichier par tournoi : le site ne charge que celui dont il a besoin
  const idTournoi = nomDossier.split('-')[1]
  writeFileSync(`${SORTIE}/${idTournoi}.json`, JSON.stringify(matchs))
  nombre += 1
  console.log(`${nomDossier} : ${matchs.length} matchs`)
}

console.log(`OK : résultats de ${nombre} tournoi(s)`)
