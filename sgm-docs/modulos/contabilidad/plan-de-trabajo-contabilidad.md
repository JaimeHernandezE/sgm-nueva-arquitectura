# Plan de trabajo — Módulo Contabilidad

**Proyecto:** SGM — Sistema de Gestión Municipal
**Módulo:** Contabilidad
**Versión:** 0.5 (borrador para revisión interna)
**Fecha:** julio 2026
**Estado:** propuesta de plan, no validada con DM

**Cambios v0.5:** decisión de frontera **D-5 — DocDigital** (SGM origina decretos; DocDigital tramita y enumera). Referencia canónica: [`arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md`](../../arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md). Inventario de actos del módulo (baja, donación, cesión, decreto de pago) en [`integracion-docdigital.md`](../../arquitectura/especificacion/integracion-docdigital.md) §3. Reclasificación de la FEA: para actos administrativos es **cableado a DocDigital (C11)**, no construcción de FirmaGob; EEFF siguen sujetos a P-74 (¿DocDigital o C9?). Pendientes C-16…C-18. Estado `pending_signature` obligatorio en máquinas que dependen del acto firmado.

**Cambios v0.4:** tres consecuencias derivadas del diagnóstico corregido en v0.3. Se introduce la categoría de brecha **“expediente sin efecto de dominio”** (§3.2.1), se declara la dependencia **EEFF ← snapshot de cierre** (§3.2.2), y se reclasifica la brecha de firma electrónica avanzada como **cableado y no construcción** (§3.2.3).

**Cambios v0.3:** diagnóstico Odoo (§3.2–3.3) contrastado con el ORM real y con [`modelos-odoo.md`](modelos-odoo.md). Se corrige el enlace roto al inventario; se rebaja “Ausente/No” a **parcial** donde el código ya aporta PDF CGR/trimestral (`reports_gov_cl`), procedimiento TUPA de factoring (doble decreto, Suspender Pago) y label “Beneficiario” en el comprobante — sin diluir C-4, C-5, C-12 ni C-13 (sigue faltando dominio estructurado, SII, FEA, archivo plano y SINIM/20.237).

**Cambios v0.2:** se incorpora **factoring y cesión de facturas** (proceso 32) al alcance del módulo, como macroproceso propio MC-7. Aporta el tercer punto del sistema donde un plazo legal dispara consecuencias, y un requisito de modelo no detectado antes: **el beneficiario del pago puede no ser el acreedor de la obligación**.

**Convención de pendientes:** este módulo usa el prefijo **C-nn**, para no colisionar con la serie **P-nn** de Presupuestos. Las referencias cruzadas a Presupuestos conservan su prefijo original.

---

## 1. Propósito

Definir la secuencia de trabajo para producir la especificación completa del módulo Contabilidad, con el estándar ya fijado: *dos equipos independientes deben poder construir sistemas funcionalmente equivalentes solo con la especificación*.

Este documento **no** es la especificación. Es el plan que la produce.

---

## 2. Decisiones de partida

| # | Decisión | Contenido |
|---|----------|-----------|
| D-1 | **Devengo dual** | Un mismo hecho económico produce **dos efectos con dueños distintos**: el **efecto presupuestario** (consume disponibilidad, afecta la ejecución) pertenece a Presupuestos; el **efecto patrimonial** (asiento de partida doble bajo NICSP-CGR) pertenece a Contabilidad. Ver §2.1 |
| D-2 | **Alcance del módulo** | Incluye inventario y activo fijo (proceso 28), **factoring y cesión de facturas (proceso 32)**, conciliación bancaria (proceso 37) y reportes externos a CGR y SINIM (procesos 33, 35, 36) |
| D-3 | **Profundidad** | Módulo completo, con el **núcleo no diferible marcado explícitamente** dentro. Coherente con la regla de no recortar el modelo de datos aunque la implementación sea parcial |
| D-4 | **Método** | Réplica del método de Adquisiciones y Presupuestos: fichas de proceso por etapa → modelo de entidades en naming técnico inglés → contratos de API → wireframes → especificaciones transversales |
| D-5 | **Tramitación de decretos (DocDigital)** | Decretos de baja, donación, cesión de factura y decreto de pago (procesos 28 y 32) se originan en SGM y se tramitan en DocDigital. Folio oficial externo; correlativo interno solo trazabilidad. Decisión canónica transversal. El decreto de pago queda bajo **P-74 / C-16** por frecuencia operativa. Condicionado a **P-72**. |

### 2.1 Devengo dual: qué resuelve y qué problema abre

El levantamiento asigna a Contabilidad/DAF los procesos 29 (*Registro de Devengados*) y 31 (*Registro de Obligaciones*), que en el plan de Presupuestos habíamos adjudicado a la cadena de compromiso (D-1 de aquel módulo). La contradicción es aparente: **en el municipio ambos efectos ocurren físicamente en la misma unidad, la DAF**, de modo que el levantamiento describe una realidad organizacional, no una frontera de sistema.

La lectura técnicamente correcta —y la que exige la normativa— es que hay **dos devengos**:

| Efecto | Dueño | Qué produce | Fundamento |
|---|---|---|---|
| **Presupuestario** | Presupuestos | Consumo de disponibilidad; alimenta `obliga_deven` del BEP | DL 1.263, fases del gasto |
| **Patrimonial** | Contabilidad | Asiento de partida doble en el mayor | NICSP-CGR Sector Municipal, Resolución CGR N° 3/2020 |

#### El problema que esto abre: atomicidad entre módulos

Los dos efectos **no pueden existir por separado**. Un devengo presupuestario sin asiento deja la contabilidad incompleta; un asiento sin efecto presupuestario descuadra la ejecución. Es decir: **un hecho atómico cuyos efectos viven en dos módulos independientes**.

Esto choca de frente con el principio de independencia modular con contratos versionados. No es un detalle de implementación: es probablemente **el requisito técnico más duro de toda la arquitectura SGM**, y hay que resolverlo en la especificación, no dejarlo al adjudicatario.

