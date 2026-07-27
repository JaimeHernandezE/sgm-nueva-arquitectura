# Plan de trabajo — Módulo Presupuestos

**Proyecto:** SGM — Sistema de Gestión Municipal
**Módulo:** Presupuestos
**Versión:** 0.3 (borrador para revisión interna)
**Fecha:** julio 2026
**Estado:** propuesta de plan, no validado con DM

**Cambios v0.3:** diagnóstico Odoo contrastado con el ORM real (§3.2–3.4); pendientes abiertos (§8) expandidos con contexto, pregunta a resolver, opciones, criterio de cierre e insumos.

**Cambios v0.2:** incorporación del proceso 26 (Presupuesto: Elaboración) del levantamiento Magenta. Resuelve P-2, destraba parcialmente P-3 y P-6, y agrega cinco requisitos normativos y funcionales no detectados en v0.1.

---

## 1. Propósito

Definir la secuencia de trabajo para producir la especificación completa del módulo Presupuestos, con el mismo estándar de calidad alcanzado en Adquisiciones: *dos equipos independientes deben poder construir sistemas funcionalmente equivalentes solo con la especificación*.

Este documento **no** es la especificación. Es el plan que la produce.

---

## 2. Decisiones de partida

Tomadas antes de iniciar el trabajo. Si alguna cambia, el plan se recalcula.

| # | Decisión | Contenido |
|---|----------|-----------|
| D-1 | **Frontera del módulo** | Presupuestos es dueño de la cadena completa de compromiso: disponibilidad → CDP → preobligación → obligación → devengo presupuestario. Adquisiciones, Contabilidad y Tesorería consumen vía contrato versionado. |
| D-2 | **Alcance de entidades presupuestarias** | Ciclo completo municipal **más** los presupuestos separados de Salud y Educación (servicios traspasados), que son entidades presupuestarias distintas con consolidación propia. |
| D-3 | **Método** | Réplica del método de Adquisiciones: fichas de proceso por etapa → modelo de entidades en naming técnico inglés → contratos de API → wireframes → especificaciones transversales. |

### Consecuencia inmediata de D-1

Adquisiciones ya declaró la entidad `BudgetPreCommitment` en su modelo preliminar de 14 entidades. Con D-1, esa entidad **pertenece a Presupuestos** y Adquisiciones la referencia por contrato, no la posee.

> **PENDIENTE P-1:** Reconciliar el modelo de Adquisiciones para que `BudgetPreCommitment` pase a ser referencia externa. Revisar también si `ProcurementCase` guarda estado presupuestario que debiera ser proyección de solo lectura.

---

## 3. Diagnóstico: qué tenemos hoy

### 3.1 Levantamiento de procesos

El levantamiento (Informe 2 — Anexo procesos, Magenta / C Amable) contiene **dos** procesos de presupuesto, ambos ahora disponibles:

**Proceso 26 — Presupuesto: Elaboración.** Cuatro actores (Secplac/DAF, Solicitante, Alcaldía, Concejo Municipal), diez tareas, sin gateways ni rama de rechazo. Cubre el ciclo anual completo de formulación, incluyendo `Registrar` (apertura del ejercicio), `Ejecutar` y `Controlar y Evaluar` como cajas únicas no descompuestas.

**Proceso 27 — Presupuesto: Modificación.** Cuatro actores (DAF, SECPLAN/DAF, Concejo, Alcaldía), diez tareas, un gateway (`Requiere Aprobación del Concejo`) y dos finales (Fin / Fin Rechazo).

Cobertura real: **el ciclo de gobernanza política del presupuesto, más la apertura del ejercicio y el control agregado**. El ciclo transaccional aparece nombrado (`Ejecutar`, `Controlar y Evaluar`) pero sin descomponer.

#### Asimetría relevante entre ambos procesos

El proceso 26 no tiene rama de rechazo: el Concejo hace "Discusión y Aprobación", con "análisis y ajustes a las observaciones realizadas (dentro del marco legal)". El proceso 27 sí tiene `Fin Rechazo`. Esto es consistente con el art. 82 LOCM: sobre el presupuesto anual el Concejo no puede rechazar sin más — si no se pronuncia antes del 15 de diciembre, rige lo propuesto por el alcalde. Sobre una modificación puntual sí puede rechazar. **La asimetría es correcta y debe preservarse en el diseño.**

### 3.2 Odoo as-is

[`modelos-odoo.md`](modelos-odoo.md) reconstruye ~30 modelos operativos repartidos en dos addons (`presupuesto_gov_cl` y el puente `account_gov_adquisiciones`). Es la mejor evidencia disponible de **qué opera realmente un municipio**, con la salvedad de que codifica decisiones de diseño del proveedor anterior que no son necesariamente correctas.

Regla de uso: Odoo as-is es **fuente de requisitos funcionales candidatos, nunca fuente de arquitectura**. Contrastar siempre contra el ORM, nunca contra el export de BD (desfasado; ver notas en `modelos-odoo.md`).

#### Qué Odoo hace bien (motor operativo)

| Capacidad | Evidencia en código |
|-----------|---------------------|
| Formulación por fichas con desglose mensual | `budget.sheet` (departmental / income / staff) + `distribution.month` / income / staff months; check de cuadre mensual |
| Ciclo de estados del presupuesto anual | `draft → review → council → approved → in_progress → completed`; un solo `in_progress` activo |
| Equilibrio ingresos/egresos | Validador bloqueante (`income_expense_coherent`) antes de enviar a Concejo |
| Workflow de ficha con rechazo | `draft → in_review → reviewed \| rejected` |
| Mecánica de modificación de montos | `budget.adjustment` con tipos `ajuste` / `reasignacion` / `saldo_apertura` |
| Cadena de compromiso (fases del gasto) | CDP → preobligación → obligación → `accrued_move_id` (egreso devengado) |
| Imputación presupuestaria tipificada | Distribuciones con cuenta 215, área, centro de costo, programa/subprograma |
| Export CGR operativo | Informes 1–4 (TXT): inicial, actualización, iniciativas de inversión, variaciones; usan `level_1` de cuenta como subtítulo |
| Puente semántico con Adquisiciones | `acquisition_mechanism` en distribución de ficha; CDP/pre/obligación ligados a SOLPED/resolución |

