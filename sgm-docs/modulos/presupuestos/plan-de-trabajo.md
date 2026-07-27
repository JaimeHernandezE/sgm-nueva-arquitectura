# Plan de trabajo — Módulo Presupuestos

**Proyecto:** SGM — Sistema de Gestión Municipal
**Módulo:** Presupuestos
**Versión:** 0.11 (borrador para revisión interna)
**Fecha:** julio 2026
**Estado:** propuesta de plan, no validado con DM

**Gobierno del corpus:** [`../../plan-general.md`](../../plan-general.md). Criterios de calidad comunes: plan general §7. Decisiones transversales: plan general §4.

**Cambios v0.11 (B0 plan general):** matiz de **D-1** (devengo dual — efecto patrimonial es Contabilidad; atomicidad = ADR / C-1). Contrato bidireccional **RRHH↔Presupuestos** (disponibilidad bloqueante + CDP de personal; R-1). Referencias DocDigital a prefijo **X-72…X-76**. Criterios de calidad remiten al plan general.

**Cambios v0.10:** decisión de frontera **D-4 — DocDigital** (SGM origina actos; DocDigital tramita y enumera). Referencia canónica: [`arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md`](../../arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md). Ajuste de cadena de firma del decreto (`SignatureChain` de plataforma; `DecreeSignatureChain` como alias de trabajo). `approval_resolution` del as-is deja de ser identificador oficial. Pendientes P-18…P-20 (vía alternativa, alcance/folio, plazos). Inventario de actos del módulo en [`integracion-docdigital.md`](../../arquitectura/especificacion/integracion-docdigital.md) §3.

**Cambios v0.9:** localizada la cadena normativa contable vigente. El Oficio CGR N° 36.640/2007 **está superado**: rige la **Resolución CGR N° 3, de 2020** (NICSP-CGR Sector Municipal, vigente desde el 1 de enero de 2021) y sus oficios. El documento que resuelve P-6 es el **Oficio CGR N° E64.327, de 2020, sobre apertura del ejercicio contable 2021**. Además: **existe el Manual de Imputaciones V21 (2026)** — el V19 con que se trabajó está dos versiones atrás, y SINIM enlaza ambas desde páginas distintas. Y SUBDERE publica el **Informe de Observaciones Nacional BEP**, evidencia directa de la función descrita en §7.2.

**Cambios v0.8:** revisados **Inversiones y Código INI** y **Componentes Remuneratorios**. El primero aporta una regla de modificación **tipificada por operación** para el subtítulo 31 (cierra P-3 residual punto 2 para inversión), fija que la formulación llega a **nivel de asignación**, y explica el origen normativo de `codigo_ini`, `codigo_unico_proyecto`, `unidad_ejecutora_id` y `tipo_financiamiento` de Odoo (nueva §5.2). El segundo entrega la tabla concepto remuneratorio → imputación con fuente legal por componente: es la base de cálculo que faltaba para los límites del 42% y 20% (P-10).

**Cambios v0.7:** inspección de las **planillas de carga BEP** (8 archivos, 4 sectores × ingresos/gastos) — cierra la mayor parte de P-8 y aporta evidencia decisiva para P-5 y P-12: cada sector tiene **espacio de códigos propio** (`215`/`115` municipal, `EEE`, `SSS`, `CCC`). Nueva §6.1 con el contrato de reporte como piso del modelo de ejecución. Revisado el **Oficio DCF 3/19**: no contiene el procedimiento de apertura del ejercicio; la fuente correcta para P-6 es el **Oficio CGR N° 36.640/2007**.

**Cambios v0.6:** inspección del **Manual Municipal de Imputaciones Presupuestarias V19** (SUBDERE / SINIM). **Refuta la regla derivada de §4.1**: el nivel que requiere acuerdo del Concejo no es uniforme, es un atributo por cuenta ya enumerado por SUBDERE. `requires_council_agreement` pasa a ser dato del `BudgetClassifier`, no lógica sobre la profundidad del código. Cierra la mayor parte de P-3 y confirma P-12. Nuevo P-17 (ingesta y gobernanza del Manual como fuente autoritativa).

**Cambios v0.5:** dictamen CGR N° 60.449/2008 verificado en fuente primaria — **el levantamiento lo cita incorrectamente** (§4.2; cierra P-9). La fuente real de la obligación trimestral es el art. 29 letra d) LOCM. Se incorporan el plazo de 10 días del art. 29 letra c) con escalamiento a CGR, el criterio de delegación del decreto modificatorio, y la nueva §5.1 (disponibilidad diferenciada por exposición legal y modo de contingencia, P-15). Corrección de trazabilidad en Anexo A.3.

**Cambios v0.4:** nuevo §7 — track GP de gobernanza de plataforma (procesos en SUBDERE). Renumeración de §7–§10 a §8–§11. Anexo A (jerarquía clasificador / plan de cuentas). P-12 Cementerio; P-13/P-14 del track GP. Ajuste D-2.

**Cambios v0.3:** diagnóstico Odoo contrastado con el ORM real (§3.2–3.4); pendientes abiertos expandidos con contexto, pregunta, opciones, criterio de cierre e insumos; criterio de fundamento normativo alineado a [`musts-arquitectura.md`](../../arquitectura/especificacion/musts-arquitectura.md) §11.

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
| D-1 | **Frontera del módulo** | Presupuestos es dueño de la cadena de compromiso hasta el **devengo presupuestario**: disponibilidad → CDP (Adquisiciones **y** gasto en personal) → preobligación → obligación → devengo presupuestario. El **efecto patrimonial** del mismo hecho pertenece a Contabilidad (devengo dual). La atomicidad entre ambos efectos es el problema canónico [`2026-07-atomicidad-efectos-borde.md`](../../arquitectura/decisiones/2026-07-atomicidad-efectos-borde.md) (ancla **C-1**). Adquisiciones, Contabilidad, Tesorería y RRHH consumen vía contrato versionado. |
| D-2 | **Alcance de entidades presupuestarias** | Ciclo completo municipal **más** los presupuestos separados de Salud y Educación (servicios traspasados), que son entidades presupuestarias distintas con consolidación propia. SINIM expone además un cuarto sector, **Cementerio** — alcance por confirmar (P-12). |
| D-3 | **Método** | Réplica del método de Adquisiciones: fichas de proceso por etapa → modelo de entidades en naming técnico inglés → contratos de API → wireframes → especificaciones transversales. |
| D-4 | **Tramitación de decretos (DocDigital)** | Los decretos que promulgan el presupuesto anual (26.2.7) y de modificación presupuestaria (27.2.4 / 27.2.5) se **originan en SGM** y se **tramitan en DocDigital** (visación, FEA, enumeración, distribución). El folio oficial es el externo; el correlativo interno es solo trazabilidad. Decisión canónica transversal — no se reitera aquí. Cadena de firma municipal = `SignatureChain` (plataforma), implementación del proceso 25 del levantamiento. Condicionado a **X-72** (mecanismo de integración). |

### Consecuencia inmediata de D-1

Adquisiciones ya declaró la entidad `BudgetPreCommitment` en su modelo preliminar de 14 entidades. Con D-1, esa entidad **pertenece a Presupuestos** y Adquisiciones la referencia por contrato, no la posee.

> **PENDIENTE P-1:** Reconciliar el modelo de Adquisiciones para que `BudgetPreCommitment` pase a ser referencia externa. Revisar también si `ProcurementCase` guarda estado presupuestario que debiera ser proyección de solo lectura.

### Consecuencia inmediata de D-4

1. **Cambio respecto del as-is:** `approval_resolution` (Char con secuencia interna en Odoo) **deja de ser el identificador oficial** del decreto. Se conserva, si aplica, como trazabilidad interna; el folio oficial es `ExternalFolio` asignado por DocDigital (o folio interno solo en vía alternativa — P-18 / X-73).
2. **Estado de espera:** la transición post-decreto (promulgación → apertura; modificación → registro) pasa por `pending_signature` hasta el retorno del acto firmado (`AdministrativeActSigned` / `DocumentProcedureCompleted`).
3. **Entidades:** `DecreeSignatureChain` (candidata v0.2–v0.9) se alinea a `SignatureChain` de plataforma; el acto se modela como `AdministrativeAct` (o equivalente presupuestario) con `DocumentProcedure`.
4. **Contingencia:** municipios sin DocDigital y latencia ante plazos legales (15 dic, 10 días art. 29 c) — P-18, P-20; mismo patrón que §5.1.

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
| Cadena de firma del decreto (Control / Jurídica / Secretario) | Parcial: Tupa tiene `subir decreto` y FirmaGob en CDP; **no** hay entidad de dominio ni SoD formal de esos roles. **To-be:** `SignatureChain` + tramitación DocDigital (D-4), no correlativo oficial interno |
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
| Firma de decreto (Control, Jurídica, Secretario) | Sí (26.2.7) | Parcial: Tupa `subir decreto` / FirmaGob en CDP; `approval_resolution` Char **como correlativo interno (cambio vs as-is — D-4)** | **`SignatureChain` + DocDigital (C11); estado `pending_signature`; folio = `ExternalFolio`** |
| **Apertura del ejercicio** (disponibilidad, ingresos por percibir, Deuda Flotante, saldos) | **Sí (26.2.8)** | Parcial: `saldo_apertura` + `approved → in_progress` manual | **Proceso propio `ExerciseOpening`; frontera con Contabilidad** |
| Modificación presupuestaria | Sí (proceso 27) | Parcial: 3 tipos de ajuste sin gateway Concejo | Cubrir mecánica + atributo `requires_council_agreement` por cuenta (§4.1) |
| **CDP / disponibilidad** | No (caja `Ejecutar`) | Sí: `availability` + líneas + distribución | **Levantamiento BPMN pendiente** (Odoo es candidato de requisitos) |
| **Preobligación / obligación** | No (caja `Ejecutar`) | Sí: en puente `account_gov_adquisiciones` | **Levantamiento BPMN pendiente** |
| **Devengo presupuestario** | No | Sí: `accrued_move_id` → `account.gov.move` | **Levantamiento + frontera Contabilidad** |
| Examen trimestral ingresos/gastos (art. 81) | Parcial (26.2.10) | No | Levantar como proceso formal |
| **Informes trimestrales de la Unidad de Control** (art. 29 d LOCM) | **Sí (26.2.10), con cita normativa errónea** | No | **Obligación distinta del art. 81; contenido legalmente tipificado. Ver §4.2** |
| **Representación de actos ilegales: 10 días y escalamiento a CGR** (art. 29 c) | No | No | **Sin cobertura. Plazo legal computable con consecuencia externa** |
| Delegación de la facultad de dictar el decreto modificatorio | No | No | **Configurable por municipio según su acto de delegación (dictamen 60.449/2008)** |
| **Peticiones no contempladas en el presupuesto aprobado** | **Sí (26.2.10)** | No | **Entidad `UnfundedRequest`** |
| Registro correlativo de imputación con glosa y respaldo | Sí (26.2.10) | Parcial: `tupa.file`, `dms.file`, glosas en CDP/ejecución | Especificar requisito de auditoría |
| Flujo de caja / programación | No | Parcial: `budget.cash.flow` solo computed | Levantar como proceso de programación (no solo vista) |
| Ingresos propios / FCM / tributos | No | Parcial: `presupuesto.tax.income` | Levantar; frontera con Tesorería |
| **Salud y Educación** | No | Parcial: códigos de área; no entidades presupuestarias | **Sin cobertura de D-2 en ninguna fuente (P-5)** |
| **Cementerio (sector SINIM)** | No | No (solo área de catálogo en algunos datos) | **Confirmado como sector con reglas de imputación propias por cuenta en el Manual V19; confirmar alcance como `BudgetEntity` (P-12)** |
| Informes CGR / SINIM / BEP | No | Parcial: 4 informes CGR TXT; SINIM/BEP no | **Estructura BEP fijada (§6.1)**; residual canal y periodicidad (P-8) |

