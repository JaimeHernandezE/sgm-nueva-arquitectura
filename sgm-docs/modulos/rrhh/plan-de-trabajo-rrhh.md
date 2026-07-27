# Plan de trabajo — Módulo RRHH y Remuneraciones

**Proyecto:** SGM — Sistema de Gestión Municipal
**Módulo:** RRHH / Remuneraciones
**Versión:** 0.1 (borrador para revisión interna)
**Fecha:** julio 2026
**Estado:** propuesta de plan, no validada con DM

**Convención de pendientes:** este módulo usa el prefijo **R-nn**. Las referencias a Presupuestos (**P-nn**), Contabilidad (**C-nn**), Tesorería (**T-nn**) y arquitectura transversal conservan su prefijo original.

---

## 1. Propósito

Definir la secuencia de trabajo para producir la especificación completa del módulo RRHH y Remuneraciones, con el estándar ya fijado: *dos equipos independientes deben poder construir sistemas funcionalmente equivalentes solo con la especificación*.

Es el módulo con **más procesos levantados de todo el corpus**: dieciocho, contra diez de Contabilidad, cinco de Tesorería y dos de Presupuestos.

Este documento **no** es la especificación. Es el plan que la produce.

---

## 2. Decisiones de partida

| # | Decisión | Contenido |
|---|----------|-----------|
| D-1 | **Motor de liquidación incluido** | SGM **calcula** las remuneraciones de planta, contrata, honorarios y Código del Trabajo. Cierra P-20 del documento de alcance mínimo. Ver §2.1 |
| D-2 | **SIAPER como integración** | Los actos de personal se originan en SGM y se registran en SIAPER, con el mismo tratamiento de frontera que DocDigital. Condicionado a verificación de interfaz máquina a máquina. Ver §2.2 y R-2 |
| D-3 | **Alcance de gestión de personas** | Además del ciclo contractual y la nómina: **evaluación del desempeño** (6), **capacitación y plan anual** (11), **asistencia, horas extras y permisos** (8, 10), **viáticos, cometidos y comisiones** (3) |
| D-4 | **Tramitación documental** | Los decretos y resoluciones de personal se tramitan en DocDigital, conforme a la decisión transversal. Es el módulo con mayor variedad de actos administrativos del corpus |
| D-5 | **Profundidad** | Módulo completo, con el núcleo no diferible marcado explícitamente dentro |
| D-6 | **Método** | Réplica del método de Adquisiciones, Presupuestos, Contabilidad y Tesorería |

### 2.1 Consecuencia de D-1

Incluir el motor de liquidación es la decisión de mayor impacto en el tamaño de la licitación, y se justifica por tres razones:

1. **El subtítulo 21 es la mayor partida de gasto municipal.** Si se calcula fuera, el devengo de la partida principal entra a SGM desde un sistema que SUBDERE no controla.
2. **Dos validadores legales dependerían de datos externos.** El 42% del art. 67 LOCM y el 20% del art. 2 de la Ley 18.883 se calculan sobre imputaciones de remuneraciones. Su exactitud no puede depender de una carga externa.
3. **Existe base en el as-is.** El motor (`bi_hr_payroll`), la localización chilena (`l10n_cl_hr`), la escala única (`l10n_cl_hr_scale`) y la calidad jurídica municipal (`tupa_hr`) están implementados. No se parte de cero.

**Contrapartida:** es el módulo con más superficie regulada del corpus. Cuatro estatutos conviven —Ley 18.883 para funcionarios municipales, Ley 19.070 para docentes, Ley 19.378 para atención primaria de salud, Código del Trabajo— cada uno con sus propios componentes remuneratorios, ya mapeados en el cuadro de Componentes Remuneratorios de SUBDERE (§4).

### 2.2 Consecuencia de D-2

SIAPER aparece como paso de registro obligatorio en al menos seis procesos: cometido funcionario (3.2.8), honorarios (4.2.11), evaluación del desempeño (6.2.14), licencia médica (7.2.6), renuncia (9.2.7) y permisos (10.2.12).

Tratarlo como integración implica lo mismo que DocDigital: **el acto de personal no está completo hasta que el registro externo lo confirma**, y la máquina de estados debe incorporar ese estado de espera.

> **PENDIENTE R-2 (bloqueante):** Verificar si SIAPER expone interfaz máquina a máquina para el registro de actos de personal, o si el registro es necesariamente por carga manual en el portal de Contraloría. **Toda la especificación de MR-6 queda condicionada.** Es el análogo exacto de P-72 para DocDigital.

---

## 3. Diagnóstico: qué tenemos hoy

### 3.1 Levantamiento de procesos

