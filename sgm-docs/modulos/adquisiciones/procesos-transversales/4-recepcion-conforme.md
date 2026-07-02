# 4. Recepción Conforme

*Proceso transversal — documentado en el piloto [Compra Ágil](../1.%20compra-agil/overview.md). Etapa anterior: 3. Resolución de Compra (específica por modalidad — [Compra Ágil](../1.%20compra-agil/3-resolucion-compra.md))*

## 4.1 — Registro de recepción física

| Materia | Valor |
|---|---|
| Unidad municipal | Unidad Solicitante |
| Rol | Usuario |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Ocurre la recepción física del bien/servicio. La Unidad Solicitante ingresa la Recepción Conforme en el SGM.

**Entidad(es) y campos:**
- `GoodsReceipt` (nueva) — `purchase_order_id` (ref. `PurchaseOrder`), `received_by` (ref. `User`), `received_date` (fecha), `received_quantity` (número, por línea), `conformity_status` (enum: `conforme`, `no_conforme`), `observations` (texto, obligatorio si `no_conforme`)
- `GoodsReceiptLine` (sugerida, no confirmada en fuente) — 1:N con `GoodsReceipt`, para trazar recepción por ítem

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia *(opcional, QA ítem 7)* | `requestSignature` | FirmaGob | Síncrona bloqueante | Entrada: `document_id` (recepción conforme), `signer_id` |
| 2 | Evento | `GoodsReceiptConfirmed` | — (consumidores: Contabilidad, Pago) | Asíncrona | `GoodsReceipt` (`id`, `purchase_order_id`, `conformity_status`, `received_date`) |

**Edge cases:**
- Recepción parcial (cantidad recibida < OC) → sin regla explícita en la fuente.
- Recepción "no conforme" → emite `GoodsReceiptConfirmed` con `conformity_status = no_conforme`; bloquea avance a Pago (5.1) hasta resolución.
- FirmaGob no disponible al confirmar recepción *(si firma es obligatoria)* → `confirmGoodsReceipt` no procede; retorna `SIGNATURE_PROVIDER_UNAVAILABLE`.
- Sin documentos adjuntos obligatorios (factura, guía despacho) → `confirmGoodsReceipt` rechazado con `MISSING_REQUIRED_ATTACHMENTS` (QA ítem 32 P1).

> ⚠ **Pendiente de definir:** regla de recepción parcial y flujo de resolución para recepción "no conforme".

---

## Resumen de entidades — Etapa 4

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `GoodsReceipt` | 1:N con `PurchaseOrder` (si se permite parcial) | Punto de entrada del proceso físico al sistema |
| `GoodsReceiptLine` | 1:N con `GoodsReceipt` (sugerida) | Necesaria si se requiere trazar recepción por ítem |

## Resumen de bordes — Etapa 4

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 4.1 | Dependencia *(opcional)* | `requestSignature` | FirmaGob |
| 4.1 | Evento | `GoodsReceiptConfirmed` | — |

**Etapa anterior:** [3. Resolución de Compra](../1.%20compra-agil/3-resolucion-compra.md) · **Siguiente etapa:** [5. Pago →](./5-pago.md)
