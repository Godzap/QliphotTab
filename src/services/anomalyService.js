import { requestJson } from './apiClient'

function asString(val, fb = '') {
  return typeof val === 'string' ? val : fb
}

function asNumber(val, fb = null) {
  const n = Number(val)
  return Number.isFinite(n) ? n : fb
}

function asArray(val) {
  return Array.isArray(val) ? val : []
}

function fmtRange(obj) {
  if (!obj || obj.min == null) return '—'
  return `${obj.min} – ${obj.max}`
}

export function adaptAnomaly(a) {
  const nivel = (a.level ?? '').toUpperCase()

  const wr = a.workResults ?? {}
  const workResult = {
    G: fmtRange(wr.good),
    N: fmtRange(wr.normal ?? wr.neutral),
    B: fmtRange(wr.bad),
  }

  const wp = a.workPreferences ?? {}
  const workPref = {}
  if (wp.instinct  !== undefined) workPref['Instinto']  = wp.instinct
  if (wp.insight   !== undefined) workPref['Insight']   = wp.insight
  if (wp.attachment !== undefined) workPref['Apego']     = wp.attachment
  if (wp.repression !== undefined) workPref['Repressão'] = wp.repression

  const res = a.resistances ?? { red: 'N/A', white: 'N/A', black: 'N/A', pale: 'N/A' }

  const ego = {
    weapon:       a.egoWeapon ?? null,
    armor:        a.egoSuit   ?? null,
    probability:  asNumber(a.egoProbability),
    weaponStatus: a.egoWeapon ? 'discovered' : 'undiscovered',
    armorStatus:  a.egoSuit   ? 'discovered' : 'undiscovered',
  }

  const mn = a.managerialNotes ?? null

  return {
    ...a,
    numero:      a.code ?? a.id,
    nivel,
    lastUpdated: a.updatedAt
      ? new Date(a.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      : '—',
    incomplete:   !a.hasManagerialNotes || !a.hasDefensiveNotes,
    restricted:   false,
    containment:  'Estável',
    equipe:       '—',
    accessLevel:  0,
    notes:        asString(a.notes),
    workData: {
      MaxEBox:    a.maxEnkephalinBoxes   ?? '—',
      UniqueEBox: a.uniqueEnkephalinBoxes ?? '—',
      MaxQliphot: a.qliphothMax           ?? '—',
      WorkDmg:    (a.workDamageMin != null && a.workDamageMax != null)
        ? `${a.workDamageMin} ~ ${a.workDamageMax}` : '—',
    },
    escapeData: {
      DmgMin: a.escapeDamageMin ?? '—',
      DmgMax: a.escapeDamageMax ?? '—',
      Speed:  a.escapeSpeed     ?? '—',
      Range:  a.escapeRange     ?? '—',
    },
    workResult,
    workPref,
    resistances: res,
    ego,
    revision: {
      lastAt:    a.updatedAt  ? new Date(a.updatedAt).toLocaleString('pt-BR')      : '—',
      createdAt: a.createdAt  ? new Date(a.createdAt).toLocaleDateString('pt-BR')  : '—',
      status: a.hasManagerialNotes ? 'Verificado' : 'Incompleto',
    },
    managerialNotes:    mn,
    historyRecordings:  asArray(a.historyRecordings),
  }
}

export async function patchAnomaly(id, data, token) {
  return requestJson(`/api/anomalies/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: data,
    token,
  })
}

export async function putAnomalyNotes(id, notes, token) {
  return requestJson(`/api/anomalies/${encodeURIComponent(id)}/notes`, {
    method: 'PUT',
    body: { notes },
    token,
  })
}
