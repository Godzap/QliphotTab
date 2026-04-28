import { getAll } from '../data'

const TABLET_SECTIONS = [
  {
    key: 'abnormalities',
    label: 'Anomalias',
    description: 'Entidades e artefatos anormais sob monitoramento.',
  },
  {
    key: 'systems',
    label: 'Sistemas',
    description: 'Protocolos internos e modulos operacionais ativos.',
  },
  {
    key: 'ordeals',
    label: 'Times',
    description: 'Equipes taticas e frentes acionadas na instalacao.',
  },
]

function EntryCountCard({ label, description, count }) {
  return (
    <article className="gmod-tablet-card">
      <p className="gmod-tablet-card-label">{label}</p>
      <p className="gmod-tablet-card-count">{String(count).padStart(2, '0')}</p>
      <p className="gmod-tablet-card-desc">{description}</p>
    </article>
  )
}

export default function TabletPage({ renderHints }) {
  const counts = {
    abnormalities: getAll('abnormalities').length,
    systems: getAll('systems').length,
    ordeals: getAll('ordeals').length,
  }

  return (
    <div className="gmod-tablet-shell">
      <div className="gmod-tablet-surface">
        <header className="gmod-tablet-header">
          <div>
            <p className="gmod-tablet-kicker">Garry's Mod // Tablet Render</p>
            <h1 className="gmod-tablet-title">QliphotTab</h1>
          </div>
          <p className="gmod-tablet-build">
            Build: {renderHints?.build || 'telagodzap-r2'}
          </p>
        </header>

        <section className="gmod-tablet-cards" aria-label="Resumo de registros">
          {TABLET_SECTIONS.map((section) => (
            <EntryCountCard
              key={section.key}
              label={section.label}
              description={section.description}
              count={counts[section.key]}
            />
          ))}
          <article className="gmod-tablet-card gmod-tablet-card-status">
            <p className="gmod-tablet-card-label">Status</p>
            <p className="gmod-tablet-status-line">Sinal estavel</p>
            <p className="gmod-tablet-card-desc">Interface dedicada para material de tela interna da SWEP.</p>
          </article>
        </section>

        <section className="gmod-tablet-hints" aria-label="Parametros de render">
          <h2>Render hints</h2>
          <dl>
            <div>
              <dt>device</dt>
              <dd>{renderHints?.device || 'telagodzap'}</dd>
            </div>
            <div>
              <dt>ui</dt>
              <dd>{renderHints?.ui || 'tablet'}</dd>
            </div>
            <div>
              <dt>RT</dt>
              <dd>{renderHints?.rtWidth} x {renderHints?.rtHeight}</dd>
            </div>
            <div>
              <dt>View</dt>
              <dd>{renderHints?.viewWidth} x {renderHints?.viewHeight}</dd>
            </div>
            <div>
              <dt>Tick</dt>
              <dd>~{renderHints?.renderTickMs}ms</dd>
            </div>
            <div>
              <dt>Square</dt>
              <dd>{renderHints?.isSquareTarget ? 'yes' : 'no'}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  )
}

