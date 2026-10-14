import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

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
const ANNEE = new Date().getFullYear()
const PAUSE_MS = 400
const forcer = process.argv.includes('--force')

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------- 3. Appeler l'API ----------
async function appeler(chemin) {
  const reponse = await fetch(`https://${HOTE}${chemin}`, {
    headers: {
      'X-RapidAPI-Key': CLE,
      'X-RapidAPI-Host': HOTE,
    },
  })

  if (reponse.status === 429) {
    throw new Error('Limite de requêtes atteinte (50 par jour). Réessaie demain.')
  }
  if (!reponse.ok) {
    throw new Error(`L'API a répondu ${reponse.status} pour ${chemin}`)
  }

  return reponse.json()
}

// ---------- 4. Appeler puis enregistrer dans un fichier ----------
async function recupererEtEnregistrer(nomFichier, chemin) {
  const fichier = `${DOSSIER}/${nomFichier}`

  if (existsSync(fichier) && !forcer) {
    console.log(`${nomFichier} existe déjà (ajoute --force pour le refaire)`)
    return
  }

  const reponse = await appeler(chemin)

  if (reponse.hasNextPage) {
    console.warn(`Attention : ${nomFichier} a une page suivante qu'on n'a pas récupérée`)
  }

  const contenu = {
    recupereLe: new Date().toISOString(),
    donnees: reponse.data,
  }

  writeFileSync(fichier, JSON.stringify(contenu, null, 2))
  console.log(`OK ${nomFichier} : ${reponse.data.length} éléments`)

  await pause(PAUSE_MS)
}

// ---------- 5. Programme principal ----------
async function principal() {
  mkdirSync(DOSSIER, { recursive: true })

  for (const circuit of ['atp', 'wta']) {
    await recupererEtEnregistrer(
      `classement-${circuit}.json`,
      `/tennis/v2/${circuit}/ranking/singles?pageSize=100`,
    )

    await recupererEtEnregistrer(
      `calendrier-${circuit}.json`,
      `/tennis/v2/${circuit}/tournament/calendar/${ANNEE}?pageSize=100&filter=TourRank:2,3,4`,
    )
  }

  console.log('Terminé.')
}

principal().catch((erreur) => {
  console.error('Erreur :', erreur.message)
  process.exit(1)
})