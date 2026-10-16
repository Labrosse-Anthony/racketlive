import rankings from '../../data/rankings.json'

function attendre(millisecondes) {
  return new Promise((resolve) => setTimeout(resolve, millisecondes))
}

export async function getRanking(circuit) {
  await attendre(300)
  return rankings[circuit] || []
}

export async function getLastUpdate() {
  return rankings.misAJour || null
}
