export const DEMO_SOLICITANTE_UNIT_ID = 'ou-solicitante';

export const expedientesDemo = [
  {
    id: 'ADQ-2026-00123',
    glosa: 'Insumos de oficina — reposición anual',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Administración Municipal',
    departmentId: 'ou-admin',
    unit: 'Unidad Solicitante',
    unitId: 'ou-solicitante',
    status: 'in_progress',
    awaitingMyAction: false,
    globalStatus: 'En curso · recepción conforme (4.1)',
    fullDetail: true,
    currentStep: { id: '4.1', name: 'Registro de la recepción' },
  },
  {
    id: 'ADQ-2026-00089',
    glosa: 'Mobiliario ergonómico vía Convenio Marco',
    modality: 'Convenio Marco',
    modalityKey: 'framework_agreement',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Abastecimiento',
    unitId: 'ou-abas',
    status: 'in_progress',
    awaitingMyAction: true,
    globalStatus: 'Gran Compra · pendiente selección en MP (3.5)',
    fullDetail: true,
    currentStep: { id: '3.5', name: 'Selección de oferta Gran Compra' },
  },
  {
    id: 'ADQ-2026-00045',
    glosa: 'Servicio de mantención de flota municipal',
    modality: 'Licitación Pública',
    modalityKey: 'public_tender',
    department: 'Dirección de Obras Municipales',
    departmentId: 'ou-obras',
    unit: 'Dirección de Obras',
    unitId: 'ou-obras',
    status: 'in_progress',
    awaitingMyAction: true,
    globalStatus: 'Contrato suscrito · en espera de OC en MP (3.14)',
    fullDetail: true,
    currentStep: { id: '3.14', name: 'Emisión y aceptación de la OC' },
  },
  {
    id: 'ADQ-2026-00012',
    glosa: 'Repuestos críticos — urgencia operacional',
    modality: 'Trato Directo',
    modalityKey: 'direct_procurement',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Abastecimiento',
    unitId: 'ou-abas',
    status: 'in_progress',
    awaitingMyAction: false,
    globalStatus: 'OC aceptada · recepción (4.1)',
    fullDetail: true,
    currentStep: { id: '4.1', name: 'Registro de la recepción' },
  },
  {
    id: 'ADQ-2026-00142',
    glosa: 'Equipamiento audiovisual sala de consejo',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Administración Municipal',
    departmentId: 'ou-admin',
    unit: 'Unidad Solicitante',
    unitId: 'ou-solicitante',
    status: 'in_progress',
    awaitingMyAction: true,
    globalStatus: 'Sin saldo · pendiente financiamiento (1.4)',
    fullDetail: true,
    currentStep: { id: '1.4', name: 'Solicitar financiamiento a DAF' },
  },
  // --- Stubs solo listado (sin timeline / sin detalle) ---
  {
    id: 'ADQ-2026-00201',
    glosa: 'Toner y consumibles impresoras sector norte',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Administración Municipal',
    departmentId: 'ou-admin',
    unit: 'Unidad Solicitante',
    unitId: 'ou-solicitante',
    status: 'in_progress',
    awaitingMyAction: true,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00202',
    glosa: 'Señalética peatonal — reposición',
    modality: 'Convenio Marco',
    modalityKey: 'framework_agreement',
    department: 'Administración Municipal',
    departmentId: 'ou-admin',
    unit: 'Unidad Solicitante',
    unitId: 'ou-solicitante',
    status: 'completed',
    awaitingMyAction: false,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00210',
    glosa: 'Asfaltado parcial calle Los Aromos',
    modality: 'Licitación Pública',
    modalityKey: 'public_tender',
    department: 'Dirección de Obras Municipales',
    departmentId: 'ou-obras',
    unit: 'Dirección de Obras',
    unitId: 'ou-obras',
    status: 'in_progress',
    awaitingMyAction: true,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00211',
    glosa: 'Herramientas menores taller municipal',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Dirección de Obras Municipales',
    departmentId: 'ou-obras',
    unit: 'Dirección de Obras',
    unitId: 'ou-obras',
    status: 'cancelled',
    awaitingMyAction: false,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00220',
    glosa: 'Cámaras control de velocidad — estudio',
    modality: 'Licitación Pública',
    modalityKey: 'public_tender',
    department: 'Tránsito',
    departmentId: 'ou-transito',
    unit: 'Tránsito',
    unitId: 'ou-transito',
    status: 'in_progress',
    awaitingMyAction: false,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00221',
    glosa: 'Pintura demarcación vial urgente',
    modality: 'Trato Directo',
    modalityKey: 'direct_procurement',
    department: 'Tránsito',
    departmentId: 'ou-transito',
    unit: 'Tránsito',
    unitId: 'ou-transito',
    status: 'in_progress',
    awaitingMyAction: true,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00222',
    glosa: 'Software de simulación de tránsito (licencia)',
    modality: 'Convenio Marco',
    modalityKey: 'framework_agreement',
    department: 'Tránsito',
    departmentId: 'ou-transito',
    unit: 'Tránsito',
    unitId: 'ou-transito',
    status: 'deserted',
    awaitingMyAction: false,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00230',
    glosa: 'Auditoría presupuestaria externa — honorarios',
    modality: 'Trato Directo',
    modalityKey: 'direct_procurement',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Presupuestos',
    unitId: 'ou-presup',
    status: 'in_progress',
    awaitingMyAction: true,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00231',
    glosa: 'Equipamiento ergonómico Tesorería',
    modality: 'Convenio Marco',
    modalityKey: 'framework_agreement',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Tesorería',
    unitId: 'ou-teso',
    status: 'completed',
    awaitingMyAction: false,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00240',
    glosa: 'Capacitación normativa de compras públicas',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Abastecimiento',
    unitId: 'ou-abas',
    status: 'in_progress',
    awaitingMyAction: false,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00241',
    glosa: 'Servicio de digitalización de expedientes DAF',
    modality: 'Licitación Pública',
    modalityKey: 'public_tender',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Abastecimiento',
    unitId: 'ou-abas',
    status: 'cancelled',
    awaitingMyAction: false,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
];

const DEFAULT_ID = 'ADQ-2026-00123';

const STATUS_LABELS = {
  in_progress: 'En curso',
  completed: 'Cerrado',
  cancelled: 'Anulado',
  deserted: 'Desierto',
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function getExpedienteIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('expediente') || DEFAULT_ID;
}

export function getExpedienteProfile(id) {
  const found = expedientesDemo.find((e) => e.id === id);
  if (found?.fullDetail) return found;
  return expedientesDemo.find((e) => e.fullDetail) || expedientesDemo[0];
}

export function getExpedienteDetailUrl(expedienteId) {
  // Trailing slash (dir + index.html). Evitar …/index.html?…: cleanUrls pierde el query.
  return `modulos/adquisiciones/00-expediente/?expediente=${encodeURIComponent(expedienteId)}`;
}

export function listDepartmentsFromDemo() {
  const map = new Map();
  for (const exp of expedientesDemo) {
    if (!map.has(exp.departmentId)) {
      map.set(exp.departmentId, exp.department);
    }
  }
  return [...map.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
}
