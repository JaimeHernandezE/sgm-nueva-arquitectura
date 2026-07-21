import { getExpedienteIdFromUrl } from './expedientes-demo.js';
import { getExpedienteUrl } from './form-shell.js';
import { getFormPreset } from './form-presets.js';

export function getExpedienteIdForForm() {
  return getExpedienteIdFromUrl();
}

export function getPreset() {
  return getFormPreset(getExpedienteIdFromUrl());
}

function setText(el, value) {
  if (el && value != null) el.textContent = value;
}

function setValue(el, value) {
  if (el && value != null) el.value = value;
}

function setSelect(el, value) {
  if (!el || value == null) return;
  el.value = value;
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function setCheckbox(el, checked) {
  if (!el) return;
  el.checked = !!checked;
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function setInnerHtml(el, html) {
  if (el && html != null) el.innerHTML = html;
}

export function applySolpedPreset() {
  const preset = getPreset();
  const s = preset.solped;
  const header = document.querySelector('.form-card__header > span:first-child');
  setText(header, `SOLPED #${preset.solpedNumber} — Nueva solicitud`);

  const unitSelect = document.querySelector('.form-card__body .form-row select');
  if (unitSelect && s.unit) {
    [...unitSelect.options].forEach((opt) => {
      if (opt.textContent.includes(s.unit) || s.unit.includes(opt.textContent)) {
        unitSelect.value = opt.value || opt.textContent;
      }
    });
    if (!unitSelect.value && unitSelect.options.length) {
      const match = [...unitSelect.options].find((o) => o.textContent === s.unit);
      if (match) unitSelect.value = match.value;
    }
  }

  const textInputs = document.querySelectorAll('.form-card__body input[type="text"]');
  if (textInputs[0]) setValue(textInputs[0], s.description);
  const textarea = document.querySelector('.form-card__body textarea');
  if (textarea) setValue(textarea, s.justification);
  const dateInput = document.querySelector('.form-card__body input[type="date"]');
  if (dateInput) setValue(dateInput, s.date);
  setSelect(document.getElementById('purchase-modality'), s.purchaseModality);

  const lineTable = document.getElementById('solped-lines');
  const lineInputs = lineTable
    ? lineTable.querySelectorAll('tbody input')
    : document.querySelectorAll('.form-table tbody input');
  if (lineInputs[0]) setValue(lineInputs[0], s.lineDescription);
  if (lineInputs[1]) setValue(lineInputs[1], s.lineQty);
  if (lineInputs[2]) setValue(lineInputs[2], s.linePrice);
  lineTable?.dispatchEvent(new Event('solped-lines:recalc', { bubbles: true }));

  const resolutionRow = document.getElementById('resolution-row');
  if (resolutionRow) {
    resolutionRow.classList.toggle('hidden', !s.showResolution);
  }
}

export function applyModalidadPreset() {
  const preset = getPreset();
  const m = preset.modalidad;
  const header = document.querySelector('.form-card__header > span:first-child');
  setText(header, `SOLPED #${preset.solpedNumber} — Ratificación de modalidad`);

  const solpedPanel = document.querySelector('.form-card__body .info-panel');
  if (solpedPanel) {
    setInnerHtml(
      solpedPanel,
      `<strong>Datos SOLPED — solo lectura</strong><br />
      Unidad: ${m.unit} · Modalidad indicada en 1.1: <strong>${m.modalityLabel}</strong>`,
    );
  }

  setValue(document.getElementById('monto-input'), m.monto);
  setSelect(document.getElementById('modality-select'), m.modality);
  setCheckbox(document.getElementById('catalog-cm-check'), m.catalogCm);
  setCheckbox(document.getElementById('jefatura-approval-check'), m.jefaturaApproval);

  if (m.tdCause) {
    const tdCause = document.getElementById('td-cause');
    if (tdCause) setValue(tdCause, m.tdCause);
  }
}

export function applyVinculacionMpPreset() {
  const preset = getPreset();
  const v = preset.vinculacionMp;
  const header = document.querySelector('.form-card__header > span:first-child');
  setText(header, `SOLPED #${preset.solpedNumber} — Vinculación con Mercado Público`);

  const solpedPanel = document.querySelector('.form-card__body .info-panel');
  if (solpedPanel) {
    setInnerHtml(
      solpedPanel,
      `<strong>Decisión de modalidad — solo lectura</strong><br />
      Modalidad confirmada: <strong>${v.modalityLabel}</strong> · Gateway V1–V8: OK`,
    );
  }

  const deepLinkBtn = document.getElementById('deep-link-btn');
  if (deepLinkBtn) setText(deepLinkBtn, v.deepLinkLabel);

  const mpLabel = document.querySelector('label[for="mp-code"]') || document.querySelector('.form-row label');
  const mpCodeInput = document.getElementById('mp-code');
  if (mpCodeInput) setValue(mpCodeInput, v.mpCode);

  const statusHint = document.getElementById('mp-status-hint');
  if (statusHint) setText(statusHint, v.statusLine);
}

export function applyRecepcionPreset() {
  const preset = getPreset();
  const r = preset.recepcion;
  const header = document.querySelector('.form-card__header > span:first-child');
  setText(header, r.ocHeader);

  const ocPanel = document.querySelector('.form-card__body .info-panel');
  if (ocPanel) {
    setInnerHtml(ocPanel, `<strong>OC — solo lectura</strong><br />${r.ocInfo}`);
  }

  const readonlyRow = document.querySelector('.form-row--readonly');
  if (readonlyRow) {
    readonlyRow.innerHTML = `<label>Recibido por</label>${r.receiver}`;
  }

  const lineCells = document.querySelectorAll('.form-table tbody td');
  if (lineCells[0]) setText(lineCells[0], r.lineItem);
  if (lineCells[1]) setText(lineCells[1], r.ocQty);
}

export function applyPagoPreset() {
  const preset = getPreset();
  const p = preset.pago;
  const header = document.querySelector('.form-card__header > span:first-child');
  setText(header, p.ocHeader);

  const panels = document.querySelectorAll('.form-card__body .form-panel, .form-card__body .info-panel');
  if (panels[0]) {
    setInnerHtml(
      panels[0],
      `<strong>Fuente 1: Orden de Compra (MP)</strong><br />
      Monto OC: ${p.ocAmount} · Sincronizado ${p.ocSyncDate}`,
    );
  }
  if (panels[1]) {
    setInnerHtml(
      panels[1],
      `<strong>Fuente 2: Recepción conforme (SGM)</strong><br />${p.recepcionInfo}`,
    );
  }

  const invoiceResult = document.getElementById('invoice-result');
  if (invoiceResult) {
    invoiceResult.textContent = `Monto factura: ${p.invoiceAmount}`;
  }
}

const MODALITY_LABELS = {
  agile_purchase: 'Compra Ágil',
  framework_agreement: 'Convenio Marco',
  public_tender: 'Licitación Pública',
  direct_procurement: 'Trato Directo',
};

export function applyGenericSolpedHeader() {
  const preset = getPreset();
  const header = document.querySelector('.form-card__header > span:first-child');
  if (header && !header.id) {
    const current = header.textContent;
    if (current.startsWith('SOLPED')) {
      setText(header, current.replace(/#\d+/, `#${preset.solpedNumber}`));
    }
  }
  const montoInput = document.querySelector('.form-card__body input[type="text"][value]');
  if (montoInput && preset.solped.estimatedAmount) {
    setValue(montoInput, preset.solped.estimatedAmount);
  }
}

export function applyJefaturaPreset() {
  const preset = getPreset();
  const m = preset.modalidad;
  const header = document.querySelector('.form-card__header > span:first-child');
  setText(header, `SOLPED #${preset.solpedNumber} — Aprobación de modalidad`);
  const panel = document.querySelector('.form-card__body .info-panel');
  const label = MODALITY_LABELS[m.modality] || m.modalityLabel;
  const utm = (Number(m.monto) / 65084).toFixed(2);
  const formatted = Number(m.monto).toLocaleString('es-CL');
  if (panel) {
    setInnerHtml(
      panel,
      `<strong>Decisión de modalidad — solo lectura</strong><br />
      Modalidad seleccionada: <strong>${label}</strong> · Monto estimado: $ ${formatted} (${utm} UTM) · Gateway V1–V8: OK<br />
      Solicitada por: Carla Fuentes (DAF Finanzas)`,
    );
  }
}

export function applyPreobligacionPreset() {
  applyGenericSolpedHeader();
  const preset = getPreset();
  const montoInput = document.querySelector('.form-card__body input[type="text"]');
  if (montoInput) setValue(montoInput, preset.solped.estimatedAmount);
}

export function wireCancelLinks() {
  const url = getExpedienteUrl(getExpedienteIdFromUrl());
  document.querySelectorAll('#cancel-link, #cancel-link-btn').forEach((el) => {
    if (el.tagName === 'A') el.href = url;
    else el.addEventListener('click', () => { window.location.href = url; });
  });
  const cancel51 = document.querySelector('a.btn--secondary[href*="00-expediente"]');
  if (cancel51) cancel51.href = url;
}

export function bootstrapFormPage(type) {
  switch (type) {
    case 'solped':
      applySolpedPreset();
      break;
    case 'modalidad':
      applyModalidadPreset();
      break;
    case 'vinculacion':
      applyVinculacionMpPreset();
      break;
    case 'recepcion':
      applyRecepcionPreset();
      break;
    case 'pago':
      applyPagoPreset();
      break;
    case 'solped-step':
      applyGenericSolpedHeader();
      break;
    case 'jefatura':
      applyJefaturaPreset();
      break;
    case 'preobligacion':
      applyPreobligacionPreset();
      break;
    default:
      break;
  }
  wireCancelLinks();
}