> **PENDIENTE C-1 (estructural):** Definir el mecanismo que garantiza la atomicidad del devengo dual entre Presupuestos y Contabilidad. Candidatos: transacción distribuida con compensación explícita (patrón saga con reversa contable), o un único punto de commit con el otro módulo como suscriptor obligatorio y reconciliación forzada. Requiere decisión arquitectónica, no solo de modelado. **Bloquea F4 de ambos módulos.**

---

## 3. Diagnóstico: qué tenemos hoy

### 3.1 Levantamiento de procesos

A diferencia de Presupuestos, que tenía dos procesos, Contabilidad tiene **diez**. La cobertura del levantamiento es sustancialmente mejor.

| # | Proceso | Actores | Cobertura |
|---|---|---|---|
| 28 | Contabilidad: Inventario | Contabilidad, Alcaldía | Alta y mantención de bienes; bajas con decreto; traslados |
| 29 | Contabilidad: Registro de Devengados | DAF | Reconocimiento de obligaciones desde factura o boleta |
| 30 | Contabilidad: Registro de Ingresos | DAF | Devengado y percibido de ingresos |
| 31 | Contabilidad: Registro de Obligaciones | DAF | Certificado de factibilidad |
| 32 | Contabilidad: Factoring | DAF, Alcaldía, Tesorería | Cesión de facturas; doble decreto; suspensión de pago en curso |
| 33 | Contabilidad: Cierre Mensual | Contabilidad | Cierre y archivo plano a CGR |
| 34 | Contabilidad: Cierre Anual | DAF | Ajustes, traspasos, patrimonio |
| 35 | Contabilidad: Informe Estados Financieros a Contraloría | DAF / Finanzas | EEFF con firma electrónica avanzada |
| 36 | Contabilidad: Informe Trimestral SINIM | DAF | BEP, FCM, Ley 20.237 |
| 37 | Finanzas: Conciliación Bancaria | Responsable, DAF, Revisor | Conciliación mensual con triple revisión |

#### Siete hallazgos del levantamiento

**1. El proceso 31 describe el CDP con otro nombre.** El *Certificado de Factibilidad* —emitido a petición de una Dirección, con validez limitada al plazo de la transacción, sustituido después por orden de compra o contrato, con numeración secuencial, monto y asignación contable— es el Certificado de Disponibilidad Presupuestaria. Aporta además una regla que no estaba en el plan de Presupuestos: **su validez no puede extenderse a otro periodo fiscal**. Es un validador. Ver C-2.

**2. El registro de ingresos tiene dos patrones distintos** (30.2.2 y 30.2.3):

- **Con rol:** el devengo ocurre *al confeccionar los roles* las unidades generadoras de la contribución, respaldado por **certificación de la Tesorería Municipal de la constitución del rol**. El percibido llega después.
- **Sin rol:** devengado y percibido se contabilizan **simultáneamente** al percibir los fondos.

Son dos ciclos de vida diferentes para la misma entidad. Odoo lo refleja con `status` y `received_status` separados en `account.gov.entry.order`.

**3. El cierre mensual está condicionado por la conciliación bancaria.** El proceso 33 exige verificar que los saldos coincidan con el *Certificado de Saldos Bancarios* que genera el Tesorero Municipal con la conciliación. **Contabilidad no puede cerrar el mes sin un insumo que produce Tesorería.** Es una dependencia dura entre módulos, con efecto de bloqueo.

**4. El cierre anual (34) es la contraparte de la apertura del ejercicio de Presupuestos (26.2.8).** Traspaso de cuentas de deudores y acreedores presupuestarios, cierre de ingresos y gastos, contabilización de patrimonio. Cierre y apertura son un mismo mecanismo visto desde dos módulos, y hoy están descritos en documentos distintos sin referencia mutua. Ver C-2 y P-6 de Presupuestos.

**5. El factoring introduce un control con consecuencia financiera directa.** El proceso 32 existe para evitar pagar al proveedor original una factura que ya fue cedida a un tercero. Tres características lo hacen distinto del resto del módulo:

- **Se dispara por evento externo, no por el flujo interno.** La detección es por revisión periódica del SII (32.2.2). Aplica aquí el mismo estándar de integración ya fijado para Mercado Público en Adquisiciones: notificación push como diseño preferido, consulta dirigida como alternativa, barridos completos prohibidos.
- **Interrumpe un proceso de otro módulo.** Si existe un decreto de pago en curso, Tesorería debe **suspender el pago** (32.2.10). Es el segundo caso de acoplamiento fuerte entre módulos, junto con el certificado de saldos bancarios.
- **Separa beneficiario de acreedor.** La cesión transfiere el crédito sin alterar la obligación: el devengo y la obligación siguen siendo con el proveedor original, pero el pago va al cesionario. Ver §3.1, hallazgo 6.

**6. Consecuencia de modelo: el beneficiario del pago no siempre es el acreedor de la obligación.** Es un requisito que no aparece en ninguna otra parte del levantamiento y que, si no se modela desde el inicio, obliga a rehacer la entidad de pago. La obligación conserva su `partner`; el pago necesita un beneficiario propio, con su acto de cesión como respaldo.

**7. La conciliación bancaria trae segregación de funciones explícita** (37.2.7 y 37.2.8): quien elabora no es quien revisa, y el segundo revisor pertenece a un departamento distinto —generalmente Tesorería y la Unidad de Control—. Es un requisito de RBAC que el levantamiento entrega ya especificado, con el contenido obligatorio del informe enumerado en doce ítems.

### 3.2 Odoo as-is

[`modelos-odoo.md`](modelos-odoo.md) reconstruye el stack `account.gov.*`, que **no es el `account.*` estándar de Odoo Community**: es un desarrollo propio que no depende del módulo `account`. Addons involucrados: núcleo `account_gov_cl`; puentes `account_gov_adquisiciones`, `inventory_account_cl`, `account_hr_gov_cl`; Tesorería `tesoreria_gov_cl` (+ portal); satélite de reportes `reports_gov_cl`.

