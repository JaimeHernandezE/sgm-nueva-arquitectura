# Entidades Core del Modelo de Datos

Fuente única de las entidades del modelo de datos SGM. Los macroprocesos **referencian** estas entidades — no las redefinen. Si un macroproceso necesita un campo nuevo en una entidad ya existente aquí, se agrega en este archivo y se referencia desde el subproceso correspondiente, para evitar que la misma entidad diverja entre módulos.

**Convención de nombres:** inglés, estilo técnico (`PurchaseRequest`, no `SolicitudCompra`).

**Visibilidad de borde:** cada entidad indica si es **interna** al módulo o **expuesta** en el contrato API ([`modulos/adquisiciones/contracts.md`](../modulos/adquisiciones/contracts.md)). Por defecto toda entidad es interna; la exposición se declara explícitamente.

**Estado de esta lista:** poblada a partir del macroproceso Compra Ágil (Adquisiciones). Se irá extendiendo a medida que se documenten otras modalidades tras validar el piloto.

---

## Adquisiciones

### `ProcurementCase` (Expediente de Compra)
**Visibilidad:** interna

Raíz de trazabilidad de todo el ciclo SOLPED → Pago. El estado del expediente es **distinto** del estado documental de sus entidades hijas (`PurchaseRequest.status`, `PurchaseOrder.status`, etc.) — no fusionar ambos conceptos.

| Campo | Tipo | Notas |
|---|---|---|
| `folio` | texto | Correlativo legible. Formato propuesto `ADQ-AAAA-NNNNN`. ⚠ **Pendiente de definir:** formato final del correlativo. |
| `procurement_type` | enum | `agile_purchase`, `framework_agreement`, `public_tender`, `direct_procurement` — unificado a inglés (antes en castellano: `compra_agil`, `convenio_marco`, `licitacion_publica`, `trato_directo`), consistente con `PurchaseRequest.purchase_modality`. Origen: reconciliación de fichas de etapa 2/3 (Compra Ágil). |
| `current_step` | ref. `CaseStep` | Paso activo del expediente |
| `status` | enum | `en_curso`, `finalizado`, `cancelado`, `desierto`. ⚠ **Pendiente de definir:** refinamiento de valores y transiciones. |
| `created_at` | fecha/hora | |
| `mp_process_id` | texto | Vínculo genérico con el proceso en Mercado Público, válido para las 4 modalidades. Obligatorio al completar la vinculación MP, salvo Trato Directo. Nulos hasta la vinculación, cuyo momento depende de la modalidad (inmediata en Compra Ágil/Convenio Marco; diferida en Licitación Pública — sub-paso 3.5 de su etapa 3 — y en Trato Directo, al momento de la publicación). Origen: ficha `procesos-transversales/2-modalidad-compra.md` §2.3. |
| `mp_linked_at` | fecha/hora | Nula hasta la vinculación — mismo momento condicional por modalidad que `mp_process_id`. Origen: ficha `2-modalidad-compra.md` §2.3. |
| `mp_process_type` | enum | Coherente con `procurement_type`. Origen: ficha `2-modalidad-compra.md` §2.3. |

### `CaseStep` (Paso de Expediente)
**Visibilidad:** interna

1:N con `ProcurementCase`. La secuencia de pasos se instancia según `procurement_type`: Compra Ágil 5 pasos, Convenio Marco 4, Licitación Pública 6, Trato Directo 5. De aquí salen "tiempo transcurrido por etapa" y "responsable actual" sin joins.

<!-- REVISAR: recuento de pasos por modalidad contra fichas reales — la ficha `3. licitacion-publica/3-resolucion-compra.md` por sí sola ya tiene 14 sub-pasos (3.1-3.14); si "Licitación Pública 6" se refería a etapas (no a sub-pasos), aclararlo explícitamente aquí; si quedó obsoleto, no corregir el número por cuenta propia. -->

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | |
| `step_number` | número | |
| `name` | texto | |
| `status` | enum | `pendiente`, `en_curso`, `finalizada` |
| `responsible_unit` | ref. `OrganizationalUnit` | |
| `started_at` | fecha/hora | |
| `completed_at` | fecha/hora | |

