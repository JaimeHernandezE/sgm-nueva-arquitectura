# 2. Modalidad de Compra

*Proceso transversal — documentado en el piloto [Compra Ágil](../1.%20compra-agil/overview.md). La **entrada** de la etapa es común a las 4 modalidades (ratificación con validaciones y vinculación MP); la **salida** deriva al subproceso específico de la modalidad confirmada. Extensión a otras modalidades pendiente de validación del piloto.*

*Roles de la fila **Rol:** nombre (usuarios) + código (sistema) según el catálogo transversal [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md) (P-24).*

## 2.1 — Ratificación o selección de modalidad

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Finanzas |
| Rol | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** Sobre la SOLPED con preobligación activa (1.6), el usuario de DAF Finanzas **ratifica** la modalidad indicada en la SOLPED o **selecciona** una si venía sin indicación (`purchase_modality` es opcional en 1.1). El sistema ejecuta el **gateway de validación de modalidad**: un conjunto de reglas que guían al usuario hacia la modalidad legalmente correcta según monto, catálogo y causales. Las validaciones bloqueantes impiden confirmar una modalidad improcedente; las asesoras informan sin bloquear. Al confirmar, se fija `ProcurementCase.procurement_type` (nullable hasta este momento) y **se instancian dinámicamente los `CaseStep` del subproceso de la modalidad** en el expediente.

**Reglas del gateway de validación:**

| # | Regla | Resultado si falla | `error_code` | Severidad |
|---|---|---|---|---|
| V1 | Monto total estimado ≤ 100 UTM para Compra Ágil | Compra Ágil no seleccionable | `MODALITY_AMOUNT_EXCEEDED` | `blocking` |
| V2 | Si el bien/servicio existe en catálogo Convenio Marco (con cobertura regional), CM es primera opción legal | Elegir otra modalidad exige `catalog_bypass_justification` (ej. precio externo menor con igualación rechazada) | `FRAMEWORK_AGREEMENT_FIRST_OPTION` | `blocking` sin justificación |
| V3 | Trato Directo requiere causal legal del catálogo (art. Ley 19.886) + Resolución Fundada adjunta (heredada de 1.1 o adjuntada aquí) | TD no confirmable | `DIRECT_PROCUREMENT_CAUSE_REQUIRED` | `blocking` |
| V4 | Monto > 100 UTM y sin CM aplicable → Licitación Pública es la vía general | Sugerencia de LP al usuario | `PUBLIC_TENDER_SUGGESTED` | `advisory` |
| V5 | TD con monto > 8.000 UTM → advertencia de Toma de Razón de Contraloría (plazos de semanas) | Informa, no bloquea | `COMPTROLLER_REVIEW_REQUIRED` | `advisory` |
| V6 *(propuesta, no confirmada en fuente)* | Detección de posible fraccionamiento: compras similares de la misma unidad en ventana reciente cuya suma supera 100 UTM | Advertencia con detalle de las compras relacionadas | `SPLITTING_SUSPECTED` | `advisory` |
| V7 | LP: derivación automática del **tramo de licitación** según monto en UTM, informando el **plazo mínimo de publicación** asociado al tramo (los plazos crecen con el monto, hasta 20–30 días corridos en tramos superiores) | Informa tramo y plazo mínimo al confirmar LP — el usuario conoce la duración comprometida antes de derivar al subproceso | `TENDER_TIER_INFO` | `advisory` |
| V8 | LP: **garantías exigibles según monto** — seriedad de la oferta y fiel cumplimiento sobre sus respectivos umbrales | Informa qué garantías exigirá el subproceso (impacta a los oferentes y los tiempos) | `TENDER_GUARANTEES_REQUIRED` | `advisory` |

> **Asimetría del gateway (deliberada y legalmente correcta):** Licitación Pública es la vía general de la Ley 19.886 y **nunca se bloquea** — es procedente a cualquier monto, incluso bajo 100 UTM (licitación voluntaria). Las validaciones bloqueantes existen solo para las tres modalidades excepcionales, que requieren acreditar procedencia (umbral, catálogo, causal). Las validaciones de LP son de **derivación**: no cuestionan la elección, sino que informan sus consecuencias (tramo, plazos, garantías) en el momento de decidir.

