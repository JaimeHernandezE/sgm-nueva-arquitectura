# 3. Resolución de Compra

## 3.1 — Navegar Catálogo y Seleccionar

| Materia | Valor |
|---|---|
| **Unidad municipal** | — |
| **Rol** | Usuario |
| **Plataforma** | Mercado Público |
| **Optativo** | Falso |

### Detalle

El usuario (DAF Abastecimiento, continuando la sesión iniciada en 2.3) navega el catálogo de Convenio Marco en el Portal de Mercado Público y selecciona el/los ítem(s) a comprar. Con el monto total ya conocido, el sistema evalúa la bifurcación de modalidad (3.2).

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `total_amount` (decimal) — obligatorio, monto total resultante de la selección en catálogo.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Evento** | Consulta de catálogo y selección de ítems |
| **Contraparte** | Mercado Público (Portal/API) |
| **Clasificación** | Síncrona bloqueante |
| **Payload** | `ProcurementCase.total_amount`, `ProcurementCase.catalog_item_reference` |

### Edge cases

- Ítem seleccionado ya no disponible en catálogo (descontinuado por el proveedor): ⚠ pendiente de definir manejo.
- Mercado Público no disponible durante la navegación: ver regla transversal pendiente en overview, sección 8.

### Pendientes de definir

Ninguno adicional a los ya declarados a nivel de overview.

---

## 3.2 — ¿Monto > 1.000 UTM?

| Materia | Valor |
|---|---|
| **Unidad municipal** | — |
| **Rol** | N/A |
| **Plataforma** | Mercado Público |
| **Optativo** | Falso |

### Detalle

Compuerta de decisión automática. El sistema evalúa `ProcurementCase.total_amount` contra el umbral de **1.000 UTM**, fuente normativa confirmada: Art. 90, D.S. 661/2024 (Reglamento de la Ley 19.886), operativizado por la Directiva N° 15 de ChileCompra. Si el monto es mayor o igual a 1.000 UTM, el flujo bifurca hacia **Gran Compra** (3.2a); si es menor, hacia **Compra Directa por Catálogo** (3.2b).

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `procurement_route` (enum) — obligatorio, se fija en `GranCompra` o `CompraDirecta` según el resultado de la evaluación.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases

- Monto exactamente igual a 1.000 UTM: según la fuente normativa el umbral es "igual o mayor", por lo tanto se enruta a Gran Compra.
- UTM del día de cálculo vs. UTM del día de emisión de OC (variación de valor entre selección y emisión): ⚠ pendiente de definir qué UTM aplica (la del día de selección en 3.1 o la del día de resolución final).

### Pendientes de definir

> ⚠ **Pendiente de definir:** qué valor de UTM (día de selección vs. día de resolución) se usa para la comparación, dado que el valor de la UTM varía mensualmente y el proceso puede extenderse en el tiempo.

---

## 3.2a — Gran Compra (Competencia 10 días)

| Materia | Valor |
|---|---|
| **Unidad municipal** | — |
| **Rol** | N/A |
| **Plataforma** | Mercado Público |
| **Optativo** | Falso (condicional: solo aplica si `procurement_route = GranCompra`) |

### Detalle

Para compras iguales o superiores a 1.000 UTM, se publica una Intención de Compra dirigida a todos los proveedores adjudicados en el Convenio Marco específico, abriendo una competencia interna de 10 días corridos, conforme al procedimiento de la Directiva N° 15 de ChileCompra. Al cierre del plazo, el proceso continúa a 3.3 para la emisión de la OC.

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `purchase_intent_published_at` (datetime) — obligatorio.
  - `purchase_intent_deadline` (datetime) — obligatorio, calculado como `purchase_intent_published_at + 10 días`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Evento** | Publicación de Intención de Compra |
| **Contraparte** | Mercado Público (Portal/API) |
| **Clasificación** | Asíncrona |
| **Payload** | `ProcurementCase.market_order_id`, `ProcurementCase.total_amount`, `ProcurementCase.purchase_intent_deadline` |

### Edge cases

- **Ningún proveedor responde a la Intención de Compra dentro de los 10 días** (competencia desierta): ⚠ pendiente de definir si el expediente cae a Compra Directa, se cancela, o se reabre el plazo.
- **Mercado Público no disponible durante la publicación:** ver regla transversal en overview, sección 8.

### Pendientes de definir

> ⚠ **Pendiente de definir:** resolución de competencia desierta en Gran Compra (ningún proveedor oferta dentro del plazo de 10 días).

---

## 3.2b — Compra Directa por Catálogo

| Materia | Valor |
|---|---|
| **Unidad municipal** | — |
| **Rol** | N/A |
| **Plataforma** | Mercado Público |
| **Optativo** | Falso (condicional: solo aplica si `procurement_route = CompraDirecta`) |

### Detalle

Para compras inferiores a 1.000 UTM, la adquisición procede directamente contra el catálogo sin competencia adicional, avanzando de inmediato a la emisión de la OC (3.3).

### Entidad(es) y campos

Sin campos adicionales a los ya definidos en `ProcurementCase`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases

Ninguno adicional a los generales de 3.1.

### Pendientes de definir

Ninguno.

---

## 3.3 — Se emite OC y proveedor acepta

| Materia | Valor |
|---|---|
| **Unidad municipal** | — |
| **Rol** | N/A |
| **Plataforma** | Mercado Público |
| **Optativo** | Falso |

### Detalle

