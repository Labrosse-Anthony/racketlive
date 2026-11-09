import { describe, expect, it } from 'vitest'
import { PAYS, SURFACES } from './labels.js'

describe('PAYS', () => {
  it('donne le nom français à partir du code', () => {
    expect(PAYS.FR).toBe('France')
    expect(PAYS.ES).toBe('Espagne')
  })

  it('renvoie le code tel quel quand il est inconnu ou invalide', () => {
    expect(PAYS.xx).toBe('xx')
    expect(PAYS['']).toBe('')
  })
})

describe('SURFACES', () => {
  it('contient les 4 surfaces', () => {
    expect(Object.keys(SURFACES)).toHaveLength(4)
  })
})
