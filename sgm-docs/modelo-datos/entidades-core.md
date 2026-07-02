# Entidades Core del Modelo de Datos

Fuente única de las entidades del modelo de datos SGM. Los macroprocesos **referencian** estas entidades — no las redefinen. Si un macroproceso necesita un campo nuevo en una entidad ya existente aquí, se agrega en este archivo y se referencia desde el subproceso correspondiente, para evitar que la misma entidad diverja entre módulos.

**Convención de nombres:** inglés, estilo técnico (`PurchaseRequest`, no `SolicitudCompra`).

**Visibilidad de borde:** cada entidad indica si es **interna** al módulo o **expuesta** en el contrato API ([`modulos/adquisiciones/contracts.md`](../modulos/adquisiciones/contracts.md)). Por defecto toda entidad es interna; la exposición se declara explícitamente.

**Estado de esta lista:** poblada a partir del macroproceso Compra Ágil (Adquisiciones). Se irá extendiendo a medida que se documenten otras modalidades tras validar el piloto.

---

## Adquisiciones

### `PurchaseRequest` (SOLPED)
**Visibilidad:** expuesta — campos en contrato: `id`, `requesting_unit`, `description`, `justification`, `requested_date`, `status`

Origen: `modulos/adquisiciones/procesos-transversales/1-solped.md`

| Campo | Tipo | Notas |
|---|---|---|
| `requesting_unit` | ref. `OrganizationalUnit` | |
| `description` | texto | |
| `justification` | texto | |
| `requested_date` | fecha | |
| `status` | enum | `draft`, `pending_approval`, `pending_finance`, `quoting_in_progress`, `quote_void`, … |

### `PurchaseRequestLine`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `item_description`, `quantity`, `unit_of_measure`, `unit_price`, `price_source`

1:N con `PurchaseRequest`.

| Campo | Tipo | Notas |
|---|---|---|
| `item_description` | texto | |
| `quantity` | número | |
| `unit_of_measure` | ref. `UnitOfMeasure` | |
| `unit_price` | número | Obligatorio |
| `price_source` | ref. `PriceReference` | |

### `PriceReference`
**Visibilidad:** interna — usada en validación de `createPurchaseRequest`; no cruza borde como entidad independiente

N:1 con `PurchaseRequestLine`. **Nueva — fuente API de precio aún sin definir.**

| Campo | Tipo | Notas |
|---|---|---|
| `item_code` / `item_description_hash` | texto | Pendiente definir mecanismo de match |
| `source` | enum | `SII`, `mercado_publico_historico`, `otro` — **pendiente de definir cuál usar** |
| `reference_price` | número | |
| `reference_date` | fecha | |
| `currency` | enum | Probablemente siempre CLP |

### `PurchaseRequestApproval`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `approver_id`, `decision`, `decision_date`, `comments`

1:N con `PurchaseRequest`. Historial de decisiones — permite múltiples ciclos rechazo/reenvío.

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_request_id` | ref. `PurchaseRequest` | |
| `approver_id` | ref. `User` | |
| `decision` | enum | `approved`, `rejected` |
| `decision_date` | fecha | |
| `comments` | texto | Obligatorio si `decision = rejected` |

### `BudgetPreCommitment` (Pre-afectación)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `budget_line_id`, `estimated_amount`, `fiscal_year`, `status`

1:1 con `PurchaseRequest`.

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_request_id` | ref. `PurchaseRequest` | |
| `budget_line_id` | ref. `BudgetLine` | |
| `estimated_amount` | número | |
| `fiscal_year` | número | |
| `status` | enum | `active`, … |

### `AgileQuoteProcess`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `deep_link_clicked_at`, `mp_quote_id`

1:1 con `PurchaseRequest`. Puente de trazabilidad SGM↔MP, específico de Compra Ágil — solo campos de trazabilidad, la lógica de negocio de la cotización vive en MP.

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_request_id` | ref. `PurchaseRequest` | |
| `deep_link_clicked_at` | fecha/hora | |
| `mp_quote_id` | texto | Nulo hasta sincronización |

### `PurchaseOrder` (OC)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `mp_oc_id`, `supplier_rut`, `total_amount`, `selection_justification`, `status`, `acceptance_date`

1:1 con `PurchaseRequest` en Compra Ágil — **posible 1:N en otras modalidades** (extensión futura).

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_request_id` | ref. `PurchaseRequest` | |
| `mp_oc_id` | texto | |
| `supplier_rut` | texto | |
| `total_amount` | número | |
| `selection_justification` | texto | Obligatorio si no se eligió la oferta de menor precio |
| `status` | enum | `issued`, `accepted`, `rejected`, `blocked_ineligible`, `rejected_by_supplier`, `pending_mp_sync`, `commitment_pending` |
| `acceptance_date` | fecha | Nula hasta aceptación |
| `supplier_eligibility_check` | booleano | Resultado de validación de habilidad tributaria/laboral |
| `cancellation_reason` | texto | Solo si se cancela antes de emitir |

