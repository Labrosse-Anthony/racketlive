import { useEffect } from 'react'

export function usePageTitle(titre) {
  useEffect(() => {
    document.title = titre ? `${titre} · RacketLive` : 'RacketLive'
  }, [titre])
}