# Brechas de la etapa 3 (Resolución de Compra) — Convenio Marco, Licitación Pública, Trato Directo

## Propósito y alcance de este documento

Inventario de lo que falta para llevar Convenio Marco (CM), Licitación Pública (LP) y Trato Directo (TD) al mismo nivel de madurez que ya tiene Compra Ágil (CA) en su etapa 3. **Este documento solo diagnostica — no resuelve nada.** Es el insumo para la siguiente fase de trabajo (reconciliación de entidades, contratos, wireframes, prototipos), que a su vez debe cerrar con una revisión humana del equipo de la división de municipalidades antes de darse por definitiva, especialmente en los puntos marcados **[requiere decisión/validación humana]**.

Metodología: para cada modalidad se releyó su ficha `3-resolucion-compra*.md` completa y se cruzó contra `modelo-datos/entidades-core.md`, `modulos/adquisiciones/contracts.md`, `arquitectura/pendientes.md`, `wireframes/`, `openapi/` y `fixtures/`. Compra Ágil se usa como referencia porque es la única modalidad con este ciclo completo (ficha → entidades reconciliadas → `contracts.md` → wireframe → prototipo HTML probado end-to-end).

---

## 1. Resumen comparativo

| Dimensión | Compra Ágil | Convenio Marco | Licitación Pública | Trato Directo |
|---|---|---|---|---|
| Sub-pasos etapa 3 | 6 (3.1–3.6) | 8 (3.1–3.8) | 14 (3.1–3.14) | **2** (3.1–3.2) |
| Entidades nuevas de la ficha reconciliadas en `entidades-core.md` | Todas | 0 de 0 nuevas, pero **4 campos nuevos de `ProcurementCase` sin reconciliar** | **0 de 12** | 1 entidad con **nombre inexistente** (`DirectProcurementCase`); `BudgetCommitment` marcada "no confirmada" pese a ya ser canónica |
| Operaciones formalizadas como endpoint en `contracts.md` §2 | Sí, completas | **0** | **0** (solo prosa/resumen de bordes) | **0** |
| Eventos nuevos registrados en `contracts.md` §4 | Sí | **0 de 2** (`ProcurementRouteDecided`, `GranCompraDesierta`) | **0 de ~5** | 0 (ni siquiera tiene nombre de operación confirmado) |
| Wireframes `.md` | 6/6 | **0/8** | **0/14** | **0/2** |
| Prototipo HTML | 6/6, con simulación de múltiples escenarios por sub-paso, probado end-to-end | 8/8 existen pero son cascarones (un campo de solo lectura + botón que cambia una etiqueta) | 14/14 existen, mismo patrón de cascarón — ninguna de las entidades de 3.9 (comisión evaluadora) está representada en la UI | 2/2 existen, mismo patrón |
| OpenAPI real | Sí (`1-compra-agil/3-resolucion-compra.yaml`) | Solo README stub de 4 líneas | Solo README stub | Solo README stub |
| Fixture con etapa 3 poblada | Sí (`ADQ-2026-00123`, "en curso") | No ("sin iniciar") | Parcial ("documentada como finalizada en demo" — sin verificación real de que el flujo funcione) | No ("etapa 3 pendiente") |
| Ítems QA cubiertos | Sí | No | Excluido explícitamente del alcance actual | No |
| Pendientes `P-nn` con ID propio | Varios (P-39, P-40, P-41...) | Ninguno — 8+ marcadores ⚠ inline sin ID, varios ya dicen literalmente "mismo pendiente que CA" | Ninguno — 7+ marcadores ⚠ inline sin ID | Ninguno — 4 marcadores ⚠ inline sin ID |

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

### 2.2 Licitación Pública

Es la modalidad con más contenido específico (14 sub-pasos, actos administrativos formales) y la brecha de reconciliación más grande de todo el módulo.

**12 entidades nuevas que existen únicamente en la ficha**, nunca incorporadas a `entidades-core.md` (la propia ficha lo admite en su nota de cierre): `TenderBases`, `EvaluationCriterion`, `LegalReview`, `AdministrativeAct`, `ComptrollerReview`, `Guarantee`, `EvaluationCommittee`, `CommitteeMember`, `OfferRecord`, `EvaluationScore`, `EvaluationReport`, `Contract`. Tres de ellas (`LegalReview`, `AdministrativeAct`, `ComptrollerReview`, `Guarantee`) se declaran explícitamente **"transversales"** — reutilizables por Trato Directo (Resolución Fundada) — por lo que su reconciliación no es solo tarea de LP, condiciona también el cierre de TD.