| # | Proceso | Actores principales | Ámbito |
|---|---|---|---|
| 1 | RRHH: Incorporación Contratas | Solicitante, RRHH, DAF, Alcaldía | Ciclo contractual |
| 2 | RRHH: Incorporación Planta | + Postulantes, Comité de Selección | Ciclo contractual, con concurso |
| 3 | RRHH: Cometido Funcionario y Comisión de Servicio | Funcionario, Jefe directo, DAF, RRHH, Alcaldía | Gestión del tiempo y viáticos |
| 4 | RRHH: Contrato a Honorarios | Solicitante, RRHH, DAF, Alcaldía | Ciclo contractual |
| 5 | RRHH: Desvinculación | Funcionario, RRHH, Alcaldía | Ciclo contractual |
| 6 | RRHH: Evaluación del desempeño | Funcionario, Jefatura, RRHH, Junta Calificadora, Alcaldía | Desarrollo |
| 7 | RRHH: Licencia Médica | RRHH, COMPIN/Isapre, Funcionario | Gestión del tiempo |
| 8 | RRHH: Planificación Horas Extras | Departamentos, RRHH/DAF, Alcaldía | Gestión del tiempo |
| 9 | RRHH: Renuncia | Funcionario, RRHH/DAF, Alcaldía | Ciclo contractual |
| 10 | RRHH: Solicitud Permisos | Funcionario, Jefe Directo, RRHH/DAF, Alcaldía | Gestión del tiempo |
| 11 | RRHH: Capacitación | Departamentos, RRHH/DAF, Alcaldía, Proveedores | Desarrollo |
| 12 | RRHH: Informe Transparencia | RRHH | Reporte externo |
| 13 | RRHH: Informe Dipres | RRHH, Alcaldía | Reporte externo |
| 14 | RRHH: Encuesta INE | RRHH, Alcaldía | Reporte externo |
| 15 | Remuneraciones: Contrata y Planta | RRHH, DAF/RRHH, Alcaldía, Tesorería | Nómina |
| 16 | Remuneraciones: Pago Honorarios | RRHH, Áreas, Colaborador, DAF, Alcaldía, Tesorería | Nómina |
| 17 | Remuneraciones: Pagos Previsionales e impuestos | RRHH, DAF, Alcaldía, Tesorería | Nómina |
| 18 | Licencias Médicas: Cálculo | Funcionario, COMPIN/Isapre, RRHH, DAF | Recuperación de subsidios |

#### Diez hallazgos del levantamiento

**1. La disponibilidad presupuestaria es precondición bloqueante de la contratación.** Aparece en los procesos 1.2.3, 2.2.3, 3.2.4, 4.2.4 y 8.2.3: antes de incorporar personal, autorizar un cometido o programar horas extras, **la DAF verifica que exista presupuesto**.

Esto abre un contrato que **no estaba en el plan de Presupuestos**, donde RRHH figuraba solo como proveedor de datos para los límites del 42% y el 20%. La relación es bidireccional y bloqueante: RRHH consulta disponibilidad de forma sincrónica en su ciclo de vida contractual.

**2. El CDP se usa también para gasto en personal.** El proceso 3.2.4 es explícito: la Dirección de Finanzas debe adjuntar a la solicitud de comisión de servicio el **Certificado de Disponibilidad Presupuestaria**, junto con el cálculo tentativo de viáticos y el itinerario.

Amplía el alcance del CDP más allá de adquisiciones, que era el único uso considerado en los planes de Presupuestos y Adquisiciones. Ver R-1 y P-3.

**3. Hay dos controles de admisibilidad distintos y ambos son bloqueantes.** *Disponibilidad de cupo* —que exista vacante en la planta o en la contrata— es distinto de *disponibilidad presupuestaria*. El primero es un límite de dotación autorizada; el segundo, de dinero. Los procesos 1 y 2 los verifican por separado y en ese orden.

**4. Las horas extras exigen acto administrativo previo e individualizado.** El proceso 8 lo cita del Estatuto Administrativo: las HE *«deben autorizarse en forma previa a la realización de aquéllas mediante actos administrativos, y en ellos se debe individualizar al personal que las desarrollará, el número de horas a efectuar y el mes que comprende la autorización»*.

Es un validador duro: **no se puede liquidar una hora extra sin resolución previa que individualice persona, cantidad y mes**. El as-is lo modela correctamente en `hr.cl.overtime.resolution`.

**5. El pago previsional tiene plazo con hora exacta y doble firma.** El proceso 17.2.8: el pago de la nómina en Previred *«no puede ocurrir posterior al 13 de cada mes a las 13:45 hrs»* y *«requiere la firma de 2 cuentadantes»*.

Es el **quinto punto del sistema donde el tiempo produce un efecto**, y el único con precisión horaria. Los anteriores: silencio del art. 82 LOCM, 10 días del art. 29 c), 8 días hábiles de la Ley 19.983, y la ventana de anulación de caja.

**6. La nómina tiene un calendario que se adelanta en el último cuatrimestre.** El proceso 15.2.1: el ciclo parte alrededor del día 10, pero *«en los meses de septiembre a diciembre se inicia antes, dado que los pagos se deben realizar a mediados de mes»*. El calendario de nómina no es fijo y debe ser parametrizable por municipio y por mes.

**7. El pago de honorarios exige informe de actividades como condición.** El proceso 16.2.4: *«Cada pago, según establezca el contrato, requiere un informe de las actividades realizadas o productos entregados»*, revisado y aprobado por el área (16.2.5). Más la revisión de **retenciones judiciales** por la DAF (16.2.7).