#### Qué Odoo hace mal o no hace (gobernanza y norma)

| Capacidad esperada | Situación real en Odoo |
|--------------------|------------------------|
| Acto de Alcaldía (26.2.5) | El estado `review` es consolidación técnica post-fichas (wizard de departamentos), **no** el acto del alcalde |
| Acuerdo del Concejo a subtítulo/ítem | Aprueba el presupuesto **entero**; exige PDF/Excel adjunto (`council_approval_document`). El clasificador existe en cuentas, pero no hay entidad de acuerdo granular |
| Silencio del art. 82 (rige propuesta del alcalde) | No implementado; no hay plazos legales ni transición automática por tiempo |
| Cadena de firma del decreto (Control / Jurídica / Secretario) | Parcial: Tupa tiene `subir decreto` y FirmaGob en CDP; **no** hay entidad de dominio ni SoD formal de esos roles |
| Límites 42% (art. 67) y 20% (Ley 18.883) | Ausentes |
| Series históricas y proyección | Ausentes |
| Apertura del ejercicio contable | Solo tipo de ajuste `saldo_apertura`; sin traspaso a ingresos por percibir / Deuda Flotante |
| Gateway Concejo en modificaciones | Ajuste es `draft → approved` sin regla computable sobre el clasificador |
| Control periódico (art. 81, pasivos, déficit) | Ausente como proceso |
| Salud / Educación como entidades presupuestarias | Solo códigos de área en catálogo (`ÁREA EDUCACIÓN`, `ÁREA SALUD`); un único `account.gov.budget` por compañía/año |
| Doble raíz ejercicio / cadena de compromiso | Dispersión entre addons sin expediente de cadena; CDP en presupuesto, pre/obligación en el puente |

### 3.3 Brecha de cobertura

Leyenda de cobertura Odoo: **Sí** = opera el ámbito · **Parcial** = hay rastro o subset · **No** = ausente.

| Ámbito funcional | Levantamiento | Odoo as-is | Brecha |
|---|---|---|---|
| Solicitud de estimaciones a las áreas | Sí (26.2.2) | Parcial: wizard crea fichas por depto; no hay convocatoria con plazos | Levantar ciclo de instrucciones y plazos (`BudgetCall`) |
| Fichas presupuestarias por área con flujo mensual | Sí (26.2.3) | Sí: `budget.sheet` + distribución mensual + rechazo | Cubierto; contrastar campos y tipologías (departmental/income/staff) |
| Equilibrio ingresos/egresos | Implícito (presupuesto financiado) | Sí: validador bloqueante antes de Concejo | Adoptar como validador explícito en MP-1 (Odoo aporta el requisito) |
| **Análisis histórico y proyección** (≥2 años + 1er semestre, corte julio) | **Sí (26.2.4)** | **No** | **Requisito de datos mayor; sin cobertura en Odoo** |
| **Proyección de gasto en personal y límites legales** | **Sí (26.2.4)** | No (ficha `staff` sin validadores 42%/20%) | **Validador bloqueante; contrato con RRHH** |
| Revisión del alcalde | Sí (26.2.5) | Parcial: estado `review` ≠ acto de Alcaldía | Modelar acto de Alcaldía aparte de la consolidación técnica |
| Aprobación Concejo a nivel **subtítulo e ítem**, antes del 15 dic | Sí (26.2.6) | Parcial: estado `council` + adjunto; sin granularidad ni silencio art. 82 | **`CouncilAgreement` + plazos + transición por silencio** |
| Firma de decreto (Control, Jurídica, Secretario) | Sí (26.2.7) | Parcial: Tupa `subir decreto` / FirmaGob en CDP; `approval_resolution` Char | **Cadena de firma como entidad configurable; SoD** |
| **Apertura del ejercicio** (disponibilidad, ingresos por percibir, Deuda Flotante, saldos) | **Sí (26.2.8)** | Parcial: `saldo_apertura` + `approved → in_progress` manual | **Proceso propio `ExerciseOpening`; frontera con Contabilidad** |
| Modificación presupuestaria | Sí (proceso 27) | Parcial: 3 tipos de ajuste sin gateway Concejo | Cubrir mecánica + regla §4.1 (subtítulo/ítem → acuerdo) |
| **CDP / disponibilidad** | No (caja `Ejecutar`) | Sí: `availability` + líneas + distribución | **Levantamiento BPMN pendiente** (Odoo es candidato de requisitos) |
| **Preobligación / obligación** | No (caja `Ejecutar`) | Sí: en puente `account_gov_adquisiciones` | **Levantamiento BPMN pendiente** |
| **Devengo presupuestario** | No | Sí: `accrued_move_id` → `account.gov.move` | **Levantamiento + frontera Contabilidad** |
| Examen trimestral ingresos/gastos (art. 81) | Parcial (26.2.10) | No | Levantar como proceso formal |
| **Informe trimestral de pasivos acumulados** (dictamen 60.449/2008) | **Sí (26.2.10)** | No | **Obligación distinta del art. 81; verificar fuente (P-9)** |
| **Peticiones no contempladas en el presupuesto aprobado** | **Sí (26.2.10)** | No | **Entidad `UnfundedRequest`** |
| Registro correlativo de imputación con glosa y respaldo | Sí (26.2.10) | Parcial: `tupa.file`, `dms.file`, glosas en CDP/ejecución | Especificar requisito de auditoría |
| Flujo de caja / programación | No | Parcial: `budget.cash.flow` solo computed | Levantar como proceso de programación (no solo vista) |
| Ingresos propios / FCM / tributos | No | Parcial: `presupuesto.tax.income` | Levantar; frontera con Tesorería |
| **Salud y Educación** | No | Parcial: códigos de área; no entidades presupuestarias | **Sin cobertura de D-2 en ninguna fuente (P-5)** |
| Informes CGR / SINIM / BEP | No | Parcial: 4 informes CGR TXT; SINIM/BEP no | Levantar obligaciones y canales (P-8) |

