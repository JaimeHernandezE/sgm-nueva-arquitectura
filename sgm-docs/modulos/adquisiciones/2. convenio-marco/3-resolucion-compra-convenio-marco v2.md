# 3. Resolución de Compra — Convenio Marco

*Etapa organizador común con contenido específico por modalidad. A diferencia de Compra Ágil (monitoreo con puntos de decisión lineales) y Licitación Pública (actos administrativos formales pesados), en Convenio Marco esta etapa combina **una decisión normativa automática** (Gran Compra vs. Compra Directa por Catálogo según umbral UTM) con **monitoreo de estado MP** y el **hito contable de la OC aceptada**. No hay acto administrativo interno obligatorio: el vínculo legal se perfecciona con la aceptación de la OC por el proveedor, igual que en Compra Ágil.*

*Toda la etapa se rige por el estándar MP ↔ SGM de `plantilla-maestra-sgm.md` §5: integración solo lectura, clasificación Informativo/Gestión, lecturas confirmadas vs. deseadas y modo degradado. Lectura confirmada disponible hoy: **OC Aceptada**. Todas las demás lecturas son **deseadas** (dependen de la negociación con ChileCompra); cada sub-paso documenta su modo degradado.*

*✅ **Ajuste a la etapa 2 propagado:** para CM, la vinculación MP (`mp_process_id`) ocurre en este sub-paso 3.2 (Compra Directa) o 3.3 (Gran Compra), no al cierre de la etapa 2 — la lógica es idéntica a la corrección ya documentada en LP §3.5. `2-modalidad-compra.md` §2.3 ya refleja la vinculación diferida por modalidad.*

*Roles de la fila **Rol:** nombre (usuarios) + código (sistema) según el catálogo transversal [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md) (P-24).*

---

## 3.1 — Evaluación de umbral y determinación de ruta

| Materia | Valor |
|---|---|
| **Unidad municipal** | — (decisión automática del sistema) |
| **Rol** | N/A |
| **Plataforma** | SGM |
| **Obligatoriedad** | **Obligatorio** |

**Detalle:** Compuerta automática. El sistema evalúa `ProcurementCase.estimated_amount` contra el umbral de **1.000 UTM**, usando el valor UTM del mes en que se emite la OC (`UtmValue` del mes en curso, mismo objeto que usa el gateway de 2.1). El resultado fija `ProcurementCase.procurement_route` (`gran_compra` | `compra_directa`) y determina qué `CaseStep` se instancian para el resto de la etapa.

**Regla de borde exacto:** monto igual a 1.000 UTM → se enruta a Gran Compra (umbral es "igual o mayor", Art. 90 D.S. 661/2024).

**Regla de variación de UTM entre preobligación y emisión de OC:** si el valor UTM cambia entre el mes de la preobligación (1.6) y el mes de emisión de OC, el sistema recalcula con el UTM vigente al emitir y notifica al usuario si la ruta cambia respecto de la declarada en la SOLPED.

**Fuente normativa confirmada:** Art. 90, D.S. 661/2024 (Reglamento Ley 19.886); operativizado por Directiva N° 15 ChileCompra. El umbral es `NormativeParameter` (`FRAMEWORK_AGREEMENT_GRAN_COMPRA_UTM_LIMIT`) — no se fija en código.

**Entidad(es) y campos:**
- `ProcurementCase` (actualiza):
  - `procurement_route` (enum: `gran_compra` | `compra_directa`) — obligatorio, se fija aquí
  - `route_decided_at` (datetime) — timestamp de la evaluación automática
- `UtmValue` (referencia) — mismo objeto cacheado usado en 2.1; frescura mensual

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | `getUtmValue` | Core (SII) | Cacheada (frescura mensual) | `UtmValue` (`month`, `year`, `value_clp`) |
| 2 | Evento | `ProcurementRouteDecided` | — (consumidores: expediente, `CaseStep` instanciador) | Asíncrona | `ProcurementCase` (`id`, `procurement_route`, `route_decided_at`) |

**Validaciones:** Sin validaciones de formulario — decisión automática del sistema; `UTM_VALUE_UNAVAILABLE` se trata como edge case de dependencia (`getUtmValue`).