Es un patrón de conformidad análogo al *three-way match* de Adquisiciones: convenio + informe + aprobación del área habilitan el pago. Sin informe aprobado no hay decreto.

**8. Las licencias médicas generan un ciclo de recuperación de ingresos.** El proceso 18 lo declara en su descripción: *«gestionar la devolución de los subsidios de incapacidad laboral a las arcas municipales»*. El municipio paga la remuneración y luego recupera el subsidio de COMPIN o de la Isapre.

Eso convierte a RRHH en **originador de un ingreso por percibir**, con ciclo de cobranza propio. Cruza con Contabilidad (devengo del derecho) y Tesorería (percepción). No aparece en el plan de ninguno de los dos.

**9. El plan anual de capacitación se presenta al Concejo junto con el presupuesto.** El proceso 11.2.4 cita la Ley 20.742 art. 9. Es el **segundo anexo obligatorio del proyecto de presupuesto** que aparece en el corpus, junto con el anexo de iniciativas de inversión (§5.2 del plan de Presupuestos). Cruza con MP-1 y, por la vía de la contratación de proveedores, con Adquisiciones.

**10. Consulta obligatoria al Registro Nacional de Deudores de Pensiones de Alimentos.** El proceso 4.2.5, en la contratación a honorarios: *«obligatoriamente se revisa en Portal Registro Nacional de Deudores de Pensiones de Alimentos»*. Es una integración externa obligatoria que no está en ninguna otra fuente ni en el as-is.

#### Dos errores de cita en el levantamiento

Ambos en el proceso 6, y ambos deben verificarse antes de convertirse en requisito:

- **Estatuto mal identificado.** El punto 6.1.5 cita *«la Ley 19.883 que aprueba el Estatuto Administrativo para funcionarios Municipales»*. El Estatuto Administrativo para Funcionarios Municipales es la **Ley 18.883**, ya usada correctamente en el resto del corpus. Además la referencia interna es inconsistente: dice *«en su artículo 3»* y a continuación transcribe el *«Artículo 32»*.
- **Periodo de calificación contradictorio.** El punto 6.2.2 fija el periodo evaluado entre el **1 de noviembre y el 31 de octubre** del año siguiente; el punto 6.2.11, citando el art. 34, dice *«los doce meses de desempeño funcionario que se extienden entre el 1° de septiembre de un año y el 31 de agosto del año siguiente»*. **El mismo proceso declara dos periodos distintos.**

Es el tercer caso documentado de cita normativa del levantamiento que no resiste verificación, tras el dictamen 60.449/2008 en Contabilidad y los porcentajes pendientes de Tesorería. Refuerza el criterio metodológico ya adoptado.

### 3.2 Odoo as-is

[`modelos-odoo.md`](modelos-odoo.md) reconstruye once addons. Es el módulo con mayor implementación del as-is.

Regla de uso: **fuente de requisitos funcionales candidatos, nunca fuente de arquitectura.**

#### Qué Odoo hace bien

| Capacidad | Evidencia |
|---|---|
| Motor de nómina completo | `bi_hr_payroll`: estructura, reglas con condición y cálculo, liquidación `draft → verify → done`, lote |
| Localización previsional chilena | `l10n_cl_hr`: AFP, Isapre, CCAF, mutual, APV con régimen A/B, seguro complementario, indicadores mensuales |
| Escala única municipal | `l10n_cl_hr_scale`: escala con factores de bienios, grados, estamentos, estamento DIPRES, ley aplicable, asignaciones de caja y movilidad por categoría |
| Reliquidación | `hr.payroll.supplementary`: `draft → computed → confirmed`, con líneas y resumen |
| Horas extras con resolución previa | `hr.cl.overtime.resolution`: `draft → waiting → active → expired`, con líneas por empleado; saldos 25% y 50% en `hr.cl.employee.extra` |
| Licencias con ciclo externo | `hr.leave.isapre`: `pending → sended → approved / rejected / reduced / increased`, con datos SIAPER y **vínculo a orden de ingreso y pago** (`gov_entry_order_id`, `gov_payment_id`) |
| Subrogación durante licencia | `hr.subrogation`: `draft → registered / cancelled` |
| Declaración jurada anual | `hr.dj1887`: `draft → computed → generated → sent` |
| Archivo bancario de nómina | `hr.bank.transfer.file`: `draft → review → generated`, líneas por empleado |
| Puente contable por calidad jurídica | `hr.salary.rule.account.line`: mapeo regla salarial × calidad jurídica → cuentas de débito y crédito, con clave única |
| Generación de decretos por grupo de pago | `action_create_payment_decrees`: un decreto por `payment_group_id` |
| Viáticos, méritos y deméritos, evaluación | `l10n_cl_viatic`, `l10n_cl_hr_merit_demerit`, evaluación del desempeño en `l10n_cl_hr` |
| Reclutamiento municipal | `hr.gov.recruitment` con candidatos |

