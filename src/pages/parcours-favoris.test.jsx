import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { afficherApp } from '../test/rendu.jsx'

describe('Parcours favoris', () => {
  it('ajoute un joueur en favori puis le retire depuis la page Favoris', async () => {
    const user = userEvent.setup()
    afficherApp('/joueurs/47275')

    // 1. La fiche de Sinner s'affiche, le favori est désactivé
    const coeur = await screen.findByRole('button', { name: 'Favori : Jannik Sinner' })
    expect(coeur).toHaveAttribute('aria-pressed', 'false')

    // 2. On l'ajoute en favori
    await user.click(coeur)
    expect(coeur).toHaveAttribute('aria-pressed', 'true')

    // 3. On va sur la page Favoris avec la navigation
    await user.click(within(screen.getByRole('navigation', { name: 'Navigation principale' })).getByRole('link', { name: /Favoris/ }))
    expect(await screen.findByRole('heading', { name: 'Mes favoris', level: 1 })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Jannik Sinner/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Joueurs (1)' })).toBeInTheDocument()
  })

  it('affiche un message quand il n’y a aucun favori', async () => {
    afficherApp('/favoris')
    expect(await screen.findByRole('heading', { name: 'Aucun favori pour le moment' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voir les classements' })).toHaveAttribute('href', '/classements')
  })

  it('retrouve un favori déjà enregistré au chargement', async () => {
    localStorage.setItem('racketlive-favoris', JSON.stringify({ joueurs: [68074], tournois: [] }))
    afficherApp('/favoris')
    expect(await screen.findByRole('link', { name: /Carlos Alcaraz/ })).toBeInTheDocument()
  })

  it('n’a pas de problème d’accessibilité détectable sur la page Favoris', async () => {
    localStorage.setItem('racketlive-favoris', JSON.stringify({ joueurs: [47275], tournois: [] }))
    const { container } = afficherApp('/favoris')
    await screen.findByRole('link', { name: /Jannik Sinner/ })
    expect(await axe(container)).toHaveNoViolations()
  })
})
