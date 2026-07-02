# Wireframe: Creación de SOLPED

**Sub-paso:** 1.1 — Creación de solicitud  
**Operaciones:** `createPurchaseRequest`, `submitPurchaseRequest`

## Layout

```
+----------------------------------------------------------+
| SOLPED — Nueva solicitud                          [Borrador]|
+----------------------------------------------------------+
| Unidad solicitante *  [ Unidad X          v ]             |
| Descripción *         [________________________]          |
| Justificación *       [________________________]          |
| Fecha solicitada *    [ __ / __ / ____ ]                  |
+----------------------------------------------------------+
| Líneas de bienes/servicios                                |
| +--------+----------+----+-------+--------+-------------+ |
| | Descr. | Cantidad | UM | Precio| Ref.   | [Eliminar]  | |
| +--------+----------+----+-------+--------+-------------+ |
| | [....] | [    ]   |[v]| [    ]| SII 42k|             | |
| +--------+----------+----+-------+--------+-------------+ |
| [+ Agregar línea]                                         |
+----------------------------------------------------------+
| Documentos adjuntos        [ Subir archivo ]              |
+----------------------------------------------------------+
| [ Guardar borrador ]              [ Enviar a aprobación ] |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Unidad solicitante | `PurchaseRequest.requesting_unit` | Sí |
| Descripción | `PurchaseRequest.description` | Sí |
| Justificación | `PurchaseRequest.justification` | Sí |
| Fecha solicitada | `PurchaseRequest.requested_date` | Sí |
| Líneas tabla | `PurchaseRequestLine` | ≥1 línea |
| Precio unitario | `PurchaseRequestLine.unit_price` | Sí |
| Referencia precio | `PriceReference` (vía `getPriceReference`) | Sí |

## Acciones

| Botón | Operación contrato | Transición |
|---|---|---|
| Guardar borrador | `createPurchaseRequest` / `PATCH` | `status = draft` |
| Enviar a aprobación | `submitPurchaseRequest` | `status = pending_approval` |

## Estados de pantalla

- **Normal (borrador):** todos los campos editables.
- **Bloqueo validación:** errores API estructurados bajo cada campo (`PRICE_REFERENCE_UNAVAILABLE`, `INVALID_QUANTITY`).
- **Solo lectura:** no aplica en este sub-paso.

## Validaciones visibles

- Asterisco en campos obligatorios.
- Precio con desviación > tolerancia ⚠ → banner `PRICE_DEVIATION_EXCEEDED` (bloqueante cuando se defina regla).
- Cantidad = 0 → `INVALID_QUANTITY` (QA 53 P0).

## Notas

- Si `checkStockAvailability` se adopta (QA 4): banner informativo "Stock disponible en bodega — ¿retirar en lugar de comprar?"
- ⚠ Pendiente: fuente concreta de `PriceReference` y % tolerancia de desviación.
