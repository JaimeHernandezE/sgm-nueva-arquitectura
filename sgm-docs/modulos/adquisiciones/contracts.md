# Contrato del módulo: Adquisiciones

> Piloto: macroproceso **Compra Ágil** (SOLPED → Pago). Etapas 1 (SOLPED), 2 (Modalidad de Compra) y 4 (Recepción Conforme) son transversales a las 4 modalidades; etapa 3 (Resolución de Compra) es específica por modalidad.
> Estado: borrador funcional derivado de fichas de flujo y ficha QA.
> Estándares transversales: [`arquitectura/estandares-api.md`](../../arquitectura/estandares-api.md)
> Metodología: [`arquitectura/contrato-api-first.md`](../../arquitectura/contrato-api-first.md)
> Entidades canónicas: [`modelo-datos/entidades-core.md`](../../modelo-datos/entidades-core.md)
> OpenAPI: [`openapi/adquisiciones.openapi.yaml`](./openapi/adquisiciones.openapi.yaml) — estructura: [`openapi/README.md`](./openapi/README.md)
> Fixtures sandbox: [`fixtures/catalogo.md`](./fixtures/catalogo.md)

**Alcance:** las etapas transversales (1, 2, 4) y la etapa 3 de Compra Ágil están cubiertas en profundidad. La etapa 3 de Licitación Pública ya tiene ficha de flujo (`3. licitacion-publica/3-resolucion-compra.md`, 14 sub-pasos) pero sus entidades y operaciones específicas (`TenderBases`, `Guarantee`, `Contract`, Comisión Evaluadora, etc.) aún no están completamente incorporadas a este contrato ni a `entidades-core.md` — solo se propagó aquí la concordancia de vinculación MP (§2.3 ↔ §3.5). Convenio Marco y Trato Directo se extenderán tras validar el piloto.

---

## 1. Entidades que expone

Entidades visibles fuera del borde del módulo Adquisiciones. Definición completa en `entidades-core.md`; aquí el subconjunto expuesto en API.

| Entidad | Visibilidad | Campos expuestos | Sub-pasos origen |
|---|---|---|---|
| `ProcurementCase` | Expuesta | `id`, `folio`, `description`, `requesting_unit_id`, `procurement_type`, `status`, `current_step_id`, `created_at`, `mp_process_id`, `mp_linked_at`, `mp_process_type` | 1.1 (creación implícita), 2.1, 2.3 |
| `ProcurementCaseSummary` | Expuesta (DTO lectura) | `id`, `folio`, `description`, `procurement_type`, `status`, `current_step_name`, `requesting_unit_id`, `created_at` | — |
| `ProcurementCaseDetail` | Expuesta (DTO lectura) | `ProcurementCase` + `current_step` (`CaseStep` resumido) | — |
| `CaseStep` | Expuesta | `id`, `procurement_case_id`, `step_number`, `name`, `status`, `responsible_unit_id`, `responsible_role`, `responsible_user_id`, `started_at`, `completed_at`, `elapsed_display` | 2.1 (instanciación), todas las etapas |
| `PurchaseRequest` | Expuesta | `id`, `procurement_case_id`, `requesting_unit`, `description`, `justification`, `requested_date`, `purchase_modality`, `founded_resolution_attachment`, `proposed_budget_line_id`, `proposed_fiscal_year`, `status` | 1.1, 1.2, 2.1, 2.2 |
| `PurchaseRequestLine` | Expuesta | `id`, `purchase_request_id`, `item_description`, `quantity`, `unit_of_measure`, `unit_price`, `price_source` | 1.1 |
| `PurchaseRequestAttachment` | Expuesta | `id`, `purchase_request_id`, `attachment_type`, `description`, `document_ref` | 1.1 |
| `PurchaseRequestApproval` | Expuesta | `id`, `purchase_request_id`, `approver_id`, `decision`, `decision_date`, `comments` | 1.2 |
| `BudgetAvailabilityCertificate` | Expuesta | `id`, `procurement_case_id`, `purchase_request_id`, `certificate_number`, `budget_line_id`, `certified_amount`, `fiscal_year`, `verified_by`, `signed_by`, `signed_at`, `status`, `signature_mode` | 1.5 |
| `BudgetPreCommitment` | Expuesta | `id`, `procurement_case_id`, `purchase_request_id`, `budget_availability_certificate_id`, `budget_line_id`, `estimated_amount`, `fiscal_year`, `status` | 1.6 |
| `AgileQuoteProcess` | Expuesta | `id`, `purchase_request_id`, `deep_link_clicked_at`, `mp_quote_id` | 2.1 *(CA)* — duplica `ProcurementCase.mp_process_id`, ver `entidades-core.md` <!-- REVISAR: consolidar AgileQuoteProcess --> |
| `ModalityDecision` | Expuesta | `id`, `procurement_case_id`, `selected_modality`, `ratified`, `requires_jefatura_approval`, `decided_by`, `decided_at` | 2.1 |
| `ModalityDecisionApproval` | Expuesta | `id`, `modality_decision_id`, `approver_id`, `decision`, `decision_date` | 2.2 — existencia condicionada a **[PENDIENTE P-38]** |
| `QuotationResult` | Expuesta | `id`, `procurement_case_id`, `selected_provider_rut`, `selected_provider_name`, `offered_amount`, `lowest_price_selected`, `entry_mode` | 3.2 *(CA)* |
| `PurchaseOrder` | Expuesta | `id`, `procurement_case_id`, `purchase_request_id`, `mp_oc_id`, `supplier_rut`, `total_amount`, `selection_justification`, `status`, `acceptance_date`, `fulfillment_status`, `entry_mode` | 3.3, 3.4, 3.5 *(CA)* / 3.5, 3.14 *(LP)*, 4.1 |
| `BudgetCommitment` | Expuesta | `id`, `purchase_order_id`, `budget_pre_commitment_id`, `committed_amount`, `commitment_date`, `source` | 3.4 *(CA)* / 3.14 *(LP)* |
| `GoodsReceipt` | Expuesta | `id`, `purchase_order_id`, `received_by`, `received_date`, `receipt_type`, `receiving_unit`, `status`, `observations` | 4.1, 4.2 |
| `ReceiptRejectionCase` | Expuesta | `id`, `goods_receipt_id`, `resolution_type`, `resolution_deadline`, `resolved_at`, `outcome` | 4.5 |
| `ThreeWayMatch` | Expuesta | `id`, `purchase_order_id`, `goods_receipt_id`, `invoice_id`, `match_status`, `match_date` | 5.1 |
| `Accrual` | Expuesta | `id`, `three_way_match_id`, `budget_commitment_id`, `accrual_amount`, `accrual_date` | 5.2 — ver también `recordAccrual` (4.4) <!-- REVISAR: dos eventos de devengado, ver §4 --> |
| `PaymentDecree` | Expuesta | `id`, `accrual_id`, `decree_number`, `decree_date`, `approver_id` | 5.3 |
| `Payment` | Expuesta | `id`, `payment_decree_id`, `payment_date`, `payment_method`, `payment_status` | 5.4 |

