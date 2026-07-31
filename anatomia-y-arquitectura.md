# Anatomía de la especificación, enfoques de arquitectura y pendientes

Complementa [`inventario-repositorio.md`](inventario-repositorio.md): aquel cuenta; este muestra. Fecha de lectura: 31 julio 2026.

---

## Cómo leer este documento

Este documento responde tres preguntas que el inventario no puede responder:

1. **¿Con qué grano está especificado?** — se abre un caso real (Compra Ágil) hasta el detalle de ficha, pantalla, prototipo, contrato y dato de prueba.
2. **¿Qué enfoques de arquitectura se adoptaron y por qué?** — el contenido de las decisiones, no solo su título.
3. **¿Qué está sin resolver, y de qué naturaleza es cada bloqueo?** — agrupado por el tipo de acción que lo cierra.

**Audiencia:** jefatura. El texto usa los términos del corpus; la primera vez que aparece un término técnico se explica en una frase.

**Qué no cubre:** no es un inventario de archivos ni un conteo de líneas; no redacta bases de licitación; no cierra pendientes. Las citas van entre comillas con ruta. Si dos documentos se contradicen, se muestran ambos. Si una decisión está condicionada, no se presenta como cerrada.

---

## Parte A — Anatomía de la especificación

**Caso:** macroproceso **Compra Ágil** de Adquisiciones. Un *macroproceso* es el ciclo completo de un tipo de compra, de la solicitud al pago. Compra Ágil es «Mecanismo simplificado de compra para adquisiciones de **hasta 100 UTM**» (`sgm-docs/modulos/adquisiciones/1. compra-agil/overview.md`). UTM = Unidad Tributaria Mensual, medida legal de monto en Chile.

### A.1 El recorrido completo, de punta a punta

Un funcionario detecta una necesidad. En el SGM no “abre un trámite vacío”: entra por la **etapa 0 — Consulta y alta de expedientes**. El listado muestra expedientes existentes; «Nuevo expediente» no persiste solo: «la creación formal ocurre en 1.1 (`createPurchaseRequest`, que instancia el `ProcurementCase` asociado)» (`sgm-docs/modulos/adquisiciones/procesos-transversales/0-consulta-expedientes.md`). El *expediente* (`ProcurementCase`) es la carpeta trazable del ciclo SOLPED → Pago.

**Etapa 1 — SOLPED.** *SOLPED* = solicitud de pedido / solicitud de compra (`PurchaseRequest`). Sub-pasos:

| Sub-paso | Qué ocurre | Quién | Documento / efecto |
|---|---|---|---|
| **1.0** Verificación previa | Busca stock en bodega o ítem en catálogo Convenio Marco (optativo) | Solicitante (`adq.solicitante`) | No crea entidades Adq; puede derivar a solicitud a bodega (**X-44**) |
| **1.1** Creación de solicitud | Crea la SOLPED con líneas, moneda, justificación | Solicitante | `PurchaseRequest` en `draft`; instancia el expediente |
| **1.2** Visto bueno de jefatura | Aprueba o rechaza con firma electrónica avanzada | Aprobador unidad | `PurchaseRequestApproval`; si cancela → `ProcurementCase.status = cancelled` |
| **1.3** Verificación de disponibilidad presupuestaria | Consulta saldo en Presupuestos; confirma o rechaza | Formulador DAF | Ver A.2 |
| **1.4** Solicitar financiamiento a DAF | Si no hay saldo (optativo) | Solicitante | Justificación; estado `pending_budget_financing` |
| **1.5** Emisión de CDP firmado | Emite el *CDP* (Certificado de Disponibilidad Presupuestaria) | Firmante CDP (persona distinta del verificador de 1.3) | `BudgetAvailabilityCertificate` |
| **1.6** Generación de preobligación | Reserva presupuestaria previa al compromiso cierto | Firmante CDP | `BudgetPreCommitment`; «la SOLPED queda lista para Modalidad de Compra» (`1-solped.md`) |

**Etapa 2 — Modalidad de Compra.** El gestor de compra ratifica o elige la modalidad legal (Compra Ágil, Convenio Marco, Licitación Pública, Trato Directo) bajo un *gateway* de reglas V1–V8. «Al confirmar, se fija `ProcurementCase.procurement_type` […] y **se instancian dinámicamente los `CaseStep` del subproceso de la modalidad**» (`2-modalidad-compra.md`). Luego, si aplica, aprobación de jefatura (2.2, **X-38**) y vinculación del proceso en *Mercado Público* (2.3) — portal estatal de compras.

**Etapa 3 — Resolución de Compra** (específica de Compra Ágil). Cotización y OC viven en Mercado Público; el SGM monitorea y sincroniza:

| Sub-paso | Qué ocurre |
|---|---|
| **3.1** Período de cotización | Monitoreo en MP (mín. 3 cotizaciones; filtro MiPyme) |
| **3.2** Cierre y selección de oferta | Selección en MP; espejo `QuotationResult` |
| **3.3** Emisión de la Orden de Compra | OC en MP; revalida habilidad del proveedor |
| **3.4** Aceptación de la OC | «ese acto **perfecciona el vínculo legal** (Compra Ágil no requiere contrato ni resolución)» (`3-resolucion-compra.md`); gatilla *Compromiso Cierto* (`BudgetCommitment`) |
| **3.5** Rechazo de la OC | Camino excluyente: segunda oferta o republicar |
| **3.6** Proceso desierto o fallido | Liberación de preobligación si cancela |

El overview resume: «el vínculo legal se perfecciona íntegramente con la emisión y **aceptación de la Orden de Compra** — ese clic del proveedor crea el contrato» (`1. compra-agil/overview.md`).

