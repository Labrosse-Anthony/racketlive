import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { CODES_PAYS } from './codes-pays.mjs'
import { libelleTour, formaterScore } from './tours.mjs'

const DOSSIER = 'src/data/api/joueurs'
const ANNEE = new Date().getFullYear()
const NOMBRE_RESULTATS = 8
const classements = JSON.parse(readFileSync('src/data/rankings.json', 'utf-8'))
const idsAvecFiche = new Set([...classements.atp, ...classements.wta].map((j) => j.id))
const idsTournois = new Set(
  JSON.parse(readFileSync('src/data/tournaments.json', 'utf-8')).map((t) => t.id),
)

function lire(dossier, nomFichier) {
  const fichier = `${DOSSIER}/${dossier}/${nomFichier}`
  if (!existsSync(fichier)) return null
  return JSON.parse(readFileSync(fichier, 'utf-8')).donnees
}

function convertirMain(texte) {
  if (!texte) return null
  return texte.startsWith('Left') ? 'gauche' : 'droite'
}

function bilanSaison(surfaces) {
  const saison = (surfaces || []).find((s) => s.year === ANNEE)
  if (!saison) return { victoires: 0, defaites: 0 }

  return saison.surfaces.reduce(
    (total, s) => ({
      victoires: total.victoires + s.courtWins,
      defaites: total.defaites + s.courtLosses,
    }),
    { victoires: 0, defaites: 0 },
  )
}

function titresCarriere(titres) {
  const NIVEAUX = [2, 3, 4, 7]
  return (titres || [])
    .filter((t) => NIVEAUX.includes(t.tourRankId))
    .reduce((total, t) => total + Number(t.titlesWon), 0)
}

function convertirAdversaire(joueur) {
  return {
    id: joueur.id,
    nom: joueur.name,
    pays: CODES_PAYS[joueur.countryAcr] || '',
    classe: idsAvecFiche.has(joueur.id),
  }
}

function convertirResultats(matchs, idJoueur) {
  return (matchs || [])
    .filter((match) => match.result)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, NOMBRE_RESULTATS)
    .map((match) => {
      const estJoueur1 = match.player1Id === idJoueur
      const adversaire = estJoueur1 ? match.player2 : match.player1
      const nomTournoi = match.tournament.name
      const separateur = nomTournoi.lastIndexOf(' - ')

      return {
        // Le lien vers le tournoi n'existe que si le tournoi est dans notre calendrier
        tournoiId: idsTournois.has(match.tournamentId) ? match.tournamentId : null,
        tournoi: separateur === -1 ? nomTournoi : nomTournoi.slice(0, separateur),
        tour: libelleTour(match.roundId),
        adversaire: convertirAdversaire(adversaire),
        victoire: match.match_winner === idJoueur,
        score: formaterScore(match.result),
      }
    })
}

const resultat = {}

for (const dossier of readdirSync(DOSSIER)) {
  const profil = lire(dossier, 'profil.json')
  if (!profil) continue

  resultat[profil.id] = {
    naissance: profil.birthday.slice(0, 10),
    taille: Number(profil.information?.height) || null,
    main: convertirMain(profil.information?.plays),
    stats: {
      ...bilanSaison(lire(dossier, 'surfaces.json')),
      titresCarriere: titresCarriere(lire(dossier, 'titres.json')),
    },
    derniersResultats: convertirResultats(lire(dossier, 'matchs-passes.json'), profil.id),
    prochainsMatchs: [],
  }
  console.log(`${dossier} : ${profil.name}`)
}

writeFileSync('src/data/players.json', JSON.stringify(resultat, null, 2))
console.log(`OK : ${Object.keys(resultat).length} fiche(s) joueur`)
