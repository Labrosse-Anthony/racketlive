// Préparation commune à tous les tests de composants
import '@testing-library/jest-dom/vitest'
import { afterEach, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// Après chaque test : on vide l'écran simulé et le stockage local
afterEach(() => {
  cleanup()
  localStorage.clear()
})

// jsdom ne connaît pas encore la balise <dialog> : on simule son ouverture/fermeture
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}

// jsdom ne connaît pas matchMedia (utilisé pour détecter le thème sombre) : on le simule
if (!window.matchMedia) {
  window.matchMedia = (requete) => ({
    matches: false,
    media: requete,
    addEventListener: () => {},
    removeEventListener: () => {},
  })
}