**Etapa 4 — Recepción Conforme.** Registro de bienes/servicios (4.1), confirmación (4.2), alta de inventario si aplica (4.3, **X-44**), *devengo* — reconocimiento contable del gasto (4.4; «arranca el reloj legal de pago — plazo máximo de 30 días corridos»), o no conforme (4.5).

**Etapa 5 — Pago.** Cruce de tres vías OC + recepción + factura (5.1), registro de devengado (5.2), decreto de pago vía DocDigital (5.3), ejecución en Tesorería (5.4). «**Fin del ciclo de compra**» (`5-pago.md`).

Marco del ciclo: «Las etapas **1 (SOLPED), 2 (Modalidad de Compra), 4 (Recepción Conforme) y 5 (Pago)** son transversales — compartidas por las 4 modalidades» (`1. compra-agil/overview.md`). Solo la 3 cambia por modalidad.

**Huecos de capas UI en 4 y 5:** hay ficha de proceso para 4.1–4.5 y 5.1–5.4; wireframes y prototipos HTML existen para **4.1** y **5.1** únicamente.

---

### A.2 La cadena de trazabilidad de un solo paso

**Paso:** **1.3 — Verificación de disponibilidad presupuestaria.** Cruza Adquisiciones con Presupuestos. Las cinco capas existen.

#### Capa 1 — Ficha de proceso

Fuente: `sgm-docs/modulos/adquisiciones/procesos-transversales/1-solped.md` §1.3.

La ficha **no** usa los rótulos «precondiciones / acciones / postcondiciones»; usa Materia | Detalle | Entidades | Borde | Validaciones | Edge cases. Contenido literal:

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Finanzas |
| Rol | Formulador DAF / verificación (`adq.formulador_presupuesto`) |
| Plataforma | SGM |
| Optativo | Falso |

Detalle: «El formulador de DAF Finanzas consulta la disponibilidad presupuestaria de la SOLPED aprobada (QA ítem 8 P1). Muestra trazabilidad de saldo (disponible, comprometido por otras SOLPED, proyectado) y confirma o rechaza con justificación. Quien verifica aquí no es quien firma el CDP (segregación QA ítem 9).»

Borde:

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Dependencia | `checkBudgetAvailability` | Presupuestos | Síncrona bloqueante | Entrada: `budget_line_id`, `amount`, `fiscal_year` — Respuesta: `available_balance`, `committed_by_others`, `projected_balance` |
| 2 | Operación | `verifyBudgetAvailability` | — (Adquisiciones) | — | Entrada: `decision` (`confirmed` \| `rejected`), `comments` si rechazo |

Validaciones (extracto del validador central de este paso):

| Acción UI | Operación | Código | Campo | Mensaje (`rule`) | Severidad | Fundamento (`legal_reference`) |
|---|---|---|---|---|---|---|
| Confirmar verificación | `verifyBudgetAvailability` | `BUDGET_UNAVAILABLE` | `budget_line_id` | La línea presupuestaria no tiene saldo disponible para el monto solicitado. | blocking | DL 1.263 — fase de compromiso presupuestario |
| Confirmar verificación | `verifyBudgetAvailability` | `INVALID_STATUS` | `status` | La SOLPED debe estar en pendiente de Finanzas. | blocking | integridad:estado_expediente |

*Blocking* = la operación no puede completarse; el funcionario no avanza. *DL 1.263* = Decreto Ley de Administración Financiera del Estado.

Edge cases: «Sin disponibilidad presupuestaria → verificación rechazada; camino a 1.4 (solicitar financiamiento) o devolución al solicitante con justificación.»

#### Capa 2 — Wireframe

Fuente: `sgm-docs/modulos/adquisiciones/wireframes/13-verificacion-disponibilidad.md`.

Pantalla del expediente `ADQ-2026-00142`: campos línea presupuestaria, monto estimado, año fiscal; panel de saldo (disponible / comprometido / proyectado); botones Rechazar, Solicitar financiamiento, Confirmar.

Estado de pantalla documentado: «**Saldo insuficiente (caso demo `ADQ-2026-00142`):** panel en rojo; «Confirmar» deshabilitado; «Solicitar financiamiento» habilitado → sub-paso 1.4. En el expediente, 1.5–1.6 y etapas 2–5 quedan pendientes/bloqueados.»

#### Capa 3 — Prototipo HTML

Fuente: `sgm-prototipos/modulos/adquisiciones/procesos-transversales/13-verificacion-disponibilidad.html`.

Comportamiento implementado en el demo: si `budget?.insufficient`, muestra «`[INSUFICIENTE]`», deshabilita el botón Confirmar y asigna `title = 'Deshabilitado: saldo insuficiente (BUDGET_UNAVAILABLE)'`. Los clics disparan validación demo (`demoValidation('verifyBudgetAvailability')`); no hay backend real — es prototipo navegable.

#### Capa 4 — Contrato de API

Fuente: `sgm-docs/modulos/adquisiciones/contracts.md` y OpenAPI `openapi/procesos-transversales/1-solped.yaml`.

- Método / ruta: `POST /purchase-requests/{id}/budget-verification` — `verifyBudgetAvailability`
- Entrada: `budget_line_id`, `amount`, `fiscal_year`, `decision` (`confirmed` \| `rejected`), `comments` (obligatorio si rechazo)
- Regla: «Disponibilidad presupuestaria con trazabilidad de saldo» → `BUDGET_UNAVAILABLE` (blocking, QA 8 P1)
- Dependencia: `checkBudgetAvailability` (Presupuestos)
- OpenAPI: `operationId: verifyBudgetAvailability`; respuesta 200 «Verificación registrada»; 422 para errores tipificados

#### Capa 5 — Fixture