Regla de uso, igual que en Presupuestos: **fuente de requisitos funcionales candidatos, nunca fuente de arquitectura.** Contrastar contra el ORM, nunca contra el export de BD.

#### Qué Odoo hace bien

| Capacidad | Evidencia |
|---|---|
| Plan de cuentas versionado por año | `account.gov.plan` con `year`; `account.gov.account` jerárquica con `title`…`level_5` |
| Contra-cuentas configurables por cuenta | `contra_account_id`, `fund_account_id`, `previous_year_account_id`, `doubtful_account_id`, `contra_egreso_devengado_id`, `contra_egreso_pagado_id` |
| Tipificación de movimientos | `account.gov.movement.type`: `IN_DEV`, `IN_PER`, `EG_DEV`, `EG_PAG`, `TRASP` |
| Bloqueo por período cerrado | `account.gov.move` impide create/write si el período está cerrado en `account.gov.closure` |
| Doble reconocimiento de ingresos | `entry.order` con `status` (devengado) y `received_status` (percibido) independientes |
| Plantillas de asiento parametrizadas | `entry.config` con líneas de % debe/haber por tipo de operación |
| Cierre con snapshot e historial auditado | `closure.line` (saldos por cuenta) y `closure.history` con `action_type` y motivo; reapertura por wizard |
| Conciliación bancaria con expediente | `account.gov.conciliation` con estados `draft → review → published`, importación de cartola y vínculo a movimientos |
| Activo fijo con depreciación automática | `account.gov.asset` + `depreciation.line`, cron mensual, asiento al postear |
| Puente RRHH → asiento | `hr.salary.rule.account.line` mapea regla salarial × calidad jurídica a cuentas de débito y crédito |
| Factoring como procedimiento TUPA | BPMN en `contabilidad_factoring` (carriles DAF / Alcaldía / Tesorería): gateway ¿cedido?, tareas Suspender Pago, **doble decreto** (cesión + pago) con FirmaGob; marca `factoring_type` `regular` / `cedida`, `factoring_procedure_id`, `factoring_checked`. Cargado en `post_init_hook` |
| Informe CGR / trimestral (PDF) | `reports_gov_cl`: `account.report.summary` (“Informe Estados Financieros a Contraloría”, `draft → review → sent`, PDF desde `closure.line_ids`); `account.report.trimestral`; además diario y DIPRES |
| Trazabilidad polimórfica del origen | `model_technical_name`, `record_id`, `record_name` en el comprobante |

#### Qué Odoo hace mal o no hace

| Capacidad esperada | Situación real |
|---|---|
| **Separación entre catálogo contable y clasificador presupuestario** | **Colapsados en `account.gov.account`** con `budget_code` e `is_budget_account`. Es el mismo defecto detectado desde Presupuestos (Anexo A.1 de aquel plan), ahora confirmado desde el lado contable |
| Estados Financieros a CGR (proceso 35) | **Parcial:** hay `account.report.summary` (PDF + workflow). **No** hay Balance General, Estado de Resultados, Flujos de Efectivo, Cambios en el Patrimonio ni Notas como entidades |
| Archivo plano mensual a CGR (proceso 33) | Ausente |
| Informe trimestral SINIM y Ley 20.237 (proceso 36) | **Parcial:** existe PDF trimestral (`account.report.trimestral`). **No** es BEP/FCM/SINIM ni Ley 20.237 estructurados |
| Firma Electrónica Avanzada sobre EEFF | Ausente en el flujo de reportes. **Capacidad presente en la plataforma** (FirmaGob / DocDigital). Brecha de **cableado** — ver §3.2.3; canal exacto abierto (C-16) |
| Catastro de bienes inmuebles (28.2.2) | Ausente; solo bienes muebles vía `asset` |
| Baja de bienes con revisión en terreno (28.2.3) | Solo `state: retired` y wizard; sin el flujo Control + DAF |
| Certificado de Saldos Bancarios del Tesorero (33.2.2) | No modelado como artefacto; la conciliación existe pero no el certificado que condiciona el cierre |
| Consulta al Registro de Transferencias del SII | Ausente. La detección es manual / paso TUPA de revisión; no hay integración con el Registro (C-4) |
| Suspensión de un decreto de pago en curso por cesión | **Parcial:** el BPMN de factoring tiene “Suspender Pago” como revisión humana. **No** hay estado `suspended` en `payment.decree` ni contrato de interrupción con Tesorería (C-13). Caso testigo de **expediente sin efecto de dominio** (§3.2.1) |
| Beneficiario del pago distinto del acreedor | **Parcial / ausente como modelo:** `account.gov.move.partner_id` se etiqueta “Beneficiario”, pero es un solo partner; `payment.decree.partner_ids` se computa desde egresos. **No** hay cesionario distinto del acreedor ni entidad `PaymentBeneficiary` (C-12) |
| Devengo dual explícito | No hay distinción entre efecto presupuestario y patrimonial; el asiento se genera desde la obligación |

#### 3.2.1 Una categoría de brecha propia: expediente sin efecto de dominio

El contraste con el ORM deja ver que **“no existe” y “existe como trámite sin consecuencia” son cosas distintas**, con costos de construcción muy distintos, y que hasta ahora estábamos colapsando en un mismo “parcial”.

El caso más claro es el factoring: existe el BPMN TUPA completo, con carriles DAF / Alcaldía / Tesorería, gateway *¿cedido?*, tarea *Suspender Pago* y doble decreto con FirmaGob. Lo que **no** existe es el efecto sobre el dominio: `payment.decree` no tiene estado `suspended`, y no hay contrato de interrupción con Tesorería. El proceso está descrito y es ejecutable por personas; el sistema no impone nada.

Es la misma lente de la auditoría de FirmaGob: **presencia de campo o de flujo no es integración funcional.**

Se adopta como tercera categoría en las tablas de brecha:

