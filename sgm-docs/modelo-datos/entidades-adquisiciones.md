# Entidades — Adquisiciones

Definición canónica de entidades del **módulo Adquisiciones**. Índice del modelo: [`entidades-core.md`](entidades-core.md). Plataforma: [`entidades-plataforma.md`](entidades-plataforma.md).

Los macroprocesos **referencian** estas entidades — no las redefinen. Si un subproceso necesita un campo nuevo, se agrega aquí y se referencia desde la ficha.

**Contrato API:** [`modulos/adquisiciones/contracts.md`](../modulos/adquisiciones/contracts.md).

**Convención de tabla:** `Campo` (técnico, inglés) · `Label (ES)` (etiqueta UI/funcional) · `Tipo` · `Notas` (obligatoriedad). El Label (ES) debe coincidir con “Campo UI” del wireframe y la etiqueta del prototipo HTML cuando el campo aparece en formulario (ver `plantilla-maestra-sgm.md` §6).

**Estado:** poblada a partir de Compra Ágil y extendida a Convenio Marco, Licitación Pública y Trato Directo. Entidades de borde presupuestario/contable/tesorería quedan aquí de forma **provisional** hasta documentar esos módulos.

---

### `ProcurementCase` (Expediente de Compra)
**Visibilidad:** expuesta — campos en contrato: `id` (= `folio`), `procurement_type`, `status`, `current_step_id`, `title`, `requesting_unit_id`, `destination_unit_id`, `created_at`, `mp_process_id`, `mp_linked_at`, `mp_process_type`, `procurement_route`, `route_decided_at`, `purchase_intent_published_at`, `purchase_intent_deadline`

Raíz de trazabilidad de todo el ciclo SOLPED → Pago. El estado del expediente es **distinto** del estado documental de sus entidades hijas (`PurchaseRequest.status`, `PurchaseOrder.status`, etc.) — no fusionar ambos conceptos.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `id` | Identificador | texto | **Obligatorio** (generado por sistema). Igual al `folio` legible. Formato `ADQ-AAAA-NNNNN`. |
| `folio` | Folio | texto | **Obligatorio** (generado por sistema). Correlativo legible. Duplica `id` — expuesto como `id` en API. |
| `title` | Título | texto | **Obligatorio** — resumen corto del expediente (listado y cabecera). Copia de `PurchaseRequest.title` al crear la SOLPED (`createPurchaseRequest`, creación implícita del expediente). |
| `requesting_unit_id` | Unidad solicitante | ref. `OrganizationalUnit` | **Obligatorio** — copia de `PurchaseRequest.requesting_unit`. Con `adq.solicitante`: autoasignada (fija). Con `adq.solicitante_daf`: autoasignada por default y **modificable**. Ver [`catalogo-roles.md`](../arquitectura/especificacion/catalogo-roles.md) §3.1. |
| `destination_unit_id` | Unidad de destino | ref. `OrganizationalUnit` | **Obligatorio** — unidad beneficiaria (copia de `PurchaseRequest.destination_unit`). Con `adq.solicitante` = misma que solicitante (fija); con `adq.solicitante_daf` = seleccionable. Ver [`catalogo-roles.md`](../arquitectura/especificacion/catalogo-roles.md) §3.1. Base del listado/departamento y del alcance del aprobador de unidad. |
| `procurement_type` | Modalidad de compra | enum | **Opcional** hasta etapa 2.1; **Obligatorio** desde confirmación de modalidad. Valores: `agile_purchase`, `framework_agreement`, `public_tender`, `direct_procurement`. |
| `current_step_id` | Paso actual | ref. `CaseStep` | **Obligatorio** |
| `status` | Estado | enum | **Obligatorio**. Valores API: `in_progress`, `completed`, `cancelled`, `deserted`. |
| `created_at` | Fecha de creación | fecha/hora | **Obligatorio** (generado por sistema) |
| `mp_process_id` | ID proceso Mercado Público | texto | **Opcional** hasta vinculación MP; **Obligatorio si** vinculación completada (salvo Trato Directo en fase inicial). Origen: ficha `2-modalidad-compra.md` §2.3. |
| `mp_linked_at` | Fecha de vinculación MP | fecha/hora | **Opcional** hasta vinculación; **Obligatorio si** `mp_process_id` presente. Origen: ficha `2-modalidad-compra.md` §2.3. |
| `mp_process_type` | Tipo de proceso MP | enum | **Opcional** hasta vinculación; **Obligatorio si** `mp_process_id` presente. Coherente con `procurement_type`. Origen: ficha `2-modalidad-compra.md` §2.3. |
| `procurement_route` | Ruta de compra (Convenio Marco) | enum (`gran_compra` \ | `compra_directa`) | **Solo Convenio Marco.** **Obligatorio** desde 3.1 (compuerta automática por umbral `FRAMEWORK_AGREEMENT_GRAN_COMPRA_UTM_LIMIT`); puede actualizarse de `gran_compra` a `compra_directa` en 3.6 (Gran Compra desierta). Origen: ficha `2. convenio-marco/3-resolucion-compra-convenio-marco v2.md` §3.1/§3.6. |
| `route_decided_at` | Fecha de decisión de ruta | fecha/hora | **Solo Convenio Marco.** **Obligatorio** junto con `procurement_route`; timestamp de la evaluación automática de umbral (3.1). Origen: ficha CM §3.1. |
| `purchase_intent_published_at` | Publicación intención de compra | fecha/hora | **Solo Convenio Marco, ruta `gran_compra`.** **Obligatorio** al publicar la Intención de Compra (3.3). Origen: ficha CM §3.3. |
| `purchase_intent_deadline` | Plazo intención de compra | fecha/hora | **Solo Convenio Marco, ruta `gran_compra`.** **Obligatorio** junto con `purchase_intent_published_at`; calculado `published_at + 10 días corridos` (Directiva N° 15 ChileCompra). Origen: ficha CM §3.3. |

### `CaseStep` (Paso de Expediente)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `step_number`, `name`, `status`, `responsible_unit_id`, `responsible_role`, `responsible_user_id`, `started_at`, `completed_at`, `elapsed_display`

