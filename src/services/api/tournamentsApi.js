import tournaments from '../../data/tournaments.json'

export async function getTournaments() {
  return tournaments
}

export async function getTournamentById(id) {
  return tournaments.find((tournoi) => tournoi.id === Number(id)) || null
}

// Les résultats sont dans un fichier par tournoi, chargé seulement quand on en a besoin.
// Pas de fichier pour ce tournoi = pas de résultats (liste vide).
// Une vraie panne (réseau coupé, erreur serveur) lève une erreur : la page affichera un message.
export async function getTournamentResults(id) {
  const reponse = await fetch(`${import.meta.env.BASE_URL}data/resultats/${id}.json`)
  const type = reponse.headers.get('content-type') || ''

  // Fichier absent : le serveur répond 404, ou renvoie une page HTML à la place
  if (reponse.status === 404 || (reponse.ok && !type.includes('json'))) return []

  if (!reponse.ok) throw new Error(`Erreur ${reponse.status} en chargeant les résultats`)

  return reponse.json()
}
