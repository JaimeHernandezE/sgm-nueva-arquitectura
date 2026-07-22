# Brechas de la etapa 3 (Resolución de Compra) — Convenio Marco, Licitación Pública, Trato Directo

## Propósito y alcance de este documento

Inventario de lo que falta para llevar Convenio Marco (CM), Licitación Pública (LP) y Trato Directo (TD) al mismo nivel de madurez que ya tiene Compra Ágil (CA) en su etapa 3. **Este documento solo diagnostica — no resuelve nada.** Es el insumo para la siguiente fase de trabajo (reconciliación de entidades, contratos, wireframes, prototipos), que a su vez debe cerrar con una revisión humana del equipo de la división de municipalidades antes de darse por definitiva, especialmente en los puntos marcados **[requiere decisión/validación humana]**.

Metodología: para cada modalidad se releyó su ficha `3-resolucion-compra*.md` completa y se cruzó contra `modelo-datos/entidades-core.md`, `modulos/adquisiciones/contracts.md`, `arquitectura/decisiones/pendientes.md`, `wireframes/`, `openapi/` y `fixtures/`. Compra Ágil se usa como referencia porque es la única modalidad con este ciclo completo (ficha → entidades reconciliadas → `contracts.md` → wireframe → prototipo HTML probado end-to-end).

> **Actualización — Licitación Pública y Convenio Marco resueltos:** en fases de llenado de vacíos posteriores a este diagnóstico, Licitación Pública (§2.2) y Convenio Marco (§2.1) alcanzaron el mismo nivel de madurez que Compra Ágil. Trato Directo sigue tal como se diagnosticó aquí — el resto de este documento se mantiene sin editar como registro histórico del diagnóstico, salvo las secciones de LP y CM.

---

## 1. Resumen comparativo

| Dimensión | Compra Ágil | Convenio Marco | Licitación Pública | Trato Directo |
|---|---|---|---|---|
| Sub-pasos etapa 3 | 6 (3.1–3.6) | 8 (3.1–3.8) | 14 (3.1–3.14) | **2** (3.1–3.2) |
| Entidades nuevas de la ficha reconciliadas en `entidades-core.md` | Todas | **4 campos nuevos de `ProcurementCase` reconciliados ✅** (`procurement_route`, `route_decided_at`, `purchase_intent_published_at`, `purchase_intent_deadline`) | **12 de 12 ✅** | 1 entidad con **nombre inexistente** (`DirectProcurementCase`); `BudgetCommitment` marcada "no confirmada" pese a ya ser canónica |
| Operaciones formalizadas como endpoint en `contracts.md` §2 | Sí, completas | **Sí, completas — §2.7 ✅** | **Sí, completas — §2.4 ✅** | **0** |
| Eventos nuevos registrados en `contracts.md` §4 | Sí | **Sí, los 2 registrados ✅** (`ProcurementRouteDecided`, `GranCompraDesierta`) | **Sí, completos (11 eventos nuevos) ✅** | 0 (ni siquiera tiene nombre de operación confirmado) |
| Wireframes `.md` | 6/6 | **8/8 ✅** (`wireframes/convenio-marco/`) | **14/14 ✅** (`wireframes/licitacion-publica/`) | **0/2** |
| Prototipo HTML | 6/6, con simulación de múltiples escenarios por sub-paso, probado end-to-end | **8/8 ✅, con simulación de escenarios y las validaciones bloqueantes de la ficha (`UTM_VALUE_UNAVAILABLE`, los 4 bloqueos de vinculación MP, `NO_ALTERNATIVE_PROVIDER_AVAILABLE`), probado end-to-end con Playwright (camino feliz Gran Compra 3.1→3.3→3.4→3.5→3.7, rama Compra Directa 3.2, rama desierta 3.4→3.6→3.2, rama rechazo 3.7→3.8 con sus dos decisiones)** | **14/14 ✅, con simulación de escenarios y validaciones bloqueantes (`CRITERIA_WEIGHTS_INVALID`, `CONFLICT_DECLARATION_REQUIRED`, `SCORES_INCONSISTENT_WITH_CRITERIA`), probado end-to-end con Playwright (camino feliz + 3 ramas de retorno)** | 2/2 existen, mismo patrón |
| OpenAPI real | Sí (`1-compra-agil/3-resolucion-compra.yaml`) | Solo README stub — **pendiente, fuera del alcance de esta pasada** | Solo README stub — **pendiente, fuera del alcance de esta pasada** | Solo README stub |
| Fixture con etapa 3 poblada | Sí (`ADQ-2026-00123`, "en curso") | **Sí (`ADQ-2026-00089`) — "sin iniciar" ya no es falso positivo, refleja ruta Gran Compra activa en 3.5, verificado end-to-end ✅** | **Sí (`ADQ-2026-00045`) — "finalizada" ya no es falso positivo, verificado end-to-end ✅** | No ("etapa 3 pendiente") |
| Ítems QA cubiertos | Sí | Excluido explícitamente del alcance actual — **pendiente, no cubierto en esta pasada** | Excluido explícitamente del alcance actual — **pendiente, no cubierto en esta pasada** | No |
| Pendientes `P-nn` con ID propio | Varios (P-39, P-40, P-41...) | **P-68 ✅** (nuevo, límite de reintentos); P-32/33/37/39/40 extendidos con CM como origen adicional | **P-64, P-65, P-66, P-67 ✅** (más P-37 extendido) | Ninguno — 4 marcadores ⚠ inline sin ID |

