export const expedientesDemo = [
  {
    id: 'ADQ-2026-00123',
    glosa: 'Insumos de oficina — reposición anual',
    modality: 'Compra Ágil',
    unit: 'Unidad Solicitante',
    globalStatus: 'En curso — etapa 3 de 5',
    fullDetail: true,
  },
  {
    id: 'ADQ-2026-00089',
    glosa: 'Mobiliario ergonómico vía Convenio Marco',
    modality: 'Convenio Marco',
    unit: 'DAF Administración',
    globalStatus: 'En curso — etapa 1 de 5',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00045',
    glosa: 'Servicio de mantención de flota municipal',
    modality: 'Licitación Pública',
    unit: 'Dirección de Obras',
    globalStatus: 'Finalizado',
    fullDetail: false,
  },
  {
    id: 'ADQ-2026-00012',
    glosa: 'Repuestos críticos — urgencia operacional',
    modality: 'Trato Directo',
    unit: 'DAF Abastecimiento',
    globalStatus: 'En curso — etapa 2 de 5',
    fullDetail: false,
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
  return `modulos/adquisiciones/00-expediente/index.html?expediente=${encodeURIComponent(expedienteId)}`;
}
