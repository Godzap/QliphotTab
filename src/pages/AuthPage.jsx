import { motion } from 'framer-motion'

const ACCESS_LEVELS = [
  'Funcionario',
  'Supervisor',
  'Analista de Informacoes',
  'Coordenacao de Controle',
]

export default function AuthPage() {
  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 flex flex-col border border-gold/35 overflow-hidden"
        style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
      >
        <div className="flex items-center justify-between bg-gold/8 border-b border-gold/25 px-5 py-2.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="page-title-badge text-xs" style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
              Autentificar-se
            </div>
            <span className="font-mono text-xs text-moonstone-dark/45">
              Portal generico de acesso interno
            </span>
          </div>
          <span className="font-mono text-xs text-gold/35">MODO OFFLINE</span>
        </div>

        <div className="flex-1 grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-b lg:border-b-0 lg:border-r border-gold/15 px-6 sm:px-8 py-7 space-y-6">
            <div className="space-y-3">
              <p className="font-mono text-xs text-gold/55 tracking-[0.28em] uppercase">
                Validacao de Credenciais
              </p>
              <h1 className="font-display text-3xl text-gold leading-tight">
                Acesso restrito aos sistemas internos da Corporacao
              </h1>
              <p className="text-sm text-moonstone-dark/70 leading-relaxed max-w-2xl">
                Utilize suas credenciais para liberar paineis, registros e modulos de consulta conforme o seu time,
                autorizacao e funcao atual. Esta tela ainda nao possui integracao real e serve como placeholder visual.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="font-mono text-xs text-moonstone-dark/55 uppercase tracking-wider">Identificador</span>
                <input
                  type="text"
                  placeholder="EX: EMP-0142"
                  className="w-full bg-navy-900/70 border border-gold/20 px-4 py-3 text-sm text-moonstone placeholder-moonstone-dark/35 focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="font-mono text-xs text-moonstone-dark/55 uppercase tracking-wider">Departamento</span>
                <select
                  className="w-full bg-navy-900/70 border border-gold/20 px-4 py-3 text-sm text-moonstone focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Selecionar</option>
                  <option>Informacao</option>
                  <option>Bem-Estar</option>
                  <option>Seguranca</option>
                  <option>Controle</option>
                  <option>Treinamento</option>
                </select>
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="font-mono text-xs text-moonstone-dark/55 uppercase tracking-wider">Chave de acesso</span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-navy-900/70 border border-gold/20 px-4 py-3 text-sm text-moonstone placeholder-moonstone-dark/35 focus:outline-none"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="px-5 py-2.5 bg-gold text-navy-950 font-mono text-xs tracking-[0.18em] uppercase">
                Entrar
              </button>
              <button type="button" className="px-5 py-2.5 border border-gold/25 text-gold/60 font-mono text-xs tracking-[0.18em] uppercase">
                Solicitar Acesso
              </button>
              <span className="font-mono text-xs text-moonstone-dark/45">
                Sem funcionamento no momento.
              </span>
            </div>
          </div>

          <div className="px-6 sm:px-7 py-7 bg-gold/4 space-y-5">
            <div className="border border-gold/15 bg-navy-900/50 p-5 space-y-3">
              <p className="section-label">Niveis de Permissao</p>
              <div className="grid gap-2">
                {ACCESS_LEVELS.map((level, index) => (
                  <div key={level} className="flex items-center justify-between border border-gold/10 px-3 py-2 text-sm">
                    <span className="text-moonstone">{level}</span>
                    <span className="font-mono text-xs text-gold/50">A0{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gold/15 bg-navy-900/50 p-5 space-y-3">
              <p className="section-label">Aviso Operacional</p>
              <p className="text-sm text-moonstone-dark/70 leading-relaxed">
                O fluxo de autenticacao definitivo sera conectado a um backend futuramente.
                Por enquanto, esta tela apresenta apenas a estrutura visual do acesso interno.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
