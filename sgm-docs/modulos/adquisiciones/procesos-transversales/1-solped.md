# 1. SOLPED

*Proceso transversal — documentado en el piloto [Compra Ágil](../1.%20compra-agil/overview.md). Aplica conceptualmente a las 4 modalidades; extensión a otras modalidades pendiente de validación del piloto.*

## 1.1 — Creación de solicitud

| Materia | Valor |
|---|---|
| Unidad municipal | Unidad Solicitante |
| Rol | Usuario |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** La Unidad Solicitante crea la SOLPED en el SGM.

**Entidad(es) y campos:**
- `PurchaseRequest` — `requesting_unit` (ref. `OrganizationalUnit`), `description` (texto), `justification` (texto), `requested_date` (fecha), `status` (enum: `draft`)
- `PurchaseRequestLine` (1 SOLPED → N líneas) — `item_description` (texto), `quantity` (número), `unit_of_measure` (ref. `UnitOfMeasure`), `unit_price` (número, **obligatorio**), `price_source` (ref. `PriceReference`)
- `PriceReference` (nueva) — `item_code` / `item_description_hash`, `source` (enum: `SII`, `mercado_publico_historico`, `otro`), `reference_price` (número), `reference_date` (fecha), `currency` (enum)

> `unit_price` es obligatorio a nivel de línea, y debe validarse contra una fuente externa confiable (`PriceReference`) al momento de creación — no es un valor de ingreso libre sin referencia.

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | `getPriceReference` | SII / Mercado Público (histórico) | Cacheada | `PriceReference` (`item_code`, `reference_price`, `reference_date`, `source`) |
| 2 | Dependencia *(propuesta, QA ítem 4)* | `checkStockAvailability` | Inventario | Síncrona bloqueante *(asesora hasta definir alcance)* | Entrada: `item_code`, `quantity` — Respuesta: `available_quantity`, `suggested_action` (`use_stock` \| `continue_purchase`) |

**Edge cases:**
- SOLPED incompleta o sin justificación → sistema no permite avanzar a V°B° (`status` no transiciona a `pending_approval` sin campos obligatorios completos).
- Fuente de precios no disponible (API caída) → operación `createPurchaseRequest` retorna `PRICE_REFERENCE_UNAVAILABLE` (`severity: blocking`) hasta definir regla alternativa; ver pendiente.
- Precio ingresado muy distinto al de referencia → sin % de desviación definido (patrón transversal, ver también 3.2 y 5.1).
- Proveedor Inventario no disponible *(si se adopta ítem 4)* → `createPurchaseRequest` procede sin verificación de stock; se registra advertencia en log de auditoría.

> ⚠ **Pendiente de definir:** fuente API concreta para `PriceReference` (SII, histórico de Mercado Público, u otra). Regla de tolerancia de desviación de precio — candidata a reutilizarse en 3.2 y 5.1. Comportamiento ante caída de API de precios: ¿bloqueo total o ingreso manual con flag `price_manually_entered`?

---

## 1.2 — Visto bueno de jefatura

| Materia | Valor |
|---|---|
| Unidad municipal | Unidad Solicitante |
| Rol | Aprobador |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Jefatura de la unidad revisa y aprueba la SOLPED antes de que pase a Finanzas. La aprobación requiere firma electrónica avanzada conforme a normativa (QA ítems 5, 7).

**Entidad(es) y campos:**
- `PurchaseRequestApproval` — `purchase_request_id` (ref. `PurchaseRequest`), `approver_id` (ref. `User`), `decision` (enum: `approved`, `rejected`), `decision_date` (fecha), `comments` (texto, obligatorio si `decision = rejected`)
- `PurchaseRequest.status` (enum, transiciona a `pending_finance` si `approved`, o `draft` si `rejected`)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `requestSignature` | FirmaGob | Síncrona bloqueante | Entrada: `document_id`, `document_type`, `signer_id` — Respuesta: `signature_request_id`, `status` |
| 2 | Dependencia | `confirmSignature` | FirmaGob | Síncrona bloqueante | Entrada: `signature_request_id` — Respuesta: `signed_at`, `certificate_ref` |
| 3 | Evento | `PurchaseRequestApproved` | — (consumidores: Presupuestos, auditoría) | Asíncrona | `PurchaseRequest` (`id`, `requesting_unit`, `status`), `PurchaseRequestApproval` |

