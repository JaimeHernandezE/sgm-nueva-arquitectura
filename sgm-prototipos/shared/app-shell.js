import { modules, adquisicionesNav } from './modules-registry.js';

let siteBase = null;

/**
 * Raíz del sitio de prototipos ('' | '/sgm-nueva-arquitectura' | '/sgm-prototipos' | …).
 * Se deriva de la URL de este módulo (…/shared/app-shell.js), no de un nombre de repo fijo.
 */
export function getSiteBase() {
  if (siteBase !== null) return siteBase;
  const pathname = new URL(import.meta.url).pathname;
  const sharedIdx = pathname.lastIndexOf('/shared/');
  siteBase = sharedIdx >= 0 ? pathname.slice(0, sharedIdx) : '';
  return siteBase;
}

/**
 * Quita .html / index.html para que servidores con cleanUrls (p. ej. `npx serve`)
 * no redirijan perdiendo el query string (?expediente=…).
 */
function normalizePublicPath(relativePath) {
  let path = relativePath.replace(/^\//, '');
  let query = '';
  const q = path.indexOf('?');
  if (q >= 0) {
    query = path.slice(q);
    path = path.slice(0, q);
  }
  if (path.endsWith('/index.html')) {
    path = path.slice(0, -'index.html'.length);
  } else if (path.endsWith('.html')) {
    path = path.slice(0, -'.html'.length);
  }
  return { path, query };
}

export function siteUrl(relativePath) {
  const { path, query } = normalizePublicPath(relativePath);
  const base = getSiteBase();
  const url = base ? `${base}/${path}` : `/${path}`;
  return url + query;
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