#### Qué Odoo hace mal o no hace

| Capacidad esperada | Situación real |
|---|---|
| **Validación de disponibilidad presupuestaria en contratación** | **Ausente.** Ningún flujo de incorporación consulta a Presupuestos |
| **Control de cupo de dotación** | **Ausente** |
| **Validadores del 42% y del 20%** | **Ausentes**, pese a que el módulo tiene todos los datos |
| **Doble vía de calidad jurídica** | `hr.cl.legal.quality` (escala) y `hr.calidad.juridica` (nómina y contabilidad) coexisten. El puente contable usa la segunda. **Es un defecto de modelo, no una decisión**: dos catálogos para el mismo concepto |
| **LRE** | `l10n_cl_hr_lre` es **solo un wizard de exportación CSV, sin modelos de dominio** |
| **SIAPER** | Solo campos de datos y wizards de apoyo; **no hay integración ni estado de registro** |
| **Registro Nacional de Deudores de Pensiones de Alimentos** | Ausente |
| **Informes DIPRES, Transparencia e INE** | Parcial: existen wizards de reporte en `tupa_hr`, sin entidad de envío ni acuse |
| **Recuperación de subsidios como ciclo** | Parcial: `hr.leave.isapre` enlaza a orden de ingreso y pago, pero no hay proceso de cobranza ni seguimiento del recupero |
| **Calendario de nómina parametrizable** | No evidenciado |
| **Informe de actividades como condición de pago de honorarios** | No evidenciado en el flujo de `hr.fee.payslip` |
| **Retenciones judiciales** | No evidenciadas |
| Méritos y deméritos | `l10n_cl_hr_merit_demerit` **no está en `depends` de `tupa_hr`**: satélite instalable aparte, no integrado |

### 3.3 Brecha de cobertura

| Ámbito | Levantamiento | Odoo | Brecha |
|---|---|---|---|
| Incorporación contrata y planta | Sí (1, 2) | Parcial: reclutamiento y contrato | **Faltan cupo y disponibilidad presupuestaria** |
| Contrato a honorarios | Sí (4) | Parcial | Falta Registro de Deudores; falta informe como condición |
| Desvinculación y renuncia | Sí (5, 9) | Parcial: `hr.employee.termination` | Formalizar causales y decreto |
| Cometido y comisión de servicio | Sí (3) | Sí: `l10n_cl_viatic` | **Falta el CDP como precondición** |
| Licencia médica | Sí (7) | Sí: `hr.leave.isapre` | Cubierto; falta integración de portales |
| **Recuperación de subsidios** | **Sí (18)** | Parcial (enlace a OI) | **Ciclo de cobranza sin cobertura** |
| Horas extras | Sí (8) | Sí: resolución + saldos | Cubierto; falta la consulta presupuestaria |
| Permisos y feriados | Sí (10) | Sí: `hr.holiday.request`, compensados | Cubierto |
| Evaluación del desempeño | Sí (6) | Sí | Cubierto; **resolver contradicción de periodo** |
| Capacitación y plan anual | Sí (11) | Parcial: `hr_course` | **Falta el plan anual y su presentación al Concejo** |
| Nómina planta y contrata | Sí (15) | Sí | Cubierto; falta calendario parametrizable |
| Pago de honorarios | Sí (16) | Parcial: `hr.fee.payslip` | Falta informe y retenciones |
| Pagos previsionales | Sí (17) | Parcial: Previred en el run | **Falta el plazo con hora y la doble firma** |
| **Informes DIPRES, Transparencia, INE** | **Sí (12, 13, 14)** | Parcial: wizards | **Sin entidad de envío ni acuse** |
| **LRE** | No levantado | Solo wizard CSV | **Sin dominio; verificar obligatoriedad** |
| **SIAPER** | Sí (6 procesos) | Parcial | **Sin integración (R-2)** |

**Lectura.** Es el módulo con mejor implementación del as-is y con mejor levantamiento, pero la brecha se concentra en un lugar preciso: **los controles de admisibilidad que conectan RRHH con el resto del sistema no existen**. Odoo calcula muy bien, pero no valida si el municipio puede contratar. Los tres validadores más importantes del módulo —cupo, disponibilidad presupuestaria, límites del 42% y 20%— están todos ausentes.

---

## 4. Marco normativo → implicancias de diseño

