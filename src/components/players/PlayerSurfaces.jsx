import { SURFACES } from '../../utils/labels.js'
import './PlayerTables.css'

// Victoires, défaites et pourcentage par surface
function PlayerSurfaces({ surfaces }) {
  return (
    <table className="tableau-joueur">
      <caption className="visuellement-cache">Bilan par surface</caption>
      <thead>
        <tr>
          <th scope="col">Surface</th>
          <th scope="col">Victoires</th>
          <th scope="col">Défaites</th>
          <th scope="col">% de victoires</th>
        </tr>
      </thead>
      <tbody>
        {surfaces.map((ligne) => {
          const total = ligne.victoires + ligne.defaites
          const pourcentage = total === 0 ? 0 : Math.round((ligne.victoires / total) * 100)

          return (
            <tr key={ligne.surface}>
              <th scope="row">{SURFACES[ligne.surface]}</th>
              <td>{ligne.victoires}</td>
              <td>{ligne.defaites}</td>
              <td className="tableau-joueur__fort">{pourcentage} %</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default PlayerSurfaces
