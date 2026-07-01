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

**Edge cases:**
- Proveedor inhábil → sistema bloquea la aceptación (`status = blocked_ineligible`).
- Proveedor rechaza la OC → `status = rejected_by_supplier`, habilita 2ª mejor oferta (retorno a 2.4) o cancelación completa.

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

**Edge cases:**
- Monto real de MP distinto al estimado en Pre-afectación → sin regla de tolerancia definida (mismo patrón que 1.1 y 5.1).
- Falla de sincronización API → estado intermedio no definido en la fuente.

> ⚠ **Pendiente de definir:** regla de tolerancia de desviación de monto (reutilizable con 1.1 y 5.1) y manejo de fallas de sincronización API.

---

## Resumen de entidades — Etapa 3

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `PurchaseOrder` | Actualización (creada en 2.4) | Se agregan campos de aceptación y elegibilidad |
| `BudgetCommitment` | 1:1 con `PurchaseOrder` y `BudgetPreCommitment` | Hito contable crítico — cierre del ciclo de pre-afectación |

**Etapa anterior:** [2. Modalidad de Compra](./2-modalidad-compra.md) · **Siguiente etapa:** [4. Recepción Conforme →](../procesos-transversales/4-recepcion-conforme.md) (transversal)