> `procurement_case_id` en cada entidad del ciclo es **desnormalización intencional** para trazabilidad y reportería directa (consultas por expediente sin recorrer la cadena de FKs). Se mantiene además de las FKs directas entre entidades.

### `PurchaseRequest` (SOLPED)
**Visibilidad:** expuesta — campos en contrato: `id`, `requesting_unit`, `description`, `justification`, `requested_date`, `purchase_modality`, `founded_resolution_attachment`, `proposed_budget_line_id`, `proposed_fiscal_year`, `status`

Origen: `modulos/adquisiciones/procesos-transversales/1-solped.md`

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `requesting_unit` | ref. `OrganizationalUnit` | |
| `description` | texto | |
| `justification` | texto | |
| `requested_date` | fecha | |
| `purchase_modality` | enum, **opcional** | Indicación provisional de modalidad de compra. Valores: `agile_purchase` (Compra Ágil), `framework_agreement` (Convenio Marco), `public_tender` (Licitación Pública), `direct_procurement` (Trato Directo). Puede confirmarse o modificarse en etapa 2. |
| `founded_resolution_attachment` | ref. adjunto | **Obligatorio** si `purchase_modality = direct_procurement`. Resolución Fundada que funda el Trato Directo. |
| `proposed_budget_line_id` | ref. `BudgetLine` | **Opcional** — indicación del solicitante para autoconsulta de saldo (1.1, 1.2); no sustituye verificación en 1.3 |
| `proposed_fiscal_year` | número | **Opcional** — año fiscal asociado a la línea propuesta |
| `status` | enum | `draft`, `pending_approval`, `pending_finance`, `quoting_in_progress`, `quote_void`, … |

### `PurchaseRequestLine`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `item_description`, `quantity`, `unit_of_measure`, `unit_price`, `price_source`

1:N con `PurchaseRequest`.

| Campo | Tipo | Notas |
|---|---|---|
| `item_description` | texto | |
| `quantity` | número | |
| `unit_of_measure` | ref. `UnitOfMeasure` | |
| `unit_price` | número | Obligatorio |
| `price_source` | ref. `PriceReference` | |

### `PriceReference`
**Visibilidad:** interna — usada en validación de `createPurchaseRequest`; no cruza borde como entidad independiente

N:1 con `PurchaseRequestLine`. **Nueva — fuente API de precio aún sin definir.**

| Campo | Tipo | Notas |
|---|---|---|
| `item_code` / `item_description_hash` | texto | Pendiente definir mecanismo de match |
| `source` | enum | `SII`, `mercado_publico_historico`, `otro` — **pendiente de definir cuál usar** |
| `reference_price` | número | |
| `reference_date` | fecha | |
| `currency` | enum | Probablemente siempre CLP |

### `PurchaseRequestApproval`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `approver_id`, `decision`, `decision_date`, `comments`

1:N con `PurchaseRequest`. Historial de decisiones — permite múltiples ciclos rechazo/reenvío.

| Campo | Tipo | Notas |
|---|---|---|
| `purchase_request_id` | ref. `PurchaseRequest` | |
| `approver_id` | ref. `User` | |
| `decision` | enum | `approved`, `rejected` |
| `decision_date` | fecha | |
| `comments` | texto | Obligatorio si `decision = rejected` |

### `BudgetAvailabilityCertificate` (CDP)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `purchase_request_id`, `certificate_number`, `budget_line_id`, `certified_amount`, `fiscal_year`, `verified_by`, `signed_by`, `signed_at`, `status`, `signature_mode`

