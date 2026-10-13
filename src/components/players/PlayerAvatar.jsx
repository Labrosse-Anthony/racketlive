import './PlayerAvatar.css'

function PlayerAvatar({ nom, photo }) {
  if (photo) {
    return <img className="avatar" src={photo} alt={`Photo de ${nom}`} />
  }

  const initiales = nom
    .split(' ')
    .map((mot) => mot[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="avatar" aria-hidden="true">
      {initiales}
    </div>
  )
}

export default PlayerAvatar