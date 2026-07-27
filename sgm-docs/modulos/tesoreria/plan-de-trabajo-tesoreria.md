# Plan de trabajo — Módulo Tesorería

**Proyecto:** SGM — Sistema de Gestión Municipal
**Módulo:** Tesorería
**Versión:** 0.2 (borrador para revisión interna)
**Fecha:** julio 2026
**Estado:** propuesta de plan, no validada con DM

**Cambios v0.2:** contraste del diagnóstico §3.2–3.3 contra el ORM real de `tesoreria_gov_cl` / `portal_tesoreria_gov_cl`. Se reclasifican **pago a terceros** y **garantías/vigencia** con la lente de *expediente sin efecto de dominio*; se distingue **anulación misma jornada** (42.2.12) del **descargo contable** de OI en Contabilidad; SEM aporta API HTTP + `sem.entry.config` como ancla de T-1; se aclara frontera de `partner.bank.transfer.file` (vive en Contabilidad); decisión **D-6 DocDigital** para decreto de pago; pendientes T-11…T-13. Nueva §3.2.1.

**Convención de pendientes:** este módulo usa el prefijo **T-nn**. Las referencias a Presupuestos (**P-nn**), Contabilidad (**C-nn**) y arquitectura transversal (**P-72…P-76**) conservan su prefijo original.

---

## 1. Propósito

Definir la secuencia de trabajo para producir la especificación completa del módulo Tesorería, con el estándar ya fijado: *dos equipos independientes deben poder construir sistemas funcionalmente equivalentes solo con la especificación*.

Este documento **no** es la especificación. Es el plan que la produce.

---

## 2. Decisiones de partida

| # | Decisión | Contenido |
|---|----------|-----------|
| D-1 | **Propiedad de la Orden de Ingreso** | La OI **pertenece a Contabilidad**; Tesorería la consume para cobrar y reporta la percepción. La OI es un derecho devengado que nace del rol o del acto del departamento girador, y su efecto primario es contable (proceso 30). Coherente con su ubicación en el as-is |
| D-2 | **Alcance del módulo** | Caja y recaudación (40), cuadratura y estado diario (42), pagos (38), pago a terceros y FCM (39), **garantías (41)**, **caja chica**, **especies valoradas y recepción externa tipo SEM** |
| D-3 | **Giradores fuera de alcance** | SGM **no incluye los sistemas de recaudación por tributo** —patentes municipales, permisos de circulación, derechos, Juzgado de Policía Local—. Consume las órdenes de ingreso que estos generan, mediante contrato de entrada especificado |
| D-4 | **Proprofundidad** | Módulo completo, con el núcleo no diferible marcado explícitamente dentro |
| D-5 | **Método** | Réplica del método de Adquisiciones, Presupuestos y Contabilidad |
| D-6 | **Tramitación del decreto de pago (DocDigital)** | El decreto de pago (proceso 38; también etapa 5 de Adquisiciones y factoring) se **origina en SGM** y se **tramita en DocDigital** (visación, FEA, enumeración). Folio oficial = `ExternalFolio`; `code` / correlativo interno = solo trazabilidad. Decisión canónica: [`arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md`](../../arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md). Condicionado a **P-72** (bloqueante). Alcance operativo por frecuencia — **P-74 / T-11** |

### 2.1 Consecuencia de D-3: el contrato de entrada de la OI es el punto crítico

Excluir a los giradores es la reducción de alcance más grande de todo el corpus, y la que más valor tiene: muchos municipios ya operan sistemas de patentes y permisos que funcionan. Pero traslada todo el riesgo a un solo punto: **si el contrato de entrada de la orden de ingreso está mal especificado, Caja no puede cobrar**.

El proceso 40.2.3 lo dice sin ambigüedad: la orden de ingreso es *«el único documento válido que acredita el pago por caja»*, y el sistema debe contener **todas** las órdenes de ingreso, tanto las creadas momentos antes del pago —un giro del Juzgado de Policía Local— como las creadas con mucha anticipación —rentas por patentes municipales—.

Eso impone dos modos de entrada muy distintos: **carga masiva anticipada** y **creación sincrónica en el momento del cobro**. Ambos deben estar en el contrato.

**Ancla en el as-is (v0.2).** Odoo ya opera un feed externo de caja: `sem.data.reception` + `sem.entry.config` (mapeo por tipo de documento) y controlador HTTP `POST /api/sem/data`. Es el único patrón productivo de ingreso desde un sistema externo hacia OI + pago. T-1 debe partir de ese contrato funcional —sin heredar `auth='none'` ni el protocolo concreto— e inventariar los demás giradores.

> **PENDIENTE T-1 (estructural):** Especificar el contrato de entrada de órdenes de ingreso con sus dos modos —masivo anticipado y sincrónico— e inventariar los giradores reales de un municipio tipo, con volumen y sistema de origen. Usar SEM como caso de referencia (T-12). Sin esto, D-3 traslada riesgo en lugar de reducirlo. **Bloquea F3.**

### 2.2 Consecuencia de D-6

