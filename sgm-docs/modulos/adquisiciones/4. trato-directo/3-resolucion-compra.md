# 3. Resolución de Compra — Trato Directo

*Etapa organizador común: el nombre es compartido entre modalidades, pero su contenido es específico de cada una. En Trato Directo la etapa cubre (1) Toma de Razón condicional de la Resolución Fundada si el monto supera 8.000 UTM, (2) publicación en Mercado Público con vinculación diferida de 2.3 (regla de publicidad en 24 horas), y (3) el hito contable de doble validación **Publicado + OC Aceptada** → Compromiso Cierto. No hay acto contractual formal aparte de la Resolución Fundada (etapa 1/2) y la OC aceptada.*

*Toda la etapa se rige por el estándar MP ↔ SGM de [`plantilla-maestra-sgm.md`](../../../arquitectura/instrucciones/plantilla-maestra-sgm.md) §5: integración solo lectura, clasificación Informativo/Gestión, lecturas confirmadas vs. deseadas y modo degradado. Lectura confirmada disponible hoy: **OC Aceptada**. La lectura de proceso **Publicado** es **deseada** y forma parte de la doble validación previa al compromiso.*

*Roles de la fila **Rol:** nombre (usuarios) + código (sistema) según el catálogo transversal [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md) (P-24).*

**Fuente base:** diagrama BPMN de carriles `Adquisiciones: Trato Directo (SGM Integrado)` + overview de la modalidad + tabla de vinculación en [`2-modalidad-compra.md`](../procesos-transversales/2-modalidad-compra.md) §2.3.

---

## 3.1 — Toma de Razón de la Resolución Fundada *(condicional)*

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento (tramita) / — (resuelve CGR) |
| Rol | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM / Otra (plataforma CGR) |
| Optativo | **Condicional** — solo si el monto supera el umbral de Toma de Razón vigente (`NormativeParameter`; V5 en etapa 2 es advisory; aquí se ejecuta el trámite) |

**Detalle:** Remisión a Contraloría de la **Resolución Fundada** (acto que sostiene el Trato Directo) y espera del pronunciamiento. Resultados: toma de razón (continúa a 3.2), **representación/reparo** (el proceso se cae → obligación de licitar: reversión a etapa 2 con modalidad LP, o cancelación), o toma de razón con alcance. Reutiliza el patrón transversal de LP §3.4/`ComptrollerReview`.

**Entidad(es) y campos:**
- `AdministrativeAct` — `act_type = founded_resolution`, `procurement_case_id`, `status = signed`, `document_ref` (la Resolución Fundada ya adjuntada en etapa 1/2 vía `PurchaseRequest.founded_resolution_attachment`; aquí se materializa como acto formal sujeto a CGR)
- `ComptrollerReview` *(transversal, reutilizable desde LP)* — `administrative_act_id`, `submitted_at`, `outcome` (`approved` / `approved_with_remarks` / `rejected`), `outcome_at`, `official_document_ref`

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (registro manual) | `submitToComptroller` | Contraloría (sin integración API asumida) | Asíncrona | Envío |
| 2 | Sistema externo (registro manual) | `recordComptrollerOutcome` | Contraloría | Asíncrona | `ComptrollerReview` |
| 3 | Evento | `ComptrollerReviewRecorded` | — | Asíncrona | Outcome |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Registrar envío a Contraloría | `submitToComptroller` | `MISSING_REQUIRED_FIELD` | `submitted_at` | El campo Fecha de envío es obligatorio. | blocking |
| Registrar resultado CGR | `recordComptrollerOutcome` | `MISSING_REQUIRED_FIELD` | `outcome` | El campo Resultado de Contraloría es obligatorio. | blocking |
| Registrar resultado CGR | `recordComptrollerOutcome` | `MISSING_REQUIRED_FIELD` | `official_document_ref` | El oficio o documento de respaldo es obligatorio. | blocking |