### 3.4 Lectura del cruce Magenta × Odoo

| Fuente | Cubre bien | Cubre mal / no cubre |
|--------|------------|----------------------|
| Levantamiento (26 + 27) | Gobernanza política, asimetría rechazo, apertura nombrada, control agregado, requisitos normativos (histórico, límites, firma) | Ciclo transaccional (CDP→devengo), Salud/Educación, reportes externos, programación de caja |
| Odoo as-is | Motor de fichas, coherencia I/E, cadena de compromiso, export CGR, imputación | Gobernanza legal (plazos, silencio, acuerdo granular, SoD de decreto), límites de personal, histórico, apertura contable, control periódico |

**Cobertura del levantamiento:** ~35–40% de la superficie funcional, concentrada en formulación y gobernanza.  
**Cobertura de Odoo:** fuerte en ejecución y formulación operativa; débil en norma y control.  
**Brecha residual conjunta:** Salud/Educación como entidades, control periódico completo, series históricas, y la costura Contabilidad en apertura/devengo.

**Advertencia sobre la calidad de las citas.** §4.2 documenta un caso confirmado en que el levantamiento atribuye una obligación a un dictamen que trata de otra materia. El levantamiento es insumo de proceso confiable; sus citas normativas no lo son sin verificación.

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
| **Manual de Imputaciones V19** (SUBDERE / Depto. Finanzas Municipales) | Enumera **por cuenta** cuáles requieren acuerdo del Concejo: 106 cuentas de gasto, en niveles ítem, asignación, subasignación y subtítulo. Ninguna cuenta de ingreso marcada | **`requires_council_agreement` es atributo del `BudgetClassifier`, no regla sobre la profundidad del código.** El enunciado de 26.2.6 (subtítulo e ítem) es una simplificación. Ver §4.1 |
| DL 1.263 | Fases del gasto: preventivo, compromiso, devengo, pago | La cadena CDP → preobligación → obligación → devengo **es** la implementación de las fases legales. No es convención de Odoo |
| DL 3.063 | Ingresos propios, tributos locales, Fondo Común Municipal | Modelo de ingresos con origen tipificado; frontera con Tesorería |
| Decreto 854/2004 Hacienda (mod. Decreto 1227/2024, vigente para información presupuestaria 2026) | Clasificador presupuestario: subtítulo / ítem / asignación / subasignación | Clasificador **versionado con vigencia temporal**, administrado por SUBDERE como `NormativeParameter`. Cambia por decreto sin nuevo despliegue |
| Normativa de Contabilidad General de la Nación (26.2.8) | Apertura del ejercicio: traspaso de deudores presupuestarios a **ingresos por percibir** y de acreedores a **Deuda Flotante**; registro de saldos de activo, pasivo y patrimonio | `ExerciseOpening` como proceso con efecto contable. Es la costura de arranque con Contabilidad |
| **LOCM art. 29 letra d)** | La Unidad de Control emite informe **trimestral** del estado de avance del ejercicio programático presupuestario; y también trimestralmente sobre **cotizaciones previsionales**, **aportes al FCM** y **asignaciones de perfeccionamiento docente**. Debe responder por escrito a consultas de cualquier concejal | Reportes trimestrales con contenido legalmente tipificado —no un "informe de pasivos" genérico— más un canal de consultas de concejales con respuesta obligatoria. Cruza con RRHH y Educación |
| **LOCM art. 29 letra c)** | La Unidad de Control representa al alcalde los actos que estime ilegales **dentro de 10 días** de tomado conocimiento; si el alcalde no enmienda, **debe remitir a CGR** | Plazo legal computable y **escalamiento automático a un órgano externo**. Segundo punto del sistema donde el tiempo dispara una consecuencia |
| **LOCM art. 21 letras b) y c)** | SECPLA asesora en la elaboración del presupuesto y evalúa su cumplimiento, informando al Concejo **al menos semestralmente** | Reporte semestral con actor y periodicidad propios, distinto de los trimestrales del art. 29 |
| **Dictamen CGR N° 60.449/2008** (verificado en fuente primaria) | SECPLA puede **solicitar** modificaciones presupuestarias por su función de asesoría; la DAF también, coordinadamente (art. 27); la **proposición al Concejo la formula el alcalde**; SECPLA puede **dictar el decreto modificatorio** si existe delegación de atribuciones (art. 63 j) y previa aprobación del Concejo | Legitima el modelo de actores del proceso 27 y exige que **la facultad de dictar el decreto sea configurable por municipio** según su acto de delegación |
| **Normas sobre modificaciones presupuestarias, vía instructivo SUBDERE de inversiones** | Requieren pronunciamiento del Concejo las **"creaciones, supresiones, incrementos o reducciones de asignaciones identificatorias especiales del Subtítulo 31, Iniciativas de Inversión"** | Regla **tipificada por operación**, no solo por monto ni por nivel. Complementa el atributo por cuenta de §4.1: para ST 31, cualquiera de las cuatro operaciones exige acuerdo |
| **Oficio CGR N° 17.973, de abril de 2008** — Identificación Presupuestaria de Proyectos de Estudios e Inversión Municipal | Crea el **Código INI**, identificador de 12 posiciones para cada iniciativa de inversión | Estructura fija y verificable; explica los campos de iniciativa de inversión heredados en Odoo. Ver §5.2 |
| **Componentes Remuneratorios** (SUBDERE, cuadro por sector) | Tabla concepto remuneratorio → imputación presupuestaria, con **fuente legal por componente**, para Educación (Ley 19.070), Salud (Ley 19.378), Municipal (Ley 18.883 y Ley 15.076) y Cementerios (Código del Trabajo) | **Base de cálculo de los límites del 42% y 20%** (P-10) y fuente lista de `legal_reference` para validadores de personal. Incluye componentes marcados **"Extrapresupuestaria"**, que deben excluirse de la base |
| Instrucciones CGR / SUBDERE sobre déficit | Cálculo de déficit preventivo | Fórmula parametrizable, no hardcodeada |
| SINIM | Reporte periódico y BEP | Contrato de exportación; automatización de canal legal existente |

### 4.1 Criterio de modificación presupuestaria: es dato, no regla

#### Lo que se derivó en v0.2 (superado)

Del 26.2.6 —*"Corresponde al Concejo Municipal aprobar a nivel de Subtítulo e Ítem del Clasificador Presupuestario"*— se derivó que alterar un subtítulo o un ítem exige acuerdo del Concejo, y que reasignar entre asignaciones de un mismo ítem se resuelve por decreto. La regla resultaba computable sobre la profundidad del código de cuenta.

**Esa derivación es incorrecta.**

#### Lo que dice el Manual de Imputaciones V19

El [Manual Municipal de Imputaciones Presupuestarias V19](https://www.sinim.gov.cl/archivos/home/664/Manual_de_Imputaciones_Presupuestarias_incorporando_plan_de_cuenta_NICSP_V19.xls), mantenido por el Depto. de Finanzas Municipales, tiene una columna **"Cuenta que requiere Aprobación de Concejo Municipal"** con **106 cuentas de gasto marcadas**. El nivel **no es uniforme**:

| Nivel del clasificador | Cuentas marcadas |
|---|---|
| Ítem | 52 |
| Asignación | 37 |
| Subasignación | 15 |
| Subtítulo | 1 — `215.31` CxP Iniciativas de Inversión |
| Especial | 1 — Saldo Final de Caja |

Los subtítulos 23 (Prestaciones de Seguridad Social), 24 (Transferencias Corrientes) y 31 (Iniciativas de Inversión) tienen marcas a nivel de **asignación**; el 24 llega a **subasignación** — aportes al FCM, a la Asociación Chilena de Municipalidades, y a Educación, Salud y Cementerios. Es coherente: son transferencias e inversión, donde el Concejo ejerce control más fino.

**En la hoja de INGRESOS no hay ninguna cuenta marcada.** El Manual no se pronuncia sobre las cuentas 115.

#### Consecuencia de diseño

`requires_council_agreement` es un **atributo booleano por cuenta del `BudgetClassifier`**, versionado junto con el clasificador. No es una regla computable sobre la profundidad del código.

El gateway `Requiere Aprobación del Concejo` del proceso 27 se resuelve consultando ese atributo en las cuentas afectadas por la modificación. Sigue siendo determinista y auditable —que era el objetivo— pero se alimenta de dato mantenido, no de lógica derivada. Es mejor: absorber un cambio de criterio es actualizar el catálogo, no modificar un validador.

#### Nota sobre la fuente

La marca no está en el texto de la columna, que está vacía: **está codificada como color de fondo de celda** (cian, RGB 0,204,255), con su leyenda en la hoja Introducción. La regla que determina si una modificación presupuestaria municipal requiere acuerdo del Concejo se conserva hoy como un formato de celda en una planilla Excel. Es, en un solo hecho, el argumento de por qué este conocimiento debe vivir en un sistema versionado (§7.2).

#### Dos precisiones del instructivo de inversiones

1. **Para el subtítulo 31 la regla se tipifica por operación**, no por monto: requieren acuerdo del Concejo las *creaciones, supresiones, incrementos o reducciones* de asignaciones del subtítulo. Coincide con que el Manual marque el ST 31 completo y además sus asignaciones. El validador de MP-2 debe evaluar **tipo de operación** además de cuenta afectada.
2. **La formulación llega hasta nivel de asignación.** El enunciado de 26.2.6 ("el Concejo aprueba a nivel de subtítulo e ítem") describe el nivel de *aprobación*, no el de *formulación*. Son dos granularidades distintas y el modelo debe sostener ambas: se formula a asignación, se acuerda según el atributo por cuenta.

> **PENDIENTE P-3 (residual):** El Manual resuelve el criterio para gastos. Quedan abiertos: (a) el tratamiento de las cuentas de ingreso 115, sobre las que el Manual no se pronuncia; (b) la creación de un ítem nuevo; (c) compensaciones entre subtítulos con neto cero. Ver ficha P-3.

### 4.2 Corrección: el levantamiento cita mal el dictamen 60.449/2008

La tarea 26.2.10 afirma: *"Informar trimestralmente al concejo sobre el detalle mensual de los pasivos acumulados (dictamen N° 60.449, de 2008)."*

Verificado el dictamen en la Base de Dictámenes de CGR, **la cita no corresponde**. El pronunciamiento resuelve una consulta del Secretario Comunal de Planificación de la Municipalidad de San Ramón sobre **a qué unidad corresponde efectuar las solicitudes de modificación presupuestaria**, y si SECPLA puede dictar el decreto modificatorio. No trata de reportes de pasivos ni de periodicidad trimestral. La única periodicidad que menciona es el informe **semestral** de SECPLA al Concejo (art. 21 c).

**La obligación descrita sí existe, pero su fuente es el art. 29 letra d) de la LOCM**, y su contenido es más específico que "pasivos acumulados": informes trimestrales tipificados sobre avance del ejercicio programático presupuestario, cotizaciones previsionales, aportes al FCM y perfeccionamiento docente, más la obligación de responder por escrito a consultas de concejales.

