import { modules, adquisicionesNav } from './modules-registry.js';

let siteBase = null;

export function getSiteBase() {
  if (siteBase !== null) return siteBase;
  const marker = '/sgm-nueva-arquitectura';
  siteBase = window.location.pathname.includes(marker) ? marker : '';
  return siteBase;
}

export function siteUrl(relativePath) {
  const clean = relativePath.replace(/^\//, '');
  const base = getSiteBase();
  return base ? `${base}/${clean}` : `/${clean}`;
}

function renderModuleList(activeModuleId) {
  return modules
    .map((mod) => {
      if (mod.enabled) {
        const isActive = mod.id === activeModuleId;
        return `<li><a href="${siteUrl(mod.path)}" class="${isActive ? 'is-active' : ''}">${mod.name}</a></li>`;
      }
      return `<li><span class="is-disabled">${mod.name}<small>${mod.hint || 'Próximamente'}</small></span></li>`;
    })
    .join('');
}

function renderModuleNav(activeModuleId, activeNavId) {
  if (activeModuleId !== 'adquisiciones') return '';

  const links = adquisicionesNav
    .map(
      (item) =>
        `<a href="${siteUrl(item.path)}" class="${item.id === activeNavId ? 'is-active' : ''}">${item.label}</a>`,
    )
    .join('');

  return `
    <div class="app-sidebar__nav">
      <div class="app-sidebar__nav-title">Adquisiciones</div>
      ${links}
    </div>
  `;
}

export function initAppShell({ activeModule = 'adquisiciones', activeNav = null } = {}) {
  const sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <p class="app-sidebar__title">Módulos SGM</p>
    <ul class="app-sidebar__modules">${renderModuleList(activeModule)}</ul>
    ${renderModuleNav(activeModule, activeNav)}
  `;
}

export function renderAdqBreadcrumb({ items }) {
  const parts = items.map((item) => {
    if (item.href) {
      return `<a href="${siteUrl(item.href)}">${item.label}</a>`;
    }
    return item.label;
  });
  return `<nav class="breadcrumb" aria-label="Ruta">${parts.join(' › ')}</nav>`;
}
