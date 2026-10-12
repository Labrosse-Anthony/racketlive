import { useEffect, useState } from 'react'
import { getRanking } from '../services/api/rankingsApi.js'
import RankingsTable from '../components/rankings/RankingsTable.jsx'

function ClassementsPage() {
  const [joueurs, setJoueurs] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    getRanking('atp').then((donnees) => {
      setJoueurs(donnees)
      setChargement(false)
    })
  }, [])

  return (
    <section>
      <h1>Classements</h1>
      {chargement ? (
        <p>Chargement…</p>
      ) : (
        <RankingsTable joueurs={joueurs} />
      )}
    </section>
  )
}

export default ClassementsPage