import { useEffect, useRef, useState } from 'react'

export function useChargement(charger, dependances = []) {
  const [resultat, setResultat] = useState(null)
  const [essai, setEssai] = useState(0)
  const cle = `${JSON.stringify(dependances)}-${essai}`
  const chargerRef = useRef(charger)
  useEffect(() => {
    chargerRef.current = charger
  })

  useEffect(() => {
    let annule = false

    chargerRef
      .current()
      .then((donnees) => {
        if (!annule) setResultat({ cle, donnees, erreur: null })
      })
      .catch((erreur) => {
        if (!annule) setResultat({ cle, donnees: null, erreur })
      })

    return () => {
      annule = true
    }
  }, [cle])

  const chargement = resultat === null || resultat.cle !== cle

  return {
    donnees: chargement ? null : resultat.donnees,
    erreur: chargement ? null : resultat.erreur,
    chargement,
    reessayer: () => setEssai((n) => n + 1),
  }
}
