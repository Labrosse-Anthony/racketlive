import rankings from '../../data/rankings.json'

export async function getRanking(circuit) {
  return rankings[circuit] || []
}

export async function getLastUpdate() {
  return rankings.misAJour || null
}