1:N con `ProcurementCase`. La secuencia de `CaseStep` instancia las **etapas de alto nivel del expediente** (esqueleto compartido de 5 etapas: SOLPED → Modalidad → Resolución de Compra → Recepción → Pago; ver [`adquisiciones/overview.md`](../modulos/adquisiciones/overview.md)), **no** el recuento de sub-pasos de las fichas (p. ej. LP §3.1–3.14 son sub-pasos dentro de la etapa 3). La etapa 3 varía por `procurement_type`; el número de filas `CaseStep` por modalidad lo fija la plantilla de expediente al confirmar modalidad. De aquí salen "tiempo transcurrido por etapa" y "responsable actual" sin joins.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio** |
| `step_number` | Número de etapa | número | **Obligatorio** |
| `name` | Nombre | texto | **Obligatorio** |
| `status` | Estado | enum | **Obligatorio**. Valores API: `pending`, `in_progress`, `completed`, `omitted`. |
| `responsible_unit_id` | Unidad responsable | ref. `OrganizationalUnit` | **Opcional** hasta asignación de responsable |
| `responsible_role` | Rol responsable | texto | **Opcional** — rol del responsable (ej. `Usuario`, `Aprobador`). |
| `responsible_user_id` | Usuario responsable | ref. `User` | **Opcional** — funcionario asignado. |
| `started_at` | Inicio | fecha/hora | **Opcional** hasta inicio del paso |
| `completed_at` | Término | fecha/hora | **Opcional** hasta cierre del paso |
| `elapsed_display` | Tiempo transcurrido | texto | **Opcional** — derivado en lectura (ej. `2 d 6 h`); no persistido. |

> `procurement_case_id` en cada entidad del ciclo es **desnormalización intencional** para trazabilidad y reportería directa (consultas por expediente sin recorrer la cadena de FKs). Se mantiene además de las FKs directas entre entidades.

### `PurchaseRequest` (SOLPED)
**Visibilidad:** expuesta — campos en contrato: `id`, `requesting_unit`, `destination_unit`, `title`, `description`, `justification`, `requested_date`, `purchase_modality`, `founded_resolution_attachment`, `currency`, `proposed_management_node_id`, `proposed_budget_line_id`, `proposed_fiscal_year`, `status`

Origen: `modulos/adquisiciones/procesos-transversales/1-solped.md`

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional — ver nota arriba |
| `requesting_unit` | Unidad solicitante | ref. `OrganizationalUnit` | **Obligatorio** — se autoasigna según el `RoleAssignment` del actor. Con `adq.solicitante`: fija a su unidad. Con `adq.solicitante_daf`: default DAF y **modificable** en el tenant. Ver [`catalogo-roles.md`](../arquitectura/especificacion/catalogo-roles.md) §3.1. |
| `destination_unit` | Unidad de destino | ref. `OrganizationalUnit` | **Obligatorio** — unidad para la que se solicita la compra. Con `adq.solicitante`: autoasignada = `requesting_unit` (fija). Con `adq.solicitante_daf`: seleccionable entre unidades del tenant. Ver [`catalogo-roles.md`](../arquitectura/especificacion/catalogo-roles.md) §3.1. |
| `title` | Título | texto | **Obligatorio** — resumen corto (una línea). Se copia a `ProcurementCase.title` al crear el expediente. Visible en listado y cabecera del expediente. |
| `description` | Descripción | texto | **Obligatorio** — texto largo: qué producto, servicio o conjunto se busca. Distinto de `justification` (el porqué). No se copia al expediente. |
| `justification` | Justificación | texto | **Obligatorio** — motivo / necesidad de la compra (el porqué). Distinto de `description` (el qué). Contexto no clasificatorio para la DAF (D-6). |
| `requested_date` | Fecha solicitud | fecha | **Obligatorio** (generado por sistema al crear la SOLPED — fecha del día de creación). No editable por el usuario. |
| `purchase_modality` | Modalidad de compra | enum, **opcional** | **Opcional** — indicación provisional de modalidad. Valores: `agile_purchase`, `framework_agreement`, `public_tender`, `direct_procurement`. Confirmable en etapa 2. |
| `founded_resolution_attachment` | Resolución fundada | ref. `DocumentRef` | **Obligatorio si** `purchase_modality = direct_procurement`. Resolución Fundada — almacenada vía C10 (`storeDocument`). |
| `currency` | Moneda | enum | **Obligatorio** (default `CLP`). Valores: `CLP`, `UF`, `UTM`, `USD`. Moneda del documento; todas las líneas se expresan en ella. No se mezclan monedas en una misma SOLPED. |
| `proposed_management_node_id` | Nodo de gestión (propuesto) | ref. `ManagementNode` | **Opcional** — hoja del eje de gestión (D-5). Espejo no vinculante de la imputación del CDP (D-6). Path Área › … › Actividad derivado en UI. Catálogo vía `listManagementNodes`. **No** filtrar por unidad destino en 1.1 (**[PENDIENTE P-23]**; **[PENDIENTE P-28]**). |
| `proposed_budget_line_id` | Imputación presupuestaria propuesta | ref. `BudgetLine` | **Opcional** — cuenta/`DETALLE` propuesta (D-6); no sustituye la clasificación/verificación en 1.3. Al seleccionar: UI muestra descripción y saldo (`getBudgetLine` + `previewBudgetAvailability`). |
| `proposed_fiscal_year` | Año fiscal propuesto | número | **Opcional** — año fiscal asociado a la línea propuesta |
| `status` | Estado | enum | **Obligatorio**. Valores: `draft`, `pending_approval`, `pending_finance`, `quoting_in_progress`, `quote_void`, … |

### `PurchaseRequestAttachment`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `attachment_type`, `description`, `document_ref`

1:N con `PurchaseRequest`. Documentos de respaldo opcionales de la SOLPED (distintos de la Resolución Fundada). Origen: wireframe `11-creacion-solped.md`.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `purchase_request_id` | SOLPED | ref. `PurchaseRequest` | **Obligatorio** |
| `attachment_type` | Tipo de adjunto | enum | **Obligatorio**. Valores: `quote` (cotización), `product_reference_photo` (foto referencial del producto), `technical_sheet` (ficha técnica), `other` (otro antecedente) |
| `description` | Descripción | texto | **Obligatorio** — qué respalda el archivo (ej. «Cotización ACME — resmas») |
| `document_ref` | Documento | ref. `DocumentRef` | **Obligatorio** — almacenado vía C10 (`storeDocument`) |

### `PurchaseRequestLine`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `product_code`, `item_description`, `quantity`, `unit_of_measure`, `unit_price`, `tax_code`, `price_source`

1:N con `PurchaseRequest`.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `product_code` | Código de producto | texto | **Opcional** mientras el catálogo de productos no esté definido (**[PENDIENTE X-94]**). UI: typeahead que busca por **código o palabra**; si el usuario elige un hit del catálogo, se persiste el código y puede prellenar `item_description`. Sin catálogo, el campo admite ingreso libre / vacío. |
| `item_description` | Descripción del ítem | texto | **Obligatorio** |
| `quantity` | Cantidad | número | **Obligatorio** |
| `unit_of_measure` | Unidad de medida | ref. `UnitOfMeasure` | **Obligatorio** — código/`id` del catálogo de plataforma (`listUnitOfMeasures`, solo activas). Catálogo administrable en consola municipal — ver [`entidades-plataforma.md`](entidades-plataforma.md) `UnitOfMeasure`. |
| `unit_price` | Precio unitario neto | número | **Obligatorio** — **neto**, expresado en `PurchaseRequest.currency`. Convención de plataforma: el usuario no elige neto/bruto |
| `tax_code` | Impuesto | enum | **Obligatorio** (default `iva_19`). Valores: `iva_19`, `exempt`, `other`. Permite mezclar líneas afectas y exentas en la misma SOLPED. Catálogo ampliable — pendiente |
| `price_source` | Fuente de precio | ref. `PriceReference` | **Obligatorio** — valor obtenido vía core `getPriceReference` (C9) |

