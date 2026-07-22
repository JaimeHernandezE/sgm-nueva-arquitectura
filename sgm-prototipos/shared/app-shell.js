import {
  modules,
  adquisicionesNav,
  plataformaHubNav,
  plataformaSubdereNav,
  plataformaMunicipalNav,
} from './modules-registry.js';
import { mountNotificationBell } from './notifications-ui.js';
import { requireAuth } from './auth-demo.js';

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

function navLinks(items, activeNavId) {
  return items
    .map(
      (item) =>
        `<a href="${siteUrl(item.path)}" class="${item.id === activeNavId ? 'is-active' : ''}">${item.label}</a>`,
    )
    .join('');
}

function renderModuleNav(activeModuleId, activeNavId, consoleId) {
  if (activeModuleId === 'adquisiciones') {
    return `
    <div class="app-sidebar__nav">
      <div class="app-sidebar__nav-title">Adquisiciones</div>
      ${navLinks(adquisicionesNav, activeNavId)}
    </div>
  `;
  }

  if (activeModuleId === 'plataforma') {
    let title = 'Plataforma';
    let items = plataformaHubNav;
    if (consoleId === 'subdere') {
      title = 'Consola SUBDERE';
      items = plataformaSubdereNav;
    } else if (consoleId === 'municipal') {
      title = 'Consola municipal';
      items = plataformaMunicipalNav;
    }
    return `
    <div class="app-sidebar__nav">
      <div class="app-sidebar__nav-title">${title}</div>
      ${navLinks(items, activeNavId)}
    </div>
  `;
  }

  return '';
}

/**
 * @param {{ activeModule?: string, activeNav?: string|null, console?: 'subdere'|'municipal'|null, skipAuth?: boolean }} opts
 */
export function initAppShell({
  activeModule = 'adquisiciones',
  activeNav = null,
  console: consoleId = null,
  skipAuth = false,
} = {}) {
  if (!skipAuth && !requireAuth({ siteUrl })) return;

  const sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <p class="app-sidebar__title">Módulos SGM</p>
    <ul class="app-sidebar__modules">${renderModuleList(activeModule)}</ul>
    ${renderModuleNav(activeModule, activeNav, consoleId)}
  `;

  mountNotificationBell({ siteUrl });
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

/** Breadcrumb de consolas del core. */
export function renderPlataformaBreadcrumb({ consoleLabel, screenLabel }) {
  return renderAdqBreadcrumb({
    items: [
      { label: 'Plataforma', href: 'plataforma/index.html' },
      { label: consoleLabel },
      { label: screenLabel },
    ],
  });
}