**Edge cases:**
- Representación/reparo → proceso se cae; obligación de licitar (overview TD). El expediente no avanza a 3.2; se abre tarea de reversión a etapa 2.
- Canal de consulta de estado CGR — **[PENDIENTE P-64]** (mismo que LP; no asumir API).

---

## 3.2 — Publicación en Mercado Público y vinculación

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | Mercado Público → SGM |
| Optativo | Falso |
| Interacción MP | **Gestión** (registro del ID); luego informativo |

**Detalle:** Tras la tramitación completa de la Resolución Fundada (y Toma de Razón si aplicó en 3.1), el usuario publica el Trato Directo **en MP** dentro del plazo legal de **24 horas** y registra en SGM el **ID del proceso publicado**, ejecutando aquí la vinculación diferida de 2.3: validación `readMpProcess` (existencia, organismo, tipo `direct_procurement`), `mp_process_id` en `ProcurementCase`, evento `MpProcessLinked`, inicio de sincronización. Sin este vínculo no hay doble validación ni Compromiso Cierto.

**Lecturas MP:** estado Publicado del proceso — **deseada** (primera pata de la doble validación).
**Modo degradado:** paso **Pendiente en MP** + deep link de publicación; el vínculo y el badge de Publicado se materializan solo con lectura / tras `linkMpProcess`.

**Entidad(es) y campos:**
- `ProcurementCase` (actualiza) — `mp_process_id` (texto, **obligatorio**), `mp_linked_at`, `mp_process_type` (coherente con `direct_procurement`)
- `CaseStep` — avance del paso

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (deep link) | — (navegación pura) | Mercado Público | — | — |
| 2 | Sistema externo (lectura) | `readMpProcess` | Core (Mercado Público) | Síncrona bloqueante (solo en la vinculación) | Validación del ID |
| 3 | Operación | `linkMpProcess` | — (Adquisiciones) | — | `mp_process_id` |
| 4 | Evento | `MpProcessLinked` | — | Asíncrona | `ProcurementCase` |

**Validaciones:** *(reutiliza íntegramente 2.3)*

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Vincular proceso MP | `linkMpProcess` | `MISSING_REQUIRED_FIELD` | `mp_process_id` | El campo Código / ID de proceso MP es obligatorio. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROCESS_NOT_FOUND` | `mp_process_id` | El proceso MP no existe o el código es inválido. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROCESS_ORGANISM_MISMATCH` | `mp_process_id` | El organismo comprador del proceso MP no coincide con el municipio. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROCESS_TYPE_MISMATCH` | `mp_process_id` | El tipo de proceso MP no coincide con la modalidad confirmada. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROCESS_ALREADY_LINKED` | `mp_process_id` | El código MP ya está vinculado a otro expediente. | blocking |
| Vincular proceso MP | `linkMpProcess` | `MP_PROVIDER_UNAVAILABLE` | — | Mercado Público no está disponible para validar el vínculo. | blocking |

**Edge cases:**
- Los cuatro bloqueos de 2.3 aplican idénticos.
- Publicación fuera del plazo de 24 h → riesgo administrativo; SGM no bloquea por reloj legal (fuera de alcance de control automático) pero el expediente deja trazabilidad de `mp_linked_at` vs. fecha de firma del acto — **[PENDIENTE P-71]** si se exige control bloqueante de plazo.
- API MP no disponible — **[PENDIENTE P-32]**.

---

## 3.3 — Emisión de OC y aceptación del proveedor *(hito contable)*

| Materia | Valor |
|---|---|
| Unidad municipal | — (acto del proveedor en MP; efectos automáticos en SGM) |
| Rol | N/A |
| Plataforma | Mercado Público → SGM |
| Optativo | Falso *(excluyente con 3.4)* |
| Interacción MP | **Gestión — hito contable de la etapa** |

