# Contrato del módulo: Adquisiciones

> Piloto: macroproceso **Compra Ágil** (SOLPED → Pago, 14 sub-pasos).
> Estado: borrador funcional derivado de fichas de flujo y ficha QA.
> Estándares transversales: [`arquitectura/estandares-api.md`](../../arquitectura/estandares-api.md)
> Metodología: [`arquitectura/contrato-api-first.md`](../../arquitectura/contrato-api-first.md)
> Entidades canónicas: [`modelo-datos/entidades-core.md`](../../modelo-datos/entidades-core.md)

**Alcance:** solo Compra Ágil. Otras modalidades se extenderán tras validar este piloto.

---

## 1. Entidades que expone

Entidades visibles fuera del borde del módulo Adquisiciones. Definición completa en `entidades-core.md`; aquí el subconjunto expuesto en API.

| Entidad | Visibilidad | Campos expuestos | Sub-pasos origen |
|---|---|---|---|
| `PurchaseRequest` | Expuesta | `id`, `requesting_unit`, `description`, `justification`, `requested_date`, `purchase_modality`, `founded_resolution_attachment`, `status` | 1.1, 1.2, 2.1, 2.2 |
| `PurchaseRequestLine` | Expuesta | `id`, `purchase_request_id`, `item_description`, `quantity`, `unit_of_measure`, `unit_price`, `price_source` | 1.1 |
| `PurchaseRequestApproval` | Expuesta | `id`, `purchase_request_id`, `approver_id`, `decision`, `decision_date`, `comments` | 1.2 |
| `BudgetPreCommitment` | Expuesta | `id`, `purchase_request_id`, `budget_line_id`, `estimated_amount`, `fiscal_year`, `status` | 1.3 |
| `AgileQuoteProcess` | Expuesta | `id`, `purchase_request_id`, `deep_link_clicked_at`, `mp_quote_id` | 2.1, 2.2 |
| `PurchaseOrder` | Expuesta | `id`, `purchase_request_id`, `mp_oc_id`, `supplier_rut`, `total_amount`, `selection_justification`, `status`, `acceptance_date` | 2.4, 3.1, 3.2 |
| `BudgetCommitment` | Expuesta | `id`, `purchase_order_id`, `budget_pre_commitment_id`, `committed_amount`, `commitment_date`, `source` | 3.2 |
| `GoodsReceipt` | Expuesta | `id`, `purchase_order_id`, `received_by`, `received_date`, `conformity_status`, `observations` | 4.1 |
| `ThreeWayMatch` | Expuesta | `id`, `purchase_order_id`, `goods_receipt_id`, `invoice_id`, `match_status`, `match_date` | 5.1 |
| `Accrual` | Expuesta | `id`, `three_way_match_id`, `budget_commitment_id`, `accrual_amount`, `accrual_date` | 5.2 |
| `PaymentDecree` | Expuesta | `id`, `accrual_id`, `decree_number`, `decree_date`, `approver_id` | 5.3 |
| `Payment` | Expuesta | `id`, `payment_decree_id`, `payment_date`, `payment_method`, `payment_status` | 5.4 |

**Internas (no expuestas en contrato):** `PriceReference` (dato de validación embebido en línea), `GoodsReceiptLine` *(sugerida)*.

---

## 2. Operaciones que ofrece

Convenciones de error y paginación según [`estandares-api.md`](../../arquitectura/estandares-api.md). Rutas sin prefijo de tenant hasta resolver multitenancy (**[PENDIENTE P-03]**).

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
- **Dependencias invocadas:** `getPriceReference`, `checkStockAvailability` *(propuesta)*

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

#### `POST /purchase-requests/{id}/budget-pre-commitment` — `createBudgetPreCommitment`
- **Sub-pasos:** 1.3
- **Entrada:** `budget_line_id`, `estimated_amount`, `fiscal_year`
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Disponibilidad presupuestaria con trazabilidad de saldo | blocking | 8, 11 P0/P1 | `BUDGET_UNAVAILABLE` |
  | Generador ≠ aprobador CDP (segregación funciones) | blocking | 9 P1 | `SEGREGATION_OF_DUTIES_VIOLATION` |
  | SOLPED en `pending_finance` | blocking | — | `INVALID_STATUS` |
