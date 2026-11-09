import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { convertirMatch } from './programme.mjs'

const MAX_MATCHS = 60

const tournois = JSON.parse(readFileSync('src/data/tournaments.json', 'utf-8'))
const tournoisParId = Object.fromEntries(tournois.map((t) => [t.id, t.nom]))

const classements = JSON.parse(readFileSync('src/data/rankings.json', 'utf-8'))
const idsAvecFiche = new Set([...classements.atp, ...classements.wta].map((j) => j.id))

const matchs = []

for (const circuit of ['atp', 'wta']) {
  const fichier = `src/data/api/matchs-a-venir-${circuit}.json`
  if (!existsSync(fichier)) {
    console.warn(`! ${fichier} manque : lance « npm run donnees -- --groupe=programme »`)
    continue
  }

  const brut = JSON.parse(readFileSync(fichier, 'utf-8')).donnees
  for (const match of brut) {
    const converti = convertirMatch(match, tournoisParId, idsAvecFiche)
    if (converti) matchs.push(converti)
  }
}

// Du plus proche au plus lointain, puis par tournoi
matchs.sort((a, b) => a.date.localeCompare(b.date) || a.tournoi.localeCompare(b.tournoi))

writeFileSync('src/data/programme.json', JSON.stringify(matchs.slice(0, MAX_MATCHS), null, 2))
console.log(`OK : ${Math.min(matchs.length, MAX_MATCHS)} match(s) à venir`)