> Totales derivados (UI/servicio): subtotal neto = `quantity × unit_price`; impuesto de línea = subtotal × tasa(`tax_code`); total bruto del documento = suma(neto) + suma(impuestos). El municipio es **consumidor final** (IVA es costo): el precompromiso presupuestario orientativo usa el **total bruto**.

### `Product` *(pendiente)*
**Visibilidad:** — **[PENDIENTE X-94]** — catálogo / base de datos de productos aún sin definición (campos, dueño de módulo, fuente ChileCompra vs. municipal, etc.). La operación de búsqueda prevista es `searchProducts` (`q` = código o palabra). Hasta cerrar X-94, `PurchaseRequestLine.product_code` permanece opcional y el typeahead de 1.1 usa datos demo.

### `PriceReference`
**Visibilidad:** interna — DTO de validación embebido en línea; datos desde core `getPriceReference` (C9 → SII u otra fuente oficial); usada en validación de `createPurchaseRequest`; no cruza borde como entidad independiente

N:1 con `PurchaseRequestLine`. **Nueva — fuente API de precio aún sin definir.**

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `item_code` / `item_description_hash` | Código / huella del ítem | texto | **Obligatorio**. Pendiente definir mecanismo de match |
| `source` | Fuente | enum | **Obligatorio**. Valores: `SII`, `mercado_publico_historico`, `otro` — **pendiente de definir cuál usar** |
| `reference_price` | Precio de referencia | número | **Obligatorio** |
| `reference_date` | Fecha de referencia | fecha | **Obligatorio** |
| `currency` | Moneda | enum | **Obligatorio** (default CLP) |

### `PurchaseRequestApproval`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `approver_id`, `decision`, `disposition`, `decision_date`, `comments`, `signed_document_ref`

1:N con `PurchaseRequest`. Historial de decisiones — permite múltiples ciclos rechazo/reenvío.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `purchase_request_id` | SOLPED | ref. `PurchaseRequest` | **Obligatorio** |
| `approver_id` | Aprobador | ref. `User` | **Obligatorio** |
| `decision` | Decisión | enum | **Obligatorio**. Valores: `approved`, `rejected` |
| `disposition` | Disposición | enum | **Obligatorio si** `decision = rejected`. Valores: `return_to_draft` (vuelve a 1.1), `cancel` (cierra expediente). Default histórico: `return_to_draft`. |
| `decision_date` | Fecha de decisión | fecha | **Obligatorio** (generado por sistema al registrar) |
| `comments` | Comentarios | texto | **Obligatorio si** `decision = rejected` |
| `signed_document_ref` | Solicitud de pedido firmada | ref. `DocumentRef` | **Obligatorio si** `decision = approved`. PDF generado desde plantilla `adq.solped_vb` (Configuraciones → Firmas), firmado con FirmaGob; descargable desde el expediente. |

### `BudgetAvailabilityCertificate` (CDP)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `purchase_request_id`, `certificate_number`, `management_node_id`, `budget_line_id`, `certified_amount`, `fiscal_year`, `verified_by`, `signed_by`, `signed_at`, `status`, `signature_mode`, `proposed_management_node_id`, `proposed_budget_line_id`, `imputation_diverged`

> **Definición provisional en Adquisiciones** hasta documentar el módulo dueño (Presupuestos / Contabilidad / Tesorería). No redefinir en otro archivo mientras exista aquí.

1:1 con `PurchaseRequest` en esta etapa. Certificado de Disponibilidad Presupuestaria emitido y firmado por el aprobador DAF (sub-paso 1.5). La imputación **cuenta × nodo** queda **resuelta en 1.3** (D-6); 1.5 la consume en solo lectura y revalida saldo.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_request_id` | SOLPED | ref. `PurchaseRequest` | **Obligatorio** |
| `certificate_number` | Número de certificado | texto | **Obligatorio** (generado por sistema en modo electrónico; ingreso manual en escaneado) |
| `management_node_id` | Nodo de gestión | ref. `ManagementNode` | **Obligatorio** — hoja resuelta en 1.3 (D-5/D-6) |
| `budget_line_id` | Imputación presupuestaria | ref. `BudgetLine` | **Obligatorio** — cuenta/`DETALLE` resuelta en 1.3 |
| `certified_amount` | Monto certificado | número | **Obligatorio** |
| `fiscal_year` | Año fiscal | número | **Obligatorio** |
| `verified_by` | Verificado por | ref. `User` | **Obligatorio** — formulador DAF (sub-paso 1.3) |
| `signed_by` | Firmado por | ref. `User` | **Obligatorio** — aprobador DAF (sub-paso 1.5) |
| `signed_at` | Fecha de firma | fecha/hora | **Obligatorio** (generado por sistema al firmar) |
| `status` | Estado | enum | **Obligatorio**. Valores: `issued`, `rejected`, `pending_signature` |
| `rejection_reason` | Motivo de rechazo | texto | **Obligatorio si** `status = rejected` |
| `signature_mode` | Modo de firma | enum | **Obligatorio**. Valores: `electronic`, `scanned` |
| `scanned_certificate_attachment` | Certificado escaneado | ref. `DocumentRef` | **Obligatorio si** `signature_mode = scanned` — PDF escaneado vía C10 |
| `proposed_management_node_id` | Nodo propuesto (SOLPED) | ref. `ManagementNode` | **Opcional** — copia de la propuesta al confirmar 1.3 (auditoría) |
| `proposed_budget_line_id` | Imputación propuesta (SOLPED) | ref. `BudgetLine` | **Opcional** — copia de la propuesta al confirmar 1.3 |
| `imputation_diverged` | Divergió de la propuesta | booleano | **Obligatorio** al confirmar 1.3 — `true` si resuelto ≠ propuesto; señal para pre-sugerencia **[PENDIENTE P-23]** |

### `BudgetPreCommitment` (Preobligación / Pre-afectación)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `purchase_request_id`, `budget_availability_certificate_id`, `budget_line_id`, `estimated_amount`, `fiscal_year`, `status`

> **Definición provisional en Adquisiciones** hasta documentar el módulo dueño (Presupuestos / Contabilidad / Tesorería). No redefinir en otro archivo mientras exista aquí.

1:1 con `PurchaseRequest`. **Preobligación** presupuestaria registrada tras CDP vigente (sub-paso 1.6). Los términos *preobligación* y *pre-afectación* son equivalentes en este modelo. La preobligación se contabiliza en el módulo Contabilidad vía borde de módulo (`registerPreObligation`).

> Origen: las fichas `3-resolucion-compra.md` y `4-recepcion-conforme.md` referencian esta entidad como `PreCommitment` — normalizado aquí al nombre canónico `BudgetPreCommitment`.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_request_id` | SOLPED | ref. `PurchaseRequest` | **Obligatorio** |
| `budget_availability_certificate_id` | CDP | ref. `BudgetAvailabilityCertificate` | **Obligatorio** — requiere CDP vigente |
| `budget_line_id` | Imputación presupuestaria | ref. `BudgetLine` | **Obligatorio** |
| `estimated_amount` | Monto estimado | número | **Obligatorio** |
| `fiscal_year` | Año fiscal | número | **Obligatorio** |
| `status` | Estado | enum | **Obligatorio**. Valores: `active`, … |

