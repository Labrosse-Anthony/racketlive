import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import FavoritesProvider from '../context/FavoritesProvider.jsx'

// Affiche toute l'application à une adresse donnée, comme dans le navigateur
export function afficherApp(chemin = '/') {
  return render(
    <MemoryRouter initialEntries={[chemin]}>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </MemoryRouter>,
  )
}
