/**
 * Chat contextual demo (mensajería in-app).
 * Spec: sgm-docs/plataforma/mensajeria/overview.md
 * Sin persistencia ni sync multi-usuario.
 * Por defecto: pregunta abierta; el contexto de vista se agrega con botón.
 * Destinatarios: búsqueda por persona o departamento.
 */
import { getSession } from './auth-demo.js';
import { users, roleAssignments } from './demo-data/plataforma.js';

/**
 * @param {{ siteUrl: (p: string) => string }} opts
 */
export function resolveViewContext({ siteUrl }) {
  const title = (document.title || 'Vista SGM')
    .replace(/\s*[—–-]\s*SGM.*$/i, '')
    .replace(/\s*[—–-]\s*Consola.*$/i, '')
    .trim() || 'Vista SGM';

  const expedienteId = new URLSearchParams(window.location.search).get('expediente');
  const path = window.location.pathname;
  const base = siteUrl('').replace(/\/$/, '');
  let relative = path;
  if (base && path.startsWith(base)) {
    relative = path.slice(base.length) || '/';
  }
  relative = relative.replace(/\/$/, '') || '/';

  const parts = [title];
  if (expedienteId) parts.push(expedienteId);

  return {
    label: parts.join(' · '),
    title,
    expedienteId: expedienteId || null,
    path: relative,
    deepLink: window.location.pathname + window.location.search,
  };
}

function orgLabelForUser(userId) {
  const asg = roleAssignments.find((a) => a.user_id === userId);
  if (!asg) return { department: '—', unit: '—', node_label: '—' };
  return {
    department: asg.department,
    unit: asg.unit,
    node_label: asg.node_label,
  };
}

function eligibleRecipients(session) {
  const run = session?.user?.run;
  const name = session?.user?.display_name;
  return users
    .filter(
      (u) =>
        u.status === 'active' &&
        u.run !== run &&
        u.display_name !== name,
    )
    .map((u) => {
      const org = orgLabelForUser(u.id);
      return {
        ...u,
        department: org.department,
        unit: org.unit,
        node_label: org.node_label,
        search_text: `${u.display_name} ${u.run} ${org.department} ${org.unit} ${org.node_label}`.toLowerCase(),
      };
    });
}

/**
 * @param {{ siteUrl: (p: string) => string }} opts
 */
