# Wireframe: Creación de SOLPED

**Sub-paso:** 1.1 — Creación de solicitud  
**Rol:** Solicitante (`adq.solicitante`) — catálogo [`catalogo-roles.md`](../../../arquitectura/catalogo-roles.md)  
**Operaciones:** `createPurchaseRequest`, `submitPurchaseRequest`, `previewBudgetAvailability` *(informativa)*

## Layout

```
+----------------------------------------------------------+
| SOLPED — Nueva solicitud                          [Borrador]|
+----------------------------------------------------------+
| Datos de la solicitud                                     |
| Unidad solicitante *  [ Unidad X          v ]             |
| Descripción *         [________________________]          |
| Justificación *       [________________________]          |
| Fecha solicitada *    [ __ / __ / ____ ]                  |
| Modalidad de compra (opcional) [ (sin indicar)        v ]          |
|                       Compra Ágil / Convenio Marco /      |
|                       Licitación Pública / Trato Directo  |
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
| Documentos de respaldo (opcional)                         |
| Tipos: cotizaciones, fotos referenciales del producto,    |
|        fichas técnicas u otros antecedentes               |
| +----------+---------------------+---------------------+  |
| | Tipo *   | Descripción *       | Archivo *           |  |
| | Cotiz. v | Cotización ACME …   | [Subir→storeDocument]| |
| +----------+---------------------+---------------------+  |
| [+ Agregar adjunto]                                       |
+----------------------------------------------------------+
| Pista presupuestaria (opcional)                           |
| Línea presupuestaria       [ (opcional) Cuenta/Programa v ]|
| Año fiscal propuesto (opcional) [ 2026 ]                  |
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
| Modalidad de compra | `PurchaseRequest.purchase_modality` | No (indicación provisional; confirmable en etapa 2). Si proviene de 1.0 con hit CM: sugerencia + advertencia no bloqueante |
| Resolución Fundada | `PurchaseRequest.founded_resolution_attachment` | Sí si modalidad = Trato Directo |
| Línea presupuestaria (opcional) | `PurchaseRequest.proposed_budget_line_id` | No |
| Año fiscal propuesto | `PurchaseRequest.proposed_fiscal_year` | No |
| Líneas tabla | `PurchaseRequestLine` | ≥1 línea |
| Descripción línea | `PurchaseRequestLine.item_description` | Sí |
| Cantidad línea | `PurchaseRequestLine.quantity` | Sí |
| Precio unitario | `PurchaseRequestLine.unit_price` | Sí |
| Referencia precio | `PriceReference` (vía `getPriceReference`) | Sí |
| Documentos de respaldo (lista) | `PurchaseRequestAttachment` | No (0..N) |
| Tipo de adjunto | `PurchaseRequestAttachment.attachment_type` | Sí si hay adjunto |
| Descripción del adjunto | `PurchaseRequestAttachment.description` | Sí si hay adjunto |
| Archivo adjunto | `PurchaseRequestAttachment.document_ref` (`DocumentRef` vía `storeDocument`) | Sí si hay adjunto |

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
| Criterios de consulta                                     |
| Línea presupuestaria *  [ Cuenta / Programa ...    v ]   |
| Año fiscal *              [ 2026 ]                        |
| Monto estimado SOLPED     [ $ 1.250.000 ] (precargado)   |
+----------------------------------------------------------+
| Resultado                                                 |
| Disponible: $ 2.100.000 | Comprometido otros: $ 800.000  |
| Saldo proyectado: $ 1.300.000                             |
+----------------------------------------------------------+
| Aviso                                                     |
| Consulta orientativa — la verificación formal ocurre     |
| en Finanzas (paso 1.3).                                   |
+----------------------------------------------------------+
| [ Cerrar ]                                                |
+----------------------------------------------------------+
```

**Variante — sin saldo** (demo `ADQ-2026-00142`; no bloquea borrador ni envío):

```
+----------------------------------------------------------+
| Resultado                                                 |
| Disponible: $ 320.000 | Comprometido otros: $ 180.000    |
| Saldo proyectado: $ -2.310.000            [INSUFICIENTE] |
+----------------------------------------------------------+
```

| Acción panel | Operación | Notas |
|---|---|---|
| Consultar | `previewBudgetAvailability` | No bloquea el borrador ni la aprobación |

## Estados de pantalla

- **Normal (borrador):** todos los campos editables.
- **Bloqueo validación:** errores API estructurados bajo cada campo (`PRICE_REFERENCE_UNAVAILABLE`, `INVALID_QUANTITY`).
- **Panel autoconsulta — sin saldo:** resultado insuficiente (panel error); el envío a aprobación **sigue habilitado** (la consulta es informativa). El bloqueo formal y el camino a 1.4 ocurren en 1.3.
- **Solo lectura:** no aplica en este sub-paso.

## Validaciones visibles

- Asterisco en campos obligatorios.
- Selector de modalidad con opción vacía por defecto (`(sin indicar)`).
- Al elegir Trato Directo: campo Resolución Fundada aparece con asterisco; envío bloqueado sin adjunto (`FOUNDED_RESOLUTION_REQUIRED`).
- Precio con desviación > tolerancia ⚠ → banner `PRICE_DEVIATION_EXCEEDED` (bloqueante cuando se defina regla).
- Cantidad = 0 → `INVALID_QUANTITY` (QA 53 P0).

## Notas

- Verificación de stock / catálogo CM: sub-paso **1.0** ([`10-verificacion-previa.md`](./10-verificacion-previa.md)). Si se llega con hallazgo CM (`?cm=1`), mostrar advertencia **no bloqueante** junto a Modalidad de compra y prefill sugerido `framework_agreement`.
- El enlace de autoconsulta presupuestaria es **opcional** y **no sustituye** 1.3. Caso sin saldo en expediente: [`ADQ-2026-00142`](../fixtures/ADQ-2026-00142.yaml) (solo 1.4 activo tras verificación formal).
- Documentos de respaldo: opcionales; si se agrega una fila, tipo, descripción y archivo son obligatorios. Valores de `attachment_type`: `quote` (cotización), `product_reference_photo` (foto referencial del producto), `technical_sheet` (ficha técnica), `other` (otro antecedente).
- ⚠ Pendiente: fuente concreta de `PriceReference` y % tolerancia de desviación.
