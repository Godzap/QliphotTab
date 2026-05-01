const PHASE_STATUS = {
  idle: 'AGUARDANDO',
  input: 'IDENTIFICANDO',
  auth: 'VERIFICANDO',
  granted: 'AUTENTICADO',
  denied: 'ACESSO NEGADO',
}

export default function LoginTopBar({ phase, time, terminalId }) {
  return (
    <header className="dpl-topbar">
      <div className="dpl-topbar-stripes dpl-topbar-stripes-left" aria-hidden="true" />
      <div className="dpl-topbar-stripes dpl-topbar-stripes-right" aria-hidden="true" />

      <div className="dpl-brand">
        <span className="dpl-brand-main">DATA PAD</span>
        <span className="dpl-brand-sub">Lobotomy Corporation</span>
      </div>

      <div className="dpl-terminal-meta">
        TERMINAL <span>{terminalId}</span>
      </div>

      <div className="dpl-status-wrap">
        <div className="dpl-status-dot" />
        <span className="dpl-status-text">{PHASE_STATUS[phase] || 'SISTEMA'}</span>
      </div>

      <div className="dpl-clock">{time}</div>
    </header>
  )
}
