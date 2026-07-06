# 3. Resolución de Compra — Licitación Pública

*Etapa organizador común con contenido específico por modalidad. A diferencia de Compra Ágil (monitoreo con puntos de decisión), en LP esta etapa concentra **actos administrativos internos activos en SGM**: bases, revisión jurídica, resoluciones, comisión evaluadora, garantías, eventual Toma de Razón. Cada sub-paso declara su **Obligatoriedad**: Obligatorio / Condicional (con su condición) / Optativo. Los umbrales que activan pasos condicionales son `NormativeParameter` (carga inicial verificada contra norma vigente — no se fijan aquí).*

*La vinculación con Mercado Público de esta modalidad es diferida: ocurre en el sub-paso 3.5 (tras bases aprobadas), no al cierre de la etapa 2 — ver `procesos-transversales/2-modalidad-compra.md` §2.3, cuya operación, validaciones y edge cases este sub-paso reutiliza íntegramente.*

*Estándar MP ↔ SGM según plantilla §5. Lectura confirmada: OC Aceptada. Todas las demás lecturas de esta etapa son **deseadas**, con modo degradado = registro manual con `entry_mode = manual`; MP prevalece si la lectura llega después.*

---

## 3.1 — Elaboración de bases administrativas y técnicas

| Materia | Valor |
|---|---|
| Unidad municipal | Unidad Solicitante (técnicas) + DAF Abastecimiento (administrativas) |
| Rol | Usuario |
| Plataforma | SGM |
| Obligatoriedad | **Obligatorio** |

**Detalle:** Redacción de las bases sobre el requerimiento de la SOLPED. Las **técnicas** definen el objeto; las **administrativas**, las reglas del proceso: requisitos de admisibilidad, garantías exigidas, y **criterios de evaluación con ponderaciones** — que se capturan **estructurados, no solo como documento adjunto**, porque la evaluación (3.9) puntúa contra ellos y el sistema debe poder verificar que el acta respeta las ponderaciones declaradas. SGM puede ofrecer plantillas de bases tipo (candidato a biblioteca administrable).

**Entidades:** `TenderBases` *(nueva)* — `procurement_case_id`, refs. a documentos (almacenamiento de objetos), `status` (`draft`/`legal_review`/`approved`), flags de garantías exigidas y montos. `EvaluationCriterion` *(nueva)* — `tender_bases_id`, `name`, `weight_percent` (la suma debe ser 100 — validación bloqueante `CRITERIA_WEIGHTS_INVALID`), `scoring_rule` (texto).

**Borde:** Sin cruce (interno). **Edge cases:** modificación de bases después de enviadas a revisión → vuelve a `draft` con versionamiento del documento.

---

## 3.2 — Revisión jurídica de bases

| Materia | Valor |
|---|---|
| Unidad municipal | Departamento Jurídico *(unidad nueva en el catálogo — agregar a plantilla §3.2)* |
| Rol | Aprobador |
| Plataforma | SGM |
| Obligatoriedad | **Obligatorio** |

**Detalle:** Jurídica revisa legalidad de las bases (admisibilidad, criterios, garantías, cláusulas). Resultado: VB u observaciones que devuelven a 3.1. El ciclo revisión ↔ corrección es iterable y trazado.

**Entidades:** `LegalReview` *(nueva)* — `subject_type`/`subject_id` (polimórfica: sirve también para 3.10 y para la Resolución Fundada de TD — **candidata a entidad transversal**), `reviewer_id`, `outcome` (`approved`/`observations`), `observations`, `reviewed_at`.

**Borde:** Evento `LegalReviewCompleted` (asíncrona). **Edge cases:** observaciones reiteradas (3+ ciclos) → visible en reportería de tiempos por etapa.

---

## 3.3 — Acto administrativo que aprueba las bases

| Materia | Valor |
|---|---|
| Unidad municipal | Alcaldía / autoridad con delegación |
| Rol | Aprobador |
| Plataforma | SGM |
| Obligatoriedad | **Obligatorio** |

**Detalle:** Decreto o resolución que aprueba las bases, con firma electrónica. Sin este acto no hay publicación.

