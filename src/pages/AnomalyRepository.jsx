import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { adaptAnomaly, patchAnomaly, putAnomalyNotes } from '../services/anomalyService'

const RISK_COLORS = {
  ZAYIN: '#4caf6e', TETH: '#3a7bc8', HE: '#d4c840', WAW: '#9b6ecc', ALEPH: '#b83232',
}
const RISK_ORDER  = { ZAYIN: 1, TETH: 2, HE: 3, WAW: 4, ALEPH: 5 }
const RISK_LEVELS = ['ALEPH', 'WAW', 'HE', 'TETH', 'ZAYIN']

// ── Icons ──────────────────────────────────────────────────────────────────────
function Ico({ name, size = 14, style: s2 = {} }) {
  const s = { width: size, height: size, strokeWidth: 1.5, fill: 'none', stroke: 'currentColor', ...s2 }
  const icons = {
    anomaly:  <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>,
    search:   <svg viewBox="0 0 24 24" style={s}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    edit:     <svg viewBox="0 0 24 24" style={s}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    lock:     <svg viewBox="0 0 24 24" style={s}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    warn:     <svg viewBox="0 0 24 24" style={s}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    plus:     <svg viewBox="0 0 24 24" style={s}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x:        <svg viewBox="0 0 24 24" style={s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    save:     <svg viewBox="0 0 24 24" style={s}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    sword:    <svg viewBox="0 0 24 24" style={s}><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M2 2l5 5"/><path d="M20 16l2 2-4 4-2-2"/></svg>,
    shield:   <svg viewBox="0 0 24 24" style={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    info:     <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    incomplete:<svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
  }
  return icons[name] ?? <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="9"/></svg>
}

// ── Risk badge ─────────────────────────────────────────────────────────────────
function RiskBadge({ nivel, size = 'sm' }) {
  const color = RISK_COLORS[nivel] || '#5e5444'
  const sz = size === 'lg' ? { fontSize: 12, padding: '2px 9px' } : { fontSize: 9, padding: '1px 5px' }
  return <span className="risk-badge" style={{ color, borderColor: color, ...sz }}>{nivel}</span>
}

// ── Containment status ─────────────────────────────────────────────────────────
function ContainStatus({ status }) {
  const MAP = {
    'Estável':       { cls: 'contain-stable',  dot: '#4caf6e' },
    'Monitoramento': { cls: 'contain-watch',   dot: '#e8b700' },
    'Brecha':        { cls: 'contain-breach',  dot: '#b83232', pulse: true },
    'Desconhecido':  { cls: 'contain-unknown', dot: '#5e5444' },
  }
  const info = MAP[status] ?? MAP['Desconhecido']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div className={`containment-dot${info.pulse ? ' breach-pulse' : ''}`} style={{ background: info.dot }} />
      <span className={`ar-card-contain-label ${info.cls}`}>{status ?? 'Estável'}</span>
    </div>
  )
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, editMode, children, action }) {
  return (
    <div className={`section-block${editMode ? ' edit-mode' : ''}`}>
      <div className="section-head">
        {editMode && <div className="section-edit-dot" />}
        <div className="section-title">{title}</div>
        <div className="section-line" />
        {action}
      </div>
      <div className="section-body">{children}</div>
    </div>
  )
}

