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

/** [Integración SGM] Respaldo en memoria si sessionStorage no está disponible. */
let memorySession = null;

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : memorySession;
  } catch {
    return memorySession;
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
  memorySession = session;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* sin storage: queda en memoria */
  }
  return session;
}

export function logoutDemo() {
  memorySession = null;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* sin storage */
  }
}

/**
 * Si no hay sesión, redirige al login simulado.
 * @param {{ siteUrl: (p: string) => string }} opts
 */
export function requireAuth({ siteUrl }) {
  if (isLoggedIn()) return true;
  // [Integración SGM] Acceso directo a una pantalla (enlace entre módulos o
  // prototipo embebido): se abre la sesión demo sin pasar por el login simulado.
  // El landing y la pantalla ClaveÚnica siguen disponibles como entrada normal.
  loginDemo();
  return true;
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
