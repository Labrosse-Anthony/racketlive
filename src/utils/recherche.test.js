import { describe, expect, it } from 'vitest'
import { chercherJoueurs, normaliser } from './recherche.js'

const joueurs = [
  { id: 1, nom: 'Jannik Sinner' },
  { id: 2, nom: 'Iga Świątek' },
  { id: 3, nom: 'Carlos Alcaraz' },
  { id: 4, nom: 'Sinner Junior' },
]

describe('normaliser', () => {
  it('retire les accents et les majuscules', () => {
    expect(normaliser('  Świątek É ')).toBe('swiatek e')
  })
})

describe('chercherJoueurs', () => {
  it('trouve sans tenir compte des accents ni de la casse', () => {
    expect(chercherJoueurs(joueurs, 'swiatek').map((j) => j.id)).toEqual([2])
  })

  it('accepte les mots dans le désordre', () => {
    expect(chercherJoueurs(joueurs, 'sinner jannik').map((j) => j.id)).toEqual([1])
  })

  it('renvoie une liste vide si la saisie est vide ou sans résultat', () => {
    expect(chercherJoueurs(joueurs, '   ')).toEqual([])
    expect(chercherJoueurs(joueurs, 'zzz')).toEqual([])
  })

  it('respecte la limite', () => {
    expect(chercherJoueurs(joueurs, 'a', 2)).toHaveLength(2)
  })
})
