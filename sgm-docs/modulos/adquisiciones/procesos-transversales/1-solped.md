# 1. SOLPED

*Proceso transversal — documentado en el piloto [Compra Ágil](../1.%20compra-agil/overview.md). Aplica conceptualmente a las 4 modalidades; extensión a otras modalidades pendiente de validación del piloto.*

*Entrada al módulo (listado / nuevo expediente):* [`0-consulta-expedientes.md`](./0-consulta-expedientes.md).

*Roles de la fila **Rol:** nombre (usuarios) + código (sistema) según el catálogo transversal [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md) (P-24).*

## 1.0 — Verificación previa (Inventario / catálogo CM)

| Materia | Valor |
|---|---|
| Unidad municipal | Unidad Solicitante |
| Rol | Solicitante ([`adq.solicitante`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | **Verdadero** — se omite si el tenant no tiene inventario utilizable (interno ni externo) **y** no tiene catálogo Convenio Marco integrado vía ChileCompra |

**Detalle:** Antes de crear la SOLPED, el solicitante puede buscar el bien/servicio para saber si ya existe en **bodegas municipales** (Inventario interno o sistemas externos adaptados al mismo contrato) o en el **catálogo de Convenio Marco** (espejo ChileCompra). Si hay stock en bodega, el camino feliz **no** es un expediente de compra sino una **solicitud a bodega** (proceso enunciado; alcance Bodega/Inventario pendiente **[P-44]**). Si no hay stock pero el ítem aparece en catálogo CM, el sistema informa el hallazgo y pide confirmación para generar el expediente de compra; en 1.1 se muestra una advertencia no bloqueante sobre la modalidad sugerida. Si el paso está omitido (sin capacidades), “Nuevo expediente” conduce directo a 1.1.

**Condiciones de habilitación:**

| Capacidad | Efecto en 1.0 |
|---|---|
| Inventario (interno o externo) vía `checkStockAvailability` | Paso visible; banda de resultados de stock |
| Catálogo CM espejado (`checkCatalogAvailability`, sync ChileCompra) | Paso visible; banda CM (puede coexistir con Inventario) |
| Ninguna de las anteriores | **Paso omitido** — creación → 1.1 |

**Entidad(es) y campos:** no crea entidades de dominio de Adquisiciones. Solo consulta dependencias; el contexto de búsqueda/CM puede pasar a 1.1 como pista de UI (no persistida como entidad propia en v1).

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia *(propuesta, QA ítem 4 / P-44)* | `checkStockAvailability` | Inventario (interno o externo vía adaptador) | Síncrona *(asesora)* | Entrada: texto / `item_code`, `quantity` (opcional) — Respuesta: `available_quantity`, `warehouse_label`, `suggested_action` (`use_stock` \| `continue_purchase`) |
| 2 | Dependencia *(condicional a integración catálogo ChileCompra)* | `checkCatalogAvailability` | Catálogo CM espejado (Core / MP) | Cacheada (frescura diaria) | Entrada: descripción / `item_code`, `region` — Respuesta: `available`, `catalog_price`, `provider_count`, `agreement_id` / etiqueta convenio |

**Validaciones:** Sin validaciones de formulario — solo consultas asesoras (`checkStockAvailability`, `checkCatalogAvailability`); no hay operación de escritura que avance el expediente.

**Edge cases:**
- Sin Inventario ni catálogo CM → sub-paso omitido; no hay pantalla 1.0.
- Hit en stock → CTA principal hacia solicitud a bodega (proceso TBD); continuar compra es vía secundaria asesora y auditable.
- Hit solo en CM → confirmación para crear expediente; en 1.1 advertencia no bloqueante en `purchase_modality` (sugerencia `framework_agreement`). La validación bloqueante V2 permanece en 2.1.
- Proveedor Inventario caído con catálogo CM activo → se muestra solo banda CM (o mensaje de degradación en banda stock).
- Catálogo CM no integrado → 1.0 solo si hay Inventario; sin Inventario, omitido.
- Solicitud a bodega aún no especificada → UI enunciada; no bloquea el diseño de Adquisiciones (**P-44**).

> ⚠ **Pendiente:** proceso de solicitud a bodega; decisión de bases Inventario/Activo Fijo (**P-44**); disponibilidad real del sync diferencial de catálogo CM con ChileCompra.

**Wireframe / prototipo:** [`../wireframes/10-verificacion-previa.md`](../wireframes/10-verificacion-previa.md)

---

## 1.1 — Creación de solicitud

| Materia | Valor |
|---|---|
| Unidad municipal | Unidad Solicitante |
| Rol | Solicitante ([`adq.solicitante`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** La Unidad Solicitante crea la SOLPED en el SGM. Puede indicar opcionalmente la **modalidad de compra** prevista (`purchase_modality`): Compra Ágil, Convenio Marco, Licitación Pública o Trato Directo. Es una indicación provisional — puede confirmarse o cambiarse al inicio de la etapa 2 (Modalidad de Compra). Si se selecciona Trato Directo, es obligatorio adjuntar la **Resolución Fundada** (`founded_resolution_attachment`). La SOLPED declara una **moneda de documento** (`currency`: CLP, UF, UTM o USD; default CLP); todas las líneas se expresan en esa moneda (no se mezclan monedas en una misma solicitud). Si la moneda no es CLP, la UI muestra el total bruto convertido a CLP con tasa referencial del día (orientativa). El **precio se ingresa siempre neto**; cada línea lleva un **código de impuesto** (`tax_code`: IVA 19% por defecto, Exento u Otro) y el sistema calcula subtotal neto, impuestos y total bruto. El municipio es consumidor final (IVA es costo): la autoconsulta y el precompromiso orientativo usan el **total bruto**. Además puede adjuntar **documentos de respaldo** opcionales (`PurchaseRequestAttachment`): cotizaciones, fotos referenciales del producto, fichas técnicas u otros antecedentes, cada uno con tipo, descripción y archivo (`document_ref` vía `storeDocument` del core).

**Autoconsulta de saldo presupuestario (informativa):** si el usuario conoce la línea presupuestaria de destino, el formulario ofrece un **enlace informativo** («Consultar saldo en línea presupuestaria») que abre un panel lateral o modal. Allí puede indicar `budget_line_id`, año fiscal y —opcionalmente— el monto estimado de la SOLPED (**total bruto en equivalente CLP**) para obtener una **vista previa de saldo** vía `previewBudgetAvailability` (Presupuestos). Es **solo lectura**: no registra verificación, no avanza el flujo y **no sustituye** el sub-paso 1.3. El solicitante puede guardar la línea indicada como pista en `proposed_budget_line_id` (opcional) para prellenar la consulta y mostrarla al aprobador en 1.2.

**Entidad(es) y campos:**
- `PurchaseRequest` — `requesting_unit` (ref., **obligatorio**), `description` (texto, **obligatorio**), `justification` (texto, **obligatorio**), `requested_date` (fecha, **obligatorio**), `purchase_modality` (enum, **opcional**: `agile_purchase` \| `framework_agreement` \| `public_tender` \| `direct_procurement`), `founded_resolution_attachment` (`DocumentRef`, **obligatorio si** `purchase_modality = direct_procurement` — subida previa vía `storeDocument` del core), `currency` (enum, **obligatorio**, default `CLP`: `CLP` \| `UF` \| `UTM` \| `USD`), `proposed_budget_line_id` (ref. `BudgetLine`, **opcional**), `proposed_fiscal_year` (número, **opcional**), `status` (enum, **obligatorio**: `draft`)
- `PurchaseRequestLine` (1 SOLPED → N líneas, ≥1) — `item_description` (texto, **obligatorio**), `quantity` (número, **obligatorio**), `unit_of_measure` (ref., **obligatorio**), `unit_price` (número, **obligatorio**, **neto**, en `PurchaseRequest.currency`), `tax_code` (enum, **obligatorio**, default `iva_19`: `iva_19` \| `exempt` \| `other`), `price_source` (ref. `PriceReference`, **obligatorio**)
- `PurchaseRequestAttachment` (1 SOLPED → 0..N, **opcional**) — `attachment_type` (enum, **obligatorio**: `quote` \| `product_reference_photo` \| `technical_sheet` \| `other`), `description` (texto, **obligatorio**), `document_ref` (`DocumentRef`, **obligatorio** — vía `storeDocument` del core)
- `PriceReference` — `item_code` / `item_description_hash` (texto, **obligatorio**), `source` (enum, **obligatorio**), `reference_price` (número, **obligatorio**), `reference_date` (fecha, **obligatorio**), `currency` (enum, **obligatorio**, default CLP)

> `unit_price` es obligatorio a nivel de línea, **siempre neto**, expresado en la moneda del documento, y debe validarse contra una fuente externa confiable (`PriceReference`) al momento de creación — no es un valor de ingreso libre sin referencia. No se pregunta al usuario si el precio es neto o bruto.

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | `getPriceReference` | Core (SII) | Cacheada | `PriceReference` (`item_code`, `reference_price`, `reference_date`, `source`) |
| 2 | Dependencia | `previewBudgetAvailability` | Presupuestos | Cacheada / informativa | Entrada: `budget_line_id`, `fiscal_year`, `amount` (opcional) — Respuesta: `available_balance`, `committed_by_others`, `projected_balance` — sin efecto en el expediente |

> La verificación de stock / catálogo CM se anticipa en el sub-paso **1.0** (optativo). En 1.1 solo se refleja el contexto si el usuario llegó desde 1.0 con hallazgo CM (advertencia no bloqueante en modalidad).

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `requesting_unit` | El campo Unidad solicitante es obligatorio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `description` | El campo Descripción es obligatorio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `justification` | El campo Justificación es obligatorio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `requested_date` | El campo Fecha de necesidad es obligatorio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines` | Debe existir al menos una línea de bien o servicio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines[].item_description` | El campo Descripción del ítem es obligatorio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines[].quantity` | El campo Cantidad es obligatorio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `INVALID_QUANTITY` | `lines[].quantity` | La cantidad debe ser mayor a cero. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines[].unit_of_measure` | El campo Unidad de medida es obligatorio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines[].unit_price` | El campo Precio unitario neto es obligatorio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `PRICE_REFERENCE_UNAVAILABLE` | `lines[].price_source` | No hay referencia de precio disponible para la línea. | blocking |
| Guardar borrador | `createPurchaseRequest` | `PRICE_DEVIATION_EXCEEDED` | `lines[].unit_price` | La desviación de precio excede la tolerancia permitida. | blocking |
| Guardar borrador | `createPurchaseRequest` | `FOUNDED_RESOLUTION_REQUIRED` | `founded_resolution_attachment` | Trato directo requiere resolución fundada adjunta. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `attachments[].attachment_type` | El tipo de documento de respaldo es obligatorio. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `attachments[].description` | La descripción del documento de respaldo es obligatoria. | blocking |
| Guardar borrador | `createPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `attachments[].document_ref` | El archivo del documento de respaldo es obligatorio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `requesting_unit` | El campo Unidad solicitante es obligatorio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `description` | El campo Descripción es obligatorio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `justification` | El campo Justificación es obligatorio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `requested_date` | El campo Fecha de necesidad es obligatorio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines` | Debe existir al menos una línea de bien o servicio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines[].item_description` | El campo Descripción del ítem es obligatorio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines[].quantity` | El campo Cantidad es obligatorio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `INVALID_QUANTITY` | `lines[].quantity` | La cantidad debe ser mayor a cero. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines[].unit_of_measure` | El campo Unidad de medida es obligatorio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `lines[].unit_price` | El campo Precio unitario neto es obligatorio. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `PRICE_REFERENCE_UNAVAILABLE` | `lines[].price_source` | No hay referencia de precio disponible para la línea. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `FOUNDED_RESOLUTION_REQUIRED` | `founded_resolution_attachment` | Trato directo requiere resolución fundada adjunta. | blocking |
| Enviar a aprobación | `submitPurchaseRequest` | `INVALID_STATUS` | `status` | Solo una SOLPED en borrador puede enviarse a aprobación. | blocking |
| — (contexto 1.0) | — | `CATALOG_CM_SUGGESTED` | `purchase_modality` | El ítem aparece en catálogo de Convenio Marco; se sugiere esa modalidad. | advisory |

> Ante varias reglas `blocking`, `createPurchaseRequest` / `submitPurchaseRequest` responden `422` con `ValidationErrorResponse` (`issues[]`). El prototipo de 1.1 ilustra el modal al pulsar **Enviar a aprobación**.

**Edge cases:**
- SOLPED incompleta o sin justificación → sistema no permite avanzar a V°B° (`status` no transiciona a `pending_approval` sin campos obligatorios completos).
- Modalidad Trato Directo sin Resolución Fundada adjunta → `submitPurchaseRequest` rechazado con `FOUNDED_RESOLUTION_REQUIRED` (`severity: blocking`).
- Modalidad indicada en borrador pero corregida en etapa 2 → `purchase_modality` actualizable hasta confirmación en etapa 2; cambio registrado en auditoría.
- Fuente de precios no disponible (API caída) → operación `createPurchaseRequest` retorna `PRICE_REFERENCE_UNAVAILABLE` (`severity: blocking`) hasta definir regla alternativa; ver pendiente.
- Precio ingresado muy distinto al de referencia → sin % de desviación definido (patrón transversal, ver también 3.2 y 5.1).
- Llegada desde 1.0 con ítem en catálogo CM → advertencia no bloqueante junto a `purchase_modality` (sugerencia Convenio Marco); el usuario puede cambiar la modalidad.
- Autoconsulta de saldo con línea inexistente o sin permiso RBAC → `previewBudgetAvailability` retorna error en el panel; el borrador de SOLPED no se bloquea.
- Presupuestos no disponible en autoconsulta → mensaje `BUDGET_PROVIDER_UNAVAILABLE` en el panel; el usuario puede continuar redactando la SOLPED.

> ⚠ **Pendiente de definir:** fuente API concreta para `PriceReference` (SII, histórico de Mercado Público, u otra). Regla de tolerancia de desviación de precio — candidata a reutilizarse en 3.2 y 5.1. Comportamiento ante caída de API de precios: ¿bloqueo total o ingreso manual con flag `price_manually_entered`? Alcance RBAC de `previewBudgetAvailability` para solicitantes (¿solo líneas de su unidad?).
>
> ⚠ **Pendiente de definir:** hito que **congela el tipo de cambio** cuando `currency` ≠ CLP para el compromiso presupuestario (¿fecha de resolución, de OC, de preobligación/CDP?). Estimación: puede resolverse al documentar la generación de la obligación/compromiso. La tasa del día en 1.1 es solo referencial y no es auditable para presupuesto. Diferencia de cambio posterior → borde con Contabilidad.
>
> ⚠ **Pendiente normativo:** ¿los umbrales de modalidad (UTM / `NormativeParameter`) se comparan contra monto **neto** o **bruto** (impuestos incluidos)? Práctica usual en Mercado Público: impuestos incluidos — verificar, no asumir. Catálogo ampliado de `tax_code` (retenciones, tasas especiales) si el levantamiento lo exige.

---

## 1.2 — Visto bueno de jefatura

| Materia | Valor |
|---|---|
| Unidad municipal | Unidad Solicitante |
| Rol | Aprobador de unidad ([`adq.aprobador_unidad`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Jefatura de la unidad revisa y aprueba la SOLPED antes de que pase a Finanzas. La aprobación requiere firma electrónica avanzada conforme a normativa (QA ítems 5, 7). Dispone del mismo **enlace informativo de autoconsulta de saldo** que en 1.1 (`previewBudgetAvailability`): si la SOLPED trae `proposed_budget_line_id`, el panel se prellena; el aprobador puede consultar saldo antes de firmar sin que ello constituya verificación formal (eso ocurre en 1.3, a cargo de DAF Finanzas).

**Entidad(es) y campos:**
- `PurchaseRequestApproval` — `purchase_request_id` (ref., **obligatorio**), `approver_id` (ref. `User`, **obligatorio**), `decision` (enum, **obligatorio**: `approved`, `rejected`), `disposition` (enum, **obligatorio si** `decision = rejected`: `return_to_draft` \| `cancel`), `decision_date` (fecha, **obligatorio**), `comments` (texto, **obligatorio si** `decision = rejected`)
- `PurchaseRequest.status` (enum, **obligatorio** — transiciona a `pending_finance` si `approved`, o `draft` si `rejected` + `disposition = return_to_draft`)
- `ProcurementCase.status` — transiciona a `cancelled` si `rejected` + `disposition = cancel`

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `requestSignature` | Core (FirmaGob) | Síncrona bloqueante | Entrada: `document_id`, `document_type`, `signer_id` — Respuesta: `signature_request_id`, `status` |
| 2 | Dependencia | `confirmSignature` | Core (FirmaGob) | Síncrona bloqueante | Entrada: `signature_request_id` — Respuesta: `signed_at`, `certificate_ref` |
| 3 | Dependencia | `previewBudgetAvailability` | Presupuestos | Cacheada / informativa | Misma entrada y respuesta que en 1.1 — consulta opcional desde pantalla de aprobación |
| 4 | Evento | `PurchaseRequestApproved` | — (consumidores: Presupuestos, auditoría) | Asíncrona | `PurchaseRequest` (`id`, `requesting_unit`, `status`), `PurchaseRequestApproval` |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Aprobar | `approvePurchaseRequest` | `SIGNATURE_REQUIRED` | — | Se requiere firma electrónica avanzada válida. | blocking |
| Aprobar | `approvePurchaseRequest` | `SIGNATURE_PROVIDER_UNAVAILABLE` | — | FirmaGob no está disponible; no se puede completar la aprobación. | blocking |
| Aprobar | `approvePurchaseRequest` | `SIGNATURE_REJECTED` | — | La firma fue rechazada por el proveedor de firma. | blocking |
| Aprobar | `approvePurchaseRequest` | `UNAUTHORIZED_APPROVER` | `approver_id` | Solo el aprobador de jefatura de la unidad solicitante puede aprobar. | blocking |
| Aprobar | `approvePurchaseRequest` | `INVALID_STATUS` | `status` | La SOLPED debe estar en pendiente de aprobación. | blocking |
| Rechazar | `rejectPurchaseRequest` | `MISSING_REQUIRED_FIELD` | `comments` | El campo Comentarios es obligatorio al rechazar. | blocking |
| Rechazar | `rejectPurchaseRequest` | `INVALID_STATUS` | `status` | La SOLPED debe estar en pendiente de aprobación. | blocking |

**Edge cases:**
- Rechazo con `disposition = return_to_draft` → `PurchaseRequest.status` vuelve a `draft`; el solicitante puede editar el paso 1.1 y reenviar a aprobación.
- Rechazo con `disposition = cancel` → `ProcurementCase.status = cancelled`; el expediente se cierra sin chance de corrección.
- FirmaGob no disponible o rechaza firma → `approvePurchaseRequest` no procede; retorna `SIGNATURE_PROVIDER_UNAVAILABLE` o `SIGNATURE_REJECTED` (`severity: blocking`). SOLPED permanece en `pending_approval`.
- Firma pendiente (usuario no completó en FirmaGob) → estado intermedio `pending_signature`; reintento vía `confirmSignature`.

> ⚠ **Pendiente de definir:** estructura de `rejection_reason` (¿texto libre o catálogo estructurado de motivos?) — validar en levantamiento. Medida transitoria si FirmaGob no está disponible en piloto: adjunto obligatorio de visación manual con auditoría (propuesta QA ítem 7).

---

## 1.3 — Verificación de disponibilidad presupuestaria

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Finanzas |
| Rol | Formulador DAF / verificación ([`adq.formulador_presupuesto`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** El formulador de DAF Finanzas consulta la disponibilidad presupuestaria de la SOLPED aprobada (QA ítem 8 P1). Muestra trazabilidad de saldo (disponible, comprometido por otras SOLPED, proyectado) y confirma o rechaza con justificación. Quien verifica aquí no es quien firma el CDP (segregación QA ítem 9).

**Entidad(es) y campos:**
- `PurchaseRequest.status` (enum, **obligatorio** — permanece en `pending_finance` hasta completar 1.6)
- Verificación en pantalla: `budget_line_id` (ref., **obligatorio**), `amount` (número, **obligatorio**), `fiscal_year` (número, **obligatorio**), `comments` (texto, **obligatorio si** rechazo)
- `BudgetAvailabilityCertificate.verified_by` (ref. `User`, **obligatorio** — se registra al confirmar verificación)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `checkBudgetAvailability` | Presupuestos | Síncrona bloqueante | Entrada: `budget_line_id`, `amount`, `fiscal_year` — Respuesta: `available_balance`, `committed_by_others`, `projected_balance` |
| 2 | Operación | `verifyBudgetAvailability` | — (Adquisiciones) | — | Entrada: `decision` (`confirmed` \| `rejected`), `comments` si rechazo |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Confirmar verificación | `verifyBudgetAvailability` | `MISSING_REQUIRED_FIELD` | `budget_line_id` | El campo Línea presupuestaria es obligatorio. | blocking |
| Confirmar verificación | `verifyBudgetAvailability` | `MISSING_REQUIRED_FIELD` | `amount` | El campo Monto es obligatorio. | blocking |
| Confirmar verificación | `verifyBudgetAvailability` | `MISSING_REQUIRED_FIELD` | `fiscal_year` | El campo Año fiscal es obligatorio. | blocking |
| Confirmar verificación | `verifyBudgetAvailability` | `BUDGET_UNAVAILABLE` | `budget_line_id` | La línea presupuestaria no tiene saldo disponible para el monto solicitado. | blocking |
| Confirmar verificación | `verifyBudgetAvailability` | `BUDGET_PROVIDER_UNAVAILABLE` | — | El proveedor de Presupuestos no está disponible. | blocking |
| Confirmar verificación | `verifyBudgetAvailability` | `INVALID_STATUS` | `status` | La SOLPED debe estar en pendiente de Finanzas. | blocking |
| Rechazar verificación | `verifyBudgetAvailability` | `MISSING_REQUIRED_FIELD` | `comments` | El campo Comentarios es obligatorio al rechazar. | blocking |

**Edge cases:**
- Sin disponibilidad presupuestaria → verificación rechazada; camino a 1.4 (solicitar financiamiento) o devolución al solicitante con justificación.
- Proveedor Presupuestos no responde → `BUDGET_PROVIDER_UNAVAILABLE` (`severity: blocking`); SOLPED permanece en `pending_finance`.
- Rechazo DAF con justificación → `PurchaseRequest` vuelve al solicitante; camino optativo a 1.4 (línea punteada BPMN).

> ⚠ **Pendiente de definir:** gateway de disponibilidad presupuestaria — probablemente requiere campo calculado `available_balance` en `BudgetLine`.

---

## 1.4 — Solicitar financiamiento a DAF

| Materia | Valor |
|---|---|
| Unidad municipal | Unidad Solicitante / DAF Finanzas |
| Rol | Solicitante ([`adq.solicitante`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Verdadero |

**Detalle:** Paso optativo cuando en 1.3 no hay saldo disponible o Finanzas rechaza la verificación. El solicitante (o DAF en su nombre) registra la solicitud de financiamiento; el proceso deriva a **modificación o reasignación presupuestaria** (flujo externo a Adquisiciones). Tras resolver el presupuesto, el flujo retorna a 1.3.

**Entidad(es) y campos:**
- `PurchaseRequest.status` (enum, **obligatorio** — `pending_budget_financing` mientras el financiamiento está en trámite)
- Solicitud en pantalla: `justification` (texto, **obligatorio**)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Operación | `requestBudgetFinancing` | — (Adquisiciones) | — | Entrada: `justification` (texto) — sin avance de estado principal del ciclo de compra |
| 2 | Evento | `BudgetFinancingRequested` | — (consumidores: Presupuestos, reportería) | Asíncrona | `purchase_request_id`, `requested_at`, `justification` |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Solicitar financiamiento | `requestBudgetFinancing` | `MISSING_REQUIRED_FIELD` | `justification` | El campo Justificación es obligatorio. | blocking |
| Solicitar financiamiento | `requestBudgetFinancing` | `INVALID_STATUS` | `status` | La SOLPED debe estar en un estado que permita solicitar financiamiento. | blocking |

**Edge cases:**
- Financiamiento aprobado externamente → SOLPED retoma en 1.3 para nueva verificación.
- Financiamiento denegado → SOLPED permanece bloqueada; solicitante debe cancelar o reformular.

> ⚠ **Pendiente de definir:** contrato del módulo Presupuestos para el flujo de modificación/reasignación presupuestaria disparado desde este paso.

---

## 1.5 — Emisión de CDP firmado

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Finanzas |
| Rol | Firmante CDP ([`adq.firmante_cdp`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** El Firmante CDP de DAF Finanzas emite y firma el **Certificado de Disponibilidad Presupuestaria** (CDP) sobre la SOLPED con verificación confirmada en 1.3. El Formulador DAF / verificación (1.3, `adq.formulador_presupuesto`) y el Firmante CDP (`adq.firmante_cdp`) deben ser personas distintas (QA ítem 9 P1 / SoD S2). La firma admite **dos caminos**, mutuamente excluyentes:

| Camino | Cuándo | Mecanismo |
|---|---|---|
| **Firma electrónica** (preferido) | FirmaGob disponible | Emisión en SGM → `requestSignature` / `confirmSignature` vía FirmaGob |
| **CDP escaneado** (modo degradado) | FirmaGob no disponible, rechazo del proveedor, o política municipal que exija documento físico firmado | El aprobador adjunta el **PDF o imagen del CDP ya firmado** (firmas manuscritas o visadas en papel); SGM registra metadatos y almacena el archivo con auditoría — **no sustituye** la revalidación presupuestaria en Presupuestos |

En ambos caminos se ejecuta `checkBudgetAvailability` antes de cerrar el paso. El expediente debe dejar visible el modo usado (`signature_mode`) en la línea secundaria de la fila del sub-paso.

**Entidad(es) y campos:**
- `BudgetAvailabilityCertificate` — `procurement_case_id` (ref., **obligatorio**), `purchase_request_id` (ref., **obligatorio**), `certificate_number` (texto, **obligatorio**), `budget_line_id` (ref., **obligatorio**), `certified_amount` (número, **obligatorio**), `fiscal_year` (número, **obligatorio**), `verified_by` (ref., **obligatorio**), `signed_by` (ref., **obligatorio**), `signed_at` (fecha/hora, **obligatorio**), `status` (enum, **obligatorio**: `issued`, `rejected`, `pending_signature`), `rejection_reason` (texto, **obligatorio si** `rejected`), `signature_mode` (enum, **obligatorio**: `electronic` \| `scanned`), `scanned_certificate_attachment` (ref., **obligatorio si** `signature_mode = scanned`)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `checkBudgetAvailability` | Presupuestos | Síncrona bloqueante | Revalidación de saldo al emitir |
| 1.2 | Dependencia | `requestSignature`, `confirmSignature` | Core (documentos) *(PDF vía C10)*, Core (FirmaGob) | Síncrona bloqueante | Solo si `signature_mode = electronic` |
| 3 | Operación | `issueBudgetAvailabilityCertificate` | — (Adquisiciones) | — | Entrada: metadatos del CDP + `signature_mode`; si `electronic`, dispara firma; respuesta: `BudgetAvailabilityCertificate` |
| 4 | Operación | `registerScannedBudgetAvailabilityCertificate` | — (Adquisiciones) | — | Entrada: mismos metadatos + `scanned_certificate_attachment`; sin FirmaGob |
| 5 | Evento | `BudgetAvailabilityCertificateIssued` | — (consumidores: auditoría, Contabilidad) | Asíncrona | `BudgetAvailabilityCertificate` (incl. `signature_mode`), `PurchaseRequest.id` |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Emitir CDP (firma electrónica) | `issueBudgetAvailabilityCertificate` | `VERIFICATION_REQUIRED` | — | Debe existir verificación presupuestaria confirmada en 1.3. | blocking |
| Emitir CDP (firma electrónica) | `issueBudgetAvailabilityCertificate` | `SEGREGATION_OF_DUTIES_VIOLATION` | `signed_by` | El firmante CDP no puede ser la misma persona que verificó en 1.3. | blocking |
| Emitir CDP (firma electrónica) | `issueBudgetAvailabilityCertificate` | `BUDGET_UNAVAILABLE` | `budget_line_id` | La línea presupuestaria no tiene saldo disponible al revalidar. | blocking |
| Emitir CDP (firma electrónica) | `issueBudgetAvailabilityCertificate` | `SIGNATURE_REQUIRED` | — | Se requiere firma electrónica avanzada válida. | blocking |
| Emitir CDP (firma electrónica) | `issueBudgetAvailabilityCertificate` | `MISSING_REQUIRED_FIELD` | `certified_amount` | El campo Monto certificado es obligatorio. | blocking |
| Emitir CDP (firma electrónica) | `issueBudgetAvailabilityCertificate` | `MISSING_REQUIRED_FIELD` | `fiscal_year` | El campo Año fiscal es obligatorio. | blocking |
| Registrar CDP escaneado | `registerScannedBudgetAvailabilityCertificate` | `VERIFICATION_REQUIRED` | — | Debe existir verificación presupuestaria confirmada en 1.3. | blocking |
| Registrar CDP escaneado | `registerScannedBudgetAvailabilityCertificate` | `SEGREGATION_OF_DUTIES_VIOLATION` | `signed_by` | El firmante CDP no puede ser la misma persona que verificó en 1.3. | blocking |
| Registrar CDP escaneado | `registerScannedBudgetAvailabilityCertificate` | `BUDGET_UNAVAILABLE` | `budget_line_id` | La línea presupuestaria no tiene saldo disponible al revalidar. | blocking |
| Registrar CDP escaneado | `registerScannedBudgetAvailabilityCertificate` | `SCANNED_CDP_INVALID` | `scanned_certificate_attachment` | El adjunto del CDP escaneado es inválido o inconsistente. | blocking |
| Registrar CDP escaneado | `registerScannedBudgetAvailabilityCertificate` | `MISSING_REQUIRED_FIELD` | `scanned_certificate_attachment` | El campo Adjunto del CDP escaneado es obligatorio. | blocking |

**Edge cases:**
- Verificador y firmante son la misma persona → `SEGREGATION_OF_DUTIES_VIOLATION` (QA ítem 9 P1).
- Saldo insuficiente al revalidar → `BUDGET_UNAVAILABLE`; no se emite CDP; camino a 1.4.
- FirmaGob no disponible → ofrecer **camino CDP escaneado** si la política del tenant lo habilita; si no, CDP queda `pending_signature` y reintento vía `confirmSignature`.
- Adjunto escaneado ilegible, sin firmas visibles o con metadatos inconsistentes con la revalidación → `SCANNED_CDP_INVALID` (`severity: blocking`); no se emite el certificado.
- Usuario intenta mezclar ambos caminos (firma electrónica iniciada y luego adjunto escaneado) → rechazo; un solo `signature_mode` por certificado.

> ⚠ **Pendiente de definir:** si el CDP escaneado queda habilitado solo como medida transitoria de piloto (como la visación manual propuesta en 1.2) o como opción permanente configurable por tenant — impacta gobernanza y auditoría.

---

## 1.6 — Generación de preobligación

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Finanzas |
| Rol | Firmante CDP ([`adq.firmante_cdp`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Tras el CDP vigente (1.5), DAF Finanzas registra la **preobligación** (pre-afectación presupuestaria). El registro se contabiliza en el módulo Contabilidad. Puede ejecutarse inmediatamente tras el CDP o en la misma transacción atómica — ver pendiente. Al completarse, la SOLPED queda lista para Modalidad de Compra.

**Entidad(es) y campos:**
- `BudgetPreCommitment` — `procurement_case_id` (ref., **obligatorio**), `purchase_request_id` (ref., **obligatorio**), `budget_availability_certificate_id` (ref., **obligatorio**), `budget_line_id` (ref., **obligatorio**), `estimated_amount` (número, **obligatorio**), `fiscal_year` (número, **obligatorio**), `status` (enum, **obligatorio**: `active`)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `createBudgetPreCommitment` | Presupuestos | Síncrona bloqueante | Entrada: `purchase_request_id`, `budget_line_id`, `estimated_amount` — Respuesta: `BudgetPreCommitment` (`id`, `status`) |
| 2 | Dependencia | `registerPreObligation` | Contabilidad | Síncrona bloqueante | Entrada: `BudgetPreCommitment` — Respuesta: `accounting_entry_ref` |
| 3 | Operación | `createBudgetPreCommitment` | — (Adquisiciones) | — | Requiere CDP vigente (`budget_availability_certificate_id`) |
| 4 | Evento | `BudgetPreCommitmentCreated` | — (consumidores: Contabilidad, reportería) | Asíncrona | `BudgetPreCommitment`, `PurchaseRequest.id` |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Generar preobligación | `createBudgetPreCommitment` | `CDP_REQUIRED` | `budget_availability_certificate_id` | Se requiere un CDP vigente para generar la preobligación. | blocking |
| Generar preobligación | `createBudgetPreCommitment` | `BUDGET_UNAVAILABLE` | `budget_line_id` | La línea presupuestaria no tiene saldo disponible para el monto estimado. | blocking |
| Generar preobligación | `createBudgetPreCommitment` | `ACCOUNTING_PROVIDER_UNAVAILABLE` | — | El proveedor de Contabilidad no está disponible. | blocking |
| Generar preobligación | `createBudgetPreCommitment` | `INVALID_STATUS` | `status` | La SOLPED debe estar en pendiente de Finanzas. | blocking |
| Generar preobligación | `createBudgetPreCommitment` | `MISSING_REQUIRED_FIELD` | `estimated_amount` | El campo Monto estimado es obligatorio. | blocking |
| Generar preobligación | `createBudgetPreCommitment` | `MISSING_REQUIRED_FIELD` | `fiscal_year` | El campo Año fiscal es obligatorio. | blocking |

**Edge cases:**
- Preobligación sin saldo contrastado → `BUDGET_UNAVAILABLE` (`severity: blocking`, QA ítem 11 P0).
- CDP no vigente o ausente → operación rechazada con `CDP_REQUIRED`.
- Contabilidad no disponible → `ACCOUNTING_PROVIDER_UNAVAILABLE`; preobligación no persiste (sin efecto parcial).
- Proveedor Presupuestos rechaza → mismo que sin disponibilidad; camino optativo a 1.4.

> ⚠ **Pendiente de definir:** secuencial estricto (CDP → preobligación en dos pasos) vs. transacción atómica única. Qué ocurre si se revierte la SOLPED tras preobligación activa.

---

## Resumen de entidades — Etapa 1

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `PurchaseRequest` | Raíz de la etapa | 1 por SOLPED; incluye `purchase_modality` (opcional) y `founded_resolution_attachment` (condicional) |
| `PurchaseRequestLine` | 1:N con `PurchaseRequest` | Ítems de la solicitud, con `unit_price` obligatorio |
| `PurchaseRequestAttachment` | 1:N con `PurchaseRequest` | Documentos de respaldo opcionales (cotización, foto, ficha técnica, otro) |
| `PriceReference` | N:1 con `PurchaseRequestLine` | Nueva — fuente de precio a definir |
| `PurchaseRequestApproval` | 1:N con `PurchaseRequest` | Historial de decisiones (permite múltiples ciclos rechazo/reenvío) |
| `BudgetAvailabilityCertificate` | 1:1 con `PurchaseRequest` | CDP firmado por aprobador DAF |
| `BudgetPreCommitment` | 1:1 con `PurchaseRequest` | Preobligación; requiere CDP vigente |

## Resumen de bordes — Etapa 1

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 1.0 | Dependencia *(propuesta / P-44)* | `checkStockAvailability` | Inventario *(omitible)* |
| 1.0 | Dependencia *(condicional sync ChileCompra)* | `checkCatalogAvailability` | Catálogo CM espejado |
| 1.1 | Sistema externo | `getPriceReference` | Core (SII) |
| 1.1 | Dependencia | `previewBudgetAvailability` | Presupuestos *(informativa)* |
| 1.2 | Dependencia | `requestSignature`, `confirmSignature` | Core (FirmaGob) |
| 1.2 | Dependencia | `previewBudgetAvailability` | Presupuestos *(informativa)* |
| 1.2 | Evento | `PurchaseRequestApproved` | — |
| 1.3 | Dependencia | `checkBudgetAvailability` | Presupuestos |
| 1.3 | Operación | `verifyBudgetAvailability` | — |
| 1.4 | Operación / Evento | `requestBudgetFinancing`, `BudgetFinancingRequested` | Presupuestos *(externo)* |
| 1.5 | Dependencia | `checkBudgetAvailability`, `requestSignature`, `confirmSignature` | Presupuestos, FirmaGob |
| 1.5 | Operación / Evento | `issueBudgetAvailabilityCertificate`, `registerScannedBudgetAvailabilityCertificate`, `BudgetAvailabilityCertificateIssued` | Presupuestos, FirmaGob *(condicional)* |
| 1.6 | Dependencia | `createBudgetPreCommitment`, `registerPreObligation` | Presupuestos, Contabilidad |
| 1.6 | Evento | `BudgetPreCommitmentCreated` | — |

**Siguiente etapa:** [2. Modalidad de Compra](./2-modalidad-compra.md) *(transversal)*
