import { useContext } from 'react'
import { FavoritesContext } from '../context/FavoritesContext.js'

export function useFavorites() {
  const contexte = useContext(FavoritesContext)

  if (contexte === null) {
    throw new Error('useFavorites doit être utilisé dans un FavoritesProvider')
  }

  return contexte
}