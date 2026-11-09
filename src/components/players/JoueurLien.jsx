import { Link } from 'react-router-dom'
import Flag from '../ui/Flag.jsx'

// Drapeau + nom d'un joueur. C'est un lien vers sa fiche seulement s'il en a une
// (`joueur.classe`), sinon un simple texte. `className` règle l'apparence.
function JoueurLien({ joueur, className, children }) {
  const contenu = (
    <>
      <Flag code={joueur.pays} /> {joueur.nom}
      {children}
    </>
  )

  if (!joueur.classe) {
    return <span className={className}>{contenu}</span>
  }

  return (
    <Link to={`/joueurs/${joueur.id}`} className={className}>
      {contenu}
    </Link>
  )
}

export default JoueurLien
