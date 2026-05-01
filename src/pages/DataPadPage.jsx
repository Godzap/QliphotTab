import { useState, useEffect } from 'react'
import { parseGmodQueryParams } from '../utils/gmod'
import './datapad.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DEPT_COLORS = {
  'Informação': '#7B5EA7',
  'Bem-Estar':  '#3A7FC1',
  'Segurança':  '#2F6B45',
  'Controle':   '#BFA35A',
}

const NAV_ITEMS = [
  { id: 'home',    label: 'Home',    icon: 'home'    },
  { id: 'anomaly', label: 'Anomalia',icon: 'anomaly' },
  { id: 'agents',  label: 'Agentes', icon: 'agents'  },
  { id: 'reports', label: 'Relatos', icon: 'reports' },
  { id: 'alerts',  label: 'Alertas', icon: 'alert'   },
  { id: 'dept',    label: 'Depto.',  icon: 'dept'    },
  { id: 'logs',    label: 'Logs',    icon: 'logs'    },
]

// Extrai o username do parâmetro ?device=telagodzap → "godzap"
function getUsername() {
  const { device } = parseGmodQueryParams()
  if (device && device.startsWith('tela') && device.length > 4) {
    return device.slice(4)
  }
  return 'godzap'
}

function useClock() {
  const fmt = () =>
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

// ── Ícones SVG ────────────────────────────────────────────────────────────────

const Icon = ({ name, size = 16 }) => {
  const s = { width: size, height: size, strokeWidth: 1.5, fill: 'none', stroke: 'currentColor' }
  const icons = {
    home:      <svg viewBox="0 0 24 24" style={s}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
    anomaly:   <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>,
    agents:    <svg viewBox="0 0 24 24" style={s}><circle cx="8" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M19 7v6M22 10h-6"/></svg>,
    approvals: <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 12l2 2 4-4"/></svg>,
    reports:   <svg viewBox="0 0 24 24" style={s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
    logs:      <svg viewBox="0 0 24 24" style={s}><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
    employees: <svg viewBox="0 0 24 24" style={s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    eval:      <svg viewBox="0 0 24 24" style={s}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    recontain: <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/><path d="M3 9h6M15 9h6M3 15h6M15 15h6M9 3v6M9 15v6M15 3v6M15 15v6"/></svg>,
    dept:      <svg viewBox="0 0 24 24" style={s}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    alert:     <svg viewBox="0 0 24 24" style={s}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    breach:    <svg viewBox="0 0 24 24" style={s}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  }
  return icons[name] ?? <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="9"/></svg>
}

// ── Estados de loading / erro ─────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="dp-root dp-state-center">
      <div className="dp-state-box">
        <div className="dp-state-dot dp-state-dot-pulse" />
        <span className="dp-state-text">Conectando ao terminal...</span>
      </div>
    </div>
  )
}

function ErrorState({ error, username }) {
  return (
    <div className="dp-root dp-state-center">
      <div className="dp-state-box dp-state-error">
        <span className="dp-state-label">FALHA DE CONEXÃO</span>
        <span className="dp-state-text">{error}</span>
        <span className="dp-state-sub">
          Terminal: {username} · {API_BASE}/api/home/{username}
        </span>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function DataPadPage() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [activeNav, setActiveNav] = useState('home')
  const time     = useClock()
  const username = getUsername()

  useEffect(() => {
    setLoading(true)
    setError(null)
    const requestHeaders = API_BASE.includes('ngrok-free.dev')
      ? { 'ngrok-skip-browser-warning': 'true' }
      : undefined

    fetch(`${API_BASE}/api/home/${username}`, {
      headers: requestHeaders,
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d  => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [username])

  const dept      = data?.agent?.department ?? 'Controle'
  const deptColor = DEPT_COLORS[dept] ?? '#BFA35A'

  // Seta --dept-color no root para o CSS funcionar
  useEffect(() => {
    document.documentElement.style.setProperty('--dept-color', deptColor)
    return () => document.documentElement.style.removeProperty('--dept-color')
  }, [deptColor])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState error={error} username={username} />

  const { agent, operationalStatus: ops, alerts, recentActivity, quickActions, modules } = data
  const critCount = alerts.filter(a => a.level === 'CRÍTICO').length

  // Nível de alerta dinâmico baseado em brechas abertas
  const alertLevelIndex = ops.openBreaches >= 4 ? 4
    : ops.openBreaches >= 2 ? 3
    : ops.openBreaches >= 1 ? 2
    : 0
  const alertLevelLabel = alertLevelIndex >= 4 ? 'CATÁSTROFE'
    : alertLevelIndex >= 3 ? 'CRÍTICO'
    : alertLevelIndex >= 2 ? 'ELEVADO'
    : alertLevelIndex >= 1 ? 'MODERADO'
    : 'NORMAL'
  const alertTagClass = alertLevelIndex >= 3 ? 'tag-critical'
    : alertLevelIndex >= 1 ? 'tag-caution'
    : 'tag-active'

  return (
    <div className="dp-root">

      {/* ── TOPBAR ─────────────────────────────────────────────── */}
      <div className="topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-main">DATA PAD</div>
          <div className="topbar-logo-sub">Lobotomy Corporation</div>
        </div>
        <div className="topbar-terminal">
          Terminal <span>TELA{agent.username.toUpperCase()}-R2</span>
        </div>
        <div className="topbar-status-group">
          <div className="topbar-badge badge-auth">Autenticado</div>
          <div className="topbar-badge badge-dept">{dept}</div>
          <div className="topbar-agent">
            <div className="topbar-agent-name">{agent.fullName}</div>
            <div className="topbar-agent-role">
              {agent.role} · NÍVEL {String(agent.accessLevel).padStart(2, '0')}
            </div>
          </div>
          <div className="topbar-time">{time}</div>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────────── */}
      <div className="body-layout">

        {/* LEFT NAV */}
        <nav className="nav-rail">
          {NAV_ITEMS.map((item, i) => (
            <span key={item.id}>
              {i === 1 && <div className="nav-divider" />}
              <div
                className={`nav-item${activeNav === item.id ? ' active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <div className="nav-icon" style={{ color: activeNav === item.id ? deptColor : '#A79B8B' }}>
                  <Icon name={item.icon} size={16} />
                </div>
                <div className="nav-label">{item.label}</div>
              </div>
            </span>
          ))}
        </nav>

        {/* MAIN */}
        <main className="main-content">

          {/* ROW 1: Identificação + Status + Alertas */}
          <div className="row" style={{ alignItems: 'stretch' }}>

            {/* Identificação */}
            <div className="card" style={{ width: '280px', flexShrink: 0 }}>
              <div className="card-header">
                <div className="card-title-accent">Identificação</div>
                <div className={`status-tag ${agent.alive ? 'tag-active' : 'tag-critical'}`}>
                  {agent.operationalStatus}
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div className="agent-avatar">{agent.fullName.slice(0, 2).toUpperCase()}</div>
                  <div className="agent-info">
                    <div className="agent-name">{agent.fullName}</div>
                    <div className="agent-codename">「{agent.codename}」</div>
                    <div style={{ marginTop: '4px' }}>
                      <span className="status-tag tag-neutral" style={{ fontSize: '7px' }}>
                        {agent.psychStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="agent-field">
                    <div className="agent-field-label">Cargo</div>
                    <div className="agent-field-value" style={{ fontSize: '10px' }}>{agent.role}</div>
                  </div>
                  <div className="agent-field">
                    <div className="agent-field-label">Departamento</div>
                    <div className="agent-field-value" style={{ fontSize: '10px', color: deptColor }}>
                      {agent.department}
                    </div>
                  </div>
                  <div className="agent-field">
                    <div className="agent-field-label">Código</div>
                    <div className="agent-field-value mono">{agent.employeeCode}</div>
                  </div>
                  <div className="agent-field">
                    <div className="agent-field-label">Confiança</div>
                    <div className="agent-field-value mono">{agent.trustLevel}</div>
                  </div>
                </div>
                <div style={{
                  marginTop: '10px', paddingTop: '8px',
                  borderTop: '1px solid #1D1915',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div className="agent-field-label">Nível de Acesso</div>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1,2,3,4,5].map(n => (
                      <div key={n} style={{
                        width: '20px', height: '6px',
                        background: n <= agent.accessLevel ? deptColor : '#1D1915',
                        border: `1px solid ${n <= agent.accessLevel ? deptColor : '#3A332C'}`,
                        opacity: n <= agent.accessLevel ? 1 : 0.5,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Operacional */}
            <div className="card" style={{ flex: 1 }}>
              <div className="card-header">
                <div className="card-title">Status Operacional</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#A79B8B', letterSpacing: '0.06em' }}>
                  FUNDAÇÃO
                </div>
              </div>
              <div className="card-body">
                <div className="ops-grid">
                  <div className="ops-item">
                    <div className="ops-label">Agentes ativos</div>
                    <div className="ops-value ok">{ops.activeEmployees}</div>
                  </div>
                  <div className="ops-item">
                    <div className="ops-label">Em observação</div>
                    <div className={`ops-value${ops.inObservation > 0 ? ' warn' : ''}`}>
                      {ops.inObservation}
                    </div>
                  </div>
                  <div className="ops-item">
                    <div className="ops-label">Anomalias catalogadas</div>
                    <div className="ops-value">{ops.catalogedAnomalies}</div>
                  </div>
                  <div className="ops-item">
                    <div className="ops-label">Brechas abertas</div>
                    <div className={`ops-value${ops.openBreaches > 0 ? ' crit' : ' ok'}`}>
                      {ops.openBreaches}
                    </div>
                  </div>
                  <div className="ops-item">
                    <div className="ops-label">Relatórios pendentes</div>
                    <div className={`ops-value${ops.pendingReports > 0 ? ' warn' : ''}`}>
                      {ops.pendingReports}
                    </div>
                  </div>
                  <div className="ops-item">
                    <div className="ops-label">Aprovações pendentes</div>
                    <div className={`ops-value${ops.pendingApprovals > 0 ? ' warn' : ''}`}>
                      {ops.pendingApprovals}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1D1915' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <div className="agent-field-label">Nível de Alerta da Fundação</div>
                    <div className={`status-tag ${alertTagClass}`} style={{ fontSize: '7px' }}>
                      {alertLevelLabel}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {['BAIXO','MODERADO','ELEVADO','CRÍTICO','CATÁSTROFE'].map((lv, i) => (
                      <div key={lv} style={{
                        flex: 1, height: '4px',
                        background: i <= alertLevelIndex
                          ? (i >= 3 ? '#B83232' : i === 2 ? '#BFA35A' : '#2F6B45')
                          : '#1D1915',
                        border: '1px solid #3A332C',
                        opacity: i <= alertLevelIndex ? 1 : 0.4,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Alertas */}
            <div className="card" style={{ width: '240px', flexShrink: 0 }}>
              <div className="card-header">
                <div className="card-title">Alertas Prioritários</div>
                {critCount > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '6px', height: '6px',
                      background: '#B83232', borderRadius: '50%',
                      animation: 'dp-pulse 1.5s ease-in-out infinite',
                    }} />
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#B83232' }}>
                      {critCount} CRÍTICO
                    </div>
                  </div>
                )}
              </div>
              <div className="card-body">
                <div className="activity-list">
                  {alerts.slice(0, 3).map((alert, i) => (
                    <div className="alert-item" key={i}>
                      <div className={`alert-badge ${alert.level === 'CRÍTICO' ? 'crit' : alert.level === 'ATENÇÃO' ? 'warn' : 'info'}`}>
                        {alert.level === 'CRÍTICO' ? 'CRIT' : alert.level === 'ATENÇÃO' ? 'ATÊN' : 'INFO'}
                      </div>
                      <div className="alert-text">
                        <div className="alert-title">{alert.title}</div>
                        <div className="alert-desc">{alert.description}</div>
                        <div className="alert-meta">{alert.timeLabel} · {alert.department}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ROW 2: Ações Rápidas */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Ações Rápidas</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#A79B8B' }}>
                {quickActions.length} disponíveis
              </div>
            </div>
            <div className="card-body">
              <div className="actions-grid">
                {quickActions.map((action, i) => (
                  <div className="action-btn" key={i}>
                    <div className="action-btn-label">{action.label}</div>
                    <div className="action-btn-desc">{action.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3: Módulos */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Módulos Disponíveis</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#A79B8B' }}>
                {modules.length} acessíveis
              </div>
            </div>
            <div className="card-body">
              <div className="modules-grid">
                {modules.map((mod, i) => (
                  <div className="module-tile" key={i}>
                    <div className="module-icon"><Icon name={mod.icon} size={18} /></div>
                    <div className="module-name">{mod.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 4: Atividade Recente */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Atividade Recente</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#A79B8B' }}>
                LOG DO SISTEMA
              </div>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {recentActivity.map((ev, i) => {
                  const deptColor = {
                    'Informação': '#7B5EA7',
                    'Bem-Estar':  '#3A7FC1',
                    'Segurança':  '#2F6B45',
                    'Controle':   '#BFA35A',
                  }[ev.department] ?? '#A79B8B'

                  const timeStr = ev.createdAt
                    ? new Date(ev.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    : '--:--'

                  return (
                    <div className="activity-item" key={i}>
                      <div className="activity-time">{timeStr}</div>
                      <div className="activity-dept" style={{ color: deptColor }}>{ev.department}</div>
                      <div className="activity-text">{ev.actionText}</div>
                      <div className="activity-entity">{ev.entityId ?? '—'}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