1:1 con `PurchaseRequest` en esta etapa. Certificado de Disponibilidad Presupuestaria emitido y firmado por el aprobador DAF (sub-paso 1.5).

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `purchase_request_id` | ref. `PurchaseRequest` | |
| `certificate_number` | texto | Correlativo del CDP |
| `budget_line_id` | ref. `BudgetLine` | |
| `certified_amount` | número | |
| `fiscal_year` | número | |
| `verified_by` | ref. `User` | Formulador DAF (sub-paso 1.3) |
| `signed_by` | ref. `User` | Aprobador DAF (sub-paso 1.5) |
| `signed_at` | fecha/hora | |
| `status` | enum | `issued`, `rejected`, `pending_signature` |
| `rejection_reason` | texto | Obligatorio si `rejected` |
| `signature_mode` | enum | `electronic`, `scanned` — distingue firma FirmaGob de CDP escaneado con firmas (sub-paso 1.5) |
| `scanned_certificate_attachment` | ref. almacenamiento | Obligatorio si `signature_mode = scanned` |

### `BudgetPreCommitment` (Preobligación / Pre-afectación)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `purchase_request_id`, `budget_availability_certificate_id`, `budget_line_id`, `estimated_amount`, `fiscal_year`, `status`

1:1 con `PurchaseRequest`. **Preobligación** presupuestaria registrada tras CDP vigente (sub-paso 1.6). Los términos *preobligación* y *pre-afectación* son equivalentes en este modelo. La preobligación se contabiliza en el módulo Contabilidad vía borde de módulo (`registerPreObligation`).

> Origen: las fichas `3-resolucion-compra.md` y `4-recepcion-conforme.md` referencian esta entidad como `PreCommitment` — normalizado aquí al nombre canónico `BudgetPreCommitment`.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `purchase_request_id` | ref. `PurchaseRequest` | |
| `budget_availability_certificate_id` | ref. `BudgetAvailabilityCertificate` | **Obligatorio** — requiere CDP vigente |
| `budget_line_id` | ref. `BudgetLine` | |
| `estimated_amount` | número | |
| `fiscal_year` | número | |
| `status` | enum | `active`, … |

### `AgileQuoteProcess`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `deep_link_clicked_at`, `mp_quote_id`

1:1 con `PurchaseRequest`. Puente de trazabilidad SGM↔MP, específico de Compra Ágil — solo campos de trazabilidad, la lógica de negocio de la cotización vive en MP.

> **Vínculo genérico con MP:** el vínculo canónico y genérico con Mercado Público (válido para las 4 modalidades) vive en `ProcurementCase.mp_process_id`. Este `AgileQuoteProcess` se conserva solo como traza específica de Compra Ágil (`deep_link_clicked_at`); su campo `mp_quote_id` **duplica** `ProcurementCase.mp_process_id` y es candidato a eliminarse.
> <!-- REVISAR: consolidar AgileQuoteProcess tras validación -->

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `purchase_request_id` | ref. `PurchaseRequest` | |
| `deep_link_clicked_at` | fecha/hora | |
| `mp_quote_id` | texto | Nulo hasta sincronización. Duplica `ProcurementCase.mp_process_id` — ver nota arriba. |

### `PurchaseOrder` (OC)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `mp_oc_id`, `supplier_rut`, `total_amount`, `selection_justification`, `status`, `acceptance_date`

