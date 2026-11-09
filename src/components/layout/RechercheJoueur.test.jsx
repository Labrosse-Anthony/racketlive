import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RechercheJoueur from './RechercheJoueur.jsx'

describe('Recherche de joueur', () => {
  it('trouve un joueur sans tenir compte des accents', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <RechercheJoueur />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Rechercher un joueur' }))
    await user.type(screen.getByRole('searchbox', { name: 'Nom du joueur' }), 'sinn')

    const lien = await screen.findByRole('link', { name: /Jannik Sinner/ })
    expect(lien).toHaveAttribute('href', '/joueurs/47275')
  })
})
