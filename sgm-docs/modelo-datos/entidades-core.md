# Entidades Core del Modelo de Datos

Fuente única de las entidades del **dominio de negocio** del modelo de datos SGM. Los macroprocesos **referencian** estas entidades — no las redefinen.

**Entidades de plataforma** (identidad, `DocumentRef`, integraciones, parámetros normativos): [`entidades-plataforma.md`](entidades-plataforma.md).

Si un macroproceso necesita un campo nuevo en una entidad ya existente aquí, se agrega en este archivo y se referencia desde el subproceso correspondiente, para evitar que la misma entidad diverja entre módulos.

**Convención de nombres:** inglés, estilo técnico (`PurchaseRequest`, no `SolicitudCompra`).

**Leyenda de obligatoriedad** (cada campo en las tablas siguientes declara uno de estos valores en **Tipo** o **Notas**):

| Valor | Significado |
|---|---|
| `Obligatorio` | Requerido al persistir o enviar |
| `**Opcional**` | Puede omitirse o ser nulo |
| `**Obligatorio si** <condición>` | Condicional explícita |
| `Obligatorio (generado por sistema)` | Asignado por el motor (timestamps, correlativos, FKs auto) |
| `**Opcional** (derivado)` | Calculado o agregado; no ingreso de usuario |

Si el campo aparece en un formulario, la marca debe coincidir con la tabla Campos ↔ entidad del wireframe y con la etiqueta del prototipo HTML (ver `plantilla-maestra-sgm.md` §6.7 y §7).

**Visibilidad de borde:** cada entidad indica si es **interna** al módulo o **expuesta** en el contrato API ([`modulos/adquisiciones/contracts.md`](../modulos/adquisiciones/contracts.md)). Por defecto toda entidad es interna; la exposición se declara explícitamente.

**Estado de esta lista:** poblada a partir del macroproceso Compra Ágil (Adquisiciones). Se irá extendiendo a medida que se documenten otras modalidades tras validar el piloto.

---

## Adquisiciones

### `ProcurementCase` (Expediente de Compra)
**Visibilidad:** expuesta — campos en contrato: `id` (= `folio`), `procurement_type`, `status`, `current_step_id`, `description`, `requesting_unit_id`, `created_at`, `mp_process_id`, `mp_linked_at`, `mp_process_type`, `procurement_route`, `route_decided_at`, `purchase_intent_published_at`, `purchase_intent_deadline`

Raíz de trazabilidad de todo el ciclo SOLPED → Pago. El estado del expediente es **distinto** del estado documental de sus entidades hijas (`PurchaseRequest.status`, `PurchaseOrder.status`, etc.) — no fusionar ambos conceptos.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | texto | **Obligatorio** (generado por sistema). Igual al `folio` legible. Formato `ADQ-AAAA-NNNNN`. |
| `folio` | texto | **Obligatorio** (generado por sistema). Correlativo legible. Duplica `id` — expuesto como `id` en API. |
| `description` | texto | **Obligatorio** — glosa resumen del expediente (listado y cabecera). |
| `requesting_unit_id` | ref. `OrganizationalUnit` | **Obligatorio** — unidad solicitante de la SOLPED origen. |
| `procurement_type` | enum | **Opcional** hasta etapa 2.1; **Obligatorio** desde confirmación de modalidad. Valores: `agile_purchase`, `framework_agreement`, `public_tender`, `direct_procurement`. |
| `current_step_id` | ref. `CaseStep` | **Obligatorio** |
| `status` | enum | **Obligatorio**. Valores API: `in_progress`, `completed`, `cancelled`, `deserted`. |
| `created_at` | fecha/hora | **Obligatorio** (generado por sistema) |
| `mp_process_id` | texto | **Opcional** hasta vinculación MP; **Obligatorio si** vinculación completada (salvo Trato Directo en fase inicial). Origen: ficha `2-modalidad-compra.md` §2.3. |
| `mp_linked_at` | fecha/hora | **Opcional** hasta vinculación; **Obligatorio si** `mp_process_id` presente. Origen: ficha `2-modalidad-compra.md` §2.3. |
| `mp_process_type` | enum | **Opcional** hasta vinculación; **Obligatorio si** `mp_process_id` presente. Coherente con `procurement_type`. Origen: ficha `2-modalidad-compra.md` §2.3. |
| `procurement_route` | enum (`gran_compra` \| `compra_directa`) | **Solo Convenio Marco.** **Obligatorio** desde 3.1 (compuerta automática por umbral `FRAMEWORK_AGREEMENT_GRAN_COMPRA_UTM_LIMIT`); puede actualizarse de `gran_compra` a `compra_directa` en 3.6 (Gran Compra desierta). Origen: ficha `2. convenio-marco/3-resolucion-compra-convenio-marco v2.md` §3.1/§3.6. |
| `route_decided_at` | fecha/hora | **Solo Convenio Marco.** **Obligatorio** junto con `procurement_route`; timestamp de la evaluación automática de umbral (3.1). Origen: ficha CM §3.1. |
| `purchase_intent_published_at` | fecha/hora | **Solo Convenio Marco, ruta `gran_compra`.** **Obligatorio** al publicar la Intención de Compra (3.3). Origen: ficha CM §3.3. |
| `purchase_intent_deadline` | fecha/hora | **Solo Convenio Marco, ruta `gran_compra`.** **Obligatorio** junto con `purchase_intent_published_at`; calculado `published_at + 10 días corridos` (Directiva N° 15 ChileCompra). Origen: ficha CM §3.3. |

### `CaseStep` (Paso de Expediente)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `step_number`, `name`, `status`, `responsible_unit_id`, `responsible_role`, `responsible_user_id`, `started_at`, `completed_at`, `elapsed_display`

