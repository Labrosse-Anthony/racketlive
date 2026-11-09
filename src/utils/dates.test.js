import { afterEach, describe, expect, it, vi } from 'vitest'
import { aujourdhuiISO, calculerAge, formaterPeriode, lireDate } from './dates.js'

// Après chaque test, on remet l'horloge normale
afterEach(() => {
  vi.useRealTimers()
})

describe('lireDate', () => {
  it('lit une date au format AAAA-MM-JJ', () => {
    const date = lireDate('2026-03-02')
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(2) // mars = 2 (les mois commencent à 0)
    expect(date.getDate()).toBe(2)
  })
})

describe('formaterPeriode', () => {
  it('affiche le début et la fin en français', () => {
    expect(formaterPeriode('2026-03-02', '2026-03-08')).toBe('2 mars – 8 mars 2026')
  })
})

describe('calculerAge', () => {
  it("compte l'âge quand l'anniversaire est déjà passé", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-09T12:00:00'))
    expect(calculerAge('1989-05-17')).toBe(37)
  })

  it("ne compte pas l'année quand l'anniversaire n'est pas encore passé", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-01T12:00:00'))
    expect(calculerAge('1989-05-17')).toBe(36)
  })

  it("compte l'année le jour même de l'anniversaire", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-17T12:00:00'))
    expect(calculerAge('1989-05-17')).toBe(37)
  })
})

describe('aujourdhuiISO', () => {
  it('donne la date du jour avec des zéros devant', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-04T12:00:00'))
    expect(aujourdhuiISO()).toBe('2026-03-04')
  })
})