| Categoría | Significado | Costo típico |
|---|---|---|
| **No existe** | Sin rastro en el código | Construcción completa |
| **Expediente sin efecto de dominio** | Hay flujo, formulario o trámite, pero ninguna máquina de estados se entera | Modelado del efecto; el flujo se conserva |
| **Existe con efecto parcial** | Hay dominio, incompleto respecto del requisito | Extensión |

La distinción importa para dimensionar la licitación: lo segundo es más barato de lo que parece —el proceso ya está levantado y validado con usuarios— pero más peligroso de dar por resuelto, porque a la vista funciona.

> **PENDIENTE C-15:** Revisar el resto del módulo con esta lente antes de F3. Es probable que otros procedimientos TUPA estén en la misma situación, y hoy figuran como cobertura sin serlo en dominio.

#### 3.2.2 Los Estados Financieros derivan del snapshot de cierre

`account.report.summary` genera el PDF a partir de `closure.line_ids`. Es una decisión de diseño correcta que conviene conservar y declarar explícitamente: **el snapshot de cierre es la fuente de los estados financieros**, no el mayor consultado en vivo.

Dos consecuencias:

1. `ClosureSnapshot` deja de ser un artefacto de auditoría y pasa a ser **entidad central del módulo**: es lo que hace reproducibles los EEFF. Un estado financiero debe poder regenerarse idéntico años después, y eso solo es posible contra un snapshot inmutable.
2. **No hay EEFF sin cierre ejecutado.** Es una dependencia interna del módulo que debe declararse como precondición de MC-6, junto con la dependencia externa del certificado de saldos bancarios que condiciona el cierre mismo (§3.1, hallazgo 3). La cadena completa queda: conciliación bancaria → certificado de saldos → cierre → snapshot → estados financieros.

#### 3.2.3 La firma electrónica avanzada es cableado, no construcción

FirmaGob ya opera en la plataforma: los decretos TUPA del factoring lo usan. Lo que falta es conectarlo al flujo de reportes, no incorporarlo.

**Reclasificación v0.5 (DocDigital):** para los **actos administrativos** del módulo (decretos de baja, donación, cesión, decreto de pago), la FEA llega **incluida en DocDigital** (C11). La brecha no es construir FirmaGob ni siquiera cablear C9 acto a acto: es **cablear la tramitación DocDigital** y verificar extremo a extremo (P-72). C9 permanece para documentos que no sean esos actos.

Los **Estados Financieros (proceso 35)** quedan abiertos: ¿tramitación DocDigital o firma directa C9? — **C-16 / P-74**. Hasta cerrarlo, se mantiene la exigencia de verificación funcional de extremo a extremo antes de dar la FEA por disponible — el propio antecedente de FirmaGob enseña que configuración presente no equivale a integración funcional.

Reclasificar esta brecha cambia su estimación de esfuerzo de forma relevante y evita sobredimensionar MC-6 / MC-7 en la licitación.

### 3.3 Brecha de cobertura

| Ámbito | Levantamiento | Odoo | Brecha |
|---|---|---|---|
| Plan de cuentas NICSP versionado | No | Sí (`plan` por año) | Rehacer separado del clasificador |
| Comprobante y mayor | Implícito | Sí | Cubierto; contrastar campos |
| Devengo de gasto | Sí (29) | Sí (desde obligación) | **Modelar como efecto dual (D-1, C-1)** |
| Devengo y percibido de ingresos | Sí (30) | Sí (`entry.order` dual) | Cubierto; falta el vínculo con roles |
| **Roles y certificación de Tesorería** | **Sí (30.2.2)** | **Parcial** (Char `patent_role` / `property_role` en OI; sin entidad ni certificación) | **Sin cobertura de dominio; frontera con Tesorería (C-8)** |
| Certificado de factibilidad / CDP | Sí (31) | Sí (en Presupuestos) | **Reconciliar propiedad (C-2)** |
| Facturas y validación documental | Sí (29.2.2) | Sí (`invoice` con `review → approved`) | Cubierto; **falta recepción de DTE** |
| Inventario y activo fijo | Sí (28) | Parcial (muebles, sin catastro) | Completar catastro y flujo de baja |
| **Detección de cesión de facturas** | **Sí (32.2.2)** | Parcial: TUPA + marca manual | **Integración con el Registro del SII sin cobertura (C-4)** |
| **Suspensión de pago por cesión** | **Sí (32.2.10)** | Parcial: paso TUPA, sin efecto de dominio sobre decreto | **Requiere contrato de interrupción con Tesorería (C-13)** |
| **Beneficiario del pago ≠ acreedor** | Implícito (32.2.8) | Parcial: label en move; sin cesionario propio | **Requisito de modelo (C-12)** |
| Conciliación bancaria | Sí (37) | Sí, con expediente | Cubierto; formalizar SoD y contenido del informe |
| Cierre mensual | Sí (33) | Parcial (`closure` sin gate de conciliación) | **Agregar condición del Certificado de Saldos** |
| Cierre anual | Sí (34) | Parcial (asientos de traspaso) | Vincular con apertura de Presupuestos |
| **Estados Financieros a CGR** | **Sí (35)** | **Parcial** (`account.report.summary` PDF) | **Faltan los seis artefactos + FEA** |
| **Archivo plano mensual a CGR** | **Sí (33.2.3)** | **No** | **Sin cobertura; formato desconocido (C-5)** |
| **Informe trimestral SINIM / Ley 20.237** | **Sí (36)** | **Parcial** (PDF trimestral ≠ SINIM) | **Sin cobertura SINIM / 20.237 (C-7)** |

**Lectura.** El levantamiento cubre bien el ciclo operativo y Odoo aporta un motor contable razonablemente completo, más un satélite de reportes PDF y un procedimiento TUPA de factoring. La brecha se concentra en **los reportes externos obligatorios con estructura y canal legales** (archivo plano CGR, EEFF tipificados + FEA, SINIM/20.237), en la **integración SII y el modelo de beneficiario/suspensión** (parcial en TUPA, incompleto en dominio), y en el **devengo dual**, que ninguna de las dos fuentes distingue.

