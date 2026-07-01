# 1. SOLPED

*Proceso transversal — aplica a las 4 modalidades de compra (ver [Adquisiciones](../overview.md))*

## 1.1 — Creación de solicitud

| Campo | Valor |
|---|---|
| Unidad | Unidad Solicitante |
| Rol | Usuario |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** La Unidad Solicitante crea la SOLPED en el SGM.

**Entidad(es) y campos:**
- `PurchaseRequest` — `requesting_unit` (ref. `OrganizationalUnit`), `description` (texto), `justification` (texto), `requested_date` (fecha), `status` (enum: `draft`)
- `PurchaseRequestLine` (1 SOLPED → N líneas) — `item_description` (texto), `quantity` (número), `unit_of_measure` (ref. `UnitOfMeasure`), `unit_price` (número, **obligatorio**), `price_source` (ref. `PriceReference`)
- `PriceReference` (nueva) — `item_code` / `item_description_hash`, `source` (enum: `SII`, `mercado_publico_historico`, `otro`), `reference_price` (número), `reference_date` (fecha), `currency` (enum)

> `unit_price` es obligatorio a nivel de línea, y debe validarse contra una fuente externa confiable (`PriceReference`) al momento de creación — no es un valor de ingreso libre sin referencia.

**Edge cases:**
- SOLPED incompleta o sin justificación → sistema no permite avanzar a V°B° (`status` no transiciona a `pending_approval` sin campos obligatorios completos).
- Fuente de precios no disponible (API caída) → ¿se bloquea la línea o se permite ingreso manual con flag `price_manually_entered`?
- Precio ingresado muy distinto al de referencia → sin % de desviación definido (patrón transversal, ver también 3.2 y 5.1).

> ⚠ **Pendiente de definir:** fuente API concreta para `PriceReference` (SII, histórico de Mercado Público, u otra). Regla de tolerancia de desviación de precio — candidata a reutilizarse en 3.2 y 5.1.

---

## 1.2 — Visto bueno de jefatura

| Campo | Valor |
|---|---|
| Unidad | Unidad Solicitante |
| Rol | Aprobador |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Jefatura de la unidad revisa y aprueba la SOLPED antes de que pase a Finanzas.

**Entidad(es) y campos:**
- `PurchaseRequestApproval` — `purchase_request_id` (ref. `PurchaseRequest`), `approver_id` (ref. `User`), `decision` (enum: `approved`, `rejected`), `decision_date` (fecha), `comments` (texto, obligatorio si `decision = rejected`)

**Edge cases:**
- Rechazo de jefatura → `PurchaseRequest.status` vuelve a `draft`; sin loop automático de reintento definido en la fuente.

> ⚠ **Pendiente de definir:** estructura de `rejection_reason` (¿texto libre o catálogo estructurado de motivos?) — validar en levantamiento.

---

## 1.3 — Pre-afectación presupuestaria

| Campo | Valor |
|---|---|
| Unidad | DAF Finanzas |
| Rol | Aprobador |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Finanzas realiza la Pre-afectación presupuestaria sobre la SOLPED aprobada. El sistema queda a la espera de Mercado Público.

**Entidad(es) y campos:**
- `BudgetPreCommitment` — `purchase_request_id` (ref. `PurchaseRequest`, 1:1), `budget_line_id` (ref. `BudgetLine`), `estimated_amount` (número), `fiscal_year` (número), `status` (enum: `active`)

**Edge cases:**
- Sin disponibilidad presupuestaria → bloqueo antes de continuar a Modalidad de Compra.

> ⚠ **Pendiente de definir:** gateway de disponibilidad presupuestaria — probablemente requiere campo calculado `available_balance` en `BudgetLine`.

---

## Resumen de entidades — Etapa 1

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `PurchaseRequest` | Raíz de la etapa | 1 por SOLPED |
| `PurchaseRequestLine` | 1:N con `PurchaseRequest` | Ítems de la solicitud, con `unit_price` obligatorio |
| `PriceReference` | N:1 con `PurchaseRequestLine` | Nueva — fuente de precio a definir |
| `PurchaseRequestApproval` | 1:N con `PurchaseRequest` | Historial de decisiones (permite múltiples ciclos rechazo/reenvío) |
| `BudgetPreCommitment` | 1:1 con `PurchaseRequest` | Pendiente definir qué ocurre si se rechaza tras esta etapa |

**Siguiente etapa:** 2. Modalidad de Compra *(específica por modalidad — ver [Compra Ágil](../1.%20compra-agil/2-modalidad-compra.md) como referencia documentada)*
