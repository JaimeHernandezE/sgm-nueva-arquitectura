/** Expediente ADQ-2026-00142 — Compra Ágil bloqueada por saldo insuficiente; solo 1.4 activo. */

function pendingStage(id, name, summary) {
  return {
    id,
    name,
    status: 'Pendiente',
    summary,
    expanded: false,
    state: 'pending',
    steps: [],
  };
}

export const stages = [
  {
    id: 1,
    name: 'SOLPED',
    status: 'En curso',
    summary: 'Sin saldo · 1.4 activo · 1.5–1.6 bloqueados',
    expanded: true,
    state: 'active',
    totalTime: 'Total etapa (parcial): 1 d 8 h (18-07 → 20-07)',
    note: 'Verificación 1.3 rechazada por BUDGET_UNAVAILABLE. El ciclo principal no avanza hasta resolver financiamiento en Presupuestos y revalidar en 1.3.',
    steps: [
      {
        id: '1.1',
        name: 'Creación de solicitud',
        responsible: { unit: 'Unidad Solicitante', role: 'Solicitante', name: 'Juan Astorga' },
        status: 'done',
        action: { type: 'secondary', label: 'Ver formulario' },
        secondaryLine: 'Tiempo transcurrido: 0 d 2 h · Última modificación: 18-07-2026 · Modalidad indicada: Compra Ágil · Monto estimado: $ 2.450.000',
      },
      {
        id: '1.2',
        name: 'Visto bueno de jefatura',
        responsible: { unit: 'Unidad Solicitante', role: 'Aprobador de unidad', name: 'María Rojas' },
        status: 'done',
        action: { type: 'secondary', label: 'Ver aprobación' },
        secondaryLine: 'Tiempo transcurrido: 0 d 4 h · Última modificación: 19-07-2026',
      },
      {
        id: '1.3',
        name: 'Verificación de disponibilidad presupuestaria',
        responsible: { unit: 'DAF Finanzas', role: 'Formulador DAF / verificación', name: 'Carla Fuentes' },
        status: 'done',
        action: { type: 'secondary', label: 'Ver verificación' },
        secondaryLine: 'Tiempo transcurrido: 0 d 2 h · Última modificación: 20-07-2026 · Saldo insuficiente · BUDGET_UNAVAILABLE · Camino a 1.4',
        origin: { kind: 'module', label: 'Presupuestos', mode: 'dependencia' },
        borderModules: ['Presupuestos'],
      },
      {
        id: '1.4',
        name: 'Solicitar financiamiento a DAF',
        responsible: { unit: 'Unidad Solicitante', role: 'Solicitante', name: 'Juan Astorga' },
        status: 'active',
        current: true,
        action: { type: 'primary', label: 'Completar formulario' },
        secondaryLine: 'Único paso habilitado · Esperando solicitud de financiamiento · Presupuestos (observado)',
        origin: { kind: 'module', label: 'Presupuestos', mode: 'observado' },
        borderModules: ['Presupuestos'],
      },
      {
        id: '1.5',
        name: 'Emisión de CDP firmado',
        responsible: { unit: 'DAF Finanzas', role: 'Firmante CDP', name: '—' },
        status: 'pending',
        action: { type: 'badge', label: 'Pendiente' },
        secondaryLine: 'Bloqueado: requiere disponibilidad confirmada en 1.3',
        origin: { kind: 'module', label: 'Presupuestos', mode: 'dependencia' },
        borderModules: ['Presupuestos'],
      },
      {
        id: '1.6',
        name: 'Generación de preobligación',
        responsible: { unit: 'DAF Finanzas', role: 'Firmante CDP', name: '—' },
        status: 'pending',
        action: { type: 'badge', label: 'Pendiente' },
        secondaryLine: 'Bloqueado: requiere CDP emitido (1.5)',
        origin: { kind: 'module', label: 'Presupuestos', mode: 'dependencia', also: ['Contabilidad'] },
        borderModules: ['Presupuestos', 'Contabilidad'],
      },
    ],
  },
  pendingStage(2, 'Modalidad de Compra', 'Bloqueada hasta cerrar etapa 1'),
  pendingStage(3, 'Resolución de Compra', 'Bloqueada hasta cerrar etapa 1'),
  pendingStage(4, 'Recepción Conforme', 'Bloqueada hasta cerrar etapa 1'),
  pendingStage(5, 'Pago', 'Bloqueada hasta cerrar etapa 1'),
];
