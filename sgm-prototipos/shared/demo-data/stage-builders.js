/** @deprecated Prefer buildStage3* por modalidad. */
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

function doneStep(partial) {
  return {
    status: 'done',
    action: { type: 'secondary', label: 'Ver formulario' },
    ...partial,
  };
}

/** Camino feliz CA: 3.1–3.4 ejecutados (sync MP); 3.5 y 3.6 visibles como caminos alternativos (navegables). */
export function buildStage3CompraAgil() {
  return {
    id: 3,
    name: 'Resolución de Compra',
    status: 'Finalizada',
    summary: '6 sub-pasos · Cotización → OC aceptada · Compromiso cierto',
    expanded: true,
    state: 'done',
    totalTime: 'Total etapa: 4 d 2 h (27-06 → 01-07)',
    note: 'Datos de MP solo por sync (badge Pendiente en MP / Esperando sync MP mientras no hay lectura). 3.5 y 3.6 son caminos alternativos — listados para explorar.',
    steps: [
      doneStep({
        id: '3.1',
        name: 'Período de cotización',
        responsible: { unit: '—', role: 'N/A', name: '(monitoreo MP)' },
        action: { type: 'secondary', label: 'Ver detalle' },
        secondaryLine: 'Tiempo: 2 d 14 h · ID Cotización: 4021-33-COT26 · 4 cotizaciones · Sincronizado desde MP',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.2',
        name: 'Cierre y selección de oferta',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        action: { type: 'secondary', label: 'Ver detalle' },
        secondaryLine: 'Tiempo: 0 d 3 h · Comercial Sur SpA · $ 1.240.000 · Sincronizado desde MP',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.3',
        name: 'Emisión de la Orden de Compra',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        action: { type: 'secondary', label: 'Ver detalle' },
        secondaryLine: 'Tiempo: 0 d 2 h · OC N° 4021-33-SE26 · Sincronizado desde MP',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.4',
        name: 'Aceptación de la OC',
        responsible: { unit: '—', role: 'N/A', name: '(proveedor en MP)' },
        action: { type: 'secondary', label: 'Ver detalle' },
        secondaryLine: 'Tiempo: 1 d 0 h · Vínculo perfeccionado · Compromiso cierto $ 1.240.000 · Lectura confirmada',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.5',
        name: 'Rechazo de la OC',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        action: { type: 'secondary', label: 'Ver camino alternativo' },
        secondaryLine: 'Camino alternativo (excluyente con 3.4) · No ocurrió · Si ocurre: badge Esperando sync MP hasta lectura',
        pendingCondition: 'Excluyente con 3.4 — se muestra para explorar el prototipo de decisión post-rechazo (tras sync).',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.6',
        name: 'Proceso desierto o fallido',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        action: { type: 'secondary', label: 'Ver camino alternativo' },
        secondaryLine: 'Camino alternativo (optativo) · No ocurrió en este expediente',
        pendingCondition: 'Solo si el proceso fracasa — se muestra para explorar republicar / reevaluar / cancelar.',
      }),
    ],
  };
}