- **Dependencias:** `checkBudgetAvailability`, `createBudgetPreCommitment` (Presupuestos)
- **Evento emitido:** `BudgetPreCommitmentCreated`

### 2.2 Modalidad de Compra (Compra Ágil)

#### `POST /purchase-requests/{id}/agile-quote/deep-link` — `recordDeepLinkClick`
- **Sub-pasos:** 2.1
- **Respuesta:** URL deep link MP + `AgileQuoteProcess.deep_link_clicked_at`

#### `POST /purchase-requests/{id}/agile-quote/sync` — `syncQuoteId`
- **Sub-pasos:** 2.2
- **Entrada:** `mp_quote_id`
- **Reglas:** ID válido → `status = quoting_in_progress`
- **Dependencias:** `validateQuoteId` (MP)

#### `GET /purchase-requests/{id}/agile-quote/summary` — `getQuoteSummary`
- **Sub-pasos:** 2.3
- **Dependencias:** `getQuoteSummary` (MP)

#### `POST /purchase-requests/{id}/purchase-orders` — `registerPurchaseOrder`
- **Sub-pasos:** 2.4
- **Entrada:** `mp_oc_id`, `supplier_rut`, `total_amount`, `selection_justification`
- **Evento emitido:** `PurchaseOrderIssued`

### 2.3 Resolución de Compra (Compra Ágil)

#### `POST /purchase-orders/{id}/sync-accepted` — `syncPurchaseOrderAccepted`
- **Sub-pasos:** 3.2
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Monto comprometido dentro de tolerancia vs pre-afectación | blocking ⚠ | 27 P0 | `AMOUNT_DEVIATION_EXCEEDED` |
  | Saldo presupuestario al convertir compromiso | blocking | 11 P0 | `BUDGET_UNAVAILABLE` |
- **Dependencias:** `syncPurchaseOrderAccepted` (MP), `convertPreCommitmentToCommitment` (Presupuestos), `registerBudgetCommitment` (Contabilidad)
- **Eventos:** `PurchaseOrderAccepted`, `BudgetCommitmentCreated`

### 2.4 Recepción Conforme

#### `POST /purchase-orders/{id}/goods-receipts` — `createGoodsReceipt`
- **Sub-pasos:** 4.1
- **Entrada:** `GoodsReceipt` + líneas

#### `POST /goods-receipts/{id}/confirm` — `confirmGoodsReceipt`
- **Sub-pasos:** 4.1
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Adjuntos obligatorios (factura, guía despacho) | blocking | 32 P1 | `MISSING_REQUIRED_ATTACHMENTS` |
  | Firma si aplica | blocking | 7 P1 | `SIGNATURE_REQUIRED` |
- **Evento emitido:** `GoodsReceiptConfirmed`

### 2.5 Pago

#### `POST /purchase-orders/{id}/three-way-match` — `performThreeWayMatch`
- **Sub-pasos:** 5.1
- **Reglas:**
  | Regla | Severidad | QA | Error |
  |---|---|---|---|
  | Recepción conforme aprobada | blocking | 31 P0 | `GOODS_RECEIPT_REQUIRED` |
  | Factura SII disponible y cruzable | blocking | 31 P0 | `INVOICE_PROVIDER_UNAVAILABLE` |
  | Montos concordantes (tolerancia ⚠) | blocking | P1 | `MATCH_DISCREPANCY` |
- **Dependencias:** `getInvoiceForMatch`, `getPurchaseOrderFromMP`
- **Evento emitido:** `ThreeWayMatchCompleted`

#### `POST /three-way-matches/{id}/accrual` — `registerAccrual`
- **Sub-pasos:** 5.2
- **Reglas:** `match_status = matched` obligatorio (QA 31 P0)
- **Dependencias:** `registerAccrual` (Contabilidad)
- **Evento emitido:** `AccrualRegistered`

#### `POST /accruals/{id}/payment-decree` — `issuePaymentDecree`
- **Sub-pasos:** 5.3
- **Dependencias:** `requestSignature` (FirmaGob)
- **Evento emitido:** `PaymentDecreeIssued`

