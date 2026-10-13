import { useFavorites } from '../../hooks/useFavorites.js'
import './FavoriteButton.css'

function FavoriteButton({ type, id, nom }) {
  const { estFavori, basculerFavori } = useFavorites()
  const actif = estFavori(type, id)

  return (
    <button
      type="button"
      className={actif ? 'favori favori--actif' : 'favori'}
      aria-pressed={actif}
      aria-label={`Favori : ${nom}`}
      onClick={() => basculerFavori(type, id)}
    >
      <span aria-hidden="true">{actif ? '❤️' : '🤍'}</span>
    </button>
  )
}

export default FavoriteButton