Fuente: `sgm-docs/modulos/adquisiciones/fixtures/ADQ-2026-00142.yaml`.

```yaml
title: Compra Ágil — sin saldo; pendiente solicitar financiamiento (1.4)
business_state: >
  Expediente en etapa 1 tras verificación presupuestaria rechazada
  (BUDGET_UNAVAILABLE). Sub-pasos 1.1–1.3 ejecutados; solo 1.4 habilitado.
  1.5–1.6 y etapas 2–5 bloqueados hasta resolver financiamiento y revalidar 1.3.
```

Operación ejercitada:

```yaml
operationId: verifyBudgetAvailability
request:
  method: POST
  path: /purchase-requests/PR-2026-00142/budget-verification
  body:
    budget_line_id: bl-2210-003
    amount: 2450000
    fiscal_year: 2026
    decision: confirmed
response:
  status: 422
  error_code: BUDGET_UNAVAILABLE
```

**Nota:** el fixture de Compra Ágil con camino feliz post-modalidad es `ADQ-2026-00123.yaml`; no ejercita emisión exitosa de CDP (1.5). El de sin-saldo bloquea 1.5–1.6 a propósito.

---

### A.3 Un validador, hasta el fondo

**Validador:** `MODALITY_AMOUNT_EXCEEDED` (etapa **2.1**, no el 1.3 de A.2). Norma distinta: Ley 19.886 (compras públicas), no DL 1.263.

#### Qué regla impone

Gateway V1 en `sgm-docs/modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md`:

| # | Regla | Resultado si falla | `error_code` | Severidad | Fundamento (`legal_reference`) |
|---|---|---|---|---|---|
| V1 | Monto total estimado ≤ 100 UTM para Compra Ágil | Compra Ágil no seleccionable | `MODALITY_AMOUNT_EXCEEDED` | `blocking` | Ley 19.886 — umbral Compra Ágil en UTM (`NormativeParameter`); ⚠ X-37 |

En la tabla de validaciones de la operación:

| Acción UI | Operación | Código | Mensaje (`rule`) | Severidad | Fundamento |
|---|---|---|---|---|---|
| Confirmar modalidad | `confirmProcurementModality` | `MODALITY_AMOUNT_EXCEEDED` | Compra Ágil no procede: el monto estimado supera el umbral en UTM vigente. | blocking | Ley 19.886 — umbral Compra Ágil en UTM (`NormativeParameter`); ⚠ X-37 |

#### Qué pasa si se intenta avanzar

Edge case literal: «Modalidad de la SOLPED contradice el gateway (ej. venía como Compra Ágil y el monto supera 100 UTM) → el sistema no permite ratificar; usuario debe seleccionar modalidad válida; el cambio queda en auditoría con ambos valores.»

Borde inclusivo: «Monto de la SOLPED en el borde exacto del umbral (= 100 UTM) → inclusive para Compra Ágil ("hasta 100 UTM").»

Wireframe `21-ratificacion-modalidad.md`: «**Bloqueado (V1/V2/V3):** botón "Confirmar modalidad" deshabilitado y fila de la regla en rojo con `error_code`.»

Prototipo `21-ratificacion-modalidad.html`: compara `montoUtm` con `AGILE_LIMIT_UTM = 100`; si excede en Compra Ágil, muestra `MODALITY_AMOUNT_EXCEEDED — Compra Ágil no seleccionable` y deshabilita Confirmar.

OpenAPI `2-modalidad-compra.yaml` tipifica el error con `error_code: MODALITY_AMOUNT_EXCEEDED`, `severity: blocking` (el example no incluye el campo `legal_reference`).

#### Por qué importa

Un sistema que solo describe el paso «elegir modalidad» permite elegir Compra Ágil fuera de umbral. Un sistema que declara el validador con severidad `blocking` y `legal_reference` hace que el avance sea imposible sin cambiar de modalidad o de monto — y deja constancia de la norma citada. El umbral mismo no está hardcodeado como única fuente de verdad: vive en `NormativeParameter` (carga inicial pendiente **X-37**).

---

### A.4 Una entidad del modelo de datos

**Entidad:** `ProcurementCase` (Expediente de Compra). Fuente: `sgm-docs/modelo-datos/entidades-core.md`.

«Raíz de trazabilidad de todo el ciclo SOLPED → Pago. El estado del expediente es **distinto** del estado documental de sus entidades hijas (`PurchaseRequest.status`, `PurchaseOrder.status`, etc.) — no fusionar ambos conceptos.»

| Campo | Tipo | Notas |
|---|---|---|
| `id` | texto | Obligatorio. Formato `ADQ-AAAA-NNNNN`. |
| `folio` | texto | Obligatorio. Duplica `id`. |
| `description` | texto | Obligatorio |
| `requesting_unit_id` | ref. `OrganizationalUnit` | Obligatorio |
| `procurement_type` | enum | Opcional hasta 2.1; obligatorio desde confirmación. Valores: `agile_purchase`, `framework_agreement`, `public_tender`, `direct_procurement`. |
| `current_step_id` | ref. `CaseStep` | Obligatorio |
| `status` | enum | Obligatorio. Valores API: `in_progress`, `completed`, `cancelled`, `deserted`. |
| `created_at` | fecha/hora | Obligatorio |
| `mp_process_id` / `mp_linked_at` / `mp_process_type` | texto / fecha / enum | Opcionales hasta vinculación MP (2.3) |
| Campos de ruta CM | — | Solo Convenio Marco (`procurement_route`, intención de compra, etc.) |

Relaciones: 1:N con `CaseStep`; las entidades hijas (`PurchaseRequest`, CDP, OC, recepción, pago) llevan `procurement_case_id` por «desnormalización intencional» para trazabilidad.

