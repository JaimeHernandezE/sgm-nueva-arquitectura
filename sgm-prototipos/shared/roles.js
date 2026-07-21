/**
 * Catálogo de roles de Adquisiciones (P-24) y estado de simulación de los prototipos.
 *
 * Fuente canónica de códigos: sgm-docs/arquitectura/especificacion/catalogo-roles.md §3.
 * La simulación viaja por query string (`rol`, `paso`) junto a `expediente`;
 * sin params, la vista se mantiene en su estado actual (sin simulación).
 */

export const ROLE_CATALOG = [
  { code: 'adq.solicitante', name: 'Solicitante' },
  { code: 'adq.aprobador_unidad', name: 'Aprobador de unidad' },
  { code: 'adq.formulador_presupuesto', name: 'Formulador DAF / verificación' },
  { code: 'adq.firmante_cdp', name: 'Firmante CDP' },
  { code: 'adq.gestor_compra', name: 'Gestor de compra' },
  { code: 'adq.aprobador_modalidad', name: 'Aprobador de modalidad' },
  { code: 'adq.recepcionista', name: 'Recepcionista' },
  { code: 'adq.confirmante_recepcion', name: 'Confirmante de recepción' },
  { code: 'adq.operador_pago', name: 'Operador de pago' },
  { code: 'adq.lector', name: 'Lector de expediente' },
];

/**
 * Mapeo del texto libre `responsible.role` de demo-data → códigos del catálogo.
 * 'N/A' (pasos automáticos / gestionados en MP) no habilita a ningún rol.
 */
export const ROLE_TEXT_TO_CODES = {
  'Solicitante': ['adq.solicitante'],
  'Aprobador de unidad': ['adq.aprobador_unidad'],
  'Formulador DAF / verificación': ['adq.formulador_presupuesto'],
  'Firmante CDP': ['adq.firmante_cdp'],
  'Gestor de compra': ['adq.gestor_compra'],
  'Aprobador de modalidad': ['adq.aprobador_modalidad'],
  'Gestor de compra / Aprobador de modalidad': ['adq.gestor_compra', 'adq.aprobador_modalidad'],
  'Recepcionista': ['adq.recepcionista'],
  'Confirmante de recepción': ['adq.confirmante_recepcion'],
  'Operador de pago': ['adq.operador_pago'],
  'N/A': [],
};

export function stepRoleCodes(step) {
  return ROLE_TEXT_TO_CODES[step?.responsible?.role] ?? [];
}

export function roleName(code) {
  return ROLE_CATALOG.find((r) => r.code === code)?.name || code;
}

export function getSimulationFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return { rol: params.get('rol') || null, paso: params.get('paso') || null };
}

export function setSimulationInUrl({ rol, paso }) {
  const url = new URL(window.location.href);
  if (rol) url.searchParams.set('rol', rol);
  else url.searchParams.delete('rol');
  if (paso) url.searchParams.set('paso', paso);
  else url.searchParams.delete('paso');
  history.replaceState(null, '', url);
}

/** Anexa los params de simulación vigentes a un href (absoluto o relativo). */
export function withSimulationParams(href, simulation = getSimulationFromUrl()) {
  if (!href || (!simulation.rol && !simulation.paso)) return href;
  const [path, query = ''] = href.split('?');
  const params = new URLSearchParams(query);
  if (simulation.rol) params.set('rol', simulation.rol);
  if (simulation.paso) params.set('paso', simulation.paso);
  return `${path}?${params.toString()}`;
}

/** Orden de sub-pasos "E.S" por [etapa, sub-paso] numéricos (3.10 > 3.9). */
export function compareStepIds(a, b) {
  const [aMaj, aMin = 0] = String(a).split('.').map(Number);
  const [bMaj, bMin = 0] = String(b).split('.').map(Number);
  return aMaj - bMaj || aMin - bMin;
}
