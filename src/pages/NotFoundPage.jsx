import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section>
      <h1>Page introuvable</h1>
      <p>Cette page n'existe pas.</p>
      <Link to="/calendrier">Retour au calendrier</Link>
    </section>
  )
}

export default NotFoundPage