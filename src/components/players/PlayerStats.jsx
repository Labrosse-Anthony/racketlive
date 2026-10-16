import './PlayerStats.css'

function PlayerStats({ stats }) {
  const totalMatchs = stats.victoires + stats.defaites
  const pourcentage =
    totalMatchs === 0 ? 0 : Math.round((stats.victoires / totalMatchs) * 100)

  const lignes = [
    { label: 'Victoires (saison)', valeur: stats.victoires },
    { label: 'Défaites (saison)', valeur: stats.defaites },
    { label: '% de victoires', valeur: `${pourcentage} %` },
    { label: 'Titres (carrière)', valeur: stats.titresCarriere },
  ]

  return (
    <dl className="stats">
      {lignes.map((ligne) => (
        <div key={ligne.label} className="stats__bloc">
          <dt>{ligne.label}</dt>
          <dd>{ligne.valeur}</dd>
        </div>
      ))}
    </dl>
  )
}

export default PlayerStats
