export function stage3Stub(modalityLabel, docsPath) {
  return {
    id: 3,
    name: 'Resolución de Compra',
    status: 'Pendiente',
    summary: `Prototipo pendiente — subproceso de ${modalityLabel}`,
    expanded: false,
    state: 'pending',
    note: `Sub-pasos específicos documentados en ${docsPath}`,
    steps: [],
  };
}

export function buildStage4({
  profileLabel,
  ocNumber,
  provider,
  omitInventory = false,
  allDone = false,
  serviceProfile = false,
}) {
  const note = serviceProfile
    ? 'Perfil de recepción: servicio, hitos de ejecución. Camino 4.5 (no conforme) no se lista como pendiente — aparece solo si hay rechazo.'
    : 'Perfil de recepción: bien físico, entrega única. Camino 4.5 (no conforme) no se lista como pendiente — aparece solo si hay rechazo.';

  const steps = [
    {
      id: '4.1',
      name: 'Registro de la recepción',
      responsible: { unit: serviceProfile ? 'Unidad Solicitante' : 'Bodega', role: 'Usuario', name: serviceProfile ? 'Juan Astorga' : 'Ana Pérez' },
      status: allDone ? 'done' : 'done',
      action: { type: 'secondary', label: 'Ver recepción' },
      secondaryLine: allDone
        ? `Tiempo transcurrido: 0 d 4 h · Contra OC N° ${ocNumber} · ${profileLabel}`
        : `Ejemplo ilustrativo · Contra OC N° ${ocNumber} (referencia ficticia — etapa 3 pendiente)`,
    },
    {
      id: '4.2',
      name: 'Verificación de conformidad',
      responsible: { unit: 'Unidad Solicitante', role: 'Aprobador', name: 'Juan Astorga' },
      status: allDone ? 'done' : 'done',
      action: { type: 'secondary', label: 'Ver conformidad' },
      secondaryLine: allDone
        ? 'Tiempo transcurrido: 0 d 2 h · Doble conformidad validada'
        : 'Ejemplo ilustrativo · Doble conformidad: unidad requirente valida entrega',
    },
  ];

  if (!omitInventory) {
    steps.push({
      id: '4.3',
      name: 'Alta en inventario / activo fijo',
      responsible: { unit: 'Bodega', role: 'Usuario', name: 'Ana Pérez' },
      status: allDone ? 'done' : 'done',
      action: { type: 'secondary', label: 'Ver alta' },
      secondaryLine: allDone
        ? 'Tiempo transcurrido: 0 d 1 h · Bienes físicos registrados en inventario'
        : 'Ejemplo ilustrativo · Condicional: solo bienes físicos aceptados',
    });
  } else {
    steps.push({
      id: '4.3',
      name: 'Alta en inventario / activo fijo',
      responsible: { unit: 'Bodega', role: 'Usuario', name: '—' },
      status: 'omitted',
      omitted: true,
      action: { type: 'badge', label: 'Omitido (optativo)' },
      secondaryLine: 'No aplica: recepción de servicio sin inventario físico',
    });
  }

  steps.push({
    id: '4.4',
    name: 'Devengado',
    responsible: { unit: 'Contabilidad', role: 'N/A', name: '(automático)' },
    status: allDone ? 'done' : 'done',
    action: { type: 'secondary', label: 'Ver devengado' },
    secondaryLine: allDone
      ? `Tiempo transcurrido: 0 d 0 h · Contra compromiso · Proveedor: ${provider}`
      : 'Ejemplo ilustrativo · Gatillado por conformidad (4.2) · Arranca reloj legal de pago (30 días)',
    origin: { kind: 'module', label: 'Contabilidad', mode: 'dependencia' },
    borderModules: ['Contabilidad'],
  });

  return {
    id: 4,
    name: 'Recepción Conforme',
    status: allDone ? 'Finalizada' : 'Ejemplo ilustrativo',
    summary: profileLabel,
    expanded: true,
    state: 'done',
    totalTime: allDone ? 'Total etapa: 0 d 7 h' : undefined,
    note,
    steps,
  };
}

export function buildStage5({ allDone = false, ocNumber, provider }) {
  return {
    id: 5,
    name: 'Pago',
    status: allDone ? 'Finalizada' : 'Ejemplo ilustrativo',
    summary: allDone
      ? 'Match validado · Pago ejecutado'
      : 'Etapa observada · Tesorería · Ejemplo de sub-pasos transversales',
    expanded: true,
    state: allDone ? 'done' : 'done',
    totalTime: allDone ? 'Total etapa: 12 d 3 h' : undefined,
    note: 'Etapa observada — los sub-pasos reflejan eventos de Contabilidad y Tesorería; el reloj legal de pago (30 días) se activa al recibirse la factura.',
    steps: [
      {
        id: '5.1',
        name: 'Cruce de 3 vías (Match)',
        responsible: { unit: 'Contabilidad', role: 'N/A', name: '(automático)' },
        status: 'done',
        action: { type: 'secondary', label: 'Ver match' },
        secondaryLine: allDone
          ? `Match OK · OC ${ocNumber} + recepción conforme + factura SII · ${provider}`
          : `Ejemplo ilustrativo · OC ${ocNumber} + recepción + factura (referencia ficticia)`,
        origin: { kind: 'module', label: 'Contabilidad', mode: 'dependencia' },
        borderModules: ['Contabilidad'],
      },
      {
        id: '5.2',
        name: 'Registro de Devengado',
        responsible: { unit: 'Contabilidad', role: 'Aprobador', name: 'Luis Morales' },
        status: 'done',
        action: { type: 'secondary', label: 'Ver devengado' },
        secondaryLine: allDone ? 'Tiempo transcurrido: 0 d 1 h · Devengado registrado' : 'Ejemplo ilustrativo · Requiere match validado (5.1)',
        origin: { kind: 'module', label: 'Contabilidad', mode: 'dependencia' },
        borderModules: ['Contabilidad'],
      },
      {
        id: '5.3',
        name: 'Generación de Decreto de Pago',
        responsible: { unit: 'Contabilidad', role: 'Aprobador', name: 'Luis Morales' },
        status: 'done',
        action: { type: 'secondary', label: 'Ver decreto' },
        secondaryLine: allDone ? 'Tiempo transcurrido: 0 d 2 h · Firma vía FirmaGob' : 'Ejemplo ilustrativo · Firma vía FirmaGob al emitir',
      },
      {
        id: '5.4',
        name: 'Ejecución del pago',
        responsible: { unit: 'Tesorería', role: 'Aprobador', name: 'Patricia Vega' },
        status: 'done',
        action: { type: 'secondary', label: 'Ver pago' },
        secondaryLine: allDone ? 'Tiempo transcurrido: 12 d 0 h · Pago ejecutado dentro del plazo legal' : 'Ejemplo ilustrativo · Plazo legal: 30 días corridos desde factura',
        origin: { kind: 'module', label: 'Tesorería', mode: 'observado' },
        borderModules: ['Tesorería'],
      },
    ],
  };
}
