import tournaments from '../../data/tournaments.json'
import results from '../../data/results.json'

function attendre(millisecondes) {
  return new Promise((resolve) => setTimeout(resolve, millisecondes))
}

export async function getTournaments() {
  await attendre(300)
  return tournaments
}

export async function getTournamentById(id) {
  await attendre(300)
  return tournaments.find((tournoi) => tournoi.id === Number(id)) || null
}

export async function getTournamentResults(id) {
  await attendre(300)
  return results[String(id)] || []
}