export function mountContextualChat({ siteUrl }) {
  if (document.getElementById('sgm-chat-fab')) return;

  const session = getSession();
  const me = session?.user?.display_name || 'Yo';
  const recipientsPool = eligibleRecipients(session);

  /** @type {ReturnType<typeof resolveViewContext> | null} */
  let attachedContext = null;
  /** @type {string[]} */
  let selectedIds = [];
  /** @type {{ from: string, text: string, stub?: boolean }[]} */
  let messages = [];
  let searchQuery = '';

  const root = document.createElement('div');
  root.id = 'sgm-chat-root';
  root.className = 'sgm-chat';
  root.innerHTML = `
    <button type="button" class="sgm-chat__fab" id="sgm-chat-fab" title="Chat" aria-expanded="false" aria-controls="sgm-chat-panel" aria-label="Abrir chat">
      Chat
    </button>
    <div class="sgm-chat__panel" id="sgm-chat-panel" hidden role="dialog" aria-modal="true" aria-label="Chat">
      <header class="sgm-chat__head">
        <strong>Chat</strong>
        <button type="button" class="sgm-chat__icon-btn" id="sgm-chat-close" aria-label="Cerrar chat">×</button>
      </header>
      <section class="sgm-chat__section">
        <h3 class="sgm-chat__label">Contexto</h3>
        <div id="sgm-chat-context"></div>
      </section>
      <section class="sgm-chat__section">
        <h3 class="sgm-chat__label">Para <span class="required">*</span></h3>
        <div class="sgm-chat__chips" id="sgm-chat-to"></div>
        <div class="sgm-chat__search">
          <input type="search" id="sgm-chat-search" placeholder="Buscar por persona o departamento…" autocomplete="off" aria-label="Buscar destinatario por persona o departamento" aria-controls="sgm-chat-results" aria-autocomplete="list" />
          <ul class="sgm-chat__results" id="sgm-chat-results" role="listbox" hidden></ul>
        </div>
      </section>
      <section class="sgm-chat__section sgm-chat__messages-wrap">
        <h3 class="sgm-chat__label">Mensajes</h3>
        <div class="sgm-chat__messages" id="sgm-chat-messages"></div>
      </section>
      <footer class="sgm-chat__compose">
        <input type="text" id="sgm-chat-input" placeholder="Escribe un mensaje…" autocomplete="off" />
        <button type="button" class="btn btn--primary" id="sgm-chat-send">Enviar</button>
      </footer>
      <p class="sgm-chat__demo-note">Demo: sin entrega real ni persistencia.</p>
    </div>
  `;
  document.body.appendChild(root);

  const fab = document.getElementById('sgm-chat-fab');
  const panel = document.getElementById('sgm-chat-panel');
  const ctxEl = document.getElementById('sgm-chat-context');
  const toEl = document.getElementById('sgm-chat-to');
  const searchInput = document.getElementById('sgm-chat-search');
  const resultsEl = document.getElementById('sgm-chat-results');
  const msgEl = document.getElementById('sgm-chat-messages');
  const input = document.getElementById('sgm-chat-input');
  const sendBtn = document.getElementById('sgm-chat-send');

  function renderContext() {
    if (!attachedContext) {
      const available = resolveViewContext({ siteUrl });
      ctxEl.innerHTML = `
        <p class="sgm-chat__open-q">Pregunta abierta (sin contexto de proceso).</p>
        <button type="button" class="btn btn--secondary sgm-chat__add-ctx" id="sgm-chat-add-ctx">
          Incluir contexto de esta vista
        </button>
        <p class="sgm-chat__hint">Disponible: ${available.label}</p>
      `;
      document.getElementById('sgm-chat-add-ctx')?.addEventListener('click', () => {
        attachedContext = resolveViewContext({ siteUrl });
        renderContext();
      });
      return;
    }
    ctxEl.innerHTML = `
      <div class="sgm-chat__ctx-chip">
        <span title="${attachedContext.deepLink}">${attachedContext.label}</span>
        <button type="button" id="sgm-chat-clear-ctx" aria-label="Quitar contexto" title="Quitar contexto">×</button>
      </div>
      <p class="sgm-chat__hint">Puedes quitar el contexto para volver a pregunta abierta.</p>
    `;
    document.getElementById('sgm-chat-clear-ctx')?.addEventListener('click', () => {
      attachedContext = null;
      renderContext();
    });
  }

  function filteredRecipients() {
    const q = searchQuery.trim().toLowerCase();
    return recipientsPool.filter((u) => {
      if (selectedIds.includes(u.id)) return false;
      if (!q) return true;
      return u.search_text.includes(q);
    });
  }

  function renderSearchResults() {
    const matches = filteredRecipients();
    if (!searchQuery.trim()) {
      resultsEl.hidden = true;
      resultsEl.innerHTML = '';
      return;
    }
    if (!matches.length) {
      resultsEl.hidden = false;
      resultsEl.innerHTML = '<li class="sgm-chat__results-empty">Sin coincidencias</li>';
      return;
    }
    resultsEl.hidden = false;
    resultsEl.innerHTML = matches
      .map(
        (u) => `<li role="option">
          <button type="button" class="sgm-chat__result" data-add="${u.id}">
            <span class="sgm-chat__result-name">${u.display_name}</span>
            <span class="sgm-chat__result-org">${u.node_label}</span>
          </button>
        </li>`,
      )
      .join('');
    resultsEl.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-add');
        if (!selectedIds.includes(id)) selectedIds.push(id);
        searchQuery = '';
        searchInput.value = '';
        resultsEl.hidden = true;
        renderRecipients();
      });
    });
  }

  function renderRecipients() {
    toEl.innerHTML = selectedIds
      .map((id) => {
        const u = recipientsPool.find((x) => x.id === id);
        if (!u) return '';
        return `<span class="sgm-chat__to-chip" title="${u.node_label}">${u.display_name}
          <button type="button" data-remove="${id}" aria-label="Quitar">×</button>
        </span>`;
      })
      .join('');

    toEl.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedIds = selectedIds.filter((id) => id !== btn.getAttribute('data-remove'));
        renderRecipients();
        renderSearchResults();
      });
    });

    sendBtn.disabled = selectedIds.length === 0;
    renderSearchResults();
  }

  function renderMessages() {
    if (!messages.length) {
      msgEl.innerHTML = '<p class="sgm-chat__empty">Aún no hay mensajes en este hilo demo.</p>';
      return;
    }
    msgEl.innerHTML = messages
      .map(
        (m) =>
          `<div class="sgm-chat__bubble ${m.stub ? 'is-stub' : 'is-mine'}">
            <strong>${m.from}</strong>
            <p>${m.text}</p>
          </div>`,
      )
      .join('');
    msgEl.scrollTop = msgEl.scrollHeight;
  }

  function openPanel() {
    attachedContext = null;
    messages = [];
    selectedIds = [];
    searchQuery = '';
    searchInput.value = '';
    resultsEl.hidden = true;
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Cerrar chat');
    renderContext();
    renderRecipients();
    renderMessages();
    searchInput.focus();
  }

  function closePanel() {
    panel.hidden = true;
    resultsEl.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Abrir chat');
  }

  closePanel();

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.hidden) openPanel();
    else closePanel();
  });

  document.getElementById('sgm-chat-close').addEventListener('click', (e) => {
    e.stopPropagation();
    closePanel();
  });

  panel.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      if (!resultsEl.hidden) {
        resultsEl.hidden = true;
        return;
      }
      closePanel();
      fab.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (panel.hidden) return;
    if (!root.contains(e.target)) {
      closePanel();
    }
  });

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    renderSearchResults();
  });

  searchInput.addEventListener('focus', () => {
    if (searchQuery.trim()) renderSearchResults();
  });

  function send() {
    const text = input.value.trim();
    if (!text || selectedIds.length === 0) return;
    const names = selectedIds
      .map((id) => recipientsPool.find((u) => u.id === id)?.display_name)
      .filter(Boolean)
      .join(', ');
    const ctxNote = attachedContext
      ? `contexto «${attachedContext.label}»`
      : 'pregunta abierta';
    messages.push({ from: me, text });
    messages.push({
      from: 'Sistema (demo)',
      text: `Simulación: ${names} vería este hilo (${ctxNote}) en la versión real. No hay entrega ni persistencia.`,
      stub: true,
    });
    input.value = '';
    renderMessages();
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  });
}
