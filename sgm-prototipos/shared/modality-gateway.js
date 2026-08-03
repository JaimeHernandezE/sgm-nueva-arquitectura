/**
 * Gateway de validación de modalidad V1–V8 (demo interactivo).
 * Misma lógica en SOLPED 1.1 (preview informativa) y etapa 2.1 (ratificación).
 */

export const UTM_VALUE_DEMO = 65084;
export const AGILE_LIMIT_UTM = 100;
export const COMPTROLLER_LIMIT_UTM = 8000;

export const GATEWAY_RULES = [
  { id: 'V1', label: 'Monto ≤ 100 UTM para Compra Ágil', severity: 'blocking' },
  { id: 'V2', label: 'Catálogo CM es primera opción sin justificación', severity: 'blocking' },
  { id: 'V3', label: 'Trato Directo requiere causal + Resolución Fundada', severity: 'blocking' },
  { id: 'V4', label: 'Monto &gt; 100 UTM sin CM aplicable → sugiere LP', severity: 'advisory' },
  { id: 'V5', label: 'TD &gt; 8.000 UTM → advierte Toma de Razón', severity: 'advisory' },
  {
    id: 'V6',
    label: 'Detección de posible fraccionamiento <em>(propuesta)</em>',
    severity: 'advisory',
    staticResult: 'Sin compras relacionadas detectadas (demo)',
  },
  { id: 'V7', label: 'LP: tramo de licitación + plazo mínimo de publicación', severity: 'advisory' },
  { id: 'V8', label: 'LP: garantías exigibles según monto', severity: 'advisory' },
];

const TONE_COLOR = {
  block: '#a33333',
  ok: '#2f6e2f',
  advisory: '#8c6d1f',
  na: '#999999',
};

/**
 * @param {{
 *   montoClp: number,
 *   modality: string,
 *   catalogCM?: boolean,
 *   tdCause?: string,
 *   cmJustification?: string,
 *   utmAvailable?: boolean,
 *   utmValue?: number,
 * }} input
 * @returns {{ montoUtm: number|null, blocked: boolean, results: Record<string, { text: string, tone: string }> }}
 */
export function evaluateModalityGateway(input) {
  const {
    montoClp = 0,
    modality = '',
    catalogCM = false,
    tdCause = '',
    cmJustification = '',
    utmAvailable = true,
    utmValue = UTM_VALUE_DEMO,
  } = input;

  const results = {};
  const set = (id, text, tone) => {
    results[id] = { text, tone };
  };

  GATEWAY_RULES.forEach((rule) => {
    if (rule.staticResult) set(rule.id, rule.staticResult, 'na');
    else set(rule.id, '—', 'na');
  });

  if (!modality) {
    return { montoUtm: null, blocked: false, results, idle: true };
  }

  if (!utmAvailable) {
    set('V1', 'UTM_VALUE_UNAVAILABLE', 'block');
    return { montoUtm: null, blocked: true, results, idle: false };
  }

  const montoUtm = (Number(montoClp) || 0) / utmValue;
  let blocked = false;

  if (modality === 'agile_purchase') {
    if (montoUtm <= AGILE_LIMIT_UTM) set('V1', 'OK', 'ok');
    else {
      set('V1', 'MODALITY_AMOUNT_EXCEEDED — Compra Ágil no seleccionable', 'block');
      blocked = true;
    }
  } else {
    set('V1', 'N/A', 'na');
  }

  if (catalogCM && modality !== 'framework_agreement') {
    if (String(cmJustification).trim()) set('V2', 'OK — con justificación de bypass', 'ok');
    else {
      set('V2', 'FRAMEWORK_AGREEMENT_FIRST_OPTION — falta justificación', 'block');
      blocked = true;
    }
  } else {
    set('V2', 'N/A', 'na');
  }

  if (modality === 'direct_procurement') {
    if (String(tdCause).trim()) set('V3', 'OK — causal registrada', 'ok');
    else {
      set('V3', 'DIRECT_PROCUREMENT_CAUSE_REQUIRED', 'block');
      blocked = true;
    }
  } else {
    set('V3', 'N/A', 'na');
  }

  if (modality !== 'public_tender' && !catalogCM && montoUtm > AGILE_LIMIT_UTM) {
    set('V4', 'PUBLIC_TENDER_SUGGESTED — informativo', 'advisory');
  } else {
    set('V4', 'N/A', 'na');
  }

  if (modality === 'direct_procurement' && montoUtm > COMPTROLLER_LIMIT_UTM) {
    set('V5', 'COMPTROLLER_REVIEW_REQUIRED — informativo', 'advisory');
  } else {
    set('V5', 'N/A', 'na');
  }

  if (modality === 'public_tender') {
    set('V7', 'TENDER_TIER_INFO — tramo y plazo mínimo informados', 'advisory');
    set('V8', 'TENDER_GUARANTEES_REQUIRED — garantías informadas', 'advisory');
    if (montoUtm <= AGILE_LIMIT_UTM) {
      set('V4', 'AGILE_PURCHASE_AVAILABLE — existe modalidad más expedita', 'advisory');
    }
  } else {
    set('V7', 'N/A', 'na');
    set('V8', 'N/A', 'na');
  }

  return { montoUtm, blocked, results, idle: false };
}