**Detalle:** Mercado Público emite la OC al proveedor sobre el Trato Directo publicado (3.2) y el proveedor la acepta. Ese acto, **junto con** la confirmación de proceso Publicado (3.2), perfecciona la doble validación exigida por el overview de la modalidad y dispara en SGM, automáticamente: (1) espejo de `PurchaseOrder` con datos definitivos; (2) `commitBudget` por el monto real de la OC (ajuste contra preobligación 1.6); (3) avance a recepción conforme. El diagrama BPMN condensaba emisión+aceptación en un solo nodo; aquí se modela el efecto en SGM como el hito de sync confirmado (mismo patrón que CA §3.4 / CM §3.7 / LP §3.14).

**Lecturas MP:** OC Aceptada — **confirmada**. Estado Publicado del proceso vinculado — **deseada** (prerrequisito de doble validación; si la lectura de Publicado no está disponible, el compromiso no procede — ver validaciones).
**Modo degradado:** sin lectura de Publicado, el expediente muestra "vinculado, pendiente confirmación Publicado"; sin OC Aceptada, "esperando aceptación".

**Entidad(es) y campos:**
- `PurchaseOrder` — creada/actualizada **solo por sync**: `procurement_case_id` (ref., **obligatorio**), `mp_oc_id`, `supplier_rut`, `total_amount`, `status` (= `accepted`), `acceptance_date` / `accepted_at`
- `BudgetCommitment` *(canónica en `entidades-core.md`)* — vía `commitBudget`: `purchase_order_id`, `budget_pre_commitment_id`, `committed_amount`, `commitment_date`, `source` (= `api_event`)
- `CaseStep` — cierre de etapa 3

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, **confirmada**) | `readMpProcess` — OC Aceptada | Core (Mercado Público) | Asíncrona | N° OC, proveedor, monto, fecha |
| 2 | Dependencia | `commitBudget` | Presupuestos | **Síncrona bloqueante** | Preobligación + monto real |
| 3 | Operación | `syncPurchaseOrderAccepted` | — (Adquisiciones) | Asíncrona (gatillada por lectura) | `PurchaseOrder` + `BudgetCommitment` |
| 4 | Evento | `PurchaseOrderAccepted` / `BudgetCommitmentCreated` | — | Asíncrona | Hito contable |

> **Clasificación del borde de lectura:** asíncrona, agnóstica de push vs. polling (mismo patrón CA/CM/LP vía `MpProcessSnapshot.source`). El mecanismo exacto de entrega (webhook vs. polling) queda abierto — **[PENDIENTE P-70]**.

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Sincronizar OC aceptada | `syncPurchaseOrderAccepted` | `MP_PROCESS_NOT_PUBLISHED` | — | El proceso MP vinculado no figura como Publicado; no se registra Compromiso Cierto. | blocking |
| Sincronizar OC aceptada | `syncPurchaseOrderAccepted` | `BUDGET_UNAVAILABLE` | — | La línea presupuestaria no tiene saldo disponible para el monto real de la OC. | blocking |
| Sincronizar OC aceptada | `syncPurchaseOrderAccepted` | `MP_PROVIDER_UNAVAILABLE` | — | Mercado Público no está disponible para leer el estado de la OC. | blocking |
| Sincronizar OC aceptada | `syncPurchaseOrderAccepted` | `PRE_COMMITMENT_INACTIVE` | — | La preobligación ya no está activa; no se puede registrar el compromiso cierto. | blocking |

**Edge cases:**
- Monto real ≠ preobligación → mismo ajuste que CA §3.4 (**[PENDIENTE P-40]** si falta saldo).
- Preobligación revertida — código `PRE_COMMITMENT_INACTIVE`.
- Proveedor de presupuesto caído → reintento; expediente en "aceptada, compromiso pendiente".

---

## 3.4 — Rechazo de la OC *(excluyente con 3.3)*

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | Mercado Público → SGM |
| Optativo | Falso *(excluyente con 3.3)* |
| Interacción MP | **Gestión** |