1:N con `ProcurementCase` por reemisiones (rechazo de OC → reemisión a segunda oferta, dentro de Compra Ágil); a lo más una en estado activo. *(Actualizado desde "1:1 con `PurchaseRequest` en Compra Ágil — posible 1:N en otras modalidades"; la ficha `3-resolucion-compra.md` §3.5 hace real el 1:N dentro de la misma modalidad.)*

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `purchase_request_id` | ref. `PurchaseRequest` | |
| `mp_oc_id` | texto | |
| `supplier_rut` | texto | |
| `total_amount` | número | |
| `selection_justification` | texto | Obligatorio si no se eligió la oferta de menor precio |
| `status` | enum | `issued`, `accepted`, `rejected`, `blocked_ineligible`, `rejected_by_supplier`, `pending_mp_sync`, `commitment_pending`. <!-- REVISAR: 'rejected' y 'rejected_by_supplier' coexisten en este enum con semántica solapada; preexistente a esta reconciliación, ninguna instrucción lo aborda --> |
| `acceptance_date` | fecha | Nula hasta aceptación |
| `supplier_eligibility_check` | booleano | Resultado de validación de habilidad tributaria/laboral |
| `cancellation_reason` | texto | Solo si se cancela antes de emitir |
| `fulfillment_status` | enum | `pending`, `partially_received`, `fully_received` — derivado del agregado de líneas recepcionadas. Origen: ficha `4-recepcion-conforme.md` §4.1. |
| `entry_mode` | enum | `mp_read` \| `manual` — distingue si el dato de la OC proviene de lectura MP o de registro manual (patrón lectura MP vs. registro manual). Origen: ficha `3-resolucion-compra.md`. |

### `BudgetCommitment` (Compromiso Cierto / Obligación)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `budget_pre_commitment_id`, `committed_amount`, `commitment_date`, `source`

1:1 con `PurchaseOrder` y con `BudgetPreCommitment`. Hito contable crítico — cierre del ciclo de pre-afectación.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `purchase_order_id` | ref. `PurchaseOrder` | |
| `budget_pre_commitment_id` | ref. `BudgetPreCommitment` | |
| `committed_amount` | número | Monto real desde MP — puede diferir del `estimated_amount` |
| `commitment_date` | fecha | Automática |
| `source` | enum | `api_sync` — distingue de futuros ajustes manuales |

### `GoodsReceipt` (Recepción Conforme)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `received_by`, `received_date`, `receipt_type`, `receiving_unit`, `status`, `observations`

1:N con `PurchaseOrder` — N recepciones por OC (entregas parciales, períodos recurrentes); cubre bienes y servicios vía `receipt_type`. Cada recepción referencia las líneas y cantidades que cubre (ver `GoodsReceiptLine`). Fusionado con la definición de la ficha `4-recepcion-conforme.md` §4.1/§4.2.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `purchase_order_id` | ref. `PurchaseOrder` | |
| `receipt_type` | enum | `physical_good` \| `service`. Origen: ficha 4.1. |
| `received_by` | ref. `User` | |
| `receiving_unit` | ref. `OrganizationalUnit` | Bodega o unidad requirente, según perfil de recepción configurado por el municipio. Origen: ficha 4.1. |
| `received_date` | fecha | |
| `service_period_start` / `service_period_end` | fecha | **Obligatorios si** `receipt_type = service` recurrente. Origen: ficha 4.1. |
| `supporting_document_ref` | ref. almacenamiento de objetos | **Obligatorio si** `receipt_type = service` (informe, acta). Origen: ficha 4.1. |
| `status` | enum | `draft`, `confirmed`, `rejected`, `partially_rejected`. **Reemplaza** el enum anterior `conformity_status` (`conforme`/`no_conforme`), que queda subsumido — la conformidad total/parcial se resuelve ahora a nivel de `GoodsReceiptLine`. Origen: ficha 4.1/4.2. |
| `observations` | texto | Obligatorio si `status` indica rechazo total o parcial |
| `confirmed_by` | ref. `User` | Debe ser distinto del aprobador de la compra (regla SoD). Origen: ficha 4.2. |
| `confirmed_at` | fecha/hora | Origen: ficha 4.2. |
| `accrual_ref` | ref. `Accrual` | Referencia resultante tras `recordAccrual`. Origen: ficha 4.4. <!-- REVISAR: momento del devengado — ver nota junto a `Accrual` --> |

> `received_quantity` se retira del encabezado de `GoodsReceipt` (antes marcado "por línea", inconsistente con un campo a nivel de cabecera) — la cantidad ahora vive exclusivamente en `GoodsReceiptLine`.

### `GoodsReceiptLine`
**Visibilidad:** interna — candidata a exposición si se confirma trazabilidad por ítem