1:N con `ProcurementCase`. La secuencia de pasos se instancia según `procurement_type`: Compra Ágil 5 pasos, Convenio Marco 4, Licitación Pública 6, Trato Directo 5. De aquí salen "tiempo transcurrido por etapa" y "responsable actual" sin joins.

<!-- REVISAR: recuento de pasos por modalidad contra fichas reales — la ficha `3. licitacion-publica/3-resolucion-compra.md` por sí sola ya tiene 14 sub-pasos (3.1-3.14); si "Licitación Pública 6" se refería a etapas (no a sub-pasos), aclararlo explícitamente aquí; si quedó obsoleto, no corregir el número por cuenta propia. -->

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio** |
| `step_number` | número | **Obligatorio** |
| `name` | texto | **Obligatorio** |
| `status` | enum | **Obligatorio**. Valores API: `pending`, `in_progress`, `completed`, `omitted`. |
| `responsible_unit_id` | ref. `OrganizationalUnit` | **Opcional** hasta asignación de responsable |
| `responsible_role` | texto | **Opcional** — rol del responsable (ej. `Usuario`, `Aprobador`). |
| `responsible_user_id` | ref. `User` | **Opcional** — funcionario asignado. |
| `started_at` | fecha/hora | **Opcional** hasta inicio del paso |
| `completed_at` | fecha/hora | **Opcional** hasta cierre del paso |
| `elapsed_display` | texto | **Opcional** — derivado en lectura (ej. `2 d 6 h`); no persistido. |

> `procurement_case_id` en cada entidad del ciclo es **desnormalización intencional** para trazabilidad y reportería directa (consultas por expediente sin recorrer la cadena de FKs). Se mantiene además de las FKs directas entre entidades.

### `PurchaseRequest` (SOLPED)
**Visibilidad:** expuesta — campos en contrato: `id`, `requesting_unit`, `description`, `justification`, `requested_date`, `purchase_modality`, `founded_resolution_attachment`, `currency`, `proposed_budget_line_id`, `proposed_fiscal_year`, `status`

Origen: `modulos/adquisiciones/procesos-transversales/1-solped.md`

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional — ver nota arriba |
| `requesting_unit` | ref. `OrganizationalUnit` | **Obligatorio** |
| `description` | texto | **Obligatorio** |
| `justification` | texto | **Obligatorio** |
| `requested_date` | fecha | **Obligatorio** |
| `purchase_modality` | enum, **opcional** | **Opcional** — indicación provisional de modalidad. Valores: `agile_purchase`, `framework_agreement`, `public_tender`, `direct_procurement`. Confirmable en etapa 2. |
| `founded_resolution_attachment` | ref. `DocumentRef` | **Obligatorio si** `purchase_modality = direct_procurement`. Resolución Fundada — almacenada vía C10 (`storeDocument`). |
| `currency` | enum | **Obligatorio** (default `CLP`). Valores: `CLP`, `UF`, `UTM`, `USD`. Moneda del documento; todas las líneas se expresan en ella. No se mezclan monedas en una misma SOLPED. |
| `proposed_budget_line_id` | ref. `BudgetLine` | **Opcional** — pista para autoconsulta (1.1, 1.2); no sustituye verificación en 1.3 |
| `proposed_fiscal_year` | número | **Opcional** — año fiscal asociado a la línea propuesta |
| `status` | enum | **Obligatorio**. Valores: `draft`, `pending_approval`, `pending_finance`, `quoting_in_progress`, `quote_void`, … |

### `PurchaseRequestAttachment`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `attachment_type`, `description`, `document_ref`

1:N con `PurchaseRequest`. Documentos de respaldo opcionales de la SOLPED (distintos de la Resolución Fundada). Origen: wireframe `11-creacion-solped.md`.

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_request_id` | ref. `PurchaseRequest` | **Obligatorio** |
| `attachment_type` | enum | **Obligatorio**. Valores: `quote` (cotización), `product_reference_photo` (foto referencial del producto), `technical_sheet` (ficha técnica), `other` (otro antecedente) |
| `description` | texto | **Obligatorio** — qué respalda el archivo (ej. «Cotización ACME — resmas») |
| `document_ref` | ref. `DocumentRef` | **Obligatorio** — almacenado vía C10 (`storeDocument`) |

### `PurchaseRequestLine`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `item_description`, `quantity`, `unit_of_measure`, `unit_price`, `tax_code`, `price_source`

1:N con `PurchaseRequest`.

| Campo | Tipo | Notas |
|---|---|---|
| `item_description` | texto | **Obligatorio** |
| `quantity` | número | **Obligatorio** |
| `unit_of_measure` | ref. `UnitOfMeasure` | **Obligatorio** |
| `unit_price` | número | **Obligatorio** — **neto**, expresado en `PurchaseRequest.currency`. Convención de plataforma: el usuario no elige neto/bruto |
| `tax_code` | enum | **Obligatorio** (default `iva_19`). Valores: `iva_19`, `exempt`, `other`. Permite mezclar líneas afectas y exentas en la misma SOLPED. Catálogo ampliable — pendiente |
| `price_source` | ref. `PriceReference` | **Obligatorio** — valor obtenido vía core `getPriceReference` (C9) |

> Totales derivados (UI/servicio): subtotal neto = `quantity × unit_price`; impuesto de línea = subtotal × tasa(`tax_code`); total bruto del documento = suma(neto) + suma(impuestos). El municipio es **consumidor final** (IVA es costo): el precompromiso presupuestario orientativo usa el **total bruto**.

### `PriceReference`
**Visibilidad:** interna — DTO de validación embebido en línea; datos desde core `getPriceReference` (C9 → SII u otra fuente oficial)
**Visibilidad:** interna — usada en validación de `createPurchaseRequest`; no cruza borde como entidad independiente

N:1 con `PurchaseRequestLine`. **Nueva — fuente API de precio aún sin definir.**

| Campo | Tipo | Notas |
|---|---|---|
| `item_code` / `item_description_hash` | texto | **Obligatorio**. Pendiente definir mecanismo de match |
| `source` | enum | **Obligatorio**. Valores: `SII`, `mercado_publico_historico`, `otro` — **pendiente de definir cuál usar** |
| `reference_price` | número | **Obligatorio** |
| `reference_date` | fecha | **Obligatorio** |
| `currency` | enum | **Obligatorio** (default CLP) |

### `PurchaseRequestApproval`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `approver_id`, `decision`, `disposition`, `decision_date`, `comments`

1:N con `PurchaseRequest`. Historial de decisiones — permite múltiples ciclos rechazo/reenvío.

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_request_id` | ref. `PurchaseRequest` | **Obligatorio** |
| `approver_id` | ref. `User` | **Obligatorio** |
| `decision` | enum | **Obligatorio**. Valores: `approved`, `rejected` |
| `disposition` | enum | **Obligatorio si** `decision = rejected`. Valores: `return_to_draft` (vuelve a 1.1), `cancel` (cierra expediente). Default histórico: `return_to_draft`. |
| `decision_date` | fecha | **Obligatorio** (generado por sistema al registrar) |
| `comments` | texto | **Obligatorio si** `decision = rejected` |