**Máquina de estados (qué es):** lista cerrada de estados permitidos y de transiciones permitidas entre ellos. En `entidades-core.md` el `status` del expediente declara cuatro valores; **no hay tabla de transiciones** en esa ficha. Las transiciones aparecen en las fichas de proceso (ej. rechazo con cancelación en 1.2 → `cancelled`; desierto en 3.6 → `deserted`). Eso significa: el sistema puede estar `in_progress` o cerrarse en `completed` / `cancelled` / `deserted`; no admite un estado inventado. Es una garantía de auditoría (todo expediente queda en un estado nombrado) y no solo una restricción de pantalla.

Hijas con máquina propia (no fusionar): `PurchaseRequest.status` (p. ej. `draft`, `pending_finance`, `pending_budget_financing`, `approved`), `PurchaseOrder.status`, etc.

---

### A.5 Qué se puede exigir en recepción gracias a esto

#### 1) Desde la anatomía de Compra Ágil (A.1–A.4)

Puntos verificables concretos que SUBDERE puede contrastar contra una entrega:

1. Existencia del ciclo nombrado 0→5 con sub-pasos 1.0–1.6, 2.1–2.3, 3.1–3.6, 4.x, 5.x según fichas.
2. Operación `verifyBudgetAvailability` en la ruta publicada; error tipificado `BUDGET_UNAVAILABLE` con mensaje y severidad `blocking`.
3. Operación `confirmProcurementModality`; error `MODALITY_AMOUNT_EXCEEDED` cuando Compra Ágil supera el umbral UTM.
4. Fixture reproducible `ADQ-2026-00142` (422 en verificación con saldo insuficiente).
5. Segregación 1.3 ≠ 1.5 (`SEGREGATION_OF_DUTIES_VIOLATION`).
6. Estados de `ProcurementCase` limitados al enum declarado.
7. Aceptación de OC (3.4) como perfeccionamiento del vínculo y disparo de Compromiso Cierto vía contrato.
8. Wireframe/prototipo alineados a operación de contrato en los pasos que tienen UI (incl. 1.3 y 2.1).

**No se puede exigir aún como UI completa:** pantallas 4.2–4.5 y 5.2–5.4 (ficha sí; wireframe/HTML no).

#### 2) Desde el estándar de pruebas (borrador)

Fuente: `sgm-docs/arquitectura/especificacion/estandar-pruebas.md`. Estado: «borrador (julio 2026). Propuesta de estándar, no validada con DM.» No es norma cerrada de bases; sí formula qué habilitaría si se adopta.

Distinción literal:

| Clase | Pregunta que responde | Estado en el corpus |
|---|---|---|
| **Prueba de contrato** | ¿El sistema responde lo que prometió responder? | Cubierta — `estandares-api.md` §6, fixtures, X-53 |
| **Prueba de efecto** | ¿El sistema hizo lo que dice que hizo? | **Ausente** |

«Un sistema puede ser íntegramente conforme a su contrato y no producir ninguno de los efectos jurídicos que justifican su existencia. Eso ya ocurrió una vez.»

Principio: «la cobertura de pruebas del adjudicatario no se mide en porcentaje de líneas de código, sino en **porcentaje de elementos declarados en la especificación que tienen al menos un caso asociado**.»

Checklist adicional propuesto (§9), entre otros: suite entregada y ejecutable por la contraparte; pruebas de efecto de dominio (T2); validadores bloqueantes con `legal_reference` (T3); casos negativos de máquina de estados (T4); atomicidad con inyección de falla (T6).

---

## Parte B — Enfoques de arquitectura

### B.1 Las decisiones registradas, una por una

#### ADR — Eliminación de Odoo (`decisiones/2026-07-eliminacion-odoo.md`)

| Campo | Contenido |
|---|---|
| Qué decide | Se descontinúa Odoo; se licita un ERP desde cero con especificación de SUBDERE. |
| Problema | «La auditoría QA del módulo de Adquisiciones (65+ ítems documentados) reveló que buena parte del trabajo de corrección clasificado como "Interno" requería una dotación de roles […] que el equipo real no tiene» (Contexto). También: «field presence ≠ functional integration». |
| Alternativas descartadas | Reemplaza el «doble track: un desarrollo "Odoo viable máximo" en paralelo con bases de migración a futuro». |
| Estado real | **Aceptada**. |
| Consecuencia si se revierte | El documento no dice “si se revierte…”. Declara consecuencias de aceptar: el objetivo de 5 pilotos Odoo «queda sin vigencia»; el track de corrección interna «deja de aplicar». |

#### ADR — DocDigital (`2026-07-docdigital-tramitacion-documental.md`)

| Campo | Contenido |
|---|---|
| Qué decide | SGM origina actos; DocDigital tramita (visación, FEA, enumeración, distribución); folio oficial externo. |
| Problema | Actos «en múltiples módulos como paso obligatorio, pero **no existía decisión escrita sobre cómo se tramitan ni quién los enumera**». |
| Alternativas | Si no hay M2M: «el diseño cambia a exportación e importación asistida con folio ingresado manualmente» (contingencia, no elección cerrada). |
| Estado real | **Aceptada, condicionada a X-72** (bloqueante). |
| Consecuencia si se revierte | No declara. |

#### ADR — Ventana de mutabilidad (`2026-07-ventana-mutabilidad.md`)

| Campo | Contenido |
|---|---|
| Qué decide | Entidades con ventana de mutabilidad implementan apertura / cierre / reapertura auditada / bloqueo fuera de ventana. |
| Problema | «Dejarlo implícito produce cuatro especificaciones divergentes del mismo comportamiento». |
| Alternativas descartadas | No declara. |
| Estado real | **Aceptada**. |