1:N con `GoodsReceipt`. **Confirmada** (antes *sugerida, no confirmada en fuente*) — la ficha `4-recepcion-conforme.md` §4.1 la trae con tabla de campos completa, se promueve a definición confirmada.

| Campo | Tipo | Notas |
|---|---|---|
| `goods_receipt_id` | ref. `GoodsReceipt` | |
| `purchase_order_line_ref` | ref. línea de `PurchaseOrder` | |
| `quantity_ordered` | número | |
| `quantity_received` | número | |
| `quantity_accepted` | número | |
| `quantity_rejected` | número | |
| `rejection_reason` | texto | **Obligatorio si** `quantity_rejected > 0` |
| `inventory_entry_ref` | ref. externa | Referencia al registro del proveedor de inventario, si existe. Origen: ficha 4.3. |

### `ThreeWayMatch` (Cruce de 3 vías)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `goods_receipt_id`, `invoice_id`, `match_status`, `match_date`

1:1:1 con `PurchaseOrder`, `GoodsReceipt`, `Invoice`. Punto de control crítico — sin regla de tolerancia de discrepancia definida (ya identificado como control interno crítico en la ficha QA, ítems P1).

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `purchase_order_id` | ref. `PurchaseOrder` | |
| `goods_receipt_id` | ref. `GoodsReceipt` | |
| `invoice_id` | ref. `Invoice` (fuente SII) | |
| `match_status` | enum | `matched`, `discrepancy` |
| `match_date` | fecha | |

### `Accrual` (Devengado)
**Visibilidad:** expuesta — campos en contrato: `id`, `three_way_match_id`, `budget_commitment_id`, `accrual_amount`, `accrual_date`

1:1 con `ThreeWayMatch` y `BudgetCommitment`. Cierra el ciclo presupuestario.

> Origen: la ficha `4-recepcion-conforme.md` §4.4 referencia esta entidad como `AccrualRecord` — normalizado aquí al nombre canónico `Accrual`.
>
> <!-- REVISAR: momento del devengado — el flujo canónico encadena `ThreeWayMatch` (OC + Recepción + Factura) → `Accrual` 1:1 (ver `procesos-transversales/5-pago.md` §5.1-5.2); la ficha `4-recepcion-conforme.md` §4.4 gatilla el devengado desde la conformidad de recepción (devengados parciales por valor aceptado, vía `recordAccrual`), dejando el circuito de factura en la frontera con Tesorería. Son dos definiciones distintas del momento contable del devengado — **[PENDIENTE P-46]**, prioridad alta, definir con Contabilidad/DM. No resuelto aquí. -->

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `three_way_match_id` | ref. `ThreeWayMatch` | |
| `budget_commitment_id` | ref. `BudgetCommitment` | |
| `accrual_amount` | número | |
| `accrual_date` | fecha | |

### `PaymentDecree` (Decreto de Pago)
**Visibilidad:** expuesta — campos en contrato: `id`, `accrual_id`, `decree_number`, `decree_date`, `approver_id`

1:1 con `Accrual`.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `accrual_id` | ref. `Accrual` | |
| `decree_number` | texto | Correlativo |
| `decree_date` | fecha | |
| `approver_id` | ref. `User` | |

### `Payment` (Pago)
**Visibilidad:** expuesta — campos en contrato: `id`, `payment_decree_id`, `payment_date`, `payment_method`, `payment_status`

1:1 con `PaymentDecree`. Falta definir manejo de vencimiento de plazo legal (30 días corridos desde factura).

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | Desnormalización intencional — ver nota arriba |
| `payment_decree_id` | ref. `PaymentDecree` | |
| `payment_date` | fecha | |
| `payment_method` | enum | |
| `payment_status` | enum | `completed`, `failed` |

### `ModalityDecision`
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `selected_modality`, `ratified`, `decided_by`, `decided_at`