**Internas (no expuestas en contrato):** `PriceReference` (dato de validación embebido en línea), `GoodsReceiptLine` (confirmada, candidata a exposición futura), `MpProcessSnapshot` (bitácora de sincronización), `UtmValue` (obtenida vía dependencia `getUtmValue`), `NormativeParameter` (referencia global de plataforma, no administrada por este módulo).

---

## 2. Operaciones que ofrece

Convenciones de error y paginación según [`estandares-api.md`](../../arquitectura/estandares-api.md). Rutas sin prefijo de tenant hasta resolver multitenancy (**[PENDIENTE P-03]**).

### 2.0 Expediente (lecturas)

Operaciones de consulta del expediente y recursos asociados. Requisito de [`musts-arquitectura.md`](../../arquitectura/musts-arquitectura.md) §10.2 y [`entregable-licitacion.md`](../../arquitectura/entregable-licitacion.md) §6.3.

**Autorización (placeholder hasta P-02):** scope `adquisiciones:read` (personas) / `adquisiciones.read` (M2M).

#### `GET /procurement-cases` — `listProcurementCases`
- **Sub-pasos:** — *(consulta transversal)*
- **Entrada:** query `page`, `page_size`, `sort`, `order`; filtros `q`, `procurement_type`, `status`, `requesting_department_id`, `requesting_unit_id`, `folio`, `awaiting_my_action`
- **Respuesta:** colección paginada de `ProcurementCaseSummary`
- **Reglas:**
  | Regla | Severidad | Error |
  |---|---|---|
  | Solo lectura; sin efectos colaterales | — | — |
  | Filtros combinables (AND). `q` busca en folio, descripción (glosa) y etiqueta de `procurement_type` | — | — |
  | `requesting_department_id` restringe a unidades hijas del departamento | — | — |
  | `awaiting_my_action=true` limita a expedientes en bandeja del actor autenticado | — | — |
  | Si el rol es `adq.solicitante` o `adq.aprobador_unidad`, el scope de unidad del `RoleAssignment` se aplica **siempre**; `requesting_department_id` / `requesting_unit_id` ajenos se ignoran o rechazan | blocking | `FORBIDDEN` *(o se fuerza el scope sin error — decisión de implementación)* |

#### `GET /procurement-cases/{case_id}` — `getProcurementCase`
- **Sub-pasos:** — *(vista expediente)*
- **Entrada:** `case_id` (= folio `ADQ-AAAA-NNNNN`)
- **Respuesta:** `ProcurementCaseDetail`
- **Reglas:**
  | Regla | Severidad | Error |
  |---|---|---|
  | Expediente existe en el tenant del token | blocking | `PROCUREMENT_CASE_NOT_FOUND` |

#### `GET /procurement-cases/{case_id}/steps` — `listProcurementCaseSteps`
- **Sub-pasos:** — *(timeline del expediente)*
- **Entrada:** `case_id`
- **Respuesta:** `CaseStep[]` ordenados por `step_number`
- **Reglas:** `PROCUREMENT_CASE_NOT_FOUND` si no existe

#### `GET /purchase-requests` — `listPurchaseRequests`
- **Sub-pasos:** — *(consulta)*
- **Entrada:** query paginación; filtro `procurement_case_id`
- **Respuesta:** colección paginada de `PurchaseRequest`

#### `GET /purchase-requests/{id}` — `getPurchaseRequest`
- **Sub-pasos:** — *(detalle SOLPED)*
- **Entrada:** `id`
- **Respuesta:** `PurchaseRequest` + `lines` (`PurchaseRequestLine[]`)
- **Reglas:** `PURCHASE_REQUEST_NOT_FOUND` si no existe

#### `GET /purchase-orders` — `listPurchaseOrders`
- **Sub-pasos:** — *(consulta)*
- **Entrada:** query paginación; filtro `procurement_case_id`
- **Respuesta:** colección paginada de `PurchaseOrder`

#### `GET /purchase-orders/{id}` — `getPurchaseOrder`
- **Sub-pasos:** — *(detalle OC)*
- **Entrada:** `id`
- **Respuesta:** `PurchaseOrder`
- **Reglas:** `PURCHASE_ORDER_NOT_FOUND` si no existe

### 2.1 SOLPED