// ── Anomaly card (list item) ───────────────────────────────────────────────────
function AnomalyCard({ anom, selected, onClick }) {
  const riskColor = RISK_COLORS[anom.nivel] || '#5e5444'
  return (
    <div
      className={`anomaly-card${selected ? ' selected' : ''}`}
      style={{ '--card-risk-color': riskColor }}
      onClick={onClick}
    >
      <div className="ar-card-img-zone" style={{ borderRight: `1px solid ${selected ? riskColor : '#322c20'}`, transition: 'border-color 0.12s' }}>
        <div className="ar-card-img-placeholder" style={{ borderColor: selected ? `${riskColor}66` : '#322c20', transition: 'border-color 0.12s' }}>
          <Ico name="anomaly" size={14} style={{ stroke: selected ? riskColor : '#322c20' }} />
        </div>
      </div>
      <div className="ar-card-content">
        <div className="ar-card-number">{anom.numero}</div>
        <div className="ar-card-name">{anom.name}</div>
        <div className="ar-card-meta">
          <RiskBadge nivel={anom.nivel} />
          <ContainStatus status={anom.containment} />
        </div>
      </div>
      <div className="ar-card-right">
        <div className="ar-card-updated">{anom.lastUpdated}</div>
        <div className="ar-card-flag">
          {anom.restricted && <Ico name="lock" size={10} style={{ stroke: '#b83232' }} />}
          {anom.incomplete && !anom.restricted && <Ico name="incomplete" size={10} style={{ stroke: '#e8b700' }} />}
        </div>
      </div>
    </div>
  )
}

// ── Work preference display ────────────────────────────────────────────────────
function WorkPrefDisplay({ pref }) {
  const TYPE_COLORS = { 'Instinto': '#c0392b', 'Insight': '#b0b0b0', 'Apego': '#9b6ecc', 'Repressão': '#7dd4e0' }
  const PREF_COLORS = {
    'Muito Alto': '#1abc9c', 'Alto': '#4caf6e', 'Comum': '#d4c840',
    'Baixo': '#e07820', 'Muito Baixo': '#b83232',
  }

  const entries = Object.entries(pref)
  if (entries.length === 0) {
    return <div className="pref-empty">Não registrado.</div>
  }

  return (
    <div className="pref-simple-grid">
      {entries.map(([type, val]) => (
        <div className="pref-item" key={type}>
          <div className="pref-type" style={{ color: TYPE_COLORS[type] || '#f2ead8' }}>{type}</div>
          <div className="pref-value" style={{ color: PREF_COLORS[val] || '#8c7e68' }}>{val || '—'}</div>
        </div>
      ))}
    </div>
  )
}

// ── Resistance display (string values from DB) ─────────────────────────────────
function ResistanceDisplay({ res }) {
  const TYPES = [
    { key: 'red',   label: 'Vermelho', dotColor: '#b83232', textCls: 'res-red'   },
    { key: 'white', label: 'Branco',   dotColor: '#c8c8c8', textCls: 'res-white' },
    { key: 'black', label: 'Preto',    dotColor: '#5e5444', textCls: 'res-black' },
    { key: 'pale',  label: 'Pálido',   dotColor: '#8fbfcc', textCls: 'res-pale'  },
  ]
  const VAL_COLORS = {
    'Immune': '#1abc9c', 'Absorb': '#9b6ecc', 'Resistant': '#4caf6e',
    'Endured': '#3a7bc8', 'Normal': '#8c7e68', 'Weak': '#e07820',
    'Vulnerable': '#b83232', 'N/A': '#322c20',
  }

  return (
    <div className="resistance-grid">
      {TYPES.map(t => {
        const val = res[t.key] ?? 'N/A'
        const valColor = VAL_COLORS[val] ?? '#8c7e68'
        return (
          <div className="resistance-item" key={t.key}>
            <div className={`resistance-type ${t.textCls}`}>
              <div className="resistance-dot" style={{ background: t.dotColor }} />
              {t.label}
            </div>
            <div className="resistance-value" style={{ color: valColor }}>{val}</div>
          </div>
        )
      })}
    </div>
  )
}