1:N con `ProcurementCase` (N por reversiones). Decisión de ratificación/selección de modalidad de compra (gateway de validación V1-V8), con resultados de validación y parámetros normativos aplicados congelados para auditoría retrospectiva. Origen: ficha `2-modalidad-compra.md` §2.1.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | |
| `selected_modality` | enum | `agile_purchase`, `framework_agreement`, `public_tender`, `direct_procurement` |
| `ratified` | booleano | Verdadero si coincide con `PurchaseRequest.purchase_modality` |
| `catalog_bypass_justification` | texto | **Obligatorio si** aplica la regla de primera-opción-catálogo (V2) y se elige otra modalidad |
| `direct_procurement_cause` | ref. catálogo de causales | **Obligatorio si** `selected_modality = direct_procurement`. Catálogo estructurado pendiente — **[PENDIENTE P-36]** |
| `validation_results` | JSON | Resultado de las reglas de validación (V1–V8) y valores de `NormativeParameter` aplicados al momento de confirmar, para auditoría retrospectiva |
| `requires_jefatura_approval` | booleano | Capturado por el usuario en 2.1: si es verdadero, el expediente pasa por 2.2 antes de continuar a la vinculación MP; si es falso, 2.2 se omite. Operacionaliza como decisión por expediente el sub-paso 2.2, mientras su existencia formal siga pendiente de ratificación con la DM — **[PENDIENTE P-38]** (no se cierra con este campo, solo se hace exigible/omitible por decisión operativa). |
| `decided_by` | ref. `User` | |
| `decided_at` | fecha | |

### `ModalityDecisionApproval` *(sugerida, no confirmada en fuente)*
**Visibilidad:** expuesta — campos en contrato: `id`, `modality_decision_id`, `approver_id`, `decision`, `decision_date`

1:1 con `ModalityDecision`. Aprobación de jefatura sobre la decisión de modalidad, previa a la vinculación con Mercado Público. **Existencia, alcance y exigencia de firma pendientes de ratificar con la DM** — **[PENDIENTE P-38]**. Origen: ficha `2-modalidad-compra.md` §2.2.

| Campo | Tipo | Notas |
|---|---|---|
| `modality_decision_id` | ref. `ModalityDecision` | |
| `approver_id` | ref. `User` | |
| `decision` | enum | `approved`, `rejected` |
| `comments` | texto | Obligatorio si `decision = rejected` |
| `decision_date` | fecha | |

### `NormativeParameter`
**Visibilidad:** expuesta — referencia global de plataforma; no administrada por el módulo Adquisiciones ni por el tenant (administración a nivel plataforma por SUBDERE)

Umbrales legales configurables usados por el gateway de validación de modalidad (V1–V8): umbral de Compra Ágil, umbral de Toma de Razón, tramos de licitación, umbrales de garantías, ventana de detección de fraccionamiento. Cada valor tiene vigencia temporal (`valid_from`) y el cambio es un acto auditado con doble control (quien propone no aprueba). Carga inicial de valores pendiente de verificar contra norma vigente — **[PENDIENTE P-37]**. Origen: ficha `2-modalidad-compra.md` §2.1.

| Campo | Tipo | Notas |
|---|---|---|
| `parameter_code` | texto | Ej. `AGILE_PURCHASE_UTM_LIMIT`, `COMPTROLLER_REVIEW_UTM_LIMIT`, `TENDER_TIER_THRESHOLDS`, `GUARANTEE_THRESHOLDS` |
| `value` | JSON | Número o estructura de tramos |
| `valid_from` | fecha | |
| `created_by` / `approved_by` | ref. `User` | Personas distintas — doble control |
| `legal_reference` | texto | Norma que motiva el valor |

### `UtmValue`
**Visibilidad:** interna — valor obtenido de fuente externa (SII u otra fuente oficial) vía la dependencia `getUtmValue`; no se expone como entidad propia del contrato de Adquisiciones

Valor UTM mensual usado para convertir montos CLP↔UTM en el gateway de validación de modalidad. Origen: ficha `2-modalidad-compra.md` §2.1.