| Norma | Regla | Implicancia de diseño |
|---|---|---|
| **Ley 18.883** (Estatuto Administrativo para Funcionarios Municipales) | Régimen de planta, contrata y honorarios; requisitos de ingreso del art. 12; concurso del art. 19 y bases del art. 20; contratación a honorarios del art. 4 | Estatuto base del módulo. Requisitos de ingreso como validadores documentales |
| **Ley 18.883 art. 2** | Contrata ≤ **20%** del gasto en remuneraciones de la planta | Validador bloqueante; `NormativeParameter` |
| **LOCM art. 67** | Gasto anual en personal ≤ **42%** de los ingresos propios percibidos el año anterior | Validador bloqueante; requiere dato de Tesorería |
| **Ley 19.070** (Estatuto Docente) | Componentes remuneratorios del personal de educación municipal | Estatuto paralelo con reglas propias |
| **Ley 19.378** (Atención Primaria de Salud) | Componentes remuneratorios del personal de salud municipal | Estatuto paralelo con reglas propias |
| **Código del Trabajo** | Personal de cementerios, balnearios y otros | Cuarto régimen |
| **Estatuto Administrativo — horas extraordinarias** | Autorización **previa** por acto administrativo, individualizando personal, número de horas y mes | Validador: sin resolución previa vigente no hay liquidación de HE |
| **Ley 20.742 art. 9** | Plan anual de capacitación presentado al Concejo **junto con el presupuesto municipal**, con áreas prioritarias, criterios de selección y condiciones de acceso igualitario | Anexo obligatorio del proyecto de presupuesto; cruza con MP-1 de Presupuestos |
| **Ley de reajustes del sector público, art. 70** (citado en 12 y 13) | Envío **mensual** a DIPRES de la nómina de trabajadores de cualquier régimen y honorarios, con remuneraciones efectivamente pagadas y fuente de financiamiento, **dentro de los quince días siguientes al término del mes** | Reporte mensual con plazo computable y formato definido por DIPRES |
| **Transparencia activa** (12) | Publicación en plantillas separadas por régimen: planta, contrata, Código del Trabajo, honorarios; con estamento, grado, título, función, región y vigencia | Cuatro estructuras de reporte distintas por régimen |
| **Encuesta Mensual de Remuneraciones y Costo de la Mano de Obra, INE** (14) | Reporte mensual en formato definido por el INE | Tercer reporte externo mensual |
| **Previred** (17.2.8) | Pago previsional **no posterior al día 13 a las 13:45 hrs**; **firma de dos cuentadantes** | Plazo con precisión horaria y doble firma como validador |
| **Registro Nacional de Deudores de Pensiones de Alimentos** (4.2.5) | Consulta obligatoria antes de contratar a honorarios | Integración externa bloqueante en el flujo de contratación |
| **Dictamen CGR N° 11.365/2006** (citado en 6) | Calificación anual en cuatro listas, de Distinción a Eliminación, para funcionarios con seis meses de servicio | Verificar en fuente primaria (R-3) |
| **SIAPER** (CGR) | Registro de actos de personal | Integración condicionada a R-2 |

> **PENDIENTE R-3:** Verificar en fuente primaria el estatuto aplicable a la evaluación del desempeño, el periodo de calificación —hay dos periodos contradictorios en el mismo proceso— y el dictamen 11.365/2006. Ninguno puede convertirse en validador antes de esa verificación. Ver §3.1.

---

## 5. Arquitectura funcional propuesta

```
MR-1  Ciclo de vida contractual        (procesos 1, 2, 4, 5, 9; cupo, presupuesto, concurso, decreto)
MR-2  Gestión del tiempo               (procesos 3, 7, 8, 10; permisos, licencias, HE, cometidos)
MR-3  Desarrollo y evaluación          (procesos 6, 11; calificación, plan anual de capacitación)
MR-4  Nómina y liquidación             (procesos 15, 16, 17; planta, contrata, honorarios, previsionales)
MR-5  Recuperación de subsidios        (proceso 18; cobranza a COMPIN e Isapre)
MR-6  Registro en SIAPER               (transversal a MR-1, MR-2 y MR-3)
MR-7  Reportes externos obligatorios   (procesos 12, 13, 14; DIPRES, Transparencia, INE, DJ1887, LRE)

TR    Escala, grados, estamentos, calidad jurídica y componentes remuneratorios
GP    Gobernanza de plataforma — común con Presupuestos
```

### Patrón raíz propuesto

Dos raíces, y el patrón transversal se confirma por cuarta vez:

1. **`EmploymentRelationship`** — el vínculo entre una persona y el municipio, con su régimen jurídico. Raíz del ciclo de vida. Una persona puede tener vínculos sucesivos o simultáneos de distinto régimen; la persona no es la raíz, el vínculo sí.
2. **`PayrollPeriod`** — el período de nómina. Gobierna **qué se puede liquidar y hasta cuándo**, y su cierre marca el fin de la ventana de correcciones antes de la reliquidación.

**Patrón transversal confirmado.** `BudgetExercise`, `AccountingPeriod`, `CashierSession` y ahora `PayrollPeriod`: cuatro módulos, cuatro entidades cuya única función es gobernar la ventana de mutabilidad de los hechos. Refuerza la propuesta de elevarlo a decisión transversal de arquitectura (T-3).

### Entidades preliminares candidatas

**Persona y vínculo:** `Person`, `EmploymentRelationship`, `LegalRegime` (planta / contrata / honorarios / Código del Trabajo), `Position`, `StaffingQuota` (cupo de dotación), `Grade`, `SalaryScale`, `ScaleLine`, `Statement` (estamento), `JobFamily`

