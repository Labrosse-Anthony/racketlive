import { describe, expect, it } from 'vitest'
import { convertirMatch } from './programme.mjs'

const tournois = { 21356: 'Shanghai Rolex Masters' }
const fiches = new Set([99691])

function match(modifs = {}) {
  return {
    id: 1367,
    startTime: '2026-10-16T04:00:00.000Z',
    roundId: 9,
    tournamentId: 21356,
    player1: { id: 99691, name: 'Rafael Jodar', countryAcr: 'ESP' },
    player2: { id: 33648, name: 'Casper Ruud', countryAcr: 'NOR' },
    ...modifs,
  }
}

describe('convertirMatch', () => {
  it('convertit un match de simple', () => {
    expect(convertirMatch(match(), tournois, fiches)).toEqual({
      id: '1367',
      date: '2026-10-16',
      tournoiId: 21356,
      tournoi: 'Shanghai Rolex Masters',
      tour: 'Quart de finale',
      joueur1: { id: 99691, nom: 'Rafael Jodar', pays: 'ES', classe: true },
      joueur2: { id: 33648, nom: 'Casper Ruud', pays: 'NO', classe: false },
    })
  })

  it('ignore un tournoi absent du calendrier', () => {
    expect(convertirMatch(match({ tournamentId: 1 }), tournois, fiches)).toBeNull()
  })

  it('ignore un match sans date ou sans joueur', () => {
    expect(convertirMatch(match({ startTime: null }), tournois, fiches)).toBeNull()
    expect(convertirMatch(match({ player2: null }), tournois, fiches)).toBeNull()
  })

  it('ignore les doubles', () => {
    const double = match({
      player1: { id: 5, name: 'A Un/B Deux', countryAcr: 'N/A' },
    })
    expect(convertirMatch(double, tournois, fiches)).toBeNull()
  })

  it('remplace un joueur inconnu', () => {
    const inconnu = match({
      player2: { id: 7, name: 'Unknown Player', countryAcr: 'N/A' },
    })
    expect(convertirMatch(inconnu, tournois, fiches).joueur2.nom).toBe('Joueur à confirmer')
  })
})