#### ADR — Atomicidad de efectos de borde (`2026-07-atomicidad-efectos-borde.md`)

| Campo | Contenido |
|---|---|
| Qué decide | Declara el **problema canónico** de atomicidad entre módulos; el mecanismo concreto lo fija SUBDERE (ancla **C-1**). |
| Problema | «Tratarlos como pendientes sueltos multiplica soluciones incompatibles. Son **un solo problema con tres manifestaciones**.» |
| Alternativas | Menciona saga / commit coordinado «u otro»; «Lo que esta decisión no cierra: El mecanismo concreto (saga vs commit único) — sigue en **C-1**.» |
| Estado real | **Aceptada como problema canónico; mecanismo abierto (C-1)**. |

#### ADR — Patrones transversales (`2026-07-patrones-transversales-corpus.md`)

| Campo | Contenido |
|---|---|
| Qué decide | Eleva a declaración única patrones descubiertos módulo a módulo. |
| Problema / propósito | «Elevar a declaración única patrones descubiertos módulo a módulo.» |
| Alternativas | No declara. |
| Estado real | **Aceptada**. |

#### Decisiones macro stack (`decisiones-macro-stack.md`)

| Campo | Contenido |
|---|---|
| Qué decide (asentado) | Motor API-first; soberanía de dato; propiedades no marcas; API como producto. Backend = lectura de trabajo, no decisión. React = decisión de trabajo. |
| Estado real | **Borrador para discusión interna**. Stack backend **no decidido**. |

#### Nodo integración SUBDERE (`nodo-integracion-subdere.md`)

| Campo | Contenido |
|---|---|
| Qué decide | **No decide.** Propone no fundir el nodo en la licitación SGM; opciones A/B/C. |
| Estado real | **Borrador**. «**No** es una decisión tomada.» Pendientes X-82…X-85. |

#### Nota sobre Rentas (`Nota-sobre-rentas.md`)

| Campo | Contenido |
|---|---|
| Qué decide | **No decide.** Recomienda a jefatura la opción (b): especificar completo, implementar por fases. |
| Alternativas declaradas | (a)–(d) en el documento. |
| Estado real | Abierta — postura de jefatura pendiente. |

#### Brechas NTDEE / PISEE (`brechas-estandarizacion-ntdee-pisee.md`)

| Campo | Contenido |
|---|---|
| Qué decide | **No cierra implementación.** Propone perfil NTDEE + borde C-PISEE; no rediseñar expediente Adq. |
| Estado real | **Propuesta / borrador**. X-60…X-63 abiertos. |

#### Estándar de pruebas (`especificacion/estandar-pruebas.md`)

| Campo | Contenido |
|---|---|
| Qué propone | Unificar verificación: prueba de contrato + prueba de efecto; tipos T1–T12; checklist de recepción. |
| Problema | «Las tres [fallas Odoo] pasarían una prueba de conformidad de contrato» sin detectar ausencia de efecto. |
| Estado real | **Borrador, no validado con DM.** No es ADR aceptado. Condicionado a X-86…X-93. |

#### Decisiones de partida en planes (resumen)

| Plan | IDs | Estado del plan |
|---|---|---|
| Presupuestos | D-1…D-4 | Propuesta, no validada con DM. D-4 condicionada a X-72. |
| Contabilidad | D-1…D-5 | D-1 abre C-1; D-2 alinea default X-44 (a); D-5 cond. X-72. |
| Tesorería | D-1…D-6 | D-3 fuera giradores (tensión con Nota Rentas); D-6 cond. X-72. |
| RRHH | D-1…D-6 | D-1 cierra X-80; D-2 SIAPER cond. **R-2** bloqueante. |
| Plan general | DC-1…DC-11 | DC-7 reformulado / no cerrado (X-44); DC-8 absorbido; DC-9 cerrado. |
| Entregable licitación | D-01…D-13 | Documento en borrador v2 (sandbox, fixtures, API como producto, etc.). |

---

### B.2 Los patrones transversales del corpus

Del ADR de patrones y documentos hermanos (nombres acuñados por el corpus):

| Nombre | Qué problema nombra | Dónde aparece |
|---|---|---|
| **Expediente sin efecto de dominio** | «Hay flujo, formulario o trámite, pero ninguna máquina de estados se entera» | Patrones §1; Contabilidad; Tesorería T-14; RRHH. **Es diagnóstico de falla**, no la solución. |
| **No existe / Existe con efecto parcial** | Tricotomía de cobertura as-is | Patrones §1 |
| **Verificación de citas en fuente primaria** | No fijar validador/plazo/umbral del Magenta sin verificar norma | Patrones §2 |
| **Plazos legales con efecto jurídico** | Inventario y cómputo a nivel plataforma | Patrones §3 |
| **Acoplamiento fuerte / gate entre módulos** | Un módulo bloquea a otro | Patrones §4 |
| **Ventana de mutabilidad** | Apertura/cierre/reapertura/bloqueo | ADR 2026-07 |
| **Atomicidad de efectos de borde** | Un hecho → efectos en ≥2 módulos | ADR 2026-07; C-1 |
| **Field presence ≠ functional integration** | UI de config ≠ integración real | Eliminación Odoo |
| **SGM origina / DocDigital tramita** | Folio externo; `pending_signature` | ADR DocDigital |
| **Prueba de contrato vs prueba de efecto** | Conformidad HTTP ≠ efecto de dominio | `estandar-pruebas.md` §2 |
| **La especificación ya es la suite** | Cobertura = % de elementos declarados con caso | `estandar-pruebas.md` §3 |
| **Norma como dato (`NormativeParameter`)** | Umbrales con vigencia; cambio sin reescribir el pasado | `plataforma-core.md` §6; fichas etapa 2 |

