import { describe, expect, it } from 'vitest'
import { CODES_PAYS } from './codes-pays.mjs'

describe('CODES_PAYS', () => {
  it('convertit quelques pays connus', () => {
    expect(CODES_PAYS.FRA).toBe('FR')
    expect(CODES_PAYS.GER).toBe('DE')
    expect(CODES_PAYS.SUI).toBe('CH')
  })

  it('a des codes de 3 lettres en entrée et de 2 lettres en sortie', () => {
    for (const [ioc, iso] of Object.entries(CODES_PAYS)) {
      expect(ioc).toMatch(/^[A-Z]{3}$/)
      expect(iso).toMatch(/^[A-Z]{2}$/)
    }
  })
})
