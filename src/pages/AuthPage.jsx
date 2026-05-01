import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import DataPadLoginExperience from '../components/auth/DataPadLoginExperience'

const TERMINAL_ID = 'WEB-QLIPHOTTAB'
const BUILD_VERSION = 'v4.7.1-web'

function getRedirectPath(stateFrom) {
  if (typeof stateFrom === 'string' && stateFrom.startsWith('/')) {
    return stateFrom
  }

  if (stateFrom && typeof stateFrom === 'object' && typeof stateFrom.pathname === 'string') {
    const path = `${stateFrom.pathname}${stateFrom.search ?? ''}${stateFrom.hash ?? ''}`
    if (path.startsWith('/')) return path
  }

  return '/dashboard'
}

export default function AuthPage() {
  const location = useLocation()
  const redirectPath = useMemo(() => getRedirectPath(location.state?.from), [location.state])

  return (
    <div className="dpl-web-shell">
      <DataPadLoginExperience
        terminalId={TERMINAL_ID}
        redirectPath={redirectPath}
        buildVersion={BUILD_VERSION}
        rootClassName="dpl-root dpl-root-web"
      />
    </div>
  )
}
