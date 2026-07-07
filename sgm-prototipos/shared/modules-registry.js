export const modules = [
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
];
