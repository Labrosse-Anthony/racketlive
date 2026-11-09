import './Squelette.css'

// Blocs gris animés affichés à la place du contenu pendant le chargement.
// `lignes` = nombre de blocs, `hauteur` = hauteur de chaque bloc (en CSS).
function Squelette({ lignes = 5, hauteur = '3.5rem' }) {
  return (
    <div className="squelette" role="status">
      {/* Texte lu par les lecteurs d'écran, invisible à l'écran */}
      <span className="visuellement-cache">Chargement…</span>
      {Array.from({ length: lignes }, (_, index) => (
        <div
          key={index}
          className="squelette__bloc"
          style={{ height: hauteur }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default Squelette
