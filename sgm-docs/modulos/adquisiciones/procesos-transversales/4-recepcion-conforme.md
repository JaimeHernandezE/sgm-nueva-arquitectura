# 4. Recepción Conforme

*Proceso transversal — documentado en el piloto [Compra Ágil](../1.%20compra-agil/overview.md). A diferencia de las etapas 1–3, que varían por modalidad de compra, aquí **rota el eje de variación**: tras la OC aceptada las cuatro modalidades convergen, y lo que hace variar el flujo es el **perfil de recepción** — tipo de objeto (bien físico / servicio), receptor (Bodega / unidad requirente) y patrón de entrega (única / parcial / recurrente). El tronco del proceso es común; el perfil determina campos, validaciones y bordes activos.*

*Herencia por modalidad (única variación remanente): en Licitación Pública y contratos de servicios continuos, la recepción es recurrente (N conformidades periódicas sobre el mismo contrato); en Compra Ágil típicamente es única o parcial. El mecanismo es el mismo.*

---

## 4.1 — Registro de la recepción

| Materia | Valor |
|---|---|
| Unidad municipal | Bodega / Unidad Solicitante *(según perfil de recepción configurado por el municipio y el tipo de objeto)* |
| Rol | Usuario |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Ante la entrega del bien o la prestación del servicio, el receptor registra la recepción **contra las líneas de la OC aceptada** (3.4). El perfil de recepción determina el formulario: para **bienes físicos**, cantidades recibidas por línea (habilitando parcialidades); para **servicios**, conformidad del período o hito con el respaldo que corresponda (informe, acta). El receptor por defecto es configurable por municipio (Bodega centralizada vs. recepción directa en la unidad); para servicios, el receptor natural es la unidad requirente. Una OC admite **N recepciones** (entregas parciales, períodos recurrentes); cada una referencia las líneas y cantidades que cubre.

**Entidad(es) y campos:**
- `GoodsReceipt` — `procurement_case_id` (ref., **obligatorio**), `purchase_order_id` (ref., **obligatorio**), `receipt_type` (enum, **obligatorio**), `received_by` (ref., **obligatorio**), `receiving_unit` (ref., **obligatorio**), `received_date` (fecha, **obligatorio**), `service_period_start` / `service_period_end` (fecha, **obligatorio si** servicio recurrente), `supporting_document_ref` (`DocumentRef`, **obligatorio si** `receipt_type = service` — vía `storeDocument` del core); lista de adjuntos en confirmación = `DocumentRef[]`, `status` (enum, **obligatorio**), `observations` (texto, **obligatorio si** no conforme)
- `GoodsReceiptLine` — `goods_receipt_id` (ref., **obligatorio**), `purchase_order_line_ref` (ref., **obligatorio**), `quantity_ordered` (número, **obligatorio**), `quantity_received` (número, **obligatorio**), `quantity_accepted` (número, **obligatorio**), `quantity_rejected` (número, **obligatorio**), `rejection_reason` (texto, **obligatorio si** `quantity_rejected > 0`)
- Pantalla: `conformity` (enum, **obligatorio**), `attachments` (ref., **obligatorio** al confirmar)
- `PurchaseOrder.fulfillment_status` (campo) — enum: `pending` \| `partially_received` \| `fully_received`, derivado del agregado de líneas recepcionadas

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Operación | `registerReceipt` | — (Adquisiciones) | — | `GoodsReceipt` + `GoodsReceiptLine[]` |

**Edge cases:**
- Entrega sin OC asociada localizable → no se puede registrar recepción; el flujo correcto es regularizar la compra primero (control anti compra-de-hecho).
- Cantidad recibida > cantidad pendiente de la línea → `RECEIPT_EXCEEDS_ORDER` (`severity: blocking`); las sobre-entregas no se recepcionan silenciosamente.
- Entrega llega antes de la aceptación formal de la OC en MP (desfase real: proveedor apurado) → la recepción queda en `draft`, no confirmable hasta que 3.4 complete. ⚠ Confirmar tratamiento con DM.

