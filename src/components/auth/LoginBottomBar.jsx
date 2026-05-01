export default function LoginBottomBar({ buildVersion, accessCount }) {
  const items = [
    ['BUILD', buildVersion],
    ['ACESSOS HOJE', String(accessCount).padStart(3, '0')],
    ['MONITORAMENTO', 'ATIVO'],
    ['CRIPTOGRAFIA', 'AES-256'],
    ['REDE', 'INTRANET CORPORATIVA'],
  ]

  return (
    <footer className="dpl-bottombar">
      {items.map(([label, value]) => (
        <div key={label} className="dpl-bottombar-item">
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
      <div className="dpl-warning-inline">
        ACESSO NAO AUTORIZADO SERA REGISTRADO E REPORTADO
      </div>
    </footer>
  )
}
