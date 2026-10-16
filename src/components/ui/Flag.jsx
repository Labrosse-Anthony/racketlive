import 'flag-icons/css/flag-icons.min.css'
import { PAYS } from '../../utils/labels.js'
import './Flag.css'

// Drapeau en image (SVG) à partir du code pays à 2 lettres ("FR", "US"...).
// Le nom du pays est lu par les lecteurs d'écran.
function Flag({ code }) {
  if (!code) return null

  return (
    <span
      className={`fi fi-${code.toLowerCase()} drapeau`}
      role="img"
      aria-label={PAYS[code]}
    />
  )
}

export default Flag
