import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import CalendrierPage from './pages/CalendrierPage.jsx'
import TournoiDetailPage from './pages/TournoiDetailPage.jsx'
import ClassementsPage from './pages/ClassementsPage.jsx'
import JoueurPage from './pages/JoueurPage.jsx'
import FavorisPage from './pages/FavorisPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/calendrier" replace />} />
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
