import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const CalendrierPage = lazy(() => import('./pages/CalendrierPage.jsx'))
const TournoiDetailPage = lazy(() => import('./pages/TournoiDetailPage.jsx'))
const ClassementsPage = lazy(() => import('./pages/ClassementsPage.jsx'))
const JoueurPage = lazy(() => import('./pages/JoueurPage.jsx'))
const FavorisPage = lazy(() => import('./pages/FavorisPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendrier" element={<CalendrierPage />} />
        <Route path="/tournois/:id" element={<TournoiDetailPage />} />
        <Route path="/classements" element={<ClassementsPage />} />
        <Route path="/joueurs/:id" element={<JoueurPage />} />
        <Route path="/favoris" element={<FavorisPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