1. **Cambio vs as-is:** `payment.decree.code` (secuencia `payment.decree`) **deja de ser el identificador oficial** del acto. Se conserva como trazabilidad interna.
2. **Estado de espera:** la máquina del decreto incorpora `pending_signature` hasta el retorno DocDigital (`AdministrativeActSigned` / `DocumentProcedureCompleted`).
3. **Alta frecuencia:** el decreto de pago es el acto DocDigital de mayor volumen operativo; su alcance exacto (¿todos los decretos o un subconjunto?) queda abierto en T-11 / P-74.

---

## 3. Diagnóstico: qué tenemos hoy

### 3.1 Levantamiento de procesos

| # | Proceso | Actores | Cobertura |
|---|---|---|---|
| 38 | Tesorería: Pago | Tesorería | Recepción de decreto, transferencia, cheque, cheques nulos y caducados, conciliación auxiliar |
| 39 | Tesorería: Pago a Terceros | Tesorería | FCM por permisos de circulación, multas TAG, Registro Civil, Ley de Alcoholes, transferencias a otros municipios |
| 40 | Tesorería: Caja | Cajero | Recepción de OI, cobro por múltiples medios, verificación y timbre, búsqueda por RUT |
| 41 | Tesorería: Garantía | Tesorería, Solicitante | Ingreso, custodia, control de vigencia, devolución, renovación, cobro |
| 42 | Tesorería: Cuadratura de Caja | Cajero, Tesorero, Alcaldía | Rendición diaria, anulaciones, depósito, estado diario, decreto |

#### Ocho hallazgos del levantamiento

**1. Hay dos conciliaciones bancarias, no una.** Tesorería realiza una **conciliación bancaria auxiliar diaria** (38.2.5), que compara cartolas contra el libro de Tesorería. Mensualmente esas conciliaciones auxiliares **se remiten a Contabilidad para su verificación y cuadratura con la conciliación contable**.

Esto resuelve la ambigüedad que quedó abierta en el plan de Contabilidad sobre la propiedad del proceso 37: son dos artefactos distintos, con dueño, periodicidad y propósito propios. La conciliación contable mensual **verifica contra** la auxiliar diaria, no la reemplaza.

**2. La dirección del flujo hacia Contabilidad es la inversa de la intuitiva.** El proceso 42.2.7 es explícito: *«No es tesorería la que carga la información a Contabilidad, sino que Contabilidad ejecuta este proceso (diariamente)»*. Contabilidad **consulta**; Tesorería **expone**. El contrato debe modelarse así, no como un envío.

**3. El levantamiento pide explícitamente una mejora de diseño.** También en 42.2.7: *«Los sistemas actuales cargan un resumen por cuenta contable, sin embargo, se debería analizar hacer una carga más desagregada, al menos a nivel de tipo de pago (efectivo, tarjeta, etc). Pero también se podría considerar a nivel desagregado de cada uno de los pagos. Esto facilitaría procesos de revisión y de conciliación bancaria.»*

Es inusual: el levantamiento normalmente describe la práctica, y aquí propone un cambio con justificación. **Debe recogerse como requisito**, no como comentario. La granularidad del traspaso a Contabilidad es una decisión de diseño con consecuencias directas sobre la conciliación. En Odoo, `payment.consolidation.method.summary` ya resume por medio: es un piso candidato para T-4.

**4. La anulación de una orden de ingreso pagada tiene ventana de un día.** Según 42.2.12, la eliminación *«solo es posible el mismo día de la transacción»*, con formulario del departamento girador que indica el número de orden a eliminar y el de reemplazo, firmado por la cajera. El desistimiento del contribuyente sigue la misma regla: mismo día, antes de cuadrar caja, con solicitud firmada y copia de cédula.

Es el **cuarto punto del sistema donde el tiempo produce un efecto**, tras el silencio del art. 82 LOCM, los 10 días del art. 29 c) y los 8 días hábiles de la Ley 19.983. A diferencia de los otros tres, este no está anclado a una norma sino a la cuadratura de caja: **la ventana no es de 24 horas, es hasta el cierre de la jornada**.

**No confundir con el descargo contable** (v0.2). En Contabilidad existe un mecanismo distinto —descargo de OI de años anteriores (`discharge_*` / wizard) con decreto alcaldicio— **sin** ventana anclada al cierre de caja. No sustituye el requisito 42.2.12. Ver T-13.

**5. El aporte al FCM tiene plazo legal computable.** El informe mensual del 62,5% de la recaudación de permisos de circulación se integra a la Tesorería General de la República mediante el Formulario 10 **a más tardar el 5° día hábil del mes siguiente** (39.2.2).

**6. El control de vigencia de garantías lo dispara el sistema, no el usuario.** Según 41.2.4, Tesorería *«obtiene del sistema un listado de Garantías próximas a vencer y notifica a los departamentos correspondientes»*. Es un proceso proactivo, y de los pocos del corpus donde el sistema inicia la acción. **En Odoo no hay cron ni alerta automática** — solo estados y renovación manual.

