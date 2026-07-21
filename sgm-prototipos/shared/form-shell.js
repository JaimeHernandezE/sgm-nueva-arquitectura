import { siteUrl, renderAdqBreadcrumb } from './app-shell.js';
import { getExpedienteIdFromUrl, getExpedienteDetailUrl } from './expedientes-demo.js';
import stepsManifest from './steps-manifest.js';
import stepsManifestCompraAgil from './steps-manifest-compra-agil.js';
import stepsManifestConvenioMarco from './steps-manifest-convenio-marco.js';
import stepsManifestLicitacionPublica from './steps-manifest-licitacion-publica.js';
import stepsManifestTratoDirecto from './steps-manifest-trato-directo.js';

const modalityManifestByExpediente = {
  'ADQ-2026-00123': stepsManifestCompraAgil,
  'ADQ-2026-00142': stepsManifestCompraAgil,
  'ADQ-2026-00089': stepsManifestConvenioMarco,
  'ADQ-2026-00045': stepsManifestLicitacionPublica,
  'ADQ-2026-00012': stepsManifestTratoDirecto,
};

export function getExpedienteId() {
  return getExpedienteIdFromUrl();
}

export function getExpedienteUrl(expedienteId) {
  return siteUrl(getExpedienteDetailUrl(expedienteId));
}

/**
 * Href relativo a otra pantalla del prototipo (mismo árbol).
 * Sin extensión .html: evita que cleanUrls de `serve` pierda ?expediente=.
 */
export function relativeFormHref(htmlPath, expedienteId = getExpedienteIdFromUrl()) {
  const path = htmlPath.replace(/\.html$/i, '').replace(/\/index$/i, '/');
  return `${path}?expediente=${encodeURIComponent(expedienteId)}`;
}

function findStepEntry(stepId, expedienteId) {
  const modality = modalityManifestByExpediente[expedienteId];
  return (
    modality?.steps.find((s) => s.stepId === stepId) ||
    stepsManifest.steps.find((s) => s.stepId === stepId) ||
    null
  );
}

/** URL absoluta al prototipo HTML de un sub-paso (evita rutas relativas rotas desde 00-expediente). */
export function getStepFormUrl(stepId, expedienteId = getExpedienteIdFromUrl()) {
  const entry = findStepEntry(stepId, expedienteId);
  if (!entry?.prototypeHtml) return null;
  return siteUrl(`${entry.prototypeHtml}?expediente=${encodeURIComponent(expedienteId)}`);
}

export function renderBreadcrumb({ expedienteId, stageName, stepName, stepId }) {
  return renderAdqBreadcrumb({
    items: [
      { label: 'Adquisiciones', href: 'modulos/adquisiciones/index.html' },
      { label: 'Expedientes', href: 'modulos/adquisiciones/01-listado-expedientes.html' },
      { label: `Expediente ${expedienteId}`, href: getExpedienteDetailUrl(expedienteId) },
      { label: stepId ? `${stepId} — ${stepName}` : stageName },
    ],
  });
}

export function renderOriginBanner(origin) {
  if (!origin) return '';
  const chipClass = origin.kind === 'module' ? 'origin-chip--module' : 'origin-chip--external';
  const panelClass = origin.kind === 'module' ? 'form-panel--module' : '';
  return `
    <div class="${panelClass}">
      <span class="origin-chip ${chipClass}">${origin.label} · ${origin.mode}</span>
    </div>
  `;
}

/** Stub de operación de contrato. Sin modal: la audiencia ya sabe que es prototipo. */
export function demoAction(_operationName) {
  /* no-op */
}

export function initBalancePanel({ triggerId, modalId, closeId, consultId }) {
  const trigger = document.getElementById(triggerId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeId);
  const consultBtn = document.getElementById(consultId);

  if (!trigger || !modal) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('is-open');
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('is-open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });

  consultBtn?.addEventListener('click', () => {
    demoAction('previewBudgetAvailability');
  });
}

export function initModalityToggle(selectId, resolutionRowId) {
  const select = document.getElementById(selectId);
  const row = document.getElementById(resolutionRowId);
  if (!select || !row) return;

  function update() {
    const isTratoDirecto = select.value === 'direct_procurement';
    row.classList.toggle('hidden', !isTratoDirecto);
  }

  select.addEventListener('change', update);
  update();
}

export function initCdpModeToggle(electronicId, scannedId, electronicPanelId, scannedPanelId) {
  const btnElectronic = document.getElementById(electronicId);
  const btnScanned = document.getElementById(scannedId);
  const panelElectronic = document.getElementById(electronicPanelId);
  const panelScanned = document.getElementById(scannedPanelId);
  if (!btnElectronic || !btnScanned) return;

  function setMode(mode) {
    const isElectronic = mode === 'electronic';
    btnElectronic.classList.toggle('is-active', isElectronic);
    btnScanned.classList.toggle('is-active', !isElectronic);
    panelElectronic?.classList.toggle('hidden', !isElectronic);
    panelScanned?.classList.toggle('hidden', isElectronic);
  }

  btnElectronic.addEventListener('click', () => setMode('electronic'));
  btnScanned.addEventListener('click', () => setMode('scanned'));
  setMode('electronic');
}