### 3.4 Lectura del cruce Magenta × Odoo

| Fuente | Cubre bien | Cubre mal / no cubre |
|--------|------------|----------------------|
| Levantamiento (26 + 27) | Gobernanza política, asimetría rechazo, apertura nombrada, control agregado, requisitos normativos (histórico, límites, firma) | Ciclo transaccional (CDP→devengo), Salud/Educación, reportes externos, programación de caja |
| Odoo as-is | Motor de fichas, coherencia I/E, cadena de compromiso, export CGR, imputación | Gobernanza legal (plazos, silencio, acuerdo granular, SoD de decreto), límites de personal, histórico, apertura contable, control periódico |

**Cobertura del levantamiento:** ~35–40% de la superficie funcional, concentrada en formulación y gobernanza.  
**Cobertura de Odoo:** fuerte en ejecución y formulación operativa; débil en norma y control.  
**Brecha residual conjunta:** Salud/Educación como entidades, control periódico completo, series históricas, y la costura Contabilidad en apertura/devengo.

El proceso 26 **agrega** requisitos que Odoo no tiene (series históricas, límites de personal, acto de Alcaldía, apertura como proceso). Odoo **agrega** requisitos que Magenta no descompone (cadena CDP→devengo, validador I/E, export CGR, tipologías de ficha). Ambos son insumos; ninguno es contrato de arquitectura.

---

## 4. Marco normativo → implicancias de diseño

Cada regla normativa se traduce en una regla verificable del motor. Esta tabla es insumo directo de la especificación.

| Norma | Regla | Implicancia de diseño |
|---|---|---|
| Constitución art. 122 | Autonomía financiera municipal | El motor no impone un presupuesto central; SUBDERE administra parámetros, no montos |
| LOCM art. 65 letra a) | Acuerdo del Concejo para aprobar presupuesto municipal, de salud y educación, y **sus modificaciones** | `CouncilAgreement` como entidad de primera clase, no un campo booleano |
| LOCM art. 67 | Gasto anual en personal ≤ **42% de los ingresos propios percibidos el año anterior** | Validador bloqueante en formulación. Requiere ingresos percibidos del ejercicio anterior — contrato con Tesorería |
| Ley 18.883 art. 2 | Gasto en cargos a contrata ≤ **20% del gasto en remuneraciones de la planta** | Validador bloqueante en formulación. Contrato con RRHH |
| LOCM art. 81 | Solo presupuestos debidamente financiados; el jefe de la unidad de control **debe representar** el déficit; examen **trimestral** del programa de ingresos y gastos; responsabilidad personal y solidaria de alcalde y concejales | Validador de financiamiento bloqueante; entidad `DeficitRepresentation`; proceso trimestral obligatorio; log inmutable con identificación nominal de quién aprobó qué |
| LOCM art. 82 letra a) | Alcalde presenta en la **primera semana de octubre**; Concejo se pronuncia **antes del 15 de diciembre**; si no se pronuncia en plazo, **rige lo propuesto por el alcalde** | Máquina de estados con plazos legales parametrizados y **transición automática por silencio**. Único punto del sistema donde el tiempo cambia el estado sin acción humana |
| Práctica confirmada en levantamiento (26.2.6) | El Concejo aprueba **a nivel de subtítulo e ítem** del clasificador | **Define la granularidad del acuerdo y, por derivación, qué modificación requiere acuerdo del Concejo.** Ver §4.1 |
| DL 1.263 | Fases del gasto: preventivo, compromiso, devengo, pago | La cadena CDP → preobligación → obligación → devengo **es** la implementación de las fases legales. No es convención de Odoo |
| DL 3.063 | Ingresos propios, tributos locales, Fondo Común Municipal | Modelo de ingresos con origen tipificado; frontera con Tesorería |
| Decreto 854/2004 Hacienda (mod. Decreto 1227/2024, vigente para información presupuestaria 2026) | Clasificador presupuestario: subtítulo / ítem / asignación / subasignación | Clasificador **versionado con vigencia temporal**, administrado por SUBDERE como `NormativeParameter`. Cambia por decreto sin nuevo despliegue |
| Normativa de Contabilidad General de la Nación (26.2.8) | Apertura del ejercicio: traspaso de deudores presupuestarios a **ingresos por percibir** y de acreedores a **Deuda Flotante**; registro de saldos de activo, pasivo y patrimonio | `ExerciseOpening` como proceso con efecto contable. Es la costura de arranque con Contabilidad |
| Dictamen CGR N° 60.449/2008 (citado en 26.2.10) | Informar **trimestralmente** al Concejo el detalle **mensual** de pasivos acumulados | Reporte periódico distinto del examen del art. 81. Dos obligaciones trimestrales concurrentes |
| Instrucciones CGR / SUBDERE sobre déficit | Cálculo de déficit preventivo | Fórmula parametrizable, no hardcodeada |
| SINIM | Reporte periódico y BEP | Contrato de exportación; automatización de canal legal existente |

### 4.1 Resolución del criterio de modificación presupuestaria

En v0.1 este era el pendiente crítico del módulo. El proceso 26 lo destraba:

> *"Corresponde al Concejo Municipal aprobar a nivel de Subtítulo e Ítem del Clasificador Presupuestario"* (26.2.6)

**Criterio derivado:** si el Concejo aprueba a nivel de subtítulo e ítem, entonces el acuerdo del Concejo obliga a ese nivel de agregación. En consecuencia:

- Modificación que **altera el monto de un subtítulo o de un ítem** → requiere acuerdo del Concejo (art. 65 a).
- Reasignación **entre asignaciones dentro de un mismo ítem**, sin alterar el total del ítem → decreto alcaldicio, sin acuerdo del Concejo.