#### `POST /purchase-requests` — `createPurchaseRequest`
- **Sub-pasos:** 1.1
- **Entrada:** `PurchaseRequest` + `PurchaseRequestLine[]`
- **Respuesta:** `PurchaseRequest` con `status = draft`
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Campos obligatorios completos | blocking | 53 | `MISSING_REQUIRED_FIELDS` |
  | `quantity > 0` en cada línea | blocking | 53 P0 | `INVALID_QUANTITY` |
  | `unit_price` con referencia válida | blocking | — | `PRICE_REFERENCE_UNAVAILABLE` |
  | Desviación precio vs referencia dentro de tolerancia | blocking ⚠ | — | `PRICE_DEVIATION_EXCEEDED` |
  | Si `purchase_modality = direct_procurement`, `founded_resolution_attachment` presente | blocking | — | `FOUNDED_RESOLUTION_REQUIRED` |
- **Dependencias invocadas:** `getPriceReference`, `checkStockAvailability` *(propuesta)*, `previewBudgetAvailability` *(informativa, bajo demanda desde enlace UI)*

#### `GET /budget-lines/{id}/preview-availability` — `previewBudgetAvailability`
- **Sub-pasos:** 1.1, 1.2 *(autoconsulta informativa; no avanza el flujo)*
- **Entrada:** `budget_line_id`, `fiscal_year`, `amount` (opcional — monto estimado de la SOLPED)
- **Respuesta:** `available_balance`, `committed_by_others`, `projected_balance` (misma forma que `checkBudgetAvailability`)
- **Reglas:** solo lectura; no persiste verificación ni afecta `PurchaseRequest.status`; requiere RBAC de consulta sobre la línea
- **Dependencias:** Presupuestos (cacheada)
- **Comportamiento ante falla:** error en panel/modal; la pantalla de creación o aprobación continúa operativa

#### `POST /purchase-requests/{id}/submit` — `submitPurchaseRequest`
- **Sub-pasos:** 1.1
- **Reglas:** SOLPED completa → `status = pending_approval`; si `purchase_modality = direct_procurement`, exige `founded_resolution_attachment` (`FOUNDED_RESOLUTION_REQUIRED`)

#### `POST /purchase-requests/{id}/approve` — `approvePurchaseRequest`
- **Sub-pasos:** 1.2
- **Entrada:** `decision`, `comments`
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Firma electrónica válida (FirmaGob) | blocking | 5, 7 P1 | `SIGNATURE_REQUIRED` |
  | Solo aprobador de jefatura de unidad solicitante | blocking | 6 | `UNAUTHORIZED_APPROVER` |
- **Dependencias:** `requestSignature`, `confirmSignature`
- **Evento emitido:** `PurchaseRequestApproved`

#### `POST /purchase-requests/{id}/reject` — `rejectPurchaseRequest`
- **Sub-pasos:** 1.2
- **Reglas:** `comments` obligatorio si rechazo → `status = draft`

#### `POST /purchase-requests/{id}/budget-verification` — `verifyBudgetAvailability`
- **Sub-pasos:** 1.3
- **Entrada:** `budget_line_id`, `amount`, `fiscal_year`, `decision` (`confirmed` \| `rejected`), `comments` (obligatorio si rechazo)
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Disponibilidad presupuestaria con trazabilidad de saldo | blocking | 8 P1 | `BUDGET_UNAVAILABLE` |
  | SOLPED en `pending_finance` | blocking | — | `INVALID_STATUS` |
- **Dependencias:** `checkBudgetAvailability` (Presupuestos)

#### `POST /purchase-requests/{id}/budget-financing-request` — `requestBudgetFinancing`
- **Sub-pasos:** 1.4
- **Entrada:** `justification` (texto)
- **Reglas:** paso optativo; no avanza el ciclo principal hasta resolución externa de presupuesto
- **Evento emitido:** `BudgetFinancingRequested`

#### `POST /purchase-requests/{id}/budget-availability-certificate` — `issueBudgetAvailabilityCertificate`
- **Sub-pasos:** 1.5
- **Entrada:** `budget_line_id`, `certified_amount`, `fiscal_year`, `signature_mode` (`electronic` \| `scanned`)
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Verificación confirmada en 1.3 | blocking | — | `VERIFICATION_REQUIRED` |
  | Verificador ≠ firmante CDP | blocking | 9 P1 | `SEGREGATION_OF_DUTIES_VIOLATION` |
  | Saldo disponible al revalidar | blocking | 8, 11 P0/P1 | `BUDGET_UNAVAILABLE` |
  | Firma electrónica válida (FirmaGob) si `signature_mode = electronic` | blocking | 5, 7 P1 | `SIGNATURE_REQUIRED` |
  | Adjunto escaneado válido si `signature_mode = scanned` | blocking | — | `SCANNED_CDP_INVALID` |
- **Dependencias:** `checkBudgetAvailability`; si `electronic`: `requestSignature`, `confirmSignature`
- **Evento emitido:** `BudgetAvailabilityCertificateIssued`

#### `POST /purchase-requests/{id}/budget-availability-certificate/scanned` — `registerScannedBudgetAvailabilityCertificate`
- **Sub-pasos:** 1.5 *(modo degradado)*
- **Entrada:** mismos metadatos que emisión + `scanned_certificate_attachment` (`DocumentRef` — PDF previamente subido vía `storeDocument` del core)
- **Reglas:** mismas que emisión, excepto FirmaGob; fija `signature_mode = scanned`
- **Dependencias:** `checkBudgetAvailability`
- **Evento emitido:** `BudgetAvailabilityCertificateIssued`

#### `POST /purchase-requests/{id}/budget-pre-commitment` — `createBudgetPreCommitment`
- **Sub-pasos:** 1.6
- **Entrada:** `budget_line_id`, `estimated_amount`, `fiscal_year`, `budget_availability_certificate_id`
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | CDP vigente (`budget_availability_certificate_id`) | blocking | — | `CDP_REQUIRED` |
  | Disponibilidad presupuestaria con trazabilidad de saldo | blocking | 8, 11 P0/P1 | `BUDGET_UNAVAILABLE` |
  | SOLPED en `pending_finance` | blocking | — | `INVALID_STATUS` |