### `BudgetCommitment` (Compromiso Cierto / Obligación)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `budget_pre_commitment_id`, `committed_amount`, `commitment_date`, `source`

1:1 con `PurchaseOrder` y con `BudgetPreCommitment`. Hito contable crítico — cierre del ciclo de pre-afectación.

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_order_id` | ref. `PurchaseOrder` | |
| `budget_pre_commitment_id` | ref. `BudgetPreCommitment` | |
| `committed_amount` | número | Monto real desde MP — puede diferir del `estimated_amount` |
| `commitment_date` | fecha | Automática |
| `source` | enum | `api_sync` — distingue de futuros ajustes manuales |

### `GoodsReceipt` (Recepción Conforme)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `received_by`, `received_date`, `conformity_status`, `observations`

1:N con `PurchaseOrder` (si se permite recepción parcial — pendiente confirmar regla).

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_order_id` | ref. `PurchaseOrder` | |
| `received_by` | ref. `User` | |
| `received_date` | fecha | |
| `received_quantity` | número | Por línea |
| `conformity_status` | enum | `conforme`, `no_conforme` |
| `observations` | texto | Obligatorio si `no_conforme` |

### `GoodsReceiptLine` *(sugerida, no confirmada en fuente)*
**Visibilidad:** interna — candidata a exposición si se confirma trazabilidad por ítem

1:N con `GoodsReceipt`. Necesaria si se requiere trazar recepción por ítem, no solo a nivel de OC.

### `ThreeWayMatch` (Cruce de 3 vías)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `goods_receipt_id`, `invoice_id`, `match_status`, `match_date`

1:1:1 con `PurchaseOrder`, `GoodsReceipt`, `Invoice`. Punto de control crítico — sin regla de tolerancia de discrepancia definida (ya identificado como control interno crítico en la ficha QA, ítems P1).

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_order_id` | ref. `PurchaseOrder` | |
| `goods_receipt_id` | ref. `GoodsReceipt` | |
| `invoice_id` | ref. `Invoice` (fuente SII) | |
| `match_status` | enum | `matched`, `discrepancy` |
| `match_date` | fecha | |

### `Accrual` (Devengado)
**Visibilidad:** expuesta — campos en contrato: `id`, `three_way_match_id`, `budget_commitment_id`, `accrual_amount`, `accrual_date`

1:1 con `ThreeWayMatch` y `BudgetCommitment`. Cierra el ciclo presupuestario.

| Campo | Tipo | Notas |
|---|---|---|
| `three_way_match_id` | ref. `ThreeWayMatch` | |
| `budget_commitment_id` | ref. `BudgetCommitment` | |
| `accrual_amount` | número | |
| `accrual_date` | fecha | |

### `PaymentDecree` (Decreto de Pago)
**Visibilidad:** expuesta — campos en contrato: `id`, `accrual_id`, `decree_number`, `decree_date`, `approver_id`

1:1 con `Accrual`.

| Campo | Tipo | Notas |
|---|---|---|
| `accrual_id` | ref. `Accrual` | |
| `decree_number` | texto | Correlativo |
| `decree_date` | fecha | |
| `approver_id` | ref. `User` | |

### `Payment` (Pago)
**Visibilidad:** expuesta — campos en contrato: `id`, `payment_decree_id`, `payment_date`, `payment_method`, `payment_status`

1:1 con `PaymentDecree`. Falta definir manejo de vencimiento de plazo legal (30 días corridos desde factura).

| Campo | Tipo | Notas |
|---|---|---|
| `payment_decree_id` | ref. `PaymentDecree` | |
| `payment_date` | fecha | |
| `payment_method` | enum | |
| `payment_status` | enum | `completed`, `failed` |

---

## Patrones transversales pendientes de definir

Estos puntos aparecen repetidos en más de una entidad/subproceso y son candidatos a resolverse con una única regla de negocio reutilizable:

- **Regla de tolerancia de desviación de montos/precios** — aparece en `PurchaseRequestLine.unit_price` vs. `PriceReference`, en `BudgetCommitment.committed_amount` vs. `BudgetPreCommitment.estimated_amount`, y en `ThreeWayMatch` (discrepancia entre OC/Recepción/Factura).
- **Fuente(s) API externas confiables** — `PriceReference.source` queda sin fuente concreta definida.
- **Manejo de fallas de sincronización/disponibilidad de API externa** — relevante para `AgileQuoteProcess` (deep link sin completar) y `BudgetCommitment` (falla de notificación desde MP).

## Módulos aún no documentados

Tesorería, Contabilidad, Presupuestos y RRHH/Remuneraciones todavía no tienen entidades levantadas en este archivo. Varias entidades de Adquisiciones (`BudgetLine`, `Invoice`, `User`, `OrganizationalUnit`) se referencian aquí como dependencias externas asumidas — deberán definirse formalmente cuando se documenten esos módulos.