**Edge cases:**
- Fuente UTM no disponible y sin valor cacheado del mes en curso → `UTM_VALUE_UNAVAILABLE` (`severity: blocking`); la evaluación de umbral no puede ejecutarse. Mismo edge case que 2.1 — candidato a regla transversal de resiliencia.
- UTM varía y la ruta cambia respecto de la declarada en la SOLPED → el sistema actualiza `procurement_route`, notifica al usuario y ajusta los `CaseStep` instanciados.

> **[PENDIENTE P-37]** Carga inicial del valor `FRAMEWORK_AGREEMENT_GRAN_COMPRA_UTM_LIMIT` en `NormativeParameter` verificada contra norma vigente (misma regla que los umbrales de CA, LP y TD en la etapa 2).

---

## 3.2 — Compra Directa por Catálogo (ruta `compra_directa`)

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| **Plataforma** | SGM → Mercado Público (deep link) |
| **Obligatoriedad** | **Obligatorio** *(condicional a `procurement_route = compra_directa`)* |
| **Interacción MP** | **Gestión** |

**Detalle:** Para compras bajo 1.000 UTM, el usuario navega el catálogo de Convenio Marco directamente en MP (deep link), selecciona los ítems y genera la OC de catálogo. Registra en SGM el **ID de la OC de catálogo**, ejecutando aquí la vinculación MP diferida de la etapa 2: validación `readMpProcess` (existencia, organismo, tipo = OC de catálogo CM), persistencia de `mp_process_id`, evento `MpProcessLinked` e inicio de sincronización de estados. El expediente queda en estado "OC emitida, esperando aceptación".

**Entidad(es) y campos:**
- `ProcurementCase` (actualiza):
  - `mp_process_id` (string) — obligatorio al completar; ID de la OC de catálogo en MP
  - `mp_linked_at` (datetime) — timestamp de la vinculación
  - `mp_process_type` (enum) — se fija en `catalog_oc` para esta ruta

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (deep link) | — (navegación pura, sin datos transmitidos) | Core (Mercado Público) | — | — |
| 2 | Sistema externo (lectura) | `readMpProcess` | Core (Mercado Público) | Síncrona bloqueante (solo en la vinculación) | Entrada: `mp_process_id` — Respuesta: existencia, tipo, organismo, estado actual |
| 3 | Operación | `linkMpProcess` | — (Adquisiciones) | — | Entrada: `mp_process_id` — valida contra `readMpProcess` antes de persistir |
| 4 | Evento | `MpProcessLinked` | — (consumidores: expediente, servicio de sincronización) | Asíncrona | `ProcurementCase` (`id`, `mp_process_id`, `procurement_type`) |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Vincular OC de catálogo | `linkMpProcess` | `MISSING_REQUIRED_FIELD` | `mp_process_id` | El campo Código / ID de proceso MP es obligatorio. | blocking |
| Vincular OC de catálogo | `linkMpProcess` | `MP_PROCESS_NOT_FOUND` | `mp_process_id` | El proceso MP no existe o el código es inválido. | blocking |
| Vincular OC de catálogo | `linkMpProcess` | `MP_PROCESS_ORGANISM_MISMATCH` | `mp_process_id` | El organismo comprador del proceso MP no coincide con el municipio. | blocking |
| Vincular OC de catálogo | `linkMpProcess` | `MP_PROCESS_TYPE_MISMATCH` | `mp_process_id` | El tipo de proceso MP no coincide con la modalidad confirmada. | blocking |
| Vincular OC de catálogo | `linkMpProcess` | `MP_PROCESS_ALREADY_LINKED` | `mp_process_id` | El código MP ya está vinculado a otro expediente. | blocking |
| Vincular OC de catálogo | `linkMpProcess` | `MP_PROVIDER_UNAVAILABLE` | — | Mercado Público no está disponible para validar el vínculo. | blocking |

