import rankings from '../../data/rankings.json'
import details from '../../data/players.json'
import photos from '../../data/photos.json'

export async function getPlayerById(id) {
  const idNombre = Number(id)

  for (const circuit of ['atp', 'wta']) {
    const index = rankings[circuit].findIndex((joueur) => joueur.id === idNombre)

    if (index !== -1) {
      return {
        ...rankings[circuit][index],
        circuit,
        rang: index + 1,
        photo: photos[`${circuit}-${id}`] || null,
        details: details[String(id)] || null,
      }
    }
  }

  return null
}

export async function getPlayersByIds(ids) {
  const joueurs = await Promise.all(ids.map((id) => getPlayerById(id)))
  return joueurs.filter((joueur) => joueur !== null)
}
