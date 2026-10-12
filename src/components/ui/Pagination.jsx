import './Pagination.css'

function Pagination({ page, nombrePages, onChange }) {
  // Pas besoin de pagination s'il n'y a qu'une seule page
  if (nombrePages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Précédent
      </button>
      <span>
        Page {page} sur {nombrePages}
      </span>
      <button disabled={page >= nombrePages} onClick={() => onChange(page + 1)}>
        Suivant →
      </button>
    </nav>
  )
}

export default Pagination