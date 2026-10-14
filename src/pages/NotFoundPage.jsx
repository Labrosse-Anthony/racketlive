import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle.js'

function NotFoundPage() {
  usePageTitle('Page introuvable')

  return (
    <section>
      <h1>Page introuvable</h1>
      <p>Cette page n'existe pas.</p>
      <Link to="/calendrier">Retour au calendrier</Link>
    </section>
  )
}

export default NotFoundPage