Esto convierte el gateway `Requiere Aprobación del Concejo` del proceso 27 en **una regla computable sobre el clasificador**, no en un juicio discrecional del DAF. Es probablemente el hallazgo de diseño más valioso del cruce de ambos procesos.

> **PENDIENTE P-3 (reformulado, ya no bloqueante):** Confirmar con DM y unidades de Control que la regla derivada corresponde a la práctica, y verificar el tratamiento de casos borde: creación de un ítem nuevo, modificaciones que compensan entre subtítulos con neto cero, y traspasos desde subtítulos de saldo final de caja. Mientras no se confirme, la regla se implementa como parámetro configurable con este valor por defecto.

---

## 5. Arquitectura funcional propuesta

Cuatro macroprocesos más una capa transversal. Cada macroproceso se descompone en etapas con ficha, réplica del patrón de Adquisiciones.

```
MP-1  Formulación, aprobación y apertura     (proceso 26; art. 82: oct → 15 dic → apertura)
MP-2  Modificación presupuestaria            (proceso 27; art. 65)
MP-3  Ejecución y control de disponibilidad  (CDP → preobligación → obligación → devengo)
MP-4  Seguimiento, control y reporte         (examen trimestral art. 81, pasivos, déficit, BEP, SINIM, CGR)

TR    Clasificador presupuestario y parámetros normativos (Decreto 854, versionado)
```

### Patrón raíz propuesto

Adquisiciones usa `ProcurementCase` como expediente raíz. Presupuestos tiene **dos raíces distintas**, y confundirlas es el error de diseño más probable:

1. **`BudgetExercise`** — el ejercicio presupuestario anual de una entidad (municipal, salud o educación). Raíz de MP-1, MP-2 y MP-4. Ciclo de vida largo, gobernanza política, un solo ejercicio vigente por entidad y año.
2. **`CommitmentChain`** — la cadena de compromiso de un gasto individual. Raíz de MP-3. Ciclo de vida corto, alto volumen, disparada por Adquisiciones u otros módulos. Folio propio.

Odoo no distingue estas dos raíces con claridad, y de ahí viene buena parte de la dispersión de sus modelos entre dos addons.

El proceso 26 refuerza la distinción: `Registrar` (26.2.8) es el punto donde `BudgetExercise` pasa a estado ejecutable y **genera la disponibilidad que las `CommitmentChain` consumirán**. Es la interfaz formal entre ambas raíces.

> **PENDIENTE P-4:** Validar el patrón de doble raíz con el equipo antes de fijar el modelo de entidades. Es la decisión estructural del módulo.

### Entidades preliminares candidatas

Naming técnico en inglés, consistente con Adquisiciones. Lista de trabajo, no cerrada. En **negrita** las incorporadas tras el proceso 26.

**Formulación y gobernanza:** `BudgetEntity`, `BudgetExercise`, **`BudgetCall`** (convocatoria de estimaciones a las áreas), `BudgetSheet`, `BudgetLine`, `BudgetSheetDistribution`, `MonthlyAllocation`, **`HistoricalExecutionSeries`** (base de proyección), **`PersonnelProjection`**, `CouncilAgreement`, **`DecreeSignatureChain`**, `BudgetAmendment`, `AmendmentLine`

**Apertura y cierre:** **`ExerciseOpening`**, **`FloatingDebt`** (deuda flotante), **`ReceivableCarryover`** (ingresos por percibir)

**Ejecución:** `CommitmentChain`, `AvailabilityCertificate` (CDP), `BudgetPreCommitment`, `BudgetCommitment`, `BudgetAccrual`, `BudgetAllocationEntry`

**Control:** `DeficitRepresentation`, `QuarterlyReview`, **`AccruedLiabilitiesReport`**, **`UnfundedRequest`** (peticiones no contempladas), `CashFlowProjection`, `ExecutionSnapshot`

**Transversal:** `BudgetClassifier` (versionado, subtítulo/ítem/asignación/subasignación), `NormativeParameter` (compartido con Adquisiciones), `CostCenter`, `ManagementArea`, `Program` / `Subprogram`

---

## 6. Contratos inter-módulo

Insumo para la especificación de independencia modular. Cada uno es un contrato versionado de entrada/salida.

| Contrapartida | Dirección | Contenido | Criticidad |
|---|---|---|---|
| **Adquisiciones** | Presupuestos → Adq | Consulta de disponibilidad; emisión y estado de CDP; preobligación asociada a SOLPED | **Alta** — costura principal del sistema |
| **Adquisiciones** | Adq → Presupuestos | Evento de resolución de compra que dispara obligación | Alta |
| **Contabilidad** | Presupuestos → Cont | Devengo presupuestario que origina asiento; apertura del ejercicio (traspaso de saldos, Deuda Flotante) | **Alta** |
| **Contabilidad** | Cont → Presupuestos | Confirmación de imputación; saldos de cierre del ejercicio anterior | Alta |
| **Tesorería** | Tes → Presupuestos | Ingresos efectivamente percibidos vs. estimados; **ingresos propios percibidos del año anterior (base del 42% art. 67)**; pagos que cierran la cadena | **Alta** |
| **RRHH / Remuneraciones** | RRHH → Presupuestos | Dotación, jubilaciones previstas, concursos, honorarios; **base de cálculo de los límites 42% y 20%** | **Alta** (elevada desde Media en v0.1) |
| **Salud / Educación** | Bidireccional | Presupuestos separados con consolidación y reporte propios | Media |
| **SINIM / CGR** | Presupuestos → externo | BEP, informes, cálculo de déficit, pasivos acumulados | Alta (obligación legal) |

**Patrón de etapa observada:** el pago (Tesorería) cierra la cadena de compromiso pero no es propiedad de Presupuestos. Se modela igual que Pago en Adquisiciones — Presupuestos consume el evento sin poseer el proceso.

---

## 7. Plan por fases

Duraciones en semanas, preliminares y a ajustar según disponibilidad de DM. Las fases 1 y 2 pueden solaparse parcialmente; la fase 3 no puede empezar antes de cerrar P-4.

