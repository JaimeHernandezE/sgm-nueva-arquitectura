# 4. Recepción Conforme

*Proceso transversal — aplica a las 4 modalidades de compra · Etapa anterior: 3. Resolución de Compra (específica por modalidad — ver [Compra Ágil](../1.%20compra-agil/3-resolucion-compra.md) como referencia documentada)*

## 4.1 — Registro de recepción física

| Campo | Valor |
|---|---|
| Unidad | Unidad Solicitante |
| Rol | Usuario |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Ocurre la recepción física del bien/servicio. La Unidad Solicitante ingresa la Recepción Conforme en el SGM.

**Entidad(es) y campos:**
- `GoodsReceipt` (nueva) — `purchase_order_id` (ref. `PurchaseOrder`), `received_by` (ref. `User`), `received_date` (fecha), `received_quantity` (número, por línea), `conformity_status` (enum: `conforme`, `no_conforme`), `observations` (texto, obligatorio si `no_conforme`)
- `GoodsReceiptLine` (sugerida, no confirmada en fuente) — 1:N con `GoodsReceipt`, para trazar recepción por ítem

**Edge cases:**
- Recepción parcial (cantidad recibida < OC) → sin regla explícita en la fuente.
- Recepción "no conforme" → no está definido qué gatilla (¿bloquea pago automáticamente? ¿reabre negociación con proveedor?).

> ⚠ **Pendiente de definir:** regla de recepción parcial y flujo de resolución para recepción "no conforme".

---

## Resumen de entidades — Etapa 4

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `GoodsReceipt` | 1:N con `PurchaseOrder` (si se permite parcial) | Punto de entrada del proceso físico al sistema |
| `GoodsReceiptLine` | 1:N con `GoodsReceipt` (sugerida) | Necesaria si se requiere trazar recepción por ítem |

**Etapa anterior:** 3. Resolución de Compra *(específica por modalidad)* · **Siguiente etapa:** [5. Pago →](./5-pago.md)
