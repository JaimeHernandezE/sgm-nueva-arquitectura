# Wireframe: Creación de SOLPED

**Sub-paso:** 1.1 — Creación de solicitud  
**Rol:** Solicitante (`adq.solicitante`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
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
+----------------------------------------------------------+
| Líneas de bienes/servicios                                |
| Moneda *              [ Peso (CLP) / UF / UTM / USD  v ]  |
| Tipo de cambio referencial: 1 UF = $ … · vigente DD-MM-AAAA|
| Precio se ingresa neto; impuesto por línea (no neto/bruto)|
| +------+-----+----+----------+----------+--------+------+ |
| |Descr*|Cant*|UM *|Precio    |Impuesto *|Subtotal| [X]  | |
| |      |     |    |neto *    |IVA 19% v |neto    |      | |
| +------+-----+----+----------+----------+--------+------+ |
| |[...] |[  ] |[v]|[      ]  |Exento /  | …      |      | |
| |      |     |    |          |Otro      |        |      | |
| +------+-----+----+----------+----------+--------+------+ |
| |              Total neto                     | …      |  |
| |              Total impuestos                | …      |  |
| |              Total bruto                    | …      |  |
| |       Total bruto en CLP (si moneda ≠ CLP)  | $ …    |  |
| +---------------------------------------------+--------+  |
| [+ Agregar línea]                                         |
+----------------------------------------------------------+
| Modalidad prevista (opcional)                             |
| Modalidad de compra (opcional) [ (sin indicar)        v ]  |
|                       Compra Ágil / Convenio Marco /      |
|                       Licitación Pública / Trato Directo  |
| Resolución Fundada *  [ Subir → storeDocument (core) ]     |
| (visible y obligatorio solo si Modalidad = Trato Directo)|
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
| Moneda | `PurchaseRequest.currency` | Sí (default CLP). Una sola moneda por documento; las líneas heredan |
| Línea presupuestaria (opcional) | `PurchaseRequest.proposed_budget_line_id` | No |
| Año fiscal propuesto | `PurchaseRequest.proposed_fiscal_year` | No |
| Líneas tabla | `PurchaseRequestLine` | ≥1 línea |
| Descripción línea | `PurchaseRequestLine.item_description` | Sí |
| Cantidad línea | `PurchaseRequestLine.quantity` | Sí |
| Unidad de medida | `PurchaseRequestLine.unit_of_measure` | Sí |
| Precio unitario neto | `PurchaseRequestLine.unit_price` | Sí (neto; en moneda del documento). Convención de plataforma: siempre se ingresa neto |
| Impuesto | `PurchaseRequestLine.tax_code` | Sí (default `iva_19`). Valores: `iva_19`, `exempt`, `other` — catálogo ampliable |
| Subtotal neto línea | calculado UI (`quantity × unit_price`) | No (derivado) |
| Total neto | suma de subtotales netos (UI) | No (derivado) |
| Total impuestos | suma de `subtotal_neto × tasa(tax_code)` (UI) | No (derivado) |
| Total bruto | `total_neto + total_impuestos` (UI) | No (derivado; base orientativa para presupuesto) |
| Total bruto en CLP | calculado UI (`total_bruto × tasa referencial`) | No (derivado; visible solo si moneda ≠ CLP) |
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
| Monto estimado SOLPED     [ $ 267.750 ] (precargado = bruto CLP) |
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
- Precio con desviación > tolerancia ⚠ → banner `PRICE_DEVIATION_EXCEEDED` (bloqueante cuando se defina regla; validación de servidor, no columna en tabla).
- Cantidad = 0 → `INVALID_QUANTITY` (QA 53 P0).
- Tabla de líneas: agregar/eliminar filas (≥1); subtotal neto y totales (neto / impuestos / bruto) se recalculan en cliente.
- Precio siempre neto; selector de impuesto por línea (default IVA 19%). No hay pregunta «¿neto o bruto?».
- Si moneda ≠ CLP: mostrar «Total bruto en CLP» con tasa referencial; la autoconsulta de saldo usa el **bruto** en CLP (municipio = consumidor final; IVA es costo).

## Notas

- Verificación de stock / catálogo CM: sub-paso **1.0** ([`10-verificacion-previa.md`](./10-verificacion-previa.md)). Si se llega con hallazgo CM (`?cm=1`), mostrar advertencia **no bloqueante** junto a Modalidad de compra y prefill sugerido `framework_agreement`.
- El enlace de autoconsulta presupuestaria es **opcional** y **no sustituye** 1.3. Caso sin saldo en expediente: [`ADQ-2026-00142`](../fixtures/ADQ-2026-00142.yaml) (solo 1.4 activo tras verificación formal).
- Documentos de respaldo: opcionales; si se agrega una fila, tipo, descripción y archivo son obligatorios. Valores de `attachment_type`: `quote` (cotización), `product_reference_photo` (foto referencial del producto), `technical_sheet` (ficha técnica), `other` (otro antecedente).
- Moneda a nivel de cabecera (no por línea). Impuesto a nivel de línea (sí se pueden mezclar afectas y exentas).
- ⚠ Pendiente: fuente concreta de `PriceReference` (validación servidor, no visible en la tabla de líneas) y % tolerancia de desviación.
- ⚠ Pendiente: hito que congela el tipo de cambio para el **compromiso presupuestario** (resolución, OC, preobligación u otro) — ver ficha `1-solped.md`. La tasa mostrada en 1.1 es solo referencial.
- ⚠ Pendiente normativo: ¿los umbrales de modalidad (UTM) se comparan contra monto **neto** o **bruto** (impuestos incluidos)? Candidato a `NormativeParameter`. Práctica usual en Mercado Público: impuestos incluidos — verificar, no asumir.
- ⚠ Pendiente: catálogo completo de `tax_code` más allá de IVA 19% / Exento / Otro (retenciones, tasas especiales).
