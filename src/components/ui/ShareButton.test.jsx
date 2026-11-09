import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShareButton from './ShareButton.jsx'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ShareButton', () => {
  it('copie le lien et le dit quand le partage natif n’existe pas', async () => {
    const user = userEvent.setup()
    // userEvent installe un faux presse-papiers ; on s'assure que navigator.share n'existe pas
    vi.stubGlobal('navigator', { ...navigator, share: undefined, clipboard: navigator.clipboard })
    render(<ShareButton titre="Test" texte="Texte" />)

    await user.click(screen.getByRole('button', { name: 'Partager' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Lien copié !')
  })

  it('utilise le partage natif quand il existe', async () => {
    const user = userEvent.setup()
    const share = vi.fn().mockResolvedValue()
    vi.stubGlobal('navigator', { ...navigator, share })
    render(<ShareButton titre="Titre" texte="Texte" />)

    await user.click(screen.getByRole('button', { name: 'Partager' }))
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ title: 'Titre', text: 'Texte' }))
  })
})