### F0 — Cierre de decisiones estructurales · 1 semana

| Entregable | Detalle |
|---|---|
| Acta de decisiones de frontera | D-1 y D-2 validadas con la jefatura; reconciliación de `BudgetPreCommitment` con Adquisiciones (P-1) |
| Validación del patrón de doble raíz | P-4 resuelto con el equipo |
| Backlog de levantamiento faltante | Lista priorizada derivada de la tabla §3.3 |

**Criterio de término:** ninguna fase posterior queda bloqueada por una decisión de alcance.

### F1 — Levantamiento normativo y de brecha · 2 semanas

| Entregable | Detalle |
|---|---|
| Ficha normativa del módulo | Tabla §4 ampliada, con artículo específico y regla verificable por cada validador |
| Confirmación del criterio de modificación | P-3 reformulado: validar la regla derivada de §4.1 y sus casos borde con DM y Control |
| Especificación del clasificador | `BudgetClassifier` versionado según Decreto 854; modelo de vigencia temporal y gobernanza de cambios; soporte a la regla de §4.1 |
| **Especificación de límites de gasto en personal** | Validadores del 42% (art. 67 LOCM) y 20% (art. 2 Ley 18.883): base de cálculo, momento de evaluación, efecto al incumplir |
| **Requisito de series históricas** | Retención y consulta de ejecución de ≥2 ejercicios anteriores más el semestre en curso, con corte a julio. Define la política de retención del módulo |
| Mapa de obligaciones de reporte | CGR, SINIM, BEP, pasivos acumulados (dictamen 60.449/2008), Anexos: qué, cuándo, formato |

### F2 — Levantamiento de procesos faltantes · 3 semanas

Recuperar como procesos formales lo que hoy solo existe como caja no descompuesta, como comportamiento de Odoo, o como práctica municipal no documentada.

| Entregable | Detalle |
|---|---|
| BPMN — Ejecución presupuestaria | Cadena CDP → preobligación → obligación → devengo. Descompone la caja `Ejecutar` del proceso 26. Matriz de doble pool |
| **BPMN — Apertura del ejercicio** | Descompone `Registrar` (26.2.8): generación de disponibilidad, traspaso a ingresos por percibir y Deuda Flotante, saldos patrimoniales. Validar con Contabilidad |
| BPMN — Examen trimestral, déficit y pasivos | Art. 81 más dictamen 60.449/2008. Descompone `Controlar y Evaluar` (26.2.10). Validar con Control |
| BPMN — Programación de caja | Derivado de `budget.cash.flow` más práctica municipal |
| BPMN — Salud y Educación | Ciclo separado y consolidación |
| Validación con municipios piloto | Contraste con al menos dos de los cinco municipios de referencia |

### F3 — Fichas de proceso por etapa · 3 semanas

Formato ficha idéntico al usado en Adquisiciones: actores, precondiciones, pasos, validadores, datos de entrada y salida, clasificación de cada subpaso, excepciones.

| Macroproceso | Etapas estimadas |
|---|---|
| MP-1 Formulación, aprobación y apertura | 6 (convocatoria de estimaciones → fichas por área → análisis y consolidación → revisión y presentación al Concejo → decreto y firma → apertura del ejercicio) |
| MP-2 Modificación | 3 (antecedentes y clasificación por nivel de clasificador → acuerdo del Concejo o decreto → registro y control) |
| MP-3 Ejecución | 4 (disponibilidad y CDP → preobligación → obligación → devengo) |
| MP-4 Control | 4 (examen trimestral → representación de déficit → informe de pasivos → reporte externo) |

**Criterio de término:** cada etapa tiene ficha completa con validadores explícitos y sin pasos marcados "según práctica municipal".

### F4 — Modelo de datos y contratos · 2 semanas

| Entregable | Detalle |
|---|---|
| Modelo de entidades consolidado | Naming inglés, atributos, cardinalidades, invariantes. Contraste explícito contra el ORM de Odoo, no contra el export de BD |
| Máquinas de estado | Una por entidad con ciclo de vida. Incluye la transición por silencio del art. 82 y la asimetría rechazo/no-rechazo entre MP-1 y MP-2 |
| Contratos de API inter-módulo | Los ocho de §6, versionados, con clasificación síncrono / asíncrono / cacheado |
| Reconciliación con Adquisiciones | Modelo de Adquisiciones actualizado según D-1 |

### F5 — Transversales, wireframes y consolidación · 2 semanas

| Entregable | Detalle |
|---|---|
| Especificación de seguridad | RBAC a nivel de operación; segregación de funciones — quien formula no aprueba, quien emite CDP no obliga; el rol de Control tiene facultad de representación que ningún otro rol puede sobrescribir; **cadena de firma configurable por municipio (alcalde o administrador, validación del Secretario Municipal) con subrogancias de expiración automática** |
| Especificación de escalabilidad | Capa de lectura separada para reportes agregados y series históricas; volumetría de la cadena de compromiso, que es el punto de alto volumen |
| Wireframes SVG | Vista de ejercicio presupuestario, ficha por área, y expediente de cadena de compromiso, con codificación semántica consistente con Adquisiciones |
| Documento consolidado en `sgm-docs/` | Integración final y revisión cruzada |

---

## 8. Pendientes abiertos

Índice rápido:

| ID | Pendiente | Bloquea | Responsable | Estado |
|---|---|---|---|---|
| P-1 | Reconciliar `BudgetPreCommitment` con Adquisiciones | F0 / F4 | Equipo interno | Abierto |
| ~~P-2~~ | Segundo proceso del levantamiento | — | — | **Resuelto** (proceso 26 en v0.2) |
| P-3 | Regla subtítulo/ítem → acuerdo del Concejo (§4.1) | F3 / MP-2 | DM + Control | Abierto |
| P-4 | Patrón doble raíz `BudgetExercise` / `CommitmentChain` | F3, F4 | Equipo interno | Abierto |
| P-5 | Consolidación Salud y Educación | F2 | DM | Abierto |
| P-6 | Apertura del ejercicio y frontera Contabilidad | F2 | DM + Contabilidad | Abierto |
| P-7 | Tolerancias de monto CDP ↔ obligación ↔ devengo | F3 | Equipo + Adq | Abierto |
| P-8 | Formato y canal SINIM / CGR / BEP | F1 | SUBDERE / DM | Abierto |
| P-9 | Verificar dictamen CGR N° 60.449/2008 | F1 | Equipo interno | Abierto |
| P-10 | Momento de evaluación de límites 42% y 20% | F3 | DM + RRHH | Abierto |
| P-11 | Retención y migración de series históricas | F1 | Equipo interno | Abierto |

Cada pendiente abierto se documenta abajo con: contexto, pregunta a resolver, opciones candidatas, decisión por defecto si no hay respuesta a tiempo, criterio de cierre e insumos.

---

### P-1 — Reconciliar `BudgetPreCommitment` con Adquisiciones

**Contexto.** Adquisiciones ya listó `BudgetPreCommitment` en su modelo preliminar. D-1 establece que Presupuestos es dueño de la cadena de compromiso. Mientras no se reconcilie, F4 duplicará o contradirá el modelo de Adquisiciones.

**Pregunta.** ¿Qué entidades de la cadena (CDP, preobligación, obligación, devengo) posee Presupuestos y cuáles Adquisiciones solo referencia por contrato?

**Opciones.**
1. **Dueño total en Presupuestos** (alineado a D-1): Adquisiciones emite eventos (`PurchaseRequestApproved`, `PurchaseOrderAccepted`) y consume estados; no persiste montos presupuestarios propios.
2. **Copia local en Adquisiciones** con sincronización: desaconsejada (doble fuente de verdad).
3. **Híbrido:** CDP/pre/obligación en Presupuestos; Adquisiciones guarda solo refs y proyección de solo lectura en `ProcurementCase`.

**Default si no hay acta:** opción 1 + proyección de solo lectura en el expediente de Adquisiciones.

**Criterio de cierre.** Acta F0 que: (a) confirma D-1; (b) lista entidades y dirección de cada contrato; (c) marca en docs de Adquisiciones qué campos dejan de ser propios. Ticket de seguimiento en F4 para actualizar el modelo de Adquisiciones.

**Insumos.** D-1; `comparativa-odoo-vs-nuevo.md` de Adquisiciones; §5–6 de este plan; ORM del puente `account_gov_adquisiciones`.

---

### P-3 — Regla subtítulo/ítem → acuerdo del Concejo

**Contexto.** §4.1 deriva del 26.2.6 que el Concejo aprueba a subtítulo e ítem. Eso convierte el gateway del proceso 27 en regla computable. Sin confirmación, MP-2 no puede fijar validadores.

**Pregunta.** ¿La práctica municipal y Control confirman que:
- alterar monto de subtítulo o ítem → acuerdo del Concejo;
- reasignar entre asignaciones del mismo ítem sin cambiar el total del ítem → solo decreto alcaldicio?

**Casos borde a validar explícitamente.**
1. Creación de un ítem nuevo (¿siempre Concejo?).
2. Compensación entre subtítulos con neto cero.
3. Traspasos desde subtítulos de saldo final de caja.
4. Modificaciones de ingresos (115) vs egresos (215): ¿misma regla?

**Opciones.**
1. Adoptar §4.1 como default parametrizable (`NormativeParameter`).
2. Granularidad más fina (asignación) o más gruesa (solo subtítulo) según DM.
3. Criterio discrecional del DAF (rechazado: no es computable ni auditable).

**Default si no hay respuesta a tiempo:** opción 1, marcada como “pendiente de ratificación Control”.

**Criterio de cierre.** Acta con DM + Control que responde los cuatro casos borde y fija el valor del parámetro. Queda reflejado en ficha MP-2 y en `BudgetClassifier`.

**Insumos.** §4.1; proceso 27; art. 65 LOCM; Decreto 854; jerarquía de cuentas en Odoo (`title`…`level_5`).

---

### P-4 — Patrón de doble raíz

**Contexto.** Confundir el ejercicio anual con la cadena de un gasto individual es el error estructural más probable. Odoo dispersa ambos sin expediente de cadena.

**Pregunta.** ¿Confirmamos dos raíces:
1. `BudgetExercise` — MP-1, MP-2, MP-4 (ciclo largo, gobernanza);
2. `CommitmentChain` — MP-3 (ciclo corto, alto volumen);
con la apertura (26.2.8) como interfaz que hace ejecutable el ejercicio y habilita cadenas?

**Opciones.**
1. Doble raíz como §5 (recomendada).
2. Una sola raíz `BudgetExercise` con cadenas como agregados hijos (empeora volumetría y RBAC).
3. Tres raíces (ejercicio / modificación / cadena) — sobre-segmenta MP-2.

**Default:** opción 1.

**Criterio de cierre.** Decisión de equipo documentada en acta F0; naming congelado antes de F3; diagrama de contexto actualizado.

**Insumos.** §5; asimetría de ciclos de vida; volumetría esperada de CDP/obligaciones vs un presupuesto/año.

---

### P-5 — Salud y Educación

**Contexto.** D-2 incluye presupuestos separados de servicios traspasados. Magenta no los levanta. Odoo solo tiene códigos de área, no entidades presupuestarias distintas.

**Pregunta.** ¿Salud y Educación son:
- entidades presupuestarias independientes (`BudgetEntity`) con ejercicio, acuerdo del Concejo y reporte propios; o
- vistas/segmentos del presupuesto municipal consolidadas al reportar?

**Opciones.**
1. **Independientes** (alineado a art. 65 a) y D-2 literal): tres `BudgetEntity` (municipal, salud, educación) con consolidación para reporte.
2. **Segmentos** del mismo ejercicio municipal filtrados por área/programa.
3. **Fase 2:** especificar solo municipal ahora; Salud/Educación como extensión parametrizada.

