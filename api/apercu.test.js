import { describe, expect, it } from 'vitest'
import { echapper, injecterApercu, trouverFiche } from './_apercu.js'

const donnees = {
  rankings: {
    atp: [{ id: 24008, nom: 'Alexander Zverev', pays: 'DE', points: 1 }],
    wta: [{ id: 18455, nom: 'Aryna Sabalenka', pays: 'BY', points: 1 }],
  },
  tournois: [
    { id: 16702, nom: 'ASB Classic', circuit: 'wta', categorie: '250', ville: 'Auckland', debut: '2026-01-05', fin: '2026-01-11' },
  ],
}

describe('trouverFiche', () => {
  it('décrit un joueur avec son rang et son circuit', () => {
    const fiche = trouverFiche('joueur', '18455', donnees)
    expect(fiche.titre).toBe('Aryna Sabalenka · RacketLive')
    expect(fiche.description).toContain('n° 1 au classement WTA')
  })

  it('décrit un tournoi', () => {
    const fiche = trouverFiche('tournoi', '16702', donnees)
    expect(fiche.description).toContain('Auckland')
  })

  it('renvoie null pour un élément inconnu', () => {
    expect(trouverFiche('joueur', '1', donnees)).toBeNull()
    expect(trouverFiche('autre', '1', donnees)).toBeNull()
  })
})

describe('injecterApercu', () => {
  const page = `<head><title>RacketLive</title>
    <meta name="description" content="ancien" />
    <meta property="og:title" content="RacketLive" />
    <meta property="og:description" content="ancien" /></head>`

  it('remplace les anciennes balises par celles de la page', () => {
    const html = injecterApercu(page, { titre: 'Test', description: 'Desc', url: 'https://x.fr/a', image: 'https://x.fr/i.png' })
    expect(html.match(/<title>/g)).toHaveLength(1)
    expect(html).toContain('<title>Test</title>')
    expect(html).not.toContain('ancien')
    expect(html).toContain('og:image" content="https://x.fr/i.png"')
  })

  it('échappe les caractères dangereux', () => {
    expect(echapper('a"<b>&')).toBe('a&quot;&lt;b&gt;&amp;')
  })
})
