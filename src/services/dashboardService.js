import { requestJson } from './apiClient'

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function normalizeAgent(rawAgent) {
  const source = asObject(rawAgent)
  return {
    username: asString(source.username, ''),
    fullName: asString(source.fullName, 'Operador sem identificacao'),
    role: asString(source.role, 'Sem funcao'),
    accessLevel: asNumber(source.accessLevel, 0),
    department: asString(source.department, 'Controle'),
    employeeCode: asString(source.employeeCode, 'N/A'),
    trustLevel: asString(source.trustLevel, 'N/A'),
    codename: asString(source.codename, 'N/A'),
    psychStatus: asString(source.psychStatus, 'Indeterminado'),
    operationalStatus: asString(source.operationalStatus, 'Indeterminado'),
    alive: Boolean(source.alive),
  }
}

function normalizeOperationalStatus(rawStatus) {
  const source = asObject(rawStatus)
  return {
    activeEmployees: asNumber(source.activeEmployees, 0),
    inObservation: asNumber(source.inObservation, 0),
    catalogedAnomalies: asNumber(source.catalogedAnomalies, 0),
    openBreaches: asNumber(source.openBreaches, 0),
    pendingReports: asNumber(source.pendingReports, 0),
    pendingApprovals: asNumber(source.pendingApprovals, 0),
  }
}

function normalizeAlerts(rawAlerts) {
  return asArray(rawAlerts).map((entry) => {
    const source = asObject(entry)
    return {
      level: asString(source.level, 'INFO'),
      title: asString(source.title, 'Alerta sem titulo'),
      description: asString(source.description, 'Sem detalhes.'),
      timeLabel: asString(source.timeLabel, '--:--'),
      department: asString(source.department, 'Controle'),
    }
  })
}

function normalizeRecentActivity(rawActivity) {
  return asArray(rawActivity).map((entry) => {
    const source = asObject(entry)
    return {
      createdAt: source.createdAt ?? null,
      department: asString(source.department, 'Controle'),
      actionText: asString(source.actionText, 'Evento sem descricao'),
      entityId: source.entityId ?? null,
    }
  })
}

function normalizeQuickActions(rawActions) {
  return asArray(rawActions).map((entry) => {
    const source = asObject(entry)
    return {
      label: asString(source.label, 'Acao'),
      desc: asString(source.desc, 'Sem descricao'),
    }
  })
}

function normalizeModules(rawModules) {
  return asArray(rawModules).map((entry) => {
    const source = asObject(entry)
    return {
      icon: asString(source.icon, 'home'),
      name: asString(source.name, 'Modulo'),
    }
  })
}

export function normalizeDashboardPayload(rawPayload) {
  const payload = asObject(rawPayload)
  const requiredKeys = ['agent', 'operationalStatus', 'alerts', 'recentActivity', 'quickActions', 'modules']
  const missingKeys = requiredKeys.filter((key) => payload[key] === undefined || payload[key] === null)

  if (missingKeys.length > 0) {
    console.warn('[dashboard] payload missing expected keys; using fallback defaults', {
      missingKeys,
      payload,
    })
  }

  return {
    agent: normalizeAgent(payload.agent),
    operationalStatus: normalizeOperationalStatus(payload.operationalStatus),
    alerts: normalizeAlerts(payload.alerts),
    recentActivity: normalizeRecentActivity(payload.recentActivity),
    quickActions: normalizeQuickActions(payload.quickActions),
    modules: normalizeModules(payload.modules),
  }
}

export async function fetchDashboardData(username, token) {
  const payload = await requestJson(`/api/home/${encodeURIComponent(username)}`, {
    method: 'GET',
    token,
  })

  return normalizeDashboardPayload(payload)
}

export async function fetchAnomalies(token) {
  const payload = await requestJson('/api/anomalies', {
    method: 'GET',
    token,
  })

  return asArray(payload)
}
