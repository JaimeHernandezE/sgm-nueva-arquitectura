# 1. SOLPED

Etapa inicial del macroproceso **Trato Directo (SGM Integrado)**, módulo Adquisiciones. Cubre desde el requerimiento de la Unidad Solicitante hasta la pre-afectación presupuestaria, antes de iniciar la Modalidad de Compra.

**Fuente base:** diagrama BPMN de carriles `Adquisiciones: Trato Directo (SGM Integrado)` (imagen aportada por el usuario). Es una fuente de alto nivel — no detalla campos ni contratos — por lo que gran parte de §3.4 y §3.5 de esta etapa se basa en propuestas razonables marcadas explícitamente como tales, y los vacíos se marcan ⚠ pendiente en vez de asumirse en silencio.

---

## 1.1 — Requerir adquisición (SOLPED + Causal TD)

| Materia | Valor |
|---|---|
| **Unidad municipal** | Unidad Solicitante |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle
La Unidad Solicitante crea la SOLPED en el SGM e indica, en el mismo paso, la causal legal de Trato Directo que justifica la compra. A diferencia de otras modalidades, en este flujo el diagrama muestra la causal capturada desde el origen de la solicitud, no en un sub-paso separado de confirmación de modalidad.

### Entidad(es) y campos
- **ProcurementCase** *(propuesta, raíz del expediente — no confirmada en fuente)* — crea: `folio`, `module`, `macroprocess` (= Trato Directo), `current_stage`, `status`.
- **PurchaseRequest** (`entidades-core.md`) — crea: `procurement_case_id` (ref. ProcurementCase), `requesting_unit` (ref. OrganizationalUnit), `description`, `justification`, `requested_date`, `purchase_modality` (= `direct_procurement`), `legal_cause` (enum, catálogo de causales TD), `status` (= `draft`).

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases
- SOLPED sin causal legal seleccionada → no permite avanzar a 1.2 (regla propuesta; el diagrama no especifica validación de campos obligatorios).
- Causal legal inexistente en catálogo o mal codificada → **[⚠ ver Pendientes]**.

### Pendientes de definir
> ⚠ **Pendiente de definir:** catálogo de causales de Trato Directo y su origen (¿tabla interna SGM o fuente normativa externa?). El diagrama no lo especifica — candidato a regla transversal, mismo vacío identificado en la documentación de la etapa "Modalidad de Compra" de otros macroprocesos.
> ⚠ **Pendiente de definir:** si `ProcurementCase` es en efecto la entidad raíz del expediente o si el folio se genera recién en 2.1 ("Iniciar Trato Directo en SGM"). El diagrama no distingue expediente de SOLPED en esta etapa.

---

## 1.2 — V°B° Jefatura Unidad Solicitante

| Materia | Valor |
|---|---|
| **Unidad municipal** | Unidad Solicitante |
| **Rol** | Aprobador |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle
La jefatura de la Unidad Solicitante da el visto bueno a la SOLPED antes de que pase a DAF/Finanzas. El diagrama no muestra firma electrónica explícita en este paso (a diferencia de otros macroprocesos documentados), por lo que no se asume su existencia.

### Entidad(es) y campos
- **PurchaseRequestApproval** *(propuesta, análoga a otros macroprocesos — no confirmada en este diagrama)* — crea: `purchase_request_id` (ref. PurchaseRequest), `approver_id` (ref. User), `decision` (enum: `approved`, `rejected`), `decision_date`, `comments` (obligatorio si `rejected`).
- **PurchaseRequest.status** — actualiza a `pending_finance` si `approved`, o `draft` si `rejected`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases
- Rechazo de jefatura → `PurchaseRequest.status` vuelve a `draft`; el diagrama no muestra loop de reintento automático.

### Pendientes de definir
> ⚠ **Pendiente de definir:** si este V°B° requiere firma electrónica avanzada (como en otros macroprocesos del módulo) o es una aprobación simple dentro del SGM. El diagrama no lo distingue visualmente.

---

## 1.3 — Pre-afectar gasto (Disponibilidad > Preobligación)

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Finanzas |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle
DAF Finanzas verifica disponibilidad presupuestaria y registra la preobligación en un único sub-paso visual (`Disponibilidad > Preobligación` sugiere una secuencia interna verificar-luego-comprometer, condensada en un solo nodo del BPMN). A diferencia de otros macroprocesos del módulo, el diagrama **no muestra un CDP formal firmado como paso separado** antes de la preobligación.

### Entidad(es) y campos
- **BudgetPreCommitment** (`entidades-core.md`) — crea: `procurement_case_id`, `purchase_request_id` (ref. PurchaseRequest), `estimated_amount`, `budget_line_id`, `fiscal_year`, `status` (= `active`).

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Dependencia |
| **Contrato / Evento** | `checkBudgetAvailability` |
| **Contraparte** | Presupuestos |
| **Clasificación** | Síncrona bloqueante |
| **Payload** | Entrada: `budget_line_id`, `amount`, `fiscal_year` — Respuesta: `available_balance` |

| Campo | Contenido |
|---|---|
| **Tipo** | Dependencia |
| **Contrato / Evento** | `createBudgetPreCommitment` |
| **Contraparte** | Presupuestos |
| **Clasificación** | Síncrona bloqueante |
| **Payload** | Entrada: `purchase_request_id`, `budget_line_id`, `estimated_amount` — Respuesta: `BudgetPreCommitment` (`id`, `status`) |

### Edge cases
- Sin disponibilidad presupuestaria → preobligación no se crea; SOLPED permanece bloqueada (el diagrama no muestra camino alternativo de solicitud de financiamiento en este flujo, a diferencia de otros macroprocesos).
- Proveedor Presupuestos no disponible → `BUDGET_PROVIDER_UNAVAILABLE` (severity: blocking); obligatorio documentar por tratarse de un sub-paso con borde de módulo.

### Pendientes de definir
> ⚠ **Pendiente de definir:** si la ausencia de un CDP formal firmado (visto en otros macroprocesos, sub-paso 1.5 de esa fuente) es una simplificación real del proceso Trato Directo o una omisión del diagrama. Candidato a inconsistencia a resolver contra `contracts.md` de Presupuestos antes de cerrar esta ficha.
> ⚠ **Pendiente de definir:** quién verifica disponibilidad y quién registra la preobligación — si es la misma persona o existe segregación de funciones (regla vista en otros macroprocesos, no visible en este diagrama).

---

## Resumen de entidades — Etapa 1

| Entidad | Tipo de relación | Notas |
|---|---|---|
| ProcurementCase | Raíz de la etapa *(propuesta)* | 1 por expediente de Trato Directo; folio visible en toda la etapa |
| PurchaseRequest | 1:1 con ProcurementCase | Incluye `legal_cause` desde su creación (1.1) |
| PurchaseRequestApproval | 1:N con PurchaseRequest *(propuesta)* | V°B° de jefatura, sin firma confirmada |
| BudgetPreCommitment | 1:1 con PurchaseRequest | Sin CDP formal separado visible en el diagrama |

## Resumen de bordes — Etapa 1

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 1.3 | Dependencia | `checkBudgetAvailability` | Presupuestos |
| 1.3 | Dependencia | `createBudgetPreCommitment` | Presupuestos |

---

**Navegación:** Etapa anterior: — · Etapa siguiente: [2. Modalidad de Compra](./2-modalidad-compra.md)