/** CM demo = Gran Compra: ruta gran_compra. 3.2 (compra directa), 3.6 y 3.8 visibles como alternativas. */
export function buildStage3ConvenioMarco() {
  return {
    id: 3,
    name: 'Resolución de Compra',
    status: 'Finalizada',
    summary: '8 sub-pasos · Gran Compra → OC aceptada · Compromiso cierto',
    expanded: true,
    state: 'done',
    totalTime: 'Total etapa: 12 d 4 h (14-03 → 26-03)',
    note: 'Ruta del ejemplo: Gran Compra (> 1.000 UTM). 3.2 (Compra Directa), 3.6 (desierta) y 3.8 (rechazo) son caminos alternativos/condicionales — listados para explorar.',
    steps: [
      doneStep({
        id: '3.1',
        name: 'Evaluación de umbral y determinación de ruta',
        responsible: { unit: '—', role: 'N/A', name: '(automático)' },
        secondaryLine: 'Ruta: gran_compra · Monto $ 80.000.000 ≥ 1.000 UTM · UTM mes emisión aplicada',
      }),
      doneStep({
        id: '3.2',
        name: 'Compra Directa por Catálogo',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        action: { type: 'secondary', label: 'Ver ruta alternativa' },
        secondaryLine: 'Ruta alternativa (compra_directa < 1.000 UTM) · No aplica en este expediente',
        pendingCondition: 'Condicional a procurement_route = compra_directa — se muestra para explorar vinculación OC de catálogo.',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.3',
        name: 'Publicación de Intención de Compra / Gran Compra',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        secondaryLine: 'ID Intención: 4021-88-IC26 · Plazo competencia: 10 días corridos',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.4',
        name: 'Período de competencia Gran Compra',
        responsible: { unit: '—', role: 'N/A', name: '(monitoreo MP)' },
        secondaryLine: 'Tiempo transcurrido: 10 d 0 h · 3 ofertas recibidas',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.5',
        name: 'Selección de oferta Gran Compra',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        secondaryLine: 'Mobiliario Chile Ltda. · $ 78.000.000 · Sincronizado desde MP',
        action: { type: 'secondary', label: 'Ver detalle' },
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.6',
        name: 'Gran Compra desierta',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        action: { type: 'secondary', label: 'Ver camino alternativo' },
        secondaryLine: 'Camino alternativo · Caería a compra_directa sobre el mismo folio · No ocurrió · Si aplica: Pendiente en MP hasta lectura',
        pendingCondition: 'Condicional a período sin ofertas — se muestra para explorar la caída automática a Compra Directa.',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.7',
        name: 'Emisión y aceptación de la OC',
        responsible: { unit: '—', role: 'N/A', name: '(proveedor en MP)' },
        action: { type: 'secondary', label: 'Ver detalle' },
        secondaryLine: 'OC N° 4021-88-OC26 · Compromiso cierto $ 78.000.000 · Lectura confirmada',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.8',
        name: 'Rechazo de la OC',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        action: { type: 'secondary', label: 'Ver camino alternativo' },
        secondaryLine: 'Camino alternativo (excluyente con 3.7) · No ocurrió · Si ocurre: Esperando sync MP',
        pendingCondition: 'Excluyente con 3.7 — se muestra para explorar decisión post-rechazo (tras sync).',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
    ],
  };
}

/** LP demo completo (14 sub-pasos). */
export function buildStage3LicitacionPublica() {
  return {
    id: 3,
    name: 'Resolución de Compra',
    status: 'Finalizada',
    summary: '14 sub-pasos · Bases → adjudicación → contrato → OC aceptada',
    expanded: true,
    state: 'done',
    totalTime: 'Total etapa: 68 d (20-01 → 29-03)',
    note: 'Todos los sub-pasos documentados se listan (incluidos condicionales) para recorrer el prototipo completo de Licitación Pública.',
    steps: [
      doneStep({
        id: '3.1',
        name: 'Elaboración de bases administrativas y técnicas',
        responsible: { unit: 'Dirección de Obras / DAF Abastecimiento', role: 'Gestor de compra', name: 'Felipe Rojas' },
        secondaryLine: 'Criterios estructurados · Pesos suman 100% · Estado: approved',
      }),
      doneStep({
        id: '3.2',
        name: 'Revisión jurídica de bases',
        responsible: { unit: 'Departamento Jurídico', role: 'Aprobador de modalidad', name: 'Elena Vargas' },
        secondaryLine: 'V°B° sin observaciones · LegalReview completed',
      }),
      doneStep({
        id: '3.3',
        name: 'Acto administrativo que aprueba las bases',
        responsible: { unit: 'Alcaldía', role: 'Aprobador de modalidad', name: 'Alcalde(sa)' },
        secondaryLine: 'Decreto bases N° 045-2026 · FirmaGob confirmada',
      }),
      doneStep({
        id: '3.4',
        name: 'Toma de Razón de las bases (Contraloría)',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        secondaryLine: 'Condicional por umbral · Toma de razón aprobada · Oficio CGR registrado',
        origin: { kind: 'external', label: 'Contraloría', mode: 'registro manual' },
      }),
      doneStep({
        id: '3.5',
        name: 'Publicación en Mercado Público y vinculación',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        secondaryLine: 'ID Licitación: 4021-12-LP26 · Vinculación diferida desde 2.3',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.6',
        name: 'Foro de preguntas y aclaraciones',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        secondaryLine: 'Período cerrado · Aclaración publicada · Sincronizado desde MP',
        action: { type: 'secondary', label: 'Ver detalle' },
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.7',
        name: 'Recepción y custodia de Garantía de Seriedad',
        responsible: { unit: 'Tesorería', role: 'Gestor de compra', name: 'Patricia Vega' },
        secondaryLine: 'Condicional · 5 instrumentos en custodia · bid_bond',
        origin: { kind: 'module', label: 'Tesorería', mode: 'dependencia' },
        borderModules: ['Tesorería'],
      }),
      doneStep({
        id: '3.8',
        name: 'Acto de apertura electrónica',
        responsible: { unit: '—', role: 'N/A', name: '(en MP)' },
        action: { type: 'secondary', label: 'Ver detalle' },
        secondaryLine: 'Apertura electrónica · 5 ofertas · Sincronizado desde MP',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.9',
        name: 'Comisión evaluadora y acta de evaluación',
        responsible: { unit: 'Comisión ad hoc', role: 'Gestor de compra / Aprobador de modalidad', name: 'Integrantes' },
        secondaryLine: 'Ranking + propuesta · Firma acta · Conflictos declarados',
      }),
      doneStep({
        id: '3.10',
        name: 'Resolución de adjudicación',
        responsible: { unit: 'Alcaldía', role: 'Aprobador de modalidad', name: 'Alcalde(sa)' },
        action: { type: 'secondary', label: 'Ver detalle' },
        secondaryLine: 'Adjudicada a Taller Municipal SpA · $ 178.500.000 · Publicada en MP · Sync lectura',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      doneStep({
        id: '3.11',
        name: 'Toma de Razón de la adjudicación',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        secondaryLine: 'Condicional por umbral · Toma de razón de adjudicación OK',
        origin: { kind: 'external', label: 'Contraloría', mode: 'registro manual' },
      }),
      doneStep({
        id: '3.12',
        name: 'Garantía de Fiel Cumplimiento',
        responsible: { unit: 'Tesorería', role: 'Gestor de compra', name: 'Patricia Vega' },
        secondaryLine: 'Condicional · performance_bond en custodia previo a contrato',
        origin: { kind: 'module', label: 'Tesorería', mode: 'dependencia' },
        borderModules: ['Tesorería'],
      }),
      doneStep({
        id: '3.13',
        name: 'Contrato',
        responsible: { unit: 'Departamento Jurídico / Alcaldía', role: 'Gestor de compra / Aprobador de modalidad', name: 'Elena Vargas' },
        secondaryLine: 'Condicional · Contrato suscrito · Vigencia 12 meses',
      }),
      doneStep({
        id: '3.14',
        name: 'Emisión y aceptación de la OC',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        secondaryLine: 'OC N° 4021-12-LP26-OC · Aceptada · Compromiso cierto',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
    ],
  };
}

/** TD: 4 sub-pasos (Toma de Razón condicional, publicación/vinculación, OC aceptada, rechazo). */
export function buildStage3TratoDirecto() {
  return {
    id: 3,
    name: 'Resolución de Compra',
    status: 'En curso',
    summary: '4 sub-pasos · Publicación MP vinculada · pendiente aceptación OC (hito contable)',
    expanded: true,
    state: 'active',
    totalTime: 'Total etapa: en curso (publicación 07-05)',
    note: 'Vinculación diferida en 3.2; doble validación Publicado + OC Aceptada en 3.3. 3.1 omitido (bajo umbral).',
    steps: [
      {
        id: '3.1',
        name: 'Toma de Razón de la Resolución Fundada',
        status: 'Omitido',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: '—' },
        secondaryLine: 'Monto bajo umbral 8.000 UTM — sub-paso no aplica',
        origin: { kind: 'module', label: 'Contraloría', mode: 'registro manual' },
        borderModules: ['Contraloría'],
        state: 'omitted',
      },
      doneStep({
        id: '3.2',
        name: 'Publicación en Mercado Público y vinculación',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        secondaryLine: 'mp_process_id 4021-05-TD26 · Publicado · MpProcessLinked',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
      }),
      {
        id: '3.3',
        name: 'Emisión de OC y aceptación del proveedor',
        status: 'En curso',
        responsible: { unit: '—', role: 'N/A', name: '(en MP)' },
        secondaryLine: 'Esperando OC Aceptada · Compromiso Cierto pendiente',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
        borderModules: ['Presupuestos'],
        state: 'active',
        action: { label: 'Ver en formulario', form: true },
      },
      {
        id: '3.4',
        name: 'Rechazo de la OC',
        status: 'No iniciado',
        responsible: { unit: 'DAF Abastecimiento', role: 'Gestor de compra', name: 'Rodrigo Muñoz' },
        secondaryLine: 'Camino alternativo — solo si el proveedor rechaza (P-69)',
        origin: { kind: 'external', label: 'Mercado Público', mode: 'solo lectura' },
        state: 'pending',
      },
    ],
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
      responsible: { unit: serviceProfile ? 'Unidad Solicitante' : 'Bodega', role: 'Recepcionista', name: serviceProfile ? 'Juan Astorga' : 'Ana Pérez' },
      status: 'done',
      action: { type: 'secondary', label: 'Ver recepción' },
      secondaryLine: allDone
        ? `Tiempo transcurrido: 0 d 4 h · Contra OC N° ${ocNumber} · ${profileLabel}`
        : `Contra OC N° ${ocNumber} · ${profileLabel}`,
    },
    {
      id: '4.2',
      name: 'Verificación de conformidad',
      responsible: { unit: 'Unidad Solicitante', role: 'Confirmante de recepción', name: 'Juan Astorga' },
      status: 'done',
      action: { type: 'secondary', label: 'Ver conformidad' },
      secondaryLine: allDone
        ? 'Tiempo transcurrido: 0 d 2 h · Doble conformidad validada'
        : 'Doble conformidad: unidad requirente valida entrega',
    },
  ];

  if (!omitInventory) {
    steps.push({
      id: '4.3',
      name: 'Alta en inventario / activo fijo',
      responsible: { unit: 'Bodega', role: 'Recepcionista', name: 'Ana Pérez' },
      status: 'done',
      action: { type: 'secondary', label: 'Ver alta' },
      secondaryLine: allDone
        ? 'Tiempo transcurrido: 0 d 1 h · Bienes físicos registrados en inventario'
        : 'Condicional: solo bienes físicos aceptados',
    });
  } else {
    steps.push({
      id: '4.3',
      name: 'Alta en inventario / activo fijo',
      responsible: { unit: 'Bodega', role: 'Recepcionista', name: '—' },
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
    status: 'done',
    action: { type: 'secondary', label: 'Ver devengado' },
    secondaryLine: allDone
      ? `Tiempo transcurrido: 0 d 0 h · Contra compromiso · Proveedor: ${provider}`
      : `Gatillado por conformidad (4.2) · Proveedor: ${provider} · Arranca reloj legal de pago (30 días)`,
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
    state: 'done',
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
          : `OC ${ocNumber} + recepción + factura · ${provider}`,
        origin: { kind: 'module', label: 'Contabilidad', mode: 'dependencia' },
        borderModules: ['Contabilidad'],
      },
      {
        id: '5.2',
        name: 'Registro de Devengado',
        responsible: { unit: 'Contabilidad', role: 'Operador de pago', name: 'Luis Morales' },
        status: 'done',
        action: { type: 'secondary', label: 'Ver devengado' },
        secondaryLine: allDone ? 'Tiempo transcurrido: 0 d 1 h · Devengado registrado' : 'Requiere match validado (5.1)',
        origin: { kind: 'module', label: 'Contabilidad', mode: 'dependencia' },
        borderModules: ['Contabilidad'],
      },
      {
        id: '5.3',
        name: 'Generación de Decreto de Pago',
        responsible: { unit: 'Contabilidad', role: 'Operador de pago', name: 'Luis Morales' },
        status: 'done',
        action: { type: 'secondary', label: 'Ver decreto' },
        secondaryLine: allDone ? 'Tiempo transcurrido: 0 d 2 h · Firma vía FirmaGob' : 'Firma vía FirmaGob al emitir',
      },
      {
        id: '5.4',
        name: 'Ejecución del pago',
        responsible: { unit: 'Tesorería', role: 'Operador de pago', name: 'Patricia Vega' },        status: 'done',
        action: { type: 'secondary', label: 'Ver pago' },
        secondaryLine: allDone
          ? 'Tiempo transcurrido: 12 d 0 h · Pago ejecutado dentro del plazo legal'
          : 'Plazo legal: 30 días corridos desde factura',
        origin: { kind: 'module', label: 'Tesorería', mode: 'observado' },
        borderModules: ['Tesorería'],
      },
    ],
  };
}