#### `POST /payment-decrees/{id}/execute` — `executePayment`
- **Sub-pasos:** 5.4
- **Idempotencia:** requerida (`Idempotency-Key`)
- **Dependencias:** `executePayment` (Tesorería)
- **Evento emitido:** `PaymentCompleted`

---

## 3. Dependencias que requiere

Interfaces de proveedor — no llamadas a módulos concretos. El proveedor puede ser otro módulo SGM o un adaptador municipal.

### 3.1 Presupuestos

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `checkBudgetAvailability` | 1.3, 3.2 | Síncrona bloqueante | Error `BUDGET_PROVIDER_UNAVAILABLE`; operación no procede |
| `createBudgetPreCommitment` | 1.3 | Síncrona bloqueante | Rechazo → `BUDGET_UNAVAILABLE`; sin efecto parcial |
| `convertPreCommitmentToCommitment` | 3.2 | Síncrona bloqueante | Rechazo → `BUDGET_UNAVAILABLE`; OC queda `commitment_pending` |

### 3.2 Contabilidad

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `registerBudgetCommitment` | 3.2 | Asíncrona | Reintento; alerta operacional si persiste |
| `getInvoiceForMatch` | 5.1 | Síncrona bloqueante | `INVOICE_PROVIDER_UNAVAILABLE`; no habilita match |
| `registerAccrual` | 5.2 | Síncrona bloqueante | `ACCOUNTING_PROVIDER_UNAVAILABLE`; no persiste devengado |

### 3.3 Tesorería

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `executePayment` | 5.4 | Síncrona bloqueante | `TREASURY_PROVIDER_UNAVAILABLE` o `PAYMENT_REJECTED`; `payment_status = failed` |

### 3.4 FirmaGob

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `requestSignature` | 1.2, 4.1, 5.3 | Síncrona bloqueante | `SIGNATURE_PROVIDER_UNAVAILABLE`; documento queda `pending_signature` |
| `confirmSignature` | 1.2 | Síncrona bloqueante | `SIGNATURE_REJECTED`; no transiciona estado |

### 3.5 Mercado Público (solo lectura)

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `validateQuoteId` | 2.2 | Síncrona bloqueante ⚠ | `MP_PROVIDER_UNAVAILABLE`; reintento manual |
| `getQuoteSummary` | 2.3 | Asíncrona | Muestra último estado en caché con advertencia de frescura |
| `getPurchaseOrderFromMP` | 2.4, 5.1 | Asíncrona / Cacheada | Usa último sync; advertencia si antiguo |
| `getPurchaseOrderStatus` | 3.1 | Asíncrona | Mantiene estado `issued`; reintento programado |
| `syncPurchaseOrderAccepted` | 3.2 | Asíncrona | `pending_mp_sync`; reintento con backoff |

Ver [`integracion-mercado-publico.md`](../../arquitectura/integracion-mercado-publico.md): sin escritura API hacia MP.

### 3.6 SII / facturación

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `getPriceReference` | 1.1 | Cacheada | `PRICE_REFERENCE_UNAVAILABLE` |
| `getInvoiceForMatch` | 5.1 | Síncrona bloqueante | `INVOICE_PROVIDER_UNAVAILABLE` |

### 3.7 Inventario *(propuesta, QA ítem 4)*

| Operación | Sub-pasos | Clasificación | Comportamiento ante falla |
|---|---|---|---|
| `checkStockAvailability` | 1.1 | Síncrona bloqueante ⚠ | Procede sin verificación; log de auditoría |

---

## 4. Eventos que emite

Catálogo de hechos de dominio observables. **[PENDIENTE P-05]** mecanismo de entrega (webhooks, cola, polling).

| Evento | Sub-pasos | Esquema (campos principales) |
|---|---|---|
| `PurchaseRequestApproved` | 1.2 | `purchase_request_id`, `approver_id`, `approved_at` |
| `BudgetPreCommitmentCreated` | 1.3 | `budget_pre_commitment_id`, `purchase_request_id`, `estimated_amount` |
| `PurchaseOrderIssued` | 2.4 | `purchase_order_id`, `mp_oc_id`, `total_amount`, `supplier_rut` |
| `PurchaseOrderAccepted` | 3.2 | `purchase_order_id`, `acceptance_date`, `total_amount` |
| `BudgetCommitmentCreated` | 3.2 | `budget_commitment_id`, `committed_amount`, `commitment_date` |
| `GoodsReceiptConfirmed` | 4.1 | `goods_receipt_id`, `purchase_order_id`, `conformity_status` |
| `ThreeWayMatchCompleted` | 5.1 | `three_way_match_id`, `match_status`, `match_date` |
| `AccrualRegistered` | 5.2 | `accrual_id`, `accrual_amount`, `accrual_date` |
| `PaymentDecreeIssued` | 5.3 | `payment_decree_id`, `decree_number`, `decree_date` |
| `PaymentCompleted` | 5.4 | `payment_id`, `payment_date`, `payment_status` |

