import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import MonthCalendar from './MonthCalendar.jsx'
import FavoritesProvider from '../../context/FavoritesProvider.jsx'

const tournois = [
  { id: 1, nom: 'Open de Test', circuit: 'atp', categorie: '250', surface: 'dur', pays: 'FR', ville: 'Lyon', debut: '2026-11-02', fin: '2026-11-08' },
]

function afficher(onChangeMois = vi.fn()) {
  const rendu = render(
    <MemoryRouter>
      <FavoritesProvider>
        <MonthCalendar annee={2026} mois={10} tournois={tournois} onChangeMois={onChangeMois} />
      </FavoritesProvider>
    </MemoryRouter>,
  )
  return { ...rendu, onChangeMois }
}

describe('MonthCalendar au clavier', () => {
  it('se parcourt avec Tab et change de mois avec Entrée', async () => {
    const user = userEvent.setup()
    const { onChangeMois } = afficher()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Mois précédent' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onChangeMois).toHaveBeenCalledWith(-1)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Mois suivant' })).toHaveFocus()
    await user.keyboard(' ')
    expect(onChangeMois).toHaveBeenCalledWith(1)
  })

  it('change de mois avec Page précédente / Page suivante', async () => {
    const user = userEvent.setup()
    const { onChangeMois } = afficher()

    await user.tab()
    await user.keyboard('{PageDown}')
    expect(onChangeMois).toHaveBeenLastCalledWith(1)
    await user.keyboard('{PageUp}')
    expect(onChangeMois).toHaveBeenLastCalledWith(-1)
  })

  it('donne les tournois du mois en texte pour le lecteur d’écran', () => {
    afficher()
    expect(screen.getByRole('region', { name: 'Calendrier mensuel' })).toBeInTheDocument()
    expect(screen.getByText(/1 tournoi\(s\) en novembre/)).toBeInTheDocument()
    expect(screen.getByText('Open de Test')).toBeInTheDocument()
  })

  it('n’a pas de problème d’accessibilité détectable', async () => {
    const { container } = afficher()
    expect(await axe(container)).toHaveNoViolations()
  })
})
