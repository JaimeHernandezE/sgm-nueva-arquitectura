# 3. Resolución de Compra — Compra Ágil

*Etapa organizador común: el nombre es compartido entre modalidades, pero su contenido es específico de cada una. En Compra Ágil no existe acto administrativo interno obligatorio (el vínculo legal se perfecciona con la aceptación de la OC por el proveedor): esta etapa es esencialmente **monitoreo del proceso en MP con tres puntos de decisión** (3.4/3.5 excluyentes, 3.6 alternativo). En Licitación Pública, la misma etapa contiene actos formales pesados (acta de evaluación, resolución de adjudicación, garantías, contrato) y se documenta por separado.*

*Toda la etapa se rige por el estándar MP ↔ SGM de `plantilla-maestra-sgm.md` §5: integración solo lectura, clasificación Informativo/Gestión, lecturas confirmadas vs. deseadas y modo degradado. Lectura confirmada disponible hoy: **OC Aceptada**. Las demás lecturas de esta etapa son **deseadas** (dependen de la negociación con ChileCompra) y cada sub-paso documenta su modo degradado.*

*Roles de la fila **Rol:** nombre (usuarios) + código (sistema) según el catálogo transversal [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md) (P-24).*

---

## 3.1 — Período de cotización

| Materia | Valor |
|---|---|
| Unidad municipal | — (proceso corre en MP; monitoreo automático) |
| Rol | N/A |
| Plataforma | Mercado Público |
| Optativo | Falso |
| Interacción MP | **Informativo** |

**Detalle:** Tras la vinculación (2.3), la cotización corre en MP por el plazo definido (2–5 días hábiles). Primera ronda dirigida solo a MiPymes y proveedores locales del rubro; si ninguna cotiza, el comprador puede ampliar a segunda ronda con empresas de cualquier tamaño (acción del usuario **en MP**, no en SGM). El expediente muestra el estado del período y el plazo restante; los timers de flujo corren.

**Lecturas MP:** estado del período y n° de cotizaciones recibidas — **deseada**. Apertura de segunda ronda — **deseada**.
**Modo degradado:** sin estas lecturas, SGM muestra solo el plazo declarado al vincular (fecha estimada de cierre registrada por el usuario en 2.3) y un timer sobre esa fecha; el detalle vive en MP vía deep link.

**Entidad(es) y campos:**
- `CaseStep` (actualiza) — estado del paso, timestamps
- `MpProcessSnapshot` *(sugerida, no confirmada en fuente)* — `procurement_case_id`, `mp_status`, `data` (JSON con el payload leído), `read_at`, `source` (`push` \| `polling`) — bitácora de sincronización, común a toda la etapa

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura) | `readMpProcess` (vía servicio de sincronización) | Core (Mercado Público) | Asíncrona | Estado del proceso |
| 2 | Evento | `MpStateChanged` (interno, agnóstico de push/polling) | — (consumidores: expediente, notificaciones) | Asíncrona | `MpProcessSnapshot` |

**Edge cases:**
- Ninguna MiPyme cotiza en primera ronda → ampliación a segunda ronda es acción del usuario en MP; con lectura deseada, SGM lo refleja; en degradado, el usuario puede registrarlo manualmente (opcional).
- MP no disponible durante el período → sin efecto de gestión (paso informativo); la sincronización se retoma con retroceso exponencial.

---

## 3.2 — Cierre y selección de oferta

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | Mercado Público |
| Optativo | Falso |
| Interacción MP | **Informativo** ⚠ *(candidato a Gestión optativa, ver pendiente)* |

**Detalle:** Cerrado el período, el usuario compara ofertas y selecciona **en MP**. Si no selecciona la de menor precio, MP exige justificación (regla de la plataforma, no de SGM). Legalmente no existe aprobación interna obligatoria en Compra Ágil; para SGM el paso es informativo: refleja que hubo selección y de quién.

**Lecturas MP:** cierre del período y oferta seleccionada (proveedor, monto) — **deseada**.
**Modo degradado:** el usuario registra manualmente en SGM el resultado de la selección (proveedor y monto ofertado) antes de continuar; formulario mínimo sobre el expediente.