---

## 5. Alineación ficha QA → contrato

Ítems P0/P1 del piloto Compra Ágil mapeados a operaciones y reglas.

| QA # | Prioridad | Tema | Operación | Regla / error |
|---|---|---|---|---|
| 5 | P1 | Seguimiento de firmas | `approvePurchaseRequest` | `SIGNATURE_REQUIRED` |
| 7 | P1 | Firma electrónica SOLPED | `approvePurchaseRequest`, `confirmGoodsReceipt` | `SIGNATURE_REQUIRED` |
| 8 | P1 | Trazabilidad disponibilidad | `createBudgetPreCommitment` | Respuesta incluye desglose de saldo |
| 9 | P1 | Segregación CDP | `createBudgetPreCommitment` | `SEGREGATION_OF_DUTIES_VIOLATION` |
| 11 | P0 | Preobligación sin saldo | `createBudgetPreCommitment`, `syncPurchaseOrderAccepted` | `BUDGET_UNAVAILABLE` |
| 27 | P0 | Obligación excede saldo | `syncPurchaseOrderAccepted` | `AMOUNT_DEVIATION_EXCEEDED` / `BUDGET_UNAVAILABLE` |
| 31 | P0 | Devengado sin recepción | `performThreeWayMatch`, `registerAccrual` | `GOODS_RECEIPT_REQUIRED`, `THREE_WAY_MATCH_REQUIRED` |
| 32 | P1 | Recepción sin adjuntos | `confirmGoodsReceipt` | `MISSING_REQUIRED_ATTACHMENTS` |
| 53 | P0 | Cantidad cero | `createPurchaseRequest` | `INVALID_QUANTITY` |

Ítems QA de otras modalidades (Comisión Evaluadora, etc.) **excluidos** del alcance actual.

---

## 6. Trazabilidad proceso ↔ contrato

| Sub-paso | Operaciones ofrecidas | Dependencias | Eventos |
|---|---|---|---|
| 1.1 | `createPurchaseRequest`, `submitPurchaseRequest` | `getPriceReference`, `checkStockAvailability` | — |
| 1.2 | `approvePurchaseRequest`, `rejectPurchaseRequest` | `requestSignature`, `confirmSignature` | `PurchaseRequestApproved` |
| 1.3 | `createBudgetPreCommitment` | `checkBudgetAvailability`, `createBudgetPreCommitment` | `BudgetPreCommitmentCreated` |
| 2.1 | `recordDeepLinkClick` | — | — |
| 2.2 | `syncQuoteId` | `validateQuoteId` | — |
| 2.3 | `getQuoteSummary` | `getQuoteSummary` | — |
| 2.4 | `registerPurchaseOrder` | `getPurchaseOrderFromMP` | `PurchaseOrderIssued` |
| 3.1 | — *(lectura MP)* | `getPurchaseOrderStatus` | — |
| 3.2 | `syncPurchaseOrderAccepted` | MP, Presupuestos, Contabilidad | `PurchaseOrderAccepted`, `BudgetCommitmentCreated` |
| 4.1 | `createGoodsReceipt`, `confirmGoodsReceipt` | `requestSignature` | `GoodsReceiptConfirmed` |
| 5.1 | `performThreeWayMatch` | `getInvoiceForMatch`, MP | `ThreeWayMatchCompleted` |
| 5.2 | `registerAccrual` | `registerAccrual` | `AccrualRegistered` |
| 5.3 | `issuePaymentDecree` | `requestSignature` | `PaymentDecreeIssued` |
| 5.4 | `executePayment` | `executePayment` | `PaymentCompleted` |
