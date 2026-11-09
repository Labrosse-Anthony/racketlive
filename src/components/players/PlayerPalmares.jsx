import './PlayerTables.css'

// Titres gagnés et finales perdues, niveau par niveau
function PlayerPalmares({ palmares }) {
  return (
    <table className="tableau-joueur">
      <caption className="visuellement-cache">Titres et finales par niveau de tournoi</caption>
      <thead>
        <tr>
          <th scope="col">Niveau</th>
          <th scope="col">Titres</th>
          <th scope="col">Finales perdues</th>
        </tr>
      </thead>
      <tbody>
        {palmares.map((ligne) => (
          <tr key={ligne.niveau}>
            <th scope="row">{ligne.niveau}</th>
            <td className="tableau-joueur__fort">{ligne.titres}</td>
            <td>{ligne.finalesPerdues}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PlayerPalmares
