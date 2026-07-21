# Brechas de la etapa 3 (Resolución de Compra) — Convenio Marco, Licitación Pública, Trato Directo

## Propósito y alcance de este documento

Inventario de lo que falta para llevar Convenio Marco (CM), Licitación Pública (LP) y Trato Directo (TD) al mismo nivel de madurez que ya tiene Compra Ágil (CA) en su etapa 3. **Este documento solo diagnostica — no resuelve nada.** Es el insumo para la siguiente fase de trabajo (reconciliación de entidades, contratos, wireframes, prototipos), que a su vez debe cerrar con una revisión humana del equipo de la división de municipalidades antes de darse por definitiva, especialmente en los puntos marcados **[requiere decisión/validación humana]**.

Metodología: para cada modalidad se releyó su ficha `3-resolucion-compra*.md` completa y se cruzó contra `modelo-datos/entidades-core.md`, `modulos/adquisiciones/contracts.md`, `arquitectura/decisiones/pendientes.md`, `wireframes/`, `openapi/` y `fixtures/`. Compra Ágil se usa como referencia porque es la única modalidad con este ciclo completo (ficha → entidades reconciliadas → `contracts.md` → wireframe → prototipo HTML probado end-to-end).

> **Actualización — Licitación Pública resuelta:** en la fase de llenado de vacíos posterior a este diagnóstico, Licitación Pública alcanzó el mismo nivel de madurez que Compra Ágil (§2.2 abajo detalla lo cerrado). Convenio Marco y Trato Directo siguen tal como se diagnosticaron aquí — el resto de este documento se mantiene sin editar como registro histórico del diagnóstico, salvo la sección de LP.

---

## 1. Resumen comparativo

| Dimensión | Compra Ágil | Convenio Marco | Licitación Pública | Trato Directo |
|---|---|---|---|---|
| Sub-pasos etapa 3 | 6 (3.1–3.6) | 8 (3.1–3.8) | 14 (3.1–3.14) | **2** (3.1–3.2) |
| Entidades nuevas de la ficha reconciliadas en `entidades-core.md` | Todas | 0 de 0 nuevas, pero **4 campos nuevos de `ProcurementCase` sin reconciliar** | **12 de 12 ✅** | 1 entidad con **nombre inexistente** (`DirectProcurementCase`); `BudgetCommitment` marcada "no confirmada" pese a ya ser canónica |
| Operaciones formalizadas como endpoint en `contracts.md` §2 | Sí, completas | **0** | **Sí, completas — §2.4 ✅** | **0** |
| Eventos nuevos registrados en `contracts.md` §4 | Sí | **0 de 2** (`ProcurementRouteDecided`, `GranCompraDesierta`) | **Sí, completos (11 eventos nuevos) ✅** | 0 (ni siquiera tiene nombre de operación confirmado) |
| Wireframes `.md` | 6/6 | **0/8** | **14/14 ✅** (`wireframes/licitacion-publica/`) | **0/2** |
| Prototipo HTML | 6/6, con simulación de múltiples escenarios por sub-paso, probado end-to-end | 8/8 existen pero son cascarones (un campo de solo lectura + botón que cambia una etiqueta) | **14/14 ✅, con simulación de escenarios y validaciones bloqueantes (`CRITERIA_WEIGHTS_INVALID`, `CONFLICT_DECLARATION_REQUIRED`, `SCORES_INCONSISTENT_WITH_CRITERIA`), probado end-to-end con Playwright (camino feliz + 3 ramas de retorno)** | 2/2 existen, mismo patrón |
| OpenAPI real | Sí (`1-compra-agil/3-resolucion-compra.yaml`) | Solo README stub de 4 líneas | Solo README stub — **pendiente, fuera del alcance de esta pasada** | Solo README stub |
| Fixture con etapa 3 poblada | Sí (`ADQ-2026-00123`, "en curso") | No ("sin iniciar") | **Sí (`ADQ-2026-00045`) — "finalizada" ya no es falso positivo, verificado end-to-end ✅** | No ("etapa 3 pendiente") |
| Ítems QA cubiertos | Sí | No | Excluido explícitamente del alcance actual — **pendiente, no cubierto en esta pasada** | No |
| Pendientes `P-nn` con ID propio | Varios (P-39, P-40, P-41...) | Ninguno — 8+ marcadores ⚠ inline sin ID, varios ya dicen literalmente "mismo pendiente que CA" | **P-64, P-65, P-66, P-67 ✅** (más P-37 extendido) | Ninguno — 4 marcadores ⚠ inline sin ID |