- **Dependencias:** `createBudgetPreCommitment` (Presupuestos), `registerPreObligation` (Contabilidad)
- **Evento emitido:** `BudgetPreCommitmentCreated`

### 2.2 Modalidad de Compra *(transversal — antes específica de Compra Ágil, ahora común a las 4 modalidades)*

#### `POST /procurement-cases/{id}/modality` — `confirmProcurementModality`
- **Sub-pasos:** 2.1
- **Entrada:** `selected_modality`, justificaciones condicionales (`catalog_bypass_justification`, `direct_procurement_cause`)
- **Respuesta:** `ModalityDecision`, `CaseStep[]` instanciados
- **Reglas:**
  | Regla | Severidad | Error |
  |---|---|---|
  | V1 Monto ≤ 100 UTM para Compra Ágil | blocking | `MODALITY_AMOUNT_EXCEEDED` |
  | V2 Catálogo CM es primera opción sin justificación | blocking | `FRAMEWORK_AGREEMENT_FIRST_OPTION` |
  | V3 Trato Directo requiere causal + Resolución Fundada | blocking | `DIRECT_PROCUREMENT_CAUSE_REQUIRED` |
  | Modalidad ya confirmada | blocking | `MODALITY_ALREADY_CONFIRMED` |
  | V4/V5/V7/V8 sugerencias LP, Toma de Razón, tramo, garantías | advisory | `PUBLIC_TENDER_SUGGESTED`, `COMPTROLLER_REVIEW_REQUIRED`, `TENDER_TIER_INFO`, `TENDER_GUARANTEES_REQUIRED` |
  | V6 *(propuesta)* fraccionamiento sospechado | advisory | `SPLITTING_SUSPECTED` |
- **Dependencias:** `getUtmValue` (SII), `checkCatalogAvailability` (catálogo CM espejado)
- **Evento emitido:** `ProcurementModalityConfirmed`

#### `POST /modality-decisions/{id}/approve` — `approveModalityDecision`
- **Sub-pasos:** 2.2 — existencia y alcance pendientes de ratificar con la DM (**[PENDIENTE P-38]**); ejecución condicionada a `ModalityDecision.requires_jefatura_approval`
- **Entrada:** `comments` (opcional)
- **Respuesta:** `ModalityDecisionApproval`
- **Dependencias:** `requestSignature`/`confirmSignature` (Core (FirmaGob), condicional)
- **Evento emitido:** `ProcurementModalityApproved`

#### `POST /modality-decisions/{id}/reject` — `rejectModalityDecision`
- **Sub-pasos:** 2.2
- **Entrada:** `comments` (obligatorio)
- **Reglas:** rechazo → `ModalityDecision` sin efecto, `CaseStep[]` de 2.1 anulados con auditoría, retorna a 2.1
- **Dependencias:** `requestSignature`/`confirmSignature` (Core (FirmaGob), condicional)

#### `POST /procurement-cases/{id}/mp-link` — `linkMpProcess`
- **Sub-pasos:** 2.3 (ejecución inmediata, Compra Ágil/Convenio Marco), 3.5 *(LP, ejecución diferida)*, subproceso de publicación *(Trato Directo, ejecución diferida)*
- **Entrada:** `mp_process_id`
- **Reglas:**
  | Regla | Severidad | Error |
  |---|---|---|
  | Proceso MP existe | blocking | `MP_PROCESS_NOT_FOUND` |
  | Organismo comprador coincide con el tenant | blocking | `MP_PROCESS_ORGANISM_MISMATCH` |
  | Tipo de proceso MP coincide con la modalidad confirmada | blocking | `MP_PROCESS_TYPE_MISMATCH` |
  | Código MP no vinculado previamente a otro expediente | blocking | `MP_PROCESS_ALREADY_LINKED` |
- **Dependencias:** `readMpProcess` (Mercado Público, síncrona bloqueante solo en la vinculación)
- **Evento emitido:** `MpProcessLinked`

### 2.3 Resolución de Compra — Compra Ágil

#### *(sin operación declarada — solo lectura MP y evento)* 3.1 Período de cotización
- **Dependencias:** `readMpProcess` (deseada)
- **Evento emitido:** `MpStateChanged`

#### `POST /procurement-cases/{id}/quotation-result` — `recordQuotationResult`
- **Sub-pasos:** 3.2 *(modo degradado — registro manual)*
- **Entrada:** `QuotationResult` (`selected_provider_rut`, `selected_provider_name`, `offered_amount`, `lowest_price_selected`, `entry_mode`)
- **Respuesta:** `QuotationResult`
- **Dependencias:** `readMpProcess` (deseada)
- **Evento emitido:** `QuotationClosed`

#### `POST /purchase-orders` — `registerPurchaseOrder` *(continúa el nombre usado antes de la reconciliación; cubre lectura MP o registro manual según `entry_mode`)*
- **Sub-pasos:** 3.3
- **Entrada:** `mp_oc_number`, `provider_rut`, `amount`, `entry_mode`
- **Evento emitido:** `PurchaseOrderIssued` / `ProviderIneligibleBlocked`

#### `POST /purchase-orders/{id}/sync-accepted` — `syncPurchaseOrderAccepted`
- **Sub-pasos:** 3.4 *(CA)* / 3.14 *(LP)*
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Saldo presupuestario al comprometer | blocking | 11 P0 | `BUDGET_UNAVAILABLE` |
- **Dependencias:** `readMpProcess` — OC Aceptada, **confirmada** (MP), `commitBudget` (Presupuestos, síncrona bloqueante; reemplaza el par anterior `convertPreCommitmentToCommitment`+`registerBudgetCommitment` — simplificación aplicada en esta reconciliación)
- **Eventos:** `PurchaseOrderAccepted`, `BudgetCommitmentCreated`

