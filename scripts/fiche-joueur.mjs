// Petites fonctions qui transforment les données brutes d'un joueur
// (titres, bilan par surface) en données prêtes à afficher.

// Niveau de tournoi de l'API -> libellé, du plus prestigieux au moins prestigieux
const NIVEAUX = [
  { id: 4, libelle: 'Grand Chelem' },
  { id: 9, libelle: 'Jeux olympiques' },
  { id: 7, libelle: 'Finales de saison' },
  { id: 3, libelle: 'Masters 1000 / WTA 1000' },
  { id: 2, libelle: 'Tournois du circuit' },
  { id: 5, libelle: 'Coupe Davis / Billie Jean King Cup' },
  { id: 1, libelle: 'Challengers' },
  { id: 0, libelle: 'Tournois ITF' },
]

// Surface de l'API (courtId) -> nos clés (voir SURFACES dans labels.js)
const SURFACES = { 1: 'dur', 2: 'terre-battue', 3: 'indoor', 4: 'indoor', 5: 'gazon' }
const ORDRE_SURFACES = ['dur', 'terre-battue', 'gazon', 'indoor']

// Titres gagnés et finales perdues, par niveau. On cache les niveaux à zéro.
export function convertirPalmares(titres) {
  const parNiveau = Object.fromEntries((titres || []).map((t) => [t.tourRankId, t]))

  return NIVEAUX.map(({ id, libelle }) => ({
    niveau: libelle,
    titres: Number(parNiveau[id]?.titlesWon) || 0,
    finalesPerdues: Number(parNiveau[id]?.titlesLost) || 0,
  })).filter((ligne) => ligne.titres > 0 || ligne.finalesPerdues > 0)
}

// Victoires et défaites par surface, pour l'année demandée
// (ou la dernière année connue si le joueur n'a pas encore joué cette année).
export function convertirSurfaces(surfaces, annee) {
  const saisons = [...(surfaces || [])].sort((a, b) => b.year - a.year)
  const saison = saisons.find((s) => s.year === annee) || saisons[0]
  if (!saison) return { annee: null, surfaces: [] }

  const totaux = {}
  for (const s of saison.surfaces) {
    const cle = SURFACES[s.courtId]
    if (!cle) continue
    totaux[cle] ??= { victoires: 0, defaites: 0 }
    totaux[cle].victoires += s.courtWins
    totaux[cle].defaites += s.courtLosses
  }

  return {
    annee: saison.year,
    surfaces: ORDRE_SURFACES.filter((cle) => totaux[cle]).map((cle) => ({
      surface: cle,
      ...totaux[cle],
    })),
  }
}
