import { getStages } from './demo-data/index.js';
import { getExpedienteIdFromUrl, getExpedienteProfile } from './expedientes-demo.js';
import { renderAdqBreadcrumb } from './app-shell.js';
import { getStepFormUrl } from './form-shell.js';
import {
  ROLE_CATALOG,
  stepRoleCodes,
  roleName,
  getSimulationFromUrl,
  setSimulationInUrl,
  withSimulationParams,
} from './roles.js';

let expandedState = {};

export function getFormUrl(stepId) {
  return withSimulationParams(getStepFormUrl(stepId, getExpedienteIdFromUrl()));
}

export function resolveOrigin(step) {
  if (step.origin?.kind === 'external') {
    return { tint: 'external', chip: `${step.origin.label} · ${step.origin.mode}` };
  }
  if (step.origin?.kind === 'module') {
    return { tint: 'module', chip: `${step.origin.label} · ${step.origin.mode}` };
  }
  return { tint: null, chip: null };
}

function formatResponsible(r) {
  return `${r.unit} / ${r.role} / ${r.name}`;
}

/**
 * Marca el paso actual, deja pendientes los posteriores y pliega todo
 * excepto la etapa que contiene el paso actual.
 *
 * Con `assumePreviousDone` (simulación de sub-paso) los anteriores no
 * omitidos se fuerzan a aprobados, independiente del estado en demo-data.
 */
export function applyCurrentStepFocus(stages, currentStepId, { assumePreviousDone = false } = {}) {
  if (!currentStepId) {
    return stages.map((stage) => ({
      ...stage,
      expanded: false,
      steps: (stage.steps || []).map((step) => ({ ...step, current: false })),
    }));
  }

  let passedCurrent = false;
  let currentStageId = null;

  const withSteps = stages.map((stage) => {
    const steps = (stage.steps || []).map((step) => {
      if (step.id === currentStepId) {
        passedCurrent = true;
        currentStageId = stage.id;
        const primaryLabel =
          step.action?.type === 'primary'
            ? step.action.label
            : step.origin?.kind === 'external'
              ? 'Abrir paso'
              : 'Completar formulario';
        return {
          ...step,
          current: true,
          status: 'active',
          action: { type: 'primary', label: primaryLabel },
        };
      }
      if (!passedCurrent) {
        if (assumePreviousDone && !(step.omitted || step.status === 'omitted')) {
          return {
            ...step,
            current: false,
            status: 'done',
            action: { type: 'secondary', label: 'Ver formulario' },
          };
        }
        return { ...step, current: false };
      }
      if (step.omitted || step.status === 'omitted') {
        return { ...step, current: false };
      }
      return {
        ...step,
        current: false,
        status: 'pending',
        action: { type: 'badge', label: 'Pendiente' },
      };
    });

    return { ...stage, steps };
  });

  return withSteps.map((stage) => {
    const isCurrentStage = stage.id === currentStageId;
    const isAfter = currentStageId != null && Number(stage.id) > Number(currentStageId);
    return {
      ...stage,
      expanded: isCurrentStage,
      state: isCurrentStage ? 'active' : isAfter ? 'pending' : 'done',
      status: isCurrentStage ? 'En curso' : isAfter ? 'Pendiente' : stage.status === 'En curso' ? 'Finalizada' : stage.status,
    };
  });
}

/**
 * Capa de rol sobre la acción del paso.
 * Sin rol seleccionado: comportamiento actual (responsable habilitado).
 * Con rol: la acción primaria del paso activo solo queda habilitada si el
 * rol coincide con el responsable del paso; si no, se ve Pendiente.
 */
function resolveAction(step, simulation) {
  if (step.omitted || step.status === 'omitted') {
    return step.action?.type === 'badge' ? step.action : { type: 'badge', label: 'Omitido (optativo)' };
  }
  if (step.action?.type === 'primary' && simulation?.rol) {
    const codes = stepRoleCodes(step);
    if (!codes.includes(simulation.rol)) {
      return { type: 'badge', label: 'Pendiente — acción de otro rol', active: true };
    }
  }
  return step.action;
}