---

### B.3 Las apuestas estructurales

Cuatro apuestas (la quinta candidata —atomicidad— queda fuera: el ADR la declara problema canónico con mecanismo aún abierto en C-1; no es apuesta cerrada).

#### 1. Salida de Odoo como base del stack

«Se descontinúa Odoo como base del stack SGM. Se licita un ERP desde cero» (`2026-07-eliminacion-odoo.md`, Decisión). Revertir implica volver a un stack descartado y a un track de corrección que el ADR declara sin vigencia.

#### 2. Contrato API / especificación antes que implementación

Visión del ADR Odoo: «**Motor de backend API-first**». Macro-stack: «SGM se concibe como un **motor backend API-first**, no como una aplicación. La API es el producto» (`decisiones-macro-stack.md` §1; documento aún borrador en detalle). Principios y entregable (D-01…D-13) amarran sandbox, fixtures y OpenAPI. Revertir después de licitar sobre contratos publicados obliga a rehacer el objeto contractual.

#### 3. Todo acto declara su efecto sobre el estado del dominio

El corpus **diagnosticó** la falla «expediente sin efecto de dominio». La apuesta es la contraria: cada acto deja un efecto verificable en entidades/estados — incluido el que vive en otro módulo.

Ancla verificable propuesta (borrador): T2 en `estandar-pruebas.md` §4.2 — «tras ejecutar un acto, el estado del dominio cambió como la ficha de proceso declara — incluido el estado que vive en **otro módulo**». «No basta con inspeccionar la respuesta de la operación.»

#### 4. Norma tratada como dato, no como código

`NormativeParameter`: «legal, administrado por SUBDERE, doble control, vigencia temporal» (`plataforma-core.md` §3 C4). Gobernanza: «un cambio normativo nunca reescribe el pasado» (`plataforma-core.md` §6). En modalidad: «los **valores numéricos** […] viven en configuración administrable — entidad `NormativeParameter`» (`2-modalidad-compra.md`). Validadores llevan `legal_reference`. Contracara de prueba (borrador): T12 regresión normativa y T3 validador con fundamento (`estandar-pruebas.md`).

**¿Desplaza a la atomicidad?** No. Son problemas distintos: T12 vs T6; X-37/carga de parámetros vs C-1/mecanismo. La atomicidad permanece en B.4 / Parte C.

#### Integraciones con organismos del Estado (borde canónico)

MP, DocDigital, FirmaGob, SII, SIAPER, etc. como bordes de plataforma (Patrones §5; C7–C11). Condicionadas a verificaciones (X-72, R-2, X-70). Es estructural para el diseño de bordes, pero varias integraciones siguen abiertas — por eso no sustituye a las cuatro apuestas anteriores como “cerradas”.

---

### B.4 Lo que la arquitectura todavía no decide

| Tema | Estado | Qué se necesita para cerrar |
|---|---|---|
| Mecanismo DocDigital (M2M vs solo web) | X-72 **[BLOQUEANTE]** Abierto | Verificación con Gobierno Digital |
| Mecanismo atomicidad / C-1 | Abierto; bloquea F4 y X-89 | Decisión técnica SUBDERE (saga vs commit u otro) |
| Backend del stack | Borrador macro-stack | Decisión de trabajo / bases (propiedades, no marcas) |
| Alcance Inventario/AF | X-44 **[PRIORIDAD ALTA]**; default (a) no cierra | Decisión de jefatura / bases |
| SIAPER M2M | R-2 bloqueante | Verificación con CGR |
| Rentas / giradores | Nota abierta; Tes D-3 | Postura jefatura |
| Nodo integración SUBDERE | X-82…X-85; no decisión | Jefatura / jurídica / arquitectura |
| Adopción estándar de pruebas | Borrador; X-86…X-93 Abiertos | Validación DM; X-90/X-91 jefatura; X-89 tras C-1 |
| Valores exactos `NormativeParameter` | X-37 | Jurídica / carga inicial verificada |

Plan general §8 (síntesis): cerrar antes de publicar bases incluye postura post-X-72/R-2, C-1 con mecanismo escrito, X-44 decidido por jefatura — según el propio plan.

---

## Parte C — Pendientes, agrupados por naturaleza del bloqueo

### Conteo y desfase respecto del inventario

El inventario reportó **156** IDs en seis series (X-01…X-85 + P + C + T + R + A). Tras registrar **X-86…X-93** (estándar de pruebas), el registro X llega a X-93. **X-86…X-93 existen** en `sgm-docs/arquitectura/decisiones/pendientes.md`.

Abiertos contados en esta lectura (excluye Cerrado / Absorbido / Resuelto completo): **159** (90 X + 18 P + 18 C + 14 T + 14 R + 5 A). Serie X abierta = filas X-01…X-93 menos X-46 (Absorbido), X-47 y X-80 (Cerrados).

Clasificación por **qué tipo de acción cierra** el pendiente (lectura de enunciado + columna Dependencia externa / Responsable):

| Grupo | Qué lo cierra | Cantidad (abiertos) |
|---|---|---:|
| **Decisión de jefatura o de bases** | Autoridad elige entre opciones ya formuladas | **30** |
| **Verificación con un tercero** | Consultar organismo externo | **16** |
| **Conocimiento de dominio municipal** | Experto / DM / piloto responde | **34** |
| **Decisión técnica de arquitectura** | El equipo resuelve por sí | **43** |
| **Trabajo de especificación pendiente** | Tiempo de redacción / extracción | **36** |
| **Total abiertos clasificados** | | **159** |

