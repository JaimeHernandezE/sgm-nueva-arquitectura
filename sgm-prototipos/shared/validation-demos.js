/**
 * Catálogo demo de ValidationErrorResponse por operationId.
 * Alineado a fichas § Validaciones — no valida el DOM; ilustra el contrato API.
 */

/** @typedef {{ error_code: string, field?: string|null, rule: string, legal_reference?: string|null, severity: 'blocking'|'advisory' }} ValidationIssue */
/** @typedef {{ title: string, issues: ValidationIssue[] }} ValidationDemo */

/** @type {Record<string, ValidationDemo>} */
export const VALIDATION_DEMOS = {
  submitPurchaseRequest: {
    title: 'Validaciones — Enviar a aprobación',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'requesting_unit', rule: 'El campo Unidad solicitante es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'destination_unit', rule: 'El campo Unidad de destino es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'title', rule: 'El campo Título es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'description', rule: 'El campo Descripción es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'justification', rule: 'El campo Justificación es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'requested_date', rule: 'El campo Fecha solicitada es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  createPurchaseRequest: {
    title: 'Validaciones — Guardar borrador',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'requesting_unit', rule: 'El campo Unidad solicitante es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'destination_unit', rule: 'El campo Unidad de destino es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'title', rule: 'El campo Título es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'description', rule: 'El campo Descripción es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'justification', rule: 'El campo Justificación es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  approvePurchaseRequest: {
    title: 'Validaciones — Aprobar SOLPED',
    issues: [
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', legal_reference: 'Ley 19.799 — firma electrónica avanzada', severity: 'blocking' },
      { error_code: 'UNAUTHORIZED_APPROVER', field: 'approver_id', rule: 'Solo el aprobador de jefatura de la unidad de destino puede aprobar.', legal_reference: 'integridad:rol_operacion', severity: 'blocking' },
    ],
  },
  rejectPurchaseRequest: {
    title: 'Validaciones — Rechazar SOLPED',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'comments', rule: 'El campo Comentarios es obligatorio al rechazar.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  verifyBudgetAvailability: {
    title: 'Validaciones — Verificar disponibilidad',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'budget_line_id', rule: 'El campo Imputación presupuestaria es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'amount', rule: 'El campo Monto es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'BUDGET_UNAVAILABLE', field: 'budget_line_id', rule: 'La imputación presupuestaria no tiene saldo disponible para el monto solicitado.', legal_reference: 'DL 1.263 — fase de compromiso presupuestario', severity: 'blocking' },
    ],
  },
  requestBudgetFinancing: {
    title: 'Validaciones — Solicitar financiamiento',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'justification', rule: 'El campo Justificación es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  issueBudgetAvailabilityCertificate: {
    title: 'Validaciones — Emitir CDP',
    issues: [
      { error_code: 'VERIFICATION_REQUIRED', field: null, rule: 'Debe existir verificación presupuestaria confirmada en 1.3.', legal_reference: 'DL 1.263 — disponibilidad previa al CDP', severity: 'blocking' },
      { error_code: 'SEGREGATION_OF_DUTIES_VIOLATION', field: 'signed_by', rule: 'El firmante CDP no puede ser la misma persona que verificó en 1.3.', legal_reference: 'Control interno — segregación de funciones; ⚠ P-25', severity: 'blocking' },
    ],
  },
  registerScannedBudgetAvailabilityCertificate: {
    title: 'Validaciones — Registrar CDP escaneado',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'scanned_certificate_attachment', rule: 'El campo Adjunto del CDP escaneado es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'SCANNED_CDP_INVALID', field: 'scanned_certificate_attachment', rule: 'El adjunto del CDP escaneado es inválido o inconsistente.', legal_reference: 'integridad:documento_requerido', severity: 'blocking' },
    ],
  },
  createBudgetPreCommitment: {
    title: 'Validaciones — Generar preobligación',
    issues: [
      { error_code: 'CDP_REQUIRED', field: 'budget_availability_certificate_id', rule: 'Se requiere un CDP vigente para generar la preobligación.', legal_reference: 'DL 1.263 — certificado de disponibilidad presupuestaria', severity: 'blocking' },
      { error_code: 'BUDGET_UNAVAILABLE', field: 'budget_line_id', rule: 'La imputación presupuestaria no tiene saldo disponible para el monto estimado.', legal_reference: 'DL 1.263 — fase de compromiso presupuestario', severity: 'blocking' },
    ],
  },
  confirmProcurementModality: {
    title: 'Validaciones — Confirmar modalidad',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'selected_modality', rule: 'El campo Modalidad de compra es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'FRAMEWORK_AGREEMENT_FIRST_OPTION', field: 'catalog_bypass_justification', rule: 'Existe cobertura en Convenio Marco; se exige justificación para elegir otra modalidad.', legal_reference: 'Ley 19.886 / DS 661/2024 — Convenio Marco como primera opción (NormativeParameter)', severity: 'blocking' },
      { error_code: 'PUBLIC_TENDER_SUGGESTED', field: 'selected_modality', rule: 'Se sugiere Licitación Pública según monto y cobertura de catálogo.', legal_reference: 'Ley 19.886 — Licitación Pública como vía general', severity: 'advisory' },
    ],
  },
  approveModalityDecision: {
    title: 'Validaciones — Aprobar modalidad',
    issues: [
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', legal_reference: 'Ley 19.799 — firma electrónica avanzada', severity: 'blocking' },
      { error_code: 'SEGREGATION_OF_DUTIES_VIOLATION', field: 'approver_id', rule: 'Quien aprueba no puede ser quien decidió la modalidad en 2.1.', legal_reference: 'Control interno — segregación de funciones; ⚠ P-25', severity: 'blocking' },
    ],
  },
  rejectModalityDecision: {
    title: 'Validaciones — Rechazar modalidad',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'comments', rule: 'El campo Comentarios es obligatorio al rechazar.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  getUtmValue: {
    title: 'Validaciones — Obtener valor UTM',
    issues: [
      { error_code: 'UTM_VALUE_UNAVAILABLE', field: null, rule: 'Fuente UTM no disponible y sin valor cacheado del mes en curso; la evaluación de umbral no puede ejecutarse.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  linkMpProcess: {
    title: 'Validaciones — Vincular proceso MP',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'mp_process_id', rule: 'El campo Código / ID de proceso MP es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MP_PROCESS_NOT_FOUND', field: 'mp_process_id', rule: 'El proceso MP no existe o el código es inválido.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MP_PROCESS_TYPE_MISMATCH', field: 'mp_process_id', rule: 'El tipo de proceso MP no coincide con la modalidad confirmada.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  registerReceipt: {
    title: 'Validaciones — Registrar recepción',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'received_date', rule: 'El campo Fecha de recepción es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'lines', rule: 'Debe registrarse al menos una línea de recepción.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'RECEIPT_EXCEEDS_ORDER', field: 'lines[].quantity_received', rule: 'La cantidad recibida supera la cantidad pendiente de la línea de OC.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  confirmReceipt: {
    title: 'Validaciones — Confirmar conformidad',
    issues: [
      { error_code: 'SEGREGATION_OF_DUTIES_VIOLATION', field: 'confirmed_by', rule: 'Quien confirma no puede ser quien aprobó la compra.', legal_reference: 'Control interno — segregación de funciones; ⚠ P-25', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'conformity', rule: 'El campo Resultado de conformidad es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  performThreeWayMatch: {
    title: 'Validaciones — Cruce de 3 vías',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'invoice_number', rule: 'El campo Número de factura es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'GOODS_RECEIPT_REQUIRED', field: 'goods_receipt_id', rule: 'Se requiere recepción conforme para el cruce de 3 vías.', legal_reference: 'Ley 19.886 / reglamento — recepción conforme previa al pago', severity: 'blocking' },
      { error_code: 'MATCH_DISCREPANCY', field: null, rule: 'Hay discrepancia entre OC, recepción y factura.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  registerAccrual: {
    title: 'Validaciones — Registrar devengado',
    issues: [
      { error_code: 'THREE_WAY_MATCH_REQUIRED', field: 'three_way_match_id', rule: 'El cruce de 3 vías debe estar en estado matched.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
      { error_code: 'ACCOUNTING_PROVIDER_UNAVAILABLE', field: null, rule: 'Contabilidad no está disponible.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  issuePaymentDecree: {
    title: 'Validaciones — Emitir decreto de pago',
    issues: [
      { error_code: 'ACCRUAL_NOT_REGISTERED', field: 'accrual_id', rule: 'Se requiere un devengado registrado en Contabilidad.', legal_reference: 'DL 1.263 — fase de devengo', severity: 'blocking' },
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', legal_reference: 'Ley 19.799 — firma electrónica avanzada', severity: 'blocking' },
    ],
  },
  executePayment: {
    title: 'Validaciones — Ejecutar pago',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'payment_method', rule: 'El campo Medio de pago es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'TREASURY_PROVIDER_UNAVAILABLE', field: null, rule: 'Tesorería no está disponible.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  syncPurchaseOrderAccepted: {
    title: 'Validaciones — Sync OC aceptada',
    issues: [
      { error_code: 'BUDGET_UNAVAILABLE', field: 'budget_line_id', rule: 'La imputación presupuestaria no tiene saldo disponible para el compromiso.', legal_reference: 'DL 1.263 — fase de compromiso presupuestario', severity: 'blocking' },
      { error_code: 'MP_PROCESS_NOT_PUBLISHED', field: null, rule: 'El proceso MP vinculado no figura como Publicado; no se registra Compromiso Cierto.', legal_reference: 'Ley 19.886 — publicidad en Mercado Público', severity: 'blocking' },
      { error_code: 'PRE_COMMITMENT_INACTIVE', field: null, rule: 'La preobligación ya no está activa; no se puede registrar el compromiso cierto.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
      { error_code: 'MP_PROVIDER_UNAVAILABLE', field: null, rule: 'Mercado Público no está disponible para leer el estado de la OC.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  recordPurchaseOrderRejectionDecision: {
    title: 'Validaciones — Decisión tras rechazo de OC',
    issues: [
      { error_code: 'NO_ALTERNATIVE_PROVIDER_AVAILABLE', field: 'decision', rule: 'No hay proveedor alternativo en catálogo para emitir la siguiente OC.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
      { error_code: 'BUDGET_PROVIDER_UNAVAILABLE', field: null, rule: 'El proveedor de presupuesto no está disponible.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  releasePreCommitment: {
    title: 'Validaciones — Liberar preobligación',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'decision', rule: 'El campo Decisión es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'BUDGET_PROVIDER_UNAVAILABLE', field: null, rule: 'El proveedor de Presupuestos no está disponible.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  createTenderBases: {
    title: 'Validaciones — Guardar bases',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'technical_bases_ref', rule: 'Las bases técnicas son obligatorias.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'administrative_bases_ref', rule: 'Las bases administrativas son obligatorias.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'CRITERIA_WEIGHTS_INVALID', field: 'criteria', rule: 'La suma de ponderaciones de criterios debe ser 100%.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  submitBasesForLegalReview: {
    title: 'Validaciones — Enviar a revisión jurídica',
    issues: [
      { error_code: 'INVALID_STATUS', field: 'status', rule: 'Las bases deben estar en borrador para enviar a revisión.', legal_reference: 'integridad:estado_expediente', severity: 'blocking' },
    ],
  },
  recordLegalReview: {
    title: 'Validaciones — Registrar revisión jurídica',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'outcome', rule: 'El campo Resultado es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'observations', rule: 'Las observaciones son obligatorias si el resultado es observaciones.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  approveTenderBases: {
    title: 'Validaciones — Aprobar bases',
    issues: [
      { error_code: 'LEGAL_REVIEW_REQUIRED', field: null, rule: 'Se requiere visto bueno jurídico previo.', legal_reference: 'Ley 19.886 — bases de licitación', severity: 'blocking' },
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', legal_reference: 'Ley 19.799 — firma electrónica avanzada', severity: 'blocking' },
    ],
  },
  designateEvaluationCommittee: {
    title: 'Validaciones — Designar comisión',
    issues: [
      { error_code: 'CONFLICT_DECLARATION_REQUIRED', field: 'members[].conflict_declaration_ref', rule: 'Cada integrante debe declarar conflictos de interés.', legal_reference: 'Ley 19.886 / integridad comisión evaluadora', severity: 'blocking' },
      { error_code: 'COMMITTEE_MEMBER_CONFLICT', field: 'members', rule: 'Un integrante es incompatible con el requerimiento o las bases.', legal_reference: 'Ley 19.886 — incompatibilidad comisión evaluadora', severity: 'blocking' },
    ],
  },
  recordOfferAdmissibility: {
    title: 'Validaciones — Admisibilidad de ofertas',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'offers[].inadmissibility_cause', rule: 'La causal es obligatoria si la oferta es inadmisible.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  recordEvaluationScores: {
    title: 'Validaciones — Puntajes de evaluación',
    issues: [
      { error_code: 'SCORES_INCONSISTENT_WITH_CRITERIA', field: 'scores', rule: 'Los puntajes no cuadran con los pesos de los criterios.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  signEvaluationReport: {
    title: 'Validaciones — Firmar acta de evaluación',
    issues: [
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', legal_reference: 'Ley 19.799 — firma electrónica avanzada', severity: 'blocking' },
    ],
  },
  registerGuaranteeCustody: {
    title: 'Validaciones — Registrar garantía',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'instrument_document_ref', rule: 'El documento del instrumento es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'amount', rule: 'El campo Monto de la garantía es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  recordClarification: {
    title: 'Validaciones — Registrar aclaración',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'clarification_document_ref', rule: 'El documento de aclaración es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  issueAwardResolution: {
    title: 'Validaciones — Resolución de adjudicación',
    issues: [
      { error_code: 'AWARD_JUSTIFICATION_REQUIRED', field: 'justification', rule: 'La justificación de adjudicación es obligatoria.', legal_reference: 'Ley 19.886 — resolución de adjudicación', severity: 'blocking' },
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', legal_reference: 'Ley 19.799 — firma electrónica avanzada', severity: 'blocking' },
    ],
  },
  draftContract: {
    title: 'Validaciones — Borrador de contrato',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'contract_document_ref', rule: 'El documento del contrato es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  signContract: {
    title: 'Validaciones — Firmar contrato',
    issues: [
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', legal_reference: 'Ley 19.799 — firma electrónica avanzada', severity: 'blocking' },
    ],
  },
  submitToComptroller: {
    title: 'Validaciones — Enviar a Contraloría',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'submitted_at', rule: 'La fecha de envío es obligatoria.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
  recordComptrollerOutcome: {
    title: 'Validaciones — Resultado Contraloría',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'outcome', rule: 'El campo Resultado de Contraloría es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'outcome_at', rule: 'El campo Fecha de resultado es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'official_document_ref', rule: 'El oficio de respuesta (archivo) es obligatorio.', legal_reference: 'integridad:campo_requerido', severity: 'blocking' },
    ],
  },
};

/**
 * @param {string} operationId
 * @returns {ValidationDemo|null}
 */
export function getValidationDemo(operationId) {
  return VALIDATION_DEMOS[operationId] || null;
}
