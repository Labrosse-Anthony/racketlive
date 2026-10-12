import { useParams } from 'react-router-dom'

function TournoiDetailPage() {
  const { id } = useParams()

  return (
    <section>
      <h1>Détail du tournoi</h1>
      <p>Tournoi numéro : {id}</p>
    </section>
  )
}

export default TournoiDetailPage