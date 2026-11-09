import { describe, expect, it } from 'vitest'
import {
  convertirInfos,
  convertirPalmares,
  convertirSurfaces,
  traduireLieu,
} from './fiche-joueur.mjs'

describe('convertirPalmares', () => {
  it('range par prestige et cache les niveaux à zéro', () => {
    const titres = [
      { tourRankId: 0, titlesWon: '0', titlesLost: '0' },
      { tourRankId: 2, titlesWon: '15', titlesLost: '8' },
      { tourRankId: 4, titlesWon: '2', titlesLost: '4' },
    ]
    expect(convertirPalmares(titres)).toEqual([
      { niveau: 'Grand Chelem', titres: 2, finalesPerdues: 4 },
      { niveau: 'Tournois du circuit', titres: 15, finalesPerdues: 8 },
    ])
  })

  it('accepte une absence de données', () => {
    expect(convertirPalmares(null)).toEqual([])
  })
})

describe('convertirSurfaces', () => {
  const donnees = [
    {
      year: 2026,
      surfaces: [
        { courtId: 1, courtWins: 10, courtLosses: 2 },
        { courtId: 3, courtWins: 3, courtLosses: 1 },
        { courtId: 4, courtWins: 1, courtLosses: 0 },
        { courtId: 2, courtWins: 5, courtLosses: 5 },
      ],
    },
    { year: 2025, surfaces: [{ courtId: 5, courtWins: 6, courtLosses: 3 }] },
  ]

  it('additionne les surfaces « indoor » et les range dans l’ordre', () => {
    expect(convertirSurfaces(donnees, 2026)).toEqual({
      annee: 2026,
      surfaces: [
        { surface: 'dur', victoires: 10, defaites: 2 },
        { surface: 'terre-battue', victoires: 5, defaites: 5 },
        { surface: 'indoor', victoires: 4, defaites: 1 },
      ],
    })
  })

  it('prend la dernière année connue si l’année demandée manque', () => {
    expect(convertirSurfaces(donnees, 2030).annee).toBe(2026)
  })

  it('renvoie une liste vide sans données', () => {
    expect(convertirSurfaces([], 2026)).toEqual({ annee: null, surfaces: [] })
  })
})

describe('traduireLieu', () => {
  it('traduit le pays en français', () => {
    expect(traduireLieu('Hamburg, Germany')).toBe('Hamburg, Allemagne')
    expect(traduireLieu('El Palmar, Murcia, Spain')).toBe('El Palmar, Murcia, Espagne')
  })

  it('garde un nom de pays inconnu et gère le vide', () => {
    expect(traduireLieu('Quelque part, Atlantis')).toBe('Quelque part, Atlantis')
    expect(traduireLieu(null)).toBeNull()
  })
})

describe('convertirInfos', () => {
  it('ne garde que les informations renseignées', () => {
    const profil = {
      coach: 'Samuel Lopez',
      information: { turnedPro: '2018', weight: null, birthplace: 'Minsk, Belarus', residence: null },
      bestRank: { position: 1, date: '2026-04-06T00:00:00.000Z' },
    }
    expect(convertirInfos(profil)).toEqual({
      entraineur: 'Samuel Lopez',
      lieuNaissance: 'Minsk, Biélorussie',
      residence: null,
      passePro: 2018,
      poids: null,
      meilleurRang: { position: 1, date: '2026-04-06' },
    })
  })
})
