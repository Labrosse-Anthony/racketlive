import { drapeau } from '../../utils/flags.js'
import { Link } from 'react-router-dom'
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

function RankingsTable({ joueurs }) {
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
          {joueurs.map((joueur ) => (
            <tr key={joueur.id}>
              <td>{joueur.rang}</td>
              <td>
                <Evolution valeur={joueur.evolution} />
              </td>
              <td>
                <Link to={`/joueurs/${joueur.id}`} className="rankings-table__lien">
                  {joueur.nom}
                </Link>
              </td>
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