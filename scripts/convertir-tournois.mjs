import { readFileSync, writeFileSync } from 'node:fs'
import { CODES_PAYS } from './codes-pays.mjs'

const SURFACES = { 1: 'dur', 2: 'terre-battue', 3: 'indoor', 4: 'indoor', 5: 'gazon' }

function categorie(tier) {
  if (tier.includes('1000') || tier.includes('Masters')) return '1000'
  if (tier.includes('500')) return '500'
  if (tier.includes('250')) return '250'
  return null
}

// L'API ne donne pas la date de fin : on l'estime.
function estimerFin(debut, nombreDeJours) {
  const date = new Date(`${debut}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + nombreDeJours)
  return date.toISOString().slice(0, 10)
}

function convertir(circuit) {
  const brut = JSON.parse(
    readFileSync(`src/data/api/calendrier-${circuit}.json`, 'utf-8'),
  )

  return brut.donnees
    .filter((t) => t.tier !== 'United Cup')
    .map((t) => {
      const debut = t.date.slice(0, 10)
      const grandChelem = t.rankId === 4
      const cat = grandChelem ? null : categorie(t.tier)

      const separateur = t.name.lastIndexOf(' - ')
      const nom = separateur === -1 ? t.name : t.name.slice(0, separateur)
      const ville = separateur === -1 ? '' : t.name.slice(separateur + 3)

      const code3 = t.country?.acronym
      const pays = CODES_PAYS[code3] || ''
      if (!pays) console.warn(`Pays inconnu : ${code3} (${t.name})`)

      const duree = grandChelem || cat === '1000' ? 13 : 6

      return {
        id: t.id,
        nom,
        circuit: grandChelem ? 'grand-chelem' : circuit,
        categorie: cat,
        surface: SURFACES[t.courtId] || 'dur',
        pays,
        ville,
        debut,
        fin: estimerFin(debut, duree),
      }
    })
}

const tournois = [...convertir('atp'), ...convertir('wta')].sort(
  (a, b) => a.debut.localeCompare(b.debut) || a.nom.localeCompare(b.nom),
)

writeFileSync('src/data/tournaments.json', JSON.stringify(tournois, null, 2))
console.log(`OK : ${tournois.length} tournois`)