**7. Las garantías tienen una cadena de firma de tres personas y generan documento contable.** El proceso 41.1.1 indica firma de **Tesorera, Jefe de Contabilidad y Director de Finanzas**, y que el registro *«genera un documento contable de ingreso»*. En Odoo, `tesoreria.garantia` **no tiene enlace a `account.gov.move`**, **no impone SoD de tres roles** y la renovación (`action_renew`) es manual con motivo fijo `'POR DEFINIR'`. Triple caso de *expediente sin efecto de dominio* (§3.2.1).

**8. Los cheques tienen ciclo de vida propio con reemisión.** Además del cheque pagado, el proceso 38.2.6 cubre **cheques nulos** —documentos que no se pagarán— y **cheques caducados**, con emisión de un **nuevo decreto de pago** si el proveedor desea cobrar. La caducidad no cierra la obligación: la reabre por otra vía. Odoo (`account.gov.check` en Contabilidad) tiene estados `expired` / `no_payment_order` con acciones, **sin** vínculo a un nuevo `payment.decree`.

### 3.2 Odoo as-is

[`modelos-odoo.md`](modelos-odoo.md) reconstruye `tesoreria_gov_cl` y su portal. Muchos modelos usan el prefijo `account.gov.*` aunque viven en el addon de Tesorería. **v0.2:** tablas siguientes contrastadas contra el ORM (julio 2026).

Regla de uso: **fuente de requisitos funcionales candidatos, nunca fuente de arquitectura.**

#### Qué Odoo hace bien

| Capacidad | Evidencia |
|---|---|
| Caja diaria como sesión con estados | `payment.day`: `draft → open → ready → closed → cancelled`, con cajero responsable y medios habilitados |
| Saldos por medio de pago | `payment.day.balance` con saldo inicial y final computado desde pagos `with_voucher` |
| Arqueo con diferencias computadas | `payment.consolidation.cash.count`: monto declarado vs. sistema, con `difference_amount` y trío único |
| Consolidación con ciclo de depósito | `payment.consolidation`: `draft → rectifiable → reception → bank_deposit → done`; **`action_to_reception` cierra las cajas** (`payment.day` → `closed`) |
| Resumen por medio en consolidación | `payment.consolidation.method.summary` — piso candidato para T-4 |
| Decreto de pago con generación de asiento | `payment.decree` con `move_egreso_pagado_id`, reverso al cancelar, y débitos/créditos vía `contra_egreso_pagado_id`; `code` por secuencia interna |
| Pago en lote | `payment.decree.batch` (`draft/in_progress/done/cancelled`); **líneas** `pending / processed / error` |
| Caja chica anclada a decreto | `account.gov.petty.cash` con `decree_id` required, rendición y aprobación por línea |
| Recepción de datos externos (SEM) | `sem.data.reception` crea OI + pago; `sem.entry.config` por tipo de documento; API `POST /api/sem/data` |
| Flag / reporte permisos de circulación | `vehicle_registration` en ingreso percibido + reporte asociado — relevante para MT-4 aunque FCM no exista |
| Reajuste e intereses | `account.gov.ipc` (Tesorería) + `account.gov.interest.rate` (**Contabilidad**) |
| Portal de proveedores | `portal_tesoreria_gov_cl`: consulta de decretos por `partner_ids` |
| Procedimientos TUPA cargados | post_init: caja, cuadratura, decreto de pago, garantía, caja chica, **pago a tercero** |

#### Qué Odoo hace mal o no hace

| Capacidad esperada | Situación real |
|---|---|
| **Garantía con efecto contable, SoD y alerta de vigencia** | `tesoreria.garantia`: estados sí; **sin** `account.gov.move`; **sin** cadena de tres firmas; **sin** cron/alerta de vencimiento; renovación manual. Expediente sin efecto de dominio (§3.2.1) |
| **Asiento de la consolidación** | `_create_accounting_entry` existe pero **`action_done` no la invoca** (llamada comentada). Código legado inactivo |
| Conciliación pago ↔ factura | `account.gov.payment.line` legado; el O2M está **comentado** en el modelo y el flujo operativo no lo usa |
| **Conciliación bancaria auxiliar diaria** | Ausente. Inherit en Tesorería **entero comentado** (`account_gov_conciliation.py`). La conciliación operativa es de Contabilidad (`account.gov.conciliation`, mensual) |
| **Certificado de Saldos Bancarios** | Ausente |
| **Estado Diario** | Ausente como entidad; lo más cercano es `payment.consolidation` |
| **Anulación con ventana hasta cierre de caja** | Ausente. No hay entidad ni control temporal anclado a `payment.day` |
| **Desistimiento del contribuyente** | Ausente |
| **Descargo contable de OI (años anteriores)** | Existe en **Contabilidad** (`discharge_*` / wizard + decreto) — **no** es la anulación 42.2.12; no confundir (T-13) |
| **FCM, Formulario 10, RMTNP, Ley de Alcoholes** | **Sin modelos de dominio.** Comentarios residuales (`fcm_pc`, `rmtnp`) en ingreso percibido. Existe TUPA `tesoreria_pago_tercero` **sin efecto de dominio** (§3.2.1) |
| **Especies valoradas** | Ausentes |
| **Cheques nulos y caducados con reemisión** | `account.gov.check` (**Contabilidad**): estados `expired` / `no_payment_order` con acciones; **sin** ciclo que emita nuevo `payment.decree` |
| Archivo de transferencia bancaria | `partner.bank.transfer.file` existe en **`account_gov_cl`**, no en el addon de Tesorería — frontera de propiedad |
| Búsqueda de pagos pendientes por RUT | Dominio de OI por depto / año / `received_status`; `partner_vat` es related de display, no criterio de búsqueda (40.2.6) |
| Folio oficial del decreto | `payment.decree.code` = secuencia interna; contradice D-6 / DocDigital |

