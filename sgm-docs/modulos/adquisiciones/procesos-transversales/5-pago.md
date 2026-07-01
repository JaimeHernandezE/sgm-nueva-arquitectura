# 5. Pago

*Proceso transversal — aplica a las 4 modalidades de compra · Etapa anterior: [4. Recepción Conforme](./4-recepcion-conforme.md)*

## 5.1 — Cruce de 3 vías (Match)

| Campo | Valor |
|---|---|
| Unidad | Contabilidad / Tesorería |
| Rol | N/A / a definir |
| Plataforma | SGM (cruce interno) + SII (factura) |
| Optativo | Falso |

**Detalle:** El sistema cruza tres fuentes: Orden de Compra (MP), Recepción Conforme (SGM) y Factura (SII), como condición para habilitar el Devengado.

**Entidad(es) y campos:**
- `ThreeWayMatch` (nueva) — `purchase_order_id` (ref. `PurchaseOrder`), `goods_receipt_id` (ref. `GoodsReceipt`), `invoice_id` (ref. `Invoice`, fuente SII), `match_status` (enum: `matched`, `discrepancy`), `match_date` (fecha)

**Edge cases:**
- Discrepancia entre las 3 fuentes (ej. monto factura ≠ monto OC) → sin regla de tolerancia ni flujo de resolución definido. Ya identificado como punto de control interno crítico en la ficha QA (ítems P1).

> ⚠ **Pendiente de definir:** regla de tolerancia de discrepancia (reutilizable con 1.1 y 3.2) y flujo de resolución de discrepancias.

---

## 5.2 — Registro de Devengado

| Campo | Valor |
|---|---|
| Unidad | Contabilidad / Tesorería |
| Rol | Aprobador |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Con el match validado, se registra el Devengado.

**Entidad(es) y campos:**
- `Accrual` (Devengado, nueva) — `three_way_match_id` (ref. `ThreeWayMatch`), `budget_commitment_id` (ref. `BudgetCommitment`), `accrual_amount` (número), `accrual_date` (fecha)

---

## 5.3 — Generación de Decreto de Pago

| Campo | Valor |
|---|---|
| Unidad | Contabilidad / Tesorería |
| Rol | Aprobador |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Se genera el Decreto de Pago sobre el Devengado registrado.

**Entidad(es) y campos:**
- `PaymentDecree` (nueva) — `accrual_id` (ref. `Accrual`), `decree_number` (texto, correlativo), `decree_date` (fecha), `approver_id` (ref. `User`)

---

## 5.4 — Ejecución del pago

| Campo | Valor |
|---|---|
| Unidad | Tesorería |
| Rol | Aprobador |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Se ejecuta el pago al proveedor.

**Entidad(es) y campos:**
- `Payment` (nueva) — `payment_decree_id` (ref. `PaymentDecree`), `payment_date` (fecha), `payment_method` (enum), `payment_status` (enum: `completed`, `failed`)

**Edge cases:**
- Plazo máximo de 30 días corridos desde factura para pagar — sin campo de alerta/vencimiento definido en la fuente.

> ⚠ **Pendiente de definir:** campo `due_date` calculado (`Invoice.issue_date` + regla de negocio) con alerta si `payment_date` lo excede.

---

## Resumen de entidades — Etapa 5

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `ThreeWayMatch` | 1:1:1 con `PurchaseOrder`, `GoodsReceipt`, `Invoice` | Punto de control crítico — sin regla de discrepancia aún |
| `Accrual` | 1:1 con `ThreeWayMatch` y `BudgetCommitment` | Cierra el ciclo presupuestario |
| `PaymentDecree` | 1:1 con `Accrual` | — |
| `Payment` | 1:1 con `PaymentDecree` | Falta definir manejo de vencimiento de plazo legal |

**Etapa anterior:** [4. Recepción Conforme](./4-recepcion-conforme.md) · **Fin del ciclo de compra** — vuelve a [Adquisiciones](../overview.md)