export function gatewayTableBodyHtml() {
  return GATEWAY_RULES.map((rule) => {
    const badge =
      rule.severity === 'blocking'
        ? '<span class="badge badge--blocking">Bloqueante</span>'
        : '<span class="badge badge--advisory">Advertencia</span>';
    const initial = rule.staticResult || '—';
    return `<tr data-rule="${rule.id}">
      <td>${rule.id}</td>
      <td>${rule.label}</td>
      <td class="gw-result">${initial}</td>
      <td>${badge}</td>
    </tr>`;
  }).join('');
}

/**
 * @param {HTMLElement|null} tbody
 * @param {Record<string, { text: string, tone: string }>} results
 */
export function applyGatewayResults(tbody, results) {
  if (!tbody || !results) return;
  Object.entries(results).forEach(([id, { text, tone }]) => {
    const cell = tbody.querySelector(`tr[data-rule="${id}"] .gw-result`);
    if (!cell) return;
    cell.textContent = text;
    cell.style.color = TONE_COLOR[tone] || TONE_COLOR.na;
    cell.style.fontWeight = tone === 'block' ? 'bold' : 'normal';
  });
}

/**
 * Cablea el gateway a controles del DOM.
 * @param {{
 *   getMontoClp: () => number,
 *   modalitySelect: HTMLSelectElement,
 *   catalogCheck?: HTMLInputElement|null,
 *   tdCause?: HTMLTextAreaElement|null,
 *   cmJustification?: HTMLTextAreaElement|null,
 *   tdCauseRow?: HTMLElement|null,
 *   cmJustificationRow?: HTMLElement|null,
 *   utmEquivEl?: HTMLElement|null,
 *   utmPanel?: HTMLElement|null,
 *   utmDownBanner?: HTMLElement|null,
 *   gatewayBody: HTMLElement,
 *   gatewaySection?: HTMLElement|null,
 *   confirmBtn?: HTMLButtonElement|null,
 *   simulateUtmDownBtn?: HTMLButtonElement|null,
 *   onRecompute?: (evalResult: ReturnType<typeof evaluateModalityGateway>) => void,
 *   hideWhenIdle?: boolean,
 * }} opts
 */
export function initModalityGateway(opts) {
  const {
    getMontoClp,
    modalitySelect,
    catalogCheck = null,
    tdCause = null,
    cmJustification = null,
    tdCauseRow = null,
    cmJustificationRow = null,
    utmEquivEl = null,
    utmPanel = null,
    utmDownBanner = null,
    gatewayBody,
    gatewaySection = null,
    confirmBtn = null,
    simulateUtmDownBtn = null,
    onRecompute = null,
    hideWhenIdle = false,
  } = opts;

  let utmAvailable = true;

  function recompute() {
    const modality = modalitySelect?.value || '';
    const catalogCM = !!catalogCheck?.checked;

    tdCauseRow?.classList.toggle('hidden', modality !== 'direct_procurement');
    cmJustificationRow?.classList.toggle(
      'hidden',
      !(catalogCM && modality && modality !== 'framework_agreement'),
    );

    if (gatewaySection && hideWhenIdle) {
      gatewaySection.hidden = !modality;
    }

    const evaluation = evaluateModalityGateway({
      montoClp: getMontoClp(),
      modality,
      catalogCM,
      tdCause: tdCause?.value || '',
      cmJustification: cmJustification?.value || '',
      utmAvailable,
    });

    if (utmEquivEl) {
      if (!modality) utmEquivEl.textContent = '—';
      else if (!utmAvailable) utmEquivEl.textContent = 'no disponible';
      else if (evaluation.montoUtm != null) utmEquivEl.textContent = `${evaluation.montoUtm.toFixed(2)} UTM`;
      else utmEquivEl.textContent = '—';
    }

    applyGatewayResults(gatewayBody, evaluation.results);

    if (confirmBtn) {
      confirmBtn.disabled = !modality || evaluation.blocked || !utmAvailable;
    }

    onRecompute?.(evaluation);
    return evaluation;
  }

  modalitySelect?.addEventListener('change', recompute);
  catalogCheck?.addEventListener('change', recompute);
  tdCause?.addEventListener('input', recompute);
  cmJustification?.addEventListener('input', recompute);

  simulateUtmDownBtn?.addEventListener('click', () => {
    utmAvailable = !utmAvailable;
    utmDownBanner?.classList.toggle('hidden', utmAvailable);
    utmPanel?.classList.toggle('hidden', !utmAvailable);
    simulateUtmDownBtn.textContent = utmAvailable
      ? 'Simular caída de UTM (demo)'
      : 'Restablecer UTM (demo)';
    recompute();
  });

  recompute();
  return { recompute, getUtmAvailable: () => utmAvailable };
}