// ── EGO display ───────────────────────────────────────────────────────────────
function EgoDisplay({ ego }) {
  const STATUS_MAP = {
    discovered:   { label: 'Descoberto',    cls: 'ego-discovered' },
    undiscovered: { label: 'Não Descoberto', cls: 'ego-undiscovered' },
    restricted:   { label: 'Restrito',      cls: 'ego-restricted' },
  }
  return (
    <div className="ego-grid">
      {[{ role: 'Arma E.G.O.',     name: ego.weapon, status: ego.weaponStatus, icon: 'sword' },
        { role: 'Armadura E.G.O.', name: ego.armor,  status: ego.armorStatus,  icon: 'shield' }]
        .map(item => {
          const st = STATUS_MAP[item.status] ?? STATUS_MAP.undiscovered
          return (
            <div className="ego-item" key={item.role}>
              <div className="ego-icon"><Ico name={item.icon} size={18} /></div>
              <div className="ego-info">
                <div className="ego-role">{item.role}</div>
                <div className="ego-name">{item.name || '—'}</div>
                <div className="ego-status">
                  <span className={`risk-badge ${st.cls}`} style={{ fontSize: 8, padding: '1px 5px', border: '1px solid currentColor', display: 'inline-block', marginTop: 3, letterSpacing: '0.1em' }}>
                    {st.label}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

// ── Anomaly detail view ────────────────────────────────────────────────────────
function AnomalyDetail({ anom, editMode, setEditMode, canEdit, onSave, saving, saveError }) {
  const [activeTab, setActiveTab] = useState('resumo')
  const [localNotes, setLocalNotes]       = useState(anom.notes || '')
  const [localGuidelines, setLocalGuidelines] = useState(() => anom.managerialNotes?.guidelines ?? [])

  const riskColor = RISK_COLORS[anom.nivel] || '#5e5444'

  useEffect(() => {
    setLocalNotes(anom.notes || '')
    setLocalGuidelines(anom.managerialNotes?.guidelines ?? [])
    setActiveTab('resumo')
  }, [anom.id])

  function handleCancel() {
    setLocalNotes(anom.notes || '')
    setLocalGuidelines(anom.managerialNotes?.guidelines ?? [])
    setEditMode(false)
  }

  function handleSaveClick() {
    onSave(anom.id, { notes: localNotes, guidelines: localGuidelines })
  }

  const TABS = [
    { id: 'resumo',      label: 'Resumo' },
    { id: 'trabalho',    label: 'Trabalho' },
    { id: 'fuga',        label: 'Fuga' },
    { id: 'resistencia', label: 'Resistências' },
    { id: 'ego',         label: 'E.G.O.' },
    { id: 'gravacoes',   label: 'Gravações', badge: anom.historyRecordings?.length },
    { id: 'revisao',     label: 'Revisão' },
  ]

  const mn = anom.managerialNotes
  const guidelines = editMode ? localGuidelines : (mn?.guidelines ?? [])

  return (
    <div className="detail-panel" style={{ '--detail-risk-color': riskColor }}>

      {/* DETAIL TOPBAR */}
      <div className="detail-topbar">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${riskColor}88 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div className="detail-breadcrumb">
          <span style={{ color: '#5e5444' }}>REPOSITÓRIO</span>
          <span style={{ color: '#322c20' }}>›</span>
          <span style={{ color: riskColor, opacity: 0.8 }}>{anom.numero}</span>
          <span style={{ color: '#322c20' }}>›</span>
          <span>{anom.name}</span>
        </div>
        {canEdit && !anom.restricted && (
          <button className={`detail-edit-btn${editMode ? ' active' : ''}`} onClick={() => setEditMode(!editMode)}>
            <Ico name="edit" size={11} />
            {editMode ? 'Editando' : 'Editar Ficha'}
          </button>
        )}
      </div>

      {/* EDIT MODE BANNER */}
      {editMode && (
        <div className="edit-mode-banner">
          <Ico name="edit" size={12} />
          <span className="edit-mode-banner-msg">Modo de edição ativo — Departamento de Informação</span>
          {saveError && <span className="edit-save-error">{saveError}</span>}
          <button className="edit-cancel-btn" onClick={handleCancel}>Cancelar</button>
          <button className="edit-save-btn" onClick={handleSaveClick} disabled={saving}>
            <Ico name="save" size={11} />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      )}

      {/* TAB BAR */}
      <div className="detail-tabs">
        {TABS.map(tab => (
          <div key={tab.id} className={`detail-tab${activeTab === tab.id ? ' active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
            {tab.badge > 0 && (
              <span style={{ fontFamily: 'Courier New, monospace', fontSize: 8, marginLeft: 4, padding: '1px 4px', border: '1px solid currentColor', opacity: 0.7 }}>
                {tab.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="detail-content">

        {/* IDENTITY HEADER — always visible */}
        <div className="identity-header">
          <div className="identity-risk-stripe" />
          <div className="identity-img-zone">
            <div className="identity-img-placeholder">
              <Ico name="anomaly" size={20} style={{ stroke: '#322c20' }} />
              <span>IMAGEM<br/>ANOMALIA</span>
            </div>
          </div>
          <div className="identity-corner tl" /><div className="identity-corner tr" />
          <div className="identity-corner bl" /><div className="identity-corner br" />
          <div className="identity-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="identity-number">{anom.numero}</div>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, #322c20, color-mix(in srgb, var(--dept-color) 30%, transparent))` }} />
              <ContainStatus status={anom.containment} />
            </div>
            <div className="identity-name">{anom.name}</div>
            <div className="identity-tags">
              <RiskBadge nivel={anom.nivel} size="lg" />
              {anom.restricted && (
                <span className="risk-badge" style={{ color: '#b83232', borderColor: '#b83232', fontSize: 10, padding: '2px 8px' }}>RESTRITO</span>
              )}
              {anom.incomplete && !anom.restricted && (
                <span className="risk-badge" style={{ color: '#e8b700', borderColor: '#e8b700', fontSize: 10, padding: '2px 8px' }}>DADOS INCOMPLETOS</span>
              )}
            </div>
            <div className="identity-fields">
              <div className="id-field">
                <div className="id-field-label">Equipe Atribuída</div>
                <div className="id-field-value dept-accent">{anom.equipe}</div>
              </div>
              <div className="id-field">
                <div className="id-field-label">Nível de Acesso</div>
                <div className="access-bar">
                  {[1,2,3,4,5].map(n => <div key={n} className={`access-pip${n <= anom.accessLevel ? ' filled' : ''}`} />)}
                </div>
              </div>
              <div className="id-field">
                <div className="id-field-label">Última Atualização</div>
                <div className="id-field-value mono">{anom.lastUpdated}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TAB: RESUMO ─────────────────────────────────────────── */}
        {activeTab === 'resumo' && !anom.restricted && (
          <>
            {/* Notas Gerenciais */}
            {anom.hasManagerialNotes && mn && guidelines.length > 0 && (
              <Section title="Notas Gerenciais" editMode={editMode}>
                <div className="tips-list">
                  {guidelines.map((g, i) => (
                    <div className={`tip-item${editMode ? ' edit-mode' : ''}`} key={i}>
                      <div className="tip-num">#{String(i + 1).padStart(2, '0')}</div>
                      {editMode ? (
                        <textarea
                          className="tip-text editable"
                          rows={2}
                          value={g}
                          onChange={e => {
                            const next = [...localGuidelines]
                            next[i] = e.target.value
                            setLocalGuidelines(next)
                          }}
                        />
                      ) : (
                        <div className="tip-text">{g}</div>
                      )}
                      {editMode && (
                        <button className="tip-delete" onClick={() => setLocalGuidelines(gs => gs.filter((_, j) => j !== i))}>
                          <Ico name="x" size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button className="tip-add-btn" onClick={() => setLocalGuidelines(gs => [...gs, 'Nova diretriz...'])}>
                      <Ico name="plus" size={11} />
                      Adicionar Diretriz
                    </button>
                  )}
                </div>
              </Section>
            )}

            {/* Availability flags */}
            <div className="avail-flags">
              {[{ flag: anom.hasManagerialNotes, label: 'Notas Gerenciais' },
                { flag: anom.hasDefensiveNotes,  label: 'Notas Defensivas' },
                { flag: anom.hasEmpiricalResearch, label: 'Pesquisa Empírica' }]
                .map(({ flag, label }) => (
                  <div key={label} className="avail-flag" style={{
                    borderColor: flag ? 'var(--dept-color)' : '#322c20',
                    color: flag ? 'var(--dept-color)' : '#3a332a',
                    background: flag ? 'color-mix(in srgb, var(--dept-color) 8%, transparent)' : 'transparent',
                  }}>
                    {flag ? '✓' : '○'} {label}
                  </div>
                ))}
            </div>

            {/* Notas Operacionais */}
            <Section
              title="Notas Operacionais"
              editMode={editMode}
              action={<div style={{ fontFamily: 'Courier New, monospace', fontSize: 9, color: '#5e5444' }}>{(localNotes || anom.notes || '').trim() ? '1 registro' : '0 registros'}</div>}
            >
              {editMode ? (
                <textarea
                  className="editable-textarea"
                  rows={4}
                  value={localNotes}
                  onChange={e => setLocalNotes(e.target.value)}
                  placeholder="Adicionar notas operacionais..."
                />
              ) : (
                <div style={{ fontFamily: "'Source Sans 3', 'Space Grotesk', sans-serif", fontSize: 13, color: anom.notes?.trim() ? '#f2ead8' : '#322c20', lineHeight: 1.5 }}>
                  {anom.notes?.trim() || 'Nenhuma nota registrada.'}
                </div>
              )}
            </Section>
          </>
        )}

        {/* ── TAB: TRABALHO ───────────────────────────────────────── */}
        {activeTab === 'trabalho' && !anom.restricted && (
          <>
            <Section title="Dados de Trabalho" editMode={editMode}>
              <div className="work-stats-grid">
                {[
                  { label: 'Max Enkephalin',   val: anom.workData.MaxEBox },
                  { label: 'Enkephalin Único',  val: anom.workData.UniqueEBox },
                  { label: 'Max Qliphoth',      val: anom.workData.MaxQliphot },
                  { label: 'Dano de Trabalho',  val: anom.workData.WorkDmg },
                ].map(f => (
                  <div className="work-stat" key={f.label}>
                    <div className="work-stat-label">{f.label}</div>
                    <div className="work-stat-value">{f.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 4, marginBottom: 6 }}>
                <div className="id-field-label" style={{ marginBottom: 6 }}>Resultados de Trabalho</div>
                <div className="work-results-row">
                  <div className="work-result result-good">
                    <div className="work-result-label">Bom</div>
                    <div className="work-result-range">{anom.workResult.G}</div>
                  </div>
                  <div className="work-result result-normal">
                    <div className="work-result-label">Normal</div>
                    <div className="work-result-range">{anom.workResult.N}</div>
                  </div>
                  <div className="work-result result-bad">
                    <div className="work-result-label">Ruim</div>
                    <div className="work-result-range">{anom.workResult.B}</div>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Preferências de Trabalho" editMode={false}>
              <WorkPrefDisplay pref={anom.workPref} />
            </Section>
          </>
        )}

        {/* ── TAB: FUGA ───────────────────────────────────────────── */}
        {activeTab === 'fuga' && !anom.restricted && (
          <Section title="Dados de Fuga" editMode={false}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { label: 'Dano Mín.',  val: anom.escapeData.DmgMin },
                { label: 'Dano Máx.',  val: anom.escapeData.DmgMax },
                { label: 'Velocidade', val: anom.escapeData.Speed },
                { label: 'Alcance',    val: anom.escapeData.Range },
              ].map(f => (
                <div className="work-stat" key={f.label}>
                  <div className="work-stat-label">{f.label}</div>
                  <div className="work-stat-value" style={{ fontSize: typeof f.val === 'string' && f.val.length > 4 ? 12 : 16 }}>{f.val}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── TAB: RESISTÊNCIAS ───────────────────────────────────── */}
        {activeTab === 'resistencia' && !anom.restricted && (
          <Section title="Dano & Resistências" editMode={false}>
            <div className="id-field-label" style={{ marginBottom: 8 }}>Valores de Resistência</div>
            <ResistanceDisplay res={anom.resistances} />
          </Section>
        )}

        {/* ── TAB: E.G.O. ─────────────────────────────────────────── */}
        {activeTab === 'ego' && !anom.restricted && (
          <>
            <Section title="Equipamentos E.G.O." editMode={false}>
              <EgoDisplay ego={anom.ego} />
            </Section>
            {anom.ego.probability != null && anom.ego.probability > 0 && (
              <Section title="Probabilidade de Drop" editMode={false}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontFamily: 'Courier New, monospace', fontSize: 28, fontWeight: 700, color: 'var(--dept-color)', lineHeight: 1 }}>
                    {(anom.ego.probability * 100).toFixed(0)}%
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 4, background: '#322c20', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min(anom.ego.probability * 100, 100)}%`, background: 'var(--dept-color)', opacity: 0.7 }} />
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, color: '#5e5444', marginTop: 4, letterSpacing: '0.1em' }}>PROBABILIDADE DE OBTENÇÃO DE E.G.O.</div>
                  </div>
                </div>
              </Section>
            )}
          </>
        )}

        {/* ── TAB: GRAVAÇÕES ──────────────────────────────────────── */}
        {activeTab === 'gravacoes' && !anom.restricted && (
          <Section title="Gravações Históricas" editMode={false}
            action={<div style={{ fontFamily: 'Courier New, monospace', fontSize: 9, color: '#5e5444' }}>{anom.historyRecordings.length} registros</div>}
          >
            {anom.historyRecordings.length === 0 ? (
              <div style={{ fontFamily: 'Courier New, monospace', fontSize: 10, color: '#322c20', padding: '6px 0' }}>Nenhuma gravação registrada.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {anom.historyRecordings.map((rec, i) => (
                  <div key={rec.id ?? i} style={{ background: '#0c0a07', border: '1px solid #322c20', padding: '8px 10px', display: 'flex', gap: 10, alignItems: 'flex-start', transition: 'border-color 0.12s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--dept-color)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#322c20' }}
                  >
                    <div style={{ fontFamily: 'Courier New, monospace', fontSize: 9, color: '#5e5444', flexShrink: 0, marginTop: 1, width: 24 }}>#{String(i + 1).padStart(2, '0')}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: '#eddcb8', letterSpacing: '0.04em', marginBottom: 3 }}>{rec.title}</div>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: '#8c7e68', lineHeight: 1.4 }}>{rec.summary}</div>
                    </div>
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                      <div style={{ fontFamily: 'Courier New, monospace', fontSize: 8, color: '#5e5444' }}>
                        {rec.date ? new Date(rec.date).toLocaleDateString('pt-BR') : '—'}
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, color: '#3a332a', letterSpacing: '0.06em' }}>{rec.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* ── TAB: REVISÃO ────────────────────────────────────────── */}
        {activeTab === 'revisao' && (
          <Section title="Histórico de Revisão" editMode={false}>
            <div className="revision-grid">
              <div className="rev-field">
                <div className="rev-field-label">Última Atualização</div>
                <div className="rev-field-value">{anom.revision.lastAt}</div>
              </div>
              <div className="rev-field">
                <div className="rev-field-label">Criado em</div>
                <div className="rev-field-value">{anom.revision.createdAt}</div>
              </div>
              <div className="rev-field">
                <div className="rev-field-label">Status</div>
                <div className="rev-field-value" style={{ color: anom.revision.status === 'Verificado' ? '#4caf6e' : '#e8b700' }}>
                  {anom.revision.status}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* RESTRICTED OVERLAY */}
        {anom.restricted && activeTab !== 'revisao' && (
          <div className="restricted-overlay" style={{ flex: 1, minHeight: 200 }}>
            <Ico name="lock" size={28} style={{ stroke: 'rgba(184,50,50,0.5)' }} />
            <div className="restricted-label">Acesso Restrito</div>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: 9, color: 'rgba(184,50,50,0.4)', letterSpacing: '0.1em' }}>
              NÍVEL DE ACESSO INSUFICIENTE — SOLICITE AUTORIZAÇÃO
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Detail empty state ─────────────────────────────────────────────────────────
function DetailEmpty() {
  return (
    <div className="detail-panel">
      <div className="detail-empty" style={{ flex: 1 }}>
        <svg className="detail-empty-icon" viewBox="0 0 48 48" fill="none" stroke="#322c20" strokeWidth="1">
          <circle cx="24" cy="24" r="8"/>
          <path d="M24 4v6M24 38v6M4 24h6M38 24h6M9 9l4.2 4.2M34.8 34.8l4.2 4.2M9 39l4.2-4.2M34.8 13.2l4.2-4.2"/>
        </svg>
        <div className="detail-empty-text">Selecione uma anomalia</div>
        <div style={{ fontFamily: 'Courier New, monospace', fontSize: 8, color: '#1c1812', letterSpacing: '0.08em' }}>
          REPOSITÓRIO · ARQUIVO INTERNO
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AnomalyRepository({ anomalies, loading, error, user, token }) {
  const adapted = useMemo(() => anomalies.map(adaptAnomaly), [anomalies])

  const [search,       setSearch]       = useState('')
  const [filterClass,  setFilterClass]  = useState('TODOS')
  const [filterTeam,   setFilterTeam]   = useState('TODOS')
  const [filterStatus, setFilterStatus] = useState('TODOS')
  const [sortBy,       setSortBy]       = useState('nivel')
  const [selectedId,   setSelectedId]   = useState(null)
  const [editMode,     setEditMode]     = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [saveError,    setSaveError]    = useState(null)

  const canEdit = useMemo(() => {
    if (!user) return false
    const dept = (user.department || '').toLowerCase()
    if (dept.includes('informa')) return true
    const perms = user.permissions || []
    return perms.includes('EDIT_ANOMALIES') || perms.includes('ANOMALY_EDITOR')
  }, [user])

  // Auto-select first anomaly
  useEffect(() => {
    if (adapted.length > 0 && !selectedId) setSelectedId(adapted[0].id)
  }, [adapted, selectedId])

  // Validate selectedId still exists
  useEffect(() => {
    if (adapted.length > 0 && selectedId && !adapted.find(a => a.id === selectedId)) {
      setSelectedId(adapted[0].id)
    }
  }, [adapted, selectedId])

  // Reset edit mode on selection change
  useEffect(() => { setEditMode(false); setSaveError(null) }, [selectedId])

  // Filter + sort
  const filtered = useMemo(() => {
    return adapted
      .filter(a => filterClass === 'TODOS' || a.nivel === filterClass)
      .filter(a => filterTeam === 'TODOS' || a.equipe === filterTeam)
      .filter(a => filterStatus === 'TODOS' || a.containment === filterStatus)
      .filter(a => {
        if (!search) return true
        const q = search.toLowerCase()
        return a.name.toLowerCase().includes(q) || (a.numero || '').toLowerCase().includes(q)
      })
      .sort((a, b) => {
        if (sortBy === 'nivel')     return (RISK_ORDER[b.nivel] || 0) - (RISK_ORDER[a.nivel] || 0)
        if (sortBy === 'nivel-asc') return (RISK_ORDER[a.nivel] || 0) - (RISK_ORDER[b.nivel] || 0)
        if (sortBy === 'nome')      return a.name.localeCompare(b.name)
        if (sortBy === 'codigo')    return (a.numero || '').localeCompare(b.numero || '')
        return 0
      })
  }, [adapted, filterClass, filterTeam, filterStatus, search, sortBy])

  const grouped = useMemo(() =>
    RISK_LEVELS
      .map(lv => ({ nivel: lv, items: filtered.filter(a => a.nivel === lv) }))
      .filter(g => g.items.length > 0),
    [filtered])

  const countByLevel = useCallback(lv => adapted.filter(a => a.nivel === lv).length, [adapted])
  const selectedAnom = adapted.find(a => a.id === selectedId) ?? null

  const teams    = useMemo(() => [...new Set(adapted.map(a => a.equipe).filter(Boolean))], [adapted])
  const statuses = useMemo(() => [...new Set(adapted.map(a => a.containment).filter(Boolean))], [adapted])

  async function handleSave(id, { notes, guidelines }) {
    setSaving(true)
    setSaveError(null)

    const errs = []

    try {
      await putAnomalyNotes(id, notes, token)
    } catch (e) {
      errs.push(`Notas: ${e.message}`)
    }

    try {
      const existingMn = selectedAnom?.managerialNotes ?? {}
      await patchAnomaly(id, { managerialNotes: { ...existingMn, guidelines } }, token)
    } catch (e) {
      if (e.status !== 404 && e.status !== 405 && e.status !== 0) {
        errs.push(`Gerenciais: ${e.message}`)
      }
    }

    setSaving(false)
    if (errs.length > 0) {
      setSaveError(errs.join(' | '))
    } else {
      setEditMode(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="split-layout" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="dp-state-box">
          <div className="dp-state-dot dp-state-dot-pulse" />
          <span className="dp-state-text">Carregando anomalias...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="split-layout" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="dp-state-box dp-state-error">
          <span className="dp-state-label">FALHA AO BUSCAR ANOMALIAS</span>
          <span className="dp-state-text">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="split-layout">

      {/* LEFT: LIST PANEL */}
      <div className="list-panel">

        {/* Search */}
        <div className="list-search-bar">
          <div className="search-input-wrap">
            <Ico name="search" size={13} style={{ stroke: '#5e5444' }} />
            <input
              className="search-input"
              placeholder="Buscar por nome ou código..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="search-count">{filtered.length}/{adapted.length}</div>
          </div>
        </div>

        {/* Classification tabs */}
        <div className="class-tabs">
          {['TODOS', 'ALEPH', 'WAW', 'HE', 'TETH', 'ZAYIN'].map(lv => {
            const color = lv === 'TODOS' ? 'var(--dept-color)' : (RISK_COLORS[lv] || '#5e5444')
            const count = lv === 'TODOS' ? adapted.length : countByLevel(lv)
            return (
              <div
                key={lv}
                className={`class-tab${filterClass === lv ? ' active' : ''}`}
                style={{ '--tab-color': color }}
                onClick={() => setFilterClass(lv)}
              >
                {lv}
                <span className="class-tab-count">{count}</span>
              </div>
            )
          })}
        </div>

        {/* Filter row */}
        <div className="filter-row">
          <select className="filter-select" value={filterTeam} onChange={e => setFilterTeam(e.target.value)}>
            <option value="TODOS">Todas equipes</option>
            {teams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="TODOS">Todos status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="filter-select" style={{ flex: '0 0 auto', width: 90 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="nivel">Risco ↓</option>
            <option value="nivel-asc">Risco ↑</option>
            <option value="nome">Nome</option>
            <option value="codigo">Código</option>
          </select>
        </div>

        {/* Anomaly list */}
        <div className="ar-anomaly-list">
          {filtered.length === 0 && (
            <div className="ar-no-result">NENHUM RESULTADO</div>
          )}
          {grouped.map(group => (
            <div key={group.nivel}>
              <div className="group-header">
                <div className="group-risk-badge" style={{ color: RISK_COLORS[group.nivel], borderColor: RISK_COLORS[group.nivel] }}>
                  {group.nivel}
                </div>
                <div className="group-line" style={{ background: `linear-gradient(90deg, ${RISK_COLORS[group.nivel]}44 0%, #322c20 80%)` }} />
                <div className="group-count">{group.items.length}</div>
              </div>
              {group.items.map(anom => (
                <AnomalyCard
                  key={anom.id}
                  anom={anom}
                  selected={selectedId === anom.id}
                  onClick={() => setSelectedId(anom.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: DETAIL PANEL */}
      {selectedAnom ? (
        <AnomalyDetail
          anom={selectedAnom}
          editMode={editMode}
          setEditMode={setEditMode}
          canEdit={canEdit}
          onSave={handleSave}
          saving={saving}
          saveError={saveError}
        />
      ) : (
        <DetailEmpty />
      )}

    </div>
  )
}