**Edge cases:**
- Los cuatro bloqueos estándar de vinculación aplican idénticos a 2.3: `MP_PROCESS_NOT_FOUND`, `MP_PROCESS_ORGANISM_MISMATCH`, `MP_PROCESS_TYPE_MISMATCH`, `MP_PROCESS_ALREADY_LINKED` (`severity: blocking` en todos).
- API de MP no disponible al validar → `MP_PROVIDER_UNAVAILABLE`; el vínculo no se persiste sin validación. Ver pendiente transversal de registro provisional.
- Usuario navega MP pero no registra el ID en SGM → expediente queda detenido; candidato a timer de escalamiento (`musts-arquitectura.md` §10.4). **[PENDIENTE P-33]** Plazo concreto por definir.

---

## 3.3 — Publicación de Intención de Compra / Gran Compra (ruta `gran_compra`)

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| **Plataforma** | SGM → Mercado Público (deep link) |
| **Obligatoriedad** | **Obligatorio** *(condicional a `procurement_route = gran_compra`)* |
| **Interacción MP** | **Gestión** |

**Detalle:** Para compras iguales o superiores a 1.000 UTM, el usuario publica en MP la **Intención de Compra** (proceso Gran Compra) dirigida a todos los proveedores adjudicados del Convenio Marco específico. Registra en SGM el **ID de la Intención de Compra**, ejecutando la vinculación MP igual que en 3.2. Se abre un período de competencia de **10 días corridos** (Directiva N° 15 ChileCompra); el expediente queda en estado "Gran Compra en curso" con timer sobre la fecha límite.

**Entidad(es) y campos:**
- `ProcurementCase` (actualiza):
  - `mp_process_id` (string) — obligatorio; ID de la Intención de Compra en MP
  - `mp_linked_at` (datetime)
  - `mp_process_type` (enum) — se fija en `gran_compra_intent`
  - `purchase_intent_published_at` (datetime) — obligatorio
  - `purchase_intent_deadline` (datetime) — calculado: `published_at + 10 días corridos`

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (deep link) | — (navegación pura) | Core (Mercado Público) | — | — |
| 2 | Sistema externo (lectura) | `readMpProcess` | Core (Mercado Público) | Síncrona bloqueante (vinculación) | Entrada: `mp_process_id` — Respuesta: existencia, tipo, organismo, estado |
| 3 | Operación | `linkMpProcess` | — (Adquisiciones) | — | Entrada: `mp_process_id` |
| 4 | Evento | `MpProcessLinked` | — (consumidores: expediente, sincronización, timer de plazo) | Asíncrona | `ProcurementCase` (`id`, `mp_process_id`, `purchase_intent_deadline`) |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Vincular Intención de Compra | `linkMpProcess` | `MISSING_REQUIRED_FIELD` | `mp_process_id` | El campo Código / ID de proceso MP es obligatorio. | blocking |
| Vincular Intención de Compra | `linkMpProcess` | `MP_PROCESS_NOT_FOUND` | `mp_process_id` | El proceso MP no existe o el código es inválido. | blocking |
| Vincular Intención de Compra | `linkMpProcess` | `MP_PROCESS_ORGANISM_MISMATCH` | `mp_process_id` | El organismo comprador del proceso MP no coincide con el municipio. | blocking |
| Vincular Intención de Compra | `linkMpProcess` | `MP_PROCESS_TYPE_MISMATCH` | `mp_process_id` | El tipo de proceso MP no coincide con la modalidad confirmada. | blocking |
| Vincular Intención de Compra | `linkMpProcess` | `MP_PROCESS_ALREADY_LINKED` | `mp_process_id` | El código MP ya está vinculado a otro expediente. | blocking |
| Vincular Intención de Compra | `linkMpProcess` | `MP_PROVIDER_UNAVAILABLE` | — | Mercado Público no está disponible para validar el vínculo. | blocking |

**Edge cases:**
- Mismos cuatro bloqueos de vinculación que 3.2.
- Usuario no publica la Intención de Compra dentro de un plazo razonable tras la evaluación de umbral → timer de escalamiento. **[PENDIENTE P-33]** Plazo concreto por definir.

---

## 3.4 — Período de competencia Gran Compra (10 días)

