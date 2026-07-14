export const expedientesDemo = [
  {
    id: 'ADQ-2026-00123',
    glosa: 'Insumos de oficina — reposición anual',
    modality: 'Compra Ágil',
    modalityKey: 'agile_purchase',
    unit: 'Unidad Solicitante',
    globalStatus: 'Showcase · 5 etapas · Resolución de Compra completa',
    fullDetail: true,
  },
  {
    id: 'ADQ-2026-00089',
    glosa: 'Mobiliario ergonómico vía Convenio Marco',
    modality: 'Convenio Marco',
    modalityKey: 'framework_agreement',
    unit: 'DAF Administración',
    globalStatus: 'Showcase · Gran Compra · Resolución de Compra completa',
    fullDetail: true,
  },
  {
    id: 'ADQ-2026-00045',
    glosa: 'Servicio de mantención de flota municipal',
    modality: 'Licitación Pública',
    modalityKey: 'public_tender',
    unit: 'Dirección de Obras',
    globalStatus: 'Finalizado (showcase transversal)',
    fullDetail: true,
  },
  {
    id: 'ADQ-2026-00012',
    glosa: 'Repuestos críticos — urgencia operacional',
    modality: 'Trato Directo',
    modalityKey: 'direct_procurement',
    unit: 'DAF Abastecimiento',
    globalStatus: 'Showcase · Resolución de Compra completa',
    fullDetail: true,
  },
];

const DEFAULT_ID = 'ADQ-2026-00123';

export function getExpedienteIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('expediente') || DEFAULT_ID;
}

export function getExpedienteProfile(id) {
  return expedientesDemo.find((e) => e.id === id) || expedientesDemo[0];
}

export function getExpedienteDetailUrl(expedienteId) {
  // Trailing slash (dir + index.html). Evitar …/index.html?…: cleanUrls pierde el query.
  return `modulos/adquisiciones/00-expediente/?expediente=${encodeURIComponent(expedienteId)}`;
}
