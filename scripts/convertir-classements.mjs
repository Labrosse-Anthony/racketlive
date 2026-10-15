import { readFileSync, writeFileSync } from 'node:fs'

const CODES_PAYS = {
  ALG: 'DZ', ARG: 'AR', ARM: 'AM', AUS: 'AU', AUT: 'AT', BEL: 'BE', BIH: 'BA',
  BLR: 'BY', BOL: 'BO', BRA: 'BR', BUL: 'BG', CAN: 'CA', CHI: 'CL', CHN: 'CN',
  COL: 'CO', CRC: 'CR', CRO: 'HR', CYP: 'CY', CZE: 'CZ', DEN: 'DK', DOM: 'DO',
  ECU: 'EC', EGY: 'EG', ESP: 'ES', EST: 'EE', FIN: 'FI', FRA: 'FR', GBR: 'GB',
  GEO: 'GE', GER: 'DE', GRE: 'GR', HUN: 'HU', INA: 'ID', IND: 'IN', IRL: 'IE',
  ISR: 'IL', ITA: 'IT', JPN: 'JP', KAZ: 'KZ', KOR: 'KR', LAT: 'LV', LTU: 'LT',
  LUX: 'LU', MAR: 'MA', MDA: 'MD', MEX: 'MX', MON: 'MC', NED: 'NL', NOR: 'NO',
  NZL: 'NZ', PAR: 'PY', PER: 'PE', PHI: 'PH', POL: 'PL', POR: 'PT', ROU: 'RO',
  RSA: 'ZA', RUS: 'RU', SLO: 'SI', SRB: 'RS', SUI: 'CH', SVK: 'SK', SWE: 'SE',
  THA: 'TH', TPE: 'TW', TUN: 'TN', TUR: 'TR', UKR: 'UA', URU: 'UY', USA: 'US',
  UZB: 'UZ', VEN: 'VE',
}

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