#### 3.2.1 Expediente sin efecto de dominio (casos confirmados en Tesorería)

Se adopta la categoría del plan de Contabilidad §3.2.1. Casos ya verificados en el ORM:

| Caso | Qué existe | Qué falta |
|---|---|---|
| Garantía | Estados, TUPA, renovación manual | Asiento, SoD de tres roles, alerta de vigencia, custodia física |
| Consolidación | Ciclo completo + método `_create_accounting_entry` | Invocación real del asiento al cerrar |
| Pago a terceros | TUPA `tesoreria_pago_tercero` | Modelos FCM / Formulario 10 / RMTNP / Alcoholes |
| Conciliación en Tesorería | Archivo de inherit | Todo el cuerpo comentado — stub muerto |

> **PENDIENTE T-14:** Revisar el resto de procedimientos TUPA del módulo con esta lente antes de F3 (espejo de C-15).

### 3.3 Brecha de cobertura

| Ámbito | Levantamiento | Odoo | Brecha |
|---|---|---|---|
| Caja diaria y cobro por múltiples medios | Sí (40) | Sí | Cubierto; falta búsqueda por RUT |
| Cuadratura, arqueo y diferencias | Sí (42) | Sí | Cubierto |
| **Estado Diario como documento** | **Sí (42.2.6, 42.2.11)** | **No** | **Sin cobertura** |
| **Anulación y desistimiento con ventana** | **Sí (42.2.12)** | **No** (descargo Contabilidad ≠ anulación) | **Sin cobertura; regla temporal dura — T-13** |
| Depósito bancario al día hábil siguiente | Sí (42.2.6) | Parcial (`bank_deposit`) | Formalizar plazo |
| **Traspaso desagregado a Contabilidad** | **Sí, como requisito explícito (42.2.7)** | Resumen por cuenta; existe `method.summary` | **T-4; `method.summary` es piso** |
| Decreto de pago, transferencia y cheque | Sí (38) | Sí (efecto contable sí; folio interno) | Cubierto en mecánica; **reclasificar folio → DocDigital (D-6)** |
| **Cheques nulos y caducados con reemisión** | **Sí (38.2.6)** | Parcial (estados Contabilidad, sin reemisión) | **T-7** |
| **Conciliación bancaria auxiliar diaria** | **Sí (38.2.5)** | **No** (stub comentado) | **Sin cobertura** |
| **Certificado de Saldos Bancarios** | Sí (proceso 33 Contabilidad) | **No** | **Sin cobertura; bloquea cierre Contabilidad** |
| **FCM y pagos a terceros** | **Sí (39)** | **Parcial: TUPA sin dominio** | **Expediente sin efecto; plazos legales** |
| Garantías: ingreso y estados | Sí (41) | Parcial (estados + TUPA) | Parcial |
| **Garantía: vigencia proactiva, SoD, custodia, asiento** | **Sí (41.1.1, 41.2.4)** | **No** | **Expediente sin efecto de dominio** |
| Caja chica | No levantado | Sí | Odoo aporta el requisito |
| Recepción externa tipo SEM | No levantado | Sí (modelo + API + config) | **Ancla de T-1 / T-12**; endurecer contrato |
| **Especies valoradas** | Mencionado (40) | **No** | **Sin cobertura** |
| **Órdenes de ingreso desde giradores** | Sí (40.2.3) | Parcial (SEM + OI de Contabilidad) | **Contrato de entrada (T-1)** |

**Lectura.** Odoo cubre bien el núcleo operativo de caja y pago —es probablemente el módulo mejor implementado del as-is— y el levantamiento cubre bien el ciclo diario. La brecha se concentra en **cuatro frentes**: (1) artefactos que cruzan a Contabilidad; (2) pagos reglados a terceros con plazo legal (TUPA vacío); (3) reglas temporales de anulación; (4) garantías como expediente sin dominio, más la reclasificación DocDigital del decreto.

---

## 4. Marco normativo → implicancias de diseño

