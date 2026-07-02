# 3. Resolución de Compra *(contenido específico: Compra Ágil)*

*Macroproceso: [Compra Ágil](./overview.md) · Etapa anterior: [2. Modalidad de Compra](./2-modalidad-compra.md)*

> Para Compra Ágil no existe un acto de resolución formal separado — el hito equivalente es la aceptación de la OC por parte del proveedor y el disparo del compromiso contable.

## 3.1 — Aceptación de OC por el proveedor

| Campo | Valor |
|---|---|
| Unidad | — (sin unidad SGM interviniente) |
| Rol | N/A (proveedor externo) |
| Plataforma | Mercado Público |
| Optativo | Falso |

**Detalle:** El proveedor hace clic en "Aceptar" sobre la OC emitida. MP valida en tiempo real la habilidad tributaria y laboral del proveedor (Tesorería / Dirección del Trabajo) antes de confirmar.

**Entidad(es) y campos:**
- `PurchaseOrder.status` (enum, transiciona a `accepted` o `rejected`)
- `PurchaseOrder.acceptance_date` (fecha, nula hasta este paso)
- `PurchaseOrder.supplier_eligibility_check` (booleano)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | `getPurchaseOrderStatus` | Mercado Público (solo lectura) | Asíncrona | Entrada: `mp_oc_id` — Respuesta: `status`, `acceptance_date`, `supplier_eligibility_check` |

**Edge cases:**
- Proveedor inhábil → sistema bloquea la aceptación (`status = blocked_ineligible`).
- Proveedor rechaza la OC → `status = rejected_by_supplier`, habilita 2ª mejor oferta (retorno a 2.4) o cancelación completa.
- MP no disponible al consultar estado → SGM mantiene `PurchaseOrder.status = issued`; reintento de sincronización programado. Usuario puede verificar manualmente en portal MP.

---

## 3.2 — Lectura API y Compromiso Cierto

| Campo | Valor |
|---|---|
| Unidad | Contabilidad / Tesorería |
| Rol | N/A (automático) |
| Plataforma | SGM (lectura API desde MP) |
| Optativo | Falso |

**Detalle:** ChileCompra notifica al SGM. El SGM extrae automáticamente RUT, monto y razón social, y gatilla el paso contable de Pre-afectación a Compromiso Cierto (Obligación). Este es un **hito crítico** — ver `arquitectura/integracion-mercado-publico.md`.

**Entidad(es) y campos:**
- `BudgetCommitment` (nueva) — `purchase_order_id` (ref. `PurchaseOrder`), `budget_pre_commitment_id` (ref. `BudgetPreCommitment`), `committed_amount` (número), `commitment_date` (fecha), `source` (enum: `api_sync`)
- `PurchaseOrder` — actualización de `total_amount`, `supplier_rut` desde MP si difieren

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | `syncPurchaseOrderAccepted` | Mercado Público (solo lectura) | Asíncrona | Entrada: `mp_oc_id` — Respuesta: `supplier_rut`, `total_amount`, `acceptance_date` |
| 2 | Dependencia | `convertPreCommitmentToCommitment` | Presupuestos | Síncrona bloqueante | Entrada: `budget_pre_commitment_id`, `committed_amount`, `purchase_order_id` — Respuesta: `BudgetCommitment` (`id`, `status`) |
| 3 | Dependencia | `registerBudgetCommitment` | Contabilidad | Asíncrona | Entrada: `BudgetCommitment`, `PurchaseOrder` — Respuesta: `accounting_entry_ref` |
| 4 | Evento | `PurchaseOrderAccepted` | — | Asíncrona | `PurchaseOrder` (`id`, `status`, `acceptance_date`, `total_amount`) |
| 5 | Evento | `BudgetCommitmentCreated` | — | Asíncrona | `BudgetCommitment` (`id`, `committed_amount`, `commitment_date`) |

**Edge cases:**
- Monto real de MP distinto al estimado en Pre-afectación → sin regla de tolerancia definida (mismo patrón que 1.1 y 5.1). Si excede tolerancia *(cuando se defina)* → `convertPreCommitmentToCommitment` rechazado con `AMOUNT_DEVIATION_EXCEEDED` (`severity: blocking`, QA ítem 27 P0).
- Falla de sincronización API MP → `PurchaseOrder` queda en `pending_mp_sync`; reintento automático con backoff. No se crea `BudgetCommitment` hasta sincronización exitosa.
- Presupuestos no disponible al convertir → operación no procede; retorna `BUDGET_PROVIDER_UNAVAILABLE` (`severity: blocking`). Estado intermedio `commitment_pending`.
- Presupuestos rechaza conversión (saldo insuficiente) → `BUDGET_UNAVAILABLE` (`severity: blocking`, QA ítem 11 P0). Requiere intervención DAF.

> ⚠ **Pendiente de definir:** regla de tolerancia de desviación de monto (reutilizable con 1.1 y 5.1) y política de reintentos ante falla de notificación MP.

---

## Resumen de entidades — Etapa 3

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `PurchaseOrder` | Actualización (creada en 2.4) | Se agregan campos de aceptación y elegibilidad |
| `BudgetCommitment` | 1:1 con `PurchaseOrder` y `BudgetPreCommitment` | Hito contable crítico — cierre del ciclo de pre-afectación |

## Resumen de bordes — Etapa 3

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 3.1 | Sistema externo | `getPurchaseOrderStatus` | Mercado Público |
| 3.2 | Sistema externo | `syncPurchaseOrderAccepted` | Mercado Público |
| 3.2 | Dependencia | `convertPreCommitmentToCommitment` | Presupuestos |
| 3.2 | Dependencia | `registerBudgetCommitment` | Contabilidad |
| 3.2 | Evento | `PurchaseOrderAccepted`, `BudgetCommitmentCreated` | — |

**Etapa anterior:** [2. Modalidad de Compra](./2-modalidad-compra.md) · **Siguiente etapa:** [4. Recepción Conforme →](../procesos-transversales/4-recepcion-conforme.md) (transversal)
