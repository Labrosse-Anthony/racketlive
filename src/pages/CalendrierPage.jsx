import { useEffect, useState } from 'react'
import { getTournaments } from '../services/api/tournamentsApi.js'
import TournamentList from '../components/tournaments/TournamentList.jsx'

function CalendrierPage() {
  const [tournois, setTournois] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    getTournaments().then((donnees) => {
      setTournois(donnees)
      setChargement(false)
    })
  }, [])

  return (
    <section>
      <h1>Calendrier des tournois</h1>
      {chargement ? <p>Chargement…</p> : <TournamentList tournois={tournois} />}
    </section>
  )
}

export default CalendrierPage