> **[PENDIENTE P-42]** Configuración del perfil de recepción por municipio (¿por tipo de bien/rubro, por unidad, por monto?) — candidato a parámetro operativo por tenant (distinto de `NormativeParameter`, que es plataforma).
> **[PENDIENTE P-33]** Plazo máximo para registrar recepción tras la entrega física — candidato a timer de escalamiento.

---

## 4.2 — Verificación de conformidad

| Materia | Valor |
|---|---|
| Unidad municipal | Bodega / Unidad Solicitante *(quien recepciona; la unidad requirente valida siempre si el receptor fue Bodega)* |
| Rol | Aprobador |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Verificación de que lo recibido corresponde a lo comprado: cantidad, especificaciones técnicas, estado, plazo. Si el receptor fue Bodega (bienes), la unidad requirente confirma que lo recibido es lo que solicitó — doble conformidad configurable según perfil. El resultado por línea es **aceptar, rechazar o aceptar parcialmente**. La conformidad total o parcial gatilla 4.3/4.4 por las cantidades aceptadas; los rechazos derivan a 4.5.

**Regla de segregación (SoD, `seguridad.md` §4):** quien confirma la conformidad **no puede ser** quien aprobó la compra (aprobador de SOLPED/modalidad). Validación bloqueante del motor (`SEGREGATION_OF_DUTIES_VIOLATION`), con el régimen de excepciones configurable y auditado para municipios de dotación mínima.

**Entidad(es) y campos:**
- `GoodsReceipt` (actualiza) — `status`, `confirmed_by` (ref. `User`, ≠ aprobador de la compra), `confirmed_at`
- `GoodsReceiptLine` (actualiza) — `quantity_accepted`, `quantity_rejected`, `rejection_reason`

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Evento | `GoodsReceiptConfirmed` | — (consumidores: expediente, Contabilidad, notificaciones, terceros vía webhook con scope) | Asíncrona | `GoodsReceipt`, `GoodsReceiptLine[]` (aceptadas) |

**Edge cases:**
- Unidad requirente no valida en plazo (bien retenido en Bodega) → timer de escalamiento — **[PENDIENTE P-33]**.
- Conformidad otorgada y luego se detecta vicio oculto → procedimiento de reversión de conformidad con efectos sobre devengado/pago según el estado del ciclo — **[PENDIENTE P-43]**, caso real y delicado, no dejar como supuesto.

---

## 4.3 — Alta en inventario / activo fijo *(condicional: solo bienes físicos aceptados)*

| Materia | Valor |
|---|---|
| Unidad municipal | Bodega |
| Rol | Usuario / N/A (automático si el proveedor de inventario lo permite) |
| Plataforma | SGM |
| Optativo | Verdadero *(no aplica a servicios)* |

**Detalle:** Los bienes aceptados se dan de alta donde corresponda: **inventario de consumo** (existencias) o **activo fijo** si superan el umbral de activación contable — umbral que es política contable administrable (candidato a `NormativeParameter` o parámetro de plataforma contable). Conforme al mandato API, la recepción **no implementa inventario**: declara una dependencia de proveedor, y quién la satisface queda abierto.

> **Alerta de alcance (decisión de bases pendiente):** Bodega/Inventario y Activo Fijo **no están entre los cinco módulos declarados** del SGM (Adquisiciones, Tesorería, Contabilidad, Presupuestos, RRHH). Gracias al diseño por contratos esto no bloquea la especificación — el proveedor de `registerInventoryEntry` puede ser un módulo futuro de SGM o un sistema municipal existente vía adaptador — pero **debe decidirse explícitamente si Inventario/Activo Fijo entra al alcance de la licitación o se declara módulo futuro**, porque afecta las bases y el costo. **[PENDIENTE P-44]**

**Entidad(es) y campos:**
- `GoodsReceiptLine` (actualiza) — `inventory_entry_ref` (referencia externa al registro del proveedor de inventario, si existe)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `registerInventoryEntry` (incluye indicador de activo fijo según umbral) | Proveedor de inventario (módulo futuro SGM o sistema municipal) | Asíncrona | Líneas aceptadas: ítem, cantidad, valor unitario, flag activo fijo, referencia OC/recepción |

