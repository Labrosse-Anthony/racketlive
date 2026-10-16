import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle.js'
import './AProposPage.css'

function AProposPage() {
  usePageTitle('À propos et données')

  return (
    <article className="a-propos">
      <h1>À propos et données</h1>

      <section>
        <h2>RacketLive</h2>
        <p>
          RacketLive est un projet personnel : un site simple et rapide pour
          suivre le calendrier des tournois, les classements ATP et WTA et les
          fiches des meilleurs joueurs, sur mobile comme sur ordinateur.
        </p>
      </section>

      <section>
        <h2>Origine des données</h2>
        <p>
          Les classements, tournois, résultats et fiches joueurs viennent de
          l'API Matchstat (Tennis API – ATP WTA ITF). Ils sont récupérés de
          temps en temps puis enregistrés sur le site : la date de la dernière
          mise à jour figure en bas de chaque page. Ces informations sont
          données à titre indicatif et peuvent contenir des erreurs ou des
          retards.
        </p>
        <p>
          Les dates de fin des tournois sont estimées (une semaine, ou deux
          pour les Grands Chelems et les Masters 1000).
        </p>
      </section>

      <section>
        <h2>Indépendance</h2>
        <p>
          RacketLive n'est affilié ni à l'ATP, ni à la WTA, ni aux
          organisateurs des tournois. Les noms de tournois, de joueurs et
          d'organisations appartiennent à leurs propriétaires respectifs.
        </p>
      </section>

      <section>
        <h2>Vie privée</h2>
        <p>
          Le site n'utilise ni cookie publicitaire ni outil de suivi. Tes
          favoris et ton choix de thème (clair ou sombre) sont enregistrés
          uniquement dans ton navigateur : ils ne quittent jamais ton
          appareil.
        </p>
      </section>

      <p>
        <Link to="/">Retour à l'accueil</Link>
      </p>
    </article>
  )
}

export default AProposPage