### `BudgetAvailabilityCertificate` (CDP)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `purchase_request_id`, `certificate_number`, `budget_line_id`, `certified_amount`, `fiscal_year`, `verified_by`, `signed_by`, `signed_at`, `status`, `signature_mode`

1:1 con `PurchaseRequest` en esta etapa. Certificado de Disponibilidad Presupuestaria emitido y firmado por el aprobador DAF (sub-paso 1.5).

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_request_id` | ref. `PurchaseRequest` | **Obligatorio** |
| `certificate_number` | texto | **Obligatorio** (generado por sistema en modo electrónico; ingreso manual en escaneado) |
| `budget_line_id` | ref. `BudgetLine` | **Obligatorio** |
| `certified_amount` | número | **Obligatorio** |
| `fiscal_year` | número | **Obligatorio** |
| `verified_by` | ref. `User` | **Obligatorio** — formulador DAF (sub-paso 1.3) |
| `signed_by` | ref. `User` | **Obligatorio** — aprobador DAF (sub-paso 1.5) |
| `signed_at` | fecha/hora | **Obligatorio** (generado por sistema al firmar) |
| `status` | enum | **Obligatorio**. Valores: `issued`, `rejected`, `pending_signature` |
| `rejection_reason` | texto | **Obligatorio si** `status = rejected` |
| `signature_mode` | enum | **Obligatorio**. Valores: `electronic`, `scanned` |
| `scanned_certificate_attachment` | ref. `DocumentRef` | **Obligatorio si** `signature_mode = scanned` — PDF escaneado vía C10 |

### `BudgetPreCommitment` (Preobligación / Pre-afectación)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `purchase_request_id`, `budget_availability_certificate_id`, `budget_line_id`, `estimated_amount`, `fiscal_year`, `status`

1:1 con `PurchaseRequest`. **Preobligación** presupuestaria registrada tras CDP vigente (sub-paso 1.6). Los términos *preobligación* y *pre-afectación* son equivalentes en este modelo. La preobligación se contabiliza en el módulo Contabilidad vía borde de módulo (`registerPreObligation`).

> Origen: las fichas `3-resolucion-compra.md` y `4-recepcion-conforme.md` referencian esta entidad como `PreCommitment` — normalizado aquí al nombre canónico `BudgetPreCommitment`.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_request_id` | ref. `PurchaseRequest` | **Obligatorio** |
| `budget_availability_certificate_id` | ref. `BudgetAvailabilityCertificate` | **Obligatorio** — requiere CDP vigente |
| `budget_line_id` | ref. `BudgetLine` | **Obligatorio** |
| `estimated_amount` | número | **Obligatorio** |
| `fiscal_year` | número | **Obligatorio** |
| `status` | enum | **Obligatorio**. Valores: `active`, … |

### `AgileQuoteProcess`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `deep_link_clicked_at`, `mp_quote_id`

1:1 con `PurchaseRequest`. Puente de trazabilidad SGM↔MP, específico de Compra Ágil — solo campos de trazabilidad, la lógica de negocio de la cotización vive en MP.

> **Vínculo genérico con MP:** el vínculo canónico y genérico con Mercado Público (válido para las 4 modalidades) vive en `ProcurementCase.mp_process_id`. Este `AgileQuoteProcess` se conserva solo como traza específica de Compra Ágil (`deep_link_clicked_at`); su campo `mp_quote_id` **duplica** `ProcurementCase.mp_process_id` y es candidato a eliminarse.
> <!-- REVISAR: consolidar AgileQuoteProcess tras validación -->

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_request_id` | ref. `PurchaseRequest` | **Obligatorio** |
| `deep_link_clicked_at` | fecha/hora | **Opcional** — traza de uso del deep link |
| `mp_quote_id` | texto | **Opcional** hasta sincronización; **Obligatorio si** proceso MP vinculado. Duplica `ProcurementCase.mp_process_id` — ver nota arriba. |

### `PurchaseOrder` (OC)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `mp_oc_id`, `supplier_rut`, `total_amount`, `selection_justification`, `status`, `acceptance_date`

1:N con `ProcurementCase` por reemisiones (rechazo de OC → reemisión a segunda oferta, dentro de Compra Ágil); a lo más una en estado activo. *(Actualizado desde "1:1 con `PurchaseRequest` en Compra Ágil — posible 1:N en otras modalidades"; la ficha `3-resolucion-compra.md` §3.5 hace real el 1:N dentro de la misma modalidad.)*

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_request_id` | ref. `PurchaseRequest` | **Obligatorio** |
| `mp_oc_id` | texto | **Obligatorio** al registrar OC |
| `supplier_rut` | texto | **Obligatorio** |
| `total_amount` | número | **Obligatorio** |
| `selection_justification` | texto | **Obligatorio si** no se eligió la oferta de menor precio |
| `status` | enum | **Obligatorio**. Valores: `issued`, `accepted`, `rejected`, `blocked_ineligible`, `rejected_by_supplier`, `pending_mp_sync`, `commitment_pending` |
| `acceptance_date` | fecha | **Opcional** hasta aceptación; **Obligatorio si** `status = accepted` |
| `supplier_eligibility_check` | booleano | **Opcional** (derivado) — resultado de validación de habilidad |
| `cancellation_reason` | texto | **Obligatorio si** cancelación antes de emitir |
| `fulfillment_status` | enum | **Opcional** (derivado). Valores: `pending`, `partially_received`, `fully_received` |