### Por grupo — los más relevantes

#### Decisión de jefatura o de bases (30)

Ejemplos literales:

1. **X-44:** «**[PRIORIDAD ALTA]** Alcance de Bodega/Inventario y Activo Fijo en la licitación. […] Default provisional **(a)** incluir en Contabilidad/núcleo» — dependencia: «jefatura / decisión de bases».
2. **X-90:** «Calibración de los niveles de cobertura de pruebas antes de las bases» — «jefatura / bases».
3. **X-91:** «Régimen contractual ante prueba fallida en recepción» — «jefatura / jurídica».
4. **X-81:** mecanismo formal de alcance parcial en bases — «jefatura / bases».

**Qué se desbloquea:** texto de bases (alcance M2, régimen de recepción/pruebas, alcance parcial); alinea Contabilidad D-2 / Adq 4.3.

#### Verificación con un tercero (16)

1. **X-72:** «**[BLOQUEANTE]** Mecanismo de integración DocDigital: ¿existe interfaz M2M […]? **No asumir API.**» — «Gobierno Digital».
2. **R-2:** ¿M2M SIAPER? — bloqueante en plan RRHH; Equipo + CGR.
3. **X-70:** polling vs webhook lecturas MP — «ChileCompra / plataforma».
4. **X-64:** canal API estado Toma de Razón — Contraloría.

**Qué se desbloquea:** diseño C11 DocDigital; integración RRHH; canal MP; reporting Contraloría.

#### Conocimiento de dominio municipal (34)

1. **X-38:** existencia/alcance de aprobación de jefatura en decisión de modalidad — DM.
2. **X-40:** regularización si OC aceptada y `BUDGET_UNAVAILABLE` — DM / Finanzas.
3. **A-1:** clasificador de rubro ítem — Comparativa §5.
4. **P-5 / C-8 / T-6 / R-8:** consolidaciones, roles de ingreso, especies, calendario nómina — DM.

**Qué se desbloquea:** cierre de fichas Adq etapa 2–3 y reglas operativas de módulo.

#### Decisión técnica de arquitectura (43)

1. **C-1:** mecanismo de atomicidad del devengo dual — «Equipo (decisión arquitectónica)»; bloquea F4.
2. **X-89:** «Puntos de inyección de falla exigibles […] **Bloqueado por C-1**».
3. **P-1:** reconciliar `BudgetPreCommitment` con Adq — bloquea F0/F4.
4. **T-1:** contrato de entrada de órdenes de ingreso — bloquea F3 Tesorería.

**Qué se desbloquea:** mecanismo transversal de bordes; pruebas T6; frontera Pres/Adq; frontera Tesorería.

#### Trabajo de especificación pendiente (36)

1. **X-86:** «Inventario derivado de la especificación […] como denominador de cobertura de pruebas» — dependencia «ninguna».
2. **X-87:** efecto de dominio verificable en fichas (ajuste plantilla) — «ninguna».
3. **X-37:** carga inicial `NormativeParameter` — jurídica (también exige verificación normativa).
4. **X-53 / X-48:** tooling CI OpenAPI/fixtures; `plataforma/contracts.md`.

**Qué se desbloquea:** exigibilidad del estándar de pruebas; administración de umbrales; contratos de plataforma.

---

### C.1 Los que bloquean las bases de licitación

Solo marcas que el corpus declara:

| ID | Marca literal | Si se publican bases sin cerrarlo |
|---|---|---|
| **X-72** | `**[BLOQUEANTE]**` en `pendientes.md`; ADR DocDigital condicionada | El diseño C11 (M2M vs exportación/importación) queda sin ancla; D-4/D-5/D-6 de módulos que dependen de DocDigital quedan condicionados |
| **X-44** | `**[PRIORIDAD ALTA]**`; default (a) «no cierra» | Alcance Inventario/AF en la licitación queda provisional; riesgo de contradicción Cont D-2 / Adq 4.3 |
| **R-2** | Plan RRHH: bloqueante | Integración SIAPER sin mecanismo verificado |
| **C-1** | Plan Cont / plan general: bloquea F4; «requisito técnico más duro» (plan Cont) | Mecanismo de atomicidad no escrito; X-89 no puede especificarse |

También bloquean fases de módulo (no siempre etiquetados `[BLOQUEANTE]` en X): **T-1**, **P-1**, **R-1**.

Sobre pruebas: `estandar-pruebas.md` §5 (X-90) pide calibrar coberturas «antes de las bases»; **no** lleva marca `[BLOQUEANTE]` en el registro — no se inventa prioridad.

---

### C.2 Los que no tienen dueño declarado

**Serie X — dependencia externa = `ninguna`** (41 abiertos; nadie externo nombrado en la columna):

X-02, X-03, X-04, X-05, X-06, X-08, X-09, X-10, X-11, X-12, X-13, X-14, X-15, X-16, X-19, X-20, X-22, X-23, X-24, X-27, X-29, X-31, X-32, X-33, X-34, X-42, X-48, X-51, X-52, X-53, X-55, X-57, X-58, X-60, X-63, X-75, X-77, X-78, X-86, X-87, X-93.

**Serie A:** A-1…A-5 en `plan-general.md` §5.3 **sin** columna de responsable/dependencia en el registro.

**Series P / C / T / R:** todas las filas abiertas traen **Responsable** no vacío.

---

## Glosario