---

## 4. Marco normativo → implicancias de diseño

| Norma | Regla | Implicancia de diseño |
|---|---|---|
| **Resolución CGR N° 3, de 2020** | Aprueba la Normativa del Sistema de Contabilidad General de la Nación, **NICSP-CGR Chile Sector Municipal**. Vigente desde el 1 de enero de 2021 | Marco contable del módulo. Reemplaza al Oficio CGR N° 36.640/2007 |
| **Oficio CGR N° E11061, de 2020** y **E59541, de 2020** | Plan de cuentas del sector municipal y su complemento | `ChartOfAccounts` **versionado con vigencia temporal**, independiente del clasificador presupuestario |
| **Oficio CGR N° E59549, de 2020** | Manual de Procedimientos Contables para el Sector Municipal (NICSP-CGR), con procedimientos identificados por letra | Cada procedimiento es una plantilla de asiento parametrizada, no código |
| **Oficio CGR N° E59548, de 2020** y **E64.327, de 2020** | Cierre del ejercicio y apertura del siguiente | Cierre anual (proceso 34) y apertura (26.2.8 de Presupuestos) son un mismo mecanismo. Ver C-2 |
| **Oficio CGR N° E12203, de 2020** | Instructivo de Primera Adopción NICSP-CGR | Insumo de la estrategia de puesta en marcha |
| **Oficio CGR N° 3.899, de 2018** (citado en 35) | Instrucciones para la preparación y presentación de Estados Financieros | **Anterior a la Resolución N° 3/2020. Verificar vigencia antes de tomarlo como requisito — ver C-6** |
| **Estados Financieros exigidos** (35.2.4) | Balance General, Estado de Resultados, Estado de Situación Presupuestaria, Estado de Flujos de Efectivo, Estado de Cambios en el Patrimonio, Notas; más opinión del auditor cuando corresponda | Seis artefactos con estructura propia. Presentación electrónica **con Firma Electrónica Avanzada** |
| **Responsabilidad de los EEFF** (35) | Recae en el **Alcalde y el Director de Administración y Finanzas** | Cadena de firma nominal, no genérica. Segregación y trazabilidad de quién suscribe |
| **Ley N° 19.983** | Regula la transferencia y otorga mérito ejecutivo a la copia de la factura. La cesión se pone en conocimiento del deudor conforme a la ley o mediante inscripción en el **Registro Público Electrónico de Transferencias de Créditos** del SII; en ese caso **se entiende conocida el día hábil siguiente** a la inscripción | Fecha de conocimiento **computable**, no declarativa. Determina si un pago al proveedor original fue válido. Fuente de consulta identificada: el Registro del SII, no una notificación genérica |
| **Ley N° 19.983 — plazo de reclamo** | El contenido de la factura puede reclamarse dentro de **8 días hábiles** desde su recepción en el SII; vencido el plazo opera **recepción tácita** y la factura adquiere mérito ejecutivo | **Tercer punto del sistema donde el paso del tiempo produce un efecto jurídico**, tras el silencio del art. 82 LOCM y los 10 días del art. 29 c). Condiciona la validación documental del proceso 29 |
| **Ley N° 20.237** | Registro **mensual** de gastos e informe **trimestral** de pasivos al Concejo; publicación en el sitio del municipio o, en su defecto, en el portal de SUBDERE | Reporte con doble periodicidad y publicación obligatoria. Concurrente con el informe del art. 29 d) LOCM |
| **LOCM art. 29 letra d)** | Informe trimestral de la Unidad de Control sobre avance presupuestario, cotizaciones previsionales, aportes al FCM y perfeccionamiento docente | Contabilidad provee los datos; la Unidad de Control emite. Frontera de propiedad a definir |
| **Normativa de Contabilidad General de la Nación** (28.2.2) | Control administrativo de bienes muebles **cualquiera sea su valor**, con recuento físico; registro del bien **al devengar la factura** | El alta de inventario se dispara en el devengo. No es proceso independiente |
| **Ley de impuesto a la renta, segunda categoría** (29.2.2) | Proveedores sin inicio de actividades: boleta de servicios de terceros o factura de compra, por única vez | Caso de excepción tipificado, con control de unicidad |

---

## 5. Arquitectura funcional propuesta

```
MC-1  Catálogo y configuración contable      (plan NICSP, contra-cuentas, plantillas de asiento)
MC-2  Registro de hechos económicos          (devengo de gasto, ingresos con y sin rol, facturas)
MC-3  Bienes: inventario y activo fijo       (proceso 28; alta en el devengo, traslados, bajas, depreciación)
MC-4  Conciliación y control de saldos       (proceso 37; certificado de saldos bancarios)
MC-5  Cierres                                (procesos 33 y 34; mensual y anual)
MC-6  Reportes externos obligatorios         (procesos 33.2.3, 35, 36; CGR, SINIM, Ley 20.237)
MC-7  Cesión de facturas y factoring          (proceso 32; Registro SII, doble decreto, suspensión de pago)

TR    Plan de cuentas y parámetros normativos (versionado, capa 2 del Anexo A de Presupuestos)
GP    Gobernanza de plataforma — común con Presupuestos (§7 de aquel plan)
```

### Patrón raíz propuesto

Igual que en Presupuestos, hay **dos raíces** y confundirlas es el error probable:

1. **`JournalEntry`** — el comprobante, unidad atómica del mayor. Alto volumen, ciclo corto, siempre balanceado. Todo hecho económico termina en uno.
2. **`AccountingPeriod`** — la ventana temporal que gobierna la **mutabilidad** de los comprobantes. Ciclo largo, gobernanza, estados de cierre y reapertura auditada.

La segunda no es un atributo de la primera: es la entidad que decide si la primera puede modificarse. Odoo lo implementa como restricción de `create`/`write` contra `account.gov.closure`, lo que es correcto en efecto pero está enterrado en la lógica del comprobante en lugar de ser una regla de dominio explícita.