**Entidades:** `AdministrativeAct` *(nueva, transversal)* — `act_type` (`bases_approval`/`award`/`desertion`/`revocation`/...), `subject_id`, `act_number`, `signed_by`, `signed_at`, ref. documento. Generaliza el patrón de `PaymentDecree`; **candidata a absorberlo a futuro** — marcar `REVISAR`, no fusionar ahora.

**Borde:** Dependencia `requestSignature`/`confirmSignature` → FirmaGob (**síncrona bloqueante**; estándar "campo presente ≠ integración funcional": el contrato define el flujo completo de firma). Evento `AdministrativeActSigned`. **Edge cases:** falla de FirmaGob → acto no perfeccionado, reintento; nunca "firmado" sin confirmación del servicio.

---

## 3.4 — Toma de Razón de las bases (Contraloría)

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento (tramita) / — (resuelve CGR) |
| Rol | Usuario |
| Plataforma | SGM / Otra (plataforma CGR) |
| Obligatoriedad | **Condicional** — solo si el monto supera el umbral de Toma de Razón vigente (`NormativeParameter`, fijado por resolución de la propia CGR) |

**Detalle:** Remisión del acto a Contraloría y espera del pronunciamiento. Resultados: toma de razón (continúa), **representación/reparo** (el acto se cae → corregir bases y repetir 3.1–3.3), o toma de razón con alcance. El expediente muestra el estado y el tiempo en CGR (típicamente semanas).

**Entidades:** `ComptrollerReview` *(nueva, transversal — **reutilizable en Trato Directo**, que tiene el mismo trámite para su Resolución Fundada)* — `administrative_act_id`, `submitted_at`, `outcome` (`approved`/`approved_with_remarks`/`rejected`), `outcome_at`, ref. oficio.

**Borde:** Sistema externo CGR — **sin integración API asumida**: registro manual del envío y del resultado, con documento de respaldo. ⚠ Pendiente: explorar si existe canal de consulta de estado de trámites CGR integrable; no asumirlo. **Edge cases:** representación → reversión trazada a 3.1; los `CaseStep` reflejan el reintento sin perder historia.

---

## 3.5 — Publicación en Mercado Público y vinculación

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Usuario |
| Plataforma | Mercado Público → SGM |
| Obligatoriedad | **Obligatorio** |
| Interacción MP | **Gestión** (registro del ID); luego informativo |

**Detalle:** Con bases aprobadas (y tomadas de razón si aplicó), el usuario crea y publica la licitación **en MP** (SGM en modo monitor desde la publicación: cero deep links per `integracion-mercado-publico.md`). Registra en SGM el **ID de la licitación**, ejecutando aquí la vinculación de 2.3 (diferida para LP): validación `readMpProcess` (existencia, organismo, tipo), `mp_process_id` en `ProcurementCase`, evento `MpProcessLinked`, inicio de sincronización. El plazo mínimo de publicación quedó informado desde el gateway (V7, etapa 2).

**Edge cases:** los cuatro bloqueos de 2.3 aplican idénticos (no encontrado, organismo distinto, tipo incoherente, ya vinculado).

---

## 3.6 — Foro de preguntas y aclaraciones

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento + Unidad Solicitante (insumos técnicos) |
| Rol | Usuario |
| Plataforma | Mercado Público |
| Obligatoriedad | **Obligatorio como período**; la gestión es **condicional a que existan preguntas** |
| Interacción MP | **Gestión condicional** |

**Detalle:** Los proveedores preguntan por el foro de MP; el comprador responde a todas simultáneamente mediante documento oficial de **Aclaración a las Bases**, sin identificar preguntantes, dentro del plazo de las bases. La respuesta se gestiona en MP; SGM registra el hito y el documento de aclaración en el expediente.

**Lecturas MP:** preguntas recibidas / aclaración publicada — **deseadas**; degradado: registro manual del documento. **Edge cases:** aclaración que modifica sustantivamente las bases → puede requerir acto administrativo complementario y extensión de plazo. ⚠ Pendiente con jurídica: criterio de cuándo una aclaración exige acto formal.

---

## 3.7 — Recepción y custodia de Garantía de Seriedad de la Oferta

