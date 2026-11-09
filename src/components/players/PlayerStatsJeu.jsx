import './PlayerStats.css'

// Affiche « 62,5 % » (virgule à la française), ou un tiret si la donnée manque
function formater(valeur) {
  if (valeur === null || valeur === undefined) return '–'
  return `${String(valeur).replace('.', ',')} %`
}

function Groupe({ titre, lignes }) {
  return (
    <>
      <h3>{titre}</h3>
      <dl className="stats stats--trois">
        {lignes.map((ligne) => (
          <div key={ligne.label} className="stats__bloc">
            <dt>{ligne.label}</dt>
            <dd>{formater(ligne.valeur)}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}

// Statistiques de carrière au service et au retour
function PlayerStatsJeu({ statsJeu }) {
  const { service, retour } = statsJeu

  return (
    <>
      <Groupe
        titre="Au service"
        lignes={[
          { label: 'Aces (par point de service)', valeur: service.aces },
          { label: 'Doubles fautes', valeur: service.doublesFautes },
          { label: 'Premières balles', valeur: service.premieresBalles },
          { label: 'Points gagnés sur 1re balle', valeur: service.pointsPremiere },
          { label: 'Points gagnés sur 2e balle', valeur: service.pointsSeconde },
          { label: 'Balles de break sauvées', valeur: service.breaksSauves },
        ]}
      />
      <Groupe
        titre="Au retour"
        lignes={[
          { label: 'Points gagnés sur 1re balle adverse', valeur: retour.pointsPremiere },
          { label: 'Points gagnés sur 2e balle adverse', valeur: retour.pointsSeconde },
          { label: 'Balles de break converties', valeur: retour.breaksConvertis },
        ]}
      />
    </>
  )
}

export default PlayerStatsJeu