**Antecedentes:** `RequiredDocument`, `SwornStatement` (declaración jurada del art. 12), `AlimonyDebtorCheck` (Registro Nacional de Deudores), `AcademicRecord`

**Concurso:** `Competition`, `CompetitionBases`, `Applicant`, `SelectionCommittee`, `CompetitionResult`

**Tiempo:** `LeaveRequest`, `LeaveBalance`, `MedicalLeave`, `SubsidyRecovery`, `OvertimeResolution`, `OvertimeBalance`, `Substitution`, `Assignment` (cometido), `ServiceCommission`, `PerDiem` (viático)

**Desarrollo:** `PerformanceReview`, `PreQualification`, `QualifyingBoard`, `Appeal`, `MeritRecord`, `TrainingNeed`, `AnnualTrainingPlan`, `TrainingActivity`, `TrainingCertificate`

**Nómina:** `PayrollPeriod`, `PayrollRun`, `Payslip`, `PayslipLine`, `SalaryRule`, `SalaryComponent` (con imputación y fuente legal), `SupplementaryPayroll`, `FeePayment`, `ActivityReport` (informe de honorarios), `JudicialGarnishment` (retención judicial), `SocialSecurityPayment`, `PayrollCalendar`

**Reporte:** `RegulatorySubmission` (DIPRES, INE, Transparencia), `AnnualTaxStatement` (DJ1887), `ElectronicPayrollBook` (LRE), `SiaperRegistration`

---

## 6. Contratos inter-módulo

| Contrapartida | Dirección | Contenido | Criticidad |
|---|---|---|---|
| **Presupuestos** | Pres → RRHH | **Consulta de disponibilidad presupuestaria, bloqueante**, en incorporación, cometidos y programación de horas extras | **Crítica — contrato no previsto en el plan de Presupuestos** |
| **Presupuestos** | Pres → RRHH | **CDP para gasto en personal** (cometidos y comisiones de servicio) | **Alta — amplía el alcance del CDP** |
| **Presupuestos** | RRHH → Pres | Dotación, costo proyectado por imputación, jubilaciones y concursos previstos, para la formulación (26.2.4) | **Alta** |
| **Presupuestos** | RRHH → Pres | **Plan anual de capacitación**, anexo del proyecto de presupuesto (Ley 20.742) | Media-alta |
| **Presupuestos / Tesorería** | Bidireccional | Bases de cálculo de los límites del 42% y del 20% | **Alta** |
| **Contabilidad** | RRHH → Cont | Asiento de nómina y honorarios, por mapeo de componente remuneratorio × régimen jurídico | **Alta** |
| **Contabilidad** | RRHH → Cont | **Devengo del derecho a recuperar subsidios** de incapacidad laboral | Media-alta |
| **Contabilidad / Control** | RRHH → Cont | Estado de cotizaciones previsionales y de perfeccionamiento docente, para el informe trimestral del art. 29 d) LOCM | Alta (obligación legal) |
| **Tesorería** | RRHH → Tes | Decretos de pago de nómina, honorarios y previsionales | **Alta** |
| **Tesorería** | Tes → RRHH | Percepción de subsidios recuperados | Media |
| **Adquisiciones** | RRHH → Adq | Contratación de proveedores de capacitación vía Mercado Público | Media |
| **SIAPER (CGR)** | RRHH → externo | Registro de actos de personal | **Alta, condicionada a R-2** |
| **DIPRES** | RRHH → externo | Nómina mensual con remuneraciones pagadas y fuente de financiamiento | Alta (obligación legal) |
| **INE** | RRHH → externo | Encuesta mensual de remuneraciones | Alta (obligación legal) |
| **Transparencia activa** | RRHH → externo | Plantillas por régimen | Alta (obligación legal) |
| **Previred** | RRHH → externo | Nómina previsional, con plazo horario y doble firma | **Alta y con plazo duro** |
| **COMPIN / Isapre** | Bidireccional | Tramitación de licencias y recuperación de subsidios | Alta |
| **Registro Nacional de Deudores de Pensiones de Alimentos** | RRHH → externo | Consulta obligatoria previa a contratación a honorarios | Media-alta |
| **DocDigital** | RRHH → externo | Decretos y resoluciones de personal | Alta |

**Observación.** Es el módulo con más contrapartes externas del corpus: siete integraciones obligatorias con organismos del Estado, más DocDigital. La superficie de integración es mayor que la de Adquisiciones.

---

## 7. Plan por fases

### F0 — Cierre de decisiones estructurales · 1–2 semanas

| Entregable | Detalle |
|---|---|
| **Contratos con Presupuestos** | R-1: especificar la consulta de disponibilidad bloqueante y el CDP de personal. Requiere abrir el plan de Presupuestos, que no los contempla |
| Verificación de SIAPER | R-2: existencia de interfaz máquina a máquina. Bloquea MR-6 |
| Unificación de calidad jurídica | R-4: resolver la doble vía del as-is antes de fijar el modelo |
| Patrón de doble raíz | Confirmación de `EmploymentRelationship` / `PayrollPeriod` |

### F1 — Levantamiento normativo · 3 semanas

