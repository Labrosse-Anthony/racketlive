import { drapeau } from '../../utils/flags.js'
import './RankingsTable.css'

function Evolution({ valeur }) {
  if (valeur > 0) {
    return <span className="evolution evolution--up">▲ {valeur}</span>
  }
  if (valeur < 0) {
    return <span className="evolution evolution--down">▼ {Math.abs(valeur)}</span>
  }
  return <span className="evolution evolution--same">–</span>
}

function RankingsTable({ joueurs, rangDepart = 1 }) {
  return (
    <div className="rankings-table__wrapper">
      <table className="rankings-table">
        <thead>
          <tr>
            <th scope="col">Rang</th>
            <th scope="col">Évol.</th>
            <th scope="col">Joueur</th>
            <th scope="col">Pays</th>
            <th scope="col" className="rankings-table__nombre">
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {joueurs.map((joueur, index) => (
            <tr key={joueur.id}>
              <td>{rangDepart + index}</td>
              <td>
                <Evolution valeur={joueur.evolution} />
              </td>
              <td>{joueur.nom}</td>
              <td>
                <span role="img" aria-label={joueur.pays}>
                  {drapeau(joueur.pays)}
                </span>
              </td>
              <td className="rankings-table__nombre">
                {joueur.points.toLocaleString('fr-FR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RankingsTable