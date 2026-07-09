import { getExpedienteProfile } from '../expedientes-demo.js';
import { stages as compraAgilStages } from './compra-agil.js';
import { stages as convenioMarcoStages } from './convenio-marco.js';
import { stages as licitacionPublicaStages } from './licitacion-publica.js';
import { stages as tratoDirectoStages } from './trato-directo.js';

const stagesByExpedienteId = {
  'ADQ-2026-00123': compraAgilStages,
  'ADQ-2026-00089': convenioMarcoStages,
  'ADQ-2026-00045': licitacionPublicaStages,
  'ADQ-2026-00012': tratoDirectoStages,
};

export function getStages(expedienteId) {
  const profile = getExpedienteProfile(expedienteId);
  return stagesByExpedienteId[profile.id] || compraAgilStages;
}

/** @deprecated Usar getStages(expedienteId). Mantenido por compatibilidad. */
export const stages = compraAgilStages;

export const expediente = {
  id: 'ADQ-2026-00123',
  glosa: 'Insumos de oficina — reposición anual',
  modality: 'Compra Ágil',
  unit: 'Unidad Solicitante',
  globalStatus: 'Ejemplo transversal — etapa 3 pendiente',
};