**Edge cases:**
- Municipio sin proveedor de inventario configurado → el paso se omite registrando la omisión (el alta queda como gestión externa al sistema); visible en reportería como brecha de trazabilidad.
- Proveedor de inventario rechaza o no responde → la recepción y el devengado **no se bloquean** (dependencia asíncrona); la falla queda como tarea de regularización.

---

## 4.4 — Devengado

| Materia | Valor |
|---|---|
| Unidad municipal | — (efecto automático de la conformidad) / Contabilidad (verificación) |
| Rol | N/A |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** La conformidad (total o parcial) gatilla el reconocimiento contable de la obligación: **devengado por el valor de lo aceptado**, contra el compromiso registrado en 3.4. Es el hito de gestión crítico de la etapa, simétrico al `commitBudget` de 3.4: recepciones parciales generan devengados parciales acumulables hasta el total de la OC. Con la recepción conforme (y la factura aceptada, ver frontera) **arranca el reloj legal de pago** — plazo máximo de 30 días corridos.

<!-- REVISAR: momento del devengado — recepción conforme vs. three-way match con factura; definir con Contabilidad/DM. El canónico (`modelo-datos/entidades-core.md`, entidad `Accrual`) encadena `ThreeWayMatch` (OC + Recepción + Factura, ver `procesos-transversales/5-pago.md` §5.1-5.2) → `Accrual` 1:1; esta ficha gatilla el devengado desde la conformidad de recepción, con devengados parciales por valor aceptado. Son dos definiciones distintas del momento contable del devengado. No resuelto aquí — **[PENDIENTE P-46]**, prioridad alta. -->

**Frontera con el ciclo de pago:** esta etapa termina en el devengado registrado y el evento emitido. El circuito de la factura electrónica (recepción del DTE, aceptación o reclamo dentro del plazo legal, su relación temporal con la recepción física) y el pago pertenecen a la etapa/módulo siguiente (Tesorería), para no especificar dos veces el mismo tramo.

<!-- REVISAR: frontera Pago/Tesorería — este párrafo asume que Pago pertenece a un módulo Tesorería separado de Adquisiciones, pero el repo ya documenta Pago como etapa 5 propia de Adquisiciones (`procesos-transversales/5-pago.md`, con Three-Way-Match → Accrual → Decreto → Pago). Conflicto de alcance de módulo no listado en las instrucciones de integración, detectado en la reconciliación. No resuelto aquí — **[PENDIENTE P-47]**. -->

**[PENDIENTE P-45]** Los detalles del circuito DTE (plazos de reclamo, efectos de la cesión/factoring, mérito ejecutivo) deben confirmarse contra la norma vigente antes de especificar la etapa de pago — no fijar de memoria.

**Entidad(es) y campos:**
- `Accrual` *(referencia; entidad del módulo Contabilidad, creada vía contrato)* — referencia resultante en `GoodsReceipt.accrual_ref`
- `CaseStep` — cierre de etapa (o del ciclo parcial, si quedan entregas pendientes)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `recordAccrual` (devengado por valor aceptado, contra `BudgetCommitment`) | Proveedor contable (Contabilidad SGM o sistema municipal) | Asíncrona *(la conformidad procede; el devengado confirma o revierte — clasificación canónica de `musts-arquitectura.md` §5)* | `goods_receipt_id`, `budget_commitment_ref`, monto aceptado, líneas |
| 2 | Evento | `AccrualRecorded` | — (consumidores: expediente, Tesorería, reportería) | Asíncrona | `Accrual.ref`, `ProcurementCase.id` |

**Edge cases:**
- Proveedor contable rechaza el devengado (ej. compromiso insuficiente por devengados parciales previos mal calculados) → estado intermedio visible ("conforme, devengado pendiente") + tarea urgente a Contabilidad/Finanzas; idempotencia por `goods_receipt_id` (nunca doble devengado por reintento).
- Suma de devengados parciales excedería el compromiso → `ACCRUAL_EXCEEDS_COMMITMENT` (`severity: blocking` en el proveedor contable); consistente con `RECEIPT_EXCEEDS_ORDER` aguas arriba.