| Campo | Tipo | Notas |
|---|---|---|
| `month` | número | |
| `year` | número | |
| `value_clp` | número | |
| `source` | texto | |

### `MpProcessSnapshot` *(sugerida, no confirmada en fuente)*
**Visibilidad:** interna

1:N con `ProcurementCase`. Bitácora de sincronización de estado con Mercado Público, común a toda la etapa 3 (período de cotización, cierre/selección, emisión/aceptación/rechazo de OC, desierto/fallido) — agnóstica de si el mecanismo de origen es push o polling. Origen: ficha `3-resolucion-compra.md` §3.1.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | |
| `mp_status` | texto | |
| `data` | JSON | Payload leído |
| `read_at` | fecha/hora | |
| `source` | enum | `push`, `polling` |

### `QuotationResult` *(sugerida, no confirmada en fuente)*
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `selected_provider_rut`, `selected_provider_name`, `offered_amount`, `lowest_price_selected`, `entry_mode`

1:N con `ProcurementCase`. Resultado de la selección de oferta al cierre del período de cotización; `entry_mode` distingue si el dato proviene de lectura MP o de registro manual (modo degradado, ver `plantilla-maestra-sgm.md` §5.3). Origen: ficha `3-resolucion-compra.md` §3.2.

| Campo | Tipo | Notas |
|---|---|---|
| `procurement_case_id` | ref. `ProcurementCase` | |
| `selected_provider_rut` | texto | |
| `selected_provider_name` | texto | |
| `offered_amount` | número | |
| `lowest_price_selected` | booleano | |
| `entry_mode` | enum | `mp_read`, `manual` |
| `recorded_at` | fecha/hora | |

### `ReceiptRejectionCase` *(sugerida, no confirmada en fuente)*
**Visibilidad:** expuesta — campos en contrato: `id`, `goods_receipt_id`, `resolution_type`, `resolution_deadline`, `resolved_at`, `outcome`

1:N con `GoodsReceipt`. Gestión trazable del rechazo (total o parcial) de una recepción: devolución, reposición/corrección, o incumplimiento. Origen: ficha `4-recepcion-conforme.md` §4.5.

| Campo | Tipo | Notas |
|---|---|---|
| `goods_receipt_id` | ref. `GoodsReceipt` | |
| `goods_receipt_lines` | ref. `GoodsReceiptLine[]` | Líneas afectadas |
| `resolution_type` | enum | `return`, `replacement`, `penalty`, `claim` |
| `resolution_deadline` | fecha | |
| `resolved_at` | fecha | |
| `outcome` | texto | |

---

## Patrones transversales pendientes de definir

Estos puntos aparecen repetidos en más de una entidad/subproceso y son candidatos a resolverse con una única regla de negocio reutilizable:

- **Regla de tolerancia de desviación de montos/precios** — aparece en `PurchaseRequestLine.unit_price` vs. `PriceReference`, en `BudgetCommitment.committed_amount` vs. `BudgetPreCommitment.estimated_amount`, y en `ThreeWayMatch` (discrepancia entre OC/Recepción/Factura).
- **Fuente(s) API externas confiables** — `PriceReference.source` queda sin fuente concreta definida.
- **Manejo de fallas de sincronización/disponibilidad de API externa** — relevante para `AgileQuoteProcess` (deep link sin completar) y `BudgetCommitment` (falla de notificación desde MP). Consolidado con la misma familia de resiliencia ante servicios externos de las etapas 2-4 — **[PENDIENTE P-32]**.

## Módulos aún no documentados

Tesorería, Contabilidad, Presupuestos y RRHH/Remuneraciones todavía no tienen entidades levantadas en este archivo. Varias entidades de Adquisiciones (`BudgetLine`, `Invoice`, `User`, `OrganizationalUnit`) se referencian aquí como dependencias externas asumidas — deberán definirse formalmente cuando se documenten esos módulos.