| Norma | Regla | Implicancia de diseño |
|---|---|---|
| **LOCM art. 14 y DL 3.063 sobre rentas municipales** | El Fondo Común Municipal se constituye, entre otros, con el **62,5% de lo recaudado por permisos de circulación** | Porcentaje como `NormativeParameter` con vigencia temporal, clase «respaldo de órgano rector». Nunca constante en código. El flag `vehicle_registration` del as-is anticipa la necesidad de tipificar la recaudación PC |
| **Plazo de integración del aporte FCM** (39.2.2) | Informe mensual a la TGR mediante **Formulario 10**, a más tardar el **5° día hábil del mes siguiente** | Plazo computable en días hábiles, con calendario de feriados. Genera alerta y registro de cumplimiento |
| **Multas Ley de Alcoholes** (39.2.4) | Pago mensual del **40%** de las multas cobradas vía Juzgado de Policía Local, por Formulario 10 | Segundo porcentaje reglado; mismo tratamiento |
| **Registro de Multas de Tránsito no Pagadas (RMTNP)** (39.2.3) | Carga mensual al portal del Registro Civil; con el informe recibido se confeccionan decretos de pago | Integración externa con el Registro Civil; ciclo de ida y vuelta |
| **Ley 19.983** | Cesión de facturas; el pago debe dirigirse al cesionario | Tesorería recibe la orden de suspensión y el beneficiario efectivo desde Contabilidad. Ver C-12 y C-13 |
| **Cuadratura y depósito** (42.2.6) | Depósito de efectivo y cheques en el banco **al día hábil siguiente** | Plazo operativo con control de cumplimiento |
| **Anulación de orden de ingreso** (42.2.12) | Solo el **mismo día de la transacción**, con formulario firmado que indica orden anulada y de reemplazo | Ventana temporal anclada al cierre de caja, no a 24 horas. Distinto del descargo contable (T-13) |
| **Custodia de garantías** (41) | Firma de Tesorera, Jefe de Contabilidad y Director de Finanzas; documento contable de ingreso; custodia física | Cadena de firma de tres roles (`SignatureChain`); el documento físico existe y su custodia debe registrarse |
| **DocDigital / FEA en decretos** | Actos administrativos tramitados en plataforma estatal (cobertura ~80 % municipios) | D-6; vía alternativa P-73 / T-11 |

> **PENDIENTE T-2:** Verificar en fuente primaria los tres porcentajes y plazos citados por el levantamiento —62,5% FCM, 40% Ley de Alcoholes, 5° día hábil— antes de convertirlos en validadores. El corpus ya tiene un caso documentado de cita errónea heredada del levantamiento. El 62,5% está confirmado en fuente secundaria; los otros dos, no.

---

## 5. Arquitectura funcional propuesta

```
MT-1  Caja y recaudación                  (proceso 40; OI, medios de pago, timbre)
MT-2  Cuadratura, estado diario y depósito (proceso 42; arqueo, anulaciones, decreto)
MT-3  Pagos                                (proceso 38; decreto DocDigital, transferencia, cheque, reemisión)
MT-4  Pagos reglados a terceros            (proceso 39; FCM, TGR, Registro Civil, otros municipios)
MT-5  Garantías                            (proceso 41; custodia, vigencia, devolución, cobro)
MT-6  Fondos a rendir y caja chica         (no levantado; aportado por el as-is)
MT-7  Conciliación auxiliar y saldos       (38.2.5; certificado de saldos bancarios)

TR    Medios de pago, IPC e intereses
GP    Gobernanza de plataforma — común con Presupuestos
```

### Patrón raíz propuesto

Dos raíces, y aparece un patrón que ya se repite en los tres módulos escritos:

1. **`CashierSession`** — la jornada de caja. Gobierna **qué se puede registrar y hasta cuándo**: define medios habilitados, saldos iniciales, y su cierre marca el fin de la ventana de anulación. No es un contenedor de pagos: es la entidad que decide su mutabilidad.
2. **`PaymentDecree`** — la raíz del egreso. Ciclo propio, agrupa egresos devengados y produce el egreso pagado. Con D-6: estado `pending_signature` y folio oficial externo.

**Patrón transversal emergente.** En los tres módulos especificados hasta ahora existe una entidad cuya única función es gobernar la ventana de mutabilidad de los hechos: `BudgetExercise` en Presupuestos, `AccountingPeriod` en Contabilidad, `CashierSession` en Tesorería. Conviene tratarlo como patrón declarado del corpus y no como coincidencia: mismo comportamiento esperado de apertura, cierre, reapertura auditada con motivo, y bloqueo de escritura fuera de ventana.

> **PENDIENTE T-3:** Validar el patrón de doble raíz y elevar el patrón de «ventana de mutabilidad» a decisión transversal de arquitectura, con comportamiento común en los tres módulos.

### Entidades preliminares candidatas

**Caja e ingreso:** `CashierSession`, `CashSessionBalance`, `RevenueCollection` (pago recibido), `CollectionItem`, `PaymentMethod`, `ValuedDocument` (especies valoradas), `CollectionAnnulment` (anulación y desistimiento, con ventana), `ExternalCollectionFeed` (recepción tipo SEM; anclada en `sem.*` del as-is)

**Cuadratura:** `CashConsolidation`, `CashCount` (arqueo), `CashMethodSummary` (piso desde `method.summary`), `DailyStatement` (Estado Diario), `BankDeposit`

**Egreso:** `PaymentDecree` *(con `external_folio`, `document_procedure_id`, `status` incl. `pending_signature` — D-6)*, `PaymentDecreeLine`, `PaymentBatch`, `Check` (con nulo, caducado y reemisión), `BankTransferFile` *(propiedad: ¿Tesorería o Contabilidad? — cerrar en F0)*, `PettyCash`, `PettyCashAccountability`

