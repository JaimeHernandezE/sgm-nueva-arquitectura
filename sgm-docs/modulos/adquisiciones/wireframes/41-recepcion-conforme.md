# Wireframe: Registro recepción conforme

**Sub-paso:** 4.1 — Registro de recepción física  
**Rol:** Recepcionista (`adq.recepcionista`) — catálogo [`catalogo-roles.md`](../../../arquitectura/catalogo-roles.md)  
**Operaciones:** `createGoodsReceipt`, `confirmGoodsReceipt`

## Layout

```
+----------------------------------------------------------+
| OC #5678 — Recepción conforme                             |
+----------------------------------------------------------+
| Contexto de la OC (solo lectura)                           |
| OC: MP-12345 | Proveedor: 76.xxx.xxx-x | Monto: $XXX      |
+----------------------------------------------------------+
| Datos de recepción                                        |
| Fecha recepción *     [ __ / __ / ____ ]                  |
| Recibido por          [ Usuario actual    ]               |
| Conformidad *         ( ) Conforme  ( ) No conforme       |
| Observaciones         [________________________]          |
|   (obligatorio si no conforme)                            |
+----------------------------------------------------------+
| Líneas recibidas                                          |
| | Ítem OC      | Cant. OC | Cant. recibida |              |
| | Producto A   | 10       | [ 10 ]         |              |
+----------------------------------------------------------+
| Documentos adjuntos *                                     |
| [ Factura electrónica ] [ Guía despacho ] [+ Subir]      |
+----------------------------------------------------------+
| [ Guardar borrador ]              [ Confirmar recepción ] |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Fecha recepción | `GoodsReceipt.received_date` | Sí |
| Recibido por | `GoodsReceipt.received_by` | Sí |
| Conformidad | `GoodsReceipt.status` (vía conformidad) | Sí |
| Observaciones | `GoodsReceipt.observations` | Sí si no conforme |
| Cant. recibida | `GoodsReceiptLine.quantity_received` | Sí |
| Documentos adjuntos | `DocumentRef[]` (vía `storeDocument` del core) | Sí al confirmar |

## Acciones

| Botón | Operación contrato |
|---|---|
| Guardar borrador | `createGoodsReceipt` |
| Confirmar recepción | `confirmGoodsReceipt` → evento `GoodsReceiptConfirmed` |

## Estados de pantalla

- **No conforme:** bloquea avance a Pago; banner advertencia.
- **Sin adjuntos:** `MISSING_REQUIRED_ATTACHMENTS` (QA 32 P1).
- **Recepción parcial:** ⚠ pendiente definir regla visual.

## Validaciones visibles

- Asterisco en fecha recepción, conformidad y adjuntos.
- Observaciones obligatorias si no conforme.
- Cantidad recibida obligatoria por línea.

## Notas

- ⚠ Pendiente: flujo de resolución recepción no conforme y recepción parcial.
