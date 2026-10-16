export const TOURS = {
  4: '1er tour',
  5: '2e tour',
  6: '3e tour',
  7: '4e tour',
  8: 'Phase de poules',
  9: 'Quart de finale',
  10: 'Demi-finale',
  12: 'Finale',
}

export const ORDRE = { 12: 1, 10: 2, 9: 3, 8: 4, 7: 5, 6: 6, 5: 7, 4: 8 }

export function libelleTour(numero) {
  if (numero >= 0 && numero <= 3) return 'Qualifications'
  return TOURS[numero] || ''
}

export function formaterScore(texte) {
  if (texte === 'w/o') return 'Forfait'
  return texte.replace('ret.', 'abandon')
}