#### *(sin operación declarada — reflejo de rechazo MP)*
- **Sub-pasos:** 3.5
- **Dependencias:** `readMpProcess` — OC Rechazada (deseada)
- **Evento emitido:** `PurchaseOrderRejected`

#### `POST /procurement-cases/{id}/release-pre-commitment` — `releasePreCommitment`
- **Sub-pasos:** 3.6
- **Dependencias:** `releasePreCommitment` (Presupuestos, síncrona bloqueante)
- **Evento emitido:** `ProcurementProcessFailed`

### 2.4 Recepción Conforme

#### `POST /purchase-orders/{id}/goods-receipts` — `registerReceipt`
- **Sub-pasos:** 4.1
- **Entrada:** `GoodsReceipt` + `GoodsReceiptLine[]`
- **Reglas:**
  | Regla | Severidad | Error |
  |---|---|---|
  | Cantidad recibida ≤ pendiente de la línea | blocking | `RECEIPT_EXCEEDS_ORDER` |

#### `POST /goods-receipts/{id}/confirm` — `confirmReceipt`
- **Sub-pasos:** 4.2
- **Entrada:** `decision` (`confirmed` \| `rejected`), `comments`, `signature_mode` (condicional)
- **Respuesta:** `GoodsReceipt`
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Segregación: confirmante ≠ aprobador de la compra | blocking | 9 P1 | `SEGREGATION_OF_DUTIES_VIOLATION` |
  | Adjuntos obligatorios (factura, guía despacho) | blocking | 32 P1 | `MISSING_REQUIRED_ATTACHMENTS` |
  | Firma electrónica válida si aplica | blocking | 7 P1 | `SIGNATURE_REQUIRED` |
- **Dependencias:** `requestSignature` (condicional)
- **Evento emitido:** `GoodsReceiptConfirmed`, `ReceiptRejected` (si rechazo parcial)

#### `POST /goods-receipt-lines/{id}/inventory-entry` — `registerInventoryEntry` *(dependencia externa, ver §3)*
- **Sub-pasos:** 4.3 — alcance pendiente de decisión de bases (**[PENDIENTE P-44]**)

#### `POST /goods-receipts/{id}/accrual` — `recordAccrual`
- **Sub-pasos:** 4.4
- **Dependencias:** `recordAccrual` (Contabilidad, asíncrona) <!-- REVISAR: momento del devengado, ver §4 -->
- **Evento emitido:** `AccrualRecorded`

#### *(gestión del rechazo, sin operación de creación explícita — se genera desde `confirmReceipt` cuando hay líneas rechazadas)*
- **Sub-pasos:** 4.5
- **Evento emitido:** `ReceiptRejected`

### 2.5 Pago

#### `POST /purchase-orders/{id}/three-way-match` — `performThreeWayMatch`
- **Sub-pasos:** 5.1
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Recepción conforme aprobada | blocking | 31 P0 | `GOODS_RECEIPT_REQUIRED` |
  | Factura SII disponible y cruzable | blocking | 31 P0 | `INVOICE_PROVIDER_UNAVAILABLE` |
  | Montos concordantes (tolerancia ⚠) | blocking | P1 | `MATCH_DISCREPANCY` |
- **Dependencias:** `getInvoiceForMatch`, `readMpProcess`
- **Evento emitido:** `ThreeWayMatchCompleted`

#### `POST /three-way-matches/{id}/accrual` — `registerAccrual`
- **Sub-pasos:** 5.2
- **Reglas:** `match_status = matched` obligatorio (QA 31 P0)
- **Dependencias:** `registerAccrual` (Contabilidad)
- **Evento emitido:** `AccrualRegistered`

#### `POST /accruals/{id}/payment-decree` — `issuePaymentDecree`
- **Sub-pasos:** 5.3
- **Dependencias:** `requestSignature` (Core (FirmaGob))
- **Evento emitido:** `PaymentDecreeIssued`

#### `POST /payment-decrees/{id}/execute` — `executePayment`
- **Sub-pasos:** 5.4
- **Idempotencia:** requerida (`Idempotency-Key`)
- **Dependencias:** `executePayment` (Tesorería)
- **Evento emitido:** `PaymentCompleted`

---

## 3. Dependencias que requiere

Interfaces de proveedor — no llamadas a módulos concretos. Los **módulos de negocio** (Presupuestos, Contabilidad, Tesorería…) son intercambiables según modo de consumo. El **core** es obligatorio para integraciones externas (MP, FirmaGob, SII) y almacenamiento de archivos (`DocumentRef` vía C10).

Contrato del core: [`plataforma/contracts.md`](../../plataforma/contracts.md) §2.9–§2.10.

### 3.1 Presupuestos

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `checkBudgetAvailability` | 1.3, 1.5, 1.6 | Síncrona bloqueante | Error `BUDGET_PROVIDER_UNAVAILABLE`; operación no procede |
| `previewBudgetAvailability` | 1.1, 1.2 | Cacheada / informativa | Error en panel de autoconsulta; no bloquea creación ni aprobación |
| `createBudgetPreCommitment` | 1.6 | Síncrona bloqueante | Rechazo → `BUDGET_UNAVAILABLE`; sin efecto parcial |
| `commitBudget` | 3.4 *(CA)*, 3.14 *(LP)* | Síncrona bloqueante | Rechazo → `BUDGET_UNAVAILABLE`; OC queda `commitment_pending` — regularización pendiente (**[PENDIENTE P-40]**). Reemplaza el par anterior `convertPreCommitmentToCommitment`+`registerBudgetCommitment`. |
| `releasePreCommitment` | 3.6 | Síncrona bloqueante | Error `BUDGET_PROVIDER_UNAVAILABLE`; cancelación no se persiste sin liberación confirmada |
| `adjustPreCommitment` | 3.10 *(LP)* | Síncrona bloqueante | Ajuste de la preobligación al monto adjudicado, antes del Compromiso Cierto (3.14) |

