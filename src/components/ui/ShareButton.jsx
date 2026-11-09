import { useState } from 'react'
import './ShareButton.css'

// Bouton « Partager ». Sur mobile, il ouvre le menu de partage du téléphone
// (Web Share API). Sinon, il copie simplement le lien dans le presse-papiers.
function ShareButton({ titre, texte }) {
  const [message, setMessage] = useState('')

  async function partager() {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title: titre, text: texte, url })
      } catch {
        // L'utilisateur a fermé le menu de partage : ce n'est pas une erreur
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setMessage('Lien copié !')
    } catch {
      setMessage('Copie impossible : copie l’adresse dans la barre du navigateur.')
    }
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <span className="partage">
      <button type="button" className="partage__bouton" onClick={partager}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          width="18"
          height="18"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        Partager
      </button>
      {/* role="status" : le lecteur d'écran annonce « Lien copié ! » */}
      <span role="status" className="partage__message">
        {message}
      </span>
    </span>
  )
}

export default ShareButton