**Default si DM no responde:** opción 1 a nivel de modelo (para no pintar contra la LOCM), con fichas de proceso de Salud/Educación en F2 aunque el piloto arranque solo municipal.

**Criterio de cierre.** Decisión DM por escrito; impacto en `BudgetEntity`, Concejo (¿un acuerdo o tres?) y reportes CGR (`GESTION MUNICIPAL` vs otras entidades en los TXT actuales).

**Insumos.** Art. 65 LOCM; D-2; datos de área Odoo; formato informes CGR (campo entidad).

---

### P-6 — Apertura del ejercicio y frontera con Contabilidad

**Contexto.** 26.2.8 exige: generar disponibilidad; traspasar deudores a ingresos por percibir y acreedores a Deuda Flotante; registrar saldos de activo/pasivo/patrimonio. Odoo reduce esto a `saldo_apertura` + botón `in_progress`.

**Pregunta.** ¿Qué pasos son de Presupuestos, cuáles de Contabilidad, y cuál es el evento/contrato que los acopla? ¿`ExerciseOpening` genera asientos o solo ordena a Contabilidad?

**Opciones.**
1. Presupuestos orquesta y emite comando a Contabilidad; Contabilidad confirma saldos.
2. Contabilidad es dueña del traspaso; Presupuestos solo marca el ejercicio ejecutable tras confirmación.
3. Un solo módulo hace ambos (rechazado: viola independencia modular).

**Default:** opción 1, con lista de movimientos mínimos a validar en F2.

**Criterio de cierre.** BPMN de apertura firmado con Contabilidad; contrato versionado (comando + evento de confirmación); P-6 cerrado antes de fichas MP-1 etapa apertura.

**Insumos.** 26.2.8; normativa Contabilidad General de la Nación; comportamiento actual `saldo_apertura` / `action_start_progress`.

---

### P-7 — Tolerancias de monto entre CDP, obligación y devengo

**Contexto.** En la cadena, los montos pueden diferir por redondeo, ítems parciales u OC menor al CDP. Adquisiciones ya arrastra este pendiente. Sin regla, los validadores de MP-3 quedan ambiguos.

**Pregunta.** ¿Qué desviaciones se permiten entre CDP ↔ preobligación ↔ obligación ↔ devengo, en qué dirección, y qué las bloquea vs solo alerta?

**Dimensiones a fijar.**
- Tolerancia absoluta (CLP) y/o relativa (%).
- Si la obligación puede ser **menor** que el CDP (sí típico) y **mayor** (¿nunca? ¿con modificación previa?).
- Idempotencia y liberación de saldo no usado.
- Comportamiento con moneda ≠ CLP (tipo de cambio: pendiente paralelo en Adquisiciones).

**Opciones.**
1. Parámetros `NormativeParameter` por municipio con defaults SUBDERE.
2. Cero tolerancia salvo obligación ≤ CDP/pre (recomendado como default estricto).
3. Solo alertas sin bloqueo (débil para auditoría).

**Default:** obligación ≤ saldo de pre/CDP; desviación por redondeo ≤ 1 CLP; exceso bloqueante.

**Criterio de cierre.** Tabla de reglas compartida Presupuestos↔Adquisiciones en F3; tests de ficha MP-3.

**Insumos.** Contratos Adquisiciones (`releasePreCommitment`, etc.); ORM pre.obligation (`saldo`, `obligacion_acumulada`).

---

### P-8 — Formato y canal SINIM / CGR / BEP

**Contexto.** Odoo genera TXT de cuatro informes CGR. SINIM y BEP no están en el código. Sin especificar canal y formato, F5 no puede cerrar reportes.

**Pregunta.** ¿Cuáles son el formato oficial vigente, periodicidad y canal de envío para: Informes CGR 1–4, BEP, SINIM, y el informe de pasivos (P-9)?

**Opciones.** No aplica menú de diseño: es descubrimiento factual.

**Default mientras tanto:** tratar los TXT de Odoo informes 1–4 como **candidato de formato** a validar con SUBDERE, no como contrato.

**Criterio de cierre.** Matriz obligación × formato × canal × frecuencia × responsable, validada por SUBDERE/DM; gap list vs lo que genera Odoo hoy.

**Insumos.** Informes CGR en `presupuesto_gov_cl`; sitio SINIM; instrucciones déficit SUBDERE; P-9.

---

### P-9 — Verificar dictamen CGR N° 60.449/2008

**Contexto.** El levantamiento cita el dictamen para el informe trimestral de pasivos acumulados (detalle mensual). No está verificado en fuente primaria.

**Pregunta.** ¿Qué obliga exactamente el dictamen (destinatario, periodicidad, contenido, vigencia)? ¿Sigue siendo la referencia correcta o hay dictamen/oficio posterior?