**Edge cases:**
- Rechazo de jefatura → `PurchaseRequest.status` vuelve a `draft`; sin loop automático de reintento definido en la fuente.
- FirmaGob no disponible o rechaza firma → `approvePurchaseRequest` no procede; retorna `SIGNATURE_PROVIDER_UNAVAILABLE` o `SIGNATURE_REJECTED` (`severity: blocking`). SOLPED permanece en `pending_approval`.
- Firma pendiente (usuario no completó en FirmaGob) → estado intermedio `pending_signature`; reintento vía `confirmSignature`.

> ⚠ **Pendiente de definir:** estructura de `rejection_reason` (¿texto libre o catálogo estructurado de motivos?) — validar en levantamiento. Medida transitoria si FirmaGob no está disponible en piloto: adjunto obligatorio de visación manual con auditoría (propuesta QA ítem 7).

---

## 1.3 — Pre-afectación presupuestaria

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Finanzas |
| Rol | Aprobador |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Finanzas realiza la Pre-afectación presupuestaria sobre la SOLPED aprobada. El sistema queda a la espera de Mercado Público.

**Entidad(es) y campos:**
- `BudgetPreCommitment` — `purchase_request_id` (ref. `PurchaseRequest`, 1:1), `budget_line_id` (ref. `BudgetLine`), `estimated_amount` (número), `fiscal_year` (número), `status` (enum: `active`)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `checkBudgetAvailability` | Presupuestos | Síncrona bloqueante | Entrada: `budget_line_id`, `amount`, `fiscal_year` — Respuesta: `available_balance`, `committed_by_others`, `projected_balance`, `certificate_ref` |
| 2 | Dependencia | `createBudgetPreCommitment` | Presupuestos | Síncrona bloqueante | Entrada: `purchase_request_id`, `budget_line_id`, `estimated_amount` — Respuesta: `BudgetPreCommitment` (`id`, `status`) |
| 3 | Evento | `BudgetPreCommitmentCreated` | — (consumidores: Contabilidad, reportería) | Asíncrona | `BudgetPreCommitment`, `PurchaseRequest.id` |

**Edge cases:**
- Sin disponibilidad presupuestaria → `createBudgetPreCommitment` rechazado con `BUDGET_UNAVAILABLE` (`severity: blocking`, QA ítems 8, 11 P0/P1). No se avanza a Modalidad de Compra.
- Proveedor Presupuestos no responde (timeout/error 5xx) → operación no procede; retorna `BUDGET_PROVIDER_UNAVAILABLE` (`severity: blocking`). SOLPED permanece en `pending_finance`; reintento manual.
- Proveedor rechaza pre-afectación (saldo insuficiente tras recálculo) → mismo que sin disponibilidad; usuario puede solicitar financiamiento a DAF (flujo fuera de Adquisiciones).
- Usuario generador y aprobador del CDP son la misma persona → `createBudgetPreCommitment` rechazado con `SEGREGATION_OF_DUTIES_VIOLATION` (QA ítem 9 P1).

> ⚠ **Pendiente de definir:** gateway de disponibilidad presupuestaria — probablemente requiere campo calculado `available_balance` en `BudgetLine`. Qué ocurre si se revierte la SOLPED tras pre-afectación activa.

---

## Resumen de entidades — Etapa 1

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `PurchaseRequest` | Raíz de la etapa | 1 por SOLPED |
| `PurchaseRequestLine` | 1:N con `PurchaseRequest` | Ítems de la solicitud, con `unit_price` obligatorio |
| `PriceReference` | N:1 con `PurchaseRequestLine` | Nueva — fuente de precio a definir |
| `PurchaseRequestApproval` | 1:N con `PurchaseRequest` | Historial de decisiones (permite múltiples ciclos rechazo/reenvío) |
| `BudgetPreCommitment` | 1:1 con `PurchaseRequest` | Pendiente definir qué ocurre si se rechaza tras esta etapa |

## Resumen de bordes — Etapa 1

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 1.1 | Sistema externo | `getPriceReference` | SII / Mercado Público |
| 1.1 | Dependencia *(propuesta)* | `checkStockAvailability` | Inventario |
| 1.2 | Dependencia | `requestSignature`, `confirmSignature` | FirmaGob |
| 1.2 | Evento | `PurchaseRequestApproved` | — |
| 1.3 | Dependencia | `checkBudgetAvailability`, `createBudgetPreCommitment` | Presupuestos |
| 1.3 | Evento | `BudgetPreCommitmentCreated` | — |

**Siguiente etapa:** 2. Modalidad de Compra — [Compra Ágil](../1.%20compra-agil/2-modalidad-compra.md)