| Término | Definición de una línea |
|---|---|
| Atomicidad de efectos de borde | Exigencia de que un hecho con efectos en dos o más módulos no deje estado a medias. |
| Blocking | Severidad de validador que impide completar la operación. |
| CDP | Certificado de Disponibilidad Presupuestaria. |
| Compromiso Cierto | Fase presupuestaria posterior a la aceptación de la OC (`BudgetCommitment`). |
| Contrato de API | Descripción publicada de operaciones (ruta, entrada, salida, errores). |
| Devengo / Accrual | Reconocimiento contable del gasto. |
| DocDigital | Plataforma externa de tramitación y enumeración de actos administrativos. |
| Expediente (`ProcurementCase`) | Raíz de trazabilidad del ciclo de compra. |
| Expediente sin efecto de dominio | Categoría diagnóstica: hay trámite en pantalla pero no cambia el dominio. |
| Fixture | Expediente/dato de prueba versionado que ejercita operaciones y errores. |
| Gateway de modalidad | Conjunto de reglas V1–V8 que habilitan o bloquean una modalidad de compra. |
| `legal_reference` | Campo que cita el fundamento normativo (o `integridad:*`) de un validador. |
| Máquina de estados | Lista de estados y transiciones permitidas de una entidad. |
| Mercado Público (MP) | Portal estatal de compras públicas. |
| `NormativeParameter` | Parámetro legal de plataforma con vigencia temporal, administrado por SUBDERE. |
| Preobligación | Reserva presupuestaria previa al compromiso cierto (`BudgetPreCommitment`). |
| Prueba de contrato | Verifica que la respuesta HTTP cumple el esquema prometido. |
| Prueba de efecto | Verifica que el estado del dominio cambió como declara la ficha. |
| SOLPED | Solicitud de pedido / compra (`PurchaseRequest`). |
| Tenant | Municipio (u organización) aislado en la plataforma multi-municipio. |
| UTM | Unidad Tributaria Mensual. |
| Validador | Regla de negocio tipificada (código, mensaje, severidad, fundamento). |
| Ventana de mutabilidad | Período en que una entidad admite o rechaza escrituras. |
| Wireframe | Especificación de pantalla de baja fidelidad (campos, acciones, estados). |

---

## Nota de método

### Archivos abiertos (lectura efectiva)

- Compra Ágil: `1. compra-agil/overview.md`, `3-resolucion-compra.md`; transversales `0`–`5`; `contracts.md`; OpenAPI `1-solped.yaml`, `2-modalidad-compra.yaml`; wireframes `13`, `21` (+ revisión de mapa 31–36, 41, 51); prototipos HTML `13`, `21`; fixtures `ADQ-2026-00142`, `ADQ-2026-00123`; `entidades-core.md`; `entidades-plataforma.md` (`NormativeParameter`).
- Arquitectura: los 5 ADR 2026-07; `decisiones-macro-stack.md`; `nodo-integracion-subdere.md`; `Nota-sobre-rentas.md`; `brechas-estandarizacion-ntdee-pisee.md`; `pendientes.md`; `estandar-pruebas.md`; `plataforma-core.md`; `musts-arquitectura.md` (secciones de validadores/estados); `contrato-api-first.md` / principios / entregable (D-n); planes Pres/Cont/Tes/RRHH (D-n y tablas de pendientes); `plan-general.md` (DC-n, A-n, §8).

### Qué no se revisó línea a línea

- Cada wireframe 31–36 y HTML asociado (sí el mapa de existencia).
- OpenAPI completa de recepción/pago y `expediente.yaml` al detalle de cada schema.
- Todos los `.yaml` de fixtures no CA.
- Diagrama `compra-agil.drawio`.
- Cada párrafo de `seguridad.md`, catálogos y specs de integración más allá de las secciones citadas.

### Fuera de alcance de esta lectura

- Inventario cuantitativo (ya en `inventario-repositorio.md`).
- Modalidades CM/LP/TD en profundidad anatómica (solo referencias cruzadas).
- Código del sistema anterior Odoo (solo citas que el corpus ya documenta).

**Rutas:** el corpus vive bajo `sgm-docs/` y `sgm-prototipos/`, no bajo `modulos/` en la raíz del repo.

---

## Verificación antes de entregar

1. **¿Toda cita literal corresponde exactamente al texto del archivo citado?** Las citas entre comillas se tomaron de los archivos listados en la Nota de método; se releyeron los bloques de §1.3, V1/`MODALITY_AMOUNT_EXCEEDED`, `ProcurementCase`, ADRs clave, X-44/X-72 y `estandar-pruebas.md` §2–§3. Si al editar el corpus cambian, hay que actualizar este documento.
2. **¿Alguna ruta citada no existe?** Las rutas usadas en A.2–A.4 y B fueron verificadas en el árbol del repo en esta sesión. El entregable canónico es este archivo en la raíz del repositorio.
3. **¿Presentaste como cerrada alguna decisión que el corpus declara condicionada?** No: DocDigital condicionada a X-72; atomicidad como problema canónico con C-1 abierto; macro-stack/Rentas/nodo/NTDEE/estándar de pruebas como borrador o abiertos; X-44 con default (a) no cerrado.
4. **¿Usaste algún término técnico sin explicarlo en su primera aparición?** Se explicó en primera aparición: macroproceso, UTM, expediente, SOLPED, CDP, Mercado Público, blocking, DL 1.263, gateway, Compromiso Cierto, devengo, máquina de estados, prueba de contrato/efecto, `NormativeParameter`, tenant. El glosario repite definiciones de una línea.
5. **¿La Parte A permite entender el grano real?** El núcleo es A.2 (cinco capas del 1.3) más A.3 (otro validador, otra norma). No se añadieron ejemplos extras en lugar de profundizar.
6. **¿Hay adjetivos valorativos?** Se evitaron («sólido», «robusto», «maduro», etc.). Donde el corpus usa juicios propios (p. ej. «requisito técnico más duro»), se atribuyen al documento fuente.

---

*Fin del documento.*
