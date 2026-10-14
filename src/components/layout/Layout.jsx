import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import './Layout.css'

function Layout() {
  const { pathname } = useLocation()
  const contenuRef = useRef(null)
  const dernierChemin = useRef(pathname)

  useEffect(() => {
    if (dernierChemin.current === pathname) return
    dernierChemin.current = pathname

    window.scrollTo(0, 0)
    contenuRef.current?.focus()
  }, [pathname])

  return (
    <div className="layout">
      <a href="#contenu" className="lien-evitement">
        Aller au contenu
      </a>
      <Navbar />
      <main
        id="contenu"
        className="layout__content"
        tabIndex={-1}
        ref={contenuRef}
      >
        <Suspense fallback={<p>Chargement…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default Layout