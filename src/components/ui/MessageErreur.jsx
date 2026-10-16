import './MessageErreur.css'

function MessageErreur({
  message = 'Impossible de charger les données pour le moment.',
  onReessayer,
}) {
  return (
    <div className="erreur" role="alert">
      <p className="erreur__message">{message}</p>
      {onReessayer && (
        <button type="button" className="erreur__bouton" onClick={onReessayer}>
          Réessayer
        </button>
      )}
    </div>
  )
}

export default MessageErreur