| Materia | Valor |
|---|---|
| Unidad municipal | Tesorería (custodia) + DAF Abastecimiento (verifica) |
| Rol | Usuario |
| Plataforma | SGM |
| Obligatoriedad | **Condicional** — solo si las bases la exigen (obligatoria sobre umbral `NormativeParameter`; facultativa bajo él) |

**Detalle:** Registro y custodia de los instrumentos de garantía de los oferentes (vale vista, boleta, póliza, certificado de fianza), con vigencia y monto verificados contra las bases. La custodia es de Tesorería: **borde de módulo**.

**Entidades:** `Guarantee` *(nueva, transversal — sirve también para 3.12)* — `guarantee_type` (`bid_bond`/`performance_bond`), `procurement_case_id`, `provider_rut`, `instrument_type`, `amount`, `expiry_date`, `status` (`in_custody`/`returned`/`executed`), ref. documento.

**Borde:** Dependencia `registerGuaranteeCustody` → Tesorería (asíncrona); evento `GuaranteeRegistered`. **Edge cases:** garantía vencida o por monto insuficiente → oferta inadmisible (insumo de 3.9); devolución a oferentes no adjudicados tras la adjudicación (tarea con timer — plata de terceros retenida sin razón es hallazgo de auditoría).

---

## 3.8 — Acto de apertura electrónica

| Materia | Valor |
|---|---|
| Unidad municipal | — (ocurre en MP) |
| Rol | N/A |
| Plataforma | Mercado Público |
| Obligatoriedad | **Obligatorio** |
| Interacción MP | **Informativo** |

**Detalle:** Cierre de recepción de ofertas y apertura electrónica en MP. SGM refleja el hito y el número de ofertas; el detalle de las ofertas se gestiona en MP.

**Lecturas MP:** cierre y apertura, n° de ofertas — **deseadas**; degradado: registro manual del hito para habilitar 3.9.

---

## 3.9 — Comisión evaluadora y acta de evaluación

| Materia | Valor |
|---|---|
| Unidad municipal | Comisión ad hoc (integrantes designados) + DAF Abastecimiento (secretaría) |
| Rol | Usuario / Aprobador (integrantes firman el acta) |
| Plataforma | SGM |
| Obligatoriedad | **Condicional** — comisión formal obligatoria sobre umbral (`NormativeParameter`); bajo él, evaluación por funcionario responsable con el mismo registro estructurado |

**Detalle:** Tres momentos: **(a) designación** de integrantes por acto administrativo (reutiliza `AdministrativeAct`), con **declaración de ausencia de conflictos de interés por integrante** — bloqueante: sin declaración no se habilita a evaluar; **(b) admisibilidad**: verificación de requisitos formales por oferta (oferta inadmisible queda fuera aunque tenga mejor precio, con causal registrada); **(c) evaluación**: puntaje por oferta y por `EvaluationCriterion`, **estrictamente contra las ponderaciones de las bases** — el sistema calcula el total y bloquea actas cuyos puntajes no cuadren con los pesos declarados (`SCORES_INCONSISTENT_WITH_CRITERIA`). El **Acta de Evaluación** con ranking y propuesta de adjudicación se firma por los integrantes.

**Entidades:** `EvaluationCommittee` *(nueva)* + `CommitteeMember` (con `conflict_declaration_ref`, obligatoria); `OfferRecord` *(nueva)* — espejo mínimo de cada oferta (proveedor, monto, admisibilidad, causal); `EvaluationScore` — `offer_id`, `criterion_id`, `score`, `rationale`; `EvaluationReport` — acta, ranking, firmas.

**Regla SoD:** los integrantes de la comisión no pueden ser el requirente de la SOLPED ni quien elaboró las bases técnicas ⚠ **propuesta — validar con jurídica el alcance exacto de las inhabilidades**.

**Borde:** Dependencia condicional FirmaGob (firmas del acta); evento `EvaluationCompleted`. **Edge cases:** integrante con conflicto sobreviniente → reemplazo por acto modificatorio, trazado; empate en ranking → criterio de desempate debe estar en las bases (validación en 3.1: bases sin criterio de desempate generan advertencia).

---

## 3.10 — Resolución de adjudicación (o deserción / inadmisibilidad general)