---

## 2. Brechas por modalidad

### 2.1 Convenio Marco

**Contradicción activa entre documentos (no solo vacío):** la tabla de "momento de vinculación" en `procesos-transversales/2-modalidad-compra.md` §2.3 dice que para CM la vinculación MP es *"Inmediato (cierre de etapa 2)"*. Pero la propia ficha de CM etapa 3, en su nota de apertura, dice lo contrario y pide explícitamente la corrección:

> *"⚠ Nota de ajuste a la etapa 2: para CM, la vinculación MP ocurre en este sub-paso 3.2 (Compra Directa) o 3.3 (Gran Compra), no al cierre de la etapa 2 — la lógica es idéntica a la corrección ya documentada en LP §3.5. Propagar a `2-modalidad-compra.md` §2.3 la tabla de vinculación diferida por modalidad."*

Esa propagación nunca se ejecutó (es la misma corrección que sí se hizo para LP en una sesión anterior). Es una corrección de bajo riesgo — mismo patrón ya aplicado, sin necesidad de validación externa.

**Modelo de datos sin reconciliar:**
- `ProcurementCase` gana 4 campos en la ficha de CM que no están en `entidades-core.md`: `procurement_route` (enum `gran_compra`/`compra_directa`), `route_decided_at`, `purchase_intent_published_at`, `purchase_intent_deadline`.
- 2 eventos nuevos sin registrar en `contracts.md` §4: `ProcurementRouteDecided` (3.1), `GranCompraDesierta` (3.6).
- La dependencia `getUtmValue` y el patrón de compuerta automática por umbral (3.1) reutilizan lo ya construido en 2.1 — esto sí está bien alineado, no es brecha.

**Pendientes ya cubiertos por un `P-nn` existente, solo falta agregar el origen** (bajo riesgo, trabajo mecánico):
- Timers de escalamiento (3.2/3.3 vínculo no registrado, 3.5 selección no gestionada) → mismo pendiente que **P-33**.
- `MP_PROVIDER_UNAVAILABLE` en vinculación (3.2/3.3) → mismo pendiente que **P-32**.
- Regularización presupuestaria cuando monto real > preobligación (3.7) → mismo pendiente que **P-40**.
- VB interno pre-OC configurable (3.5) → mismo pendiente que **P-39**.
- Carga inicial de `FRAMEWORK_AGREEMENT_GRAN_COMPRA_UTM_LIMIT` → mismo patrón que **P-37** (carga inicial de `NormativeParameter`), agregar como origen adicional.

**Pendiente genuinamente nuevo (sin `P-nn` que lo cubra):**
- Límite de reintentos ante Gran Compra desierta reiterada o rechazos sucesivos de OC (3.6, 3.8) — la ficha lo marca ⚠ dos veces sin definir umbral ni acción de escalamiento. **[requiere decisión de negocio]**

**Artefactos faltantes:** 0/8 wireframes, OpenAPI solo stub, sin fixture con etapa 3 activa, sin ítems QA.

### 2.2 Licitación Pública — ✅ RESUELTO

Era la modalidad con más contenido específico (14 sub-pasos, actos administrativos formales) y la brecha de reconciliación más grande de todo el módulo. Cerrada en la fase de llenado de vacíos que siguió a este diagnóstico:

- **12 de 12 entidades** incorporadas a `entidades-core.md` (`TenderBases`, `EvaluationCriterion`, `LegalReview`, `AdministrativeAct`, `ComptrollerReview`, `Guarantee`, `EvaluationCommittee`, `CommitteeMember`, `OfferRecord`, `EvaluationScore`, `EvaluationReport`, `Contract`), con `LegalReview`/`AdministrativeAct`/`ComptrollerReview`/`Guarantee` marcadas transversales y reutilizables por Trato Directo cuando se aborde esa modalidad.
- **Todas las operaciones formalizadas** en `contracts.md` §2.4 (`createTenderBases`, `submitBasesForLegalReview`, `recordLegalReview`, `approveTenderBases`, `submitToComptroller`, `recordComptrollerOutcome`, `recordClarification`, `designateEvaluationCommittee`, `recordOfferAdmissibility`, `recordEvaluationScores`, `signEvaluationReport`, `issueAwardResolution`, `draftContract`, `signContract`), con reglas, dependencias y eventos por sub-paso; §1 (entidades expuestas), §3 (dependencias Tesorería/Contraloría), §4 (11 eventos nuevos) y §6 (trazabilidad) actualizados en consecuencia.
- **14/14 wireframes** en `wireframes/licitacion-publica/`.
- **14/14 prototipos HTML** reconstruidos desde cascarones a prototipos funcionales con simulación de escenarios y las tres validaciones bloqueantes de la ficha (`CRITERIA_WEIGHTS_INVALID` en 3.1, `CONFLICT_DECLARATION_REQUIRED` en 3.9a, `SCORES_INCONSISTENT_WITH_CRITERIA` en 3.9c), probados end-to-end con Playwright: camino feliz completo 3.1→3.14 y las tres ramas de retorno (3.2 observaciones → 3.1; 3.4/3.11 representación → 3.1/3.10; 3.13 no suscripción → 3.10).
- **4 pendientes nuevos registrados**: **P-64** (canal de consulta CGR), **P-65** (criterio de aclaración que exige acto formal), **P-66** (inhabilidades de comisión evaluadora), **P-67** (mecanismo de firma del contratista) — los cuatro siguen **[requiere validación/decisión humana]**, no resueltos aquí, solo registrados con ID propio en `pendientes.md`. P-37 (carga de `NormativeParameter`) se extendió para cubrir también los umbrales propios de LP.
- **Fixture `ADQ-2026-00045`:** el riesgo de falso positivo señalado en el diagnóstico original quedó cerrado — `business_state` ahora refleja con precisión que la etapa 3 fue verificada end-to-end, no solo "documentada".

**Sigue pendiente, fuera del alcance de esta pasada:** OpenAPI real (`openapi/3-licitacion-publica/` sigue siendo solo README stub) e ítems QA dedicados a LP (Comisión Evaluadora, Toma de Razón, garantías, Contrato) con la misma profundidad P0/P1 que tiene Compra Ágil.

### 2.3 Trato Directo

Es la ficha menos madura de las cuatro — derivada directamente de un diagrama BPMN de 2 nodos, sin el nivel de detalle de sub-paso que exige `plantilla-maestra-sgm.md`. Las brechas aquí son más estructurales que de reconciliación.

**Falta un sub-paso completo:** la tabla de vinculación en `2-modalidad-compra.md` §2.3 promete que para TD la vinculación MP ocurre *"en su subproceso, al momento de la publicación (regla de publicidad en 24 horas)"* — pero la ficha de TD etapa 3 nunca documenta ese sub-paso. Pasa directo de la modalidad confirmada a "3.1 — Se emite OC y proveedor acepta", sin registrar nunca `mp_process_id`. Es un vacío estructural, no un matiz de redacción.

**Error de nombre de entidad, no solo falta de confirmación:** la ficha crea `PurchaseOrder.direct_procurement_case_id` como referencia a una entidad `DirectProcurementCase` que **no existe en ningún lugar del modelo** — la entidad raíz correcta es `ProcurementCase` (la misma que usan las otras 3 modalidades). No es una entidad "sugerida, no confirmada" como en otros casos: es un nombre que nunca tuvo correspondencia real.

**Desactualización respecto al modelo canónico:** la ficha marca `BudgetCommitment` como *"propuesta — no confirmada como nombre canónico en fuente"*, pero `BudgetCommitment` ya es la entidad canónica confirmada en `entidades-core.md` desde la reconciliación de Compra Ágil. La ficha de TD nunca se cruzó contra el modelo actualizado.

