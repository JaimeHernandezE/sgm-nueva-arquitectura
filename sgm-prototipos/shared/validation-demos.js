/**
 * Catálogo demo de ValidationErrorResponse por operationId.
 * Alineado a fichas § Validaciones — no valida el DOM; ilustra el contrato API.
 */

/** @typedef {{ error_code: string, field?: string|null, rule: string, severity: 'blocking'|'advisory' }} ValidationIssue */
/** @typedef {{ title: string, issues: ValidationIssue[] }} ValidationDemo */

/** @type {Record<string, ValidationDemo>} */
export const VALIDATION_DEMOS = {
  submitPurchaseRequest: {
    title: 'Validaciones — Enviar a aprobación',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'requesting_unit', rule: 'El campo Unidad solicitante es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'description', rule: 'El campo Descripción es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'justification', rule: 'El campo Justificación es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'requested_date', rule: 'El campo Fecha de necesidad es obligatorio.', severity: 'blocking' },
    ],
  },
  createPurchaseRequest: {
    title: 'Validaciones — Guardar borrador',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'requesting_unit', rule: 'El campo Unidad solicitante es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'description', rule: 'El campo Descripción es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'justification', rule: 'El campo Justificación es obligatorio.', severity: 'blocking' },
    ],
  },
  approvePurchaseRequest: {
    title: 'Validaciones — Aprobar SOLPED',
    issues: [
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', severity: 'blocking' },
      { error_code: 'UNAUTHORIZED_APPROVER', field: 'approver_id', rule: 'Solo el aprobador de jefatura de la unidad solicitante puede aprobar.', severity: 'blocking' },
    ],
  },
  rejectPurchaseRequest: {
    title: 'Validaciones — Rechazar SOLPED',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'comments', rule: 'El campo Comentarios es obligatorio al rechazar.', severity: 'blocking' },
    ],
  },
  verifyBudgetAvailability: {
    title: 'Validaciones — Verificar disponibilidad',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'budget_line_id', rule: 'El campo Línea presupuestaria es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'amount', rule: 'El campo Monto es obligatorio.', severity: 'blocking' },
      { error_code: 'BUDGET_UNAVAILABLE', field: 'budget_line_id', rule: 'La línea presupuestaria no tiene saldo disponible para el monto solicitado.', severity: 'blocking' },
    ],
  },
  requestBudgetFinancing: {
    title: 'Validaciones — Solicitar financiamiento',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'justification', rule: 'El campo Justificación es obligatorio.', severity: 'blocking' },
    ],
  },
  issueBudgetAvailabilityCertificate: {
    title: 'Validaciones — Emitir CDP',
    issues: [
      { error_code: 'VERIFICATION_REQUIRED', field: null, rule: 'Debe existir verificación presupuestaria confirmada en 1.3.', severity: 'blocking' },
      { error_code: 'SEGREGATION_OF_DUTIES_VIOLATION', field: 'signed_by', rule: 'El firmante CDP no puede ser la misma persona que verificó en 1.3.', severity: 'blocking' },
    ],
  },
  registerScannedBudgetAvailabilityCertificate: {
    title: 'Validaciones — Registrar CDP escaneado',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'scanned_certificate_attachment', rule: 'El campo Adjunto del CDP escaneado es obligatorio.', severity: 'blocking' },
      { error_code: 'SCANNED_CDP_INVALID', field: 'scanned_certificate_attachment', rule: 'El adjunto del CDP escaneado es inválido o inconsistente.', severity: 'blocking' },
    ],
  },
  createBudgetPreCommitment: {
    title: 'Validaciones — Generar preobligación',
    issues: [
      { error_code: 'CDP_REQUIRED', field: 'budget_availability_certificate_id', rule: 'Se requiere un CDP vigente para generar la preobligación.', severity: 'blocking' },
      { error_code: 'BUDGET_UNAVAILABLE', field: 'budget_line_id', rule: 'La línea presupuestaria no tiene saldo disponible para el monto estimado.', severity: 'blocking' },
    ],
  },
  confirmProcurementModality: {
    title: 'Validaciones — Confirmar modalidad',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'selected_modality', rule: 'El campo Modalidad de compra es obligatorio.', severity: 'blocking' },
      { error_code: 'FRAMEWORK_AGREEMENT_FIRST_OPTION', field: 'catalog_bypass_justification', rule: 'Existe cobertura en Convenio Marco; se exige justificación para elegir otra modalidad.', severity: 'blocking' },
      { error_code: 'PUBLIC_TENDER_SUGGESTED', field: 'selected_modality', rule: 'Se sugiere Licitación Pública según monto y cobertura de catálogo.', severity: 'advisory' },
    ],
  },
  approveModalityDecision: {
    title: 'Validaciones — Aprobar modalidad',
    issues: [
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', severity: 'blocking' },
      { error_code: 'SEGREGATION_OF_DUTIES_VIOLATION', field: 'approver_id', rule: 'Quien aprueba no puede ser quien decidió la modalidad en 2.1.', severity: 'blocking' },
    ],
  },
  rejectModalityDecision: {
    title: 'Validaciones — Rechazar modalidad',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'comments', rule: 'El campo Comentarios es obligatorio al rechazar.', severity: 'blocking' },
    ],
  },
  linkMpProcess: {
    title: 'Validaciones — Vincular proceso MP',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'mp_process_id', rule: 'El campo Código / ID de proceso MP es obligatorio.', severity: 'blocking' },
      { error_code: 'MP_PROCESS_NOT_FOUND', field: 'mp_process_id', rule: 'El proceso MP no existe o el código es inválido.', severity: 'blocking' },
      { error_code: 'MP_PROCESS_TYPE_MISMATCH', field: 'mp_process_id', rule: 'El tipo de proceso MP no coincide con la modalidad confirmada.', severity: 'blocking' },
    ],
  },
  registerReceipt: {
    title: 'Validaciones — Registrar recepción',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'received_date', rule: 'El campo Fecha de recepción es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'lines', rule: 'Debe registrarse al menos una línea de recepción.', severity: 'blocking' },
      { error_code: 'RECEIPT_EXCEEDS_ORDER', field: 'lines[].quantity_received', rule: 'La cantidad recibida supera la cantidad pendiente de la línea de OC.', severity: 'blocking' },
    ],
  },
  confirmReceipt: {
    title: 'Validaciones — Confirmar conformidad',
    issues: [
      { error_code: 'SEGREGATION_OF_DUTIES_VIOLATION', field: 'confirmed_by', rule: 'Quien confirma no puede ser quien aprobó la compra.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'conformity', rule: 'El campo Resultado de conformidad es obligatorio.', severity: 'blocking' },
    ],
  },
  performThreeWayMatch: {
    title: 'Validaciones — Cruce de 3 vías',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'invoice_number', rule: 'El campo Número de factura es obligatorio.', severity: 'blocking' },
      { error_code: 'GOODS_RECEIPT_REQUIRED', field: 'goods_receipt_id', rule: 'Se requiere recepción conforme para el cruce de 3 vías.', severity: 'blocking' },
      { error_code: 'MATCH_DISCREPANCY', field: null, rule: 'Hay discrepancia entre OC, recepción y factura.', severity: 'blocking' },
    ],
  },
  registerAccrual: {
    title: 'Validaciones — Registrar devengado',
    issues: [
      { error_code: 'THREE_WAY_MATCH_REQUIRED', field: 'three_way_match_id', rule: 'El cruce de 3 vías debe estar en estado matched.', severity: 'blocking' },
      { error_code: 'ACCOUNTING_PROVIDER_UNAVAILABLE', field: null, rule: 'Contabilidad no está disponible.', severity: 'blocking' },
    ],
  },
  issuePaymentDecree: {
    title: 'Validaciones — Emitir decreto de pago',
    issues: [
      { error_code: 'ACCRUAL_NOT_REGISTERED', field: 'accrual_id', rule: 'Se requiere un devengado registrado en Contabilidad.', severity: 'blocking' },
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', severity: 'blocking' },
    ],
  },
  executePayment: {
    title: 'Validaciones — Ejecutar pago',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'payment_method', rule: 'El campo Medio de pago es obligatorio.', severity: 'blocking' },
      { error_code: 'TREASURY_PROVIDER_UNAVAILABLE', field: null, rule: 'Tesorería no está disponible.', severity: 'blocking' },
    ],
  },
  syncPurchaseOrderAccepted: {
    title: 'Validaciones — Sync OC aceptada',
    issues: [
      { error_code: 'BUDGET_UNAVAILABLE', field: 'budget_line_id', rule: 'La línea presupuestaria no tiene saldo disponible para el compromiso.', severity: 'blocking' },
    ],
  },
  releasePreCommitment: {
    title: 'Validaciones — Liberar preobligación',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'decision', rule: 'El campo Decisión es obligatorio.', severity: 'blocking' },
      { error_code: 'BUDGET_PROVIDER_UNAVAILABLE', field: null, rule: 'El proveedor de Presupuestos no está disponible.', severity: 'blocking' },
    ],
  },
  createTenderBases: {
    title: 'Validaciones — Guardar bases',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'technical_bases_ref', rule: 'Las bases técnicas son obligatorias.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'administrative_bases_ref', rule: 'Las bases administrativas son obligatorias.', severity: 'blocking' },
      { error_code: 'CRITERIA_WEIGHTS_INVALID', field: 'criteria', rule: 'La suma de ponderaciones de criterios debe ser 100%.', severity: 'blocking' },
    ],
  },
  submitBasesForLegalReview: {
    title: 'Validaciones — Enviar a revisión jurídica',
    issues: [
      { error_code: 'INVALID_STATUS', field: 'status', rule: 'Las bases deben estar en borrador para enviar a revisión.', severity: 'blocking' },
    ],
  },
  recordLegalReview: {
    title: 'Validaciones — Registrar revisión jurídica',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'outcome', rule: 'El campo Resultado es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'observations', rule: 'Las observaciones son obligatorias si el resultado es observaciones.', severity: 'blocking' },
    ],
  },
  approveTenderBases: {
    title: 'Validaciones — Aprobar bases',
    issues: [
      { error_code: 'LEGAL_REVIEW_REQUIRED', field: null, rule: 'Se requiere visto bueno jurídico previo.', severity: 'blocking' },
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', severity: 'blocking' },
    ],
  },
  designateEvaluationCommittee: {
    title: 'Validaciones — Designar comisión',
    issues: [
      { error_code: 'CONFLICT_DECLARATION_REQUIRED', field: 'members[].conflict_declaration_ref', rule: 'Cada integrante debe declarar conflictos de interés.', severity: 'blocking' },
      { error_code: 'COMMITTEE_MEMBER_CONFLICT', field: 'members', rule: 'Un integrante es incompatible con el requerimiento o las bases.', severity: 'blocking' },
    ],
  },
  recordOfferAdmissibility: {
    title: 'Validaciones — Admisibilidad de ofertas',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'offers[].inadmissibility_cause', rule: 'La causal es obligatoria si la oferta es inadmisible.', severity: 'blocking' },
    ],
  },
  recordEvaluationScores: {
    title: 'Validaciones — Puntajes de evaluación',
    issues: [
      { error_code: 'SCORES_INCONSISTENT_WITH_CRITERIA', field: 'scores', rule: 'Los puntajes no cuadran con los pesos de los criterios.', severity: 'blocking' },
    ],
  },
  signEvaluationReport: {
    title: 'Validaciones — Firmar acta de evaluación',
    issues: [
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', severity: 'blocking' },
    ],
  },
  registerGuaranteeCustody: {
    title: 'Validaciones — Registrar garantía',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'instrument_document_ref', rule: 'El documento del instrumento es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'amount', rule: 'El campo Monto de la garantía es obligatorio.', severity: 'blocking' },
    ],
  },
  recordClarification: {
    title: 'Validaciones — Registrar aclaración',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'clarification_document_ref', rule: 'El documento de aclaración es obligatorio.', severity: 'blocking' },
    ],
  },
  issueAwardResolution: {
    title: 'Validaciones — Resolución de adjudicación',
    issues: [
      { error_code: 'AWARD_JUSTIFICATION_REQUIRED', field: 'justification', rule: 'La justificación de adjudicación es obligatoria.', severity: 'blocking' },
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', severity: 'blocking' },
    ],
  },
  draftContract: {
    title: 'Validaciones — Borrador de contrato',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'contract_document_ref', rule: 'El documento del contrato es obligatorio.', severity: 'blocking' },
    ],
  },
  signContract: {
    title: 'Validaciones — Firmar contrato',
    issues: [
      { error_code: 'SIGNATURE_REQUIRED', field: null, rule: 'Se requiere firma electrónica avanzada válida.', severity: 'blocking' },
    ],
  },
  submitToComptroller: {
    title: 'Validaciones — Enviar a Contraloría',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'submitted_at', rule: 'La fecha de envío es obligatoria.', severity: 'blocking' },
    ],
  },
  recordComptrollerOutcome: {
    title: 'Validaciones — Resultado Contraloría',
    issues: [
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'outcome', rule: 'El campo Resultado es obligatorio.', severity: 'blocking' },
      { error_code: 'MISSING_REQUIRED_FIELD', field: 'official_document_ref', rule: 'El documento oficial es obligatorio.', severity: 'blocking' },
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