| Materia | Valor |
|---|---|
| Unidad municipal | Alcaldía / autoridad + Departamento Jurídico (revisión previa) |
| Rol | Aprobador |
| Plataforma | SGM → Mercado Público |
| Obligatoriedad | **Obligatorio** (en alguna de sus variantes: adjudica, declara desierta o revoca) |
| Interacción MP | **Gestión** |

**Detalle:** Sobre el acta, la autoridad dicta el acto terminal: **adjudicación** al ranking (o distinta del ranking, con fundamentación reforzada), **deserción** (sin oferentes o todos inadmisibles/inconvenientes) o **revocación** por interés público. Reutiliza `LegalReview` (revisión jurídica previa) y `AdministrativeAct` (firma). El acto se publica **en MP** por el usuario. La lectura de la **Resolución de Adjudicación publicada** trae monto real y RUT del adjudicatario y gatilla el **ajuste de la preobligación al monto adjudicado** (`adjustPreCommitment` → Presupuestos) — el compromiso cierto espera a la OC aceptada (3.14).

**Lecturas MP:** Resolución de Adjudicación publicada — **deseada**; degradado: registro manual de monto y RUT al publicar. **Edge cases:** deserción → decisión posterior: relicitar (nuevo proceso MP, mismo expediente) o Trato Directo por causal de licitación desierta (reversión a etapa 2 con la causal precargada — ver `procesos-transversales/2-modalidad-compra.md` §2.1); adjudicación distinta del ranking → fundamentación obligatoria y visible en auditoría.

---

## 3.11 — Toma de Razón de la adjudicación (Contraloría)

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento (tramita) / — (resuelve CGR) |
| Rol | Usuario |
| Plataforma | SGM / Otra (plataforma CGR) |
| Obligatoriedad | **Condicional** — según umbral vigente de Toma de Razón (`NormativeParameter`) |

**Detalle:** Mismo mecanismo y entidad que 3.4 (`ComptrollerReview` sobre el acto de adjudicación). Representación → la adjudicación se cae: corregir y repetir 3.10, o deserción.

---

## 3.12 — Garantía de Fiel Cumplimiento

| Materia | Valor |
|---|---|
| Unidad municipal | Tesorería (custodia) + DAF Abastecimiento (verifica) |
| Rol | Usuario |
| Plataforma | SGM |
| Obligatoriedad | **Condicional** — obligatoria sobre umbral (`NormativeParameter`); las bases pueden exigirla bajo él |

**Detalle:** El adjudicatario entrega la garantía de fiel cumplimiento **antes de la suscripción del contrato / emisión de OC**, según las bases. Reutiliza `Guarantee` (`performance_bond`) y el borde a Tesorería de 3.7. Su vigencia debe cubrir el contrato más el margen que fijen las bases; timer sobre `expiry_date` para renovaciones en contratos largos.

**Edge cases:** adjudicatario no entrega garantía en plazo → tratamiento como no suscripción (ver 3.13).

---

## 3.13 — Contrato

| Materia | Valor |
|---|---|
| Unidad municipal | Departamento Jurídico (redacción) + Alcaldía (firma) |
| Rol | Usuario / Aprobador |
| Plataforma | SGM |
| Obligatoriedad | **Condicional** — obligatorio sobre umbral o cuando las bases lo establecen; bajo él, las bases pueden disponer que la OC formaliza el contrato |

**Detalle:** Redacción sobre bases + oferta adjudicada, firma de ambas partes (FirmaGob por el municipio; firma del proveedor según canal definido ⚠ pendiente: mecanismo de firma del contratista — FEA propia, firma en papel digitalizada, plataforma). El contrato queda en el expediente con su acto aprobatorio.

**Entidades:** `Contract` *(nueva)* — `procurement_case_id`, `awarded_offer_ref`, `amount`, `start_date`/`end_date`, refs. documento y acto, `status`.

**Edge cases (crítico):** **adjudicatario no suscribe en plazo** → cobro/ejecución de la Garantía de Seriedad (3.7, `status = executed`, borde a Tesorería) y facultad de **readjudicar al siguiente del ranking** (reejecuta 3.10 con el acta vigente) o declarar desierta. Camino de primera clase, no nota al pie.

---

## 3.14 — Emisión y aceptación de la OC

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Usuario |
| Plataforma | Mercado Público → SGM |
| Obligatoriedad | **Obligatorio** |
| Interacción MP | **Gestión — hito contable de la etapa** |

