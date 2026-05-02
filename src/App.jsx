import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import GlobalSearchModal from './components/GlobalSearchModal'
import HomePage from './pages/HomePage'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import AuthPage from './pages/AuthPage'
import DataPadPage from './pages/DataPadPage'
import LoginPage from './pages/LoginPage'
import LoadingScreen from './components/LoadingScreen'
import TabletFrame from './components/TabletFrame'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import { isGmodTabletMode } from './utils/gmod'

const NAV_SHORTCUTS = {
  '1': '/',
  '2': '/abnormalities',
  '3': '/systems',
  '4': '/ordeals',
  '5': '/auth',
  '6': '/dashboard',
}

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

function TabletIndexRedirect() {
  const { isReady, isAuthenticated } = useAuth()

  if (!isReady) {
    return (
      <div style={{
        minHeight: '100%',
        display: 'grid',
        placeItems: 'center',
        background: '#0d0f12',
        color: '#d1d5db',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}>
        Inicializando sessao...
      </div>
    )
  }

  return <Navigate to={isAuthenticated ? '/tablet/home' : '/tablet/login'} replace />
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

  if (loading && !tabletMode) {
    return (
      <ThemeProvider>
        <AuthProvider>
          <TabletFrame>
            <LoadingScreen onComplete={() => setLoading(false)} />
          </TabletFrame>
        </AuthProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          {!tabletMode && <GlobalKeyHandler />}
          {!tabletMode && <GlobalSearchModal />}
          <Routes>
            {tabletMode ? (
              <Route element={<TabletFrame />}>
                <Route path="/tablet" element={<TabletIndexRedirect />} />
                <Route path="/tablet/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute redirectTo="/tablet/login" />}>
                  <Route path="/tablet/home" element={<DataPadPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/tablet" replace />} />
              </Route>
            ) : (
              <>
                <Route path="/tablet" element={<Navigate to="/dashboard" replace />} />
                <Route path="/tablet/login" element={<Navigate to="/dashboard" replace />} />
                <Route path="/tablet/home" element={<Navigate to="/dashboard" replace />} />
                <Route element={<TabletFrame><Layout /></TabletFrame>}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/abnormalities" element={<ListPage category="abnormalities" />} />
                  <Route path="/abnormalities/:id" element={<DetailPage category="abnormalities" />} />
                  <Route path="/systems" element={<ListPage category="systems" />} />
                  <Route path="/systems/:id" element={<DetailPage category="systems" />} />
                  <Route path="/ordeals" element={<ListPage category="ordeals" />} />
                  <Route path="/ordeals/:id" element={<DetailPage category="ordeals" />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute redirectTo="/auth"><DataPadPage /></ProtectedRoute>} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
