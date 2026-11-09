import { describe, expect, it } from 'vitest'
import { formaterScore, libelleTour, ORDRE } from './tours.mjs'

describe('libelleTour', () => {
  it('traduit les numéros de tours', () => {
    expect(libelleTour(12)).toBe('Finale')
    expect(libelleTour(10)).toBe('Demi-finale')
    expect(libelleTour(4)).toBe('1er tour')
  })

  it('regroupe les numéros 0 à 3 en qualifications', () => {
    expect(libelleTour(0)).toBe('Qualifications')
    expect(libelleTour(3)).toBe('Qualifications')
  })

  it('renvoie un texte vide pour un tour inconnu', () => {
    expect(libelleTour(99)).toBe('')
  })
})

describe('formaterScore', () => {
  it('traduit forfait et abandon', () => {
    expect(formaterScore('w/o')).toBe('Forfait')
    expect(formaterScore('6-4 3-2 ret.')).toBe('6-4 3-2 abandon')
  })

  it('laisse un score normal tel quel', () => {
    expect(formaterScore('6-4 6-3')).toBe('6-4 6-3')
  })
})

describe('ORDRE', () => {
  it('met la finale avant la demi-finale', () => {
    expect(ORDRE[12]).toBeLessThan(ORDRE[10])
  })
})