**Entidad(es) y campos:**
- `QuotationResult` — `procurement_case_id` (ref., **obligatorio**), `selected_provider_rut` (texto, **obligatorio**), `selected_provider_name` (texto, **obligatorio**), `offered_amount` (número, **obligatorio**), `lowest_price_selected` (booleano, **obligatorio**), `selection_justification` (texto, **obligatorio si** no es menor precio), `entry_mode` (enum, **obligatorio**), `recorded_at` (fecha/hora, **obligatorio**)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, deseada) | `readMpProcess` | Core (Mercado Público) | Asíncrona | Cierre + selección |
| 2 | Evento | `QuotationClosed` | — (consumidores: expediente, notificaciones) | Asíncrona | `QuotationResult` |

**Edge cases:**
- Usuario no gestiona la selección en MP dentro de un plazo razonable → timer de escalamiento sobre el `CaseStep` (propiedad de flujos, `musts-arquitectura.md` §10.4) — **[PENDIENTE P-33]** timers de escalamiento configurables.
- Selección registrada manualmente difiere después de la lectura MP (cuando exista) → la lectura MP prevalece (MP es la fuente de verdad legal); discrepancia queda en auditoría.

> **[PENDIENTE P-39]** Visto bueno interno pre-OC como control configurable por municipio (con DM) — la ley no lo exige en Compra Ágil, pero municipios con control interno más estricto podrían quererlo. Si se confirma, este sub-paso pasa a Gestión condicional con un aprobador DAF y aplicaría segregación respecto de quien creó la SOLPED. Decisión suggest vs. enforce que debe resolverse explícitamente.

---

## 3.3 — Emisión de la Orden de Compra

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | Mercado Público |
| Optativo | Falso |
| Interacción MP | **Gestión condicional** |

**Detalle:** El usuario emite la OC en MP hacia el proveedor seleccionado. Al emitir, MP **revalida la habilidad del proveedor** (declaración jurada de la cotización): si el proveedor se inhabilitó durante el proceso, MP bloquea la emisión. Camino feliz: informativo (SGM refleja "OC enviada, esperando aceptación"). Condición de gestión: **bloqueo por inhabilidad** → SGM crea tarea para el usuario con las alternativas (seleccionar la siguiente mejor oferta en MP, o cancelar).

**Lecturas MP:** OC enviada — **deseada**. Proveedor inhábil / emisión bloqueada — **deseada** (evento crítico listado en los requerimientos a negociar con ChileCompra).
**Modo degradado:** sin lecturas, el estado "OC enviada" se infiere del registro manual de 3.2 + deep link; el bloqueo por inhabilidad solo se conoce cuando el usuario lo ve en MP y lo registra manualmente para activar la gestión en SGM.

**Entidad(es) y campos:**
- `PurchaseOrder` — `procurement_case_id` (ref., **obligatorio**), `mp_oc_id` (texto, **obligatorio**), `supplier_rut` (texto, **obligatorio**), `total_amount` (número, **obligatorio**), `status` (enum, **obligatorio**: `issued`, …), `entry_mode` (enum, **obligatorio**)

*(Nota de reconciliación: la ficha original usaba el estado `sent` y el evento `PurchaseOrderSent`; se normalizan aquí a `issued`/`PurchaseOrderIssued`, consistentes con el enum canónico de `entidades-core.md` y con el evento ya existente en `contracts.md`.)*

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, deseada) | `readMpProcess` | Core (Mercado Público) | Asíncrona | Estado de OC / bloqueo |
| 2 | Evento | `PurchaseOrderIssued` / `ProviderIneligibleBlocked` | — (consumidores: expediente, notificaciones) | Asíncrona | `PurchaseOrder` |

**Edge cases:**
- Proveedor inhábil al emitir → gestión: tarea al usuario; si selecciona siguiente oferta, se reejecuta 3.3 con nuevo proveedor; si cancela, ver 3.6 (variante).
- OC emitida por monto distinto al ofertado (corrección en MP) → el monto que vale es el de la OC; SGM lo tomará de la lectura de aceptación (3.4).

---

## 3.4 — Aceptación de la OC (perfeccionamiento del vínculo)

| Materia | Valor |
|---|---|
| Unidad municipal | — (acto del proveedor en MP; efectos automáticos en SGM) |
| Rol | N/A |
| Plataforma | Mercado Público → SGM |
| Optativo | Falso *(excluyente con 3.5)* |
| Interacción MP | **Gestión — el hito crítico de la etapa** |