**Vigencia del dictamen.** Está vigente: los campos de la ficha CGR marcan RECONSIDERADO, RECONSIDERADO PARCIAL, ACLARADO y ALTERADO en NO, y los artículos en que se funda (21, 27, 29 y 63 LOCM) siguen vigentes con el mismo contenido. Caveat: esos campos registran acciones explícitas de jurisprudencia posterior; no capturan una eventual superación implícita por reforma legal.

**Consecuencias de diseño.**

1. La entidad `AccruedLiabilitiesReport` prevista en v0.4 estaba mal especificada. Se reemplaza por `QuarterlyControlReport`, con contenido legalmente tipificado.
2. El dictamen sí aporta un requisito real: la facultad de dictar el decreto modificatorio depende del acto de delegación de cada municipio, y por tanto debe ser configurable (MP-2).
3. El art. 29 c) agrega un plazo de 10 días con escalamiento obligatorio a CGR, que `DeficitRepresentation` debe modelar.

**Consecuencia metodológica.** Ninguna cita normativa del levantamiento se da por buena sin verificación en fuente primaria. Se incorpora como criterio de la fase F1 y como categoría de trabajo del track GP (§7.3, GP-1).

---

## 5. Arquitectura funcional propuesta

Cuatro macroprocesos municipales, una capa transversal y un track de gobernanza en SUBDERE. Cada macroproceso se descompone en etapas con ficha, réplica del patrón de Adquisiciones.

```
MP-1  Formulación, aprobación y apertura     (proceso 26; art. 82: oct → 15 dic → apertura)
MP-2  Modificación presupuestaria            (proceso 27; art. 65)
MP-3  Ejecución y control de disponibilidad  (CDP → preobligación → obligación → devengo)
MP-4  Seguimiento, control y reporte         (examen trimestral art. 81, pasivos, déficit, BEP, SINIM, CGR)

TR    Clasificador presupuestario y parámetros normativos (Decreto 854, versionado)

GP    Gobernanza de plataforma — procesos que corren en SUBDERE, no en el municipio (§7)
```

Los cuatro macroprocesos describen lo que ocurre **dentro** del municipio. El track GP describe lo que sostiene el modelo normativo en el tiempo. Sin GP, la especificación describe un sistema que nadie mantiene.

### Patrón raíz propuesto

Adquisiciones usa `ProcurementCase` como expediente raíz. Presupuestos tiene **dos raíces distintas**, y confundirlas es el error de diseño más probable:

1. **`BudgetExercise`** — el ejercicio presupuestario anual de una entidad (municipal, salud o educación). Raíz de MP-1, MP-2 y MP-4. Ciclo de vida largo, gobernanza política, un solo ejercicio vigente por entidad y año.
2. **`CommitmentChain`** — la cadena de compromiso de un gasto individual. Raíz de MP-3. Ciclo de vida corto, alto volumen, disparada por Adquisiciones u otros módulos. Folio propio.

Odoo no distingue estas dos raíces con claridad, y de ahí viene buena parte de la dispersión de sus modelos entre dos addons.

El proceso 26 refuerza la distinción: `Registrar` (26.2.8) es el punto donde `BudgetExercise` pasa a estado ejecutable y **genera la disponibilidad que las `CommitmentChain` consumirán**. Es la interfaz formal entre ambas raíces.

> **PENDIENTE P-4:** Validar el patrón de doble raíz con el equipo antes de fijar el modelo de entidades. Es la decisión estructural del módulo.

### Entidades preliminares candidatas

Naming técnico en inglés, consistente con Adquisiciones. Lista de trabajo, no cerrada. En **negrita** las incorporadas tras el proceso 26.

**Inversión:** **`InvestmentInitiative`** (correlativo municipal perpetuo, Código INI, tipo de iniciativa, unidad ejecutora, tipo de financiamiento — §5.2), **`InvestmentAnnex`** (anexo al Concejo)

**Formulación y gobernanza:** `BudgetEntity`, `BudgetExercise`, **`BudgetCall`** (convocatoria de estimaciones a las áreas), `BudgetSheet`, `BudgetLine`, `BudgetSheetDistribution`, `MonthlyAllocation`, **`HistoricalExecutionSeries`** (base de proyección), **`PersonnelProjection`**, `CouncilAgreement`, **`SignatureChain`** *(plataforma; alias de trabajo previo: `DecreeSignatureChain` — D-4)*, `AdministrativeAct` / `DocumentProcedure` *(decreto de promulgación y de modificación; folio oficial externo)*, `BudgetAmendment`, `AmendmentLine`

**Apertura y cierre:** **`ExerciseOpening`**, **`FloatingDebt`** (deuda flotante), **`ReceivableCarryover`** (ingresos por percibir)

**Ejecución:** `CommitmentChain`, `AvailabilityCertificate` (CDP), `BudgetPreCommitment`, `BudgetCommitment`, `BudgetAccrual`, `BudgetAllocationEntry`

**Control:** `DeficitRepresentation` (con plazo art. 29 c y escalamiento a CGR), `QuarterlyReview`, **`QuarterlyControlReport`** (art. 29 d; reemplaza a `AccruedLiabilitiesReport` de v0.4 — ver §4.2), **`UnfundedRequest`** (peticiones no contempladas), `CashFlowProjection`, `ExecutionSnapshot`, **`ContingencyRecord`** (§5.1)

**Transversal:** `BudgetClassifier` (versionado, subtítulo/ítem/asignación/subasignación; atributos por cuenta: `requires_council_agreement`, aplicabilidad por sector municipal/educación/salud/cementerio, área de gestión, estado nueva/no usar, oficio de creación — ver §4.1 y Anexo A.5), `NormativeParameter` (compartido con Adquisiciones), `CostCenter`, `ManagementArea`, `Program` / `Subprogram`

**Gobernanza de plataforma (GP):** `NormativeWatch`, `ChangeRequest`, `NormativeRuling`, `ContractVersion`, `EcosystemNotice` — ver §7.7

### 5.1 Disponibilidad diferenciada y modo de contingencia

La criticidad de disponibilidad **no es uniforme** en el módulo. Especificar un SLA global alto para todo es caro y difícil de defender en licitación; especificarlo por proceso según su exposición legal es más barato y más sólido.

| Clase | Operaciones | Consecuencia de la indisponibilidad |
|---|---|---|
| **Crítica con efecto jurídico** | Presentación de la primera semana de octubre y pronunciamiento del Concejo antes del 15 de diciembre (art. 82); representación dentro de 10 días (art. 29 c); apertura del ejercicio al 1 de enero | El plazo corre igual. La indisponibilidad **produce** el efecto legal |
| **Crítica operacional** | Emisión de CDP, preobligación, obligación y devengo | Paraliza la ejecución del gasto del municipio |
| **Diferible** | Series históricas, reportes agregados, consultas de ejecución | Molestia, sin efecto jurídico |

**El caso que obliga a diseñar contingencia.** Si el sistema está caído el 14 de diciembre, el silencio del art. 82 hace que rija lo propuesto por el alcalde. Una indisponibilidad técnica produciría un efecto jurídico: no es que el Concejo decidiera no pronunciarse, es que el sistema no se lo permitió. Lo mismo con los diez días del art. 29 c), cuyo vencimiento obliga a remitir los antecedentes a Contraloría.

Esto **no se resuelve con uptime.** Ninguna cifra de disponibilidad elimina el riesgo; solo lo hace menos probable. Se resuelve con cuatro elementos:

1. **Vía alternativa documentada** para cada operación de clase crítica con efecto jurídico, ejecutable fuera del sistema.
2. **Regularización posterior** con efecto retroactivo a la fecha real del acto, no a la fecha de carga.
3. **Registro de contingencia** (`ContingencyRecord`): constancia auditable de que se operó en modo degradado, quién lo autorizó, y cuándo se regularizó.
4. **No consumar automáticamente el efecto del silencio.** El plazo del art. 82 corre por ley y el sistema no puede suspenderlo. Lo que sí puede es **no registrar la consumación como hecho sin verificación humana**: si hubo contingencia declarada, la constancia debe quedar en el expediente para que el municipio pueda hacerla valer. Un sistema que marca "aprobado por silencio" de forma automática mientras estuvo caído está documentando en contra de su propio usuario.

**Consecuencia de custodia.** En el modo de hospedaje SUBDERE para municipios pequeños, la obligación de disponibilidad —y la exposición asociada— es de SUBDERE. Es el mismo argumento de §7.1: no se transfiere por contrato lo que la norma radica en la institución.

> **PENDIENTE P-15:** Clasificar todas las operaciones del módulo por exposición legal, definir la vía alternativa de cada operación crítica, y resolver el punto 4. Requiere criterio jurídico, no solo técnico.

### 5.2 Iniciativas de inversión: identificación y anexo al Concejo

El subtítulo 31 tiene reglas propias de identificación y de presentación que ninguna otra partida comparte.

#### Código Municipal

Cada iniciativa recibe un **código secuencial único de 4 dígitos**, asignado por el municipio. **No se reinicia con el ejercicio**: si hasta 2009 se ejecutaron 23 iniciativas, la primera de 2010 es la `0024`. Es un correlativo perpetuo por municipio, no por presupuesto — dato relevante para el modelo, porque implica que `InvestmentInitiative` no cuelga del `BudgetExercise` sino de la `BudgetEntity`.

#### Código INI (Oficio CGR N° 17.973, de 2008)

Identificador de 12 posiciones que se usa en la ejecución, para el Informe Analítico de Variaciones de la Ejecución Presupuestaria de Iniciativas de Inversión que se remite a Contraloría:

| Posiciones | Componente | Valores |
|---|---|---|
| 1–2 | Región | Códigos del Decreto N° 1.439/2000, mod. Decreto Exento N° 910/2007, Ministerio del Interior |
| 3 | Provincia | ídem |
| 4–5 | Comuna | ídem |
| 6 | **Unidad ejecutora** | 1 Gestión Municipal · 2 Educación · 3 Salud · 4 Cementerio |
| 7 | Tipo de iniciativa | 1 Estudios Básicos · 2 Proyectos · 3 Programas de Inversión |
| 8–11 | Código único | El Código Municipal de 4 dígitos |
| 12 | Tipo de financiamiento | 0 Institucional · 1 Gobierno Central · 2 Gobierno Regional · 3 Mixto |

**Origen de campos heredados.** Esta estructura explica `codigo_ini`, `codigo_unico_proyecto`, `unidad_ejecutora_id` y `tipo_financiamiento` (0 Institucional … 3 Mixto) de `budget.sheet` en Odoo: no son invención del proveedor, son la codificación de este oficio. Se conservan, con la codificación como regla verificable.

**Tercera confirmación de los cuatro sectores.** La posición 6 enumera Gestión Municipal, Educación, Salud y Cementerio. Es la tercera fuente independiente —tras el Manual V19 y el BEP— que trata a Cementerio como sector par. Ver P-5 y P-12.

**Inconsistencia menor a resolver.** El tipo de iniciativa admite `3 = Programas de Inversión`, pero el desglose del subtítulo 31 en el clasificador presenta solo los ítems `01 Estudios Básicos` y `02 Proyectos`. Verificar si existe un ítem adicional o si el valor 3 quedó sin correlato.

#### Anexo de Iniciativas de Inversión

Junto con el proyecto de presupuesto se entrega al Concejo un anexo con el detalle por iniciativa: matriz de Código Municipal × las ocho asignaciones del ítem (001 Gastos Administrativos, 002 Consultorías, 003 Terrenos, 004 Obras Civiles, 005 Equipamiento, 006 Equipos, 007 Vehículos, 999 Otros), con totales por fila y por columna.

