import tournaments from '../../data/tournaments.json'

function attendre(millisecondes) {
  return new Promise((resolve) => setTimeout(resolve, millisecondes))
}

export async function getTournaments() {
  await attendre(300)
  return tournaments
}