function renderAction(action, step) {
  if (!action) return '';
  const isOmitted = step.omitted || step.status === 'omitted';
  const formUrl = isOmitted ? null : getFormUrl(step.id);

  if (action.type === 'primary') {
    if (formUrl) {
      return `<a class="btn btn--primary" href="${formUrl}">${action.label}</a>`;
    }
    return `<button class="btn btn--primary" type="button">${action.label}</button>`;
  }
  if (action.type === 'secondary') {
    if (formUrl) {
      return `<a class="btn btn--secondary" href="${formUrl}">${action.label}</a>`;
    }
    return `<button class="btn btn--secondary" type="button">${action.label}</button>`;
  }
  const classes = ['badge'];
  if (action.active) classes.push('badge--active');
  if (action.label === 'Omitido (optativo)') classes.push('badge--omitted');
  if (action.label === 'Pendiente en MP' || action.label === 'Esperando sync MP') classes.push('badge--active');
  return `<span class="${classes.join(' ')}">${action.label}</span>`;
}

function renderStep(step, simulation) {
  const origin = resolveOrigin(step);
  const action = resolveAction(step, simulation);
  const classes = ['step'];
  if (origin.tint === 'external') classes.push('step--external');
  if (origin.tint === 'module') classes.push('step--module');
  if (step.current) classes.push('step--current');
  if (step.omitted) classes.push('step--omitted');

  const chipClass = origin.tint === 'module' ? 'origin-chip--module' : 'origin-chip--external';

  return `
    <div class="${classes.join(' ')}">
      <div class="step__row">
        <div class="step__name">${step.id} — ${step.name}</div>
        <div class="step__responsible">${formatResponsible(step.responsible)}</div>
        <div class="step__action">${renderAction(action, step)}</div>
      </div>
      <div class="step__secondary">${step.secondaryLine || ''}</div>
      ${step.pendingCondition ? `<div class="step__pending-condition">${step.pendingCondition}</div>` : ''}
      ${origin.chip ? `<span class="origin-chip ${chipClass}">${origin.chip}</span>` : ''}
    </div>
  `;
}

function renderStage(stage, simulation, expedienteId) {
  const stageClasses = ['stage'];
  if (stage.state === 'active') stageClasses.push('stage--active');
  if (stage.state === 'pending') stageClasses.push('stage--pending');

  const badgeClasses = ['stage__badge'];
  if (stage.state === 'active') badgeClasses.push('stage__badge--active');

  const stateKey = `${expedienteId}-${stage.id}`;
  const isExpanded = expandedState[stateKey] ?? stage.expanded;

  return `
    <section class="${stageClasses.join(' ')}">
      <button class="stage__header" type="button" data-stage="${stage.id}" aria-expanded="${isExpanded}">
        <span class="stage__toggle">${isExpanded ? '▾' : '▸'}</span>
        <span>
          <span class="stage__title">${stage.id} · ${stage.name}</span>
          ${!isExpanded && stage.summary ? `<span class="stage__summary">${stage.summary}</span>` : ''}
        </span>
        <span class="${badgeClasses.join(' ')}">${stage.status}</span>
      </button>
      ${isExpanded ? `
        <div class="stage__body">
          ${(stage.steps || []).map((s) => renderStep(s, simulation)).join('')}
        </div>
        ${stage.totalTime ? `<div class="stage__footer">${stage.totalTime}</div>` : ''}
        ${stage.note ? `<div class="stage__note">${stage.note}</div>` : ''}
      ` : ''}
    </section>
  `;
}

function findStepById(stages, stepId) {
  for (const stage of stages) {
    const step = (stage.steps || []).find((s) => s.id === stepId);
    if (step) return step;
  }
  return null;
}

