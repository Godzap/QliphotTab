import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ redirectTo = '/auth', children }) {
  const location = useLocation()
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
        Validando sessao...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    )
  }

  return children ?? <Outlet />
}
