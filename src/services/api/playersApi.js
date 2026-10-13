import rankings from '../../data/rankings.json'
import details from '../../data/players.json'

function attendre(millisecondes) {
  return new Promise((resolve) => setTimeout(resolve, millisecondes))
}

export async function getPlayerById(id) {
  await attendre(300)
  const idNombre = Number(id)

  for (const circuit of ['atp', 'wta']) {
    const index = rankings[circuit].findIndex((joueur) => joueur.id === idNombre)

    if (index !== -1) {
      return {
        ...rankings[circuit][index],
        circuit,
        rang: index + 1,
        details: details[String(id)] || null,
      }
    }
  }

  return null
}