**Terceros:** `ThirdPartyTransfer`, `FCMContribution`, `RegulatoryTransferForm` (Formulario 10), `TrafficFineRegistry` (RMTNP)

**Garantías:** `Guarantee`, `GuaranteeCustody`, `GuaranteeRenewal`, `GuaranteeExpiryAlert` *(disparo de sistema)*, `GuaranteeCollection`

**Conciliación y saldos:** `AuxiliaryBankReconciliation`, `BankBalanceCertificate`

**Transversal:** `CPIIndex`, `InterestRate`

**Plataforma (D-6, no duplicar):** `AdministrativeAct` / `DocumentProcedure` / `SignatureChain` / `ExternalFolio` — consumo vía C11

---

## 6. Contratos inter-módulo

| Contrapartida | Dirección | Contenido | Criticidad |
|---|---|---|---|
| **Contabilidad** | Cont → Tes | **Órdenes de ingreso** disponibles para cobro (D-1) | **Crítica** |
| **Contabilidad** | Cont **consulta** a Tes | Resumen diario de recaudación. **Contabilidad ejecuta la carga, no Tesorería** (42.2.7). Granularidad por definir: por cuenta, por medio de pago, o por pago individual | **Alta — ver T-4** |
| **Contabilidad** | Tes → Cont | **Certificado de Saldos Bancarios**: condición de cierre mensual de Contabilidad | **Alta y bloqueante** |
| **Contabilidad** | Tes → Cont | Conciliación bancaria auxiliar mensual, para verificación contra la conciliación contable | Alta |
| **Contabilidad** | Cont → Tes | Egresos devengados disponibles para decreto de pago; **beneficiario efectivo y orden de suspensión por cesión** (C-12, C-13) | **Alta y con efecto de interrupción** |
| **Contabilidad** | Frontera | Propiedad de `BankTransferFile` / `Check` (hoy en Contabilidad as-is); descargo de OI ≠ anulación de caja (T-13) | Media-alta |
| **Presupuestos** | Tes → Pres | Ingresos percibidos y por percibir; **ingresos propios percibidos del ejercicio anterior**, base del límite del 42% del art. 67 LOCM | **Alta** |
| **Adquisiciones** | Adq → Tes | Bases de licitación asociadas a garantías; evento de pago que cierra el expediente de compra | Media-alta |
| **Adquisiciones** | Tes → Adq | Estado de la garantía: recibida, vigente, devuelta o cobrada | Media |
| **RRHH** | RRHH → Tes | Decretos de pago de nómina y honorarios | Alta |
| **Core (DocDigital)** | Tes → C11 | Tramitación del decreto de pago; retorno con folio (D-6) | **Alta — P-72, T-11** |
| **Giradores externos** | Externo → Tes/Cont | Órdenes de ingreso, en modo masivo anticipado y sincrónico (D-3, T-1, T-12) | **Crítica** |
| **Portal proveedores** | Tes → externo (lectura) | Consulta de estado de decretos por el partner (as-is `portal_tesoreria_gov_cl`) | Media |
| **TGR** | Tes → externo | Formulario 10: aporte FCM y multas Ley de Alcoholes | Alta (obligación legal) |
| **Registro Civil** | Bidireccional | RMTNP: carga de multas pagadas y recepción del informe | Alta |
| **Otras municipalidades** | Tes → externo | Transferencia de fondos de terceros por permisos de circulación y multas TAG, con envío de respaldos | Media |
| **Bancos** | Bidireccional | Archivo de transferencias, cartolas y certificados de saldo | Alta |

> **PENDIENTE T-4:** Definir la granularidad del traspaso diario a Contabilidad. El levantamiento propone bajar de «resumen por cuenta contable» a al menos «tipo de pago», y sugiere evaluar el detalle por pago individual (42.2.7). `payment.consolidation.method.summary` del as-is es piso. Afecta volumetría, conciliación y capacidad de auditoría.

---

## 7. Plan por fases

### F0 — Cierre de decisiones estructurales · 1 semana

| Entregable | Detalle |
|---|---|
| **Contrato de entrada de órdenes de ingreso** | T-1 + ancla SEM (T-12). Bloquea F3 |
| Frontera con Contabilidad | Confirmación de D-1; propiedad del certificado de saldos, de las dos conciliaciones, de `Check` / `BankTransferFile` |
| Granularidad del traspaso diario | T-4, con impacto de volumetría estimado |
| Patrón de ventana de mutabilidad | T-3, elevado a decisión transversal |
| **Alcance DocDigital del decreto de pago** | T-11 / P-74 |

### F1 — Levantamiento normativo · 1–2 semanas

| Entregable | Detalle |
|---|---|
| Ficha normativa del módulo | Tabla §4 ampliada, con regla verificable por validador |
| **Verificación de porcentajes y plazos** | T-2: 62,5% FCM, 40% Ley de Alcoholes, 5° día hábil, depósito al día hábil siguiente |
| Especificación del Formulario 10 | Formato, canal y acuse de la TGR |
| Integración con Registro Civil | Mecanismo de carga RMTNP y recepción del informe |
| Régimen de especies valoradas | Marco aplicable y control de existencias |

