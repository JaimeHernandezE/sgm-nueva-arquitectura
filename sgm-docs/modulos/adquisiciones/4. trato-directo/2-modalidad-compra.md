# 2. Modalidad de Compra

Etapa del macroproceso **Trato Directo (SGM Integrado)** en la que DAF/Abastecimiento inicia formalmente el Trato Directo en el SGM, adjunta la Resolución Fundada y sincroniza el caso con Mercado Público para su publicación.

**Fuente base:** diagrama BPMN de carriles `Adquisiciones: Trato Directo (SGM Integrado)`. Igual que en la Etapa 1, esta ficha marca como ⚠ pendiente todo detalle no explícito en el diagrama.

---

## 2.1 — Iniciar Trato Directo en SGM

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle
Con la preobligación activa (1.3), DAF Abastecimiento inicia el caso de Trato Directo dentro del SGM. Este sub-paso abre el `DirectProcurementCase` que se sincronizará con Mercado Público en 2.2.

### Entidad(es) y campos
- **DirectProcurementCase** (`entidades-core.md`) — crea: `procurement_case_id` (ref. ProcurementCase), `purchase_request_id` (ref. PurchaseRequest), `legal_cause` (heredado de 1.1), `status` (= `draft`).

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases
- Preobligación (1.3) no activa → no permite iniciar el Trato Directo (regla propuesta; consistente con la dependencia mostrada en el diagrama entre carriles DAF/Finanzas → DAF/Abastecimiento).

### Pendientes de definir
> ⚠ **Pendiente de definir:** validaciones exactas que bloquean la apertura del caso (¿solo preobligación activa, o también V°B° de jefatura vigente?).

---

## 2.2 — Sincronizar ID TD y Adjuntar Resolución Fundada

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Usuario |
| **Plataforma** | `SGM → Mercado Público (deep link)` |
| **Optativo** | Falso |

### Detalle
DAF Abastecimiento adjunta la Resolución Fundada en el SGM y sincroniza el `DirectProcurementCase` con su identificador equivalente en Mercado Público (ID TD) mediante un deep link — navegación directa desde el SGM hacia el portal, no una llamada API de fondo tradicional. El diagrama muestra la flecha de deep link como bidireccional entre este nodo y "Publicar TD con Resolución Fundada" (2.3).

### Entidad(es) y campos
- **FoundedResolution** (`entidades-core.md`) — crea: `direct_procurement_case_id` (ref. DirectProcurementCase), `attachment` (adjunto, obligatorio), `resolution_number`.
- **DirectProcurementCase** — actualiza: `mp_case_id` (ID TD sincronizado con Mercado Público) *(propuesta, no confirmada en fuente)*.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Evento** | Deep link de navegación SGM → Mercado Público (sin nombre de operación API confirmado) |
| **Contraparte** | Mercado Público (Portal) |
| **Clasificación** | ⚠ no definida |
| **Payload** | `direct_procurement_case_id`, `founded_resolution_attachment` |

### Edge cases
- Resolución Fundada no adjuntada → no permite avanzar a la sincronización (regla propuesta, consistente con el patrón visto en otros macroprocesos del módulo, sub-paso 1.1).
- Mercado Público no disponible al sincronizar → **obligatorio documentar por tratarse de un borde de módulo — no definido en el diagrama.** Ver pendiente.

### Pendientes de definir
> ⚠ **Pendiente de definir:** nombre y clasificación (síncrona/asíncrona) del contrato detrás del deep link — el diagrama solo muestra la interacción visual, no el contrato subyacente. Debe agregarse a `contracts.md` de Adquisiciones una vez definido.
> ⚠ **Pendiente de definir:** comportamiento si Mercado Público no responde durante la sincronización (bloqueo total vs. reintento posterior).

---

## 2.3 — Publicar TD con Resolución Fundada

| Materia | Valor |
|---|---|
| **Unidad municipal** | — |
| **Rol** | N/A (automático / actor externo) |
| **Plataforma** | Mercado Público |
| **Optativo** | Falso |

### Detalle
Mercado Público publica el Trato Directo con la Resolución Fundada adjunta, cumpliendo la obligación de transparencia activa. Este nodo vive en el carril de Mercado Público (Portal/API), no en un carril municipal — es la contraparte externa recibiendo y procesando lo sincronizado en 2.2.

### Entidad(es) y campos
- **MercadoPublicoPublication** *(propuesta — no confirmada en fuente, análoga a publicaciones de otros macroprocesos)* — crea: `direct_procurement_case_id`, `published_at`, `mp_case_id`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Evento** | Publicación en Mercado Público (nombre de operación no confirmado en fuente) |
| **Contraparte** | Mercado Público |
| **Clasificación** | ⚠ no definida |
| **Payload** | `DirectProcurementCase`, `FoundedResolution` |

### Edge cases
- Publicación fallida o fuera de plazo legal → **[⚠ ver Pendientes]**; el diagrama no muestra camino de error para este nodo.

### Pendientes de definir
> ⚠ **Pendiente de definir:** plazo legal de publicación y qué ocurre si se excede — mismo vacío identificado en la documentación de Etapa 2 de otros macroprocesos del módulo (candidato a regla transversal).
> ⚠ **Pendiente de definir:** si "Publicar TD" es una operación disparada por el SGM (`publishDirectProcurement`) o un proceso interno de Mercado Público sin contrato expuesto hacia el SGM.

---

## Resumen de entidades — Etapa 2

| Entidad | Tipo de relación | Notas |
|---|---|---|
| DirectProcurementCase | Raíz de la etapa | 1 por SOLPED en Trato Directo; sincronizado con `mp_case_id` |
| FoundedResolution | 1:1 con DirectProcurementCase | Adjunto obligatorio antes de sincronizar |
| MercadoPublicoPublication | 1:1 con DirectProcurementCase *(propuesta)* | Contraparte externa, sin contrato confirmado |

## Resumen de bordes — Etapa 2

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 2.2 | Sistema externo | Deep link SGM → MP (⚠ nombre pendiente) | Mercado Público |
| 2.3 | Sistema externo | Publicación TD (⚠ nombre pendiente) | Mercado Público |

---

**Navegación:** Etapa anterior: [1. SOLPED](./1-solped.md) · Etapa siguiente: [3. Resolución de Compra](./3-resolucion-compra.md)