Es la fase más larga del corpus: cuatro estatutos concurrentes y siete integraciones obligatorias.

| Entregable | Detalle |
|---|---|
| Ficha normativa por régimen | Ley 18.883, Ley 19.070, Ley 19.378 y Código del Trabajo, con sus componentes remuneratorios y reglas propias |
| **Catálogo de componentes remuneratorios** | Desde el cuadro de SUBDERE: concepto → imputación → fuente legal, con la marca de componentes **extrapresupuestarios** que se excluyen de las bases de cálculo |
| **Verificación de citas del proceso 6** | R-3: estatuto, periodo de calificación y dictamen |
| Especificación de los tres reportes externos | Formato, canal, plazo y acuse de DIPRES, Transparencia e INE |
| Obligatoriedad del LRE | R-5: determinar si aplica a municipalidades y con qué alcance |
| Régimen de retenciones judiciales | R-6 |

### F2 — Levantamiento de procesos faltantes · 2 semanas

| Entregable | Detalle |
|---|---|
| BPMN — Recuperación de subsidios | Proceso 18 descompuesto: devengo del derecho, cobranza, percepción, conciliación |
| BPMN — Controles de admisibilidad | Cupo y disponibilidad presupuestaria como pasos formales, hoy implícitos |
| BPMN — Registro en SIAPER | Transversal, condicionado a R-2 |
| BPMN — Reportes externos | Los tres mensuales más DJ1887 |
| **Reclasificación con la lente de expediente sin efecto de dominio** | Aplicar la categoría de §3.2.1 del plan de Contabilidad a los procedimientos TUPA del módulo |
| Validación con municipios piloto | Contraste con al menos dos municipios |

### F3 — Fichas de proceso por etapa · 4 semanas

Es el módulo con más etapas del corpus.

| Macroproceso | Etapas estimadas |
|---|---|
| MR-1 Ciclo de vida contractual | 8 (solicitud → cupo → disponibilidad presupuestaria → antecedentes → concurso, si aplica → nombramiento → decreto → desvinculación o renuncia) |
| MR-2 Gestión del tiempo | 6 (permisos → licencias → HE con resolución → cometidos → comisiones → subrogación) |
| MR-3 Desarrollo y evaluación | 5 (plan de evaluación → precalificación → Junta → apelación → plan anual de capacitación) |
| MR-4 Nómina y liquidación | 6 (apertura de período → cálculo → reliquidación → honorarios → previsionales → archivo bancario) |
| MR-5 Recuperación de subsidios | 3 |
| MR-6 SIAPER | 2 |
| MR-7 Reportes externos | 5 |

### F4 — Modelo de datos y contratos · 3 semanas

| Entregable | Detalle |
|---|---|
| Modelo de entidades consolidado | Con **calidad jurídica unificada** (R-4) y componentes remuneratorios con fuente legal |
| Máquinas de estado | Vínculo, período de nómina, liquidación, resolución de HE, licencia, calificación, concurso |
| Contratos de API inter-módulo | Los diecinueve de §6, versionados |
| **Contratos con Presupuestos** | Consulta de disponibilidad y CDP de personal, resultado de R-1 |

### F5 — Transversales, wireframes y consolidación · 2 semanas

| Entregable | Detalle |
|---|---|
| **Especificación de protección de datos** | **Es el módulo más sensible del corpus bajo Ley 21.719**: datos de salud en licencias médicas, datos familiares, evaluaciones de desempeño, remuneraciones individuales. Catálogo de datos personales por entidad con finalidad declarada, minimización en contratos, y control de acceso por finalidad |
| Especificación de seguridad | SoD: quien precalifica no califica; la Junta Calificadora tiene composición legal; **doble firma de cuentadantes en el pago previsional** |
| Especificación de escalabilidad | La liquidación mensual es el proceso batch más pesado del sistema; los reportes externos son mensuales y concurrentes |
| Marcado del núcleo no diferible | Nómina, ciclo contractual y bases de cálculo del 42% y 20% son núcleo; méritos, viáticos y capacitación admiten diferimiento con condición de salida |
| Wireframes SVG | Ficha del funcionario, liquidación, resolución de HE, expediente de concurso |

---

## 8. Pendientes abiertos

