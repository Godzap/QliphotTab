import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import GlobalSearchModal from './components/GlobalSearchModal'
import HomePage from './pages/HomePage'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import AuthPage from './pages/AuthPage'
import LoadingScreen from './components/LoadingScreen'
import { ThemeProvider } from './context/ThemeContext'

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
  const [loading, setLoading] = useState(true)

  return (
    <ThemeProvider>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <HashRouter>
        <GlobalKeyHandler />
        <GlobalSearchModal />
        <Routes>
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
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