> **Parámetros normativos configurables:** la lógica de las reglas V1–V8 vive en código; los **valores numéricos** (umbral de Compra Ágil, umbral de Toma de Razón, tramos de licitación, umbrales de garantías, ventana de fraccionamiento) viven en configuración administrable — entidad `NormativeParameter`. Reglas de gobernanza: (a) administración a **nivel plataforma por SUBDERE**, nunca por tenant — son valores legales nacionales, distintos de los parámetros operativos por municipio como los timers de escalamiento; (b) cada valor tiene **vigencia temporal** (`valid_from`): las validaciones usan el valor vigente a la fecha de la decisión, y `ModalityDecision.validation_results` congela los valores aplicados para auditoría retrospectiva; (c) el cambio de un parámetro normativo es un **acto auditado con doble control** (quien propone no aprueba) y emite evento `NormativeParameterChanged`. Con esto, un cambio legal de umbral se aplica por configuración con fecha de vigencia, sin despliegue de código.

> La conversión CLP ↔ UTM usa el valor UTM del mes en curso, obtenido de fuente oficial (ver borde). El monto evaluado es el total estimado de la SOLPED (`estimated_amount` de la preobligación).

**Entidad(es) y campos:**
- `ModalityDecision` — `procurement_case_id` (ref., **obligatorio**), `selected_modality` (enum, **obligatorio**), `ratified` (booleano, **obligatorio**), `catalog_bypass_justification` (texto, **obligatorio si** aplica V2), `direct_procurement_cause` (ref., **obligatorio si** TD), `validation_results` (JSON, **obligatorio**), `requires_jefatura_approval` (booleano, **opcional**), `decided_by` (ref., **obligatorio**), `decided_at` (fecha, **obligatorio**)
- Pantalla: `estimated_amount` (número CLP, **obligatorio** — entrada para gateway V1–V8)
- `ProcurementCase.procurement_type` (enum, **obligatorio** desde este sub-paso)
- `CaseStep` — instancias creadas dinámicamente según la modalidad confirmada
- `UtmValue` (nueva, referencia) — `month`, `year`, `value_clp`, `source`
- `ModalityDecision.requires_jefatura_approval` (booleano) — control capturado en este mismo sub-paso: si el usuario lo marca, el expediente pasa por 2.2 antes de continuar a 2.3; si no, 2.2 se omite. Ver nota en 2.2.

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | `getUtmValue` | Core (SII) | Cacheada (frescura mensual) | `UtmValue` (`month`, `year`, `value_clp`) |
| 2 | Dependencia | `checkCatalogAvailability` | Catálogo CM espejado (sincronización diferencial MP) | Cacheada (frescura diaria, según deltas del catálogo) | Entrada: `item_code` / descripción, `region` — Respuesta: `available` (bool), `catalog_price`, `provider_count` |
| 3 | Operación | `confirmProcurementModality` | — (Adquisiciones) | — | Entrada: `selected_modality`, justificaciones condicionales — Respuesta: `ModalityDecision`, `CaseStep[]` instanciados |
| 4 | Evento | `ProcurementModalityConfirmed` | — (consumidores: expediente, reportería, auditoría) | Asíncrona | `ModalityDecision`, `ProcurementCase` (`id`, `procurement_type`) |