Es un **entregable obligatorio de MP-1**, con formato definido. Debe especificarse como reporte del módulo, no como documento que el municipio arma por fuera.

---

## 6. Contratos inter-módulo

Insumo para la especificación de independencia modular. Cada uno es un contrato versionado de entrada/salida.

| Contrapartida | Dirección | Contenido | Criticidad |
|---|---|---|---|
| **Adquisiciones** | Presupuestos → Adq | Consulta de disponibilidad; emisión y estado de CDP; preobligación asociada a SOLPED | **Alta** — costura principal del sistema |
| **Adquisiciones** | Adq → Presupuestos | Evento de resolución de compra que dispara obligación | Alta |
| **Contabilidad** | Presupuestos → Cont | Devengo presupuestario que origina asiento; apertura del ejercicio (traspaso de saldos, Deuda Flotante). Atomicidad: ADR / **C-1** | **Alta** |
| **Contabilidad** | Cont → Presupuestos | Confirmación de imputación; saldos de cierre del ejercicio anterior | Alta |
| **Tesorería** | Tes → Presupuestos | Ingresos efectivamente percibidos vs. estimados; **ingresos propios percibidos del año anterior (base del 42% art. 67)**; pagos que cierran la cadena | **Alta** |
| **RRHH / Remuneraciones** | RRHH → Presupuestos | Dotación, jubilaciones previstas, concursos, honorarios; **base de cálculo de los límites 42% y 20%** | **Alta** |
| **RRHH / Remuneraciones** | Presupuestos → RRHH | **Consulta de disponibilidad presupuestaria bloqueante** (contratación, cometidos, HE) y **emisión de CDP de gasto en personal** (p. ej. proceso 3.2.4). Contrato no previsto en v≤0.10 — ver **R-1** | **Crítica — bloqueante** |
| **Salud / Educación** | Bidireccional | Presupuestos separados con consolidación y reporte propios | Media |
| **SINIM / CGR** | Presupuestos → externo | BEP, informes CGR, cálculo de déficit, informes trimestrales del art. 29 d) | Alta (obligación legal) |

**Patrón de etapa observada:** el pago (Tesorería) cierra la cadena de compromiso pero no es propiedad de Presupuestos. Se modela igual que Pago en Adquisiciones — Presupuestos consume el evento sin poseer el proceso.

### 6.1 El contrato de reporte como piso del modelo de ejecución

Las planillas de carga BEP definen las magnitudes que el municipio **está obligado a poder informar**. Son, por tanto, el mínimo que el modelo de ejecución debe persistir: si el BEP lo pide, el módulo tiene que producirlo.

**Estructura observada** (formato CSV, separador `;`, versión 2023):

| Archivos | Sector | Prefijo de código | Cuentas |
|---|---|---|---|
| `Ingresos_Municipales` / `GTOS_Municipales` | Municipal | `115` / `215` | 154 / 438 |
| `Ingresos_Educacion` / `GTOS_Educacion` | Educación | `EEE` | 154 / 438 |
| `Ingresos_Salud` / `GTOS_Salud` | Salud | `SSS` | 154 / 438 |
| `Ingresos_Cementerio` / `GTOS_Cementerio` | Cementerio | `CCC` | 154 / 438 |

**Magnitudes exigidas.**

| Flujo | Columnas | Correspondencia en el modelo |
|---|---|---|
| Gastos | `presup_ini`, `presup_vig`, `obliga_deven`, `deuda_exigible` | Aprobado inicial / vigente con modificaciones / cadena de compromiso devengada / deuda flotante |
| Ingresos | `presup_ini`, `presup_vig`, `ingresos_percib`, `ingresos_por_percib` | Estimado / vigente / percibido (Tesorería) / por percibir (apertura del ejercicio) |

**Tres consecuencias de diseño.**

1. **`presup_ini` y `presup_vig` son magnitudes distintas y ambas se reportan.** El monto aprobado inicialmente y el vigente tras modificaciones deben persistirse por separado durante todo el ejercicio. Odoo ya lo hace (`approved_amount` / `current_amount`); es requisito, no opción.
2. **`ingresos_por_percib` y `deuda_exigible` son exactamente los conceptos de la apertura del ejercicio** (26.2.8). El BEP los exige, de modo que `ExerciseOpening` no es un refinamiento opcional: sin él no se puede emitir el reporte obligatorio.
3. **La desagregación por área de gestión aplica solo al gasto municipal.** El archivo `GTOS_Municipales` tiene 25 columnas: seis áreas —gestión interna, servicios a la comunidad, actividades municipales, programas sociales, deportivos y culturales— por tres magnitudes, más totales. Los otros tres sectores tienen siete columnas, sin desagregación. `ManagementArea` es dimensión **obligatoria en gasto municipal y ausente en los demás sectores**; el modelo debe admitir esa asimetría en lugar de imponer la dimensión a todos.

**Evidencia para P-5 y P-12.** Cada sector tiene archivos propios y **espacio de códigos propio**. No son vistas filtradas de un mismo presupuesto: son entidades presupuestarias con catálogo separado. Esto favorece decididamente la opción 1 de P-5 (entidades independientes) y la opción 1 de P-12 (Cementerio como cuarta `BudgetEntity`), y contradice la lectura de "segmento del presupuesto municipal".

> **Nota de vigencia:** las planillas publicadas corresponden a 2023. La estructura debe reconfirmarse contra la versión vigente antes de fijar el contrato (P-8).

---

## 7. Gobernanza de plataforma — track GP

Los macroprocesos MP-1 a MP-4 corren dentro del municipio. Ninguno corre en SUBDERE. Este track especifica los procesos que sostienen el modelo normativo en el tiempo.

### 7.1 Premisa: función estructuralmente no licitable

Un proveedor **no puede** hacer una consulta a Contraloría en nombre de SUBDERE, ni responder a un municipio que su solicitud no procede según la norma, ni negociar con Hacienda una modificación del clasificador. La función no requiere competencia técnica sino **personalidad institucional**, y el mandato no es transferible por contrato.

Esto no es una preferencia de modelo operativo. Es una restricción de derecho administrativo que la especificación debe reconocer.

### 7.2 Estado actual: incipiente, no inexistente

El Manual de Imputaciones Presupuestarias que mapea clasificador contra plan de cuentas NICSP (Anexo A.2) lo mantiene el **Departamento de Finanzas Municipales de la División de Municipalidades**. La función ya existe dentro de SUBDERE.

Más aún: SUBDERE **ya opera un ciclo de observación y respuesta con los municipios sobre datos presupuestarios**. Publica el *Informe de Observaciones Nacional BEP*, con las observaciones levantadas en la revisión de los Balances de Ejecución Presupuestaria y las justificaciones de cada municipio. Eso es, en la práctica, el proceso GP-2 de esta especificación funcionando de forma manual y sobre datos ya cargados, en lugar de como validación en origen.

**Dos consecuencias.** Primero, el track GP no crea una capacidad nueva: **formaliza y conecta una existente, y le impone una exigencia de actualidad y de fuente única que hoy no tiene** — como muestra la coexistencia de dos versiones del Manual de Imputaciones (Anexo A.3). Segundo, el histórico de observaciones al BEP es un **catálogo empírico de los errores que los municipios cometen realmente**, y por tanto insumo directo para priorizar qué validadores construir primero.

### 7.3 Procesos del track

| Proceso | Disparador | Actores | Salida | Exigencia temporal |
|---|---|---|---|---|
| **GP-1 Vigilancia normativa** | Publicación en Diario Oficial; dictamen CGR; instructivo de órgano rector | SUBDERE (experto municipal) | Evaluación de impacto: qué parámetros, contratos o validadores se afectan | Continua; barrido con periodicidad definida |
| **GP-2 Triage de solicitudes de cambio** | Solicitud de un municipio o de un tercero del ecosistema | SUBDERE + municipio solicitante | Resolución fundada según taxonomía §7.4 | Plazo de respuesta comprometido |
| **GP-3 Versionado de contratos y aviso al ecosistema** | Resultado de GP-1 o GP-2 que altera un contrato de API | SUBDERE + desarrollo + terceros | Nueva versión de contrato, clasificación *breaking* / no *breaking*, preaviso | Preaviso mínimo antes de entrada en vigencia |
| **GP-4 Consulta a órgano rector** | Ambigüedad normativa detectada en GP-1 o GP-2 | SUBDERE → CGR / Hacienda / órgano competente | Pronunciamiento que consolida el criterio | Sujeta a plazos del órgano consultado |

### 7.4 Taxonomía de triage (GP-2)

Toda solicitud de cambio se clasifica en una de cuatro categorías. La taxonomía define el perfil del cargo tanto como el proceso.

| # | Categoría | Resolución |
|---|---|---|
| 1 | La norma lo exige o lo permite | Cambio de parámetro o de contrato. Entra a GP-3 |
| 2 | La norma es ambigua | **No se resuelve internamente.** Escala a GP-4 antes de actuar. Entretanto, parámetro configurable con valor por defecto marcado |
| 3 | No es normativo, es práctica local | Configurable por municipio si el contrato lo admite; en caso contrario se rechaza |
| 4 | Contradice la norma | Se rechaza con fundamento jurídico explícito y trazable |

**El grueso de las solicitudes caerá en las categorías 3 y 4.** El trabajo principal de esta función es rechazar con fundamento, y es precisamente lo que un desarrollador no puede hacer por falta de autoridad. Es también el mecanismo que evita el modo de falla clásico de los ERP municipales: sin nadie facultado para rechazar, cada municipio obtiene su variante y a los pocos años existen trescientos sistemas distintos con el mismo nombre.

### 7.5 Dos clases de parámetro normativo

Distinción que la especificación debe hacer explícita y que hoy no está en `NormativeParameter`:

| Clase | Origen de la autoridad | Ejemplos | Quién puede modificar |
|---|---|---|---|
| **Mandato propio** | SUBDERE por su rol de órgano de información municipal | Formatos de reporte, periodicidad de carga, catálogos operativos | SUBDERE, con doble control |
| **Respaldo de órgano rector** | Deriva de norma de Hacienda, CGR u otro | Clasificador (DS 854), umbrales legales (42%, 20%), plazos del art. 82, criterio de §4.1 | SUBDERE solo tras acto del órgano competente; el sistema registra la referencia |

> **Advertencia de diseño:** el criterio derivado en §4.1 —subtítulo e ítem definen si una modificación requiere acuerdo del Concejo— pertenece a la segunda clase y fue resuelto internamente. Si SGM lo codifica en un validador bloqueante, SUBDERE estaría creando interpretación normativa de hecho, atribución que corresponde a Contraloría. La salida correcta no es omitirlo, sino escalarlo por GP-4 para consolidarlo. Mientras tanto se mantiene configurable, como ya establece P-3. El `legal_reference` del validador ([`musts-arquitectura.md`](../../arquitectura/especificacion/musts-arquitectura.md) §11) debe apuntar a la norma marco **y**, cuando exista, al `NormativeRuling` que lo consolidó.

### 7.6 Mapa de contrapartes institucionales

La relación con cada contraparte es un activo que también debe mantenerse. Para Presupuestos:

| Contraparte | Materia | Módulos afectados |
|---|---|---|
| Contraloría General de la República | Dictámenes, normativa contable, plan de cuentas NICSP, informes, cálculo de déficit | Presupuestos, Contabilidad |
| Ministerio de Hacienda / DIPRES | Clasificador presupuestario (DS 854) y sus modificaciones | Presupuestos, Contabilidad |
| SUBDERE — Depto. de Finanzas Municipales | Manual de imputaciones, BEP, SINIM | Presupuestos (contraparte interna) |
| Tesorería General de la República | Ingresos, FCM | Presupuestos, Tesorería |
| Servicio de Impuestos Internos | Tributos locales, avalúos | Tesorería, Presupuestos |
| ChileCompra | Ley 19.886 y normativa de compras | Adquisiciones |
| MINSAL / MINEDUC | Presupuestos de servicios traspasados | Presupuestos (Salud, Educación) |

### 7.7 Entidades del track

`NormativeWatch` (evento normativo detectado y su evaluación de impacto), `ChangeRequest` (solicitud con categoría de triage y resolución fundada), `NormativeRuling` (pronunciamiento de órgano rector que consolida un criterio), `ContractVersion`, `EcosystemNotice`

### 7.8 Consecuencia para las bases de licitación

El track GP no se licita: se especifica como **obligación de SUBDERE** y como supuesto operativo del sistema. Lo que sí debe estar en las bases es que el sistema entregado soporte técnicamente estos procesos — administración de parámetros con vigencia temporal, versionado de contratos con preaviso, y trazabilidad de cada validador a su fuente normativa ([`musts-arquitectura.md`](../../arquitectura/especificacion/musts-arquitectura.md) §11).

> **PENDIENTE P-13:** Definir si el track GP se declara en las bases como obligación de SUBDERE, y con qué nivel de detalle. Declararlo compromete a la institución; omitirlo deja el sistema sin mantenedor por defecto.

> **PENDIENTE P-14:** Catalogar, para todos los parámetros normativos del módulo, cuáles pertenecen a mandato propio y cuáles requieren respaldo de órgano rector (§7.5).

---

## 8. Plan por fases

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
| Especificación del clasificador | `BudgetClassifier` versionado según Decreto 854 y Anexo A (tres capas); modelo de vigencia temporal y gobernanza de cambios; soporte a la regla de §4.1 |
| **Especificación de límites de gasto en personal** | Validadores del 42% (art. 67 LOCM) y 20% (art. 2 Ley 18.883): base de cálculo, momento de evaluación, efecto al incumplir |
| **Requisito de series históricas** | Retención y consulta de ejecución de ≥2 ejercicios anteriores más el semestre en curso, con corte a julio. Define la política de retención del módulo |
| Mapa de obligaciones de reporte | CGR, SINIM, BEP, informes trimestrales del art. 29 d) LOCM, informe semestral SECPLA (art. 21 c), Anexos: qué, cuándo, formato |
| **Verificación de citas normativas del levantamiento** | Contrastar en fuente primaria toda referencia legal o jurisprudencial del Informe 2 antes de convertirla en requisito. Criterio derivado de §4.2 |
| **Análisis del Informe de Observaciones Nacional BEP** | Catálogo empírico de errores que los municipios cometen al informar ejecución presupuestaria. Insumo para priorizar validadores y para dimensionar el triage de GP-2 (§7.2) |

### F2 — Levantamiento de procesos faltantes · 3 semanas

Recuperar como procesos formales lo que hoy solo existe como caja no descompuesta, como comportamiento de Odoo, o como práctica municipal no documentada.

| Entregable | Detalle |
|---|---|
| BPMN — Ejecución presupuestaria | Cadena CDP → preobligación → obligación → devengo. Descompone la caja `Ejecutar` del proceso 26. Matriz de doble pool |
| **BPMN — Apertura del ejercicio** | Descompone `Registrar` (26.2.8): generación de disponibilidad, traspaso a ingresos por percibir y Deuda Flotante, saldos patrimoniales. Validar con Contabilidad |
| BPMN — Examen trimestral, déficit y reportes de Control | Art. 81 más art. 29 letras c) y d) LOCM, incluido el plazo de 10 días con escalamiento a CGR. Descompone `Controlar y Evaluar` (26.2.10). Validar con Control |
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
| Contratos de API inter-módulo | Los de §6 (incl. RRHH bidireccional), versionados, con clasificación síncrono / asíncrono / cacheado |
| Reconciliación con Adquisiciones | Modelo de Adquisiciones actualizado según D-1 |

### F5 — Transversales, wireframes y consolidación · 2 semanas

| Entregable | Detalle |
|---|---|
| Especificación de seguridad | RBAC a nivel de operación; segregación de funciones — quien formula no aprueba, quien emite CDP no obliga; el rol de Control tiene facultad de representación que ningún otro rol puede sobrescribir; **cadena de firma configurable por municipio (alcalde o administrador, validación del Secretario Municipal) con subrogancias de expiración automática** |
| Especificación de escalabilidad | Capa de lectura separada para reportes agregados y series históricas; volumetría de la cadena de compromiso, que es el punto de alto volumen |
| Wireframes SVG | Vista de ejercicio presupuestario, ficha por área, y expediente de cadena de compromiso, con codificación semántica consistente con Adquisiciones |
| **Especificación del track GP** | Los cuatro procesos de §7 con ficha propia, taxonomía de triage, clasificación de parámetros por clase de autoridad (P-14), y mapa de contrapartes. Insumo directo de las bases |
| **Especificación de disponibilidad y contingencia** | Clasificación de operaciones por exposición legal (§5.1), SLA diferenciado por clase, vía alternativa por operación crítica y `ContingencyRecord` (P-15). Insumo directo de las bases |
| Documento consolidado en `sgm-docs/` | Integración final y revisión cruzada |

---

## 9. Pendientes abiertos

Índice rápido:

| ID | Pendiente | Bloquea | Responsable | Estado |
|---|---|---|---|---|
| P-1 | Reconciliar `BudgetPreCommitment` con Adquisiciones | F0 / F4 | Equipo interno | Abierto |
| ~~P-2~~ | Segundo proceso del levantamiento | — | — | **Resuelto** (proceso 26 en v0.2) |
| P-3 | Nivel del clasificador que exige acuerdo del Concejo (§4.1) | F3 / MP-2 | DM + Control | **Resuelto en parte** (v0.6); residual: ingresos 115 |
| P-4 | Patrón doble raíz `BudgetExercise` / `CommitmentChain` | F3, F4 | Equipo interno | Abierto |
| P-5 | Consolidación Salud y Educación | F2 | DM | Abierto |
| P-6 | Apertura del ejercicio y frontera Contabilidad | F2 | DM + Contabilidad | Abierto |
| P-7 | Tolerancias de monto CDP ↔ obligación ↔ devengo | F3 | Equipo + Adq | Abierto |
| P-8 | Formato y canal SINIM / CGR / BEP | F1 | SUBDERE / DM | **Resuelto en parte** (v0.7): estructura BEP fijada; residual canal, vigencia e informes CGR |
| ~~P-9~~ | Verificar dictamen CGR N° 60.449/2008 | — | — | **Resuelto** (§4.2, v0.5) |
| P-10 | Momento de evaluación de límites 42% y 20% | F3 | DM + RRHH | Abierto |
| P-11 | Retención y migración de series históricas | F1 | Equipo interno | Abierto |
| **P-12** | Sector **Cementerio** (cuarto sector SINIM) | F1 | DM + Unidad de Información Municipal | Abierto |
| **P-13** | Declaración del track GP en bases de licitación | F5 / bases | Jefatura SUBDERE | Abierto |
| **P-14** | Clasificar parámetros: mandato propio vs órgano rector (§7.5) | F5 / GP | Equipo + Depto. Finanzas Municipales | Abierto |
| **P-15** | Exposición legal por operación, vía alternativa y modo de contingencia (§5.1) | F5 | Equipo + Jurídica | Abierto |
| **P-16** | Inventario de reglas de clase Criterio y ruta de consolidación GP-4 | F3 / F4 | Equipo + Jurídica | Abierto |
| **P-17** | Ingesta y gobernanza del Manual de Imputaciones como fuente autoritativa | F1 | Equipo + Depto. Finanzas Municipales | Abierto |
| **P-18** | Vía alternativa de decretos presupuestarios para municipios sin DocDigital (~20 %); alineado a X-73 de arquitectura y a §5.1 | F3 / MP-1–MP-2 | Equipo + Jurídica | Abierto |
| **P-19** | Conflicto de folio: migración de `approval_resolution` históricos vs. `ExternalFolio` DocDigital (X-75) | F4 | Equipo interno | Abierto |
| **P-20** | Efecto de la latencia DocDigital sobre plazos legales del módulo (15 dic art. 82; 10 días art. 29 c) — X-76 | F5 | Equipo + Jurídica | Abierto |

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

### P-3 — Nivel del clasificador que exige acuerdo del Concejo · **RESUELTO EN PARTE (v0.6)**

**Estado.** El Manual de Imputaciones V19 (§4.1) enumera las 106 cuentas de gasto que requieren acuerdo del Concejo. La regla derivada en v0.2 queda superada: el nivel no es uniforme y el criterio es un atributo por cuenta, no una función de la profundidad del código.

**Resuelto.**
- Criterio para cuentas de gasto (215): dato del Manual, cargable como atributo `requires_council_agreement` del `BudgetClassifier`.
- Caso borde 3 de v0.5 (saldo final de caja): el Manual lo marca explícitamente.

**Residual.**
1. **Cuentas de ingreso (115).** La hoja INGRESOS del Manual no tiene ninguna marca. ¿Significa que ninguna modificación de ingresos requiere acuerdo, que el criterio no está levantado, o que se rige por otra regla? Es la pregunta abierta principal.
2. **Creación de un ítem nuevo** no presente en el presupuesto aprobado: ¿acuerdo del Concejo siempre, con independencia de la marca de la cuenta? **Resuelto para el subtítulo 31** (§4.1): creaciones, supresiones, incrementos y reducciones de sus asignaciones requieren acuerdo. Falta determinar si la regla tipificada por operación se generaliza a los demás subtítulos.
3. **Compensaciones entre subtítulos con neto cero**: ¿basta que ninguna cuenta afectada esté marcada?
4. **Cuentas no marcadas del todo**: ¿ausencia de marca equivale a "no requiere", o a "no evaluado"? Distinción relevante para el default del validador.

**Opciones para el punto 4.**
1. Ausencia de marca = no requiere acuerdo (lectura literal; riesgo de falso negativo si el Manual está incompleto).
2. Ausencia de marca = no evaluado; el validador emite `advisory` y deja constancia (conservador).

**Default:** opción 2 para ingresos, opción 1 para gastos, hasta pronunciamiento de DM y Control.

**Criterio de cierre.** Acta con DM + Control que responde los cuatro puntos residuales; atributo cargado y versionado en `BudgetClassifier`; ficha MP-2 con el validador consultando el atributo.

**Insumos.** §4.1; Manual de Imputaciones V19; proceso 27; art. 65 LOCM; P-17.

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

**Evidencia nueva (v0.7).** El BEP entrega archivos separados por sector, con espacios de código propios (`115`/`215` municipal, `EEE`, `SSS`, `CCC`) — §6.1. No son vistas filtradas de un mismo presupuesto. Refuerza fuertemente la opción 1. Además, la desagregación por área de gestión existe solo en el gasto municipal, lo que confirma que los sectores no comparten estructura de imputación.

**Insumos.** Art. 65 LOCM; D-2; §6.1; Manual V19 (columnas de sector); datos de área Odoo; formato informes CGR (campo entidad).

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

