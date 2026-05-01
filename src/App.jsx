import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import GlobalSearchModal from './components/GlobalSearchModal'
import HomePage from './pages/HomePage'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import AuthPage from './pages/AuthPage'
import DataPadPage from './pages/DataPadPage'
import LoadingScreen from './components/LoadingScreen'
import { ThemeProvider } from './context/ThemeContext'
import { isGmodTabletMode } from './utils/gmod'

const NAV_SHORTCUTS = { '1': '/', '2': '/abnormalities', '3': '/systems', '4': '/ordeals', '5': '/auth' }

function GlobalKeyHandler() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (!e.ctrlKey) return
      if (e.key === 'l') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('open-global-search'))
      } else if (NAV_SHORTCUTS[e.key]) {
        e.preventDefault()
        navigate(NAV_SHORTCUTS[e.key])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [location.pathname, navigate])

  return null
}

export default function App() {
  const tabletMode = isGmodTabletMode()
  const [loading, setLoading] = useState(!tabletMode)

  useEffect(() => {
    document.documentElement.classList.toggle('gmod-tablet-mode', tabletMode)
    document.body.classList.toggle('gmod-tablet-mode', tabletMode)

    return () => {
      document.documentElement.classList.remove('gmod-tablet-mode')
      document.body.classList.remove('gmod-tablet-mode')
    }
  }, [tabletMode])

  return (
    <ThemeProvider>
      {loading && !tabletMode && <LoadingScreen onComplete={() => setLoading(false)} />}
      <HashRouter>
        {!tabletMode && <GlobalKeyHandler />}
        {!tabletMode && <GlobalSearchModal />}
        <Routes>
          {tabletMode ? (
            <>
              <Route path="/tablet" element={<DataPadPage />} />
              <Route path="*" element={<Navigate to="/tablet" replace />} />
            </>
          ) : (
            <>
              <Route path="/tablet" element={<Navigate to="/" replace />} />
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/abnormalities" element={<ListPage category="abnormalities" />} />
                <Route path="/abnormalities/:id" element={<DetailPage category="abnormalities" />} />
                <Route path="/systems" element={<ListPage category="systems" />} />
                <Route path="/systems/:id" element={<DetailPage category="systems" />} />
                <Route path="/ordeals" element={<ListPage category="ordeals" />} />
                <Route path="/ordeals/:id" element={<DetailPage category="ordeals" />} />
                <Route path="/auth" element={<AuthPage />} />
              </Route>
            </>
          )}
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