**Detalle:** El proveedor acepta la OC en MP. Ese acto **perfecciona el vínculo legal** (Compra Ágil no requiere contrato ni resolución) y es el hito contable mayor del macroproceso. La lectura **confirmada** "OC Aceptada" dispara en SGM, automáticamente: (1) espejo de la `PurchaseOrder` con sus datos definitivos (n° OC, proveedor, **monto real**); (2) solicitud de **Compromiso Cierto** a Presupuestos **por el monto real de la OC** — que puede diferir del estimado de la preobligación (1.6): la diferencia se ajusta (liberación del excedente o ampliación validada); (3) avance del expediente a la etapa siguiente (recepción conforme, transversal); (4) notificación a la unidad solicitante ("tu compra fue confirmada; proveedor X, entrega estimada Y").

**Lecturas MP:** OC Aceptada — **confirmada** (única lectura garantizada hoy). Sin modo degradado necesario.

**Entidad(es) y campos:**
- `PurchaseOrder` (actualiza) — `status = accepted`, `accepted_at`, `amount` (definitivo, monto real)
- `BudgetCommitment` *(vía contrato con Presupuestos; entidad del módulo Presupuestos)* — referencia resultante en `procurement_case_id`
- `CaseStep` — cierre de etapa 3, apertura de etapa siguiente

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, **confirmada**) | `readMpProcess` — OC Aceptada | Core (Mercado Público) | Asíncrona | N° OC, proveedor, monto real, fecha de aceptación |
| 2 | Dependencia | `commitBudget` (compromiso por monto real; incluye ajuste contra preobligación) | Proveedor de disponibilidad presupuestaria (Presupuestos SGM o sistema municipal) | **Síncrona bloqueante** | Entrada: `pre_commitment_id`, `real_amount`, `purchase_order_ref` — Respuesta: `BudgetCommitment` o error estructurado |
| 3 | Evento | `PurchaseOrderAccepted` | — (consumidores: expediente, recepción, Contabilidad, notificaciones, terceros vía webhook con scope) | Asíncrona | `PurchaseOrder`, `BudgetCommitment.id` |

**Edge cases:**
- **Monto real > preobligación y la línea no tiene saldo para la diferencia** → `commitBudget` responde `BUDGET_UNAVAILABLE` (`severity: blocking`). Situación anómala grave (la OC ya está aceptada, el vínculo legal existe, pero el compromiso contable no puede registrarse): tarea urgente a DAF Finanzas para regularización presupuestaria (modificación/suplemento) — **[PENDIENTE P-40]** el procedimiento de regularización no puede resolverlo el sistema solo, pero debe impedir que pase silenciosamente.
- Monto real < preobligación → compromiso por el real y **liberación automática del excedente** de la preobligación (regla estándar, sin intervención).
- Proveedor de presupuesto no disponible al recibir la lectura → reintento con retroceso; el expediente queda en estado intermedio visible ("aceptada, compromiso pendiente") — nunca se pierde el hito ni se duplica el compromiso (idempotencia por `purchase_order_ref`).

---

## 3.5 — Rechazo de la OC

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | Mercado Público → SGM |
| Optativo | Falso *(excluyente con 3.4)* |
| Interacción MP | **Gestión** |

**Detalle:** El proveedor rechaza la OC. No hay vínculo legal; nada pasa a compromiso (la preobligación se mantiene intacta). SGM crea tarea de decisión para el usuario: **emitir OC a la segunda mejor oferta** (reejecuta 3.3 con nuevo proveedor) o **cancelar y republicar** (nueva cotización = nuevo proceso MP = re-vinculación 2.3; el expediente y su folio se conservan — es el mismo caso de compra con un nuevo intento, trazado).

**Lecturas MP:** OC Rechazada — **deseada** (evento crítico en los requerimientos a negociar).
**Modo degradado:** el usuario registra el rechazo manualmente al verlo en MP; la tarea de decisión se crea igual, con `entry_mode = manual`.

**Entidad(es) y campos:**
- Pantalla: `decision` (enum, **obligatorio** — segunda oferta / republicar)
- `PurchaseOrder` (actualiza) — `status` (**obligatorio** = `rejected_by_supplier`), `rejection_reason` (texto, **opcional** — si MP lo trae)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, deseada) | `readMpProcess` — OC Rechazada | Core (Mercado Público) | Asíncrona | Estado, motivo si disponible |
| 2 | Evento | `PurchaseOrderRejected` | — (consumidores: expediente, notificaciones) | Asíncrona | `PurchaseOrder` |

**Edge cases:**
- No existe segunda oferta válida → única vía: cancelar y republicar, o reevaluar (3.6).
- Rechazos sucesivos de todas las ofertas → equivalente funcional a proceso fallido; decisión de 3.6.

---

