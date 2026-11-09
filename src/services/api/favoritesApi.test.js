import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addFavorite, getFavorites, removeFavorite } from './favoritesApi.js'

// Faux localStorage : le test tourne dans Node, qui n'a pas de navigateur
function creerFauxStockage() {
  let contenu = {}
  return {
    getItem: (cle) => (cle in contenu ? contenu[cle] : null),
    setItem: (cle, valeur) => {
      contenu[cle] = String(valeur)
    },
    clear: () => {
      contenu = {}
    },
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', creerFauxStockage())
})

describe('favoritesApi', () => {
  it('commence sans aucun favori', async () => {
    expect(await getFavorites()).toEqual({ joueurs: [], tournois: [] })
  })

  it('ajoute un favori et le retrouve ensuite', async () => {
    await addFavorite('joueurs', 7)
    expect(await getFavorites()).toEqual({ joueurs: [7], tournois: [] })
  })

  it("n'ajoute pas deux fois le même favori", async () => {
    await addFavorite('tournois', 3)
    await addFavorite('tournois', 3)
    expect((await getFavorites()).tournois).toEqual([3])
  })

  it('retire un favori', async () => {
    await addFavorite('joueurs', 1)
    await addFavorite('joueurs', 2)
    await removeFavorite('joueurs', 1)
    expect((await getFavorites()).joueurs).toEqual([2])
  })

  it('ignore des données abîmées dans le stockage', async () => {
    localStorage.setItem('racketlive-favoris', '{pas du json')
    expect(await getFavorites()).toEqual({ joueurs: [], tournois: [] })
  })
})
