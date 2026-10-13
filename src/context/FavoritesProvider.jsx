import { useEffect, useState } from 'react'
import { FavoritesContext } from './FavoritesContext.js'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../services/api/favoritesApi.js'

function FavoritesProvider({ children }) {
  const [favoris, setFavoris] = useState({ joueurs: [], tournois: [] })
  const [pret, setPret] = useState(false)

  useEffect(() => {
    let annule = false

    getFavorites().then((donnees) => {
      if (annule) return
      setFavoris(donnees)
      setPret(true)
    })

    return () => {
      annule = true
    }
  }, [])

  function estFavori(type, id) {
    return favoris[type].includes(Number(id))
  }

  async function basculerFavori(type, id) {
    const idNombre = Number(id)
    const misAJour = estFavori(type, idNombre)
      ? await removeFavorite(type, idNombre)
      : await addFavorite(type, idNombre)
    setFavoris(misAJour)
  }

  const valeur = { favoris, pret, estFavori, basculerFavori }

  return (
    <FavoritesContext.Provider value={valeur}>
      {children}
    </FavoritesContext.Provider>
  )
}

export default FavoritesProvider