### 3.2 Contabilidad

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `registerPreObligation` | 1.6 | Síncrona bloqueante | `ACCOUNTING_PROVIDER_UNAVAILABLE`; preobligación no persiste |
| `getInvoiceForMatch` | 5.1 | Síncrona bloqueante | `INVOICE_PROVIDER_UNAVAILABLE`; no habilita match |
| `registerAccrual` | 5.2 | Síncrona bloqueante | `ACCOUNTING_PROVIDER_UNAVAILABLE`; no persiste devengado <!-- REVISAR: momento del devengado, coexiste con `recordAccrual` de 4.4 — ver §4 --> |
| `recordAccrual` | 4.4 | Asíncrona *(la conformidad procede; el devengado confirma o revierte)* | Estado intermedio "conforme, devengado pendiente"; idempotencia por `goods_receipt_id`. Error `ACCRUAL_EXCEEDS_COMMITMENT` si excede el compromiso. <!-- REVISAR: momento del devengado, coexiste con `registerAccrual` de 5.2 — ver §4 --> |

### 3.3 Tesorería

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `executePayment` | 5.4 | Síncrona bloqueante | `TREASURY_PROVIDER_UNAVAILABLE` o `PAYMENT_REJECTED`; `payment_status = failed` |
| `registerGuaranteeCustody` | 3.7, 3.12 *(LP)* | Asíncrona | Custodia de garantías de seriedad/fiel cumplimiento; nueva dependencia de módulo desde la ficha LP |

### 3.4 Core — integraciones externas

Operaciones implementadas en el core ([`plataforma/contracts.md`](../../plataforma/contracts.md) §2.9). Contraparte en fichas: `Core (Mercado Público)`, `Core (FirmaGob)`, `Core (SII)`.

#### Mercado Público (C7, solo lectura)

Consolidado en torno a `readMpProcess`, operación única de lectura que atiende toda la etapa 2 (vinculación, §2.3) y toda la etapa 3, agnóstica de modalidad.

| Operación | Sub-pasos | Lectura MP (§5.3) | Clasificación | Comportamiento ante falla |
|---|---|---|---|---|
| `readMpProcess` — vinculación | 2.3, 3.5 *(LP, diferida)* | — | Síncrona bloqueante (solo en la vinculación) | `MP_PROCESS_NOT_FOUND` / `MP_PROCESS_ORGANISM_MISMATCH` / `MP_PROCESS_TYPE_MISMATCH` / `MP_PROCESS_ALREADY_LINKED`; `MP_PROVIDER_UNAVAILABLE` → **[PENDIENTE P-32]** |
| `readMpProcess` — período de cotización | 3.1 | Deseada | Asíncrona | Sin efecto de gestión (informativo); retroceso exponencial |
| `readMpProcess` — cierre y selección | 3.2 | Deseada | Asíncrona | Modo degradado: registro manual (`entry_mode = manual`) |
| `readMpProcess` — OC enviada / bloqueo | 3.3 | Deseada | Asíncrona | Modo degradado: se infiere del registro manual + deep link |
| `readMpProcess` — OC Aceptada | 3.4 *(CA)*, 3.14 *(LP)* | **Confirmada** | Asíncrona | Reintento con backoff; `PurchaseOrder` en `pending_mp_sync` |
| `readMpProcess` — OC Rechazada | 3.5 | Deseada | Asíncrona | Modo degradado: registro manual del rechazo |
| `readMpProcess` — desierto | 3.6 | Deseada | Asíncrona | Presunción de desierto vencido el plazo, confirmación manual |
| `readMpProcess` — foro/apertura/adjudicación *(LP)* | 3.6, 3.8, 3.10 | Deseada | Asíncrona | Modo degradado: registro manual del hito |
| `checkCatalogAvailability` | 2.1 | — | Cacheada (frescura diaria) | Advertencia `CATALOG_STALE` |

Ver [`integracion-mercado-publico.md`](../../arquitectura/integracion-mercado-publico.md): sin escritura API hacia MP.

#### FirmaGob (C9)

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `requestSignature` | 1.2, 1.5, 4.1, 5.3 | Síncrona bloqueante | `SIGNATURE_PROVIDER_UNAVAILABLE`; documento queda `pending_signature` |
| `confirmSignature` | 1.2, 1.5 | Síncrona bloqueante | `SIGNATURE_REJECTED`; no transiciona estado |

#### SII y referencias (C9)

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `getUtmValue` | 2.1 | Cacheada (frescura mensual) | `UTM_VALUE_UNAVAILABLE` |
| `getPriceReference` | 1.1 | Cacheada | `PRICE_REFERENCE_UNAVAILABLE` |
| `getInvoiceForMatch` | 5.1 | Síncrona bloqueante | `INVOICE_PROVIDER_UNAVAILABLE` |

### 3.5 Core — documentos (C10)

Patrón upload-then-reference: el cliente sube vía `storeDocument` → recibe `DocumentRef` → el módulo persiste solo el ref en operaciones de negocio. Sin endpoints multipart en el borde de Adquisiciones.

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `storeDocument` | 1.1, 1.5, 4.1 | Síncrona bloqueante | `DOCUMENT_STORAGE_UNAVAILABLE`, `DOCUMENT_TYPE_NOT_ALLOWED`, `DOCUMENT_SIZE_EXCEEDED` |
| `getDownloadUrl` | — *(lecturas de adjuntos)* | Síncrona | `DOCUMENT_NOT_FOUND`, `DOCUMENT_STORAGE_UNAVAILABLE` |

