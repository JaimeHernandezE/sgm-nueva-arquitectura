import { expediente, stages } from './demo-data.js';
import stepsManifest from './steps-manifest.js';

export function getFormUrl(stepId) {
  const entry = stepsManifest.steps.find((s) => s.stepId === stepId);
  if (!entry?.formPath) return null;
  return `${entry.formPath}?expediente=${encodeURIComponent(expediente.id)}`;
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

function resolveAction(step, viewerRole) {
  if (step.action?.type === 'primary' && viewerRole === 'other') {
    return { type: 'badge', label: 'En curso', active: true };
  }
  return step.action;
}

function renderAction(action, step) {
  if (!action) return '';
  const formUrl = getFormUrl(step.id);

  if (action.type === 'primary') {
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
  return `<span class="${classes.join(' ')}">${action.label}</span>`;
}

function renderStep(step, viewerRole) {
  const origin = resolveOrigin(step);
  const action = resolveAction(step, viewerRole);
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

function renderStage(stage, viewerRole) {
  const stageClasses = ['stage'];
  if (stage.state === 'active') stageClasses.push('stage--active');
  if (stage.state === 'pending') stageClasses.push('stage--pending');

  const badgeClasses = ['stage__badge'];
  if (stage.state === 'active') badgeClasses.push('stage__badge--active');

  const isExpanded = stage.expanded;

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
          ${stage.steps.map((s) => renderStep(s, viewerRole)).join('')}
        </div>
        ${stage.totalTime ? `<div class="stage__footer">${stage.totalTime}</div>` : ''}
        ${stage.note ? `<div class="stage__note">${stage.note}</div>` : ''}
      ` : ''}
    </section>
  `;
}

export function renderExpediente(viewerRole) {
  const header = `
    <header class="expediente-header">
      <div>
        <div class="folio">${expediente.id}</div>
        <div class="glosa">${expediente.glosa}</div>
        <div class="meta">Modalidad: ${expediente.modality} · Unidad de origen: ${expediente.unit}</div>
      </div>
      <div class="global-badge">${expediente.globalStatus}</div>
    </header>
  `;

  const stagesHtml = stages.map((s) => renderStage(s, viewerRole)).join('');
  document.getElementById('app').innerHTML = header + stagesHtml;

  document.querySelectorAll('.stage__header').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.stage);
      const stage = stages.find((s) => s.id === id);
      if (stage) {
        stage.expanded = !stage.expanded;
        renderExpediente(viewerRole);
      }
    });
  });
}

export function initExpediente() {
  const roleSelect = document.getElementById('viewer-role');
  const viewerRole = roleSelect?.value || 'responsible';

  renderExpediente(viewerRole);
  roleSelect?.addEventListener('change', (e) => {
    renderExpediente(e.target.value);
  });
}