| Materia | Valor |
|---|---|
| **Unidad municipal** | — (proceso corre en MP; monitoreo automático) |
| **Rol** | N/A |
| **Plataforma** | Mercado Público |
| **Obligatoriedad** | **Obligatorio** *(condicional a `procurement_route = gran_compra`)* |
| **Interacción MP** | **Informativo** |

**Detalle:** Durante 10 días corridos los proveedores adjudicados del Convenio Marco pueden presentar ofertas competitivas. El expediente muestra el estado del período y el plazo restante mediante timer sobre `purchase_intent_deadline`. Al vencimiento, dos caminos excluyentes: al menos una oferta recibida → continúa a 3.5; ninguna oferta → Gran Compra desierta → 3.6.

**Lecturas MP:** estado del período y número de ofertas recibidas — **deseada**.
**Modo degradado:** sin esta lectura, SGM muestra solo el timer sobre `purchase_intent_deadline`; el detalle vive en MP vía deep link.

**Entidad(es) y campos:**
- `CaseStep` (actualiza) — estado del paso, timestamps
- `MpProcessSnapshot` *(sugerida, no confirmada en fuente)* — `procurement_case_id`, `mp_status`, `data` (JSON con payload leído), `read_at`, `source` (`push` | `polling`) — bitácora de sincronización, patrón común con CA

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, deseada) | `readMpProcess` (vía servicio de sincronización) | Core (Mercado Público) | Asíncrona | Estado del proceso, n° ofertas |
| 2 | Evento | `MpStateChanged` (interno, agnóstico de push/polling) | — (consumidores: expediente, notificaciones) | Asíncrona | `MpProcessSnapshot` |

**Validaciones:** Sin validaciones de formulario — monitoreo MP (lectura deseada); sin operación de escritura en SGM.

**Edge cases:**
- MP no disponible durante el período → sin efecto de gestión (paso informativo); la sincronización se retoma con retroceso exponencial.
- Timer vence sin lectura de estado MP → SGM muestra **Pendiente en MP** / posible cierre y deep link; sin tarea de transcripción (plantilla §5.3).

---

## 3.5 — Selección de oferta Gran Compra

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| **Plataforma** | Mercado Público |
| **Obligatoriedad** | **Obligatorio** *(condicional a `gran_compra` con al menos una oferta)* |
| **Interacción MP** | **Informativo** *(candidato a Gestión optativa — ver **[PENDIENTE P-39]**)* |

**Detalle:** Cerrado el período, el usuario compara y selecciona la mejor oferta **en MP**. Para SGM el paso es informativo: refleja que hubo selección y quién fue elegido. A diferencia de CA, en CM no hay revalidación de habilidad del proveedor al emitir la OC desde MP (el proveedor ya está adjudicado al Convenio Marco); sin embargo, la inhabilitación sobreviniente es un edge case que debe tratarse.

**Lecturas MP:** cierre del período y oferta seleccionada (proveedor, monto) — **deseada**.
**Modo degradado:** paso **Pendiente en MP** + deep link; sin campos editables. El `CaseStep` avanza solo con la lectura; luego badge y detalle solo lectura si aplica.

**Entidad(es) y campos:**
- `QuotationResult` *(sugerida, no confirmada en fuente; patrón compartido con CA)* — creada **solo por sync**: `procurement_case_id`, `selected_provider_rut`, `selected_provider_name`, `offered_amount`, `recorded_at`

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, deseada) | `readMpProcess` | Core (Mercado Público) | Asíncrona | Cierre + selección |
| 2 | Evento | `QuotationClosed` | — (consumidores: expediente, notificaciones) | Asíncrona | `QuotationResult` |

**Validaciones:** Sin validaciones de formulario — selección ocurre en MP; `QuotationResult` solo por sync (sin transcripción ni escritura de usuario en SGM).

**Edge cases:**
- Usuario no gestiona la selección en MP dentro de un plazo razonable → timer de escalamiento sobre el `CaseStep`. **[PENDIENTE P-33]** Plazo concreto por definir.
- Sin lectura → el expediente permanece en `Pendiente en MP`; no hay transcripción de proveedor/monto en SGM.

> **[PENDIENTE P-39]** VB interno pre-OC como control configurable por municipio, igual que CA 3.2. Si se confirma, este sub-paso pasa a Gestión condicional.