> **PENDIENTE C-3:** Validar el patrón de doble raíz `JournalEntry` / `AccountingPeriod` con el equipo, y su consistencia con el patrón `BudgetExercise` / `CommitmentChain` de Presupuestos. Ambos módulos deben compartir criterio sobre qué gobierna la mutabilidad histórica.

### Entidades preliminares candidatas

Naming técnico en inglés, consistente con Adquisiciones y Presupuestos. Lista de trabajo, no cerrada.

**Catálogo:** `ChartOfAccounts` (versionado por vigencia), `LedgerAccount` (jerárquica, con contra-cuentas tipificadas), `AccountRoot`, `CostCenter`, `MovementType`, `DocumentType`, `TaxRate`

**Registro:** `JournalEntry`, `JournalEntryLine`, `Invoice`, `InvoiceLine`, `InvoiceAllocation`, `EntryTemplate` (plantilla de asiento por tipo de operación), `IncomeOrder` (con reconocimiento dual devengado/percibido), `TaxRoll` (rol), `RollCertification` (certificación de Tesorería)

**Cesión:** `CreditAssignment` (cesión con fecha de conocimiento computada), `AssignmentDecree` (decreto que registra la cesión — **tramitado DocDigital, D-5**; folio = `ExternalFolio`), `PaymentBeneficiary` (beneficiario efectivo, distinto del acreedor de la obligación), `SIIRegistryQuery` (consulta al Registro Público de Transferencias)

**Bienes:** `FixedAsset`, `InventoryItem`, `AssetLocation`, `AssetTransfer`, `AssetRetirement` *(baja con decreto DocDigital)*, `DepreciationSchedule`, `RealEstateRegistry` (catastro de inmuebles)

**Conciliación:** `BankAccount`, `BankStatement`, `BankReconciliation`, `ReconciliationLine`, `Check`, `BankBalanceCertificate`

**Cierre:** `AccountingPeriod`, `PeriodClosure`, `ClosureSnapshot`, `ClosureHistory`, `YearEndTransfer`

**Reporte:** `FinancialStatement` (con sus seis tipos), `StatementNote`, `RegulatoryReport`, `RegulatorySubmission` (envío con acuse y firma — canal FEA: C-16)

**Transversal (plataforma, D-5):** `AdministrativeAct`, `DocumentProcedure`, `SignatureChain`, `ExternalFolio` — no duplicar en el schema del módulo; consumir vía C11.

---

## 6. Contratos inter-módulo

| Contrapartida | Dirección | Contenido | Criticidad |
|---|---|---|---|
| **Presupuestos** | Presupuestos ↔ Contabilidad | **Devengo dual**: efecto presupuestario y patrimonial del mismo hecho, con garantía de atomicidad | **Crítica — ver C-1** |
| **Presupuestos** | Contabilidad → Presupuestos | Cierre anual: saldos de deudores y acreedores presupuestarios que alimentan la apertura del ejercicio siguiente | **Alta** |
| **Adquisiciones** | Adq → Contabilidad | Recepción conforme y factura asociada; marca de bien inventariable que dispara el alta de activo | **Alta** |
| **Tesorería** | Tes → Contabilidad | **Certificado de Saldos Bancarios** — condición de cierre mensual; pago que genera el egreso pagado; percepción de ingresos | **Alta y bloqueante** |
| **Tesorería** | Contabilidad → Tes | Egresos devengados disponibles para decreto de pago | Alta |
| **Tesorería** | Contabilidad → Tes | **Orden de suspensión de pago** por cesión detectada, sobre un decreto en curso; y beneficiario efectivo distinto del acreedor | **Alta y con efecto de interrupción** |
| **SII** | SII → Contabilidad | Registro Público Electrónico de Transferencias de Créditos: cesiones que afectan facturas del municipio | Alta (externa) |
| **Tesorería / unidades generadoras** | → Contabilidad | Constitución de roles y su certificación, para el devengo de ingresos | Media |
| **RRHH** | RRHH → Contabilidad | Nómina y honorarios: mapeo de reglas salariales por calidad jurídica a cuentas de débito y crédito | Alta |
| **Unidad de Control** | Contabilidad → Control | Datos del informe trimestral del art. 29 d) LOCM | Media |
| **CGR** | Contabilidad → externo | Archivo plano mensual; Estados Financieros con firma electrónica avanzada | Alta (obligación legal) |
| **SINIM** | Contabilidad → externo | BEP trimestral, FCM, Ley 20.237, incluyendo Educación y Salud | Alta (obligación legal) |

**Nota sobre el certificado de saldos.** Es el único caso identificado hasta ahora en que un módulo **bloquea** una operación de otro por ausencia de un artefacto. Merece tratamiento explícito: qué ocurre si Tesorería no emite el certificado en plazo, y si el cierre puede ejecutarse en modo condicionado.

---

## 7. Plan por fases

Duraciones preliminares. F0 no puede saltarse: C-1 condiciona el modelo de dos módulos.

### F0 — Cierre de decisiones estructurales · 1–2 semanas

| Entregable | Detalle |
|---|---|
| **Decisión de atomicidad del devengo dual** | C-1 resuelto con criterio arquitectónico documentado. Bloquea F4 de Contabilidad y de Presupuestos |
| Reconciliación con Presupuestos | C-2: propiedad del CDP y relación cierre anual ↔ apertura |
| Validación del patrón de doble raíz | C-3 |
| Frontera con Tesorería | Conciliación bancaria, certificado de saldos, roles de ingreso, factoring (C-4) |

### F1 — Levantamiento normativo · 2 semanas

