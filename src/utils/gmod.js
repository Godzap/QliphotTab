const TABLET_DEVICE = 'telagodzap'
const TABLET_UI = 'tablet'
const DEFAULT_SIZE = 1024
const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])

function readSearch(search) {
  if (typeof search === 'string') return search
  if (typeof window === 'undefined') return ''
  return window.location.search ?? ''
}

function toNumber(value, fallback = DEFAULT_SIZE) {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function parseGmodQueryParams(search) {
  const params = new URLSearchParams(readSearch(search))

  return {
    gmodRaw: params.get('gmod'),
    gmod: TRUE_VALUES.has((params.get('gmod') ?? '').toLowerCase()),
    device: (params.get('device') ?? '').toLowerCase(),
    ui: (params.get('ui') ?? '').toLowerCase(),
    rtWidth: toNumber(params.get('rt_w')),
    rtHeight: toNumber(params.get('rt_h')),
    viewWidth: toNumber(params.get('view_w')),
    viewHeight: toNumber(params.get('view_h')),
    build: params.get('build') ?? '',
  }
}

export function isGmodTabletMode(search) {
  const parsed = parseGmodQueryParams(search)
  return parsed.gmod && parsed.device === TABLET_DEVICE
}

export function getGmodRenderHints(search) {
  const parsed = parseGmodQueryParams(search)
  const tabletMode = isGmodTabletMode(search)

  return {
    tabletMode,
    device: parsed.device || TABLET_DEVICE,
    ui: parsed.ui || TABLET_UI,
    build: parsed.build || 'default',
    rtWidth: parsed.rtWidth,
    rtHeight: parsed.rtHeight,
    viewWidth: parsed.viewWidth,
    viewHeight: parsed.viewHeight,
    isSquareTarget: parsed.rtWidth === parsed.rtHeight && parsed.viewWidth === parsed.viewHeight,
    renderTickMs: 30,
  }
}