**Validaciones:** *(gateway V1–V8 → acción Confirmar modalidad; detalle normativo arriba)*

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Confirmar modalidad | `confirmProcurementModality` | `MISSING_REQUIRED_FIELD` | `selected_modality` | El campo Modalidad de compra es obligatorio. | blocking |
| Confirmar modalidad | `confirmProcurementModality` | `MODALITY_AMOUNT_EXCEEDED` | `selected_modality` | Compra Ágil no procede: el monto estimado supera el umbral en UTM vigente. | blocking |
| Confirmar modalidad | `confirmProcurementModality` | `FRAMEWORK_AGREEMENT_FIRST_OPTION` | `catalog_bypass_justification` | Existe cobertura en Convenio Marco; se exige justificación para elegir otra modalidad. | blocking |
| Confirmar modalidad | `confirmProcurementModality` | `DIRECT_PROCUREMENT_CAUSE_REQUIRED` | `direct_procurement_cause` | Trato Directo requiere causal legal y resolución fundada. | blocking |
| Confirmar modalidad | `confirmProcurementModality` | `UTM_VALUE_UNAVAILABLE` | — | No hay valor UTM vigente para evaluar umbrales. | blocking |
| Confirmar modalidad | `confirmProcurementModality` | `MODALITY_ALREADY_CONFIRMED` | — | La modalidad ya está confirmada en este expediente. | blocking |
| Confirmar modalidad | `confirmProcurementModality` | `PUBLIC_TENDER_SUGGESTED` | `selected_modality` | Se sugiere Licitación Pública según monto y cobertura de catálogo. | advisory |
| Confirmar modalidad | `confirmProcurementModality` | `COMPTROLLER_REVIEW_REQUIRED` | `selected_modality` | El monto puede exigir Toma de Razón de Contraloría. | advisory |
| Confirmar modalidad | `confirmProcurementModality` | `SPLITTING_SUSPECTED` | — | Posible fraccionamiento detectado en compras recientes de la unidad. | advisory |
| Confirmar modalidad | `confirmProcurementModality` | `TENDER_TIER_INFO` | `selected_modality` | Tramo de licitación y plazo mínimo de publicación informados. | advisory |
| Confirmar modalidad | `confirmProcurementModality` | `TENDER_GUARANTEES_REQUIRED` | `selected_modality` | Se informarán garantías exigibles según monto. | advisory |
| Confirmar modalidad | `confirmProcurementModality` | `CATALOG_STALE` | — | Catálogo CM fuera de ventana de frescura; V2 se evalúa con advertencia. | advisory |
| Confirmar modalidad | `confirmProcurementModality` | `AGILE_PURCHASE_AVAILABLE` | `selected_modality` | Existe Compra Ágil como vía más expedita para este monto. | advisory |

**Edge cases:**
- Modalidad de la SOLPED contradice el gateway (ej. venía como Compra Ágil y el monto supera 100 UTM) → el sistema no permite ratificar; usuario debe seleccionar modalidad válida; el cambio queda en auditoría con ambos valores.
- Ítem en catálogo CM pero usuario selecciona otra modalidad sin justificación → `FRAMEWORK_AGREEMENT_FIRST_OPTION` (`severity: blocking`).
- Fuente UTM no disponible y sin valor cacheado del mes en curso → `UTM_VALUE_UNAVAILABLE` (`severity: blocking`) — la validación de umbral no puede ejecutarse sin valor vigente.
- Catálogo CM desactualizado (última sincronización fuera de ventana de frescura) → V2 se ejecuta con advertencia `CATALOG_STALE` (`severity: advisory`) indicando fecha de último delta.
- Monto de la SOLPED en el borde exacto del umbral (= 100 UTM) → inclusive para Compra Ágil ("hasta 100 UTM").
- LP seleccionada con monto ≤ 100 UTM → **permitido** (licitación voluntaria, vía general); advertencia asesora `AGILE_PURCHASE_AVAILABLE` informando que existe una modalidad más expedita.
- Cambio de modalidad **después** de confirmada → no permitido por esta operación; requiere reversión formal del expediente — **[PENDIENTE P-34]** procedimiento de reversión de modalidad post-confirmación.
- Reingreso por deserción de LP → el gateway se reejecuta con la causal de TD (licitación desierta) precargada como candidata; la `ModalityDecision` previa queda histórica, nunca se edita.

