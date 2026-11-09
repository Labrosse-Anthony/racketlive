import { CODES_PAYS } from './codes-pays.mjs'
import { libelleTour } from './tours.mjs'

// Transforme un match « à venir » de l'API en match au format du site.
// Renvoie null si on ne veut pas l'afficher (double, tournoi hors calendrier, tour inconnu…).
//   tournoisParId : { 21356: 'Shanghai Rolex Masters', ... } (les tournois du site)
//   idsAvecFiche  : ensemble des joueurs qui ont une page sur le site
export function convertirMatch(match, tournoisParId, idsAvecFiche) {
  const nomTournoi = tournoisParId[match.tournamentId]
  if (!nomTournoi) return null

  // Les doubles ont deux noms séparés par « / » : on ne garde que les simples
  if (match.player1.name.includes('/') || match.player2.name.includes('/')) return null

  const tour = libelleTour(match.roundId)
  if (!tour) return null

  function joueur(j) {
    return {
      id: j.id,
      nom: j.name === 'Unknown Player' ? 'Joueur à confirmer' : j.name,
      pays: CODES_PAYS[j.countryAcr] || '',
      classe: idsAvecFiche.has(j.id),
    }
  }

  return {
    id: String(match.id),
    date: match.startTime.slice(0, 10), // l'heure de l'API n'est pas fiable : on garde le jour
    tournoiId: match.tournamentId,
    tournoi: nomTournoi,
    tour,
    joueur1: joueur(match.player1),
    joueur2: joueur(match.player2),
  }
}