Campos de adjunto en entidades expuestas: `founded_resolution_attachment`, `scanned_certificate_attachment`, `supporting_document_ref`, `PurchaseRequestAttachment.document_ref` — todos `DocumentRef`.

### 3.6 Inventario *(propuesta, QA ítem 4)*

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `checkStockAvailability` | 1.1 | Síncrona bloqueante ⚠ | Procede sin verificación; log de auditoría |

---

## 4. Eventos que emite

Catálogo de hechos de dominio observables. **[PENDIENTE P-05]** mecanismo de entrega (webhooks, cola, polling).

| Evento | Sub-pasos | Esquema (campos principales) |
|---|---|---|
| `PurchaseRequestApproved` | 1.2 | `purchase_request_id`, `approver_id`, `approved_at` |
| `BudgetFinancingRequested` | 1.4 | `purchase_request_id`, `requested_at`, `justification` |
| `BudgetAvailabilityCertificateIssued` | 1.5 | `certificate_id`, `purchase_request_id`, `certificate_number`, `signed_at` |
| `BudgetPreCommitmentCreated` | 1.6 | `budget_pre_commitment_id`, `purchase_request_id`, `estimated_amount` |
| `PurchaseOrderIssued` | 3.3 *(antes 2.4 — renumerado tras la reconciliación)* | `purchase_order_id`, `mp_oc_id`, `total_amount`, `supplier_rut` |
| `PurchaseOrderAccepted` | 3.4 *(CA)* / 3.14 *(LP)* | `purchase_order_id`, `acceptance_date`, `total_amount` |
| `BudgetCommitmentCreated` | 3.4 *(CA)* / 3.14 *(LP)* | `budget_commitment_id`, `committed_amount`, `commitment_date` |
| `ProcurementModalityConfirmed` | 2.1 | `modality_decision_id`, `procurement_case_id`, `procurement_type` |
| `ProcurementModalityApproved` | 2.2 | `modality_decision_approval_id`, `procurement_case_id` — **[PENDIENTE P-38]** |
| `NormativeParameterChanged` | 2.1 (gobernanza) | `parameter_code`, `value`, `valid_from`, `approved_by` |
| `MpProcessLinked` | 2.3, 3.5 *(LP)* | `procurement_case_id`, `mp_process_id`, `procurement_type` |
| `MpStateChanged` | 3.1 | `mp_process_snapshot_ref` |
| `QuotationClosed` | 3.2 | `quotation_result_id`, `procurement_case_id` |
| `ProviderIneligibleBlocked` | 3.3 | `purchase_order_id`, `provider_rut` |
| `PurchaseOrderRejected` | 3.5 | `purchase_order_id`, `rejection_reason` |
| `ProcurementProcessFailed` | 3.6 | `procurement_case_id`, causa (`deserted`/`all_rejected`), decisión |
| `GoodsReceiptConfirmed` | 4.2 *(antes 4.1 — renumerado)* | `goods_receipt_id`, `purchase_order_id`, `status` |
| `ReceiptRejected` | 4.5 | `receipt_rejection_case_id`, `goods_receipt_line_ids` |
| `ThreeWayMatchCompleted` | 5.1 | `three_way_match_id`, `match_status`, `match_date` |
| `AccrualRegistered` | 5.2 | `accrual_id`, `accrual_amount`, `accrual_date` — <!-- REVISAR: momento del devengado, coexiste con `AccrualRecorded` de 4.4, ver nota abajo --> |
| `AccrualRecorded` | 4.4 | `accrual_ref`, `procurement_case_id` — <!-- REVISAR: momento del devengado, coexiste con `AccrualRegistered` de 5.2 --> |
| `PaymentDecreeIssued` | 5.3 | `payment_decree_id`, `decree_number`, `decree_date` |
| `PaymentCompleted` | 5.4 | `payment_id`, `payment_date`, `payment_status` |

> <!-- REVISAR: `AccrualRegistered` (5.2, disparado por `ThreeWayMatch`) y `AccrualRecorded` (4.4, disparado por conformidad de recepción) coexisten como dos eventos de devengado distintos — no se fusionan aquí. Ver **[PENDIENTE P-46]** momento del devengado. -->
> <!-- REVISAR: frontera Pago/Tesorería — los eventos de la sección 2.5 (Pago) asumen que Pago es una etapa propia de Adquisiciones (`procesos-transversales/5-pago.md`), mientras la ficha de Recepción Conforme (4.4) asume que Pago pertenece a un módulo Tesorería separado. Ver **[PENDIENTE P-47]**. -->

---

## 5. Alineación ficha QA → contrato

Ítems P0/P1 del piloto Compra Ágil mapeados a operaciones y reglas.

| QA # | Prioridad | Tema | Operación | Regla / error |
|---|---|---|---|---|
| 5 | P1 | Seguimiento de firmas | `approvePurchaseRequest` | `SIGNATURE_REQUIRED` |
| 7 | P1 | Firma electrónica SOLPED | `approvePurchaseRequest`, `confirmGoodsReceipt` | `SIGNATURE_REQUIRED` |
| 8 | P1 | Trazabilidad disponibilidad | `verifyBudgetAvailability`, `issueBudgetAvailabilityCertificate` | Respuesta incluye desglose de saldo |
| 9 | P1 | Segregación CDP | `issueBudgetAvailabilityCertificate` | `SEGREGATION_OF_DUTIES_VIOLATION` |
| 11 | P0 | Preobligación sin saldo | `createBudgetPreCommitment`, `commitBudget` | `BUDGET_UNAVAILABLE` |
| 27 | P0 | Obligación excede saldo | `commitBudget` | `BUDGET_UNAVAILABLE` |
| 31 | P0 | Devengado sin recepción | `performThreeWayMatch`, `registerAccrual` | `GOODS_RECEIPT_REQUIRED`, `THREE_WAY_MATCH_REQUIRED` |
| 32 | P1 | Recepción sin adjuntos | `confirmReceipt` | `MISSING_REQUIRED_ATTACHMENTS` |
| 53 | P0 | Cantidad cero | `createPurchaseRequest` | `INVALID_QUANTITY` |