**Insumos.** 26.2.8; §6.1 (el BEP exige `ingresos_por_percib` y `deuda_exigible`, luego la apertura es condición del reporte); comportamiento actual `saldo_apertura` / `action_start_progress`.

**Fuente normativa identificada (v0.9).** El Oficio 36.640/2007 está superado por la Resolución CGR N° 3, de 2020 (NICSP-CGR Sector Municipal, vigente desde el 1-I-2021). Los documentos a revisar, en orden de prioridad:

1. **Oficio CGR N° E64.327, de 2020** — instrucciones sobre el ejercicio contable siguiente. Es el documento de **apertura**; debe contener el traspaso a ingresos por percibir y Deuda Flotante.
2. **Oficio CGR N° E59549, de 2020** — Manual de Procedimientos Contables NICSP-CGR, con los procedimientos identificados por letra.
3. **Oficio CGR N° E59548, de 2020** — cierre contable, contraparte de la apertura.
4. **Oficio CGR N° E12203, de 2020** — Instructivo de Primera Adopción, pertinente también a P-11.

Todos disponibles en el índice de SINIM (Anexo A.2). El Oficio DCF 3/19, revisado en v0.7, es anterior a la Resolución N° 3 y no contiene la apertura.

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

**Contexto.** Odoo genera TXT de cuatro informes CGR. Sin especificar canal y formato, F5 no puede cerrar reportes.

**Resuelto en v0.7 — estructura del BEP.** Inspeccionadas las ocho planillas de carga (§6.1): formato CSV con separador `;`, un archivo por sector y flujo, espacios de código separados por sector, y magnitudes exigidas por flujo. Queda fijado el piso del modelo de ejecución.

**Residual.**
1. **Vigencia.** Las planillas publicadas son de 2023. Confirmar estructura vigente antes de fijar el contrato.
2. **Canal y periodicidad.** El formato está claro; el mecanismo de envío y su frecuencia, no.
3. **Informes CGR 1–4.** Los TXT que genera Odoo siguen siendo candidato de formato, no contrato.
4. **Informes trimestrales del art. 29 d).** Formato y destinatario no cubiertos por el BEP.
5. **Semántica de `s_movimiento`.** Columna presente en los ocho archivos, con valor `0` en todas las filas de la plantilla vacía. Determinar si es marca de "sin movimiento" a nivel de cuenta.

**Criterio de cierre.** Matriz obligación × formato × canal × frecuencia × responsable, validada por SUBDERE/DM; gap list contra lo que genera Odoo; contrato de exportación versionado por año.

**Insumos.** §6.1; planillas BEP 2023; informes CGR en `presupuesto_gov_cl`; instrucciones déficit SUBDERE; art. 29 d) LOCM.

---

### ~~P-9~~ — Dictamen CGR N° 60.449/2008 · **RESUELTO (v0.5)**

**Resultado.** Verificado en la Base de Dictámenes de CGR. El dictamen **está vigente**, pero **el levantamiento lo cita incorrectamente**. Desarrollo completo en §4.2.

**Qué resuelve realmente.** Consulta del Secretario Comunal de Planificación de San Ramón sobre a qué unidad corresponde efectuar las solicitudes de modificación presupuestaria y si SECPLA puede dictar el decreto modificatorio. Conclusiones: (a) SECPLA puede solicitar modificaciones por su función de asesoría; (b) la DAF también, coordinadamente (art. 27); (c) la proposición al Concejo la formula el alcalde; (d) SECPLA puede dictar el decreto modificatorio si existe delegación de atribuciones (art. 63 j) y previa aprobación del Concejo.

**Qué no dice.** Nada sobre pasivos acumulados ni sobre periodicidad trimestral. La única periodicidad que menciona es el informe **semestral** de SECPLA al Concejo (art. 21 c).

**Fuente correcta de la obligación trimestral.** Art. 29 letra d) LOCM, con contenido tipificado: avance del ejercicio programático presupuestario, cotizaciones previsionales, aportes al FCM y perfeccionamiento docente.

**Efectos en el plan.** (1) `AccruedLiabilitiesReport` reemplazada por `QuarterlyControlReport`. (2) Nuevo requisito: delegación configurable de la facultad de dictar el decreto modificatorio (MP-2). (3) Nuevo requisito: plazo de 10 días y escalamiento a CGR del art. 29 c) en `DeficitRepresentation`. (4) Criterio metodológico incorporado a F1 y a GP-1.

**Caveat.** Los campos de estado de la ficha CGR registran acciones explícitas de jurisprudencia posterior; no capturan una eventual superación implícita por reforma legal.

**Derivado.** Queda abierta la pregunta de cuántas otras citas normativas del levantamiento no resisten verificación. Es el fundamento del criterio metodológico de F1.

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

**Insumo nuevo (v0.8) — base de cálculo.** El cuadro **Componentes Remuneratorios** de SUBDERE mapea cada concepto remuneratorio a su imputación presupuestaria, con fuente legal por componente, para los cuatro sectores: Educación (Ley 19.070), Salud (Ley 19.378), Municipal (Ley 18.883 y Ley 15.076 para médicos) y Cementerios (Código del Trabajo). Resuelve buena parte de la pregunta "qué cuenta como gasto en personal":

- **Planta / contrata / otras remuneraciones** se distinguen por imputación: `21.01` planta, `21.02` contrata, `21.03` otras. La base del 20% del art. 2 de la Ley 18.883 es computable sobre esas imputaciones.
- **Honorarios** tienen imputación propia: suma alzada `2103001`, asimilados a grado `2103002`, suplencias y reemplazos `2103005`, otras `2103999`.
- **Componentes marcados "Extrapresupuestaria"** —por ejemplo la Asignación Familiar— **deben excluirse de la base**. Es un caso de error probable si la base se calcula por agregación ciega del subtítulo 21.
- Cada componente trae **fuente legal**, lo que da `legal_reference` listo para los validadores de personal (musts §11).

**Advertencia de ingesta.** El cuadro usa dos formatos de código para lo mismo: punteado (`21.01.001.001`) y concatenado (`2101001019`). Normalizar antes de usar como catálogo.

**Insumos.** Arts. citados; **cuadro Componentes Remuneratorios**; contrato Tesorería (ingresos percibidos); contrato RRHH; ficha staff Odoo como anti-patrón (sin validador).

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

### P-12 — Sector Cementerio

**Contexto.** El clasificador SINIM filtra por MUNICIPAL, SALUD, EDUCACION y **CEMENTERIO** (Anexo A.3). El levantamiento Magenta y Odoo solo modelan el municipal (Odoo tiene código de área “Cementerios”, no entidad presupuestaria). D-2 menciona el sector como alcance por confirmar.

**Pregunta.** ¿Cementerio es entidad presupuestaria separada (`BudgetEntity`) con ejercicio y reporte propios, o desagregación del presupuesto municipal?

**Opciones.**
1. Cuarta `BudgetEntity` paralela a Salud/Educación.
2. Segmento del presupuesto municipal (área/programa), sin acuerdo de Concejo propio.
3. Fuera de alcance SGM v1; solo catálogo de área.

**Default si DM no responde:** opción 2 en modelo (área), con nota de extensión a entidad si SINIM/CGR lo exigen como sector.

**Criterio de cierre.** Acta DM + Unidad de Información Municipal; impacto en D-2, reportes SINIM y CGR.

**Evidencia nueva (v0.7).** Cementerio tiene planillas BEP propias con prefijo de código `CCC` y el mismo número de cuentas que los demás sectores (§6.1), y columna propia de aplicabilidad por cuenta en el Manual V19 (Anexo A.4). Es tratado como sector completo por los dos artefactos oficiales, no como área. Refuerza la opción 1 y debilita la opción 2 que estaba como default.

**Tercera confirmación (v0.8).** La posición 6 del Código INI enumera 1 Gestión Municipal, 2 Educación, 3 Salud, 4 Cementerio (§5.2). Tres fuentes oficiales independientes —Manual V19, BEP y Oficio CGR 17.973— tratan a Cementerio como sector par. El default de la opción 2 ya no es sostenible.

**Insumos.** Anexo A.3 y A.4; §5.2; §6.1; datos SINIM; D-2; P-5 (coherencia con Salud/Educación).

---

### P-13 — Declaración del track GP en las bases

**Contexto.** §7.8: el track GP no se licita como desarrollo; es obligación institucional de SUBDERE. Sin declararlo, el sistema se entrega sin mantenedor del modelo normativo (riesgo §10).

**Pregunta.** ¿Con qué nivel de detalle se declara GP en las bases: solo supuesto operativo + soporte técnico del sistema, o también obligaciones de proceso/plazos de SUBDERE?

**Opciones.**
1. Bases: soporte técnico obligatorio (parámetros con vigencia, versionado, trazabilidad) + GP como obligación SUBDERE en anexo institucional.
2. Solo soporte técnico; GP queda en plan interno (más débil).
3. Licitar parte de GP (rechazado: §7.1 — no transferible).

**Default:** opción 1.

**Criterio de cierre.** Decisión de jefatura; texto propuesto para bases; alineación con [`principios-no-negociables.md`](../../arquitectura/licitacion/principios-no-negociables.md).

**Insumos.** §7; F5 entregable GP; P-14.

---

### P-14 — Clasificar parámetros por clase de autoridad

**Contexto.** §7.5 distingue mandato propio vs respaldo de órgano rector. Sin catálogo, validadores bloqueantes pueden crear interpretación normativa de hecho (advertencia §7.5 / P-3).

**Pregunta.** Para cada `NormativeParameter` / umbral / criterio del módulo (42%, 20%, art. 82, §4.1, clasificador, formatos BEP/SINIM…): ¿mandato propio o requiere `NormativeRuling`?

**Opciones.** No aplica menú: es inventario factual + clasificación jurídica.

**Default mientras se completa:** todo umbral LOCM/DS 854 / CGR = órgano rector; formatos de carga SUBDERE = mandato propio.

**Criterio de cierre.** Tabla parámetro × clase × órgano competente × referencia; integrada a fichas GP y a `legal_reference` de validadores.

**Insumos.** §4; §7.5; Anexo A; catálogo `NormativeParameter` de Adquisiciones/Presupuestos.

---

### P-15 — Exposición legal por operación y modo de contingencia

**Contexto.** §5.1. Hay operaciones cuyo incumplimiento de plazo produce efecto jurídico (silencio del art. 82; diez días del art. 29 c). Una caída del sistema en fecha crítica consumaría ese efecto sin decisión humana.

**Pregunta.** ¿Cuál es la vía alternativa para cada operación crítica, y cómo debe comportarse el sistema frente al vencimiento de un plazo legal cuando hubo contingencia declarada?

**Opciones (para el comportamiento ante el silencio del art. 82).**
1. El sistema registra la consumación automáticamente al vencer el plazo (comportamiento ingenuo; documenta en contra del municipio si estuvo caído).
2. El sistema registra la consumación solo tras **verificación humana** de que efectivamente no hubo pronunciamiento, dejando el `ContingencyRecord` asociado en el expediente.
3. El sistema bloquea el registro mientras exista contingencia abierta (arriesga desalinear el estado del sistema respecto del estado legal real).

**Default:** opción 2. El plazo legal corre por ley y el sistema no puede suspenderlo; lo que sí puede es no dar por acreditado un hecho sin verificación, y conservar la constancia para que el municipio la haga valer.

**Criterio de cierre.** Tabla operación × clase de exposición × vía alternativa × responsable; pronunciamiento jurídico sobre el punto del silencio (candidato natural a GP-4); `ContingencyRecord` especificado en F4 y SLA diferenciado en F5.