| Entregable | Detalle |
|---|---|
| Ficha normativa del módulo | Tabla §4 ampliada, con artículo y regla verificable por validador |
| **Revisión de los oficios NICSP** | E11061, E59541, E59549, E59548, E64.327 y E12203, todos de 2020. Es el corpus que define los procedimientos contables; ninguno ha sido leído aún |
| **Verificación del Oficio 3.899/2018** | C-6: determinar si sigue vigente tras la Resolución N° 3/2020 o fue reemplazado |
| Formato del archivo plano mensual a CGR | C-5: descubrimiento factual |
| Alcance de la Ley 20.237 | C-7: contenido, periodicidad, canal de publicación |
| **Verificación de citas del levantamiento** | Contrastar en fuente primaria toda referencia normativa antes de convertirla en requisito |

### F2 — Levantamiento de procesos faltantes · 2 semanas

| Entregable | Detalle |
|---|---|
| BPMN — Estados Financieros a CGR | Proceso 35 descompuesto, con cadena de firma Alcalde + Director DAF y firma electrónica avanzada |
| BPMN — Reportes a SINIM y Ley 20.237 | Proceso 36, incluyendo Educación y Salud |
| BPMN — Roles de ingreso | Constitución del rol, certificación de Tesorería, devengo (30.2.2). No levantado como proceso propio |
| BPMN — Catastro de inmuebles | Ausente en ambas fuentes |
| **Reclasificación de coberturas con la lente de §3.2.1** | Revisar cada procedimiento TUPA del módulo y determinar si tiene efecto de dominio o es solo expediente (C-15) |
| **Estándar de integración con el SII** | Detección de cesiones: diseño push preferido, consulta dirigida como alternativa, barridos completos prohibidos. Mismo estándar fijado para Mercado Público en Adquisiciones |
| Validación con municipios piloto | Contraste con al menos dos municipios de referencia |

### F3 — Fichas de proceso por etapa · 3 semanas

| Macroproceso | Etapas estimadas |
|---|---|
| MC-1 Catálogo y configuración | 2 |
| MC-2 Registro de hechos económicos | 4 (devengo de gasto → factura → ingreso con rol → ingreso sin rol) |
| MC-3 Bienes | 4 (alta en devengo → traslado → baja con decreto DocDigital → depreciación) |
| MC-4 Conciliación | 2 (elaboración → doble revisión y archivo) |
| MC-5 Cierres | 2 (mensual con gate de conciliación → anual con traspasos) |
| MC-6 Reportes externos | 4 (archivo plano CGR → EEFF → SINIM/BEP → Ley 20.237) |
| MC-7 Cesión y factoring | 3 (detección en Registro SII → decreto de cesión DocDigital → decreto de pago al cesionario con `pending_signature`, con suspensión del anterior si existe) |

### F4 — Modelo de datos y contratos · 2 semanas

| Entregable | Detalle |
|---|---|
| Modelo de entidades consolidado | Con **separación explícita entre catálogo contable y clasificador presupuestario**, corrigiendo el colapso de Odoo |
| Máquinas de estado | Comprobante, factura, orden de ingreso (dual), conciliación, cierre, activo |
| Contratos de API inter-módulo | Los diez de §6, versionados |
| **Contrato de devengo dual** | Resultado de C-1, especificado con su mecanismo de compensación |

### F5 — Transversales, wireframes y consolidación · 2 semanas

| Entregable | Detalle |
|---|---|
| Especificación de seguridad | RBAC por operación; **SoD de la conciliación bancaria ya definida por el levantamiento** (elabora ≠ revisa ≠ valida, con revisor de otro departamento); cadena de firma de EEFF con responsabilidad nominal del Alcalde y del Director DAF |
| Especificación de escalabilidad | El mayor es el punto de mayor volumen del sistema completo; capa de lectura separada para reportes y estados financieros |
| **Marcado del núcleo no diferible** | Según D-3 y el documento de alcance mínimo: qué entra en la licitación y qué se difiere, con condición de salida por cada diferimiento |
| Wireframes SVG | Comprobante, conciliación, cierre, expediente de activo |

---

## 8. Pendientes abiertos

| ID | Pendiente | Bloquea | Responsable |
|---|---|---|---|
| **C-1** | Mecanismo de atomicidad del devengo dual entre Presupuestos y Contabilidad | **F4 de ambos módulos** | Equipo interno (decisión arquitectónica) |
| **C-2** | Propiedad del CDP / certificado de factibilidad, y relación cierre anual ↔ apertura del ejercicio | F3 | Equipo + DM |
| **C-3** | Patrón de doble raíz `JournalEntry` / `AccountingPeriod` | F3, F4 | Equipo interno |
| **C-4** | Estándar de integración con el **Registro Público Electrónico de Transferencias de Créditos** del SII: mecanismo de consulta, frecuencia, y si existe notificación push | F2 / MC-7 | Equipo + SII |
| **C-12** | Modelo de beneficiario del pago distinto del acreedor de la obligación: efectos en devengo, obligación, decreto y conciliación | F4 | Equipo interno |
| **C-13** | Contrato de **suspensión de pago en curso**: qué estados de decreto admiten suspensión, quién la autoriza, y qué ocurre si el pago ya se ejecutó | F3 | Equipo + Tesorería + DM |
| **C-15** | Revisar el módulo completo con la lente de “expediente sin efecto de dominio” (§3.2.1); reclasificar coberturas | F2 / F3 | Equipo interno |
| **C-14** | Plazo de 8 días hábiles de reclamo de factura (Ley 19.983): cómo se computa en el sistema, quién es responsable de reclamar, y qué pasa al vencer | F3 | DM + Jurídica |
| **C-5** | Formato, canal y periodicidad del archivo plano mensual a CGR | F1 | SUBDERE / DM |
| **C-6** | Vigencia del Oficio CGR N° 3.899/2018 tras la Resolución N° 3/2020 | F1 / MC-6 | Equipo interno |
| **C-7** | Alcance, periodicidad y canal de publicación de la Ley 20.237 | F1 | SUBDERE / DM |
| **C-8** | Roles de ingreso: quién los confecciona, cómo se certifica la constitución, frontera con Tesorería | F2 | DM |
| **C-9** | Catastro de bienes inmuebles: alcance y relación con activo fijo | F2 | DM |
| **C-10** | Comportamiento del cierre mensual si Tesorería no emite el Certificado de Saldos Bancarios en plazo | F3 | Equipo + DM |
| **C-11** | Propiedad del informe del art. 29 d): Contabilidad provee, Control emite. Definir el corte | F2 | DM + Control |
| **C-16** | Alcance DocDigital en el módulo: ¿EEFF y decreto de pago van por C11 o quedan en C9 / circuito interno? Alineado a P-74 | F2 / MC-6–MC-7 | Equipo + DM |
| **C-17** | Vía alternativa de decretos contables sin DocDigital (P-73); efecto en suspensión de pago y factoring | F3 | Equipo + Jurídica |
| **C-18** | Folios históricos de decretos Odoo (`tesoreria_gov_cl` / TUPA factoring) vs. `ExternalFolio` (P-75) | F4 | Equipo interno |

