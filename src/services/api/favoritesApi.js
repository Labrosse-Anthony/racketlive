const CLE_STOCKAGE = 'racketlive-favoris'

function favorisVides() {
  return { joueurs: [], tournois: [] }
}

function lire() {
  try {
    const texte = localStorage.getItem(CLE_STOCKAGE)
    if (texte === null) return favorisVides()

    const donnees = JSON.parse(texte)
    return {
      joueurs: Array.isArray(donnees.joueurs) ? donnees.joueurs : [],
      tournois: Array.isArray(donnees.tournois) ? donnees.tournois : [],
    }
  } catch {
    return favorisVides()
  }
}

function ecrire(favoris) {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(favoris))
  } catch {
    // Stockage plein ou indisponible : on ignore, l'appli continue de fonctionner
    return
  }
}

export async function getFavorites() {
  return lire()
}

export async function addFavorite(type, id) {
  const favoris = lire()
  if (!favoris[type].includes(id)) {
    favoris[type] = [...favoris[type], id]
    ecrire(favoris)
  }
  return favoris
}

export async function removeFavorite(type, id) {
  const favoris = lire()
  favoris[type] = favoris[type].filter((idFavori) => idFavori !== id)
  ecrire(favoris)
  return favoris
}