import { readFileSync, writeFileSync } from 'node:fs'
import { CODES_PAYS } from './codes-pays.mjs'

function convertir(circuit) {
  const brut = JSON.parse(
    readFileSync(`src/data/api/classement-${circuit}.json`, 'utf-8'),
  )

  return brut.donnees
    .filter((ligne) => ligne.player)
    .sort((a, b) => a.position - b.position)
    .map((ligne) => {
      const code3 = ligne.player.countryAcr
      const pays = CODES_PAYS[code3] || ''
      if (!pays) console.warn(`Pays inconnu : ${code3} (${ligne.player.name})`)

      return {
        id: ligne.player.id,
        nom: ligne.player.name,
        pays,
        points: ligne.rankingPoints ?? ligne.point,
        evolution: null,
      }
    })
}

const resultat = {
  misAJour: JSON.parse(readFileSync('src/data/api/classement-atp.json', 'utf-8'))
    .recupereLe,
  atp: convertir('atp'),
  wta: convertir('wta'),
}

writeFileSync('src/data/rankings.json', JSON.stringify(resultat, null, 2))
console.log(`OK : ${resultat.atp.length} joueurs ATP, ${resultat.wta.length} joueuses WTA`)