**Insumos.** §5.1; arts. 82 y 29 c) LOCM; especificación de escalabilidad F5; modo de hospedaje SUBDERE (§7.1).

---

### P-17 — Ingesta y gobernanza del Manual de Imputaciones

**Contexto.** §4.1. El Manual V19 es la fuente autoritativa de tres atributos por cuenta que el módulo necesita: exigencia de acuerdo del Concejo, aplicabilidad por sector (municipal / educación / salud / cementerio) y por área de gestión, y estado de la cuenta (nueva / no usar / oficio de creación). Hoy vive como planilla Excel, con parte de la información codificada en **formato de celda** y no en datos.

**Pregunta.** ¿Cómo se convierte el Manual en catálogo versionado dentro de SGM, y quién queda responsable de mantenerlo una vez que el sistema lo consume?

**Sub-preguntas.**
1. **Ingesta inicial:** ¿carga única con curaduría manual, o importador reproducible? La marca por color obliga a leer formato, lo que ningún importador estándar hace por defecto.
2. **Ciclo de actualización:** el Manual va por versiones (V19). ¿Cada versión genera una versión del `BudgetClassifier` con vigencia temporal (Anexo A.4)?
3. **Dirección del flujo a futuro:** ¿SGM sigue consumiendo la planilla, o el catálogo pasa a mantenerse en SGM y la planilla se genera desde ahí? Lo segundo elimina la codificación por color y hace del Manual un producto del sistema.
4. **Ausencia de marca:** ¿"no requiere acuerdo" o "no evaluado"? Ver P-3 residual punto 4.

**Opciones para la sub-pregunta 3.**
1. SGM consume la planilla en cada versión (menor fricción institucional; perpetúa el formato frágil).
2. SGM se vuelve el sistema de registro del catálogo y publica la planilla como salida (recomendada a mediano plazo; requiere acuerdo con el Depto. de Finanzas Municipales).
3. Doble mantención (rechazada: dos fuentes de verdad).

**Default:** opción 1 para la puesta en marcha, con opción 2 declarada como estado objetivo en el track GP.

**Criterio de cierre.** Importador reproducible con pruebas sobre V19; catálogo versionado en `BudgetClassifier`; acuerdo con el Depto. de Finanzas Municipales sobre el flujo objetivo; entrada correspondiente en el mapa de contrapartes (§7.6).

**Urgente (v0.9).** Existe el **Manual V21 (2026)**, dos versiones más nuevo que el V19 sobre el que se hizo el análisis de §4.1 y Anexo A.4. Reconfirmar contra V21 antes de fijar cualquier conclusión: número de cuentas marcadas, niveles, sectores y estado de cuentas. El V21 se describe además como *restrictivo en el uso de cuentas*, lo que sugiere un cambio de criterio respecto de versiones anteriores.

**Insumos.** §4.1; Anexo A.2, A.3 y A.5; Manual V19 (analizado) y **V21 (pendiente)**; P-3; P-12; §7.2.

---

### Orden sugerido de resolución

```
F0:  P-1, P-4
F1:  P-8, P-11, P-12, P-17, (P-10 inicia con RRHH) · P-9 cerrado en v0.5; P-3 parcial en v0.6
F2:  P-5, P-6
F3:  P-3, P-7, P-10 (cierre)
F4:  cierre formal P-1 en modelo de Adquisiciones; ContingencyRecord (P-15)
F5:  P-13, P-14 (track GP), P-15 (cierre)
```

---

## 10. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El levantamiento cubre ~35–40% de la superficie funcional | Alto — subestimación del esfuerzo | F2 explícita y con holgura; no asumir que Adquisiciones es predictor de esfuerzo |
| **El módulo no es operable sin histórico** (P-11) | **Alto — afecta la estrategia de puesta en marcha, no solo la especificación** | Definir en F1 la carga inicial de series históricas; el primer ejercicio en el sistema nuevo formula sin base propia |
| Dependencia de DM para P-3, P-5, P-6, P-8, P-10, P-12 | Alto — bloquea F3 | Formalizar el convenio como dependencia dura; especificar con parámetro configurable y valor por defecto marcado cuando no haya respuesta en plazo |
| Tomar Odoo as-is como contrato de campos | Medio — arrastra decisiones del proveedor anterior | Regla explícita §3.2; tablas §3.2–3.4; contrastar siempre contra el ORM, nunca contra el export de BD |
| La costura con Adquisiciones se define tarde | Alto — obliga a rehacer el modelo de Adquisiciones | P-1 resuelto en F0, antes de avanzar |
| Presupuestos de Salud y Educación tratados como caso borde | Medio — son entidades presupuestarias completas | Alcance fijado en D-2; etapa propia en F2 |
| La apertura del ejercicio cruza la frontera con Contabilidad | Medio — riesgo de doble propiedad del dato | P-6 resuelto en F2, con Contabilidad presente en el levantamiento |
| **El sistema se entrega sin mantenedor del modelo normativo** | **Alto — modo de falla de largo plazo del proyecto, no solo de este módulo** | Track GP especificado en F5 y declarado en las bases (P-13). Si no se resuelve explícitamente, se materializa por omisión al cerrar el proyecto |
| **SUBDERE crea interpretación normativa de hecho** vía validadores bloqueantes sin respaldo de órgano rector | Medio-alto — atribución que corresponde a CGR | Clasificación de parámetros por clase de autoridad (§7.5, P-14) y vía de escalamiento GP-4 |
| **Indisponibilidad del sistema en fecha con efecto jurídico** | **Alto — una caída puede consumar un efecto legal (silencio del art. 82, vencimiento del art. 29 c) sin decisión humana** | Disponibilidad diferenciada por exposición legal, vía alternativa documentada y `ContingencyRecord` auditable (§5.1, P-15). El sistema no da por acreditado el silencio sin verificación humana |
| **Citas normativas del levantamiento tomadas como requisito sin verificar** | Medio-alto — §4.2 muestra un caso confirmado | Verificación en fuente primaria como entregable de F1; incorporado a GP-1 como práctica permanente |
| **Conocimiento normativo operativo almacenado en formato frágil** | Medio-alto — el criterio de acuerdo del Concejo vive como color de celda en una planilla (§4.1) | Ingesta versionada del Manual con importador reproducible y estado objetivo de mantención en SGM (P-17) |
| **Análisis construido sobre una versión superada de la fuente** | **Alto — §4.1 y Anexo A.4 se basan en el Manual V19; existe V21 (2026)** | Reconfirmación contra V21 antes de cerrar P-3 y P-17. Regla general: fijar y registrar la versión de cada fuente usada, igual que exige el must §11.2 para parámetros |

---

## 11. Criterios de término del módulo

1. Todo validador bloqueante declara fundamento en `legal_reference`: cita de artículo/decreto/dictamen cuando la regla es normativa, o `integridad:<motivo>` cuando es invariante de proceso sin ancla legal única. El fundamento normativo se muestra en el helper de validación al funcionario ([`musts-arquitectura.md`](../../arquitectura/especificacion/musts-arquitectura.md) §11).
2. Ningún umbral, plazo o clasificación normativa está hardcodeado; todos son `NormativeParameter` con vigencia temporal. Incluye el 42%, el 20%, los plazos del art. 82 y el clasificador del Decreto 854.
3. Los contratos inter-módulo de §6 están versionados y clasificados por modo de invocación (incl. RRHH bidireccional — R-1).
4. Cada etapa tiene ficha completa; ningún paso queda descrito como "según práctica municipal".
5. La especificación permite construir el módulo sin consultar el código de Odoo.
6. Segregación de funciones verificable: formulación, aprobación, emisión de CDP, obligación y control son roles distintos, y el motor lo impone.
7. La cadena de firma del decreto es configurable por municipio sin modificar código.
8. Cada parámetro normativo está clasificado como de mandato propio o de respaldo de órgano rector, y ninguno de la segunda clase se modifica sin acto del órgano competente registrado en el sistema (P-14).
9. Los cuatro procesos del track GP tienen ficha propia y el sistema los soporta técnicamente: vigencia temporal de parámetros, versionado de contratos con preaviso, y trazabilidad de cada validador a su fuente (§7, P-13).
10. Toda operación con plazo legal tiene clase de exposición asignada y vía alternativa documentada; el sistema no da por acreditado el vencimiento de un plazo con efecto jurídico sin verificación humana registrada, y conserva el `ContingencyRecord` asociado (§5.1, P-15).
11. Ninguna regla del módulo se funda en una cita normativa no verificada en fuente primaria (§4.2).

---

## Anexo A — Fuentes normativas del clasificador presupuestario

Insumo directo de la especificación de `BudgetClassifier` y de la capa transversal TR.

### A.1 Las tres capas y quién manda en cada una

El error habitual es tratarlas como una sola. Son tres artefactos con autoridad, jerarquía y ciclo de actualización distintos.

| Capa | Artefacto | Autoridad | Qué define |
|---|---|---|---|
| **1. Clasificador presupuestario** | Decreto Supremo N° 854/2004 y sus modificaciones | **Ministerio de Hacienda** | Conceptos de ingreso y gasto. Jerarquía subtítulo / ítem / asignación / subasignación. Aplica a todo el sector público, incluidas las municipalidades |
| **2. Plan de cuentas contable** | Normativa del Sistema de Contabilidad General de la Nación; plan de cuentas municipal para NICSP; oficios de la División de Contabilidad | **Contraloría General de la República** | Cuentas contables. Jerarquía propia, distinta del clasificador. Gobierna el asiento que origina el devengo |
| **3. Puente operativo** | Manual de Imputaciones Presupuestarias incorporando plan de cuentas NICSP | **SUBDERE** (Depto. de Finanzas Municipales, vía SINIM) | Tabla de correspondencia clasificador ↔ plan de cuentas. Es el artefacto que los municipios usan en la práctica |

**Implicancia de diseño:** `BudgetClassifier` (capa 1) y el plan de cuentas (capa 2) son **catálogos independientes con una relación de mapeo explícita** (capa 3), no dos vistas de la misma jerarquía. Modelarlos como uno solo hace imposible absorber una modificación de Hacienda que no venga acompañada de una de Contraloría, o viceversa. Odoo colapsa ambos en `account.gov.account` con dominios `115%` / `215%`, lo que es una simplificación que no se debe heredar.

### A.2 Referencias

**Capa 1 — Clasificador (Hacienda)**

