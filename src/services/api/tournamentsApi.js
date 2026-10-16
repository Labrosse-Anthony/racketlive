import tournaments from '../../data/tournaments.json'

export async function getTournaments() {
  return tournaments
}

export async function getTournamentById(id) {
  return tournaments.find((tournoi) => tournoi.id === Number(id)) || null
}

export async function getTournamentResults(id) {
  try {
    const reponse = await fetch(`${import.meta.env.BASE_URL}data/resultats/${id}.json`)
    const type = reponse.headers.get('content-type') || ''

    // Pas de fichier pour ce tournoi (ou page d'erreur au lieu de données) : pas de résultats
    if (!reponse.ok || !type.includes('json')) return []

    return await reponse.json()
  } catch {
    return []
  }
}
