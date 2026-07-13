# 3. Resolución de Compra

Etapa del macroproceso **Trato Directo (SGM Integrado)** en la que Mercado Público emite la Orden de Compra y el proveedor la acepta, gatillando automáticamente el registro del compromiso presupuestario cierto en el SGM.

**Fuente base:** diagrama BPMN de carriles `Adquisiciones: Trato Directo (SGM Integrado)`.

---

## 3.1 — Se Emite OC y Proveedor ACEPTA

| Materia | Valor |
|---|---|
| **Unidad municipal** | — |
| **Rol** | N/A (automático / actor externo) |
| **Plataforma** | Mercado Público |
| **Optativo** | Falso |

### Detalle
Mercado Público emite la Orden de Compra (OC) al proveedor sobre la base del Trato Directo publicado en 2.3, y el proveedor la acepta dentro del portal. El diagrama condensa emisión y aceptación en un solo nodo — no distingue un estado intermedio de "OC emitida, pendiente de aceptación" como paso propio.

### Entidad(es) y campos
- **PurchaseOrder** (`entidades-core.md`) — crea: `direct_procurement_case_id` (ref. DirectProcurementCase), `mp_order_id`, `supplier_id`, `status` (= `accepted`), `accepted_at`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |
| **Nota** | Este nodo ocurre íntegramente dentro de Mercado Público; el cruce hacia el SGM se produce en 3.2 vía lectura de API. |

### Edge cases
- Proveedor rechaza la OC → el diagrama no muestra camino de retorno para este flujo (a diferencia de otros macroprocesos donde el rechazo reinicia la selección de proveedor). **[⚠ ver Pendientes]**.
- Plazo de aceptación vencido sin respuesta del proveedor → no representado en el diagrama.

### Pendientes de definir
> ⚠ **Pendiente de definir:** camino de excepción si el proveedor rechaza la OC o no responde dentro de plazo — el diagrama solo modela el camino feliz ("Proveedor ACEPTA"). Dado que en Trato Directo suele existir un solo proveedor seleccionado, el rechazo podría implicar reiniciar desde 2.1; debe validarse con la unidad de negocio.

---

## 3.2 — Registrar Compromiso Cierto (Obligación)

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Finanzas |
| **Rol** | N/A (automático) |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle
El SGM registra automáticamente el compromiso presupuestario cierto (obligación) al detectar, vía lectura de API, que la OC fue aceptada por el proveedor en Mercado Público. El diagrama etiqueta este nodo explícitamente como **"Automático — Gatillado por la API contra OC"**, con una flecha punteada rotulada **"Lectura API: OC Aceptada"** desde Mercado Público hacia DAF Finanzas. No hay intervención humana en este sub-paso.

### Entidad(es) y campos
- **BudgetCommitment** *(propuesta — "obligación" o "compromiso cierto", no confirmada como nombre canónico en fuente)* — crea: `procurement_case_id`, `purchase_order_id` (ref. PurchaseOrder), `budget_pre_commitment_id` (ref. BudgetPreCommitment, obligatorio — transforma la preobligación de 1.3 en compromiso definitivo), `amount`, `triggered_by` (= `api_event`), `created_at`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Evento** | Lectura API: OC Aceptada (nombre de operación no confirmado; propuesto: `getPurchaseOrderStatus` o `PurchaseOrderAccepted` si es evento) |
| **Contraparte** | Core (Mercado Público) |
| **Clasificación** | ⚠ no definida — el diagrama no distingue si es polling síncrono o webhook asíncrono |
| **Payload** | `PurchaseOrder` (`mp_order_id`, `status`, `accepted_at`) |

### Edge cases
- Mercado Público no disponible o la lectura de API falla → el compromiso cierto no se registra; SOLPED queda bloqueada en un estado intermedio. **Obligatorio documentar por tratarse de sub-paso con borde de módulo — comportamiento exacto no definido en el diagrama.**
- OC aceptada en Mercado Público pero la preobligación (1.3) ya no está activa (p. ej. fue revertida) → **[⚠ ver Pendientes]**.

### Pendientes de definir
> ⚠ **Pendiente de definir:** si "Lectura API: OC Aceptada" es un mecanismo de polling periódico o un webhook que Mercado Público dispara hacia el SGM. Determina la clasificación (síncrona bloqueante vs. asíncrona) requerida en `contracts.md`.
> ⚠ **Pendiente de definir:** comportamiento si Mercado Público no está disponible al momento de la lectura — mismo patrón de pendiente identificado en otros bordes de módulo del macroproceso (candidato a regla transversal de reintento).
> ⚠ **Pendiente de definir:** nombre canónico de la entidad "compromiso cierto/obligación" en `entidades-core.md` — se usa `BudgetCommitment` como propuesta de trabajo.

---

## Resumen de entidades — Etapa 3

| Entidad | Tipo de relación | Notas |
|---|---|---|
| PurchaseOrder | Raíz de la etapa | Emitida y aceptada íntegramente en Mercado Público |
| BudgetCommitment | 1:1 con PurchaseOrder *(propuesta)* | Registrado automáticamente vía lectura de API, sin intervención humana |

## Resumen de bordes — Etapa 3

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 3.2 | Sistema externo | Lectura API: OC Aceptada (⚠ nombre pendiente) | Core (Mercado Público) |

---

**Navegación:** Etapa anterior: [2. Modalidad de Compra](./2-modalidad-compra.md) · Etapa siguiente: [4. Recepción Conforme](./4-recepcion-conforme.md)