### F2 — Levantamiento de procesos faltantes · 2 semanas

| Entregable | Detalle |
|---|---|
| BPMN — Estado Diario y certificado de saldos | Descompone 42.2.6 y 42.2.11; define el artefacto que bloquea el cierre de Contabilidad |
| BPMN — Conciliación bancaria auxiliar | Proceso diario de Tesorería, distinto de la conciliación contable |
| BPMN — Anulación y desistimiento | Ventana temporal, formularios, firmas, efecto sobre la caja del día; **distinción explícita del descargo Contabilidad (T-13)** |
| BPMN — Caja chica y fondos a rendir | No levantado; construir desde el as-is y validar |
| BPMN — Especies valoradas | Sin cobertura en ninguna fuente |
| BPMN — Feed externo / SEM | Formalizar el contrato a partir del as-is (T-12) |
| **Reclasificación con la lente de expediente sin efecto de dominio** | T-14: aplicar §3.2.1 a todos los TUPA del módulo |
| Validación con municipios piloto | Contraste con al menos dos municipios |

### F3 — Fichas de proceso por etapa · 3 semanas

| Macroproceso | Etapas estimadas |
|---|---|
| MT-1 Caja y recaudación | 3 (recepción de OI o búsqueda por RUT → cobro por medio → verificación y timbre) |
| MT-2 Cuadratura y estado diario | 4 (cierre de cajero → rendición → arqueo y anulaciones → estado diario, decreto y depósito) |
| MT-3 Pagos | 4 (origen decreto → tramitación DocDigital / `pending_signature` → transferencia o cheque → nulos, caducados y reemisión) |
| MT-4 Pagos reglados a terceros | 4 (FCM permisos → RMTNP Registro Civil → Ley de Alcoholes → transferencias a municipios) |
| MT-5 Garantías | 5 (ingreso y cadena de firma → custodia → alerta de vigencia → devolución o renovación → cobro + efecto contable) |
| MT-6 Fondos a rendir | 2 (entrega contra decreto → rendición y cierre) |
| MT-7 Conciliación auxiliar y saldos | 2 (conciliación diaria → certificado de saldos) |

### F4 — Modelo de datos y contratos · 2 semanas

| Entregable | Detalle |
|---|---|
| Modelo de entidades consolidado | Con `Guarantee` enlazada a su efecto contable; `PaymentDecree` con folio externo (D-6) |
| Máquinas de estado | Sesión de caja, consolidación, decreto (`pending_signature`), cheque con reemisión, garantía |
| Contratos de API inter-módulo | Los de §6, versionados, incluido Core (DocDigital) |
| **Contrato de consulta de Contabilidad** | Modelado como *pull*, según 42.2.7, con la granularidad de T-4 |

### F5 — Transversales, wireframes y consolidación · 2 semanas

| Entregable | Detalle |
|---|---|
| Especificación de seguridad | SoD de caja: cajero registra, Tesorero recibe y deposita; cadena de firma de garantías con tres roles; el arqueo lo valida quien no recaudó |
| Especificación de escalabilidad | Caja es el punto de mayor concurrencia con usuarios finales; la volumetría del traspaso diario depende de T-4; latencia DocDigital en decretos (P-76) |
| Marcado del núcleo no diferible | Percepción, pago y certificado de saldos son núcleo; garantías, caja chica y especies valoradas admiten diferimiento con condición de salida |
| Wireframes SVG | Pantalla de caja, arqueo, estado diario, expediente de garantía |

---

## 8. Pendientes abiertos

| ID | Pendiente | Bloquea | Responsable |
|---|---|---|---|
| **T-1** | Contrato de entrada de órdenes de ingreso: dos modos e inventario de giradores | **F3** | Equipo + DM |
| **T-2** | Verificación en fuente primaria de porcentajes y plazos del proceso 39 | F1 | Equipo interno |
| **T-3** | Patrón de doble raíz y elevación de «ventana de mutabilidad» a decisión transversal | F3, F4 | Equipo interno |
| **T-4** | Granularidad del traspaso diario a Contabilidad (piso: `method.summary`) | F0 / F4 | Equipo + Contabilidad |
| **T-5** | Propiedad y formato del Certificado de Saldos Bancarios; comportamiento si no se emite en plazo (espejo de C-10) | F2 | Equipo + DM |
| **T-6** | Régimen de especies valoradas: control de existencias, responsabilidad y arqueo | F1 | DM |
| **T-7** | Ciclo de cheques caducados: relación entre el decreto original y el de reemisión, y efecto sobre el devengado | F3 | Equipo + Contabilidad |
| **T-8** | Custodia física de garantías: registro de ubicación, entrega y devolución del documento físico | F3 | DM |
| **T-9** | Contrato con el Registro Civil para RMTNP: mecanismo, periodicidad y manejo de errores | F1 | DM |
| **T-10** | Efecto contable de la garantía: qué asiento genera el ingreso en custodia y cuál su devolución o cobro | F3 | Equipo + Contabilidad |
| **T-11** | Alcance DocDigital del decreto de pago (alta frecuencia): ¿todos, umbral, o vía alternativa por tenant? Alineado a P-74; folios históricos `payment.decree.code` (P-75) | F0 / MT-3 | Equipo + DM |
| **T-12** | Contrato de feed externo a partir de SEM (`sem.data.reception` + `sem.entry.config` + API): semántica estable sin heredar protocolo ni `auth='none'` | F0 / T-1 | Equipo + plataforma |
| **T-13** | Separar en modelo y fichas la **anulación misma jornada** (42.2.12) del **descargo contable** de OI (Contabilidad); quién es dueño de cada una | F2 | Equipo + Contabilidad |
| **T-14** | Revisar TUPA del módulo con la lente de expediente sin efecto de dominio (§3.2.1); espejo de C-15 | F2 / F3 | Equipo interno |

