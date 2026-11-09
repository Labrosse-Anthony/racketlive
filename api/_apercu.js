// Fonctions « pures » (sans réseau) pour fabriquer l'aperçu d'un lien partagé.
import { CIRCUITS, CATEGORIES, PAYS } from '../src/utils/labels.js'
import { formaterPeriode } from '../src/utils/dates.js'

// Empêche un nom de casser le HTML (ex. un guillemet dans un attribut)
export function echapper(texte) {
  return String(texte)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Cherche le titre et la description à afficher pour un joueur ou un tournoi.
// `donnees` = { rankings, tournois }. Renvoie null si l'élément n'existe pas.
export function trouverFiche(type, id, donnees) {
  const numero = Number(id)

  if (type === 'joueur') {
    for (const circuit of ['atp', 'wta']) {
      const index = donnees.rankings[circuit].findIndex((j) => j.id === numero)
      if (index !== -1) {
        const joueur = donnees.rankings[circuit][index]
        return {
          titre: `${joueur.nom} · RacketLive`,
          description: `${joueur.nom} : n° ${index + 1} au classement ${CIRCUITS[circuit]} (${PAYS[joueur.pays]}). Fiche, statistiques et résultats.`,
        }
      }
    }
    return null
  }

  if (type === 'tournoi') {
    const t = donnees.tournois.find((x) => x.id === numero)
    if (!t) return null
    const categorie = CATEGORIES[t.categorie] ? ` ${CATEGORIES[t.categorie]}` : ''
    return {
      titre: `${t.nom} · RacketLive`,
      description: `${t.nom} (${CIRCUITS[t.circuit]}${categorie}) à ${t.ville}, ${formaterPeriode(t.debut, t.fin)}.`,
    }
  }

  return null
}

// Remplace les balises de partage de index.html par celles de la page demandée.
export function injecterApercu(html, { titre, description, url, image }) {
  const sansAncien = html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, '')
    .replace(/<meta\s+property="og:(title|description)"[\s\S]*?\/>/g, '')

  const balises = `
    <title>${echapper(titre)}</title>
    <meta name="description" content="${echapper(description)}" />
    <meta property="og:title" content="${echapper(titre)}" />
    <meta property="og:description" content="${echapper(description)}" />
    <meta property="og:url" content="${echapper(url)}" />
    <meta property="og:image" content="${echapper(image)}" />
    <meta name="twitter:card" content="summary_large_image" />`

  return sansAncien.replace('</head>', `${balises}\n  </head>`)
}
