export const modules = [
  {
    id: 'plataforma',
    name: 'Plataforma',
    path: 'plataforma/index.html',
    enabled: true,
  },
  {
    id: 'adquisiciones',
    name: 'Adquisiciones',
    path: 'modulos/adquisiciones/index.html',
    enabled: true,
  },
  {
    id: 'presupuestos',
    name: 'Presupuestos',
    enabled: false,
    hint: 'Próximamente',
  },
  {
    id: 'contabilidad',
    name: 'Contabilidad',
    enabled: false,
    hint: 'Próximamente',
  },
  {
    id: 'tesoreria',
    name: 'Tesorería',
    enabled: false,
    hint: 'Próximamente',
  },
  {
    id: 'rrhh',
    name: 'RRHH',
    enabled: false,
    hint: 'Próximamente',
  },
];

export const adquisicionesNav = [
  { id: 'home', label: 'Inicio', path: 'modulos/adquisiciones/index.html' },
  { id: 'expedientes', label: 'Expedientes', path: 'modulos/adquisiciones/01-listado-expedientes.html' },
  { id: 'config', label: 'Configuraciones', path: 'modulos/adquisiciones/configuraciones/index.html' },
];

export const plataformaHubNav = [
  { id: 'hub', label: 'Inicio', path: 'plataforma/index.html' },
  { id: 'bandeja', label: 'Bandeja', path: 'plataforma/shell/02-bandeja.html' },
  { id: 'chats', label: 'Chats', path: 'plataforma/shell/05-chats.html' },
];

export const plataformaSubdereNav = [
  { id: 'hub', label: '← Consolas', path: 'plataforma/index.html' },
  { id: 'chats', label: 'Chats', path: 'plataforma/shell/05-chats.html' },
  { id: '01-tenants', label: 'Tenants', path: 'plataforma/subdere/01-gestion-tenants.html' },
  { id: '02-normativos', label: 'Parámetros normativos', path: 'plataforma/subdere/02-parametros-normativos.html' },
  { id: '03-m2m', label: 'Clientes M2M', path: 'plataforma/subdere/03-clientes-m2m.html' },
  { id: '04-integraciones', label: 'Integraciones', path: 'plataforma/subdere/04-integraciones-plataforma.html' },
  { id: '05-storage', label: 'Provisión storage', path: 'plataforma/subdere/05-provision-almacenamiento.html' },
  { id: '06-monitoreo', label: 'Monitoreo', path: 'plataforma/subdere/06-monitoreo-tenant.html' },
  { id: '07-auditoria', label: 'Auditoría', path: 'plataforma/subdere/07-auditoria-plataforma.html' },
];

export const plataformaMunicipalNav = [
  { id: 'hub', label: '← Consolas', path: 'plataforma/index.html' },
  { id: 'chats', label: 'Chats', path: 'plataforma/shell/05-chats.html' },
  { id: '01-usuarios', label: 'Usuarios', path: 'plataforma/municipal/01-usuarios.html' },
  { id: '02-roles', label: 'Roles y unidades', path: 'plataforma/municipal/02-roles-unidades.html' },
  { id: '03-subrogancias', label: 'Subrogancias', path: 'plataforma/municipal/03-subrogancias.html' },
  { id: '04-sod', label: 'Excepciones SoD', path: 'plataforma/municipal/04-excepciones-sod.html' },
  { id: '05-parametros', label: 'Parámetros operativos', path: 'plataforma/municipal/05-parametros-operativos.html' },
  { id: '06-integraciones', label: 'Integraciones', path: 'plataforma/municipal/06-integraciones-municipio.html' },
  { id: '07-storage', label: 'Almacenamiento', path: 'plataforma/municipal/07-almacenamiento-documentos.html' },
  { id: '08-recert', label: 'Recertificación', path: 'plataforma/municipal/08-recertificacion-accesos.html' },
  { id: '09-prefs', label: 'Notificaciones', path: 'plataforma/municipal/09-preferencias-notificacion.html' },
];