### `BudgetCommitment` (Compromiso Cierto / Obligación)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `budget_pre_commitment_id`, `committed_amount`, `commitment_date`, `source`

1:1 con `PurchaseOrder` y con `BudgetPreCommitment`. Hito contable crítico — cierre del ciclo de pre-afectación.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_order_id` | ref. `PurchaseOrder` | **Obligatorio** |
| `budget_pre_commitment_id` | ref. `BudgetPreCommitment` | **Obligatorio** |
| `committed_amount` | número | **Obligatorio** |
| `commitment_date` | fecha | **Obligatorio** (generado por sistema) |
| `source` | enum | **Obligatorio**. Valores: `api_sync`, … |

### `GoodsReceipt` (Recepción Conforme)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `received_by`, `received_date`, `receipt_type`, `receiving_unit`, `status`, `observations`

1:N con `PurchaseOrder` — N recepciones por OC (entregas parciales, períodos recurrentes); cubre bienes y servicios vía `receipt_type`. Cada recepción referencia las líneas y cantidades que cubre (ver `GoodsReceiptLine`). Fusionado con la definición de la ficha `4-recepcion-conforme.md` §4.1/§4.2.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_order_id` | ref. `PurchaseOrder` | **Obligatorio** |
| `receipt_type` | enum | **Obligatorio**. Valores: `physical_good` \| `service` |
| `received_by` | ref. `User` | **Obligatorio** |
| `receiving_unit` | ref. `OrganizationalUnit` | **Obligatorio** |
| `received_date` | fecha | **Obligatorio** |
| `service_period_start` / `service_period_end` | fecha | **Obligatorio si** `receipt_type = service` recurrente |
| `supporting_document_ref` | ref. `DocumentRef` | **Obligatorio si** `receipt_type = service` — almacenado vía C10 |
| `status` | enum | **Obligatorio**. Valores: `draft`, `confirmed`, `rejected`, `partially_rejected` |
| `observations` | texto | **Obligatorio si** `status` indica rechazo total o parcial |
| `confirmed_by` | ref. `User` | **Obligatorio si** `status = confirmed` — regla SoD |
| `confirmed_at` | fecha/hora | **Obligatorio si** `status = confirmed` |
| `accrual_ref` | ref. `Accrual` | **Opcional** hasta devengado registrado |

> `received_quantity` se retira del encabezado de `GoodsReceipt` (antes marcado "por línea", inconsistente con un campo a nivel de cabecera) — la cantidad ahora vive exclusivamente en `GoodsReceiptLine`.

### `GoodsReceiptLine`
**Visibilidad:** interna — candidata a exposición si se confirma trazabilidad por ítem

1:N con `GoodsReceipt`. **Confirmada** (antes *sugerida, no confirmada en fuente*) — la ficha `4-recepcion-conforme.md` §4.1 la trae con tabla de campos completa, se promueve a definición confirmada.

| Campo | Tipo | Notas |
|---|---|---|
| `goods_receipt_id` | ref. `GoodsReceipt` | **Obligatorio** |
| `purchase_order_line_ref` | ref. línea de `PurchaseOrder` | **Obligatorio** |
| `quantity_ordered` | número | **Obligatorio** |
| `quantity_received` | número | **Obligatorio** |
| `quantity_accepted` | número | **Obligatorio** |
| `quantity_rejected` | número | **Obligatorio** |
| `rejection_reason` | texto | **Obligatorio si** `quantity_rejected > 0` |
| `inventory_entry_ref` | ref. externa | **Opcional** — referencia al proveedor de inventario, si existe |

### `ThreeWayMatch` (Cruce de 3 vías)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `goods_receipt_id`, `invoice_id`, `match_status`, `match_date`

