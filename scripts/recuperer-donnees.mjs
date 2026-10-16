import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

// =====================================================================
//  Récupération des données de l'API Tennis (Matchstat via RapidAPI)
//
//  Exemples (à lancer depuis la racine du projet) :
//    npm run donnees                          -> groupes de base
//    npm run donnees -- --liste               -> montre ce qui serait fait (0 requête)
//    npm run donnees -- --groupe=joueurs      -> fiches des 10 premiers joueurs
//    npm run donnees -- --groupe=tous --nombre=5
//    npm run donnees -- --force               -> refait même si le fichier existe
//    npm run donnees -- --deja=4              -> j'ai déjà fait 4 requêtes aujourd'hui
// =====================================================================

// ---------- 1. Lire le fichier .env (là où se trouve la clé secrète) ----------
function lireEnv() {
  if (!existsSync('.env')) {
    throw new Error('Fichier .env introuvable. Lance la commande depuis la racine du projet.')
  }

  const variables = {}
  const lignes = readFileSync('.env', 'utf8').split('\n')

  for (const ligne of lignes) {
    const propre = ligne.trim()
    if (propre === '' || propre.startsWith('#')) continue

    const position = propre.indexOf('=')
    if (position === -1) continue

    const nom = propre.slice(0, position).trim()
    const valeur = propre.slice(position + 1).trim().replace(/^["']|["']$/g, '')
    variables[nom] = valeur
  }

  return variables
}

const env = lireEnv()
const CLE = env.RAPIDAPI_KEY
const HOTE = env.RAPIDAPI_HOST

if (!CLE || !HOTE) {
  console.error('RAPIDAPI_KEY ou RAPIDAPI_HOST est manquant dans le fichier .env')
  process.exit(1)
}

// ---------- 2. Réglages ----------
const DOSSIER = 'src/data/api'
const FICHIER_COMPTEUR = 'scripts/.compteur-api.json'
const LIMITE_PAR_JOUR = 50 // plan gratuit Basic
const PAUSE_MS = 400 // le plan gratuit accepte 4 requêtes par seconde
const CIRCUITS = ['atp', 'wta']
const ANNEE = new Date().getFullYear()
const AUJOURDHUI = new Date().toISOString().slice(0, 10) // ex : 2026-10-14

// Options tapées après le nom de la commande : --nom=valeur
function lireOption(nom, parDefaut) {
  const argument = process.argv.find((a) => a.startsWith(`--${nom}=`))
  return argument ? argument.slice(nom.length + 3) : parDefaut
}

const forcer = process.argv.includes('--force')
const listerSeulement = process.argv.includes('--liste')
const groupesDemandes = lireOption('groupe', 'classements,calendrier,reference,matchs').split(',')
const NOMBRE = Number(lireOption('nombre', '10')) // combien de joueurs / tournois
const dejaFait = lireOption('deja', null)

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------- 3. Compteur de requêtes (pour ne jamais dépasser 50 par jour) ----------
// Le compteur est gardé dans un petit fichier, pour survivre entre deux lancements.
function lireCompteur() {
  if (existsSync(FICHIER_COMPTEUR)) {
    const compteur = JSON.parse(readFileSync(FICHIER_COMPTEUR, 'utf8'))
    if (compteur.date === AUJOURDHUI) return compteur
  }
  return { date: AUJOURDHUI, appels: 0 } // nouveau jour -> on repart de zéro
}

function enregistrerCompteur(compteur) {
  writeFileSync(FICHIER_COMPTEUR, JSON.stringify(compteur, null, 2))
}

const compteur = lireCompteur()
if (dejaFait !== null) {
  compteur.appels = Number(dejaFait)
  enregistrerCompteur(compteur)
}

const restant = () => LIMITE_PAR_JOUR - compteur.appels

// Erreur spéciale : on arrête tout, inutile d'insister.
class ErreurQuota extends Error {}

// ---------- 4. Lire un fichier déjà récupéré (pour trouver les identifiants) ----------
function lireDonnees(nomFichier) {
  const fichier = `${DOSSIER}/${nomFichier}`
  if (!existsSync(fichier)) {
    console.warn(`  ! ${nomFichier} manque : lance d'abord le groupe qui le crée.`)
    return null
  }
  return JSON.parse(readFileSync(fichier, 'utf8')).donnees
}

// ---------- 5. Le catalogue des endpoints, rangés par groupe ----------
// Chaque groupe renvoie une liste de { fichier, chemin } :
//   fichier = où on enregistre, chemin = ce qu'on demande à l'API.
const GROUPES = {
  // Les classements ATP / WTA (utilisés par la page Classements)
  classements: () =>
    CIRCUITS.map((c) => ({
      fichier: `classement-${c}.json`,
      chemin: `/tennis/v2/${c}/ranking/singles?pageSize=100`,
    })),

  // Le calendrier des tournois (utilisé par la page Calendrier)
  calendrier: () => [
    ...CIRCUITS.map((c) => ({
      fichier: `calendrier-${c}.json`,
      chemin: `/tennis/v2/${c}/tournament/calendar/${ANNEE}?pageSize=100&filter=TourRank:2,3,4`,
    })),
    { fichier: 'calendrier-actif.json', chemin: '/tennis/v2/calendar/active' },
    ...CIRCUITS.map((c) => ({
      fichier: `calendrier-filtres-${c}.json`,
      chemin: `/tennis/v2/calendar/${c}/filters`,
    })),
  ],

  // Les listes de référence (pays, surfaces, tours, niveaux de classement)
  reference: () => [
    { fichier: 'ref-pays.json', chemin: '/tennis/v2/countries' },
    { fichier: 'ref-surfaces.json', chemin: '/tennis/v2/court' },
    { fichier: 'ref-tours.json', chemin: '/tennis/v2/round' },
    { fichier: 'ref-niveaux-classement.json', chemin: '/tennis/v2/ranking' },
  ],

  // Les matchs : à venir, résultats du jour, prévisions, affiches possibles
  // (les cotes d'un match précis demandent player1Id, tournamentId et roundId : pas ici)
  matchs: () =>
    CIRCUITS.flatMap((c) => [
      { fichier: `matchs-a-venir-${c}.json`, chemin: `/tennis/v2/${c}/fixtures` },
      {
        fichier: `resultats-${c}-${AUJOURDHUI}.json`,
        chemin: `/tennis/v2/${c}/results/${AUJOURDHUI}`,
      },
      { fichier: `previsions-${c}.json`, chemin: `/tennis/v2/upcoming/matches/${c}` },
      { fichier: `affiches-possibles-${c}.json`, chemin: `/tennis/v2/potential-fixtures/${c}` },
    ]),

  // Les matchs en direct (change à chaque seconde : à utiliser avec --force)
  live: () => [{ fichier: 'live.json', chemin: '/tennis/v2/extend/api/events/live' }],

  // Les fiches des N premiers joueurs de chaque classement (8 requêtes par joueur)
  joueurs: () => {
    const demandes = []

    for (const c of CIRCUITS) {
      const classement = lireDonnees(`classement-${c}.json`)
      if (!classement) continue

      for (const ligne of classement.slice(0, NOMBRE)) {
        const id = ligne.player.id
        const base = `/tennis/v2/${c}/player`
        const dossier = `joueurs/${c}-${id}`

        demandes.push(
          { fichier: `${dossier}/profil.json`, chemin: `${base}/profile/${id}?include=form,ranking,country` },
          { fichier: `${dossier}/titres.json`, chemin: `${base}/titles/${id}` },
          { fichier: `${dossier}/stats-matchs.json`, chemin: `${base}/match-stats/${id}` },
          {
            fichier: `${dossier}/matchs-passes.json`,
            chemin: `${base}/past-matches/${id}?include=round,tournament,tournament.court,tournament.rank,tournament.country,stat&pageSize=20`,
          },
          { fichier: `${dossier}/surfaces.json`, chemin: `${base}/surface-summary/${id}` },
          { fichier: `${dossier}/performances.json`, chemin: `${base}/perf-breakdown/${id}` },
          { fichier: `${dossier}/finales.json`, chemin: `${base}/finals/${id}` },
          { fichier: `${dossier}/h2h-interessants.json`, chemin: `${base}/interesting-h2h/${id}` },
        )
      }
    }

    return demandes
  },

  // Les N tournois les plus proches d'aujourd'hui (4 requêtes par tournoi)
  tournois: () => {
    const demandes = []

    for (const c of CIRCUITS) {
      for (const tournoi of tournoisProches(c)) {
        const base = `/tennis/v2/${c}/tournament`
        const dossier = `tournois/${c}-${tournoi.id}`

        demandes.push(
          { fichier: `${dossier}/infos.json`, chemin: `${base}/info/${tournoi.id}?include=rating,singlesPrize` },
          { fichier: `${dossier}/editions.json`, chemin: `${base}/seasons/${tournoi.id}` },
          { fichier: `${dossier}/anciens-vainqueurs.json`, chemin: `${base}/past-champions/${tournoi.id}` },
          { fichier: `${dossier}/resultats.json`, chemin: `${base}/results/${tournoi.id}` },
        )
      }
    }

    return demandes
  },

  // Résultats des N derniers tournois commencés (1 requête par tournoi).
  // Un tournoi en cours change chaque jour : ajouter --force pour le rafraîchir.
  resultats: () => {
    const demandes = []

    for (const c of CIRCUITS) {
      for (const tournoi of tournoisCommences(c)) {
        demandes.push({
          fichier: `tournois/${c}-${tournoi.id}/resultats.json`,
          chemin: `/tennis/v2/${c}/tournament/results/${tournoi.id}`,
        })
      }
    }

    return demandes
  },

  // Tableaux et têtes de série : l'API veut le NOM exact du tournoi (à tester d'abord)
  tableaux: () => {
    const demandes = []

    for (const c of CIRCUITS) {
      for (const tournoi of tournoisProches(c)) {
        const nom = encodeURIComponent(tournoi.name)
        const base = `/tennis/v2/tournament/${c}/${nom}/${ANNEE}`
        const dossier = `tournois/${c}-${tournoi.id}`

        demandes.push(
          { fichier: `${dossier}/tableau.json`, chemin: `${base}/draws` },
          { fichier: `${dossier}/tetes-de-serie.json`, chemin: `${base}/seeds` },
        )
      }
    }

    return demandes
  },
}

// Les tournois du calendrier, triés du plus proche au plus éloigné d'aujourd'hui
function tournoisProches(circuit) {
  const calendrier = lireDonnees(`calendrier-${circuit}.json`)
  if (!calendrier) return []

  const maintenant = Date.now()
  return [...calendrier]
    .sort((a, b) => Math.abs(new Date(a.date) - maintenant) - Math.abs(new Date(b.date) - maintenant))
    .slice(0, NOMBRE)
}

// Les N derniers tournois déjà commencés (en cours ou terminés), du plus récent au plus ancien
function tournoisCommences(circuit) {
  const calendrier = lireDonnees(`calendrier-${circuit}.json`)
  if (!calendrier) return []

  return calendrier
    .filter((tournoi) => tournoi.date.slice(0, 10) <= AUJOURDHUI)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, NOMBRE)
}

// ---------- 6. Appeler l'API ----------
async function appeler(chemin) {
  // On compte la requête AVANT de l'envoyer : même un échec consomme le quota.
  compteur.appels += 1
  enregistrerCompteur(compteur)

  const reponse = await fetch(`https://${HOTE}${chemin}`, {
    headers: {
      'X-RapidAPI-Key': CLE,
      'X-RapidAPI-Host': HOTE,
    },
  })

  if (reponse.status === 429) {
    compteur.appels = LIMITE_PAR_JOUR // on bloque le reste de la journée
    enregistrerCompteur(compteur)
    throw new ErreurQuota('Limite de requêtes atteinte (50 par jour). Réessaie demain.')
  }
  if (!reponse.ok) {
    throw new Error(`l'API a répondu ${reponse.status}`)
  }

  return reponse.json()
}

// ---------- 7. Appeler puis enregistrer dans un fichier ----------
async function recupererEtEnregistrer({ fichier: nomFichier, chemin }) {
  const fichier = `${DOSSIER}/${nomFichier}`
  mkdirSync(dirname(fichier), { recursive: true })

  const reponse = await appeler(chemin)

  if (reponse.hasNextPage) {
    console.warn(`  ! ${nomFichier} a une page suivante qu'on n'a pas récupérée`)
  }

  // Selon l'endpoint, "data" est une liste ou un objet (ex : une fiche joueur)
  const donnees = reponse.data ?? reponse
  const contenu = {
    recupereLe: new Date().toISOString(),
    donnees,
  }

  writeFileSync(fichier, JSON.stringify(contenu, null, 2))

  const taille = Array.isArray(donnees) ? `${donnees.length} éléments` : 'objet'
  console.log(`OK ${nomFichier} : ${taille}`)

  await pause(PAUSE_MS)
}

// ---------- 8. Programme principal ----------
async function principal() {
  const inconnus = groupesDemandes.filter((g) => g !== 'tous' && !GROUPES[g])
  if (inconnus.length > 0) {
    throw new Error(`Groupe inconnu : ${inconnus.join(', ')}. Groupes possibles : tous, ${Object.keys(GROUPES).join(', ')}`)
  }

  // "tous" = tous les groupes, dans l'ordre du catalogue
  const groupes = groupesDemandes.includes('tous') ? Object.keys(GROUPES) : groupesDemandes

  // On prépare la liste des demandes. Les groupes "joueurs" et "tournois"
  // lisent des fichiers créés par les groupes précédents : l'ordre compte.
  const demandes = []
  for (const groupe of groupes) {
    demandes.push(...GROUPES[groupe]())
  }

  const aFaire = demandes.filter((d) => forcer || !existsSync(`${DOSSIER}/${d.fichier}`))
  const dejaLa = demandes.length - aFaire.length

  console.log(`Quota du jour : ${compteur.appels}/${LIMITE_PAR_JOUR} utilisées, ${restant()} restantes`)
  console.log(`Groupes : ${groupes.join(', ')}`)
  console.log(`${aFaire.length} fichier(s) à récupérer, ${dejaLa} déjà présent(s)\n`)

  if (listerSeulement) {
    for (const d of aFaire) console.log(`  à faire : ${d.fichier}`)
    console.log('\n(--liste : aucune requête envoyée)')
    return
  }

  let reussis = 0
  let echecs = 0
  let ignores = 0

  for (const demande of aFaire) {
    if (restant() <= 0) {
      ignores = aFaire.length - reussis - echecs
      console.log(`\nQuota du jour atteint. ${ignores} fichier(s) restent à faire : relance la même commande demain.`)
      break
    }

    try {
      await recupererEtEnregistrer(demande)
      reussis += 1
    } catch (erreur) {
      if (erreur instanceof ErreurQuota) {
        console.error(`\n${erreur.message}`)
        break
      }
      // Une erreur sur un endpoint ne doit pas arrêter les autres
      echecs += 1
      console.error(`ERREUR ${demande.fichier} : ${erreur.message} (${demande.chemin})`)
      await pause(PAUSE_MS)
    }
  }

  console.log(`\nTerminé : ${reussis} réussi(s), ${echecs} erreur(s). Quota : ${compteur.appels}/${LIMITE_PAR_JOUR}.`)
}

principal().catch((erreur) => {
  console.error('Erreur :', erreur.message)
  process.exit(1)
})
