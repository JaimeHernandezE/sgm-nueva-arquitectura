/**
 * Campanita + estado leído demo (C6).
 * Spec: sgm-docs/plataforma/notificaciones/overview.md
 *
 * No importa form-shell/app-shell (evitar ciclo de módulos ES).
 */
import { notifications as seedNotifications } from './demo-data/plataforma.js';
import { getSession, logoutDemo } from './auth-demo.js';

const STORAGE_KEY = 'sgm-demo-notification-reads';

function demoAction(_operationId) {
  /* stub silencioso — alineado con form-shell.demoAction */
}

function loadReadOverrides() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveReadOverrides(map) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/** Lista con `read` fusionado contra sessionStorage. */
export function listDemoNotifications() {
  const overrides = loadReadOverrides();
  return seedNotifications.map((n) => ({
    ...n,
    read: overrides[n.id] !== undefined ? overrides[n.id] : n.read,
  }));
}

export function unreadCount() {
  return listDemoNotifications().filter((n) => !n.read).length;
}

export function markNotificationRead(id) {
  const map = loadReadOverrides();
  map[id] = true;
  saveReadOverrides(map);
  demoAction('markNotificationRead');
}

export function markAllNotificationsRead(ids) {
  const map = loadReadOverrides();
  ids.forEach((id) => {
    map[id] = true;
  });
  saveReadOverrides(map);
  demoAction('markAllNotificationsRead');
}

export const KIND_LABELS = {
  action_required: 'Acción requerida',
  info: 'Informativa',
  deadline: 'Plazo',
  escalation: 'Escalamiento',
};

export function kindLabel(kind) {
  return KIND_LABELS[kind] || kind;
}

export function kindBadgeClass(kind) {
  if (kind === 'action_required') return 'badge badge--awaiting';
  if (kind === 'deadline' || kind === 'escalation') return 'badge badge--stub';
  return 'badge';
}

function recentItems(limit = 4) {
  return listDemoNotifications()
    .slice()
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .slice(0, limit);
}

function renderDropdownItems(items, siteUrl) {
  if (!items.length) {
    return '<p class="notif-empty">No hay notificaciones recientes.</p>';
  }
  return items
    .map((n) => {
      const dot = n.read ? '○' : '●';
      const href = siteUrl(n.deep_link);
      return `<article class="notif-item ${n.read ? 'is-read' : 'is-unread'}" data-id="${n.id}">
        <div class="notif-item__title"><span class="notif-item__dot" aria-hidden="true">${dot}</span> ${n.title}</div>
        <div class="notif-item__meta">${n.module} · ${kindLabel(n.kind)} · ${n.age_label}</div>
        <a class="notif-item__cta" href="${href}" data-mark-read="${n.id}">${n.cta_label}</a>
      </article>`;
    })
    .join('');
}

/**
 * Inserta topbar con campanita en `.app-layout` (una sola vez).
 * @param {{ siteUrl: (path: string) => string }} opts
 */
export function mountNotificationBell({ siteUrl }) {
  const layout = document.querySelector('.app-layout');
  if (!layout || document.getElementById('app-topbar')) return;

  const body = document.createElement('div');
  body.className = 'app-layout__body';
  while (layout.firstChild) {
    body.appendChild(layout.firstChild);
  }

  const inboxUrl = siteUrl('plataforma/shell/02-bandeja.html');
  const profileUrl = siteUrl('plataforma/shell/03-mis-datos.html');
  const prefsUrl = siteUrl('plataforma/municipal/09-preferencias-notificacion.html');
  const homeUrl = siteUrl('home.html');
  const session = getSession();
  const userName = session?.user?.display_name || 'Usuario';
  const userRun = session?.user?.run || '';

  const topbar = document.createElement('header');
  topbar.id = 'app-topbar';
  topbar.className = 'app-topbar';
  topbar.innerHTML = `
    <a class="app-topbar__brand" href="${homeUrl}">SGM</a>
    <div class="app-topbar__spacer"></div>
    <div class="app-topbar__actions">
      <div class="notif-bell" id="notif-bell">
        <button type="button" class="notif-bell__btn" id="notif-bell-btn" aria-expanded="false" aria-haspopup="true" aria-controls="notif-dropdown" title="Notificaciones">
          <span class="notif-bell__icon" aria-hidden="true">🔔</span>
          <span class="notif-bell__badge" id="notif-badge" hidden>0</span>
        </button>
        <div class="notif-dropdown" id="notif-dropdown" hidden>
          <div class="notif-dropdown__head">
            <strong>Notificaciones</strong>
            <a href="${inboxUrl}">Ver bandeja</a>
          </div>
          <div class="notif-dropdown__list" id="notif-dropdown-list"></div>
        </div>
      </div>
      <div class="app-topbar__account" id="account-menu">
        <button type="button" class="app-topbar__user" id="account-btn" aria-expanded="false" aria-haspopup="true" title="Cuenta">
          <span class="app-topbar__user-name">${userName}</span>
        </button>
        <div class="account-dropdown" id="account-dropdown" hidden>
          <div class="account-dropdown__meta">
            <strong>${userName}</strong>
            <span>${userRun}</span>
            <span>ClaveÚnica (simulación)</span>
          </div>
          <a href="${profileUrl}">Mis datos</a>
          <a href="${prefsUrl}">Preferencias de notificación</a>
          <a href="${inboxUrl}">Bandeja de entrada</a>
          <button type="button" id="btn-logout">Cerrar sesión</button>
        </div>
      </div>
    </div>
  `;

  layout.appendChild(topbar);
  layout.appendChild(body);

  const btn = document.getElementById('notif-bell-btn');
  const dropdown = document.getElementById('notif-dropdown');
  const badge = document.getElementById('notif-badge');
  const panel = document.getElementById('notif-dropdown-list');
  const accountBtn = document.getElementById('account-btn');
  const accountDropdown = document.getElementById('account-dropdown');

  function refreshBellUi() {
    const count = unreadCount();
    badge.textContent = String(count);
    badge.hidden = count === 0;
    badge.setAttribute('aria-label', `${count} no leídas`);
    panel.innerHTML = renderDropdownItems(recentItems(), siteUrl);
    panel.querySelectorAll('[data-mark-read]').forEach((el) => {
      el.addEventListener('click', () => {
        markNotificationRead(el.getAttribute('data-mark-read'));
        refreshBellUi();
      });
    });
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    accountDropdown.hidden = true;
    accountBtn.setAttribute('aria-expanded', 'false');
    const open = dropdown.hidden;
    dropdown.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      demoAction('listNotifications');
      refreshBellUi();
    }
  });

  accountBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    const open = accountDropdown.hidden;
    accountDropdown.hidden = !open;
    accountBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    logoutDemo();
    window.location.assign(siteUrl('index.html'));
  });

  document.addEventListener('click', (e) => {
    if (!topbar.contains(e.target)) {
      dropdown.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      accountDropdown.hidden = true;
      accountBtn.setAttribute('aria-expanded', 'false');
    }
  });

  refreshBellUi();
}