- [Decreto 854/2004, Ministerio de Hacienda — Determina clasificaciones presupuestarias](https://www.bcn.cl/leychile/navegar?idNorma=233184) · BCN LeyChile. **Usar el texto consolidado de LeyChile, no PDFs sueltos.**
- Modificaciones relevantes: Decreto (H) 324/2008, Decreto (H) 885/2009, Decreto 1227/2024 (aplicable a información presupuestaria 2026), entre otras.

**Capa 2 — Plan de cuentas (CGR)**

- [Plan de cuentas del sector municipal para NICSP](https://www.sinim.gov.cl/desarrollo_local/clasificador_presupuestario/download/nuevo_clasificador/Plan_de_Cuentas_Sector_Municipal_para_NICSP.pdf)
**Cadena vigente (NICSP-CGR Sector Municipal).** El Oficio CGR N° 36.640, de 2007, que estableció el Manual de Procedimientos Contables y el Catálogo del Plan de Cuentas, **está superado**. Rige:

- **Resolución CGR N° 3, de 2020** — aprueba la Normativa del Sistema de Contabilidad General de la Nación, NICSP-CGR Chile Sector Municipal. **Vigente desde el 1 de enero de 2021**
- [Oficio CGR N° E11061, de 2020](https://www.sinim.gov.cl/archivos/home/758/Of_CGR_%20E11061_de_2020.pdf) — aprueba el plan de cuentas del sector municipal conforme a la Resolución N° 3. Es el oficio que cita el encabezado del Manual de Imputaciones
- [Oficio CGR N° E59541, de 2020](https://www.sinim.gov.cl/archivos/home/758/Of_E59541_de_2020_Complementa_Plan_de_Cuenta.pdf) — complementa el plan de cuentas
- [Oficio CGR N° E59549, de 2020](https://www.sinim.gov.cl/archivos/home/758/Of_E59549_de_2020_Manual_de_Procedimientos_SM.pdf) — **Manual de Procedimientos Contables para el Sector Municipal (NICSP-CGR)**
- [Oficio CGR N° E59548, de 2020](https://www.sinim.gov.cl/archivos/home/758/Of_E59548_de_2020_Cierre_Sector_Municipal_anio_2020.pdf) — instrucciones sobre **cierre** contable
- [Oficio CGR N° E64.327, de 2020](https://www.sinim.gov.cl/archivos/home/758/Oficio_CGR_E64.327_Apertura_Municipal_2021.pdf) — instrucciones sobre el ejercicio contable siguiente. **Es el documento de apertura; fuente directa de P-6**
- Oficio CGR N° E12203, de 2020 — Instructivo de Primera Adopción NICSP-CGR. Relevante para la estrategia de puesta en marcha (P-11)

Índice de la serie: [SINIM — Oficios de cierre 2020, modificación plan de cuentas y manual de procedimientos](https://www.sinim.gov.cl/documento_importante.php?id=758)
- [Oficio DCF 3/19 — Modifica procedimientos contables y catálogo de cuentas para el sector municipal](https://www.sinim.gov.cl/desarrollo_local/clasificador_presupuestario/download/nuevo_clasificador/DCF_3-19_MODIF.PROCED.CONTABLES-CTAS_SECTOR_MUNICIPAL_1.pdf) — Oficio N° 32.228 de 17-XII-2019, vigente desde el ejercicio contable 2020. Revisado: modifica el procedimiento E-09 (transferencias con condición), suspende F-06 y F-07 y reactiva F-03 (anticipos a contratistas), y crea/suspende cuentas de transferencias de educación. **No contiene el procedimiento de apertura**
- [Dictamen CGR N° 75.992/2010](https://www.sinim.gov.cl/desarrollo_local/clasificador_presupuestario/download/nuevo_clasificador/Dictamen_75992-2010.pdf) e instructivos de creación de cuentas específicas (DAC72, 101916, 022703, 022704)

**Capa 3 — Puente operativo (SUBDERE / SINIM)**

- [Documentos del nuevo Clasificador Presupuestario](https://www.sinim.gov.cl/desarrollo_local/clasificador_presupuestario/documentos_nclasificador.html) — índice mantenido por el Depto. de Finanzas Municipales
- [Manual de Imputaciones Presupuestarias incorporando plan de cuentas NICSP, V19](https://www.sinim.gov.cl/archivos/home/664/Manual_de_Imputaciones_Presupuestarias_incorporando_plan_de_cuenta_NICSP_V19.xls) — **fuente autoritativa de los atributos por cuenta del `BudgetClassifier`** (ver A.4). Inspeccionado: 3 hojas, 463 cuentas de gasto y 176 de ingreso. No cita el DS 854 ni el Decreto 1227/2024; se construye sobre oficios y dictámenes de CGR (últimos citados: E308931/2023 y E486016/2024). Última modificación del archivo: agosto de 2025
- [Convertidor Municipal](https://www.sinim.gov.cl/desarrollo_local/clasificador_presupuestario/download/nuevo_clasificador/Convertidor_Municipal_04022008.xls) — conversión desde el clasificador anterior; útil solo para migración histórica
- [Inversiones Municipales — Presupuesto y Código INI](https://www.sinim.gov.cl/desarrollo_local/clasificador_presupuestario/download/nuevo_clasificador/Inversiones_y_codigo_INI.pdf) — **revisado en v0.8.** Regla de modificación tipificada por operación para el ST 31; formulación a nivel de asignación; Código Municipal correlativo perpetuo; estructura del Código INI (Oficio CGR N° 17.973, de 2008); formato del anexo al Concejo. Ver §5.2
- [Componentes Remuneratorios — Sectores Municipal, Educación, Salud, Cementerio](https://www.sinim.gov.cl/desarrollo_local/clasificador_presupuestario/download/nuevo_clasificador/Componentes_remuneratorios_(cuadro).pdf) — **revisado en v0.8.** Concepto remuneratorio → imputación, con fuente legal por componente. Base de cálculo de los límites del 42% y 20% (P-10)

**Datos y reporte**

- [SINIM — Clasificador presupuestario (datos de ejecución por municipio)](https://datos.sinim.gov.cl/clasificador_presupuestario.php)
- [SINIM — Evolución presupuestaria](https://datos.sinim.gov.cl/evolucion_presupuestaria.php)
- [SINIM — Diccionario del clasificador presupuestario](https://datos.sinim.gov.cl/dicc_clasificador_presupuestario.php)

### A.3 Dos hallazgos del anexo

**Cementerio como cuarto sector.** El clasificador de SINIM filtra por MUNICIPAL, SALUD, EDUCACION y **CEMENTERIO**. El levantamiento y Odoo solo contemplan el municipal (área de catálogo ≠ entidad). Ver P-12.

**Dos versiones vigentes del mismo artefacto.** Corregido en v0.9. No se trata de desfase sino de **inconsistencia interna de la publicación**:

- La página [Documentos del nuevo Clasificador Presupuestario](https://www.sinim.gov.cl/desarrollo_local/clasificador_presupuestario/documentos_nclasificador.html) enlaza el **Manual V19**.
- La portada de SINIM destaca el **[Manual V21 (2026), con cambios NICSP incorporados](https://www.sinim.gov.cl/archivos/home/664/Manual_de_Imputaciones_Presupuestarias_incorporando_plan_de_cuenta_NICSP_V21.xls)**, descrito como *"restrictivo en el uso de cuentas, todas debidamente individualizadas"*.

Dos rutas del mismo sitio institucional entregan versiones distintas del artefacto que define, entre otras cosas, qué modificaciones presupuestarias requieren acuerdo del Concejo. **Todo el análisis de §4.1 y Anexo A.4 se hizo sobre V19 y debe reconfirmarse contra V21.**

Esto es un argumento más fuerte que el de latencia para §7.2: la función existe y produce el artefacto actualizado, pero sin un sistema que sea la única fuente, conviven copias divergentes sin que nadie lo advierta.

**Trazabilidad de lo revisado.** Conviene separar lo verificado de lo inferido:

- **Verificable:** los enlaces rotulados "Archivo de carga BEP actualizado" en la página de Documentos del Clasificador Presupuestario apuntan a `BEP_Planillas_Excel_2023.rar` y `BEP_Planillas_csv_2023.rar`. Inspeccionadas en v0.7: ocho archivos CSV, estructura documentada en §6.1.
- **Verificado en v0.6:** el Manual V19 **no cita** el DS 854 ni el Decreto 1227/2024; se construye sobre oficios y dictámenes de CGR. Como el Manual es la capa 3 y rastrea el catálogo de cuentas de CGR, la ausencia de cita no prueba que el contenido del decreto no esté reflejado: para afirmarlo hay que identificar los ítems que agregó el 1227 y buscarlos en la planilla. **Pendiente acotado.**
- **No es evidencia de desfase:** que los datos de ejecución lleguen a 2025, que corresponde al rezago normal del reporte municipal.

Si el contrato de reporte se especifica contra estos archivos, hay que asumir versionado por año. Refuerza P-8.

### A.4 El Manual de Imputaciones como fuente de atributos del clasificador

Además de mapear clasificador contra plan de cuentas, el Manual V19 aporta atributos por cuenta que ninguna otra fuente entrega:

| Atributo | Columna del Manual | Uso en el módulo |
|---|---|---|
| `requires_council_agreement` | "Cuenta que requiere Aprobación de Concejo Municipal" — **codificada por color de celda**, no por texto | Gateway del proceso 27 (§4.1, P-3) |
| Aplicabilidad por sector | Sector MUNICIPAL / EDUCACION / SALUD / CEMENTERIO (S/N) | `BudgetEntity` y alcance D-2 (P-5, P-12) |
| Aplicabilidad por área de gestión | Gestión Interna, Servicios a la Comunidad, Actividades Municipales, Programas Sociales / Recreacionales / Culturales (S/N) | Imputación por área; corresponde a `account.gov.area` en Odoo |
| Estado de la cuenta | "Cuenta Nueva / NO USAR" y "Oficio de creación y/o eliminación" | Vigencia temporal por cuenta; validador de imputación a cuenta descontinuada |

**Advertencia de ingesta.** La marca de acuerdo del Concejo está en el **formato** de la celda (fondo cian, RGB 0,204,255), no en su contenido; la columna de texto está vacía. Un importador que lea solo valores perderá los 106 registros. Ver P-17.

### A.5 Regla de gobernanza derivada

La evidencia de más de veinte años de modificaciones sucesivas al DS 854 confirma el criterio del §11.2: el clasificador **no puede ser una tabla estática del sistema**. Debe ser `NormativeParameter` / catálogo versionado con vigencia temporal, versión, y capacidad de convivencia de dos versiones simultáneas — un ejercicio en curso opera con la versión vigente al momento de su apertura, mientras el ejercicio siguiente se formula con la versión nueva.

---

## Fuentes

- Informe 2 — Anexo procesos: Levantamiento de procesos y diseño de Servicios, Magenta / C Amable para SUBDERE (procesos 26 y 27)
- [`modelos-odoo.md`](modelos-odoo.md) — inventario as-is reconstruido desde `presupuesto_gov_cl` y `account_gov_adquisiciones`
- [Ley N° 18.695, Orgánica Constitucional de Municipalidades](https://www.bcn.cl/leychile/navegar?idNorma=30077) — arts. 21, 27, 29, 63, 65, 67, 81, 82
- [Ley N° 18.883, Estatuto Administrativo para Funcionarios Municipales](https://www.leychile.cl/leychile/navegar?idNorma=30256) — art. 2
- [Decreto 854/2004, Ministerio de Hacienda — Determina clasificaciones presupuestarias](https://www.bcn.cl/leychile/navegar?idNorma=233184)
- [ACHM — Elaboración, seguimiento y fiscalización del presupuesto municipal](https://www.achm.cl/wp-content/uploads/2025/01/Elaboracion-Seguimiento-y-Fiscalizacion-del-Presupuesto-Municipal.pdf)
- [SUBDERE — Instrucciones para el cálculo del déficit municipal](https://municipalidades.subdere.gob.cl/descargas/20_12_2024_Instrucciones_calculo_deficit_municipal_2024.pdf)
- [CGR — Base de jurisprudencia administrativa](https://www.contraloria.cl/web/cgr/buscar-jurisprudencia)
- Dictamen CGR N° 60.449, de 19-XII-2008 — verificado en fuente primaria; ver §4.2
- [SINIM — Sistema Nacional de Información Municipal](https://www.sinim.gov.cl/)
- Anexo A de este plan — jerarquía clasificador / plan de cuentas / puente SUBDERE