import { siteUrl, renderAdqBreadcrumb } from './app-shell.js';
import { getExpedienteIdFromUrl, getExpedienteDetailUrl } from './expedientes-demo.js';
import { getStages } from './demo-data/index.js';
import {
  ROLE_CATALOG,
  roleName,
  stepRoleCodes,
  getSimulationFromUrl,
  setSimulationInUrl,
  withSimulationParams,
  compareStepIds,
} from './roles.js';
import stepsManifest from './steps-manifest.js';
import stepsManifestCompraAgil from './steps-manifest-compra-agil.js';
import stepsManifestConvenioMarco from './steps-manifest-convenio-marco.js';
import stepsManifestLicitacionPublica from './steps-manifest-licitacion-publica.js';
import stepsManifestTratoDirecto from './steps-manifest-trato-directo.js';
import { getValidationDemo } from './validation-demos.js';

const modalityManifestByExpediente = {
  'ADQ-2026-00123': stepsManifestCompraAgil,
  'ADQ-2026-00142': stepsManifestCompraAgil,
  'ADQ-2026-00089': stepsManifestConvenioMarco,
  'ADQ-2026-00045': stepsManifestLicitacionPublica,
  'ADQ-2026-00012': stepsManifestTratoDirecto,
};

export { withSimulationParams } from './roles.js';

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
  return withSimulationParams(`${path}?expediente=${encodeURIComponent(expedienteId)}`);
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
  return withSimulationParams(siteUrl(`${entry.prototypeHtml}?expediente=${encodeURIComponent(expedienteId)}`));
}