Ítems QA de otras modalidades (Comisión Evaluadora, etc.) **excluidos** del alcance del piloto Compra Ágil; la ficha de Licitación Pública (`3. licitacion-publica/3-resolucion-compra.md`) ya documenta Comisión Evaluadora (3.9) pero sus ítems QA e integración a esta sección quedan pendientes de una pasada dedicada a esa modalidad.

---

## 6. Trazabilidad proceso ↔ contrato

| Sub-paso | Operaciones ofrecidas | Dependencias | Eventos |
|---|---|---|---|
| — | `listProcurementCases`, `getProcurementCase`, `listProcurementCaseSteps`, `listPurchaseRequests`, `getPurchaseRequest`, `listPurchaseOrders`, `getPurchaseOrder` | — | — |
| 1.1 | `createPurchaseRequest`, `submitPurchaseRequest` | `getPriceReference`, `checkStockAvailability`, `previewBudgetAvailability` | — |
| 1.2 | `approvePurchaseRequest`, `rejectPurchaseRequest` | `requestSignature`, `confirmSignature`, `previewBudgetAvailability` | `PurchaseRequestApproved` |
| 1.3 | `verifyBudgetAvailability` | `checkBudgetAvailability` | — |
| 1.4 | `requestBudgetFinancing` | — | `BudgetFinancingRequested` |
| 1.5 | `issueBudgetAvailabilityCertificate`, `registerScannedBudgetAvailabilityCertificate` | `checkBudgetAvailability`, `requestSignature`, `confirmSignature` *(solo electronic)* | `BudgetAvailabilityCertificateIssued` |
| 1.6 | `createBudgetPreCommitment` | `createBudgetPreCommitment`, `registerPreObligation` | `BudgetPreCommitmentCreated` |
| 2.1 | `confirmProcurementModality` | `getUtmValue`, `checkCatalogAvailability` | `ProcurementModalityConfirmed` |
| 2.2 | `approveModalityDecision`, `rejectModalityDecision` *(inferidos)* | `requestSignature`, `confirmSignature` (condicional) | `ProcurementModalityApproved` — **[PENDIENTE P-38]** |
| 2.3 | `linkMpProcess` | `readMpProcess` | `MpProcessLinked` |
| 3.1 *(CA)* | — *(lectura MP)* | `readMpProcess` | `MpStateChanged` |
| 3.2 *(CA)* | `recordQuotationResult` *(inferido)* | `readMpProcess` | `QuotationClosed` |
| 3.3 *(CA)* | `registerPurchaseOrder` | `readMpProcess` | `PurchaseOrderIssued`, `ProviderIneligibleBlocked` |
| 3.4 *(CA)* | `syncPurchaseOrderAccepted` | MP, `commitBudget` (Presupuestos) | `PurchaseOrderAccepted`, `BudgetCommitmentCreated` |
| 3.5 *(CA)* | — *(lectura MP)* | `readMpProcess` | `PurchaseOrderRejected` |
| 3.6 *(CA)* | `releasePreCommitment` | `readMpProcess`, `releasePreCommitment` (Presupuestos) | `ProcurementProcessFailed` |
| 3.1–3.3 *(LP)* | — *(bases, revisión jurídica, acto aprobatorio — sin cruce salvo firma)* | `requestSignature`/`confirmSignature` (3.3) | `LegalReviewCompleted` (3.2), `AdministrativeActSigned` (3.3) |
| 3.4, 3.11 *(LP)* | — *(registro manual, sin API)* | Contraloría (sin integración asumida) | — |
| 3.5 *(LP)* | `linkMpProcess` *(reutiliza 2.3, vinculación diferida)* | `readMpProcess` | `MpProcessLinked` |
| 3.6–3.9 *(LP)* | — | `readMpProcess` (foro, apertura), `registerGuaranteeCustody` (3.7), `Core (FirmaGob)` (3.9 condicional) | `GuaranteeRegistered` (3.7), `EvaluationCompleted` (3.9) |
| 3.10 *(LP)* | — *(resolución de adjudicación/deserción/revocación)* | `adjustPreCommitment` (Presupuestos) | — |
| 3.12–3.13 *(LP)* | — | `registerGuaranteeCustody`, `Core (FirmaGob)` (3.13) | — |
| 3.14 *(LP)* | `syncPurchaseOrderAccepted` | MP, `commitBudget` (Presupuestos) | `PurchaseOrderAccepted`, `BudgetCommitmentCreated` |
| 4.1 | `registerReceipt` | — | — |
| 4.2 | `confirmReceipt` *(inferido)* | `requestSignature` (condicional) | `GoodsReceiptConfirmed` |
| 4.3 | — | `registerInventoryEntry` (proveedor de inventario) | — |
| 4.4 | `recordAccrual` | Contabilidad | `AccrualRecorded` — **[PENDIENTE P-46]** |
| 4.5 | — *(gestión de rechazo, ver 4.2)* | — | `ReceiptRejected` |
| 5.1 | `performThreeWayMatch` | `getInvoiceForMatch`, MP | `ThreeWayMatchCompleted` |
| 5.2 | `registerAccrual` | `registerAccrual` | `AccrualRegistered` — **[PENDIENTE P-46]** |
| 5.3 | `issuePaymentDecree` | `requestSignature` | `PaymentDecreeIssued` |
| 5.4 | `executePayment` | `executePayment` | `PaymentCompleted` |
