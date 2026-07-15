# Wireframe: Creación de SOLPED

**Sub-paso:** 1.1 — Creación de solicitud  
**Rol:** Solicitante (`adq.solicitante`) — catálogo [`catalogo-roles.md`](../../../arquitectura/catalogo-roles.md)  
**Operaciones:** `createPurchaseRequest`, `submitPurchaseRequest`, `previewBudgetAvailability` *(informativa)*

## Layout

```
+----------------------------------------------------------+
| SOLPED — Nueva solicitud                          [Borrador]|
+----------------------------------------------------------+
| Unidad solicitante *  [ Unidad X          v ]             |
| Descripción *         [________________________]          |
| Justificación *       [________________________]          |
| Fecha solicitada *    [ __ / __ / ____ ]                  |
| Modalidad de compra (opcional) [ (sin indicar)        v ]          |
|                       Compra Ágil / Convenio Marco /      |
|                       Licitación Pública / Trato Directo  |
+----------------------------------------------------------+
| Resolución Fundada *  [ Subir → storeDocument (core) ]     |
| (visible y obligatorio solo si Modalidad = Trato Directo)|
+----------------------------------------------------------+
| Líneas de bienes/servicios                                |
| +--------+----------+----+-------+--------+-------------+ |
| | Descr. *| Cant. *| UM *| Precio*| Ref.   | [Eliminar]  | |
| +--------+----------+----+-------+--------+-------------+ |
| | [....] | [    ]   |[v]| [    ]| SII 42k|             | |
| +--------+----------+----+-------+--------+-------------+ |
| [+ Agregar línea]                                         |
+----------------------------------------------------------+
| Documentos adjuntos (opcional) [ Subir → storeDocument ]    |
| Línea presupuestaria       [ (opcional) Cuenta/Programa v ]|
| [ Consultar saldo en línea presupuestaria ]  (enlace → panel)|
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
| Modalidad de compra | `PurchaseRequest.purchase_modality` | No (indicación provisional; confirmable en etapa 2) |
| Resolución Fundada | `PurchaseRequest.founded_resolution_attachment` | Sí si modalidad = Trato Directo |
| Línea presupuestaria (opcional) | `PurchaseRequest.proposed_budget_line_id` | No |
| Año fiscal propuesto | `PurchaseRequest.proposed_fiscal_year` | No |
| Líneas tabla | `PurchaseRequestLine` | ≥1 línea |
| Descripción línea | `PurchaseRequestLine.item_description` | Sí |
| Cantidad línea | `PurchaseRequestLine.quantity` | Sí |
| Precio unitario | `PurchaseRequestLine.unit_price` | Sí |
| Referencia precio | `PriceReference` (vía `getPriceReference`) | Sí |
| Documentos adjuntos (opcional) | — | No |

## Acciones

| Botón | Operación contrato | Transición |
|---|---|---|
| Guardar borrador | `createPurchaseRequest` / `PATCH` | `status = draft` |
| Enviar a aprobación | `submitPurchaseRequest` | `status = pending_approval` |

## Panel — autoconsulta de saldo (enlace informativo)

```
+----------------------------------------------------------+
| Consulta de saldo (informativa)                    [ X ] |
+----------------------------------------------------------+
| Línea presupuestaria *  [ Cuenta / Programa ...    v ]   |
| Año fiscal *              [ 2026 ]                        |
| Monto estimado SOLPED     [ $ 1.250.000 ] (precargado)   |
+----------------------------------------------------------+
| Disponible: $ 2.100.000 | Comprometido otros: $ 800.000  |
| Saldo proyectado: $ 1.300.000                             |
+----------------------------------------------------------+
| Aviso: consulta orientativa — la verificación formal      |
|        ocurre en Finanzas (paso 1.3).                     |
+----------------------------------------------------------+
| [ Cerrar ]                                                |
+----------------------------------------------------------+
```

| Acción panel | Operación | Notas |
|---|---|---|
| Consultar | `previewBudgetAvailability` | No bloquea el borrador ni la aprobación |

## Estados de pantalla

- **Normal (borrador):** todos los campos editables.
- **Bloqueo validación:** errores API estructurados bajo cada campo (`PRICE_REFERENCE_UNAVAILABLE`, `INVALID_QUANTITY`).
- **Solo lectura:** no aplica en este sub-paso.

## Validaciones visibles

- Asterisco en campos obligatorios.
- Selector de modalidad con opción vacía por defecto (`(sin indicar)`).
- Al elegir Trato Directo: campo Resolución Fundada aparece con asterisco; envío bloqueado sin adjunto (`FOUNDED_RESOLUTION_REQUIRED`).
- Precio con desviación > tolerancia ⚠ → banner `PRICE_DEVIATION_EXCEEDED` (bloqueante cuando se defina regla).
- Cantidad = 0 → `INVALID_QUANTITY` (QA 53 P0).

## Notas

- Si `checkStockAvailability` se adopta (QA 4): banner informativo "Stock disponible en bodega — ¿retirar en lugar de comprar?"
- El enlace de autoconsulta presupuestaria es **opcional** y **no sustituye** 1.3.
- ⚠ Pendiente: fuente concreta de `PriceReference` y % tolerancia de desviación.