/** Pasos transversales + etapa 3 de la modalidad del expediente, en orden de flujo. */
export function orderedStepsForExpediente(expedienteId = getExpedienteIdFromUrl()) {
  const modality = modalityManifestByExpediente[expedienteId];
  const merged = [...stepsManifest.steps, ...(modality?.steps || [])];
  return merged.sort((a, b) => compareStepIds(a.stepId, b.stepId));
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

/** Stub de operación de contrato (sin efecto de negocio). Preferir demoValidation para demos de 422. */
export function demoAction(_operationName) {
  /* no-op */
}

/**
 * Modal demo de ValidationErrorResponse resuelto desde validation-demos.js.
 * @param {string} operationId
 * @param {{ title?: string, issues?: import('./validation-demos.js').ValidationIssue[] }} [overrides]
 */
export function demoValidation(operationId, overrides = {}) {
  demoAction(operationId);
  const demo = getValidationDemo(operationId);
  const issues = overrides.issues || demo?.issues;
  if (!issues?.length) return;
  showValidationIssues({
    title: overrides.title || demo?.title || `Validaciones — ${operationId}`,
    operationId,
    issues,
  });
}

/**
 * Modal demo de ValidationErrorResponse (estandares-api §3.2).
 * @param {{ title?: string, operationId?: string, issues: Array<{ error_code: string, field?: string|null, rule: string, severity: 'blocking'|'advisory' }> }} opts
 */
export function showValidationIssues({ title = 'Validaciones', operationId, issues }) {
  const existing = document.getElementById('validation-issues-modal');
  existing?.remove();

  const listItems = (issues || [])
    .map((issue) => {
      const sev = issue.severity === 'advisory' ? 'advisory' : 'blocking';
      const sevLabel = sev === 'blocking' ? 'Bloqueante' : 'Advertencia';
      return `<li class="validation-issue validation-issue--${sev}">
        <span class="validation-issue__sev">${sevLabel}</span>
        <span class="validation-issue__rule">${issue.rule}</span>
        ${issue.field ? `<span class="validation-issue__field"><code>${issue.field}</code></span>` : ''}
      </li>`;
    })
    .join('');

  const opLine = operationId
    ? `<p class="validation-issues__op">Operación: <code>${operationId}</code> · respuesta demo <code>422 ValidationErrorResponse</code></p>`
    : '';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay is-open';
  overlay.id = 'validation-issues-modal';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-labelledby="validation-issues-title" aria-modal="true">
      <div class="modal__header">
        <span id="validation-issues-title">${title}</span>
        <button class="btn btn--link" type="button" data-close-validation>✕</button>
      </div>
      <div class="modal__body">
        ${opLine}
        <ul class="validation-issues__list">${listItems || '<li>Sin issues</li>'}</ul>
      </div>
      <div class="modal__footer">
        <button class="btn btn--primary" type="button" data-close-validation>Cerrar</button>
      </div>
    </div>
  `;

  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelectorAll('[data-close-validation]').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  document.body.appendChild(overlay);
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

/* ------------------------------------------------------------------ */
/* Panel de simulación por rol y por sub-paso en pantallas de sub-paso */
/* ------------------------------------------------------------------ */

function findDemoStep(stepId, expedienteId) {
  for (const stage of getStages(expedienteId)) {
    const step = (stage.steps || []).find((s) => s.id === stepId);
    if (step) return step;
  }
  return null;
}

function disableFormControls() {
  document
    .querySelectorAll('.form-card input, .form-card select, .form-card textarea, .form-card button')
    .forEach((el) => { el.disabled = true; });
}

function setSimulationBanner(text, blocked) {
  let banner = document.getElementById('sim-banner');
  if (!text) {
    banner?.remove();
    return;
  }
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'sim-banner';
    banner.className = 'banner banner--info';
    const card = document.querySelector('.form-card');
    card?.parentNode?.insertBefore(banner, card);
  }
  banner.textContent = text;
  banner.style.color = blocked ? '#a33333' : '';
}

function applyGating(stepId, expedienteId) {
  const { rol, paso } = getSimulationFromUrl();
  if (!rol && !paso) {
    setSimulationBanner(null);
    return;
  }

  const headerBadge = document.getElementById('header-badge');

  if (paso) {
    const cmp = compareStepIds(paso, stepId);
    if (cmp > 0) {
      setSimulationBanner(`Simulación: este sub-paso se asume aprobado (el expediente simulado va en ${paso}).`, false);
      disableFormControls();
      return;
    }
    if (cmp < 0) {
      if (headerBadge) headerBadge.textContent = 'Pendiente';
      setSimulationBanner(`Pendiente — el expediente simulado va en el sub-paso ${paso}.`, true);
      disableFormControls();
      return;
    }
  }

  if (rol) {
    const step = findDemoStep(stepId, expedienteId);
    if (!step) {
      setSimulationBanner(`Simulando como ${roleName(rol)} (${rol}) — sub-paso sin responsable registrado en demo-data, sin restricción.`, false);
      return;
    }
    const codes = stepRoleCodes(step);
    if (!codes.includes(rol)) {
      if (headerBadge) headerBadge.textContent = 'Pendiente';
      const responsible = step?.responsible?.role || 'otro rol / automático';
      setSimulationBanner(`Pendiente para ${roleName(rol)} — acción de: ${responsible}.`, true);
      disableFormControls();
    } else {
      setSimulationBanner(`Simulando como ${roleName(rol)} (${rol}) — acción habilitada.`, false);
    }
  }
}

/**
 * Panel de simulación en pantallas de sub-paso. Sin `rol`/`paso` en la URL,
 * usa `defaultRol` / `defaultPaso` si se pasan; si no, vista actual sin gating.
 * El select de sub-paso navega a la pantalla del paso elegido (anteriores
 * asumidos aprobados); el de rol re-aplica la habilitación en vivo.
 */
export function initStepSimulation({ stepId, defaultRol = null, defaultPaso = null }) {
  const expedienteId = getExpedienteIdFromUrl();
  const fromUrl = getSimulationFromUrl();
  const hasUrlSimulation = Boolean(fromUrl.rol || fromUrl.paso);
  const simulation = hasUrlSimulation
    ? fromUrl
    : {
        rol: defaultRol || null,
        paso: defaultPaso || null,
      };
  if (!hasUrlSimulation && (defaultRol || defaultPaso)) {
    setSimulationInUrl(simulation);
  }

  const anchor = document.getElementById('origin-banner') || document.getElementById('breadcrumb');
  if (!anchor || document.getElementById('sim-panel')) return;

  const panel = document.createElement('div');
  panel.className = 'demo-panel';
  panel.id = 'sim-panel';
  panel.innerHTML = `
    <span class="badge badge--demo">Solo para demo</span>
    <label>Ver como rol:
      <select id="sim-role"><option value="">— (vista actual)</option></select>
    </label>
    <label>Situar en sub-paso:
      <select id="sim-step"><option value="">— (estado actual)</option></select>
    </label>
  `;
  anchor.insertAdjacentElement('afterend', panel);

  const roleSelect = panel.querySelector('#sim-role');
  ROLE_CATALOG.forEach(({ code, name }) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = `${name} (${code})`;
    roleSelect.appendChild(opt);
  });
  roleSelect.value = simulation.rol || '';

  const stepSelect = panel.querySelector('#sim-step');
  orderedStepsForExpediente(expedienteId).forEach((entry) => {
    const opt = document.createElement('option');
    opt.value = entry.stepId;
    opt.textContent = `${entry.stepId} — ${entry.stepName}`;
    stepSelect.appendChild(opt);
  });
  stepSelect.value = simulation.paso || '';

  roleSelect.addEventListener('change', () => {
    setSimulationInUrl({ rol: roleSelect.value || null, paso: stepSelect.value || null });
    window.location.reload();
  });
  stepSelect.addEventListener('change', () => {
    const paso = stepSelect.value || null;
    setSimulationInUrl({ rol: roleSelect.value || null, paso });
    if (paso && paso !== stepId) {
      const target = getStepFormUrl(paso, expedienteId);
      if (target) {
        window.location.href = target;
        return;
      }
    }
    window.location.reload();
  });

  applyGating(stepId, expedienteId);
}
