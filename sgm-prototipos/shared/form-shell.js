const EXPEDIENTE_SHELL = '../00-expediente/index.html';
const DEFAULT_EXPEDIENTE_ID = 'ADQ-2026-00123';

export function getExpedienteId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('expediente') || DEFAULT_EXPEDIENTE_ID;
}

export function getExpedienteUrl(expedienteId) {
  return `${EXPEDIENTE_SHELL}?expediente=${encodeURIComponent(expedienteId)}`;
}

export function renderBreadcrumb({ expedienteId, stageName, stepName, stepId }) {
  const shellUrl = getExpedienteUrl(expedienteId);
  const parts = [
    `<a href="${shellUrl}">Expediente ${expedienteId}</a>`,
    stageName,
    stepId ? `${stepId} — ${stepName}` : stepName,
  ];
  return `<nav class="breadcrumb" aria-label="Ruta">${parts.join(' › ')}</nav>`;
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

export function demoAction(operationName) {
  alert(`Demo: operación ${operationName} — sin backend en prototipo.`);
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
    const isTratoDirecto = select.value === 'trato_directo';
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
