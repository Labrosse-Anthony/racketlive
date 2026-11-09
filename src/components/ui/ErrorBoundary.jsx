import { Component } from 'react'
import MessageErreur from './MessageErreur.jsx'

// Filet de sécurité : si une page plante (par exemple fichier de la page
// impossible à télécharger sans réseau), on affiche un message au lieu d'un écran vide.
// React impose une « classe » ici : il n'existe pas encore d'équivalent en fonction.
class ErrorBoundary extends Component {
  state = { erreur: null }

  // React appelle cette méthode quand un composant enfant plante
  static getDerivedStateFromError(erreur) {
    return { erreur }
  }

  render() {
    if (this.state.erreur) {
      return (
        <section>
          <h1>Une erreur est survenue</h1>
          <MessageErreur
            message="Cette page n'a pas pu s'afficher. Vérifie ta connexion puis recharge la page."
            onReessayer={() => window.location.reload()}
          />
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
