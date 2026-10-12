import { useParams } from 'react-router-dom'

function JoueurPage() {
  const { id } = useParams()

  return (
    <section>
      <h1>Fiche joueur</h1>
      <p>Joueur numéro : {id}</p>
    </section>
  )
}

export default JoueurPage