2. MODALIDAD DE COMPRA — TRATO DIRECTO
Etapa siguiente a 1. SOLPED. Aplica cuando purchase_modality = direct_procurement (indicado en 1.1 y confirmado aquí). Se rige por causales legales de excepción a la licitación pública (Ley 19.886 y su Reglamento).

2.1 — Confirmación de modalidad y causal legal
Materia	Valor
Unidad municipal	Unidad Solicitante / Adquisiciones
Rol	Usuario
Plataforma	SGM
Optativo	Falso
Detalle: Adquisiciones confirma la modalidad Trato Directo indicada (o la cambia) en 1.1, y selecciona la causal legal específica desde un catálogo cerrado (p. ej. emergencia/urgencia/imprevisto, proveedor único, prestaciones jurídicas, personal altamente calificado, convenio con otro organismo público, monto inferior a 10 UTM, entre otras). Debe adjuntar antecedentes que respalden la causal. Este paso es distinto de la Resolución Fundada (2.2): aquí se fija la causal, en 2.2 se formaliza jurídicamente.

Entidad(es) y campos:

DirectProcurementCase (nueva) — purchase_request_id (ref. PurchaseRequest), legal_cause (enum, catálogo cerrado), legal_cause_description (texto), supporting_documents (ref. adjuntos, ≥1), estimated_amount (número), requires_minimum_quotations (booleano, derivado de legal_cause), status (enum: draft)
PurchaseRequest.purchase_modality (confirmado = direct_procurement; cambio posterior registrado en auditoría)
Borde de módulo:

#	Tipo	Contrato / Evento	Contraparte	Clasificación	Payload
1	Sistema externo	getLegalCauseCatalog	Catálogo normativo (Chile Compra / configuración interna)	Cacheada	Lista de causales vigentes (código, descripción, requisitos asociados)
Edge cases:

Causal no corresponde al monto o naturaleza de la compra → CAUSE_NOT_APPLICABLE (severity: blocking), validado contra reglas del catálogo.
Falta de documentación de respaldo → operación no permite avanzar a 2.2 (status no transiciona a ready_for_resolution).
Cambio de modalidad Trato Directo → otra modalidad en este punto → requiere reiniciar desde el sub-paso correspondiente de la nueva modalidad; cambio registrado en auditoría.
⚠ Pendiente de definir: catálogo cerrado y actualizable de causales legales (¿mantenido en SGM o consumido desde fuente normativa externa?). Reglas de validación causal-monto-naturaleza por causal.

2.2 — Elaboración y aprobación de Resolución Fundada
Materia	Valor
Unidad municipal	Jurídica / Unidad Solicitante
Rol	Aprobador
Plataforma	SGM
Optativo	Falso
Detalle: Jurídica redacta la Resolución Fundada que formaliza legalmente el Trato Directo (founded_resolution_attachment referenciado desde 1.1 se reemplaza/complementa aquí por el documento formal). Requiere revisión jurídica y firma de la autoridad competente según monto (facultad delegada o Alcalde). Montos que superan el umbral definido por la Ley Orgánica de Municipalidades pueden requerir conocimiento o aprobación del Concejo Municipal.

Entidad(es) y campos:

FoundedResolution — direct_procurement_case_id (ref. DirectProcurementCase), resolution_number, legal_cause_id, drafted_by (ref. User), reviewed_by (ref. User, Jurídica), signed_by (ref. User), signed_at (fecha), status (enum: draft, in_legal_review, signed, rejected), council_knowledge_required (booleano, derivado de monto)
Borde de módulo:

#	Tipo	Contrato / Evento	Contraparte	Clasificación	Payload
1	Dependencia	requestSignature	FirmaGob	Síncrona bloqueante	Entrada: document_id, document_type = founded_resolution, signer_id — Respuesta: signature_request_id, status
2	Dependencia	confirmSignature	FirmaGob	Síncrona bloqueante	Entrada: signature_request_id — Respuesta: signed_at, certificate_ref
3	Dependencia (condicional)	notifyMunicipalCouncil	Concejo Municipal (secretaría)	Asíncrona	FoundedResolution.id, estimated_amount — solo si council_knowledge_required = verdadero
4	Evento	FoundedResolutionSigned	— (consumidores: auditoría, Mercado Público)	Asíncrona	FoundedResolution, DirectProcurementCase.id
Edge cases:

Rechazo jurídico → FoundedResolution.status vuelve a draft; DirectProcurementCase permanece bloqueado hasta corrección.
Autoridad sin facultad delegada para el monto → RESOLUTION_AUTHORITY_MISMATCH (severity: blocking); debe escalarse a autoridad con facultad suficiente.
Monto requiere conocimiento del Concejo Municipal y este no se ha efectuado → resolución queda pending_council_knowledge; no habilita avance a 2.3.
FirmaGob no disponible → resolución queda pending_signature; reintento vía confirmSignature.
⚠ Pendiente de definir: umbral exacto de monto que gatilla council_knowledge_required y su fuente (configuración interna vs. normativa). Estructura de rejection_reason para rechazo jurídico (mismo patrón pendiente que en 1.2).

2.3 — Cotización o invitación a proveedor(es)
Materia	Valor
Unidad municipal	Adquisiciones
Rol	Usuario
Plataforma	SGM / Mercado Público
Optativo	Verdadero
Detalle: Cuando la causal legal lo exige (p. ej. trato directo por monto), Adquisiciones invita a cotizar a un mínimo de proveedores (habitualmente 3) inscritos y hábiles en el Registro de Proveedores. Si la causal es de proveedor único, este paso se omite y se documenta la justificación de exclusividad.

Entidad(es) y campos:

SupplierQuotationRequest — direct_procurement_case_id (ref. DirectProcurementCase), invited_suppliers (lista, ref. Supplier), minimum_quotations_required (número), deadline (fecha)
SupplierQuotation — quotation_request_id (ref. SupplierQuotationRequest), supplier_id (ref. Supplier), offered_amount (número), submitted_at (fecha)
Borde de módulo:

#	Tipo	Contrato / Evento	Contraparte	Clasificación	Payload
1	Sistema externo	checkSupplierStatus	Registro de Proveedores (Chile Compra)	Síncrona bloqueante	Entrada: supplier_id — Respuesta: is_registered, is_enabled (hábil), inhabilities
2	Dependencia	sendQuotationInvitation	Mercado Público / correo	Asíncrona	SupplierQuotationRequest (invited_suppliers, deadline)
3	Operación	registerSupplierQuotation	— (Adquisiciones)	—	Entrada: SupplierQuotation
Edge cases:

Proveedor no inscrito o inhábil en el Registro de Proveedores → SUPPLIER_NOT_ELIGIBLE (severity: blocking) para ese proveedor; se excluye de la invitación.
Cotizaciones recibidas menores al mínimo exigido por la causal → requiere justificación adicional adjunta antes de avanzar a 2.4; no bloquea automáticamente (criterio no definido, ver pendiente).
Causal de proveedor único → sub-paso completo se omite; DirectProcurementCase avanza directo a 2.4 con justificación de exclusividad ya registrada en 2.1.
Plazo de cotización vencido sin respuestas → operación permite reabrir invitación o continuar con las cotizaciones recibidas (regla no definida, ver pendiente).
⚠ Pendiente de definir: si la falta de mínimo de cotizaciones bloquea el avance o solo exige justificación registrada. Tratamiento de plazos vencidos sin respuesta de proveedores.

2.4 — Selección de proveedor
Materia	Valor
Unidad municipal	Unidad Solicitante / Comisión evaluadora (si aplica)
Rol	Aprobador
Plataforma	SGM
Optativo	Falso
Detalle: Se selecciona al proveedor sobre la base de las cotizaciones recibidas (2.3) o, en causales de proveedor único, sobre la base de la justificación de exclusividad ya registrada. La selección debe ser consistente con la causal legal declarada en 2.1.

Entidad(es) y campos:

SupplierSelection — direct_procurement_case_id (ref. DirectProcurementCase), selected_supplier_id (ref. Supplier), selection_criteria (texto), justification (texto), selected_by (ref. User), selected_at (fecha)
Borde de módulo:

#	Tipo	Contrato / Evento	Contraparte	Clasificación	Payload
1	Evento	SupplierSelected	— (consumidores: auditoría, Mercado Público)	Asíncrona	SupplierSelection, DirectProcurementCase.id
Edge cases:

Proveedor seleccionado no corresponde a la causal declarada (p. ej. no es el proveedor único justificado) → SELECTION_CAUSE_MISMATCH (severity: blocking).
Empate entre cotizaciones sin criterio de desempate definido → requiere resolución manual documentada (regla no definida, ver pendiente).
⚠ Pendiente de definir: criterio de desempate entre cotizaciones equivalentes.

2.5 — Publicación en Mercado Público
Materia	Valor
Unidad municipal	Adquisiciones
Rol	Usuario
Plataforma	Mercado Público
Optativo	Falso
Detalle: Se registra y publica la contratación por Trato Directo en el portal Mercado Público (obligación de transparencia activa), dentro del plazo legal desde la total tramitación de la Resolución Fundada, salvo causales de secreto o reservado, que quedan exentas de publicación pero igualmente se registran internamente.

Entidad(es) y campos:

MercadoPublicoPublication — direct_procurement_case_id (ref. DirectProcurementCase), publication_id, published_at (fecha), deadline (fecha), exempted (booleano, verdadero si legal_cause = secreto/reservado)
Borde de módulo:

#	Tipo	Contrato / Evento	Contraparte	Clasificación	Payload
1	Dependencia	publishDirectProcurement	Mercado Público	Síncrona bloqueante	Entrada: FoundedResolution, SupplierSelection, estimated_amount — Respuesta: publication_id, published_at
2	Evento	DirectProcurementPublished	— (consumidores: auditoría, Transparencia)	Asíncrona	MercadoPublicoPublication, DirectProcurementCase.id
Edge cases:

Plazo legal de publicación vencido sin publicar → alerta de incumplimiento normativo (severity: blocking para cierre del caso; no bloquea necesariamente la OC, ver pendiente).
Causal reservada o secreta → exime de publicación en el portal, pero exige registro interno equivalente para auditoría.
Mercado Público no disponible → PUBLICATION_PROVIDER_UNAVAILABLE (severity: blocking); reintento requerido antes de continuar a 2.6.
⚠ Pendiente de definir: si el vencimiento del plazo de publicación bloquea la emisión de la Orden de Compra o solo genera alerta de cumplimiento.

2.6 — Emisión de Orden de Compra
Materia	Valor
Unidad municipal	Adquisiciones
Rol	Usuario
Plataforma	SGM / Mercado Público
Optativo	Falso
Detalle: Adquisiciones emite la Orden de Compra (OC) al proveedor seleccionado, vinculada al CDP (1.5) y a la preobligación (1.6), y la publica en Mercado Público. La preobligación se transforma en obligación presupuestaria definitiva al emitirse la OC.

Entidad(es) y campos:

PurchaseOrder — direct_procurement_case_id (ref. DirectProcurementCase), purchase_request_id (ref. PurchaseRequest), supplier_id (ref. Supplier), founded_resolution_id (ref. FoundedResolution), budget_pre_commitment_id (ref. BudgetPreCommitment), total_amount (número), status (enum: issued, rejected, expired)
Borde de módulo:

#	Tipo	Contrato / Evento	Contraparte	Clasificación	Payload
1	Dependencia	createPurchaseOrder	Mercado Público	Síncrona bloqueante	Entrada: PurchaseOrder — Respuesta: order_id, status
2	Dependencia	registerDefinitiveObligation	Contabilidad	Síncrona bloqueante	Entrada: BudgetPreCommitment, PurchaseOrder — Respuesta: accounting_entry_ref
3	Evento	PurchaseOrderIssued	— (consumidores: Contabilidad, auditoría, reportería)	Asíncrona	PurchaseOrder, DirectProcurementCase.id
Edge cases:

Monto de la OC excede el CDP emitido en 1.5 → PO_EXCEEDS_CERTIFICATE (severity: blocking).
Contabilidad no disponible al registrar obligación definitiva → ACCOUNTING_PROVIDER_UNAVAILABLE; OC no persiste (sin efecto parcial), mismo patrón que 1.6.
Mercado Público no disponible → ORDER_PROVIDER_UNAVAILABLE (severity: blocking); reintento requerido.
⚠ Pendiente de definir: si la validación monto OC vs. CDP admite tolerancia (mismo patrón de tolerancia pendiente que en 1.1, 3.2, 5.1).

2.7 — Aceptación de Orden de Compra por el proveedor
Materia	Valor
Unidad municipal	Adquisiciones
Rol	Usuario
Plataforma	Mercado Público
Optativo	Falso
Detalle: El proveedor acepta o rechaza la OC a través de Mercado Público, dentro del plazo normativo de aceptación. La aceptación habilita el inicio de la ejecución contractual (etapa siguiente, fuera de este alcance).

Entidad(es) y campos:

PurchaseOrder.status (enum, transiciona a accepted, rejected o expired)
PurchaseOrder.supplier_response_at (fecha)
Borde de módulo:

#	Tipo	Contrato / Evento	Contraparte	Clasificación	Payload
1	Sistema externo	getPurchaseOrderStatus	Mercado Público	Síncrona bloqueante (polling o webhook)	Entrada: order_id — Respuesta: status, responded_at
2	Evento	PurchaseOrderAccepted / PurchaseOrderRejected	— (consumidores: Unidad Solicitante, auditoría)	Asíncrona	PurchaseOrder, DirectProcurementCase.id
Edge cases:

Proveedor rechaza la OC → PurchaseOrder.status = rejected; caso vuelve a 2.4 para nueva selección (si hay más cotizaciones) o se cancela.
Plazo de aceptación vencido sin respuesta → PurchaseOrder.status = expired; mismo camino que rechazo.
⚠ Pendiente de definir: si al rechazo/expiración se reutiliza la misma Resolución Fundada (2.2) o se requiere una nueva.

Resumen de entidades — Etapa 2 (Trato Directo)
Entidad	Tipo de relación	Notas
DirectProcurementCase	Raíz de la etapa	1 por SOLPED en modalidad Trato Directo; referencia causal legal
FoundedResolution	1:1 con DirectProcurementCase	Acto administrativo formal; firma electrónica obligatoria
SupplierQuotationRequest / SupplierQuotation	1:N con DirectProcurementCase	Solo cuando la causal exige cotizaciones
SupplierSelection	1:1 con DirectProcurementCase	Debe ser consistente con la causal declarada
MercadoPublicoPublication	1:1 con DirectProcurementCase	Exenta si causal es secreta/reservada
PurchaseOrder	1:1 con DirectProcurementCase	Vincula CDP y preobligación de Etapa 1
Resumen de bordes — Etapa 2 (Trato Directo)
Sub-paso	Tipo	Contrato o Evento	Contraparte
2.1	Sistema externo	getLegalCauseCatalog	Catálogo normativo
2.2	Dependencia	requestSignature, confirmSignature, notifyMunicipalCouncil	FirmaGob, Concejo Municipal
2.2	Evento	FoundedResolutionSigned	—
2.3	Sistema externo / Dependencia	checkSupplierStatus, sendQuotationInvitation	Registro de Proveedores, Mercado Público
2.4	Evento	SupplierSelected	—
2.5	Dependencia	publishDirectProcurement	Mercado Público
2.5	Evento	DirectProcurementPublished	—
2.6	Dependencia	createPurchaseOrder, registerDefinitiveObligation	Mercado Público, Contabilidad
2.6	Evento	PurchaseOrderIssued	—
2.7	Sistema externo	getPurchaseOrderStatus	Mercado Público
2.7	Evento	PurchaseOrderAccepted / PurchaseOrderRejected	—
Siguiente etapa: 3. Ejecución Contractual — Trato Directo
