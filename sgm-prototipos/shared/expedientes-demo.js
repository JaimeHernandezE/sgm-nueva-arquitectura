export const DEMO_SOLICITANTE_UNIT_ID = 'ou-solicitante';

export const expedientesDemo = [
  {
    id: 'ADQ-2026-00123',
    createdAt: '2026-03-12T10:15:00-03:00',
    glosa: 'Insumos de oficina — reposición anual',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Administración Municipal',
    departmentId: 'ou-admin',
    unit: 'Unidad Solicitante',
    unitId: 'ou-solicitante',
    status: 'in_progress',
    awaitingMyAction: false,
    requestedAmount: 1250000,
    awardedAmount: 1180000,
    globalStatus: 'En curso · recepción conforme (4.1)',
    fullDetail: true,
    currentStep: { id: '4.1', name: 'Registro de la recepción' },
  },
  {
    id: 'ADQ-2026-00089',
    createdAt: '2026-02-05T09:30:00-03:00',
    glosa: 'Mobiliario ergonómico vía Convenio Marco',
    modality: 'Convenio Marco',
    modalityKey: 'framework_agreement',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Abastecimiento',
    unitId: 'ou-abas',
    status: 'in_progress',
    awaitingMyAction: true,
    requestedAmount: 8900000,
    awardedAmount: null,
    globalStatus: 'Gran Compra · pendiente selección en MP (3.5)',
    fullDetail: true,
    currentStep: { id: '3.5', name: 'Selección de oferta Gran Compra' },
  },
  {
    id: 'ADQ-2026-00045',
    createdAt: '2026-01-20T14:00:00-03:00',
    glosa: 'Servicio de mantención de flota municipal',
    modality: 'Licitación Pública',
    modalityKey: 'public_tender',
    department: 'Dirección de Obras Municipales',
    departmentId: 'ou-obras',
    unit: 'Dirección de Obras',
    unitId: 'ou-obras',
    status: 'in_progress',
    awaitingMyAction: true,
    requestedAmount: 185000000,
    awardedAmount: 178500000,
    globalStatus: 'Contrato suscrito · en espera de OC en MP (3.14)',
    fullDetail: true,
    currentStep: { id: '3.14', name: 'Emisión y aceptación de la OC' },
  },
  {
    id: 'ADQ-2026-00012',
    createdAt: '2026-01-08T11:45:00-03:00',
    glosa: 'Repuestos críticos — urgencia operacional',
    modality: 'Trato Directo',
    modalityKey: 'direct_procurement',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Abastecimiento',
    unitId: 'ou-abas',
    status: 'in_progress',
    awaitingMyAction: false,
    requestedAmount: 2450000,
    awardedAmount: 2450000,
    globalStatus: 'OC aceptada · recepción (4.1)',
    fullDetail: true,
    currentStep: { id: '4.1', name: 'Registro de la recepción' },
  },
  {
    id: 'ADQ-2026-00142',
    createdAt: '2026-03-18T08:20:00-03:00',
    glosa: 'Equipamiento audiovisual sala de consejo',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Administración Municipal',
    departmentId: 'ou-admin',
    unit: 'Unidad Solicitante',
    unitId: 'ou-solicitante',
    status: 'in_progress',
    awaitingMyAction: true,
    requestedAmount: 4200000,
    awardedAmount: null,
    globalStatus: 'Sin saldo · pendiente financiamiento (1.4)',
    fullDetail: true,
    currentStep: { id: '1.4', name: 'Solicitar financiamiento a DAF' },
  },
  // --- Stubs solo listado (sin timeline / sin detalle) ---
  {
    id: 'ADQ-2026-00201',
    createdAt: '2026-03-01T16:00:00-03:00',
    glosa: 'Toner y consumibles impresoras sector norte',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Administración Municipal',
    departmentId: 'ou-admin',
    unit: 'Unidad Solicitante',
    unitId: 'ou-solicitante',
    status: 'in_progress',
    awaitingMyAction: true,
    requestedAmount: 680000,
    awardedAmount: null,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00202',
    createdAt: '2026-01-28T12:00:00-03:00',
    glosa: 'Señalética peatonal — reposición',
    modality: 'Convenio Marco',
    modalityKey: 'framework_agreement',
    department: 'Administración Municipal',
    departmentId: 'ou-admin',
    unit: 'Unidad Solicitante',
    unitId: 'ou-solicitante',
    status: 'completed',
    awaitingMyAction: false,
    requestedAmount: 3100000,
    awardedAmount: 2950000,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00210',
    createdAt: '2026-02-14T10:00:00-03:00',
    glosa: 'Asfaltado parcial calle Los Aromos',
    modality: 'Licitación Pública',
    modalityKey: 'public_tender',
    department: 'Dirección de Obras Municipales',
    departmentId: 'ou-obras',
    unit: 'Dirección de Obras',
    unitId: 'ou-obras',
    status: 'in_progress',
    awaitingMyAction: true,
    requestedAmount: 95200000,
    awardedAmount: null,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00211',
    createdAt: '2026-02-22T15:30:00-03:00',
    glosa: 'Herramientas menores taller municipal',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Dirección de Obras Municipales',
    departmentId: 'ou-obras',
    unit: 'Dirección de Obras',
    unitId: 'ou-obras',
    status: 'cancelled',
    awaitingMyAction: false,
    requestedAmount: 450000,
    awardedAmount: null,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00220',
    createdAt: '2026-03-05T09:00:00-03:00',
    glosa: 'Cámaras control de velocidad — estudio',
    modality: 'Licitación Pública',
    modalityKey: 'public_tender',
    department: 'Tránsito',
    departmentId: 'ou-transito',
    unit: 'Tránsito',
    unitId: 'ou-transito',
    status: 'in_progress',
    awaitingMyAction: false,
    requestedAmount: 22000000,
    awardedAmount: null,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00221',
    createdAt: '2026-03-10T13:15:00-03:00',
    glosa: 'Pintura demarcación vial urgente',
    modality: 'Trato Directo',
    modalityKey: 'direct_procurement',
    department: 'Tránsito',
    departmentId: 'ou-transito',
    unit: 'Tránsito',
    unitId: 'ou-transito',
    status: 'in_progress',
    awaitingMyAction: true,
    requestedAmount: 1750000,
    awardedAmount: null,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00222',
    createdAt: '2026-01-15T11:00:00-03:00',
    glosa: 'Software de simulación de tránsito (licencia)',
    modality: 'Convenio Marco',
    modalityKey: 'framework_agreement',
    department: 'Tránsito',
    departmentId: 'ou-transito',
    unit: 'Tránsito',
    unitId: 'ou-transito',
    status: 'deserted',
    awaitingMyAction: false,
    requestedAmount: 5600000,
    awardedAmount: null,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00230',
    createdAt: '2026-02-28T17:00:00-03:00',
    glosa: 'Auditoría presupuestaria externa — honorarios',
    modality: 'Trato Directo',
    modalityKey: 'direct_procurement',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Presupuestos',
    unitId: 'ou-presup',
    status: 'in_progress',
    awaitingMyAction: true,
    requestedAmount: 9800000,
    awardedAmount: null,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00231',
    createdAt: '2025-12-10T10:30:00-03:00',
    glosa: 'Equipamiento ergonómico Tesorería',
    modality: 'Convenio Marco',
    modalityKey: 'framework_agreement',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Tesorería',
    unitId: 'ou-teso',
    status: 'completed',
    awaitingMyAction: false,
    requestedAmount: 4100000,
    awardedAmount: 3980000,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00240',
    createdAt: '2026-03-15T08:45:00-03:00',
    glosa: 'Capacitación normativa de compras públicas',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Abastecimiento',
    unitId: 'ou-abas',
    status: 'in_progress',
    awaitingMyAction: false,
    requestedAmount: 920000,
    awardedAmount: null,
    globalStatus: 'Solo listado · sin contenido',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00241',
    createdAt: '2026-02-01T14:20:00-03:00',
    glosa: 'Servicio de digitalización de expedientes DAF',
    modality: 'Licitación Pública',
    modalityKey: 'public_tender',
    department: 'Finanzas',
    departmentId: 'ou-fin',
    unit: 'Abastecimiento',
    unitId: 'ou-abas',
    status: 'cancelled',
    awaitingMyAction: false,
    requestedAmount: 15000000,
    awardedAmount: null,
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

const CLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

/** Monto mostrado en listado: adjudicado si existe; si no, solicitado. */
export function displayAmount(exp) {
  if (exp.awardedAmount != null) {
    return { value: exp.awardedAmount, kind: 'awarded' };
  }
  if (exp.requestedAmount != null) {
    return { value: exp.requestedAmount, kind: 'requested' };
  }
  return null;
}

export function formatCreatedAt(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
}

export function formatClp(amount) {
  return CLP.format(amount);
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
