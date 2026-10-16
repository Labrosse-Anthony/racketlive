import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLastUpdate } from '../../services/api/rankingsApi.js'
import './Footer.css'

function formaterDateMiseAJour(texte) {
  return new Date(texte).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Footer() {
  const [miseAJour, setMiseAJour] = useState(null)

  useEffect(() => {
    getLastUpdate().then(setMiseAJour)
  }, [])

  return (
    <footer className="pied">
      <p>
        Données fournies par Matchstat (Tennis API – ATP WTA ITF).
        {miseAJour && ` Dernière mise à jour : ${formaterDateMiseAJour(miseAJour)}.`}
      </p>
      <p>
        <Link to="/a-propos">À propos et données</Link> · RacketLive n'est
        affilié ni à l'ATP ni à la WTA.
      </p>
    </footer>
  )
}

export default Footer