---

## 2. Brechas por modalidad

### 2.1 Convenio Marco — ✅ RESUELTO

Tenía la ficha de etapa 3 más completa de las tres modalidades restantes (entidades, bordes de módulo y edge cases ya bien pensados), pero era la única pieza terminada — nunca se había reconciliado con el resto del sistema y el prototipo eran cascarones. Cerrada en la fase de llenado de vacíos que siguió a este diagnóstico:

- **Contradicción activa entre documentos resuelta:** la tabla de "momento de vinculación" en `procesos-transversales/2-modalidad-compra.md` §2.3 decía que para CM la vinculación MP era *"Inmediato (cierre de etapa 2)"*, contradiciendo la propia ficha de CM (vinculación diferida a 3.2/3.3). Corregida la fila de la tabla, actualizado el demo-data (`shared/demo-data/convenio-marco.js`, paso 2.3 ahora `omitted` con nota de diferimiento, igual que LP) y la nota de la ficha CM marcada como propagada.
- **4 de 4 campos nuevos** de `ProcurementCase` incorporados a `entidades-core.md`: `procurement_route`, `route_decided_at`, `purchase_intent_published_at`, `purchase_intent_deadline`. `QuotationResult`/`MpProcessSnapshot` anotadas como también usadas por CM (no solo CA).
- **Todas las operaciones formalizadas** en `contracts.md` §2.7 (compuerta automática 3.1, `linkMpProcess` reutilizado en 3.2/3.3, `syncPurchaseOrderAccepted` reutilizado en 3.7, `recordPurchaseOrderRejectionDecision` nueva en 3.8), con reglas, dependencias y eventos por sub-paso; §1 (entidades expuestas), §3 (dependencia MP), §4 (2 eventos nuevos) y §6 (trazabilidad) actualizados en consecuencia. Línea de alcance del encabezado del documento actualizada.
- **8/8 wireframes** en `wireframes/convenio-marco/`.
- **8/8 prototipos HTML** reconstruidos desde cascarones (un campo de solo lectura + botón que cambiaba una etiqueta, incluyendo un bug literal `demoAction('demo')`) a prototipos funcionales con simulación de escenarios y las validaciones bloqueantes de la ficha (`UTM_VALUE_UNAVAILABLE` en 3.1, los 4 bloqueos de vinculación MP en 3.2/3.3, `NO_ALTERNATIVE_PROVIDER_AVAILABLE` en 3.8), probados end-to-end con Playwright: camino feliz Gran Compra completo 3.1→3.3→3.4→3.5→3.7, rama Compra Directa (3.2), rama desierta (3.4→3.6→3.2) y rama de rechazo con sus dos decisiones (3.7→3.8→3.7 "siguiente proveedor" / 3.8→3.3 "republicar").
- **Bug de datos detectado y corregido durante la verificación:** el monto de ejemplo del expediente ($4.800.000) era matemáticamente incompatible con la ruta "Gran Compra" que todo el demo-data ya narraba (el umbral es 1.000 UTM ≈ $65M) — quedaba una compra de 24 sillas ergonómicas etiquetada como Gran Compra sin jamás cruzar el umbral. Corregido a 400 unidades / $80.000.000 (≈1.229 UTM) en demo-data, `form-presets.js` y los prototipos, consistente en toda la cadena SOLPED → OC.
- **1 pendiente nuevo registrado**: **P-68** (límite de reintentos ante Gran Compra desierta reiterada o rechazos sucesivos de OC — compartido con Compra Ágil, **[requiere decisión de negocio]**). Los pendientes ya "adoptados" de CA (P-32, P-33, P-37, P-39, P-40) se extendieron con la ficha de CM como origen adicional, y sus marcadores ⚠ inline en la ficha ahora referencian el `P-nn` correspondiente.
- **Fixture `ADQ-2026-00089`:** actualizada de "etapa 3 sin iniciar" a reflejar el estado real de la ruta Gran Compra activa (Intención de Compra vinculada en 3.3, pendiente de selección en 3.5), verificado end-to-end.

