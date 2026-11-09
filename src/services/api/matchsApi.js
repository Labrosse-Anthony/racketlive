import programme from '../../data/programme.json'
import { aujourdhuiISO } from '../../utils/dates.js'

// Les prochains matchs, à partir d'aujourd'hui (les matchs déjà passés sont ignorés)
export async function getUpcomingMatches(limite = 6) {
  const aujourdhui = aujourdhuiISO()
  return programme.filter((match) => match.date >= aujourdhui).slice(0, limite)
}
