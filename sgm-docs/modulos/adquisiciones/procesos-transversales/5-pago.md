# 5. Pago

*Proceso transversal — documentado en el piloto [Compra Ágil](../1.%20compra-agil/overview.md). Etapa anterior: [4. Recepción Conforme](./4-recepcion-conforme.md)*

*Roles de la fila **Rol:** nombre (usuarios) + código (sistema) según el catálogo transversal [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md) (P-24).*

## 5.1 — Cruce de 3 vías (Match)

| Materia | Valor |
|---|---|
| Unidad municipal | Contabilidad / Tesorería |
| Rol | Operador de pago ([`adq.operador_pago`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM (cruce interno) + SII (factura) |
| Optativo | Falso |

**Detalle:** El sistema cruza tres fuentes: Orden de Compra (MP), Recepción Conforme (SGM) y Factura (SII), como condición para habilitar el Devengado (QA ítem 31 P0).

**Entidad(es) y campos:**
- `ThreeWayMatch` — `purchase_order_id` (ref., **obligatorio**), `goods_receipt_id` (ref., **obligatorio**), `invoice_id` (ref. `Invoice`, **obligatorio** al ejecutar match), `match_status` (enum, **obligatorio**), `match_date` (fecha, **obligatorio**)
- Pantalla: `invoice_number` (texto, **obligatorio** para buscar en SII)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `getInvoiceForMatch` | SII / Contabilidad | Síncrona bloqueante | Entrada: `supplier_rut`, `invoice_number`, `purchase_order_id` — Respuesta: `Invoice` (`id`, `amount`, `issue_date`, `tax_details`) |
| 2 | Sistema externo | `readMpProcess` | Core (Mercado Público) | Cacheada | Entrada: `mp_oc_id` — Respuesta: `total_amount` para cruce |
| 3 | Evento | `ThreeWayMatchCompleted` | — | Asíncrona | `ThreeWayMatch` (`id`, `match_status`, `match_date`) |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Ejecutar cruce 3 vías | `performThreeWayMatch` | `MISSING_REQUIRED_FIELD` | `invoice_number` | El campo Número de factura es obligatorio. | blocking |
| Ejecutar cruce 3 vías | `performThreeWayMatch` | `MISSING_REQUIRED_FIELD` | `goods_receipt_id` | Debe existir una recepción conforme asociada. | blocking |
| Ejecutar cruce 3 vías | `performThreeWayMatch` | `GOODS_RECEIPT_REQUIRED` | `goods_receipt_id` | Se requiere recepción conforme para el cruce de 3 vías. | blocking |
| Ejecutar cruce 3 vías | `performThreeWayMatch` | `MATCH_DISCREPANCY` | — | Hay discrepancia entre OC, recepción y factura. | blocking |
| Ejecutar cruce 3 vías | `performThreeWayMatch` | `INVOICE_PROVIDER_UNAVAILABLE` | — | El proveedor de facturas / SII no está disponible. | blocking |
| Ejecutar cruce 3 vías | `performThreeWayMatch` | `STALE_OC_AMOUNT` | — | El monto de OC sincronizado puede estar desactualizado. | advisory |

**Edge cases:**
- Discrepancia entre las 3 fuentes (ej. monto factura ≠ monto OC) → `match_status = discrepancy`; `performThreeWayMatch` retorna `MATCH_DISCREPANCY` (`severity: blocking`, QA P1). Sin regla de tolerancia ni flujo de resolución definido.
- SII / proveedor de facturas no disponible → `performThreeWayMatch` retorna `INVOICE_PROVIDER_UNAVAILABLE` (`severity: blocking`). No se habilita devengado.
- Recepción conforme ausente o no conforme → `performThreeWayMatch` retorna `GOODS_RECEIPT_REQUIRED` (`severity: blocking`, QA ítem 31 P0).
- MP no disponible para monto OC → usa último `PurchaseOrder.total_amount` sincronizado; si antiguo (>24h), advertencia `STALE_OC_AMOUNT`.

> ⚠ **Pendiente de definir:** regla de tolerancia de discrepancia (reutilizable con 1.1 y 3.2) y flujo de resolución de discrepancias.

---

## 5.2 — Registro de Devengado

| Materia | Valor |
|---|---|
| Unidad municipal | Contabilidad / Tesorería |
| Rol | Operador de pago ([`adq.operador_pago`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Con el match validado, se registra el Devengado.

**Entidad(es) y campos:**
- `Accrual` (Devengado, nueva) — `three_way_match_id` (ref. `ThreeWayMatch`), `budget_commitment_id` (ref. `BudgetCommitment`), `accrual_amount` (número), `accrual_date` (fecha)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `registerAccrual` | Contabilidad | Síncrona bloqueante | Entrada: `Accrual`, `BudgetCommitment.id` — Respuesta: `accounting_entry_ref` |
| 2 | Evento | `AccrualRegistered` | — | Asíncrona | `Accrual` (`id`, `accrual_amount`, `accrual_date`) |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Registrar devengado | `registerAccrual` | `THREE_WAY_MATCH_REQUIRED` | `three_way_match_id` | El cruce de 3 vías debe estar en estado matched. | blocking |
| Registrar devengado | `registerAccrual` | `ACCOUNTING_PROVIDER_UNAVAILABLE` | — | Contabilidad no está disponible. | blocking |
| Registrar devengado | `registerAccrual` | `MISSING_REQUIRED_FIELD` | `accrual_amount` | El campo Monto del devengado es obligatorio. | blocking |

**Edge cases:**
- Match no validado (`match_status ≠ matched`) → `registerAccrual` rechazado con `THREE_WAY_MATCH_REQUIRED` (`severity: blocking`).
- Contabilidad no disponible → retorna `ACCOUNTING_PROVIDER_UNAVAILABLE` (`severity: blocking`). `Accrual` no se persiste.

---

## 5.3 — Generación de Decreto de Pago

| Materia | Valor |
|---|---|
| Unidad municipal | Contabilidad / Tesorería |
| Rol | Operador de pago ([`adq.operador_pago`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Se genera el Decreto de Pago sobre el Devengado registrado.

**Entidad(es) y campos:**
- `PaymentDecree` (nueva) — `accrual_id` (ref. `Accrual`), `decree_number` (texto, correlativo), `decree_date` (fecha), `approver_id` (ref. `User`)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `requestSignature` | Core (FirmaGob) | Síncrona bloqueante | Entrada: `document_id` (decreto), `signer_id` |
| 2 | Evento | `PaymentDecreeIssued` | — | Asíncrona | `PaymentDecree` (`id`, `decree_number`, `decree_date`) |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Emitir decreto de pago | `issuePaymentDecree` | `ACCRUAL_NOT_REGISTERED` | `accrual_id` | Se requiere un devengado registrado en Contabilidad. | blocking |
| Emitir decreto de pago | `issuePaymentDecree` | `SIGNATURE_REQUIRED` | — | Se requiere firma electrónica avanzada válida. | blocking |
| Emitir decreto de pago | `issuePaymentDecree` | `SIGNATURE_PROVIDER_UNAVAILABLE` | — | FirmaGob no está disponible. | blocking |

**Edge cases:**
- FirmaGob no disponible → `issuePaymentDecree` no procede; retorna `SIGNATURE_PROVIDER_UNAVAILABLE`.
- Devengado no registrado en Contabilidad → `issuePaymentDecree` rechazado con `ACCRUAL_NOT_REGISTERED`.

---

## 5.4 — Ejecución del pago

| Materia | Valor |
|---|---|
| Unidad municipal | Tesorería |
| Rol | Operador de pago ([`adq.operador_pago`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Se ejecuta el pago al proveedor.

**Entidad(es) y campos:**
- `Payment` (nueva) — `payment_decree_id` (ref. `PaymentDecree`), `payment_date` (fecha), `payment_method` (enum), `payment_status` (enum: `completed`, `failed`)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `executePayment` | Tesorería | Síncrona bloqueante | Entrada: `PaymentDecree.id`, `supplier_rut`, `amount`, `payment_method` — Respuesta: `payment_ref`, `payment_status` |
| 2 | Evento | `PaymentCompleted` | — | Asíncrona | `Payment` (`id`, `payment_date`, `payment_status`) |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Ejecutar pago | `executePayment` | `MISSING_REQUIRED_FIELD` | `payment_method` | El campo Medio de pago es obligatorio. | blocking |
| Ejecutar pago | `executePayment` | `PAYMENT_REJECTED` | — | Tesorería rechazó la ejecución del pago. | blocking |
| Ejecutar pago | `executePayment` | `TREASURY_PROVIDER_UNAVAILABLE` | — | Tesorería no está disponible. | blocking |

**Edge cases:**
- Plazo máximo de 30 días corridos desde factura para pagar — sin campo de alerta/vencimiento definido en la fuente.
- Tesorería rechaza ejecución (fondos insuficientes, datos bancarios inválidos) → `payment_status = failed`; retorna error estructurado `PAYMENT_REJECTED`.
- Tesorería no disponible → `executePayment` retorna `TREASURY_PROVIDER_UNAVAILABLE` (`severity: blocking`). Reintento manual.

> ⚠ **Pendiente de definir:** campo `due_date` calculado (`Invoice.issue_date` + regla de negocio) con alerta si `payment_date` lo excede.

---

## Resumen de entidades — Etapa 5

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `ThreeWayMatch` | 1:1:1 con `PurchaseOrder`, `GoodsReceipt`, `Invoice` | Punto de control crítico — sin regla de discrepancia aún |
| `Accrual` | 1:1 con `ThreeWayMatch` y `BudgetCommitment` | Cierra el ciclo presupuestario |
| `PaymentDecree` | 1:1 con `Accrual` | — |
| `Payment` | 1:1 con `PaymentDecree` | Falta definir manejo de vencimiento de plazo legal |

## Resumen de bordes — Etapa 5

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 5.1 | Dependencia | `getInvoiceForMatch` | SII / Contabilidad |
| 5.1 | Sistema externo | `readMpProcess` | Core (Mercado Público) |
| 5.1 | Evento | `ThreeWayMatchCompleted` | — |
| 5.2 | Dependencia + Evento | `registerAccrual`, `AccrualRegistered` | Contabilidad |
| 5.3 | Dependencia + Evento | `requestSignature`, `PaymentDecreeIssued` | Core (FirmaGob) |
| 5.4 | Dependencia + Evento | `executePayment`, `PaymentCompleted` | Tesorería |

**Etapa anterior:** [4. Recepción Conforme](./4-recepcion-conforme.md) · **Fin del ciclo de compra** — vuelve a [Adquisiciones](../overview.md)