| ID | Pendiente | Bloquea | Responsable |
|---|---|---|---|
| **R-1** | Contratos con Presupuestos: consulta de disponibilidad bloqueante en contratación y CDP para gasto en personal. **Obliga a abrir el plan de Presupuestos** | **F0 / F4** | Equipo + DM |
| **R-2** | Verificar interfaz máquina a máquina de SIAPER | **F0 / MR-6** | Equipo + CGR |
| **R-3** | Verificar estatuto, periodo de calificación y dictamen del proceso 6 | F1 / MR-3 | Equipo interno |
| **R-4** | Unificar la doble vía de calidad jurídica del as-is | F0 / F4 | Equipo interno |
| **R-5** | Obligatoriedad y alcance del Libro de Remuneraciones Electrónico para municipalidades | F1 | DM + Jurídica |
| **R-6** | Régimen de retenciones judiciales: origen, control y efecto en la liquidación | F1 | DM + Jurídica |
| **R-7** | Ciclo de recuperación de subsidios: quién persigue la cobranza, en qué plazo, y qué ocurre con los no recuperados | F2 | DM + Tesorería |
| **R-8** | Calendario de nómina parametrizable por municipio y por mes | F3 | DM |
| **R-9** | Informe de actividades como condición de pago de honorarios: formato, aprobador y efecto del rechazo | F3 | DM |
| **R-10** | Composición y funcionamiento de la Junta Calificadora en municipios con planta reducida | F3 | DM |
| **R-11** | Integración con el Registro Nacional de Deudores de Pensiones de Alimentos: mecanismo y efecto de la consulta | F1 | Equipo + DM |
| **R-12** | Control de cupo de dotación: fuente de la dotación autorizada y su relación con el presupuesto | F2 | DM |
| **R-13** | Momento de evaluación de los límites del 42% y del 20%: solo formulación, o también al contratar. Espejo de P-10 | F3 | DM + Presupuestos |
| **R-14** | Tratamiento de los cuatro regímenes en el modelo: ¿una entidad con variantes o cuatro subtipos? | F4 | Equipo interno |

---

## 9. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Los controles de admisibilidad no se especifican** | **Alto — es la brecha central del módulo: el as-is calcula bien pero no valida si el municipio puede contratar** | R-1, R-12 y R-13 resueltos antes de F3 |
| **El plan de Presupuestos no contempla el contrato con RRHH** | **Alto — hay que reabrirlo** | R-1 en F0; actualizar §6 del plan de Presupuestos |
| SIAPER sin interfaz verificada | Alto — seis procesos quedan incompletos | R-2 en F0; vía alternativa de registro asistido |
| Cuatro estatutos concurrentes tratados como variantes menores | Alto — cada uno tiene componentes y reglas propias | F1 extendida a tres semanas; catálogo por régimen |
| Citas normativas del levantamiento tomadas sin verificar | Medio-alto — dos errores confirmados en el proceso 6 | R-3 en F1; criterio metodológico ya adoptado |
| **Datos personales sensibles sin tratamiento específico** | **Alto — datos de salud, familiares y remuneraciones individuales bajo Ley 21.719** | Especificación de protección de datos en F5, con catálogo por entidad |
| Volumen de integraciones externas subestimado | Medio-alto — siete organismos del Estado más DocDigital | Inventario de integraciones como entregable de F1 |
| La doble vía de calidad jurídica se hereda | Medio — dos catálogos para el mismo concepto | R-4 en F0, antes de fijar el modelo |

---

## 10. Criterios de término del módulo

1. Ningún vínculo laboral puede crearse sin verificación de cupo y de disponibilidad presupuestaria, ambas impuestas por el motor.
2. Los límites del 42% y del 20% son validadores con base de cálculo declarada, excluyendo los componentes extrapresupuestarios.
3. Ninguna hora extraordinaria se liquida sin resolución previa vigente que individualice persona, cantidad y mes.
4. Cada componente remuneratorio declara su imputación presupuestaria y su fuente legal.
5. Los cuatro regímenes jurídicos están modelados con sus reglas propias, sin colapsarlos en un caso general con excepciones.
6. Existe una sola entidad de calidad jurídica.
7. El período de nómina gobierna la mutabilidad de las liquidaciones, con el mismo comportamiento que el período contable, el ejercicio presupuestario y la sesión de caja.
8. Los tres reportes externos mensuales tienen formato, canal, plazo y acuse especificados.
9. El pago previsional respeta el plazo horario y exige doble firma, ambos verificados por el motor.
10. Todo dato personal del módulo está catalogado con su finalidad, y el acceso se controla por finalidad y no solo por rol.
11. El derecho a recuperar subsidios se devenga y se persigue como ciclo propio, no como nota administrativa.

---

## 11. Advertencias sobre este documento

1. **El proceso 6 contiene dos errores de cita.** Estatuto mal identificado y dos periodos de calificación contradictorios dentro del mismo proceso. Nada de ese proceso debe convertirse en validador antes de R-3.
2. **El contrato con Presupuestos es un hallazgo, no una decisión.** La disponibilidad presupuestaria como precondición bloqueante de la contratación aparece en cinco procesos del levantamiento y no está en el plan de Presupuestos. Obliga a reabrir aquel documento, no solo a anotarlo aquí.
3. **SIAPER se trata como integración por decisión, no por evidencia.** No está verificado que exista interfaz máquina a máquina. Toda la especificación de MR-6 es condicional.
4. **La obligatoriedad del LRE para municipalidades no está verificada.** El as-is tiene un wizard de exportación, lo que sugiere que aplica, pero eso no es fundamento suficiente.
5. **Los componentes remuneratorios de los cuatro estatutos se apoyan en el cuadro de SUBDERE**, que es un artefacto operativo y no una norma. Cada componente conserva su fuente legal citada en ese cuadro, y esas citas tampoco han sido verificadas una por una.