## 3.6 — Proceso desierto o fallido

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento (decisión) / Unidad Solicitante (informada) |
| Rol | Gestor de compra ([`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Verdadero *(solo ocurre si el proceso fracasa)* |
| Interacción MP | **Gestión** |

**Detalle:** Nadie cotizó tras ambas rondas (desierto), o el proceso quedó sin ofertas viables (fallido, por acumulación de 3.3/3.5). Tarea de decisión: **(a) republicar** — nueva cotización en MP, típicamente con condiciones ajustadas; nuevo ID de proceso; re-vinculación conforme a 2.3 sobre el mismo expediente; **(b) reevaluar** — el monto, las condiciones o la modalidad no eran adecuados: reversión formal a la etapa 2 (nueva `ModalityDecision`, según el procedimiento de reversión pendiente allí — **[PENDIENTE P-34]**) o cancelación del expediente con liberación total de la preobligación y notificación a la unidad solicitante.

**Lecturas MP:** proceso desierto — **deseada**.
**Modo degradado:** vencido el plazo de cotización sin registro de selección (3.2), SGM presume posible desierto y crea la tarea de verificación al usuario, quien confirma manualmente contra MP.

**Entidad(es) y campos:**
- Pantalla: `decision` (enum, **obligatorio** — republicar / reevaluar / cancelar)
- `ProcurementCase.status` (enum, **obligatorio** — según decisión)
- `BudgetPreCommitment` — liberación si cancelación (**obligatorio** ejecutar `releasePreCommitment`)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo (lectura, deseada) | `readMpProcess` — desierto | Core (Mercado Público) | Asíncrona | Estado terminal del proceso |
| 2 | Dependencia | `releasePreCommitment` (si cancelación) | Proveedor de disponibilidad presupuestaria | Síncrona bloqueante | `pre_commitment_id` |
| 3 | Evento | `ProcurementProcessFailed` | — (consumidores: expediente, notificaciones, reportería) | Asíncrona | `ProcurementCase`, causa (`deserted` \| `all_rejected`), decisión tomada |

**Edge cases:**
- Republicación reiterada sin resultado (2+ intentos) → advertencia asesora sugiriendo reevaluar condiciones o modalidad; candidato a métrica de reportería (procesos desiertos por unidad/rubro).
- Cancelación con preobligación ya vencida de saldo anual → coordinar con regla de cierre presupuestario — **[PENDIENTE P-41]** con Finanzas.

---

## Resumen de entidades — Etapa 3

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `PurchaseOrder` | 1:N con `ProcurementCase` | N por reemisiones (rechazos); espejo de MP, fuente de verdad legal es MP |
| `QuotationResult` | 1:N con `ProcurementCase` | Sugerida — resultado de selección; `entry_mode` distingue lectura MP de registro manual |
| `MpProcessSnapshot` | 1:N con `ProcurementCase` | Sugerida — bitácora de sincronización MP, común a toda la etapa |
| `BudgetCommitment` | Referencia (módulo Presupuestos) | Creada vía contrato `commitBudget` en 3.4, por monto real |
| `BudgetPreCommitment` | Referencia (etapa 1) | Se ajusta (3.4) o libera (3.6) |

## Resumen de bordes — Etapa 3

| Sub-paso | Tipo | Contrato o Evento | Contraparte | Lectura MP |
|---|---|---|---|---|
| 3.1 | Sistema externo / Evento | `readMpProcess`, `MpStateChanged` | Core (Mercado Público) | Deseada |
| 3.2 | Sistema externo / Evento | `readMpProcess`, `QuotationClosed` | Core (Mercado Público) | Deseada |
| 3.3 | Sistema externo / Evento | `readMpProcess`, `PurchaseOrderIssued`, `ProviderIneligibleBlocked` | Core (Mercado Público) | Deseada |
| 3.4 | Lectura + Dependencia + Evento | `readMpProcess` (OC Aceptada), `commitBudget`, `PurchaseOrderAccepted` | MP + Presupuestos | **Confirmada** |
| 3.5 | Sistema externo / Evento | `readMpProcess`, `PurchaseOrderRejected` | Core (Mercado Público) | Deseada |
| 3.6 | Lectura + Dependencia + Evento | `readMpProcess`, `releasePreCommitment`, `ProcurementProcessFailed` | MP + Presupuestos | Deseada |

**Etapa anterior:** [2. Modalidad de Compra](../procesos-transversales/2-modalidad-compra.md) *(transversal)* · **Siguiente etapa:** [4. Recepción Conforme →](../procesos-transversales/4-recepcion-conforme.md) *(transversal)*