**Detalle:** Emisión de la OC en MP referida a la adjudicación; la **aceptación del proveedor** (lectura **confirmada**, la única) gatilla — igual que CA 3.4 — el **Compromiso Cierto** vía `commitBudget` por el monto adjudicado (la preobligación ya fue ajustada en 3.10, así que la diferencia esperable es cero; si no lo es, mismo tratamiento de ajuste/regularización), el avance a Recepción Conforme (etapa 4 transversal) y las notificaciones. Idempotencia por `purchase_order_ref`.

**Edge cases:** rechazo de OC post-contrato → anomalía grave (hay contrato suscrito): tarea a jurídica, no auto-resolución; comparte mecánica con CA 3.5 solo si no hay contrato.

---

## Resumen de entidades — Etapa 3 (LP)

| Entidad | Relación | Notas |
|---|---|---|
| `TenderBases` + `EvaluationCriterion` | 1:1 / 1:N con `ProcurementCase` | Criterios estructurados con pesos que suman 100 — la evaluación se valida contra ellos |
| `LegalReview` | Polimórfica | **Transversal** — bases, adjudicación, Resolución Fundada de TD |
| `AdministrativeAct` | Polimórfica | **Transversal** — generaliza el patrón `PaymentDecree` (REVISAR fusión futura) |
| `ComptrollerReview` | 1:N con `AdministrativeAct` | **Transversal** — reutilizable en TD |
| `Guarantee` | 1:N con `ProcurementCase` | **Transversal** — seriedad y fiel cumplimiento; custodia en Tesorería |
| `EvaluationCommittee` / `CommitteeMember` / `OfferRecord` / `EvaluationScore` / `EvaluationReport` | — | Núcleo de la evaluación; declaración de conflictos bloqueante |
| `Contract` | 1:1 con `ProcurementCase` | Condicional según umbral/bases |

> Nota de reconciliación: estas entidades aún no están incorporadas a `modelo-datos/entidades-core.md` — esta pasada solo cubrió la concordancia de la vinculación MP (etapa 2 §2.3 ↔ etapa 3 §3.5). Su incorporación al modelo canónico queda como trabajo pendiente separado.

## Resumen de bordes — Etapa 3 (LP)

| Sub-paso | Contrato / Evento | Contraparte | Nota |
|---|---|---|---|
| 3.3, 3.9, 3.10, 3.13 | `requestSignature` / `confirmSignature` | FirmaGob | Síncrona bloqueante |
| 3.4, 3.11 | — (registro manual + documento) | Contraloría | Sin API asumida; ⚠ explorar canal |
| 3.5 | `readMpProcess`, `linkMpProcess`, `MpProcessLinked` | Mercado Público | Vinculación diferida de 2.3 |
| 3.6, 3.8, 3.10 | `readMpProcess` (foro, apertura, adjudicación) | Mercado Público | Lecturas **deseadas** |
| 3.7, 3.12, 3.13 | `registerGuaranteeCustody`, ejecución de garantía | Tesorería | Nueva dependencia de módulo |
| 3.10 | `adjustPreCommitment` | Presupuestos | Ajuste a monto adjudicado |
| 3.14 | `readMpProcess` (OC Aceptada, **confirmada**), `commitBudget`, `PurchaseOrderAccepted` | MP + Presupuestos | Hito contable |

**Etapa anterior:** [2. Modalidad de Compra](../procesos-transversales/2-modalidad-compra.md) · **Siguiente etapa:** [4. Recepción Conforme](../procesos-transversales/4-recepcion-conforme.md) *(transversal; en LP con servicios continuos, recepción recurrente)*

> ⚠ **Pendientes de la etapa (a registro central):** umbrales de Toma de Razón, comisión obligatoria, garantías y contrato como `NormativeParameter` con carga verificada; canal de consulta de estado CGR; criterio jurídico de aclaración que exige acto formal; inhabilidades exactas de integrantes de comisión; mecanismo de firma del contratista. *(El ajuste de vinculación diferida por modalidad, antes pendiente aquí, ya fue propagado a `2-modalidad-compra.md` §2.3 y se da por cerrado en esta pasada.)*