**Sigue pendiente, fuera del alcance de esta pasada:** OpenAPI real (`openapi/2-convenio-marco/` sigue siendo solo README stub) e ítems QA dedicados a CM con la misma profundidad P0/P1 que tiene Compra Ágil.

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
- Corregir la fila de CM en la tabla de `2-modalidad-compra.md` §2.3 (contradicción ya detectada arriba, mismo patrón que la corrección ya aplicada a LP). ~~Pendiente~~ **CM hecho ✅ (§2.1).**
- Incorporar las 4 entidades/campos de CM a `entidades-core.md` (extracción directa de la ficha ya escrita con detalle). ~~las 12 de LP~~ **hecho ✅ (§2.1, §2.2).**
- Formalizar en `contracts.md` §2/§4 las operaciones y eventos que ya están descritos en prosa en la ficha de CM. ~~y LP~~ **CM y LP hecho ✅ (§2.4, §2.7).**
- Corregir `DirectProcurementCase`→`ProcurementCase` y la nota de `BudgetCommitment` en la ficha de TD. **Pendiente.**
- Construir wireframes `.md` y profundizar los prototipos HTML de CM/TD al nivel de CA. ~~LP~~ **CM y LP hecho ✅ (8/8 + 14/14 wireframes, 8/8 + 14/14 prototipos, probados end-to-end).**
- Registrar los pendientes ya "adoptados" de CA en las fichas de CM (P-32/33/37/39/40) actualizando su columna de origen. ~~Pendiente~~ **hecho ✅ (§2.1).**

**Requiere validación o decisión humana — no se resuelve solo escribiendo más documentación:**
- Alcance exacto de inhabilidades SoD de la comisión evaluadora LP (jurídica). **Registrado como P-66 — sigue abierto, solo tiene ID propio ahora.**
- Criterio de cuándo una aclaración de bases exige acto formal (jurídica). **Registrado como P-65 — sigue abierto.**
- Mecanismo de firma del contratista en LP 3.13 (jurídica / decisión de producto). **Registrado como P-67 — sigue abierto.**
- Canal de consulta de estado ante Contraloría, si existe (CGR). **Registrado como P-64 — sigue abierto.**
- Límite de reintentos ante procesos desiertos/rechazados repetidos en CA/CM (decisión de negocio — mismo patrón en ambas modalidades, se puede resolver junto). **Registrado como P-68 — sigue abierto.**
- Camino de excepción de TD si el proveedor rechaza la OC o no responde en plazo (validar con la unidad de negocio — la ficha original lo señala explícitamente). **Pendiente.**
- Todo lo que ya estaba abierto en el registro central y afecta transversalmente a estas 3 modalidades (P-25 matriz SoD, P-32 resiliencia externa, P-37 carga de `NormativeParameter`, P-40 regularización presupuestaria) — estos ya son conocidos, no son hallazgo nuevo de este documento, pero su cierre también depende de terceros.

---

## 4. Siguiente paso

Con este inventario como base, la fase de llenado siguió el orden que se usó para Compra Ágil: primero reconciliar entidades y `contracts.md` (fuente de verdad), después escribir wireframes, y recién al final construir/profundizar los prototipos HTML. **Licitación Pública (§2.2) y Convenio Marco (§2.1) ya completaron este ciclo** — son la segunda y tercera modalidad, después de Compra Ágil, en llegar al mismo nivel de madurez. Trato Directo queda tal como se diagnosticó en este documento, con el mismo orden recomendado para cuando se aborde.

La pasada final de detalle — particularmente todo lo marcado **[requiere decisión/validación humana]** arriba, incluidos los cuatro pendientes nuevos de LP (P-64 a P-67) y el nuevo de CM (P-68) — queda para la revisión con el equipo de la división de municipalidades antes de dar por cerrada cualquiera de las modalidades, LP y CM incluidas.