**Detalle:** El proveedor rechaza la OC o no responde en plazo. No hay vínculo legal ni Compromiso Cierto (la preobligación se mantiene). En Trato Directo suele haber un solo proveedor seleccionado: el overview indica que el TD queda sin efecto y se requiere **nuevo proceso con nueva justificación**. SGM crea tarea de decisión tras la lectura.

**Lecturas MP:** OC Rechazada / plazo vencido sin aceptación — **deseada**.
**Modo degradado:** badge **Esperando sync MP** + deep link; la tarea de decisión se crea solo con la lectura.

**Entidad(es) y campos:**
- Pantalla: `decision` (enum, **obligatorio** — valores propuestos: `restart_modality` \| `cancel`) — **única acción editable en SGM**
- `PurchaseOrder` (sync) — `status` (= `rejected_by_supplier`), `rejection_reason` (opcional)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, deseada) | `readMpProcess` — OC Rechazada | Core (Mercado Público) | Asíncrona | Estado, motivo |
| 2 | Operación | `recordPurchaseOrderRejectionDecision` *(reutiliza patrón CM §3.8; enum de decisión específico TD)* | — | — | `decision` |
| 3 | Evento | `PurchaseOrderRejected` | — | Asíncrona | `PurchaseOrder` |

**Validaciones:** Sin validaciones de formulario de captura MP — decisión de navegación tras sync; obligatoriedad de `decision` es de UI local. Si `decision = cancel` → `releasePreCommitment`.

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Confirmar decisión (cancelar) | `releasePreCommitment` | `BUDGET_PROVIDER_UNAVAILABLE` | — | El proveedor de presupuesto no está disponible. | blocking |

**Edge cases:**
- Camino exacto post-rechazo (¿reinicio desde 2.1 con nueva Resolución Fundada? ¿cancelación total?) — **[PENDIENTE P-69]** validar con unidad de negocio / división de municipalidades. Mientras tanto el prototipo expone las dos opciones propuestas sin cerrar la regla de negocio.

---

## Resumen de entidades — Etapa 3

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `AdministrativeAct` (`founded_resolution`) | 1:1 con caso (si aplica CGR) | Materializa la Resolución Fundada para Toma de Razón |
| `ComptrollerReview` | 1:1 con acto | Solo si monto > umbral; reutiliza patrón LP |
| `ProcurementCase` | Raíz | `mp_process_id` se fija en 3.2 (vinculación diferida) |
| `PurchaseOrder` | 1:N con caso | Espejo de MP; fuente de verdad legal es MP |
| `BudgetCommitment` | 1:1 con OC aceptada | **Canónica** — creada vía `commitBudget` en 3.3 |
| `BudgetPreCommitment` | Referencia etapa 1 | Se ajusta (3.3) o libera (3.4 cancelación) |

## Resumen de bordes — Etapa 3

| Sub-paso | Tipo | Contrato o Evento | Contraparte | Lectura MP |
|---|---|---|---|---|
| 3.1 | Registro manual + Evento | `submitToComptroller`, `recordComptrollerOutcome`, `ComptrollerReviewRecorded` | Contraloría | — |
| 3.2 | Deep link + Operación + Evento | `linkMpProcess`, `readMpProcess`, `MpProcessLinked` | Core (Mercado Público) | Deseada (Publicado) |
| 3.3 | Lectura + Dependencia + Evento | `syncPurchaseOrderAccepted`, `commitBudget`, `PurchaseOrderAccepted` | MP + Presupuestos | **Confirmada** (OC Aceptada) |
| 3.4 | Lectura + Operación + Evento | `readMpProcess`, `recordPurchaseOrderRejectionDecision`, `PurchaseOrderRejected` | Core (Mercado Público) | Deseada |

---

**Navegación:** Etapa anterior: [2. Modalidad de Compra](../procesos-transversales/2-modalidad-compra.md) · Etapa siguiente: [4. Recepción Conforme](../procesos-transversales/4-recepcion-conforme.md)
