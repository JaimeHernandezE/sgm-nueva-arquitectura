/**
 * Sesión demo post–ClaveÚnica (prototipo).
 * sessionStorage: sgm-demo-session
 */
const SESSION_KEY = 'sgm-demo-session';

export const DEMO_USER = {
  id: 'u-ana',
  run: '12.345.678-9',
  display_name: 'Ana Pérez',
  municipio: 'Municipalidad Alpha',
};

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getSession()?.logged_in);
}

export function loginDemo(user = DEMO_USER) {
  const session = {
    logged_in: true,
    auth_provider: 'clave_unica',
    logged_in_at: new Date().toISOString(),
    user,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logoutDemo() {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Si no hay sesión, redirige al login simulado.
 * @param {{ siteUrl: (p: string) => string }} opts
 */
export function requireAuth({ siteUrl }) {
  if (isLoggedIn()) return true;
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(`${siteUrl('auth/clave-unica.html')}?next=${next}`);
  return false;
}

/** Destino post-login: `?next=` o home. */
export function postLoginUrl(siteUrl) {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  if (next && next.startsWith('/')) {
    return next;
  }
  return siteUrl('home.html');
}