### `AgileQuoteProcess`
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `deep_link_clicked_at`, `mp_quote_id`

1:1 con `PurchaseRequest`. Puente de trazabilidad SGM↔MP, específico de Compra Ágil — solo campos de trazabilidad, la lógica de negocio de la cotización vive en MP.

> **Vínculo genérico con MP:** el vínculo canónico y genérico con Mercado Público (válido para las 4 modalidades) vive en `ProcurementCase.mp_process_id`. Este `AgileQuoteProcess` se conserva solo como traza específica de Compra Ágil (`deep_link_clicked_at`); su campo `mp_quote_id` **duplica** `ProcurementCase.mp_process_id` y es **candidato a deprecar** tras validar que OpenAPI/fichas CA ya no lo requieren de forma independiente — no eliminar hasta esa evidencia. Ver `contracts.md` (fila `AgileQuoteProcess`).

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_request_id` | SOLPED | ref. `PurchaseRequest` | **Obligatorio** |
| `deep_link_clicked_at` | Clic en deep link | fecha/hora | **Opcional** — traza de uso del deep link |
| `mp_quote_id` | ID cotización MP | texto | **Opcional** hasta sincronización; **Obligatorio si** proceso MP vinculado. Duplica `ProcurementCase.mp_process_id` — ver nota arriba. |

### `PurchaseOrder` (OC)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_request_id`, `mp_oc_id`, `supplier_rut`, `total_amount`, `selection_justification`, `status`, `acceptance_date`

1:N con `ProcurementCase` por reemisiones (rechazo de OC → reemisión a segunda oferta, dentro de Compra Ágil); a lo más una en estado activo. *(Actualizado desde "1:1 con `PurchaseRequest` en Compra Ágil — posible 1:N en otras modalidades"; la ficha `3-resolucion-compra.md` §3.5 hace real el 1:N dentro de la misma modalidad.)*

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_request_id` | SOLPED | ref. `PurchaseRequest` | **Obligatorio** |
| `mp_oc_id` | ID orden de compra MP | texto | **Obligatorio** al registrar OC |
| `supplier_rut` | RUT proveedor | texto | **Obligatorio** |
| `total_amount` | Monto total | número | **Obligatorio** |
| `selection_justification` | Justificación de selección | texto | **Obligatorio si** no se eligió la oferta de menor precio |
| `status` | Estado | enum | **Obligatorio**. Valores: `issued`, `accepted`, `rejected`, `blocked_ineligible`, `rejected_by_supplier`, `pending_mp_sync`, `commitment_pending` |
| `acceptance_date` | Fecha de aceptación | fecha | **Opcional** hasta aceptación; **Obligatorio si** `status = accepted` |
| `supplier_eligibility_check` | Habilidad del proveedor | booleano | **Opcional** (derivado) — resultado de validación de habilidad |
| `cancellation_reason` | Motivo de cancelación | texto | **Obligatorio si** cancelación antes de emitir |
| `fulfillment_status` | Estado de cumplimiento | enum | **Opcional** (derivado). Valores: `pending`, `partially_received`, `fully_received` |

### `BudgetCommitment` (Compromiso Cierto / Obligación)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `budget_pre_commitment_id`, `committed_amount`, `commitment_date`, `source`

> **Definición provisional en Adquisiciones** hasta documentar el módulo dueño (Presupuestos / Contabilidad / Tesorería). No redefinir en otro archivo mientras exista aquí.

1:1 con `PurchaseOrder` y con `BudgetPreCommitment`. Hito contable crítico — cierre del ciclo de pre-afectación.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_order_id` | Orden de compra | ref. `PurchaseOrder` | **Obligatorio** |
| `budget_pre_commitment_id` | Preobligación | ref. `BudgetPreCommitment` | **Obligatorio** |
| `committed_amount` | Monto comprometido | número | **Obligatorio** |
| `commitment_date` | Fecha de compromiso | fecha | **Obligatorio** (generado por sistema) |
| `source` | Fuente | enum | **Obligatorio**. Valores: `api_sync`, … |

### `GoodsReceipt` (Recepción Conforme)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `received_by`, `received_date`, `receipt_type`, `receiving_unit`, `status`, `observations`