---

## 3.6 — Gran Compra desierta

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| **Plataforma** | SGM |
| **Obligatoriedad** | **Condicional** *(solo si el período de competencia cierra sin ofertas)* |
| **Interacción MP** | **Gestión** |

**Detalle:** Ningún proveedor presentó oferta en los 10 días. **Confirmado:** el expediente cae automáticamente a **Compra Directa por Catálogo** (`procurement_route` se actualiza a `compra_directa`). El mismo `ProcurementCase` se reutiliza con su folio original — **el expediente no se cancela ni se crea uno nuevo**. Se invalida el `mp_process_id` de la Intención de Compra y el flujo retoma desde 3.2 con un nuevo ID de OC de catálogo. La transición queda trazada en auditoría con ambos valores de `procurement_route`.

**Lecturas MP:** proceso desierto — **deseada**.
**Modo degradado:** vencido `purchase_intent_deadline` sin lectura de selección (3.5), SGM muestra pendiente / posible desierto + deep link; la transición a Compra Directa se confirma cuando llega la lectura de desierto — sin transcribir el estado MP en SGM.

**Entidad(es) y campos:**
- `ProcurementCase` (actualiza):
  - `procurement_route` (enum) — actualiza de `gran_compra` a `compra_directa`
  - `mp_process_id` — se invalida el ID de la Intención de Compra; se registrará nuevo ID en 3.2
  - `mp_linked_at` — se resetea para la nueva vinculación

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, deseada) | `readMpProcess` — proceso desierto | Core (Mercado Público) | Asíncrona | Estado terminal del proceso |
| 2 | Evento | `GranCompraDesierta` | — (consumidores: expediente, notificaciones, reportería) | Asíncrona | `ProcurementCase` (`id`, `mp_process_id` anterior, nueva `procurement_route`) |

**Validaciones:** Sin validaciones de formulario — transición automática a Compra Directa tras lectura de desierto; sin captura de usuario en SGM.

**Edge cases:**
- Desierto reiterado (Gran Compra desierta → Compra Directa → rechazo de OC → ¿nuevo intento?): **[PENDIENTE P-68]** límite de reintentos y acción de escalamiento. Candidato a métrica de reportería (procesos desiertos por Convenio Marco/unidad).

---

## 3.7 — Emisión y aceptación de la OC (hito contable)

| Materia | Valor |
|---|---|
| **Unidad municipal** | — (acto del proveedor en MP; efectos automáticos en SGM) |
| **Rol** | N/A |
| **Plataforma** | Mercado Público → SGM |
| **Obligatoriedad** | **Obligatorio** |
| **Interacción MP** | **Gestión — hito contable de la etapa** |

**Detalle:** El proveedor acepta la OC en MP. Es el **único acto con lectura MP confirmada** de toda esta etapa — la aceptación de OC es la única lectura garantizada hoy por la API de ChileCompra. Al recibirla, SGM ejecuta automáticamente el **Compromiso Cierto** vía `commitBudget` (mismo contrato que CA 3.4 y LP 3.14): síncrono bloqueante contra Presupuestos, ajusta la preobligación al monto real de la OC, libera el excedente si el real es menor, y emite `PurchaseOrderAccepted`. El expediente avanza a Recepción Conforme (etapa 4 transversal).

**Lecturas MP:** OC Aceptada — **confirmada** (única lectura garantizada hoy). Sin modo degradado necesario para el camino feliz.

**Entidad(es) y campos:**
- `PurchaseOrder` *(crea por sync)* — `procurement_case_id`, `mp_oc_number`, `provider_rut`, `amount` (monto real de la OC), `status` (`accepted`), `accepted_at`
- `BudgetCommitment` *(vía contrato con Presupuestos; entidad del módulo Presupuestos)* — referencia resultante en `procurement_case_id`
- `CaseStep` — cierre de etapa 3, apertura de etapa 4

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, **confirmada**) | `readMpProcess` — OC Aceptada | Core (Mercado Público) | Asíncrona | N° OC, RUT proveedor, monto real, fecha de aceptación |
| 2 | Dependencia | `commitBudget` (compromiso por monto real; incluye ajuste contra preobligación) | Proveedor de disponibilidad presupuestaria (Presupuestos SGM o sistema municipal) | **Síncrona bloqueante** | Entrada: `pre_commitment_id`, `real_amount`, `purchase_order_ref` — Respuesta: `BudgetCommitment` o error estructurado |
| 3 | Evento | `PurchaseOrderAccepted` | — (consumidores: expediente, recepción, Contabilidad, notificaciones, terceros vía webhook con scope) | Asíncrona | `PurchaseOrder`, `BudgetCommitment.id` |