---

## 9. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **El contrato de entrada de órdenes de ingreso queda mal especificado** | **Muy alto — Caja no puede cobrar; es el único punto de falla que deja al municipio sin operar de cara al ciudadano** | T-1 + T-12 en F0, con inventario real de giradores y volumen |
| Tesorería no emite el certificado de saldos y Contabilidad no puede cerrar | Alto — bloqueo en cadena | T-5, espejo de C-10, con modo condicionado especificado |
| Procedimientos TUPA sin efecto de dominio dados por cubiertos | Medio-alto — garantía, consolidación sin asiento invocado, pago a tercero vacío: casos confirmados | §3.2.1 + T-14 en F2 |
| Porcentajes y plazos del proceso 39 tomados sin verificar | Medio-alto — se convierten en validadores con efecto de incumplimiento legal | T-2 en F1 |
| La granularidad del traspaso diario se define tarde | Medio — afecta volumetría, conciliación y modelo | T-4 en F0 |
| Caja es el punto de contacto con el ciudadano | Medio-alto — una caída es visible y no admite diferimiento | Clasificación de exposición según §5.1 del plan de Presupuestos |
| **Decreto de pago atado a DocDigital sin API verificada** | **Alto — paraliza egresos si P-72 falla o latencia es alta** | T-11 + vía alternativa P-73; no consumar pago sin retorno o registro asistido |

---

## 10. Criterios de término del módulo

1. El contrato de entrada de órdenes de ingreso está especificado en sus dos modos y validado con al menos dos giradores reales (SEM como caso de referencia).
2. Ninguna garantía, consolidación, pago a terceros ni cobro figura como cubierto si solo existe como expediente sin efecto sobre el dominio.
3. Las dos conciliaciones —auxiliar diaria de Tesorería y contable mensual de Contabilidad— están especificadas por separado, con su relación de verificación explícita.
4. La granularidad del traspaso a Contabilidad está decidida y justificada, y el contrato se modela como consulta y no como envío.
5. La ventana de anulación está anclada al cierre de la sesión de caja y es verificable por el motor; el descargo contable está especificado aparte.
6. Los porcentajes y plazos de los pagos reglados son `NormativeParameter` con vigencia temporal y clase de autoridad declarada.
7. La sesión de caja gobierna la mutabilidad de los hechos que contiene, con el mismo comportamiento que el período contable y el ejercicio presupuestario.
8. La cadena de firma de garantías con tres roles es impuesta por el motor; la alerta de vigencia es disparada por el sistema.
9. El decreto de pago usa folio externo DocDigital (o vía alternativa documentada); el correlativo interno no se presenta como identificador oficial.

---

## 11. Advertencias sobre este documento

1. **Los porcentajes y plazos del proceso 39 provienen del levantamiento.** Solo el 62,5% del FCM está confirmado en fuente secundaria; el 40% de la Ley de Alcoholes y el plazo del 5° día hábil, no. No deben convertirse en validadores antes de T-2.
2. **Caja chica, especies valoradas y recepción externa tipo SEM no están levantadas como procesos.** Caja chica y SEM provienen del as-is de Odoo (SEM con API productiva); especies valoradas solo se menciona de pasada en la descripción del proceso 40. Los tres requieren levantamiento en F2 antes de especificarse.
3. **La frontera con los giradores es una propuesta de alcance, no un hallazgo.** D-3 es económicamente conveniente y coherente con la realidad municipal, pero no está validada con municipios. Si resultara que los giradores relevantes no tienen sistema propio, D-3 debe revisarse y el alcance del módulo crece de forma significativa.
4. **El efecto contable de las garantías no está resuelto en ninguna fuente.** El levantamiento dice que genera «un documento contable de ingreso» sin precisar cuál; Odoo no lo implementa. T-10 debe resolverlo con Contabilidad antes de F3.
5. **La API SEM del as-is no es el contrato to-be.** Existe y opera (`auth='none'`); T-12 debe extraer la semántica y descartar el mecanismo inseguro.
6. **DocDigital no está verificado como API M2M (P-72).** Toda especificación de MT-3 queda condicionada a esa verificación.
