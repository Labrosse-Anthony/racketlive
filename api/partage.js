// Fonction Vercel : renvoie la page du site avec les bonnes balises d'aperçu
// (titre, description, image) pour les liens /joueurs/:id et /tournois/:id.
// Les réseaux sociaux et messageries lisent ces balises, pas le JavaScript du site.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { injecterApercu, trouverFiche } from './_apercu.js'

function lireJson(nom) {
  return JSON.parse(readFileSync(join(process.cwd(), 'src/data', nom), 'utf-8'))
}

export default async function handler(req, res) {
  const { type, id } = req.query
  const origine = `https://${req.headers['x-forwarded-host'] || req.headers.host}`

  try {
    // On récupère la page normale du site (index.html)...
    const reponse = await fetch(`${origine}/index.html`)
    let html = await reponse.text()

    // ...et on lui ajoute l'aperçu si le joueur / tournoi existe
    const fiche = trouverFiche(type, id, {
      rankings: lireJson('rankings.json'),
      tournois: lireJson('tournaments.json'),
    })
    if (fiche) {
      const chemin = type === 'joueur' ? 'joueurs' : 'tournois'
      html = injecterApercu(html, {
        ...fiche,
        url: `${origine}/${chemin}/${id}`,
        image: `${origine}/apercu.png`,
      })
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).send(html)
  } catch {
    // En cas de souci, on renvoie vers la page d'accueil plutôt qu'une erreur
    res.redirect(302, '/')
  }
}
