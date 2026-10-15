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
      {/* Cœur vide (contour) ou plein selon l'état */}
      <svg
        className="favori__coeur"
        viewBox="0 0 24 24"
        fill={actif ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  )
}

export default FavoriteButton