function renderHeader(profile, currentStep, simulation) {
  const current = currentStep || profile.currentStep;
  const formUrl = current?.id ? withSimulationParams(getStepFormUrl(current.id, profile.id)) : null;
  const simulatedTag = simulation?.paso ? ' (simulado)' : '';
  const currentLink = current && formUrl
    ? `<a class="current-step-link" href="${formUrl}"><span class="current-step-link__id">${current.id}</span> — ${current.name}${simulatedTag}</a>`
    : current
      ? `<div class="current-step-link"><span class="current-step-link__id">${current.id}</span> — ${current.name}${simulatedTag}</div>`
      : '';
  const roleLine = simulation?.rol
    ? `<div class="meta">Viendo como: ${roleName(simulation.rol)} (${simulation.rol})</div>`
    : '';

  return `
    <header class="expediente-header">
      <div>
        <div class="folio">${profile.id}</div>
        <div class="glosa">${profile.glosa}</div>
        <div class="meta">Modalidad: ${profile.modality} · Unidad de origen: ${profile.unit}</div>
        ${roleLine}
        ${currentLink}
      </div>
      <div class="global-badge">${profile.globalStatus}</div>
    </header>
  `;
}

export function renderExpediente(simulation = getSimulationFromUrl()) {
  const expedienteId = getExpedienteIdFromUrl();
  const profile = getExpedienteProfile(expedienteId);
  const rawStages = getStages(expedienteId);
  const effectiveStepId = simulation.paso || profile.currentStep?.id;
  const stages = applyCurrentStepFocus(rawStages, effectiveStepId, {
    assumePreviousDone: Boolean(simulation.paso),
  });
  const demoPanel = document.getElementById('demo-panel');
  const legend = document.getElementById('expediente-legend');

  if (demoPanel) demoPanel.classList.remove('hidden');
  if (legend) legend.classList.remove('hidden');

  const effectiveStep = findStepById(stages, effectiveStepId);
  const currentStep = effectiveStep ? { id: effectiveStep.id, name: effectiveStep.name } : profile.currentStep;

  const stagesHtml = stages.map((s) => renderStage(s, simulation, expedienteId)).join('');
  document.getElementById('app').innerHTML = renderHeader(profile, currentStep, simulation) + stagesHtml;

  document.querySelectorAll('.stage__header').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.stage);
      const stateKey = `${expedienteId}-${id}`;
      const stage = stages.find((s) => s.id === id);
      const current = expandedState[stateKey] ?? stage?.expanded ?? false;
      expandedState[stateKey] = !current;
      renderExpediente(simulation);
    });
  });
}

export function renderExpedienteBreadcrumb() {
  const profile = getExpedienteProfile(getExpedienteIdFromUrl());
  const el = document.getElementById('breadcrumb');
  if (!el) return;

  el.innerHTML = renderAdqBreadcrumb({
    items: [
      { label: 'Adquisiciones', href: 'modulos/adquisiciones/index.html' },
      { label: 'Expedientes', href: 'modulos/adquisiciones/01-listado-expedientes.html' },
      { label: profile.id },
    ],
  });
}

function populateSimulationSelects(simulation) {
  const roleSelect = document.getElementById('sim-role');
  const stepSelect = document.getElementById('sim-step');
  if (!roleSelect || !stepSelect) return;

  ROLE_CATALOG.forEach(({ code, name }) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = `${name} (${code})`;
    roleSelect.appendChild(opt);
  });
  roleSelect.value = simulation.rol || '';

  const stages = getStages(getExpedienteIdFromUrl());
  stages.forEach((stage) => {
    const group = document.createElement('optgroup');
    group.label = `${stage.id} · ${stage.name}`;
    (stage.steps || []).forEach((step) => {
      if (step.omitted || step.status === 'omitted') return;
      const opt = document.createElement('option');
      opt.value = step.id;
      opt.textContent = `${step.id} — ${step.name}`;
      group.appendChild(opt);
    });
    stepSelect.appendChild(group);
  });
  stepSelect.value = simulation.paso || '';
}

export function initExpediente() {
  renderExpedienteBreadcrumb();

  const simulation = getSimulationFromUrl();
  populateSimulationSelects(simulation);
  renderExpediente(simulation);

  const onChange = () => {
    const next = {
      rol: document.getElementById('sim-role')?.value || null,
      paso: document.getElementById('sim-step')?.value || null,
    };
    setSimulationInUrl(next);
    renderExpediente(next);
  };
  document.getElementById('sim-role')?.addEventListener('change', onChange);
  document.getElementById('sim-step')?.addEventListener('change', onChange);
}