**Validaciones:**

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad |
|---|---|---|---|---|---|
| Sincronizar OC aceptada | `syncPurchaseOrderAccepted` | `BUDGET_UNAVAILABLE` | — | La línea presupuestaria no tiene saldo disponible para el monto real de la OC. | blocking |

**Edge cases:**
- **Monto real > preobligación y la línea no tiene saldo para la diferencia** → `commitBudget` responde `BUDGET_UNAVAILABLE` (`severity: blocking`). Situación anómala grave (la OC ya está aceptada legalmente pero el compromiso contable no puede registrarse): tarea urgente a DAF Finanzas para regularización presupuestaria. **[PENDIENTE P-40]** — mismo tratamiento que CA 3.4.
- Monto real < preobligación → compromiso por el real y **liberación automática del excedente** de la preobligación (regla estándar, sin intervención).
- Proveedor de presupuesto no disponible al recibir la lectura → reintento con retroceso; el expediente queda en estado intermedio visible ("OC aceptada, compromiso pendiente") — nunca se pierde el hito ni se duplica el compromiso (idempotencia por `purchase_order_ref`).

---

## 3.8 — Rechazo de la OC

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| **Plataforma** | Mercado Público → SGM |
| **Obligatoriedad** | **Condicional** *(excluyente con 3.7; solo ocurre si el proveedor rechaza)* |
| **Interacción MP** | **Gestión** |

**Detalle:** El proveedor rechaza la OC. Solo puede hacerlo por las causales contractuales establecidas en las bases de licitación del Convenio Marco específico (ej. inconsistencias de valores/cantidades, dirección de despacho inválida). No hay vínculo legal; la preobligación se mantiene intacta. SGM crea tarea de decisión para el usuario: **(a) emitir OC al siguiente proveedor del catálogo** (Compra Directa) o al siguiente oferente (Gran Compra) — reejecuta 3.7 con nuevo proveedor; **(b) republicar** — nuevo proceso MP, nuevo `mp_process_id`; el mismo `ProcurementCase` se reutiliza con su folio original, trazado.

**Lecturas MP:** OC Rechazada — **deseada** (evento crítico a negociar con ChileCompra).
**Modo degradado:** badge **Esperando sync MP** + deep link; sin transcripción del rechazo. La tarea de decisión se crea **solo** cuando llega la lectura.

**Entidad(es) y campos:**
- `PurchaseOrder` *(crea/actualiza por sync en estado `rejected`)* — `procurement_case_id`, `mp_oc_number`, `provider_rut`, `status` (`rejected`), `rejected_at`, `rejection_reason` (si la lectura lo trae)
- Pantalla: decisión del usuario (siguiente proveedor / republicar) — **única acción editable en SGM** tras el evento
- `CaseStep` — reapertura del paso correspondiente según decisión del usuario

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, deseada) | `readMpProcess` — OC Rechazada | Core (Mercado Público) | Asíncrona | Estado, motivo si disponible |
| 2 | Evento | `PurchaseOrderRejected` | — (consumidores: expediente, notificaciones) | Asíncrona | `PurchaseOrder` |

**Validaciones:** Sin validaciones de formulario — decisión de navegación tras sync MP; sin operación de escritura en contrato (la obligatoriedad de la decisión es de UI local).

**Edge cases:**
- No existe proveedor alternativo en catálogo → única vía: republicar o reevaluar modalidad (reversión a etapa 2 con nueva `ModalityDecision`, según procedimiento de reversión pendiente en 2.1).
- Rechazos sucesivos que agotan proveedores disponibles → equivalente funcional a proceso fallido; misma decisión que 3.6. **[PENDIENTE P-68]**.

