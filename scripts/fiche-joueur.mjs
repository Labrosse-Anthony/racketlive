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

// ---------- Infos personnelles ----------

// L'API écrit « Hamburg, Germany » : on traduit le pays (dernier mot) en français.
// Pour cela on construit la liste « nom anglais -> nom français » avec Intl.
const enAnglais = new Intl.DisplayNames(['en'], { type: 'region' })
const enFrancais = new Intl.DisplayNames(['fr'], { type: 'region' })
const PAYS_FRANCAIS = new Map()
const LETTRES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
for (const a of LETTRES) {
  for (const b of LETTRES) {
    try {
      const nom = enAnglais.of(a + b)
      if (nom && nom !== a + b) PAYS_FRANCAIS.set(nom, enFrancais.of(a + b))
    } catch {
      // code de pays qui n'existe pas : on passe
    }
  }
}
// Quelques écritures différentes de l'API
const ALIAS = { USA: 'US', 'Czech Republic': 'CZ', 'Great Britain': 'GB', UK: 'GB', 'South Korea': 'KR' }
for (const [alias, code] of Object.entries(ALIAS)) PAYS_FRANCAIS.set(alias, enFrancais.of(code))

export function traduireLieu(texte) {
  if (!texte) return null
  const morceaux = texte.split(',').map((m) => m.trim())
  const dernier = morceaux.length - 1
  morceaux[dernier] = PAYS_FRANCAIS.get(morceaux[dernier]) || morceaux[dernier]
  return morceaux.join(', ')
}

// Garde seulement ce qui est renseigné : une information vide n'est pas affichée.
export function convertirInfos(profil) {
  const info = profil.information || {}
  const poids = Number(info.weight)
  const passePro = Number(info.turnedPro)

  return {
    entraineur: profil.coach || info.coach || null,
    lieuNaissance: traduireLieu(info.birthplace),
    residence: traduireLieu(info.residence),
    passePro: passePro > 1900 ? passePro : null,
    poids: poids > 0 ? poids : null,
    meilleurRang: profil.bestRank
      ? { position: profil.bestRank.position, date: profil.bestRank.date.slice(0, 10) }
      : null,
  }
}

// ---------- Statistiques de service et de retour (carrière) ----------

// Pourcentage arrondi, ou null si on ne peut pas diviser par zéro
function pourcent(partie, total) {
  if (!total) return null
  return Math.round((partie / total) * 1000) / 10
}

// Transforme les gros compteurs de l'API en pourcentages faciles à lire.
export function convertirStatsJeu(donnees) {
  const service = donnees?.serviceStats
  const retour = donnees?.rtnStats
  const breaksService = donnees?.breakPointsServeStats
  const breaksRetour = donnees?.breakPointsRtnStats
  if (!service || !retour) return null

  return {
    service: {
      aces: pourcent(service.acesGm, service.firstServeOfGm),
      doublesFautes: pourcent(service.doubleFaultsGm, service.firstServeOfGm),
      premieresBalles: pourcent(service.firstServeGm, service.firstServeOfGm),
      pointsPremiere: pourcent(service.winningOnFirstServeGm, service.winningOnFirstServeOfGm),
      pointsSeconde: pourcent(service.winningOnSecondServeGm, service.winningOnSecondServeOfGm),
      breaksSauves: breaksService
        ? pourcent(breaksService.breakPointSavedGm, breaksService.breakPointFacedGm)
        : null,
    },
    retour: {
      pointsPremiere: pourcent(retour.winningOnFirstServeOfGm - retour.winningOnFirstServeGm, retour.winningOnFirstServeOfGm),
      pointsSeconde: pourcent(retour.winningOnSecondServeOfGm - retour.winningOnSecondServeGm, retour.winningOnSecondServeOfGm),
      breaksConvertis: breaksRetour
        ? pourcent(breaksRetour.breakPointWonGm, breaksRetour.breakPointChanceGm)
        : null,
    },
  }
}