1:1:1 con `PurchaseOrder`, `GoodsReceipt`, `Invoice`. Punto de control crítico — sin regla de tolerancia de discrepancia definida (ya identificado como control interno crítico en la ficha QA, ítems P1).

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_order_id` | ref. `PurchaseOrder` | **Obligatorio** |
| `goods_receipt_id` | ref. `GoodsReceipt` | **Obligatorio** |
| `invoice_id` | ref. `Invoice` (fuente SII) | **Obligatorio** al ejecutar match |
| `match_status` | enum | **Obligatorio**. Valores: `matched`, `discrepancy` |
| `match_date` | fecha | **Obligatorio** (generado por sistema al ejecutar match) |

### `Accrual` (Devengado)
**Visibilidad:** expuesta — campos en contrato: `id`, `three_way_match_id`, `budget_commitment_id`, `accrual_amount`, `accrual_date`

1:1 con `ThreeWayMatch` y `BudgetCommitment`. Cierra el ciclo presupuestario.

> Origen: la ficha `4-recepcion-conforme.md` §4.4 referencia esta entidad como `AccrualRecord` — normalizado aquí al nombre canónico `Accrual`.
>
> <!-- REVISAR: momento del devengado — el flujo canónico encadena `ThreeWayMatch` (OC + Recepción + Factura) → `Accrual` 1:1 (ver `procesos-transversales/5-pago.md` §5.1-5.2); la ficha `4-recepcion-conforme.md` §4.4 gatilla el devengado desde la conformidad de recepción (devengados parciales por valor aceptado, vía `recordAccrual`), dejando el circuito de factura en la frontera con Tesorería. Son dos definiciones distintas del momento contable del devengado — **[PENDIENTE P-46]**, prioridad alta, definir con Contabilidad/DM. No resuelto aquí. -->

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `three_way_match_id` | ref. `ThreeWayMatch` | **Obligatorio** |
| `budget_commitment_id` | ref. `BudgetCommitment` | **Obligatorio** |
| `accrual_amount` | número | **Obligatorio** |
| `accrual_date` | fecha | **Obligatorio** |

### `PaymentDecree` (Decreto de Pago)
**Visibilidad:** expuesta — campos en contrato: `id`, `accrual_id`, `decree_number`, `decree_date`, `approver_id`

1:1 con `Accrual`.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `accrual_id` | ref. `Accrual` | **Obligatorio** |
| `decree_number` | texto | **Obligatorio** |
| `decree_date` | fecha | **Obligatorio** |
| `approver_id` | ref. `User` | **Obligatorio** |

### `Payment` (Pago)
**Visibilidad:** expuesta — campos en contrato: `id`, `payment_decree_id`, `payment_date`, `payment_method`, `payment_status`

1:1 con `PaymentDecree`. Falta definir manejo de vencimiento de plazo legal (30 días corridos desde factura).

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `payment_decree_id` | ref. `PaymentDecree` | **Obligatorio** |
| `payment_date` | fecha | **Obligatorio** |
| `payment_method` | enum | **Obligatorio** |
| `payment_status` | enum | **Obligatorio**. Valores: `completed`, `failed` |

### `ModalityDecision`
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `selected_modality`, `ratified`, `decided_by`, `decided_at`

1:N con `ProcurementCase` (N por reversiones). Decisión de ratificación/selección de modalidad de compra (gateway de validación V1-V8), con resultados de validación y parámetros normativos aplicados congelados para auditoría retrospectiva. Origen: ficha `2-modalidad-compra.md` §2.1.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio** |
| `selected_modality` | enum | **Obligatorio** |
| `ratified` | booleano | **Obligatorio** |
| `catalog_bypass_justification` | texto | **Obligatorio si** aplica regla V2 y se elige otra modalidad |
| `direct_procurement_cause` | ref. catálogo de causales | **Obligatorio si** `selected_modality = direct_procurement` — **[PENDIENTE P-36]** |
| `validation_results` | JSON | **Obligatorio** (generado por sistema al confirmar) |
| `requires_jefatura_approval` | booleano | **Opcional** — decisión operativa en 2.1; **[PENDIENTE P-38]** |
| `decided_by` | ref. `User` | **Obligatorio** |
| `decided_at` | fecha | **Obligatorio** (generado por sistema al confirmar) |

### `ModalityDecisionApproval` *(sugerida, no confirmada en fuente)*
**Visibilidad:** expuesta — campos en contrato: `id`, `modality_decision_id`, `approver_id`, `decision`, `decision_date`

1:1 con `ModalityDecision`. Aprobación de jefatura sobre la decisión de modalidad, previa a la vinculación con Mercado Público. **Existencia, alcance y exigencia de firma pendientes de ratificar con la DM** — **[PENDIENTE P-38]**. Origen: ficha `2-modalidad-compra.md` §2.2.

| Campo | Tipo | Notas |
|---|---|---|
| `modality_decision_id` | ref. `ModalityDecision` | **Obligatorio** |
| `approver_id` | ref. `User` | **Obligatorio** |
| `decision` | enum | **Obligatorio**. Valores: `approved`, `rejected` |
| `comments` | texto | **Obligatorio si** `decision = rejected` |
| `decision_date` | fecha | **Obligatorio** (generado por sistema al registrar) |

### `NormativeParameter`
**Visibilidad:** expuesta — entidad de plataforma; definición canónica en [`entidades-plataforma.md`](entidades-plataforma.md). No administrada por Adquisiciones.

Umbrales legales configurables usados por el gateway de validación de modalidad (V1–V8). Lectura vía core `getNormativeParameter`. Carga inicial **[PENDIENTE P-37]**. Origen: ficha `2-modalidad-compra.md` §2.1.

| Campo | Tipo | Notas |
|---|---|---|
| `parameter_code` | texto | **Obligatorio** — ver `key` en entidades-plataforma |
| `value` | JSON | **Obligatorio** |
| `valid_from` | fecha | **Obligatorio** |
| `created_by` / `approved_by` | ref. `User` | **Obligatorio** — personas distintas (doble control) |
| `legal_reference` | texto | **Obligatorio** |

### `UtmValue`
**Visibilidad:** interna — DTO desde core `getUtmValue` (C9 → SII); no se expone como entidad del contrato de Adquisiciones. Ver también [`entidades-plataforma.md`](entidades-plataforma.md).

Valor UTM mensual usado para convertir montos CLP↔UTM en el gateway de validación de modalidad. Origen: ficha `2-modalidad-compra.md` §2.1.

| Campo | Tipo | Notas |
|---|---|---|
| `month` | número | **Obligatorio** |
| `year` | número | **Obligatorio** |
| `value_clp` | número | **Obligatorio** |
| `source` | texto | **Obligatorio** |

### `MpProcessSnapshot` *(sugerida, no confirmada en fuente)*
**Visibilidad:** interna — bitácora producida por servicio C7 del core; ver [`entidades-plataforma.md`](entidades-plataforma.md)

1:N con `ProcurementCase`. Bitácora de sincronización de estado con Mercado Público, común a toda la etapa 3 (período de cotización, cierre/selección, emisión/aceptación/rechazo de OC, desierto/fallido) — agnóstica de si el mecanismo de origen es push o polling. Origen: ficha `1. compra-agil/3-resolucion-compra.md` §3.1; reutilizada íntegramente por Convenio Marco (ficha `2. convenio-marco/3-resolucion-compra-convenio-marco v2.md` §3.4).

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio** |
| `mp_status` | texto | **Obligatorio** |
| `data` | JSON | **Obligatorio** |
| `read_at` | fecha/hora | **Obligatorio** (generado por sistema) |
| `source` | enum | **Obligatorio**. Valores: `push`, `polling` |

### `QuotationResult` *(sugerida, no confirmada en fuente)*
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `selected_provider_rut`, `selected_provider_name`, `offered_amount`, `lowest_price_selected`, `recorded_at`

1:N con `ProcurementCase`. Resultado de la selección de oferta al cierre del período de cotización; **solo se crea por sync** desde lectura MP (plantilla §5.3 — sin transcripción manual). Origen: ficha `1. compra-agil/3-resolucion-compra.md` §3.2; reutilizada íntegramente por Convenio Marco (ficha `2. convenio-marco/3-resolucion-compra-convenio-marco v2.md` §3.5, ruta `gran_compra`).

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio** |
| `selected_provider_rut` | texto | **Obligatorio** |
| `selected_provider_name` | texto | **Obligatorio** |
| `offered_amount` | número | **Obligatorio** |
| `lowest_price_selected` | booleano | **Obligatorio** |
| `recorded_at` | fecha/hora | **Obligatorio** (generado por sistema) |

### `ReceiptRejectionCase` *(sugerida, no confirmada en fuente)*
**Visibilidad:** expuesta — campos en contrato: `id`, `goods_receipt_id`, `resolution_type`, `resolution_deadline`, `resolved_at`, `outcome`

1:N con `GoodsReceipt`. Gestión trazable del rechazo (total o parcial) de una recepción: devolución, reposición/corrección, o incumplimiento. Origen: ficha `4-recepcion-conforme.md` §4.5.

| Campo | Tipo | Notas |
|---|---|---|
| `goods_receipt_id` | ref. `GoodsReceipt` | **Obligatorio** |
| `goods_receipt_lines` | ref. `GoodsReceiptLine[]` | **Obligatorio** |
| `resolution_type` | enum | **Obligatorio**. Valores: `return`, `replacement`, `penalty`, `claim` |
| `resolution_deadline` | fecha | **Obligatorio** |
| `resolved_at` | fecha | **Opcional** hasta resolución |
| `outcome` | texto | **Obligatorio si** `resolved_at` presente |

### `TenderBases` (Bases de Licitación)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `status`, `technical_bases_ref`, `administrative_bases_ref`, `requires_bid_bond`, `requires_performance_bond`

1:1 con `ProcurementCase` (una versión vigente por proceso; versiona con cada reenvío a revisión). Específica de Licitación Pública. Origen: ficha `3. licitacion-publica/3-resolucion-compra.md` §3.1.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `status` | enum | **Obligatorio**. Valores: `draft`, `legal_review`, `approved` |
| `technical_bases_ref` | ref. `DocumentRef` | **Obligatorio** — almacenado vía C10 |
| `administrative_bases_ref` | ref. `DocumentRef` | **Obligatorio** — almacenado vía C10 |
| `requires_bid_bond` | booleano | **Obligatorio** — exige Garantía de Seriedad |
| `bid_bond_min_amount` | número | **Obligatorio si** `requires_bid_bond = true` |
| `requires_performance_bond` | booleano | **Obligatorio** — exige Garantía de Fiel Cumplimiento |
| `performance_bond_min_amount` | número | **Obligatorio si** `requires_performance_bond = true` |
| `version` | número | **Obligatorio** (generado por sistema) — incrementa en cada reenvío a `draft` tras observaciones |

### `EvaluationCriterion`
**Visibilidad:** expuesta — campos en contrato: `id`, `tender_bases_id`, `name`, `weight_percent`, `scoring_rule`

1:N con `TenderBases`. La suma de `weight_percent` de todos los criterios de una `TenderBases` debe ser 100 — validación bloqueante `CRITERIA_WEIGHTS_INVALID`. `EvaluationScore` puntúa contra estos criterios. Origen: ficha LP §3.1.

| Campo | Tipo | Notas |
|---|---|---|
| `tender_bases_id` | ref. `TenderBases` | **Obligatorio** |
| `name` | texto | **Obligatorio** |
| `weight_percent` | número | **Obligatorio** — suma de todos los criterios de la misma `TenderBases` = 100 |
| `scoring_rule` | texto | **Obligatorio** — método de puntuación (ej. escala, fórmula) |

### `LegalReview` (Revisión Jurídica)
**Visibilidad:** expuesta — campos en contrato: `id`, `subject_type`, `subject_id`, `reviewer_id`, `outcome`, `observations`, `reviewed_at`

**Transversal** — polimórfica (`subject_type`/`subject_id`): revisión de `TenderBases` (LP §3.2), de la Resolución de Adjudicación (LP §3.10, sobre `AdministrativeAct`), y candidata para la Resolución Fundada de Trato Directo. Origen: ficha LP §3.2.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `subject_type` | enum | **Obligatorio**. Valores: `tender_bases`, `administrative_act` |
| `subject_id` | ref. polimórfica | **Obligatorio** — apunta a `TenderBases.id` o `AdministrativeAct.id` según `subject_type` |
| `reviewer_id` | ref. `User` | **Obligatorio** |
| `outcome` | enum | **Obligatorio**. Valores: `approved`, `observations` |
| `observations` | texto | **Obligatorio si** `outcome = observations` |
| `reviewed_at` | fecha/hora | **Obligatorio** (generado por sistema al registrar) |

### `AdministrativeAct` (Acto Administrativo)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `act_type`, `subject_id`, `act_number`, `signed_by`, `signed_at`, `status`

**Transversal** — polimórfica por `act_type`, cubre decretos/resoluciones de aprobación de bases (3.3), designación de comisión (3.9a), adjudicación/deserción/revocación (3.10). Generaliza el patrón de `PaymentDecree`.

<!-- REVISAR: `AdministrativeAct` generaliza el patrón de `PaymentDecree` — candidata a absorberlo a futuro. No fusionar ahora; ambas entidades coexisten hasta validación explícita. -->

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `act_type` | enum | **Obligatorio**. Valores: `bases_approval`, `committee_designation`, `award`, `desertion`, `revocation` |
| `subject_id` | ref. polimórfica | **Opcional** — entidad sobre la que recae el acto (ej. `TenderBases.id`), según `act_type` |
| `act_number` | texto | **Obligatorio** (generado por sistema en modo electrónico; ingreso manual en escaneado) |
| `status` | enum | **Obligatorio**. Valores: `pending_signature`, `signed`, `failed` |
| `signed_by` | ref. `User` | **Obligatorio si** `status = signed` |
| `signed_at` | fecha/hora | **Obligatorio si** `status = signed` (generado por sistema al confirmar firma) |
| `document_ref` | ref. `DocumentRef` | **Obligatorio si** `status = signed` — vía C10 |

### `ComptrollerReview` (Toma de Razón)
**Visibilidad:** expuesta — campos en contrato: `id`, `administrative_act_id`, `submitted_at`, `outcome`, `outcome_at`

**Transversal — reutilizable en Trato Directo** (mismo trámite para su Resolución Fundada). Sin integración API asumida con Contraloría: registro manual del envío y del resultado. Origen: ficha LP §3.4 (reutilizada en §3.11).

> ⚠ Pendiente: explorar si existe canal de consulta de estado de trámites CGR integrable; no asumir su existencia — **[PENDIENTE P-64]**.

| Campo | Tipo | Notas |
|---|---|---|
| `administrative_act_id` | ref. `AdministrativeAct` | **Obligatorio** |
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `submitted_at` | fecha | **Obligatorio** — fecha de remisión a Contraloría |
| `outcome` | enum | **Obligatorio si** resuelto. Valores: `approved`, `approved_with_remarks`, `rejected` |
| `outcome_at` | fecha | **Obligatorio si** `outcome` presente |
| `official_document_ref` | ref. `DocumentRef` | **Obligatorio si** `outcome` presente — oficio de respaldo, vía C10 |

### `Guarantee` (Garantía)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `guarantee_type`, `provider_rut`, `instrument_type`, `amount`, `expiry_date`, `status`

**Transversal** — Garantía de Seriedad de la Oferta (LP §3.7) y Garantía de Fiel Cumplimiento (LP §3.12) comparten esta entidad, distinguidas por `guarantee_type`. Custodia en Tesorería — borde de módulo.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `guarantee_type` | enum | **Obligatorio**. Valores: `bid_bond`, `performance_bond` |
| `provider_rut` | texto | **Obligatorio** |
| `instrument_type` | enum | **Obligatorio** — vale vista, boleta, póliza, certificado de fianza |
| `amount` | número | **Obligatorio** |
| `expiry_date` | fecha | **Obligatorio** |
| `status` | enum | **Obligatorio**. Valores: `in_custody`, `returned`, `executed` |
| `document_ref` | ref. `DocumentRef` | **Obligatorio** — vía C10 |

### `EvaluationCommittee` (Comisión Evaluadora)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `designation_act_id`, `status`

1:1 con `ProcurementCase` — condicional, obligatoria sobre umbral `NormativeParameter`; bajo él, evaluación por funcionario responsable con el mismo registro estructurado (sin `EvaluationCommittee` formal). Origen: ficha LP §3.9.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio** |
| `designation_act_id` | ref. `AdministrativeAct` | **Obligatorio** — `act_type = committee_designation` |
| `status` | enum | **Obligatorio**. Valores: `designated`, `active`, `closed` |

### `CommitteeMember` (Integrante de Comisión)
**Visibilidad:** interna — detalle de `EvaluationCommittee`; expuesta agregada vía `EvaluationReport`

1:N con `EvaluationCommittee`. La declaración de ausencia de conflictos de interés es **bloqueante**: sin ella el integrante no está habilitado a evaluar. Origen: ficha LP §3.9.

> Regla SoD propuesta: los integrantes no pueden ser el requirente de la SOLPED ni quien elaboró las bases técnicas — alcance exacto de las inhabilidades **[PENDIENTE P-66]**, validar con jurídica.

| Campo | Tipo | Notas |
|---|---|---|
| `evaluation_committee_id` | ref. `EvaluationCommittee` | **Obligatorio** |
| `user_id` | ref. `User` | **Obligatorio** |
| `conflict_declaration_ref` | ref. `DocumentRef` | **Obligatorio** — bloqueante; sin ella el integrante no habilita a evaluar |
| `conflict_declared_at` | fecha/hora | **Obligatorio** (generado por sistema al registrar) |
| `replaced_by_member_id` | ref. `CommitteeMember` | **Opcional** — reemplazo por conflicto sobreviniente, trazado vía acto modificatorio |

### `OfferRecord` (Oferta)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `provider_rut`, `provider_name`, `offered_amount`, `admissibility_status`, `entry_mode`

1:N con `ProcurementCase` — una por oferente. Espejo mínimo de cada oferta recibida en MP (el detalle completo de la oferta se gestiona en MP; SGM solo traza lo necesario para admisibilidad y evaluación). Origen: ficha LP §3.9.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio** |
| `provider_rut` | texto | **Obligatorio** |
| `provider_name` | texto | **Obligatorio** |
| `offered_amount` | número | **Obligatorio** |
| `admissibility_status` | enum | **Obligatorio**. Valores: `admissible`, `inadmissible` |
| `inadmissibility_cause` | texto | **Obligatorio si** `admissibility_status = inadmissible` |
| `entry_mode` | enum | **Obligatorio**. Valores: `mp_read`, `manual` |

### `EvaluationScore` (Puntaje de Evaluación)
**Visibilidad:** interna — detalle de evaluación; expuesta agregada vía `EvaluationReport`

1:N con `OfferRecord` y con `EvaluationCriterion`. El sistema calcula el total por oferta y bloquea actas cuyos puntajes no cuadren con los pesos declarados en `EvaluationCriterion` — validación `SCORES_INCONSISTENT_WITH_CRITERIA`. Origen: ficha LP §3.9.

| Campo | Tipo | Notas |
|---|---|---|
| `offer_id` | ref. `OfferRecord` | **Obligatorio** |
| `criterion_id` | ref. `EvaluationCriterion` | **Obligatorio** |
| `score` | número | **Obligatorio** |
| `rationale` | texto | **Obligatorio** |

### `EvaluationReport` (Acta de Evaluación)
**Visibilidad:** expuesta — campos en contrato: `id`, `evaluation_committee_id`, `ranking`, `proposed_award_offer_id`, `status`, `signed_at`

1:1 con `EvaluationCommittee`. Acta con ranking y propuesta de adjudicación, firmada por los integrantes. Bloqueada mientras existan `EvaluationScore` inconsistentes con los pesos de `EvaluationCriterion` (`SCORES_INCONSISTENT_WITH_CRITERIA`). Origen: ficha LP §3.9.

| Campo | Tipo | Notas |
|---|---|---|
| `evaluation_committee_id` | ref. `EvaluationCommittee` | **Obligatorio** |
| `ranking` | JSON | **Obligatorio** (generado por sistema) — deriva de `EvaluationScore` agregados por oferta |
| `proposed_award_offer_id` | ref. `OfferRecord` | **Obligatorio** |
| `status` | enum | **Obligatorio**. Valores: `draft`, `signed` — bloqueado en `draft` si hay inconsistencia de puntajes |
| `signed_by` | ref. `User[]` | **Obligatorio si** `status = signed` — integrantes firmantes |
| `signed_at` | fecha/hora | **Obligatorio si** `status = signed` |

### `Contract` (Contrato)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `awarded_offer_ref`, `amount`, `start_date`, `end_date`, `status`

1:1 con `ProcurementCase` — condicional (obligatorio sobre umbral `NormativeParameter` o cuando las bases lo establecen; bajo él, la OC puede formalizar el contrato). Origen: ficha LP §3.13.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | **Obligatorio** |
| `awarded_offer_ref` | ref. `OfferRecord` | **Obligatorio** |
| `administrative_act_id` | ref. `AdministrativeAct` | **Obligatorio** — acto aprobatorio del contrato |
| `amount` | número | **Obligatorio** |
| `start_date` | fecha | **Obligatorio** |
| `end_date` | fecha | **Obligatorio** |
| `document_ref` | ref. `DocumentRef` | **Obligatorio** — vía C10 |
| `contractor_signature_mode` | enum | **Obligatorio**. Mecanismo de firma del contratista **[PENDIENTE P-67]** — valores candidatos: `fea_propia`, `firma_papel_digitalizada`, `plataforma_externa` |
| `status` | enum | **Obligatorio**. Valores: `draft`, `signed`, `not_subscribed` |

---

## Patrones transversales pendientes de definir

Estos puntos aparecen repetidos en más de una entidad/subproceso y son candidatos a resolverse con una única regla de negocio reutilizable:

- **Regla de tolerancia de desviación de montos/precios** — aparece en `PurchaseRequestLine.unit_price` vs. `PriceReference`, en `BudgetCommitment.committed_amount` vs. `BudgetPreCommitment.estimated_amount`, y en `ThreeWayMatch` (discrepancia entre OC/Recepción/Factura).
- **Fuente(s) API externas confiables** — `PriceReference.source` queda sin fuente concreta definida.
- **Hito que congela el tipo de cambio para compromiso presupuestario** — cuando `PurchaseRequest.currency` ≠ `CLP`, el presupuesto y la contabilidad operan en CLP. Falta definir en qué hito se fija la tasa auditable (fecha de resolución, de OC, de preobligación/CDP, u otro) y si la diferencia de cambio posterior es asiento de Contabilidad. Candidato a corregirse al documentar la generación de obligación/compromiso. La tasa mostrada en 1.1 es solo referencial.
- **Umbrales de modalidad: neto vs bruto** — el gateway de modalidad compara montos contra umbrales en UTM (`NormativeParameter`). ¿Se compara el total neto o el total bruto (impuestos incluidos)? Definición normativa, no de diseño. Práctica usual en Mercado Público: impuestos incluidos — verificar. Impacta etapa 2 y el total que viaja desde la SOLPED.
- **Catálogo de `tax_code`** — hoy `iva_19` / `exempt` / `other`; faltan retenciones y tasas especiales si el levantamiento lo requiere.
- **Manejo de fallas de sincronización/disponibilidad de API externa** — relevante para `AgileQuoteProcess` (deep link sin completar) y `BudgetCommitment` (falla de notificación desde MP). Consolidado con la misma familia de resiliencia ante servicios externos de las etapas 2-4 — **[PENDIENTE P-32]**.

## Módulos aún no documentados

Tesorería, Contabilidad, Presupuestos y RRHH/Remuneraciones todavía no tienen entidades levantadas en este archivo. Varias entidades de Adquisiciones (`BudgetLine`, `Invoice`, `User`, `OrganizationalUnit`) se referencian aquí como dependencias externas asumidas — deberán definirse formalmente cuando se documenten esos módulos.