---

## Resumen de entidades — Etapa 3 (CM)

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `ProcurementCase` | Raíz del expediente | Se fijan `procurement_route` (3.1), `mp_process_id` (3.2/3.3), se actualiza en 3.6 si desierto |
| `PurchaseOrder` | 1:N con `ProcurementCase` | N por reemisiones (rechazos); espejo de MP — fuente de verdad legal es MP |
| `QuotationResult` | 1:N con `ProcurementCase` | Sugerida — solo en ruta `gran_compra`; solo por lectura MP (sin transcripción manual) |
| `MpProcessSnapshot` | 1:N con `ProcurementCase` | Sugerida — bitácora de sincronización MP, patrón común con CA |
| `BudgetCommitment` | Referencia (módulo Presupuestos) | Creada vía contrato `commitBudget` en 3.7, por monto real de la OC |
| `UtmValue` | Referencia global | Mismo objeto que 2.1; frescura mensual |

## Resumen de bordes — Etapa 3 (CM)

| Sub-paso | Tipo | Contrato o Evento | Contraparte | Lectura MP |
|---|---|---|---|---|
| 3.1 | Sistema externo / Evento | `getUtmValue`, `ProcurementRouteDecided` | Core (SII) | — |
| 3.2 | Sistema externo / Operación / Evento | `readMpProcess`, `linkMpProcess`, `MpProcessLinked` | Core (Mercado Público) | — (vinculación, no lectura de estado) |
| 3.3 | Sistema externo / Operación / Evento | `readMpProcess`, `linkMpProcess`, `MpProcessLinked` | Core (Mercado Público) | — (vinculación) |
| 3.4 | Sistema externo / Evento | `readMpProcess`, `MpStateChanged` | Core (Mercado Público) | Deseada |
| 3.5 | Sistema externo / Evento | `readMpProcess`, `QuotationClosed` | Core (Mercado Público) | Deseada |
| 3.6 | Sistema externo / Evento | `readMpProcess`, `GranCompraDesierta` | Core (Mercado Público) | Deseada |
| 3.7 | Lectura + Dependencia + Evento | `readMpProcess` (OC Aceptada), `commitBudget`, `PurchaseOrderAccepted` | MP + Presupuestos | **Confirmada** |
| 3.8 | Sistema externo / Evento | `readMpProcess`, `PurchaseOrderRejected` | Core (Mercado Público) | Deseada |

**Etapa anterior:** [2. Modalidad de Compra](../procesos-transversales/2-modalidad-compra.md) · **Siguiente etapa:** [4. Recepción Conforme](../procesos-transversales/4-recepcion-conforme.md) *(transversal, por documentar)*

> **Pendientes de la etapa (registrados en `arquitectura/decisiones/pendientes.md`):**
> - **[PENDIENTE P-37]** Umbral `FRAMEWORK_AGREEMENT_GRAN_COMPRA_UTM_LIMIT` como `NormativeParameter` con carga inicial verificada contra norma vigente.
> - **[PENDIENTE P-33]** Plazo del timer de escalamiento para vínculo no registrado (3.2/3.3) y para selección no gestionada (3.5).
> - **[PENDIENTE P-68]** Límite de reintentos ante rechazos sucesivos de OC o desiertos reiterados.
> - **[PENDIENTE P-32]** Comportamiento ante `MP_PROVIDER_UNAVAILABLE` en vinculación: bloqueo total vs. registro provisional con `mp_link_unverified` — candidato a regla transversal (mismo pendiente de 2.3 y CA).
> - **[PENDIENTE P-39]** VB interno pre-OC como control configurable por municipio (3.5) — pendiente de ratificación DM, igual que CA 3.2.
> - **[PENDIENTE P-40]** Procedimiento de regularización presupuestaria cuando monto real > preobligación (3.7) — pendiente con DM/Finanzas, idéntico a CA 3.4.
> - ✅ Propagado a `2-modalidad-compra.md` §2.3: la vinculación MP para CM ocurre en 3.2/3.3 (diferida), no al cierre de la etapa 2.