**Ninguna operación de LP está formalizada como endpoint en `contracts.md` §2** — todas viven solo en prosa dentro de la ficha o en el "Resumen de bordes". Ejemplos de operaciones que necesitan nombre y contrato: aprobar/enviar a revisión las bases (3.1–3.3), someter a Toma de Razón (3.4/3.11), publicar aclaración (3.6), registrar custodia de garantía como endpoint propio (hoy solo aparece como dependencia, 3.7/3.12), designar comisión (3.9a), registrar admisibilidad (3.9b), registrar puntaje de evaluación (3.9c), dictar adjudicación/deserción/revocación (3.10), firmar contrato (3.13).

**Eventos sin registrar en `contracts.md` §4:** `LegalReviewCompleted`, `AdministrativeActSigned`, `GuaranteeRegistered`, `EvaluationCompleted` — y no existe siquiera nombre de evento para adjudicación/deserción/revocación (3.10), que es el acto terminal más importante de la etapa.

**Pendientes genuinamente nuevos (sin `P-nn`):**
- Canal de consulta de estado de trámites ante Contraloría — la ficha dice explícitamente "no asumir que existe." **[requiere validación con CGR]**
- Criterio jurídico de cuándo una aclaración a las bases (3.6) exige acto administrativo complementario. **[requiere jurídica]**
- Alcance exacto de las inhabilidades de integrantes de la comisión evaluadora (3.9) — hoy es "propuesta, validar con jurídica." **[requiere jurídica; candidato a incorporarse a la matriz SoD general, P-25]**
- Mecanismo de firma del contratista en 3.13 (FEA propia / firma en papel digitalizada / plataforma) — sin definir.

**Riesgo adicional detectado:** la fixture `ADQ-2026-00045` describe LP como *"etapa 3 documentada como finalizada en demo de prototipos"* — es decir, el prototipo se marcó como funcional para efectos de demo sin que exista una validación real de que el flujo de 14 sub-pasos funciona de punta a punta (a diferencia de CA, que sí se probó con Playwright en esta sesión). Es un falso positivo de completitud a tener presente.

**Artefactos faltantes:** 0/14 wireframes, OpenAPI solo stub, ítems QA de esta modalidad explícitamente excluidos del alcance actual (`contracts.md` lo dice literalmente).

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
- Corregir la fila de CM en la tabla de `2-modalidad-compra.md` §2.3 (contradicción ya detectada arriba, mismo patrón que la corrección ya aplicada a LP).
- Incorporar las 4 entidades/campos de CM y las 12 de LP a `entidades-core.md` (son extracciones directas de fichas ya escritas con detalle).
- Formalizar en `contracts.md` §2/§4 las operaciones y eventos que ya están descritos en prosa en las fichas de CM y LP.
- Corregir `DirectProcurementCase`→`ProcurementCase` y la nota de `BudgetCommitment` en la ficha de TD.
- Construir wireframes `.md` y profundizar los prototipos HTML de CM/LP/TD al nivel de CA (esto es directamente lo que ya hicimos para Compra Ágil — mismo patrón, mismo esfuerzo por sub-paso).
- Registrar los pendientes ya "adoptados" de CA en las fichas de CM (P-32/33/37/39/40) actualizando su columna de origen.

**Requiere validación o decisión humana — no se resuelve solo escribiendo más documentación:**
- Alcance exacto de inhabilidades SoD de la comisión evaluadora LP (jurídica).
- Criterio de cuándo una aclaración de bases exige acto formal (jurídica).
- Mecanismo de firma del contratista en LP 3.13 (jurídica / decisión de producto).
- Canal de consulta de estado ante Contraloría, si existe (CGR).
- Límite de reintentos ante procesos desiertos/rechazados repetidos en CA/CM (decisión de negocio — mismo patrón en ambas modalidades, se puede resolver junto).
- Camino de excepción de TD si el proveedor rechaza la OC o no responde en plazo (validar con la unidad de negocio — la ficha original lo señala explícitamente).
- Todo lo que ya estaba abierto en el registro central y afecta transversalmente a estas 3 modalidades (P-25 matriz SoD, P-32 resiliencia externa, P-37 carga de `NormativeParameter`, P-40 regularización presupuestaria) — estos ya son conocidos, no son hallazgo nuevo de este documento, pero su cierre también depende de terceros.

---

## 4. Siguiente paso

Con este inventario como base, la fase de llenado debería seguir el mismo orden que se usó para Compra Ágil: primero reconciliar entidades y `contracts.md` (fuente de verdad), después escribir wireframes, y recién al final construir/profundizar los prototipos HTML — para no repetir el problema ya detectado en LP de tener HTML "completo" sin que el modelo de datos que lo respalda exista realmente.

La pasada final de detalle — particularmente todo lo marcado **[requiere decisión/validación humana]** arriba — queda para la revisión con el equipo de la división de municipalidades antes de dar por cerrada cualquiera de las tres modalidades.
