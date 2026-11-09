import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle.js'
import './AProposPage.css'

// À modifier ici si besoin : le reste de la page se met à jour tout seul.
// Laisse EMAIL_CONTACT vide ('') tant que tu n'as pas d'adresse qui fonctionne.
const EMAIL_CONTACT = ''
const HEBERGEUR = 'Vercel Inc.'
const HEBERGEUR_ADRESSE = '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis'
const HEBERGEUR_SITE = 'https://vercel.com'

function MentionsLegalesPage() {
  usePageTitle('Mentions légales')

  return (
    <article className="a-propos">
      <h1>Mentions légales</h1>

      <section>
        <h2>Éditeur du site</h2>
        <p>
          RacketLive est un site personnel, non professionnel et sans but
          lucratif. Son éditeur a communiqué son identité à l'hébergeur,
          conformément à l'article 6 de la loi pour la confiance dans
          l'économie numérique (LCEN).
        </p>
        {EMAIL_CONTACT && (
          <p>
            Contact et signalement d'une erreur :{' '}
            <a href={`mailto:${EMAIL_CONTACT}`}>{EMAIL_CONTACT}</a>
          </p>
        )}
      </section>

      <section>
        <h2>Hébergeur</h2>
        <p>
          {HEBERGEUR}, {HEBERGEUR_ADRESSE}.{' '}
          <a href={HEBERGEUR_SITE} target="_blank" rel="noreferrer">
            {HEBERGEUR_SITE.replace('https://', '')}
          </a>
        </p>
      </section>

      <section>
        <h2>Données et propriété</h2>
        <p>
          Les classements, tournois et résultats proviennent de l'API Matchstat
          (Tennis API – ATP WTA ITF) et sont donnés à titre indicatif. Les noms
          de joueurs, de tournois et d'organisations appartiennent à leurs
          propriétaires respectifs. RacketLive n'est affilié ni à l'ATP, ni à la
          WTA.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Le site ne collecte aucune donnée personnelle et n'utilise aucun
          cookie de suivi ni publicité. Les favoris et le thème choisi sont
          enregistrés uniquement dans ton navigateur et ne quittent jamais ton
          appareil.
        </p>
      </section>

      <p>
        <Link to="/">Retour à l'accueil</Link>
      </p>
    </article>
  )
}

export default MentionsLegalesPage
