# Wireframe: Registro recepción conforme

**Sub-paso:** 4.1 — Registro de recepción física  
**Operaciones:** `createGoodsReceipt`, `confirmGoodsReceipt`

## Layout

```
+----------------------------------------------------------+
| OC #5678 — Recepción conforme                             |
+----------------------------------------------------------+
| OC: MP-12345 | Proveedor: 76.xxx.xxx-x | Monto: $XXX      |
+----------------------------------------------------------+
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

| Campo UI | Entidad.campo |
|---|---|
| Fecha recepción | `GoodsReceipt.received_date` |
| Recibido por | `GoodsReceipt.received_by` |
| Conformidad | `GoodsReceipt.conformity_status` |
| Observaciones | `GoodsReceipt.observations` |
| Cant. recibida | `GoodsReceipt.received_quantity` / `GoodsReceiptLine` |

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

- Adjuntos obligatorios marcados con asterisco.
- Firma electrónica si aplica (dependencia FirmaGob en `confirmGoodsReceipt`).

## Notas

- ⚠ Pendiente: flujo de resolución recepción no conforme y recepción parcial.