El sistema de Mercado Público emite la Orden de Compra (OC) al proveedor correspondiente (adjudicado en Gran Compra, o directamente el proveedor de catálogo en Compra Directa). El proveedor puede aceptar o rechazar la OC conforme a las causales contractuales de las bases de licitación del Convenio Marco respectivo.

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `purchase_order_status` (enum) — transita a `Issued`, luego a `Accepted` o `Rejected`.
  - `purchase_order_issued_at` (datetime) — obligatorio.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Evento (este módulo consume desde sistema externo) |
| **Contrato / Evento** | `purchaseOrderAccepted` |
| **Contraparte** | Mercado Público |
| **Clasificación** | Asíncrona |
| **Payload** | `ProcurementCase.market_order_id`, `ProcurementCase.purchase_order_status` |

### Edge cases

- **Proveedor rechaza la OC** (causal contractual de las bases de Convenio Marco — ej. inconsistencias de valores/cantidades, dirección de despacho inválida): se emite el evento `PurchaseOrderRejected`, que dispara reversa de `budget_reservation_status` en `ProcurementCase` (de `Reserved` a `Released` o equivalente). Es obligatorio documentar este edge case por tratarse de un sub-paso con borde de módulo.
  - **Tipo:** Evento (este módulo consume)
  - **Contrato / Evento:** `PurchaseOrderRejected`
  - **Contraparte:** Mercado Público
  - **Clasificación:** Asíncrona
  - **Payload:** `ProcurementCase.market_order_id`, motivo de rechazo (campo a definir)
- **Mercado Público no responde / OC queda en estado indefinido más allá de un timeout:** ⚠ pendiente de definir (regla transversal, overview sección 8).

### Pendientes de definir

> ⚠ **Pendiente de definir:** campo de esquema exacto para el motivo de rechazo en el evento `PurchaseOrderRejected`, y si el reintento de compra tras rechazo reutiliza el mismo `ProcurementCase` o genera uno nuevo.

---

## 3.4 — Registrar Compromiso Cierto (Obligación)

| Materia | Valor |
|---|---|
| **Unidad municipal** | — |
| **Rol** | N/A |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle

Sub-paso **100% automático, sin actor humano**, gatillado por la lectura del evento `purchaseOrderAccepted` proveniente de Mercado Público. Al confirmarse la aceptación de la OC por el proveedor, SGM registra el Compromiso Cierto (obligación presupuestaria formal), transformando la pre-afectación de gasto (2.1) en un compromiso devengable.

### Entidad(es) y campos

- **`BudgetCommitment`** *(crea)* — entidad nueva, relación 1:1 con `ProcurementCase`:
  - `procurement_case_folio` (string) — obligatorio, FK a `ProcurementCase.folio`.
  - `committed_amount` (decimal) — obligatorio.
  - `committed_at` (datetime) — obligatorio, se registra automáticamente al procesar el evento.
  - `status` (enum) — obligatorio, se inicializa en `Committed`.
- **`ProcurementCase`** *(actualiza)*:
  - `budget_reservation_status` (enum) — transita de `Reserved` a `Committed`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Dependencia (este módulo consume) |
| **Contrato / Evento** | Consume `purchaseOrderAccepted` para gatillar `checkBudgetAvailability`/registro de compromiso |
| **Contraparte** | Módulo Presupuestos |
| **Clasificación** | Asíncrona (disparada por evento entrante) |
| **Payload** | `BudgetCommitment.procurement_case_folio`, `BudgetCommitment.committed_amount` |

### Edge cases

- **Módulo Presupuestos rechaza el registro del compromiso** (ej. la línea presupuestaria fue modificada entre la pre-afectación y este punto): ⚠ pendiente de definir — es obligatorio documentar edge case de rechazo de proveedor por tratarse de sub-paso con borde de módulo, pero la fuente (BPMN) no define qué ocurre en este caso.
- **Evento `purchaseOrderAccepted` llega duplicado o fuera de orden:** ⚠ pendiente de definir idempotencia del registro de `BudgetCommitment` (ver `estandares-api.md` para el estándar transversal de idempotencia).

### Pendientes de definir

> ⚠ **Pendiente de definir:** comportamiento si el módulo Presupuestos rechaza el registro del Compromiso Cierto pese a que la Pre-afectación fue exitosa en 2.1. Candidato a regla transversal de reversa/compensación entre pre-afectación y compromiso.

---

## Cierre de etapa

### Resumen de entidades de la etapa

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `ProcurementCase` | Actualizada en 3.1, 3.2, 3.2a, 3.3, 3.4 | Se completan `total_amount`, `procurement_route`, `purchase_order_status`, `budget_reservation_status`. |
| `BudgetCommitment` | Creada en 3.4 | Relación 1:1 con `ProcurementCase` vía `procurement_case_folio`. Entidad nueva — agregar a `entidades-core.md`. |

### Resumen de bordes de la etapa

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 3.1 | Sistema externo | Consulta de catálogo | Mercado Público |
| 3.2a | Sistema externo | Publicación de Intención de Compra | Mercado Público |
| 3.3 | Evento (consume) | `purchaseOrderAccepted` | Mercado Público |
| 3.3 (edge case) | Evento (consume) | `PurchaseOrderRejected` | Mercado Público |
| 3.4 | Dependencia | Registro de compromiso vía `purchaseOrderAccepted` | Módulo Presupuestos |

### Navegación

- Etapa anterior: [2. Modalidad de Compra](./2-modalidad-compra.md)
- Etapa siguiente: [4. Recepción Conforme](./4-recepcion-conforme.md)