> **[PENDIENTE P-34]** Procedimiento de reversión de modalidad post-confirmación (¿anulación de `CaseStep` instanciados con auditoría y nueva `ModalityDecision`?) — candidato a regla transversal del expediente.
> **[PENDIENTE P-35]** Ventana y criterios de la detección de fraccionamiento (V6) — validar con DM y jurídica antes de incorporar a bases.
> **[PENDIENTE P-36]** Catálogo estructurado de causales de Trato Directo (artículo y literal) — derivable de Ley 19.886 y su reglamento.
> **[PENDIENTE P-37]** Carga inicial de `NormativeParameter`: los valores vigentes de tramos de licitación (V7) y umbrales de garantías (V8) según el reglamento post Ley 21.634 deben confirmarse contra la norma actualizada — con el diseño de parámetros configurables, la especificación ya no congela estos números: define los códigos de parámetro y exige su carga inicial verificada contra norma vigente como parte de la puesta en marcha.

---

## 2.2 — Aprobación de modalidad por jefatura

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Finanzas |
| Rol | Aprobador de modalidad ([`adq.aprobador_modalidad`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Condicional a `ModalityDecision.requires_jefatura_approval` (capturado en 2.1) — ⚠ existencia formal aún por confirmar con DM |

**Detalle:** Aprobación de la decisión de modalidad por jefatura DAF antes de la vinculación con Mercado Público. **La existencia misma de este sub-paso está pendiente de ratificación con la DM**: podría exigirse siempre, solo para modalidades sensibles (Trato Directo con seguridad; ¿Licitación Pública?), o no existir como aprobación separada (bastando la decisión registrada de 2.1). Mientras esa ratificación no ocurra, la especificación lo modela como **decisión operativa por expediente**: el usuario marca en 2.1 si quiere solicitar esta aprobación (`requires_jefatura_approval`); si la marca, este sub-paso se ejecuta; si no, se omite y el flujo continúa directo a 2.3. Se documenta la estructura completa para no bloquear la especificación, con el gatillo definitivo (¿siempre obligatorio?, ¿solo por modalidad o monto?) aún pendiente — **[PENDIENTE P-38]**.

**Entidad(es) y campos:**
- `ModalityDecisionApproval` *(sugerida)* — `modality_decision_id` (ref., **obligatorio**), `approver_id` (ref., **obligatorio**), `decision` (enum, **obligatorio**), `comments` (texto, **obligatorio si** `rejected`), `decision_date` (fecha, **obligatorio**)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia *(si se confirma firma)* | `requestSignature`, `confirmSignature` | Core (FirmaGob) | Síncrona bloqueante | Firma de la aprobación, si DM la exige |
| 2 | Evento | `ProcurementModalityApproved` | — (consumidores: expediente, auditoría) | Asíncrona | `ModalityDecisionApproval`, `ProcurementCase.id` |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Aprobar modalidad | `approveModalityDecision` | `SIGNATURE_REQUIRED` | — | Se requiere firma electrónica avanzada válida. | blocking |
| Aprobar modalidad | `approveModalityDecision` | `SIGNATURE_PROVIDER_UNAVAILABLE` | — | FirmaGob no está disponible. | blocking |
| Aprobar modalidad | `approveModalityDecision` | `SEGREGATION_OF_DUTIES_VIOLATION` | `approver_id` | Quien aprueba no puede ser quien decidió la modalidad en 2.1. | blocking |
| Rechazar modalidad | `rejectModalityDecision` | `MISSING_REQUIRED_FIELD` | `comments` | El campo Comentarios es obligatorio al rechazar. | blocking |

**Edge cases:**
- Rechazo de jefatura → `ModalityDecision` queda sin efecto; el flujo retorna a 2.1 para nueva selección (los `CaseStep` instanciados se anulan con auditoría).
- Quien aprueba es quien decidió en 2.1 → evaluar si aplica segregación (`SEGREGATION_OF_DUTIES_VIOLATION`) — por confirmar con DM junto con la existencia del paso.

> **[PENDIENTE P-38]** Si esta aprobación existe siempre, para qué modalidades, si exige firma electrónica, y si aplica segregación decisor/aprobador. Mientras no se ratifique, el sub-paso queda condicionado a la decisión operativa que el usuario capture en 2.1 (`requires_jefatura_approval`), no a un valor fijo.

---

## 2.3 — Vinculación del proceso en Mercado Público (momento según modalidad)

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Finanzas / DAF Abastecimiento |
| Rol | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM → MP (deep link) / SGM |
| Optativo | Condicional por modalidad — inmediata en CA; diferida en CM, LP y TD (ver tabla) |

**Detalle:** La etapa 2 cierra con la modalidad confirmada (2.1, más 2.2 si aplica). La vinculación MP ocurre en el momento que la modalidad define; cuando es diferida, este sub-paso se ejecuta dentro del subproceso de la modalidad, reutilizando íntegramente su operación (`linkMpProcess`), sus validaciones y sus edge cases. El usuario crea el proceso en Mercado Público (vía deep link, actuando directamente en el portal conforme al principio de integración solo lectura) y **registra en SGM el código/ID del proceso MP**, estableciendo el vínculo que habilita las lecturas de estado de ahí en adelante. El identificador registrado y el momento de la vinculación varían según modalidad:

| Modalidad | Momento de vinculación | Código que se registra |
|---|---|---|
| Compra Ágil | Inmediato (cierre de etapa 2) | ID de Cotización |
| Convenio Marco | **Diferido** — sub-paso 3.2 (Compra Directa) o 3.3 (Gran Compra) de su etapa 3, según la ruta que fije el gateway de umbral (3.1) | ID de OC de catálogo (3.2) o de Intención de Compra (3.3, Gran Compra) |
| Licitación Pública | **Diferido** — sub-paso 3.5 de su etapa 3, tras bases aprobadas (y Toma de Razón si aplicó) | ID de la licitación |
| Trato Directo | **Diferido** — en su subproceso, al momento de la publicación (regla de publicidad en 24 horas) | ID del proceso publicado |

Registrado y validado el código — sea la ejecución inmediata o diferida —, el expediente queda bloqueado en estado "vinculado" y **arranca en ese momento** la sincronización de estados (no al cierre de la etapa 2); el seguimiento pasa a las lecturas de estado documentadas en `arquitectura/especificacion/integracion-mercado-publico.md`.

**Entidad(es) y campos:**
- `ProcurementCase.mp_process_id` (texto, **obligatorio** al completar este sub-paso — hoy solo se ejecuta de forma inmediata en Compra Ágil; en CM/LP/TD el sub-paso queda `omitted` aquí y el campo se completa recién en el sub-paso diferido de su etapa 3), `ProcurementCase.mp_linked_at` (fecha, **obligatorio si** `mp_process_id` presente), `ProcurementCase.mp_process_type` (enum, **obligatorio si** `mp_process_id` presente)
- Pantalla: código/ID proceso MP (texto, **obligatorio**)
- `PurchaseRequest.status` (enum, **obligatorio** — transiciona al estado de la modalidad)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (deep link) | — (navegación pura, sin datos transmitidos) | Mercado Público | — | — |
| 2 | Sistema externo (lectura) | `readMpProcess` | Core (Mercado Público) | Síncrona bloqueante (solo en la vinculación) | Entrada: `mp_process_id` — Respuesta: existencia, tipo de proceso, organismo comprador, estado actual |
| 3 | Operación | `linkMpProcess` | — (Adquisiciones) | — | Entrada: `mp_process_id` — valida contra `readMpProcess` antes de persistir |
| 4 | Evento | `MpProcessLinked` | — (consumidores: expediente, servicio de sincronización de estados MP) | Asíncrona | `ProcurementCase` (`id`, `mp_process_id`, `procurement_type`) — gatilla el inicio del polling/webhook de estados |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Vincular proceso MP | `linkMpProcess` | `MISSING_REQUIRED_FIELD` | `mp_process_id` | El campo Código / ID de proceso MP es obligatorio. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROCESS_NOT_FOUND` | `mp_process_id` | El proceso MP no existe o el código es inválido. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROCESS_ORGANISM_MISMATCH` | `mp_process_id` | El organismo comprador del proceso MP no coincide con el municipio. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROCESS_TYPE_MISMATCH` | `mp_process_id` | El tipo de proceso MP no coincide con la modalidad confirmada. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROCESS_ALREADY_LINKED` | `mp_process_id` | El código MP ya está vinculado a otro expediente. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROVIDER_UNAVAILABLE` | — | Mercado Público no está disponible para validar el vínculo. | blocking |

**Edge cases:**
- Código MP inexistente o con formato inválido → `MP_PROCESS_NOT_FOUND` (`severity: blocking`); no se persiste el vínculo.
- Código MP pertenece a otro organismo comprador (RUT no coincide con el municipio tenant) → `MP_PROCESS_ORGANISM_MISMATCH` (`severity: blocking`).
- Tipo de proceso MP no coincide con la modalidad confirmada (ej. ID de licitación vinculado a un expediente de Compra Ágil) → `MP_PROCESS_TYPE_MISMATCH` (`severity: blocking`).
- Código MP ya vinculado a otro expediente del mismo tenant → `MP_PROCESS_ALREADY_LINKED` (`severity: blocking`) — un proceso MP pertenece a un solo expediente.
- API de MP no disponible al validar → `MP_PROVIDER_UNAVAILABLE`; el vínculo no se persiste sin validación — **[PENDIENTE P-32]** resiliencia ante servicios externos.
- Usuario creó el proceso en MP pero no registró el código en SGM → expediente queda detenido al final de la etapa 2 — **[PENDIENTE P-33]** timer de escalamiento.

> Los cinco edge cases anteriores rigen idénticos para las ejecuciones **diferidas** de este sub-paso (Licitación Pública §3.5, Convenio Marco §3.2/3.3, Trato Directo §3.2) — no son exclusivos de la ejecución inmediata en Compra Ágil.

> **[PENDIENTE P-32]** Comportamiento ante `MP_PROVIDER_UNAVAILABLE`: ¿bloqueo total o registro provisional con flag `mp_link_unverified` y validación asíncrona al restablecerse la API? — misma familia del pendiente de caída de API de precios (1.1); candidato a regla transversal de resiliencia ante servicios externos.
> **[PENDIENTE P-33]** Plazo del timer de escalamiento para vínculo no registrado.

---

## Resumen de entidades — Etapa 2

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `ModalityDecision` | 1:N con `ProcurementCase` | Nueva — decisión con resultados de validación y parámetros aplicados congelados para auditoría; N por reversiones |
| `ModalityDecisionApproval` | 1:1 con `ModalityDecision` | Sugerida, no confirmada en fuente — sujeta a ratificación DM (2.2) |
| `NormativeParameter` | Referencia global (nivel plataforma) | Nueva — umbrales legales con vigencia temporal, doble control y auditoría; administra SUBDERE, nunca el tenant |
| `UtmValue` | Referencia global | Nueva — valor UTM mensual, fuente oficial |
| `ProcurementCase` | Raíz del expediente | Se fijan aquí `procurement_type` (2.1) y `mp_process_id` (2.3) |
| `CaseStep` | 1:N con `ProcurementCase` | Instanciación dinámica según modalidad confirmada |

## Resumen de bordes — Etapa 2

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 2.1 | Sistema externo | `getUtmValue` | Core (SII) |
| 2.1 | Dependencia | `checkCatalogAvailability` | Catálogo CM espejado |
| 2.1 | Operación / Evento | `confirmProcurementModality`, `ProcurementModalityConfirmed` | — |
| 2.2 | Dependencia *(condicional)* | `requestSignature`, `confirmSignature` | Core (FirmaGob) |
| 2.2 | Evento | `ProcurementModalityApproved` | — |
| 2.3 | Sistema externo | deep link (navegación), `readMpProcess` | Mercado Público (portal) / Core (Mercado Público) (lectura) |
| 2.3 | Operación / Evento | `linkMpProcess`, `MpProcessLinked` | — |

**Etapa anterior:** [1. SOLPED](./1-solped.md) · **Siguiente etapa:** subproceso específico de la modalidad confirmada (ej. [Compra Ágil — 3. Resolución de Compra](../1.%20compra-agil/3-resolucion-compra.md))