---

## 4.5 — Recepción no conforme *(camino de primera clase, no edge case)*

| Materia | Valor |
|---|---|
| Unidad municipal | Bodega / Unidad Solicitante (constata) + DAF Abastecimiento (gestiona con proveedor) |
| Rol | Usuario |
| Plataforma | SGM |
| Optativo | Verdadero *(solo si hay rechazo total o parcial)* |

**Detalle:** Las líneas o cantidades rechazadas en 4.2 abren gestión con el proveedor: **devolución** (bienes), **reposición o corrección** (bienes o servicios re-ejecutables) con plazo comprometido y timer, o **incumplimiento** con las consecuencias del instrumento que rija (multas según bases en Licitación Pública; en Compra Ágil, reclamo en ChileCompra por la vía de la plataforma). Nada de lo rechazado se devenga; la trazabilidad del rechazo y su resolución queda en el expediente.

**Entidad(es) y campos:**
- `ReceiptRejectionCase` *(sugerida, no confirmada en fuente)* — `goods_receipt_id`, líneas afectadas, `resolution_type` (enum: `return` \| `replacement` \| `penalty` \| `claim`), `resolution_deadline`, `resolved_at`, `outcome`

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Evento | `ReceiptRejected` | — (consumidores: expediente, notificaciones, reportería de proveedores) | Asíncrona | `ReceiptRejectionCase`, `GoodsReceiptLine[]` (rechazadas) |
| 2 | Sistema externo (deep link) | — (reclamo en ChileCompra, cuando aplique) | Mercado Público | — | — (navegación; la persona actúa en MP) |

**Edge cases:**
- Reposición recibida → nueva recepción (4.1) referenciando el `ReceiptRejectionCase` — el ciclo se reutiliza, no se duplica.
- Proveedor no repone en plazo → escalamiento; insumo para reportería de comportamiento de proveedores (candidato a métrica del ecosistema).
- Rechazo posterior a factura ya recibida → coordinar con el circuito DTE (reclamo de la factura dentro del plazo legal) — misma familia del **[PENDIENTE P-45]**.

---

## Resumen de entidades — Etapa 4

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `GoodsReceipt` | N:1 con `PurchaseOrder` | Nueva — N recepciones por OC (parciales/recurrentes); cubre bienes y servicios vía `receipt_type` |
| `GoodsReceiptLine` | N:1 con `GoodsReceipt` | Confirmada (antes sugerida) — cantidades ordenada/recibida/aceptada/rechazada por línea de OC |
| `ReceiptRejectionCase` | 1:N con `GoodsReceipt` | Sugerida — gestión del rechazo como proceso trazable |
| `Accrual` | Referencia (módulo Contabilidad) | Creada vía contrato `recordAccrual`, por valor aceptado — ver REVISAR momento del devengado (**[PENDIENTE P-46]**) |
| `PurchaseOrder.fulfillment_status` | Campo nuevo | Derivado del agregado de recepciones |

## Resumen de bordes — Etapa 4

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 4.1 | Operación | `registerReceipt` | — |
| 4.2 | Evento | `GoodsReceiptConfirmed` | — |
| 4.3 | Dependencia | `registerInventoryEntry` | Proveedor de inventario (**[PENDIENTE P-44]** alcance por decidir) |
| 4.4 | Dependencia / Evento | `recordAccrual`, `AccrualRecorded` | Proveedor contable |
| 4.5 | Evento / Deep link | `ReceiptRejected`, reclamo en ChileCompra | MP (navegación) |

**Etapa anterior:** [3. Resolución de Compra](../1.%20compra-agil/3-resolucion-compra.md) *(específica por modalidad)* · **Siguiente etapa:** [5. Pago →](./5-pago.md) *(frontera definida en 4.4 — ver REVISAR, **[PENDIENTE P-47]**)*