1:N con `PurchaseOrder` — N recepciones por OC (entregas parciales, períodos recurrentes); cubre bienes y servicios vía `receipt_type`. Cada recepción referencia las líneas y cantidades que cubre (ver `GoodsReceiptLine`). Fusionado con la definición de la ficha `4-recepcion-conforme.md` §4.1/§4.2.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_order_id` | Orden de compra | ref. `PurchaseOrder` | **Obligatorio** |
| `receipt_type` | Tipo de recepción | enum | **Obligatorio**. Valores: `physical_good` \| `service` |
| `received_by` | Recibido por | ref. `User` | **Obligatorio** |
| `receiving_unit` | Unidad receptora | ref. `OrganizationalUnit` | **Obligatorio** |
| `received_date` | Fecha de recepción | fecha | **Obligatorio** |
| `service_period_start` / `service_period_end` | Período del servicio | fecha | **Obligatorio si** `receipt_type = service` recurrente |
| `supporting_document_ref` | Documento de respaldo | ref. `DocumentRef` | **Obligatorio si** `receipt_type = service` — almacenado vía C10 |
| `status` | Estado | enum | **Obligatorio**. Valores: `draft`, `confirmed`, `rejected`, `partially_rejected` |
| `observations` | Observaciones | texto | **Obligatorio si** `status` indica rechazo total o parcial |
| `confirmed_by` | Confirmado por | ref. `User` | **Obligatorio si** `status = confirmed` — regla SoD |
| `confirmed_at` | Fecha de confirmación | fecha/hora | **Obligatorio si** `status = confirmed` |
| `accrual_ref` | Devengado | ref. `Accrual` | **Opcional** hasta devengado registrado |

> `received_quantity` se retira del encabezado de `GoodsReceipt` (antes marcado "por línea", inconsistente con un campo a nivel de cabecera) — la cantidad ahora vive exclusivamente en `GoodsReceiptLine`.

### `GoodsReceiptLine`
**Visibilidad:** interna — candidata a exposición si se confirma trazabilidad por ítem

1:N con `GoodsReceipt`. **Confirmada** (antes *sugerida, no confirmada en fuente*) — la ficha `4-recepcion-conforme.md` §4.1 la trae con tabla de campos completa, se promueve a definición confirmada.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `goods_receipt_id` | Recepción conforme | ref. `GoodsReceipt` | **Obligatorio** |
| `purchase_order_line_ref` | Línea de OC | ref. línea de `PurchaseOrder` | **Obligatorio** |
| `quantity_ordered` | Cantidad ordenada | número | **Obligatorio** |
| `quantity_received` | Cantidad recibida | número | **Obligatorio** |
| `quantity_accepted` | Cantidad aceptada | número | **Obligatorio** |
| `quantity_rejected` | Cantidad rechazada | número | **Obligatorio** |
| `rejection_reason` | Motivo de rechazo | texto | **Obligatorio si** `quantity_rejected > 0` |
| `inventory_entry_ref` | Entrada de inventario | ref. externa | **Opcional** — referencia al proveedor de inventario, si existe |

### `ThreeWayMatch` (Cruce de 3 vías)
**Visibilidad:** expuesta — campos en contrato: `id`, `purchase_order_id`, `goods_receipt_id`, `invoice_id`, `match_status`, `match_date`

1:1:1 con `PurchaseOrder`, `GoodsReceipt`, `Invoice`. Punto de control crítico — sin regla de tolerancia de discrepancia definida (ya identificado como control interno crítico en la ficha QA, ítems P1).

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `purchase_order_id` | Orden de compra | ref. `PurchaseOrder` | **Obligatorio** |
| `goods_receipt_id` | Recepción conforme | ref. `GoodsReceipt` | **Obligatorio** |
| `invoice_id` | Factura | ref. `Invoice` (fuente SII) | **Obligatorio** al ejecutar match |
| `match_status` | Estado del cruce | enum | **Obligatorio**. Valores: `matched`, `discrepancy` |
| `match_date` | Fecha del cruce | fecha | **Obligatorio** (generado por sistema al ejecutar match) |

### `Accrual` (Devengado)
**Visibilidad:** expuesta — campos en contrato: `id`, `three_way_match_id`, `budget_commitment_id`, `accrual_amount`, `accrual_date`

> **Definición provisional en Adquisiciones** hasta documentar el módulo dueño (Presupuestos / Contabilidad / Tesorería). No redefinir en otro archivo mientras exista aquí.

1:1 con `ThreeWayMatch` y `BudgetCommitment`. Cierra el ciclo presupuestario.

> Origen: la ficha `4-recepcion-conforme.md` §4.4 referencia esta entidad como `AccrualRecord` — normalizado aquí al nombre canónico `Accrual`.
>
> <!-- REVISAR: momento del devengado — el flujo canónico encadena `ThreeWayMatch` (OC + Recepción + Factura) → `Accrual` 1:1 (ver `procesos-transversales/5-pago.md` §5.1-5.2); la ficha `4-recepcion-conforme.md` §4.4 gatilla el devengado desde la conformidad de recepción (devengados parciales por valor aceptado, vía `recordAccrual`), dejando el circuito de factura en la frontera con Tesorería. Son dos definiciones distintas del momento contable del devengado — **[PENDIENTE X-46]**, prioridad alta, definir con Contabilidad/DM. No resuelto aquí. -->

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `three_way_match_id` | Cruce de 3 vías | ref. `ThreeWayMatch` | **Obligatorio** |
| `budget_commitment_id` | Compromiso cierto | ref. `BudgetCommitment` | **Obligatorio** |
| `accrual_amount` | Monto devengado | número | **Obligatorio** |
| `accrual_date` | Fecha de devengo | fecha | **Obligatorio** |

### `PaymentDecree` (Decreto de Pago)
**Visibilidad:** expuesta — campos en contrato: `id`, `accrual_id`, `decree_number`, `external_folio`, `decree_date`, `approver_id`, `status`

> **Definición provisional en Adquisiciones** hasta documentar el módulo dueño (Presupuestos / Contabilidad / Tesorería). No redefinir en otro archivo mientras exista aquí.

1:1 con `Accrual`. **Tramitación DocDigital (C11)** — decisión [`2026-07-docdigital-tramitacion-documental.md`](../arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md). Alcance operativo del decreto de pago abierto — **[PENDIENTE X-74]**.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `accrual_id` | Devengado | ref. `Accrual` | **Obligatorio** |
| `decree_number` | Número de decreto (interno) | texto | **Obligatorio** — identificador **interno de trazabilidad**; no sustituye al folio oficial |
| `external_folio` | Folio oficial externo | texto | **Obligatorio si** tramitado en DocDigital y `status = signed` — folio oficial externo |
| `document_procedure_id` | Trámite documental | ref. `DocumentProcedure` | **Obligatorio si** enviado a tramitación |
| `decree_date` | Fecha del decreto | fecha | **Obligatorio** |
| `approver_id` | Aprobador | ref. `User` | **Obligatorio** |
| `status` | Estado | enum | **Obligatorio**. Valores: `pending_signature`, `signed`, `failed` *(salida de `pending_signature` solo con retorno del acto firmado)* |
| `document_ref` | Documento | ref. `DocumentRef` | **Obligatorio si** `status = signed` — vía C10 |

### `Payment` (Pago)
**Visibilidad:** expuesta — campos en contrato: `id`, `payment_decree_id`, `payment_date`, `payment_method`, `payment_status`

> **Definición provisional en Adquisiciones** hasta documentar el módulo dueño (Presupuestos / Contabilidad / Tesorería). No redefinir en otro archivo mientras exista aquí.

1:1 con `PaymentDecree`. Falta definir manejo de vencimiento de plazo legal (30 días corridos desde factura).

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `payment_decree_id` | Decreto de pago | ref. `PaymentDecree` | **Obligatorio** |
| `payment_date` | Fecha de pago | fecha | **Obligatorio** |
| `payment_method` | Medio de pago | enum | **Obligatorio** |
| `payment_status` | Estado del pago | enum | **Obligatorio**. Valores: `completed`, `failed` |

### `ModalityDecision`
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `selected_modality`, `ratified`, `decided_by`, `decided_at`

1:N con `ProcurementCase` (N por reversiones). Decisión de ratificación/selección de modalidad de compra (gateway de validación V1-V8), con resultados de validación y parámetros normativos aplicados congelados para auditoría retrospectiva. Origen: ficha `2-modalidad-compra.md` §2.1.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio** |
| `selected_modality` | Modalidad seleccionada | enum | **Obligatorio** |
| `ratified` | Ratificada | booleano | **Obligatorio** |
| `catalog_bypass_justification` | Justificación bypass catálogo | texto | **Obligatorio si** aplica regla V2 y se elige otra modalidad |
| `direct_procurement_cause` | Causal de trato directo | ref. catálogo de causales | **Obligatorio si** `selected_modality = direct_procurement` — **[PENDIENTE X-36]** |
| `validation_results` | Resultados de validación | JSON | **Obligatorio** (generado por sistema al confirmar) |
| `requires_jefatura_approval` | Requiere aprobación de jefatura | booleano | **Opcional** — decisión operativa en 2.1; **[PENDIENTE X-38]** |
| `decided_by` | Decidido por | ref. `User` | **Obligatorio** |
| `decided_at` | Fecha de decisión | fecha | **Obligatorio** (generado por sistema al confirmar) |

### `ModalityDecisionApproval` *(sugerida, no confirmada en fuente)*
**Visibilidad:** expuesta — campos en contrato: `id`, `modality_decision_id`, `approver_id`, `decision`, `decision_date`

1:1 con `ModalityDecision`. Aprobación de jefatura sobre la decisión de modalidad, previa a la vinculación con Mercado Público. **Existencia, alcance y exigencia de firma pendientes de ratificar con la DM** — **[PENDIENTE X-38]**. Origen: ficha `2-modalidad-compra.md` §2.2.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `modality_decision_id` | Decisión de modalidad | ref. `ModalityDecision` | **Obligatorio** |
| `approver_id` | Aprobador | ref. `User` | **Obligatorio** |
| `decision` | Decisión | enum | **Obligatorio**. Valores: `approved`, `rejected` |
| `comments` | Comentarios | texto | **Obligatorio si** `decision = rejected` |
| `decision_date` | Fecha de decisión | fecha | **Obligatorio** (generado por sistema al registrar) |

### Parámetros normativos y UTM (plataforma)

`NormativeParameter` y el DTO `UtmValue` **no se definen aquí** — viven en [`entidades-plataforma.md`](entidades-plataforma.md). Adquisiciones los consume en el gateway de modalidad (ficha `2-modalidad-compra.md` §2.1) vía `getNormativeParameter` / `getUtmValue` (C9).

### `MpProcessSnapshot` *(sugerida, no confirmada en fuente)*
**Visibilidad:** interna — bitácora producida por servicio C7 del core; ver [`entidades-plataforma.md`](entidades-plataforma.md)

1:N con `ProcurementCase`. Bitácora de sincronización de estado con Mercado Público, común a toda la etapa 3 (período de cotización, cierre/selección, emisión/aceptación/rechazo de OC, desierto/fallido) — agnóstica de si el mecanismo de origen es push o polling. Origen: ficha `1. compra-agil/3-resolucion-compra.md` §3.1; reutilizada íntegramente por Convenio Marco (ficha `2. convenio-marco/3-resolucion-compra-convenio-marco v2.md` §3.4).

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio** |
| `mp_status` | Estado MP | texto | **Obligatorio** |
| `data` | Datos | JSON | **Obligatorio** |
| `read_at` | Fecha de lectura | fecha/hora | **Obligatorio** (generado por sistema) |
| `source` | Fuente | enum | **Obligatorio**. Valores: `push`, `polling` |

### `QuotationResult` *(sugerida, no confirmada en fuente)*
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `selected_provider_rut`, `selected_provider_name`, `offered_amount`, `lowest_price_selected`, `recorded_at`

1:N con `ProcurementCase`. Resultado de la selección de oferta al cierre del período de cotización; **solo se crea por sync** desde lectura MP (plantilla §5.3 — sin transcripción manual). Origen: ficha `1. compra-agil/3-resolucion-compra.md` §3.2; reutilizada íntegramente por Convenio Marco (ficha `2. convenio-marco/3-resolucion-compra-convenio-marco v2.md` §3.5, ruta `gran_compra`).

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio** |
| `selected_provider_rut` | RUT proveedor seleccionado | texto | **Obligatorio** |
| `selected_provider_name` | Nombre proveedor seleccionado | texto | **Obligatorio** |
| `offered_amount` | Monto ofertado | número | **Obligatorio** |
| `lowest_price_selected` | Menor precio seleccionado | booleano | **Obligatorio** |
| `recorded_at` | Fecha de registro | fecha/hora | **Obligatorio** (generado por sistema) |

### `ReceiptRejectionCase` *(sugerida, no confirmada en fuente)*
**Visibilidad:** expuesta — campos en contrato: `id`, `goods_receipt_id`, `resolution_type`, `resolution_deadline`, `resolved_at`, `outcome`

1:N con `GoodsReceipt`. Gestión trazable del rechazo (total o parcial) de una recepción: devolución, reposición/corrección, o incumplimiento. Origen: ficha `4-recepcion-conforme.md` §4.5.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `goods_receipt_id` | Recepción conforme | ref. `GoodsReceipt` | **Obligatorio** |
| `goods_receipt_lines` | Líneas de recepción | ref. `GoodsReceiptLine[]` | **Obligatorio** |
| `resolution_type` | Tipo de resolución | enum | **Obligatorio**. Valores: `return`, `replacement`, `penalty`, `claim` |
| `resolution_deadline` | Plazo de resolución | fecha | **Obligatorio** |
| `resolved_at` | Fecha de resolución | fecha | **Opcional** hasta resolución |
| `outcome` | Resultado | texto | **Obligatorio si** `resolved_at` presente |

### `TenderBases` (Bases de Licitación)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `status`, `technical_bases_ref`, `administrative_bases_ref`, `requires_bid_bond`, `requires_performance_bond`

1:1 con `ProcurementCase` (una versión vigente por proceso; versiona con cada reenvío a revisión). Específica de Licitación Pública. Origen: ficha `3. licitacion-publica/3-resolucion-compra.md` §3.1.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `status` | Estado | enum | **Obligatorio**. Valores: `draft`, `legal_review`, `approved` |
| `technical_bases_ref` | Bases técnicas | ref. `DocumentRef` | **Obligatorio** — almacenado vía C10 |
| `administrative_bases_ref` | Bases administrativas | ref. `DocumentRef` | **Obligatorio** — almacenado vía C10 |
| `requires_bid_bond` | Exige garantía de seriedad | booleano | **Obligatorio** — exige Garantía de Seriedad |
| `bid_bond_min_amount` | Monto mínimo garantía de seriedad | número | **Obligatorio si** `requires_bid_bond = true` |
| `requires_performance_bond` | Exige garantía de fiel cumplimiento | booleano | **Obligatorio** — exige Garantía de Fiel Cumplimiento |
| `performance_bond_min_amount` | Monto mínimo garantía de fiel cumplimiento | número | **Obligatorio si** `requires_performance_bond = true` |
| `version` | Versión | número | **Obligatorio** (generado por sistema) — incrementa en cada reenvío a `draft` tras observaciones |

### `EvaluationCriterion`
**Visibilidad:** expuesta — campos en contrato: `id`, `tender_bases_id`, `name`, `weight_percent`, `scoring_rule`

1:N con `TenderBases`. La suma de `weight_percent` de todos los criterios de una `TenderBases` debe ser 100 — validación bloqueante `CRITERIA_WEIGHTS_INVALID`. `EvaluationScore` puntúa contra estos criterios. Origen: ficha LP §3.1.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `tender_bases_id` | Bases de licitación | ref. `TenderBases` | **Obligatorio** |
| `name` | Nombre | texto | **Obligatorio** |
| `weight_percent` | Ponderación (%) | número | **Obligatorio** — suma de todos los criterios de la misma `TenderBases` = 100 |
| `scoring_rule` | Regla de puntuación | texto | **Obligatorio** — método de puntuación (ej. escala, fórmula) |

### `LegalReview` (Revisión Jurídica)
**Visibilidad:** expuesta — campos en contrato: `id`, `subject_type`, `subject_id`, `reviewer_id`, `outcome`, `observations`, `reviewed_at`

**Transversal** — polimórfica (`subject_type`/`subject_id`): revisión de `TenderBases` (LP §3.2), de la Resolución de Adjudicación (LP §3.10, sobre `AdministrativeAct`), y candidata para la Resolución Fundada de Trato Directo. Origen: ficha LP §3.2.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `subject_type` | Tipo de sujeto | enum | **Obligatorio**. Valores: `tender_bases`, `administrative_act` |
| `subject_id` | Sujeto | ref. polimórfica | **Obligatorio** — apunta a `TenderBases.id` o `AdministrativeAct.id` según `subject_type` |
| `reviewer_id` | Revisor | ref. `User` | **Obligatorio** |
| `outcome` | Resultado | enum | **Obligatorio**. Valores: `approved`, `observations` |
| `observations` | Observaciones | texto | **Obligatorio si** `outcome = observations` |
| `reviewed_at` | Fecha de revisión | fecha/hora | **Obligatorio** (generado por sistema al registrar) |

### `AdministrativeAct` (Acto Administrativo)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `act_type`, `subject_id`, `act_number`, `external_folio`, `signed_by`, `signed_at`, `status`

**Transversal** — polimórfica por `act_type`, cubre decretos/resoluciones de aprobación de bases (3.3), designación de comisión (3.9a), adjudicación/deserción/revocación (3.10), Resolución Fundada (TD). Generaliza el patrón de `PaymentDecree`. **Tramitación:** DocDigital (C11) — SGM origina el contenido; DocDigital visa, firma (FEA), enumera y distribuye. Decisión canónica: [`arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md`](../arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md). Contrato funcional: [`integracion-docdigital.md`](../arquitectura/especificacion/integracion-docdigital.md).

<!-- REVISAR: `AdministrativeAct` generaliza el patrón de `PaymentDecree` — candidata a absorberlo a futuro. No fusionar ahora; ambas entidades coexisten hasta validación explícita. -->

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio** en Adquisiciones. Desnormalización intencional. Otros módulos pueden usar sujeto propio sin este campo o con ref. polimórfica de expediente — **extender en F4 de cada módulo** |
| `act_type` | Tipo de acto | enum | **Obligatorio**. Valores actuales Adq.: `bases_approval`, `committee_designation`, `award`, `desertion`, `revocation`, `founded_resolution`. Extensibles a decretos presupuestarios/contables según inventario DocDigital |
| `subject_id` | Sujeto | ref. polimórfica | **Opcional** — entidad sobre la que recae el acto (ej. `TenderBases.id`), según `act_type` |
| `act_number` | Número de acto (interno) | texto | **Obligatorio** — identificador **interno de trazabilidad** (no es el folio oficial del acto) |
| `external_folio` | Folio oficial externo | texto | **Obligatorio si** tramitado en DocDigital y `status = signed` — folio oficial asignado por la plataforma externa. En vía alternativa sin DocDigital, ver **[PENDIENTE X-73]** |
| `document_procedure_id` | Trámite documental | ref. `DocumentProcedure` | **Obligatorio si** enviado a tramitación — ver entidades de plataforma |
| `signature_chain_id` | Cadena de firmas | ref. `SignatureChain` | **Opcional** — cadena de firmantes configurada por el municipio (proceso 25) |
| `status` | Estado | enum | **Obligatorio**. Valores: `pending_signature`, `signed`, `failed`. Salida de `pending_signature` solo con retorno del acto firmado (evento `AdministrativeActSigned`) |
| `signed_by` | Firmado por | ref. `User` | **Obligatorio si** `status = signed` — último firmante o autoridad que perfecciona (detalle de cadena en `DocumentProcedure`) |
| `signed_at` | Fecha de firma | fecha/hora | **Obligatorio si** `status = signed` (generado por sistema al confirmar retorno) |
| `document_ref` | Documento | ref. `DocumentRef` | **Obligatorio si** `status = signed` — vía C10 |

### `ComptrollerReview` (Toma de Razón)
**Visibilidad:** expuesta — campos en contrato: `id`, `administrative_act_id`, `submitted_at`, `outcome`, `outcome_at`, `official_document_ref`

**Transversal — reutilizable en Trato Directo** (mismo trámite para su Resolución Fundada). Sin integración API asumida con Contraloría: registro manual del envío y del resultado. Origen: ficha LP §3.4 (reutilizada en §3.11).

> ⚠ Pendiente: explorar si existe canal de consulta de estado de trámites CGR integrable; no asumir su existencia — **[PENDIENTE X-64]**.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `administrative_act_id` | Acto administrativo | ref. `AdministrativeAct` | **Obligatorio** |
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `submitted_at` | Fecha de remisión | fecha | **Obligatorio** — fecha de remisión a Contraloría |
| `outcome` | Resultado | enum | **Obligatorio si** resuelto. Valores: `approved`, `approved_with_remarks`, `rejected` |
| `outcome_at` | Fecha de resultado | fecha | **Obligatorio si** `outcome` presente — fecha del pronunciamiento CGR (ingreso manual; no auto-generada) |
| `official_document_ref` | Oficio de respuesta | ref. `DocumentRef` | **Obligatorio si** `outcome` presente — PDF/imagen del oficio CGR, subida vía `storeDocument` (C10) |

### `Guarantee` (Garantía)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `guarantee_type`, `provider_rut`, `instrument_type`, `amount`, `expiry_date`, `status`

**Transversal** — Garantía de Seriedad de la Oferta (LP §3.7) y Garantía de Fiel Cumplimiento (LP §3.12) comparten esta entidad, distinguidas por `guarantee_type`. Custodia en Tesorería — borde de módulo.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio**. Desnormalización intencional |
| `guarantee_type` | Tipo de garantía | enum | **Obligatorio**. Valores: `bid_bond`, `performance_bond` |
| `provider_rut` | RUT proveedor | texto | **Obligatorio** |
| `instrument_type` | Tipo de instrumento | enum | **Obligatorio** — vale vista, boleta, póliza, certificado de fianza |
| `amount` | Monto | número | **Obligatorio** |
| `expiry_date` | Fecha de vencimiento | fecha | **Obligatorio** |
| `status` | Estado | enum | **Obligatorio**. Valores: `in_custody`, `returned`, `executed` |
| `document_ref` | Documento | ref. `DocumentRef` | **Obligatorio** — vía C10 |

### `EvaluationCommittee` (Comisión Evaluadora)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `designation_act_id`, `status`

1:1 con `ProcurementCase` — condicional, obligatoria sobre umbral `NormativeParameter`; bajo él, evaluación por funcionario responsable con el mismo registro estructurado (sin `EvaluationCommittee` formal). Origen: ficha LP §3.9.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio** |
| `designation_act_id` | Acto de designación | ref. `AdministrativeAct` | **Obligatorio** — `act_type = committee_designation` |
| `status` | Estado | enum | **Obligatorio**. Valores: `designated`, `active`, `closed` |

### `CommitteeMember` (Integrante de Comisión)
**Visibilidad:** interna — detalle de `EvaluationCommittee`; expuesta agregada vía `EvaluationReport`

1:N con `EvaluationCommittee`. La declaración de ausencia de conflictos de interés es **bloqueante**: sin ella el integrante no está habilitado a evaluar. Origen: ficha LP §3.9.

> Regla SoD propuesta: los integrantes no pueden ser el requirente de la SOLPED ni quien elaboró las bases técnicas — alcance exacto de las inhabilidades **[PENDIENTE X-66]**, validar con jurídica.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `evaluation_committee_id` | Comisión evaluadora | ref. `EvaluationCommittee` | **Obligatorio** |
| `user_id` | Usuario | ref. `User` | **Obligatorio** |
| `conflict_declaration_ref` | Declaración de conflictos | ref. `DocumentRef` | **Obligatorio** — bloqueante; sin ella el integrante no habilita a evaluar |
| `conflict_declared_at` | Fecha de declaración | fecha/hora | **Obligatorio** (generado por sistema al registrar) |
| `replaced_by_member_id` | Reemplazado por | ref. `CommitteeMember` | **Opcional** — reemplazo por conflicto sobreviniente, trazado vía acto modificatorio |

### `OfferRecord` (Oferta)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `provider_rut`, `provider_name`, `offered_amount`, `admissibility_status`, `entry_mode`

1:N con `ProcurementCase` — una por oferente. Espejo mínimo de cada oferta recibida en MP (el detalle completo de la oferta se gestiona en MP; SGM solo traza lo necesario para admisibilidad y evaluación). Origen: ficha LP §3.9.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio** |
| `provider_rut` | RUT proveedor | texto | **Obligatorio** |
| `provider_name` | Nombre proveedor | texto | **Obligatorio** |
| `offered_amount` | Monto ofertado | número | **Obligatorio** |
| `admissibility_status` | Admisibilidad | enum | **Obligatorio**. Valores: `admissible`, `inadmissible` |
| `inadmissibility_cause` | Causa de inadmisibilidad | texto | **Obligatorio si** `admissibility_status = inadmissible` |
| `entry_mode` | Modo de ingreso | enum | **Obligatorio**. Valores: `mp_read`, `manual` |

### `EvaluationScore` (Puntaje de Evaluación)
**Visibilidad:** interna — detalle de evaluación; expuesta agregada vía `EvaluationReport`

1:N con `OfferRecord` y con `EvaluationCriterion`. El sistema calcula el total por oferta y bloquea actas cuyos puntajes no cuadren con los pesos declarados en `EvaluationCriterion` — validación `SCORES_INCONSISTENT_WITH_CRITERIA`. Origen: ficha LP §3.9.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `offer_id` | Oferta | ref. `OfferRecord` | **Obligatorio** |
| `criterion_id` | Criterio | ref. `EvaluationCriterion` | **Obligatorio** |
| `score` | Puntaje | número | **Obligatorio** |
| `rationale` | Fundamento | texto | **Obligatorio** |

### `EvaluationReport` (Acta de Evaluación)
**Visibilidad:** expuesta — campos en contrato: `id`, `evaluation_committee_id`, `ranking`, `proposed_award_offer_id`, `status`, `signed_at`

1:1 con `EvaluationCommittee`. Acta con ranking y propuesta de adjudicación, firmada por los integrantes. Bloqueada mientras existan `EvaluationScore` inconsistentes con los pesos de `EvaluationCriterion` (`SCORES_INCONSISTENT_WITH_CRITERIA`). Origen: ficha LP §3.9.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `evaluation_committee_id` | Comisión evaluadora | ref. `EvaluationCommittee` | **Obligatorio** |
| `ranking` | Ranking | JSON | **Obligatorio** (generado por sistema) — deriva de `EvaluationScore` agregados por oferta |
| `proposed_award_offer_id` | Oferta propuesta a adjudicación | ref. `OfferRecord` | **Obligatorio** |
| `status` | Estado | enum | **Obligatorio**. Valores: `draft`, `signed` — bloqueado en `draft` si hay inconsistencia de puntajes |
| `signed_by` | Firmado por | ref. `User[]` | **Obligatorio si** `status = signed` — integrantes firmantes |
| `signed_at` | Fecha de firma | fecha/hora | **Obligatorio si** `status = signed` |

### `Contract` (Contrato)
**Visibilidad:** expuesta — campos en contrato: `id`, `procurement_case_id`, `awarded_offer_ref`, `amount`, `start_date`, `end_date`, `status`

1:1 con `ProcurementCase` — condicional (obligatorio sobre umbral `NormativeParameter` o cuando las bases lo establecen; bajo él, la OC puede formalizar el contrato). Origen: ficha LP §3.13.

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `procurement_case_id` | Expediente de compra | ref. `ProcurementCase` | **Obligatorio** |
| `awarded_offer_ref` | Oferta adjudicada | ref. `OfferRecord` | **Obligatorio** |
| `administrative_act_id` | Acto administrativo | ref. `AdministrativeAct` | **Obligatorio** — acto aprobatorio del contrato |
| `amount` | Monto | número | **Obligatorio** |
| `start_date` | Fecha de inicio | fecha | **Obligatorio** |
| `end_date` | Fecha de término | fecha | **Obligatorio** |
| `document_ref` | Documento | ref. `DocumentRef` | **Obligatorio** — vía C10 |
| `contractor_signature_mode` | Modo de firma del contratista | enum | **Obligatorio**. Mecanismo de firma del contratista **[PENDIENTE X-67]** — valores candidatos: `fea_propia`, `firma_papel_digitalizada`, `plataforma_externa` |
| `status` | Estado | enum | **Obligatorio**. Valores: `draft`, `signed`, `not_subscribed` |

---