**Pasos.**
1. Buscar en [jurisprudencia CGR](https://www.contraloria.cl/web/cgr/buscar-jurisprudencia) el N° 60.449/2008.
2. Extraer párrafos operativos (quién, qué, cuándo).
3. Contrastar con 26.2.10 y con el examen del art. 81 (son obligaciones distintas).
4. Si no existe o fue superado, documentar sustituto o bajar el requisito a “práctica Magenta no normativa”.

**Criterio de cierre.** Cita textual + enlace + implicancia de diseño actualizada en §4; o descarte documentado.

**Insumos.** 26.2.10; base CGR; §4 fila dictamen.

---

### P-10 — Momento de evaluación de límites 42% y 20%

**Contexto.** Art. 67 LOCM (gasto personal ≤ 42% ingresos propios percibidos año anterior) y Ley 18.883 art. 2 (contrata ≤ 20% remuneraciones de planta). Odoo no valida. Falta cuándo el motor bloquea.

**Pregunta.** ¿Los límites se evalúan:
- solo al formular/aprobar el presupuesto;
- también al modificar;
- también al comprometer gasto de personal en ejecución (CDP/pre/obligación de personal)?

**Opciones.**
1. Solo formulación y modificación (más simple; riesgo de incumplimiento en ejecución).
2. Formulación + modificación + ejecución de compromisos de personal (más estricto; necesita contrato RRHH en caliente).
3. Formulación bloqueante; ejecución solo alerta a Control.

**Default:** opción 3 hasta ratificación DM+RRHH.

**Criterio de cierre.** Acta DM+RRHH; base de cálculo definida (qué cuenta como ingreso propio percibido; qué como planta/contrata); momento(s) y efecto (bloqueo vs representación art. 81).

**Insumos.** Arts. citados; contrato Tesorería (ingresos percibidos); contrato RRHH; ficha staff Odoo como anti-patrón (sin validador).

---

### P-11 — Retención y migración de series históricas

**Contexto.** La formulación exige ≥2 ejercicios previos + semestre en curso (corte julio). El sistema nuevo no nace con ese historial. Bloquea operabilidad del primer ciclo, no solo la especificación.

**Pregunta.** ¿Cómo se cargan y retienen las series para el go-live? ¿Qué granularidad (cuenta/área/mes)? ¿Qué pasa el primer año si el histórico es incompleto?

**Opciones.**
1. Migración desde Odoo/otros (ejecución real por cuenta y mes) + política de retención ≥ N años.
2. Carga manual asistida (plantillas) para municipios sin dato limpio.
3. Primer ejercicio: formulación sin proyección automática (modo degradado) + acumulación hacia adelante.

**Default:** 1 donde haya Odoo usable; 3 como fallback explícito en ficha MP-1.

**Criterio de cierre.** Política de retención en F1; plan de migración por municipio piloto; entidad `HistoricalExecutionSeries` con granularidad fijada; criterio de “dato suficiente” para habilitar proyección.

**Insumos.** 26.2.4; datos de ejecución Odoo / CGR; estrategia de puesta en marcha del programa SGM.

---

### Orden sugerido de resolución

```
F0:  P-1, P-4
F1:  P-9 → P-8, P-11, (P-10 inicia con RRHH)
F2:  P-5, P-6
F3:  P-3, P-7, P-10 (cierre)
F4:  cierre formal P-1 en modelo de Adquisiciones
```

---

## 9. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El levantamiento cubre ~35–40% de la superficie funcional | Alto — subestimación del esfuerzo | F2 explícita y con holgura; no asumir que Adquisiciones es predictor de esfuerzo |
| **El módulo no es operable sin histórico** (P-11) | **Alto — afecta la estrategia de puesta en marcha, no solo la especificación** | Definir en F1 la carga inicial de series históricas; el primer ejercicio en el sistema nuevo formula sin base propia |
| Dependencia de DM para P-3, P-5, P-6, P-8, P-10 | Alto — bloquea F3 | Formalizar el convenio como dependencia dura; especificar con parámetro configurable y valor por defecto marcado cuando no haya respuesta en plazo |
| Tomar Odoo as-is como contrato de campos | Medio — arrastra decisiones del proveedor anterior | Regla explícita §3.2; tablas §3.2–3.4; contrastar siempre contra el ORM, nunca contra el export de BD |
| La costura con Adquisiciones se define tarde | Alto — obliga a rehacer el modelo de Adquisiciones | P-1 resuelto en F0, antes de avanzar |
| Presupuestos de Salud y Educación tratados como caso borde | Medio — son entidades presupuestarias completas | Alcance fijado en D-2; etapa propia en F2 |
| La apertura del ejercicio cruza la frontera con Contabilidad | Medio — riesgo de doble propiedad del dato | P-6 resuelto en F2, con Contabilidad presente en el levantamiento |

---

## 10. Criterios de término del módulo

1. Todo validador bloqueante del motor tiene trazabilidad a un artículo normativo específico.
2. Ningún umbral, plazo o clasificación normativa está hardcodeado; todos son `NormativeParameter` con vigencia temporal. Incluye el 42%, el 20%, los plazos del art. 82 y el clasificador del Decreto 854.
3. Los ocho contratos inter-módulo están versionados y clasificados por modo de invocación.
4. Cada etapa tiene ficha completa; ningún paso queda descrito como "según práctica municipal".
5. La especificación permite construir el módulo sin consultar el código de Odoo.
6. Segregación de funciones verificable: formulación, aprobación, emisión de CDP, obligación y control son roles distintos, y el motor lo impone.
7. La cadena de firma del decreto es configurable por municipio sin modificar código.

---

## Fuentes

- Informe 2 — Anexo procesos: Levantamiento de procesos y diseño de Servicios, Magenta / C Amable para SUBDERE (procesos 26 y 27)
- `modelos-odoo.md` — inventario as-is reconstruido desde `presupuesto_gov_cl` y `account_gov_adquisiciones`
- [Ley N° 18.695, Orgánica Constitucional de Municipalidades](https://www.bcn.cl/leychile/navegar?idNorma=30077) — arts. 65, 67, 81, 82
- [Ley N° 18.883, Estatuto Administrativo para Funcionarios Municipales](https://www.leychile.cl/leychile/navegar?idNorma=30256) — art. 2
- [Decreto 854/2004, Ministerio de Hacienda — Determina clasificaciones presupuestarias](https://www.bcn.cl/leychile/navegar?idNorma=233184)
- [ACHM — Elaboración, seguimiento y fiscalización del presupuesto municipal](https://www.achm.cl/wp-content/uploads/2025/01/Elaboracion-Seguimiento-y-Fiscalizacion-del-Presupuesto-Municipal.pdf)
- [SUBDERE — Instrucciones para el cálculo del déficit municipal](https://municipalidades.subdere.gob.cl/descargas/20_12_2024_Instrucciones_calculo_deficit_municipal_2024.pdf)
- [CGR — Base de jurisprudencia administrativa](https://www.contraloria.cl/web/cgr/buscar-jurisprudencia) — para verificación de P-9
- [SINIM — Sistema Nacional de Información Municipal](https://www.sinim.gov.cl/)
