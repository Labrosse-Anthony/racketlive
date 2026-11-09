import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const BRUT = 'src/data/api/photos' // photos téléchargées (non versionnées)
const SORTIE = 'public/photos' // photos réduites, envoyées avec le site
const TAILLE = 144 // l'avatar fait 72 px : on garde le double pour les écrans nets

mkdirSync(SORTIE, { recursive: true })

// 1) Réduire les nouvelles photos : carré de 144 px, centré sur le haut (le visage)
let converties = 0
if (existsSync(BRUT)) {
  // Un fichier vide = le joueur n'a pas de photo : on l'ignore
  const fichiers = readdirSync(BRUT).filter(
    (f) => f.endsWith('.jpg') && statSync(`${BRUT}/${f}`).size > 0,
  )
  for (const fichier of fichiers) {
    const sortie = `${SORTIE}/${fichier.replace('.jpg', '.webp')}`
    await sharp(`${BRUT}/${fichier}`)
      .resize(TAILLE, TAILLE, { fit: 'cover', position: 'top' })
      .webp({ quality: 80 })
      .toFile(sortie)
    converties += 1
  }
}

// 2) La liste des photos disponibles est établie d'après le dossier public/photos.
//    Ainsi elle reste juste même si les photos brutes ne sont pas là (ex : sur GitHub).
const photos = {}
for (const fichier of readdirSync(SORTIE).filter((f) => f.endsWith('.webp')).sort()) {
  photos[fichier.replace('.webp', '')] = `/photos/${fichier}`
}

writeFileSync('src/data/photos.json', JSON.stringify(photos, null, 2))
console.log(`OK : ${converties} photo(s) réduite(s), ${Object.keys(photos).length} au total`)