---

## 9. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **La atomicidad del devengo dual se resuelve tarde o se delega al adjudicatario** | **Muy alto — es el requisito técnico más duro de la arquitectura y afecta a dos módulos** | C-1 resuelto en F0, con criterio arquitectónico escrito por SUBDERE |
| Heredar el colapso de catálogo contable y clasificador de Odoo | Alto — impide absorber cambios independientes de Hacienda y de CGR | Separación explícita en F4; regla ya establecida en el Anexo A.1 del plan de Presupuestos |
| Los reportes externos obligatorios tienen solo cobertura parcial en Odoo (PDF CGR/trimestral) y faltan estructura, FEA, archivo plano y SINIM/20.237 | Alto — son obligación legal con destinatario externo | F2 dedicada; C-5, C-6 y C-7 resueltos en F1 |
| Citas normativas del levantamiento tomadas sin verificar | Medio-alto — el Oficio 3.899/2018 es anterior a NICSP y puede estar superado | Verificación en fuente primaria como entregable de F1, igual que en Presupuestos |
| El cierre mensual depende de un artefacto de otro módulo | Medio — bloqueo operativo real | C-10 con modo condicionado especificado |
| **Pago al proveedor original de una factura ya cedida** | **Alto — pago mal hecho, con consecuencia patrimonial y eventual doble pago** | MC-7 con detección en el Registro del SII y fecha de conocimiento computada (Ley 19.983); suspensión de decreto en curso especificada en C-13 |
| **Dar por cubierto un proceso que existe como expediente pero no impone nada** | **Alto — a la vista funciona; el motor no controla** | Categoría explícita de brecha en §3.2.1 y revisión completa del módulo con esa lente (C-15) |
| **Vencimiento del plazo de 8 días hábiles sin reclamar una factura objetable** | Medio-alto — la factura adquiere mérito ejecutivo por recepción tácita | Cómputo del plazo en el sistema y alerta al responsable; C-14 |
| El corpus NICSP de 2020 no ha sido leído | Medio-alto — define los procedimientos contables del módulo | Revisión completa en F1, antes de escribir fichas |

---

## 10. Criterios de término del módulo

1. Todo validador bloqueante declara fundamento con la convención de clases del must §11, incluida la clase **Criterio** cuando la regla es derivación de SUBDERE.
2. El catálogo contable y el clasificador presupuestario son entidades independientes con mapeo explícito, y cada uno absorbe cambios de su órgano rector sin tocar al otro.
3. El devengo dual está especificado con su mecanismo de atomicidad y de compensación, y ninguno de los dos efectos puede quedar huérfano.
4. Los seis estados financieros y los tres reportes externos tienen estructura, canal y firma especificados.
5. Cada procedimiento contable es plantilla parametrizada, no lógica programada.
6. El período contable gobierna la mutabilidad como regla de dominio explícita, con reapertura auditada y motivo obligatorio.
7. La segregación de funciones de la conciliación bancaria es impuesta por el motor, no confiada al procedimiento.
8. El núcleo no diferible está marcado, y cada diferimiento tiene condición de salida declarada.
9. El beneficiario del pago es una entidad propia y puede diferir del acreedor de la obligación sin alterar el devengo ni la imputación.
10. Ningún proceso figura como cubierto si existe solo como expediente o formulario: la cobertura exige efecto sobre la máquina de estados de la entidad afectada (§3.2.1).
11. Los estados financieros se generan desde un snapshot de cierre inmutable y son reproducibles de forma idéntica en cualquier momento posterior (§3.2.2).
12. Los tres plazos legales con efecto jurídico del sistema —silencio del art. 82 LOCM, 10 días del art. 29 c) y 8 días hábiles de la Ley 19.983— se computan explícitamente y ninguno se consuma sin registro.

---

## 11. Advertencias sobre este documento

1. **El corpus NICSP de 2020 no ha sido leído.** Todo lo que este plan dice sobre procedimientos contables se infiere del levantamiento y del comportamiento de Odoo. Los oficios E59549, E59548, E64.327 y E12203 pueden contener requisitos obligatorios adicionales que cambien el alcance de MC-2 y MC-5.
2. **El Oficio 3.899/2018 puede estar superado.** El levantamiento lo cita como fuente de las instrucciones de Estados Financieros, pero es anterior a la Resolución N° 3/2020. Marcado como C-6 y no tomado como requisito firme.
3. **La cita de la Ley 19.983 la introduce este plan, no el levantamiento.** El proceso 32 describe el factoring sin fundamento normativo. El marco legal y los dos plazos citados en §4 provienen de fuentes secundarias y deben confirmarse contra el texto de la ley antes de convertirse en validadores. Es exactamente el tipo de cita que el criterio metodológico de F1 obliga a verificar.
4. **La atomicidad del devengo dual es una propuesta de lectura**, no un hallazgo documental. Ninguna fuente distingue los dos devengos de forma explícita; la distinción se deriva del DL 1.263 y de la normativa NICSP. Debe validarse con Contabilidad municipal antes de fijarla como decisión.