**Camino feliz únicamente:** el diagrama BPMN de origen no modela el rechazo de la OC por el proveedor ni el vencimiento de plazo sin respuesta — la propia ficha lo señala como pendiente sin resolver. Tampoco modela la Toma de Razón para TD sobre 8.000 UTM (exigida por la regla V5 del gateway de 2.1) ni conecta la Resolución Fundada de la etapa 1/2 con esta etapa.

**Clasificación técnica sin definir:** el único borde de módulo de la etapa (3.2, lectura "OC Aceptada") no tiene definido si es polling síncrono o webhook asíncrono — dato obligatorio según `musts-arquitectura.md` §5 para cualquier borde de módulo.

**Artefactos faltantes:** 0/2 wireframes, OpenAPI solo stub, sin fixture con etapa 3 activa.

---

## 3. Qué es corrección directa vs. qué necesita a alguien fuera de este repo

Para priorizar el trabajo de la fase siguiente:

**Bajo riesgo — documentación/reconciliación pura, sin decisión nueva:**
- Corregir la fila de CM en la tabla de `2-modalidad-compra.md` §2.3 (contradicción ya detectada arriba, mismo patrón que la corrección ya aplicada a LP). **Pendiente — no incluido en la pasada de LP.**
- Incorporar las 4 entidades/campos de CM a `entidades-core.md` (extracción directa de la ficha ya escrita con detalle). ~~las 12 de LP~~ **hecho ✅ (§2.2).**
- Formalizar en `contracts.md` §2/§4 las operaciones y eventos que ya están descritos en prosa en la ficha de CM. ~~y LP~~ **LP hecho ✅ (§2.4).**
- Corregir `DirectProcurementCase`→`ProcurementCase` y la nota de `BudgetCommitment` en la ficha de TD. **Pendiente.**
- Construir wireframes `.md` y profundizar los prototipos HTML de CM/TD al nivel de CA. ~~LP~~ **hecho ✅ (14/14 wireframes + 14/14 prototipos, probados end-to-end).**
- Registrar los pendientes ya "adoptados" de CA en las fichas de CM (P-32/33/37/39/40) actualizando su columna de origen. **Pendiente.**

**Requiere validación o decisión humana — no se resuelve solo escribiendo más documentación:**
- Alcance exacto de inhabilidades SoD de la comisión evaluadora LP (jurídica). **Registrado como P-66 — sigue abierto, solo tiene ID propio ahora.**
- Criterio de cuándo una aclaración de bases exige acto formal (jurídica). **Registrado como P-65 — sigue abierto.**
- Mecanismo de firma del contratista en LP 3.13 (jurídica / decisión de producto). **Registrado como P-67 — sigue abierto.**
- Canal de consulta de estado ante Contraloría, si existe (CGR). **Registrado como P-64 — sigue abierto.**
- Límite de reintentos ante procesos desiertos/rechazados repetidos en CA/CM (decisión de negocio — mismo patrón en ambas modalidades, se puede resolver junto). **Pendiente (no es de LP).**
- Camino de excepción de TD si el proveedor rechaza la OC o no responde en plazo (validar con la unidad de negocio — la ficha original lo señala explícitamente). **Pendiente.**
- Todo lo que ya estaba abierto en el registro central y afecta transversalmente a estas 3 modalidades (P-25 matriz SoD, P-32 resiliencia externa, P-37 carga de `NormativeParameter`, P-40 regularización presupuestaria) — estos ya son conocidos, no son hallazgo nuevo de este documento, pero su cierre también depende de terceros.

---

## 4. Siguiente paso

Con este inventario como base, la fase de llenado siguió el orden que se usó para Compra Ágil: primero reconciliar entidades y `contracts.md` (fuente de verdad), después escribir wireframes, y recién al final construir/profundizar los prototipos HTML. **Licitación Pública ya completó este ciclo (§2.2)** — es la segunda modalidad, después de Compra Ágil, en llegar al mismo nivel de madurez. Convenio Marco y Trato Directo quedan tal como se diagnosticaron en este documento, con el mismo orden recomendado para cuando se aborden.

La pasada final de detalle — particularmente todo lo marcado **[requiere decisión/validación humana]** arriba, incluidos los cuatro pendientes nuevos de LP (P-64 a P-67) — queda para la revisión con el equipo de la división de municipalidades antes de dar por cerrada cualquiera de las modalidades, LP incluida.
