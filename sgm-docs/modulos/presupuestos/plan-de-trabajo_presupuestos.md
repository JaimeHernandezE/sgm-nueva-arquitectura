# Plan de trabajo — Módulo Presupuestos

**Proyecto:** SGM — Sistema de Gestión Municipal
**Módulo:** Presupuestos
**Versión:** 0.14 (borrador para revisión interna)
**Fecha:** agosto 2026
**Estado:** propuesta de plan, no validado con DM

**Gobierno del corpus:** [`../../plan-general.md`](../../plan-general.md). Criterios de calidad comunes: plan general §7. Decisiones transversales: plan general §4.

**Cambios v0.14:** nueva decisión **D-6 — la autoridad de imputación reside en el CDP, no en la SOLPED**, a raíz de una solicitud de DM de incorporar campos de programa, proyecto y actividad en la solicitud de pedido. La SOLPED **espeja** la estructura de imputación del CDP de forma completa, opcional y no vinculante; la resolución definitiva la toma la DAF al certificar disponibilidad. Fundamento de segregación de funciones (*quien solicita no imputa*) antes que de usabilidad. Consecuencias en §6 (contrato Adq↔Presupuestos), F2 (paso de clasificación explícito), §11 (criterio 16) y §10 (riesgo de cuello de botella en la DAF). **P-23 se replantea por tercera vez**: el mapeo unidad → nodo pasa de filtro a pre-sugerencia. Nuevo **P-28** (validación con DM). Los tres campos independientes solicitados no se incorporan: son niveles de un árbol, no dimensiones (§5.3, D-5).

**Cambios v0.13:** incorporados **Villarrica, Cochamó y Quilaco** — con Las Cabras y María Pinto, **los cinco municipios en convenio**. Cierra el entregable de base de evidencia de F1. **Dos correcciones a v0.12** (§5.3, Anexo A.6): las cuentas `MATRIZ` con presupuesto **no son una anomalía** —son el nodo agregado que lleva el subtotal, 241 de 241 cuadran en Villarrica—, y la convención de codificación del programa **varía por municipio** (dos codifican el área en el primer dígito sin colisiones; dos usan secuencia por área). Hallazgos nuevos: la **semántica del nivel `programa` no es homogénea** —en Villarrica es el organigrama— lo que reabre P-23; `Centro de Costo` está **vacío en las tres plantillas de migración**; el eje de gestión **no aplica a ingresos** (0 de 840 filas); y las **cuentas analíticas mapean cada cuenta presupuestaria a sus contracuentas de devengo y pago**, que es el mecanismo concreto del devengo dual de D-1 (nueva §5.4). Nuevos P-26, P-27.

**Cambios v0.12:** inspección de **planes de cuentas y presupuestos por área de gestión 2026 de Las Cabras y María Pinto** (cuatro planillas, dos municipios). Tres consecuencias estructurales: (1) el **eje de gestión tiene cinco niveles** —Área › Programa › Subprograma › **Proyecto** › **Actividad**—, no tres; se adopta **D-5** (árbol recursivo con profundidad variable, no columnas fijas). (2) **`Project` del eje de gestión no es `InvestmentInitiative` del ST 31**: se modelan desacoplados con vínculo opcional (§5.3). (3) El plan de cuentas municipal tiene un **sexto nivel de apertura local que diverge entre municipios**, y atributos operativos (MATRIZ/DETALLE, analítico, actúa presupuesto) que ninguna fuente normativa entrega — nuevo **Anexo A.6**, cuarta capa en A.1. Nuevos P-21…P-25.

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
| D-5 | **Estructura del eje de gestión** | El eje de gestión tiene **cinco niveles** —Área de gestión › Programa › Subprograma › Proyecto › Actividad— y se modela como **árbol recursivo con nivel tipado y profundidad variable por rama** (`ManagementNode`), no como cinco columnas fijas. El área es catálogo nacional (seis valores); los cuatro niveles inferiores los define cada municipio. Solo los nodos hoja admiten imputación. El nivel `PROJECT` del eje de gestión **no** es la iniciativa de inversión del subtítulo 31: son entidades distintas con vínculo opcional. Ver §5.3. |
| D-6 | **Momento y autoridad de la imputación** | La **imputación presupuestaria —cuenta × nodo de gestión— se resuelve en el CDP**, no en la SOLPED. Es la DAF quien la determina, en ejercicio de su competencia funcional (art. 27 LOCM) y porque la imputación errónea tiene consecuencia ante Contraloría. La SOLPED **espeja la misma estructura de imputación** de forma completa, opcional y **no vinculante**: quien sepa usarla la usará bien y aporta contexto; quien no, no queda bloqueado. No existe un vocabulario de clasificación propio de la SOLPED. Ver consecuencia abajo y **P-28**. |

### Consecuencia inmediata de D-1

Adquisiciones ya declaró la entidad `BudgetPreCommitment` en su modelo preliminar de 14 entidades. Con D-1, esa entidad **pertenece a Presupuestos** y Adquisiciones la referencia por contrato, no la posee.

> **PENDIENTE P-1:** Reconciliar el modelo de Adquisiciones para que `BudgetPreCommitment` pase a ser referencia externa. Revisar también si `ProcurementCase` guarda estado presupuestario que debiera ser proyección de solo lectura.

### Consecuencia inmediata de D-4

1. **Cambio respecto del as-is:** `approval_resolution` (Char con secuencia interna en Odoo) **deja de ser el identificador oficial** del decreto. Se conserva, si aplica, como trazabilidad interna; el folio oficial es `ExternalFolio` asignado por DocDigital (o folio interno solo en vía alternativa — P-18 / X-73).
2. **Estado de espera:** la transición post-decreto (promulgación → apertura; modificación → registro) pasa por `pending_signature` hasta el retorno del acto firmado (`AdministrativeActSigned` / `DocumentProcedureCompleted`).
3. **Entidades:** `DecreeSignatureChain` (candidata v0.2–v0.9) se alinea a `SignatureChain` de plataforma; el acto se modela como `AdministrativeAct` (o equivalente presupuestario) con `DocumentProcedure`.
4. **Contingencia:** municipios sin DocDigital y latencia ante plazos legales (15 dic, 10 días art. 29 c) — P-18, P-20; mismo patrón que §5.1.

### Consecuencia inmediata de D-5

1. Las entidades `Program`, `Subprogram` y `CostCenter` de la lista transversal de v≤0.11 quedan **superadas**: se reemplazan por `ManagementArea` (catálogo nacional) + `ManagementNode` (árbol local) + `OrganizationalUnit` (dimensión opcional, P-23).
2. El contrato de reporte BEP (§6.1) exige columnas fijas por área. Con profundidad variable, el sistema **debe** exponer una vista aplanada con regla de relleno única y explícita, definida en las bases y no por el proveedor (P-22).
3. `InvestmentInitiative` (§5.2) conserva su identidad propia —Código Municipal perpetuo y Código INI— y **no** se fusiona con el nivel `PROJECT`. La colisión de nombres es real: el ítem `31.02` del clasificador se llama "Proyectos" y la posición 7 del Código INI codifica "tipo de iniciativa". Ver riesgo asociado en §10.

### Consecuencia inmediata de D-6

**Origen.** DM solicitó incorporar campos de `programa`, `proyecto` y `actividad` en la SOLPED, como tres selectores independientes filtrados por la unidad de destino. La solicitud no se implementa en esos términos, por tres razones que la evidencia de los cinco municipios ya había establecido (§5.3):

1. Los tres no son dimensiones independientes sino **niveles de un mismo árbol** (D-5). Tres selectores permiten combinaciones que no existen y que el modelo no puede validar.
2. La propuesta **omite el área de gestión**, que es el único nivel con catálogo nacional, el único que el BEP reporta y el único que los cinco municipios tienen — Cochamó usa un área, un programa y ningún subprograma.
3. Filtrar por unidad organizacional **es circular**: `Centro de Costo` está vacío en las 4.919 filas de las plantillas de migración, `OrganizationalUnit` es un pendiente abierto (P-23), y en Villarrica el programa *es* la unidad organizacional.

**Lo que se adopta en su lugar.**

1. **Un solo campo, no tres.** La referencia es a un **nodo hoja** del árbol de gestión (`management_node_id`), del que el path completo —área › programa › subprograma › proyecto › actividad— es derivado. Soporta profundidad variable sin campos vacíos y hace imposible por construcción una combinación inconsistente.
2. **La SOLPED espeja el CDP.** Los campos de imputación de la SOLPED son los mismos que el CDP debe especificar, con prefijo o marca de **propuesta**: no hay estructura de clasificación exclusiva de Adquisiciones.
3. **Opcionales y no bloqueantes.** Ninguna regla `MISSING_REQUIRED_FIELD`. Lo que sí se valida es la **forma**, no el criterio: si se envía un valor, debe ser un nodo hoja vigente y una cuenta `DETALLE` del ejercicio. El criterio lo evalúa la DAF en el CDP.
4. **La divergencia entre lo propuesto y lo resuelto se conserva.** Cuando el CDP imputa a un nodo distinto del propuesto en la SOLPED, la diferencia queda registrada. No es un error a corregir: es la señal que alimenta la pre-sugerencia de P-23.
5. **Contexto no clasificatorio.** La SOLPED conserva un campo de propósito en texto libre. Sin él, sacar la clasificación deja a la DAF imputando a ciegas, con el resultado previsible de que todo termine en Gestión Interna.

> **Riesgo aceptado.** Cada SOLPED pasa a requerir una acción de clasificación de la DAF antes del CDP. En municipios con equipos de finanzas de tres personas eso es throughput real. La mitigación es la pre-sugerencia de P-23, no relajar la segregación.

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
| **Eje de gestión completo (5 niveles)** | No | Parcial: área, centro de costo, programa/subprograma en distribución; sin proyecto ni actividad | **D-5: árbol recursivo `ManagementNode`; regla de aplanamiento para BEP (P-21, P-22)** |
| **Unidad organizacional responsable del gasto** | No | Parcial: campo `centro de costo` presente en el ORM y en la plantilla de migración, **vacío en las 4.919 filas de los tres municipios con plantilla**. En Villarrica la información existe, pero codificada dentro del árbol de gestión | **Caso de "campo presente ≠ uso funcional". `OrganizationalUnit` alimentable por captura o por derivación desde el árbol (P-23, P-27)** |
| **Vigencia temporal del árbol de gestión** | No | No | **Los municipios embeben el año en el nombre del nodo. Arrastre y cierre entre ejercicios sin cobertura (P-24)** |
| **Correspondencia cuenta presupuestaria → contracuentas contables** | No | No como catálogo; el asiento se resuelve en el puente | **Los municipios ya la mantienen como tabla de datos, indexada por (ejercicio, área, cuenta). Es el mecanismo del devengo dual de D-1 (§5.4, P-26)** |
| **Atributos operativos del plan de cuentas local** (MATRIZ/DETALLE, analítico, actúa presupuesto) | No | Parcial: jerarquía de cuentas sin tipificación explícita de imputabilidad | **Invariante "solo DETALLE es imputable" sin fuente normativa identificada (P-25, Anexo A.6)** |

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

**Transversal:** `BudgetClassifier` (catálogo nacional versionado, subtítulo/ítem/asignación/subasignación; atributos por cuenta: `requires_council_agreement`, aplicabilidad por sector municipal/educación/salud/cementerio, área de gestión, estado nueva/no usar, oficio de creación — ver §4.1 y Anexo A.5), **`BudgetAccount`** *(plan de cuentas local del municipio; extiende el clasificador con el sexto nivel de apertura y los atributos operativos — Anexo A.6)*, `NormativeParameter` (compartido con Adquisiciones)

**Eje de gestión (D-5, §5.3):** `ManagementArea` (catálogo nacional, seis valores), **`ManagementNode`** (árbol recursivo local: `PROGRAM` / `SUBPROGRAM` / `PROJECT` / `ACTIVITY`), **`OrganizationalUnit`** *(dimensión opcional — P-23)*. Reemplazan a `Program`, `Subprogram` y `CostCenter` de v≤0.11

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

### 5.3 Eje de gestión: cinco niveles, árbol recursivo

Base de evidencia: planes de cuentas y presupuestos por área de gestión 2026 de **Las Cabras** (260 líneas de gasto, 228 cuentas de ingreso) y **María Pinto** (620 líneas), inspeccionados en v0.12.

#### Dos clasificaciones ortogonales, no una

Una línea presupuestaria es la **intersección** de dos ejes independientes más la cadena de estados:

| Eje | Pregunta | Autoridad | Mutabilidad |
|---|---|---|---|
| Clasificador / plan de cuentas | ¿Qué se gasta? | Hacienda (DS 854) + CGR (plan de cuentas) + municipio (6º nivel) | Nacional versionado + apertura local |
| **Gestión** | ¿Para qué se gasta? | Área: nacional (seis). Resto: municipio | Local, versionado por ejercicio |
| Ejecución | ¿En qué estado está? | CGR | Estados fijos |

**La cuenta por sí sola no identifica una línea presupuestaria.** En Las Cabras, **24 de 139 cuentas de gasto aparecen en más de una combinación del eje de gestión**. El caso extremo es `215-22-04-999` (Otros materiales), presente en cinco combinaciones: Gestión Interna ($4M), Servicios Comunitarios ($6M), Programa Medio Ambiental ($1M), Mantención de Caminos y Alumbrado ($50M) y Obras Menores ($25M). La clave de `BudgetLine` es el par cuenta × nodo de gestión, no la cuenta.

#### Los cinco niveles

```
Área de gestión  →  Programa  →  Subprograma  →  Proyecto  →  Actividad
   (6 fijas)         ──────────  definidos por el municipio  ──────────
```

Las seis áreas son las mismas que exige el BEP para el gasto municipal (§6.1): Gestión Interna, Servicios Comunitarios, Actividades Municipales, Programas Sociales, Programas Deportivos y Programas Culturales.

#### Por qué árbol recursivo y no cinco columnas (D-5)

1. **La profundidad real es extremadamente variable, incluso dentro de un municipio.** En Villarrica, **219 de 224 programas no tienen ningún subprograma, y uno tiene 37**. En Las Cabras, `Gestión Interna` opera con un solo nivel efectivo mientras `Programas Sociales › Convenios` agota los tres disponibles. Cinco columnas fijas obligarían a rellenar cuatro de ellas en la inmensa mayoría de las líneas.

2. **El relleno con placeholders ya es masivo con tres niveles.** Las Cabras repite `GESTIÓN INTERNA / GESTIÓN INTERNA / GESTIÓN INTERNA` en **114 de 260 líneas**; en Quilaco **39 de 60 subprogramas son espejo exacto del nombre de su programa**; María Pinto rellena con `VARIOS` y `OTRAS`. El placeholder es la norma, no la excepción.

3. **La convención de codificación del programa varía por municipio.** *Corrige la afirmación de v0.12.* Villarrica y Quilaco **codifican el área en el primer dígito** del código de programa (área 3 → `31`, `32`, `33`…) y en ambos casos hay **cero colisiones** entre áreas: el código es único dentro del municipio. Las Cabras y María Pinto usan una **secuencia independiente por área**, donde el mismo número identifica programas distintos según el área. Es decir: no solo el contenido del árbol es local, también lo es **la semántica de su clave**. Consecuencia reforzada: surrogate ID más `materialized_path`; ninguna clave natural es interoperable entre municipios.

4. **Ningún par de municipios comparte una sola combinación del eje de gestión.** Las Cabras 53, María Pinto 62, Quilaco 49 programas, Villarrica 224. Intersección vacía en todos los pares. El árbol es data del tenant, sin excepción.

#### Los cinco municipios en convenio

| | Las Cabras | María Pinto | Quilaco | Cochamó | Villarrica |
|---|---|---|---|---|---|
| Áreas de gestión | 6 | 4 usadas | 6 | 1 usada | 6 |
| Programas | — (53 combinaciones) | — (62 combinaciones) | 49 | 1 usado | **224** |
| Subprogramas | sí | sí | 60 (65% espejo) | ninguno | 97, concentrados en 5 programas |
| Codificación del programa | secuencia por área | secuencia por área | área en 1er dígito | — | área en 1er dígito |
| Semántica del programa | mixta | objeto funcional | programa / convenio | — | **unidad organizacional** |

El rango va de **un municipio que usa un área, un programa y ningún subprograma** (Cochamó) a **uno con 224 programas** (Villarrica). Cualquier modelo que asuma una estructura mínima obligatoria más allá del área excluye a Cochamó; cualquiera que asuma profundidad fija infla Villarrica.

#### La semántica del nivel `programa` no es homogénea

Este es el hallazgo que más condiciona el modelo. El mismo nivel significa cosas distintas según el municipio:

| Municipio | Qué es un "programa" | Ejemplos |
|---|---|---|
| **Villarrica** | **La unidad organizacional** | `DEPTO. PERSONAL`, `DEPTO. TESORERÍA MUNICIPAL`, `CONTABILIDAD Y PRESUPUESTO`, `ASESORÍA JURÍDICA`, `SECRETARÍA CONCEJO`, `DEPTO. INFORMÁTICA` |
| **María Pinto** | El objeto de gasto | `VEHÍCULOS`, `PISCINA`, `PLANTAS DE TRATAMIENTO`, `FESTIVAL` |
| **Quilaco** | El programa o convenio | `FIGEM 2019`, `SIFIM`, `BECAS PARA ESTUDIANTES`, `OPERATIVO SANITARIO` |
| **Las Cabras** | Mixta | `CONVENIOS`, `PROGRAMAS DE BIENESTAR SOCIAL`, `PROGRAMA COMUNICACIONAL` |

Y en Villarrica el **subprograma es la ubicación física**: bajo `CONTABILIDAD Y PRESUPUESTO` cuelgan `OOCC-VICENTE REYES 998`, `OMIL-GENERAL KORNER 335`, `BODEGA MUNICIPAL-JUAN ANTONIO RÍOS`, `AVALUACIONES-CAMILO HENRÍQUEZ 225`. Son direcciones de inmuebles, presumiblemente para imputar servicios básicos por edificio.

**Consecuencia directa sobre P-23.** Villarrica ya usa el eje de gestión como dimensión organizacional y como dimensión de ubicación. Introducir `OrganizationalUnit` como dimensión separada **duplicaría** el dato para ese municipio, mientras que para Cochamó lo crearía desde cero. La decisión no es "¿agregamos la dimensión?" sino "¿el modelo permite que el mismo hecho se exprese en el árbol de gestión o en una dimensión propia, según el municipio?". P-23 se replantea en v0.13 con esta evidencia.

#### Invariantes

- El `level` desciende estrictamente respecto del padre; no se permiten saltos.
- **Solo los nodos hoja admiten imputación**, en paralelo exacto con la regla `DETALLE` del plan de cuentas (Anexo A.6). Es la misma invariante aplicada a los dos ejes.
- `(tenant_id, fiscal_year, materialized_path)` es único; el código local solo es único entre hermanos.

#### Colisión de nombres con el subtítulo 31

**`ManagementNode` de nivel `PROJECT` y `InvestmentInitiative` (§5.2) son entidades distintas.** El vínculo entre ambas es **opcional y unidireccional**, declarado en `BudgetLine`, no en el nodo.

La colisión es real y previsible: el ítem `31.02` del clasificador se llama *Proyectos*, la posición 7 del Código INI codifica *tipo de iniciativa* con valor `2 = Proyectos`, y el eje de gestión tendrá un nivel llamado *Proyecto*. Fusionarlas tiene dos costos concretos: acopla el eje de gestión con el clasificador solo para el ST 31, y obliga a arrastrar identificación SNI en líneas que no son de inversión (un *Programa de Turismo* no es una iniciativa de inversión). La decisión de v0.12 es mantenerlas separadas.

> Un nodo `PROJECT` **puede** corresponder a una iniciativa con Código INI. Cuando ocurre, la relación se declara y el sistema valida la coherencia; cuando no ocurre, no se exige nada.

#### Aplanamiento para reportes normativos

El BEP y los informes CGR esperan columnas fijas por área. Con profundidad variable, la vista aplanada debe:

1. Proyectar `materialized_path` sobre los cinco niveles.
2. Rellenar los niveles no utilizados con una **regla única y explícita**, fijada en las bases.
3. No dejar que el proveedor la invente. Hoy cada sistema municipal resuelve esto distinto —Las Cabras replica el nombre del padre, María Pinto usa `VARIOS`— y esa divergencia es exactamente lo que el SGM debe eliminar.

Ver P-22.

#### Vigencia temporal: el árbol cambia todos los años

En Las Cabras el ejercicio está embebido en el **nombre** del nodo porque el modelo carece de dimensión temporal: `VINCULO ACOMP. VERSION 18`, `VINCULOS ACOMPAÑAMIENTO 19`, `CONVENIO HABITABILIDAD 2024`. Los identificadores bajo `Convenios` van 2, 8, 9, 12, 13, 14, 16, 19, 31, 32, 33, 34, 36 — numeración con huecos, síntoma de acumulación sin depuración.

El módulo debe soportar apertura de ejercicio con **arrastre selectivo, cierre de nodos y trazabilidad** (`superseded_by`), y el caso borde de nodos cerrados con saldo devengado pendiente de pago. Ver P-24. Sin esto, el SGM hereda el problema desde el primer ejercicio.

#### `Centro de Costo`: el campo existe y nadie lo llena

Las plantillas de migración de Quilaco, Cochamó y Villarrica traen la columna `Centro de Costo` en primera posición, junto a `Área de Gestión`, `Programa` y `SubPrograma`. Está **vacía en las 4.919 filas de las cuatro planillas inspeccionadas**, sin una sola excepción.

| Plantilla | Filas | `Centro de Costo` poblado | `Área de Gestión` poblada |
|---|---|---|---|
| Quilaco | 635 | **0** | 455 |
| Cochamó | 259 | **0** | 259 |
| Villarrica (MIGRAR) | 2.182 | **0** | 1.023 |
| Villarrica (PPTO DETALLADO) | 1.843 | **0** | 1.513 |

Odoo declara el campo en la distribución de ficha (§3.2) y la plantilla de migración lo expone. Ninguno de los tres municipios lo alimenta. Es el caso más limpio del criterio *campo presente ≠ uso funcional* que aparece en el corpus: la existencia del campo en el ORM y en el importador no acredita nada sobre la práctica.

La responsabilidad organizacional existe, pero **está codificada dentro del árbol de gestión** —explícitamente en Villarrica, implícitamente en María Pinto— y no en una dimensión propia. Ver P-23 replanteado.

#### El eje de gestión no aplica a los ingresos

De las **840 filas de ingreso** (cuentas `115`) presentes en las tres plantillas de migración, **ninguna** lleva área, programa ni subprograma. Todas las filas con eje de gestión poblado son cuentas `215`.

Esto es consistente con el BEP —que desagrega por área solo el gasto municipal (§6.1)— y con el Manual de Imputaciones, cuya hoja de ingresos no tiene marca de área. **Es una regla del modelo, no una omisión de los municipios:** `BudgetLine` de ingreso no tiene `management_node_id`. Debe quedar como invariante verificable, no como convención.

### 5.4 Cuentas analíticas y contracuentas: el mecanismo del devengo dual

Hallazgo de v0.13, sin cobertura previa en el plan. Villarrica, Quilaco y Cochamó mantienen un artefacto llamado **cuenta analítica**, con una estructura común a los tres:

| Columna | Contenido |
|---|---|
| `Código completo` | Código concatenado sin separadores (`1150301001001003`) |
| `Título` · `Grupo` · `Subgrupo` | Descomposición contable: `1` / `11` / `115` |
| `Nivel 1` … `Nivel 5` | Subtítulo · Ítem · Asignación · Subasignación · **apertura local** |
| **`Cuenta de Egreso Devengado`** | Contracuenta contable del devengo |
| **`Cuenta de Egreso Pagado`** | Contracuenta contable del pago |
| **`Contracuenta`** · **`Cuenta de arrastre`** | Contrapartida y cuenta de traspaso al ejercicio siguiente |

Dos consecuencias de peso:

**1. Confirma la descomposición de ocho niveles del código.** La cuenta analítica hace explícito lo que el Anexo A.6 infiere del código formateado: `Título › Grupo › Subgrupo › Nivel 1…5`, donde los niveles 1 a 4 son el clasificador nacional y el **nivel 5 es la apertura local**. Es la estructura que `BudgetAccount` debe reproducir.

**2. El asiento contable que origina un movimiento presupuestario está determinado por una tabla de datos, no por lógica.** Cada cuenta presupuestaria declara sus contracuentas de devengo y pago. Ejemplo de Quilaco: `115-08-03-003-001-902 FONDOS FET` → devengado `46103`, pagado `1110201`.

Villarrica lo lleva un paso más allá: su tabla `cuentas_comprobantes` (1.009 filas) tiene por clave **(ejercicio, área de gestión, cuenta presupuestaria)** y devuelve `Cta_Devengado`, `Cta_Pagado` y `Cta_Devengado_activo_fijo`. **La contracuenta depende también del área de gestión**, no solo de la cuenta.

Esto es directamente relevante para **D-1 y P-6**: el "devengo dual" —efecto presupuestario en Presupuestos, efecto patrimonial en Contabilidad— no es una abstracción a diseñar desde cero. Los municipios ya lo resuelven con una **tabla de correspondencia configurable**, versionada por ejercicio, que es exactamente la forma que debe tomar el contrato Presupuestos → Contabilidad. Ver **P-26**.

> **Cobertura desigual.** Solo 17 de 82 cuentas analíticas de Quilaco y 25 de 204 de Villarrica traen contracuenta poblada; Cochamó ninguna, y su archivo se titula literalmente *"cuenta analítica **no oficiales**"*. La tabla existe como mecanismo pero está incompleta, y su gobernanza —quién la mantiene y contra qué norma— no está establecida.

---

## 6. Contratos inter-módulo

Insumo para la especificación de independencia modular. Cada uno es un contrato versionado de entrada/salida.

| Contrapartida | Dirección | Contenido | Criticidad |
|---|---|---|---|
| **Adquisiciones** | Presupuestos → Adq | Consulta de disponibilidad; emisión y estado de CDP **con la imputación resuelta** (cuenta × nodo de gestión); preobligación asociada a SOLPED. Adquisiciones la recibe como **proyección de solo lectura** en `ProcurementCase` (D-6, P-1) | **Alta** — costura principal del sistema |
| **Adquisiciones** | Adq → Presupuestos | Solicitud de CDP con monto, SOLPED y —opcionalmente— **imputación propuesta no vinculante**; evento de resolución de compra que dispara obligación | Alta |
| **Adquisiciones** | Presupuestos → Adq | Catálogo de nodos de gestión hoja del ejercicio (`listManagementNodes`), cacheado, para poblar los campos opcionales de la SOLPED. Un solo endpoint jerárquico, no uno por nivel (D-6) | Media |
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

**Precisión de v0.12.** El BEP reporta solo el **nivel superior** del eje de gestión (las seis áreas). Los cuatro niveles inferiores —programa, subprograma, proyecto, actividad— existen en el presupuesto municipal y son la unidad real de imputación, pero **no se reportan**. El contrato de reporte es, por tanto, el piso del modelo de ejecución en las magnitudes (§6.1) pero **no** en la dimensionalidad del eje de gestión: especificar solo lo que el BEP exige dejaría al módulo incapaz de sostener la imputación que los municipios ya practican. Ver §5.3 y P-21.

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
| **Especificación del eje de gestión** | `ManagementArea` + `ManagementNode` según D-5: niveles, invariantes, regla de aplanamiento para BEP e informes CGR, y separación explícita respecto de `InvestmentInitiative` (§5.3; P-21, P-22) |
| **Especificación del plan de cuentas local** | `BudgetAccount` como entidad del tenant: sexto nivel de apertura, atributos operativos y su origen, invariante de imputabilidad (Anexo A.6; P-25) |
| ~~**Ampliación de la base de evidencia municipal**~~ | **Cumplido en v0.13.** Los cinco municipios en convenio inspeccionados: Las Cabras, María Pinto, Villarrica, Cochamó y Quilaco. Resultados en §5.3, §5.4 y Anexo A.6 |

### F2 — Levantamiento de procesos faltantes · 3 semanas

Recuperar como procesos formales lo que hoy solo existe como caja no descompuesta, como comportamiento de Odoo, o como práctica municipal no documentada.

| Entregable | Detalle |
|---|---|
| BPMN — Ejecución presupuestaria | Cadena CDP → preobligación → obligación → devengo. Descompone la caja `Ejecutar` del proceso 26. Matriz de doble pool. **Incluye el paso explícito de clasificación por la DAF previo a la emisión del CDP (D-6), hoy inexistente como actividad formal**, y el tratamiento de la imputación propuesta en la SOLPED cuando difiere de la resuelta |
| **BPMN — Apertura del ejercicio** | Descompone `Registrar` (26.2.8): generación de disponibilidad, traspaso a ingresos por percibir y Deuda Flotante, saldos patrimoniales. Validar con Contabilidad |
| BPMN — Examen trimestral, déficit y reportes de Control | Art. 81 más art. 29 letras c) y d) LOCM, incluido el plazo de 10 días con escalamiento a CGR. Descompone `Controlar y Evaluar` (26.2.10). Validar con Control |
| BPMN — Programación de caja | Derivado de `budget.cash.flow` más práctica municipal |
| BPMN — Salud y Educación | Ciclo separado y consolidación |
| **Contrato de contracuentas con Contabilidad** | Tabla cuenta presupuestaria (× área × ejercicio) → contracuentas de devengo, pago y activo fijo. Se levanta junto con la apertura del ejercicio; contraste contra el Manual de Procedimientos Contables NICSP (P-26) |
| **BPMN — Mantención del árbol de gestión** | Alta, modificación, cierre y arrastre de nodos entre ejercicios; quién lo opera en el municipio y con qué control. Se levanta junto con la apertura del ejercicio (P-24) |
| Validación con municipios piloto | Contraste con al menos dos de los cinco municipios de referencia. Incluye validación de los cinco niveles (P-21) y del alcance de `OrganizationalUnit` (P-23) |

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
| Modelo de entidades consolidado | Naming inglés, atributos, cardinalidades, invariantes. Contraste explícito contra el ORM de Odoo, no contra el export de BD. Incluye `ManagementNode` con vigencia temporal y `path` materializado, `BudgetAccount`, y la advertencia explícita de no fusionar `PROJECT` con `InvestmentInitiative` (D-5) |
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
| **P-21** | Confirmar los cinco niveles del eje de gestión y su obligatoriedad (§5.3, D-5) | F1 / F3 | DM + municipios piloto | Abierto |
| **P-22** | Regla de aplanamiento del árbol de gestión para BEP e informes CGR (§5.3) | F1 / F5 | Equipo + SUBDERE | Abierto |
| **P-23** | `OrganizationalUnit` como dimensión de imputación: alcance y costo de configuración (§5.3) | F2 / F4 | DM + municipios piloto | Abierto |
| **P-24** | Versionado del árbol de gestión entre ejercicios: arrastre, cierre y saldos pendientes (§5.3) | F2 / F4 | Equipo + Contabilidad | Abierto |
| **P-25** | Origen y gobernanza de los atributos operativos del plan de cuentas local (Anexo A.6) | F1 | DM + Depto. Finanzas Municipales | **Resuelto en parte** (v0.13): invariante MATRIZ/DETALLE corregida y verificada; residual, el origen normativo |
| **P-26** | Tabla de contracuentas por (ejercicio, área, cuenta) como contrato Presupuestos→Contabilidad (§5.4) | F2 / F4 | Equipo + Contabilidad | Abierto |
| **P-27** | Semántica heterogénea del nivel `programa` entre municipios (§5.3): ¿se tipifica, se normaliza o se deja libre? | F1 / F3 | DM + municipios piloto | Abierto |
| **P-28** | Validar D-6 con DM: la solicitud de campos programa/proyecto/actividad en SOLPED se resuelve de otra forma | F0 / F1 | DM + Adquisiciones | Abierto |

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

### P-21 — Niveles del eje de gestión

**Contexto.** §5.3 y D-5. Los dos municipios inspeccionados operan con tres niveles (área, programa, subprograma); se ha requerido extender a cinco con `Proyecto` y `Actividad`. No hay fuente normativa que fije el número de niveles: el BEP solo reporta el área, y el Manual de Imputaciones solo declara aplicabilidad por área.

**Pregunta.** ¿Cinco niveles son suficientes para todos los municipios? ¿Algún nivel es obligatorio más allá del área, o todos son opcionales según la rama?

**Opciones.**
1. **Cinco niveles tipados** con profundidad variable por rama (D-5, recomendada). Cubre lo observado y lo requerido, con `level` como enum cerrado.
2. Árbol de profundidad libre sin tipar el nivel. Máxima flexibilidad; imposibilita el aplanamiento determinista de P-22 y la comparabilidad entre municipios.
3. Cinco columnas fijas obligatorias. Simple de reportar; genera el relleno masivo con placeholders ya observado (114 de 260 líneas en Las Cabras).

**Default:** opción 1, con el área como único nivel obligatorio.

**Criterio de cierre.** Validación con al menos dos municipios piloto de que ninguna rama requiere un sexto nivel; enum `level` congelado antes de F3; regla de obligatoriedad documentada por nivel.

**Insumos.** §5.3; §6.1; planillas de Las Cabras y María Pinto; Manual V21 (columnas de área de gestión).

---

### P-22 — Regla de aplanamiento para reportes normativos

**Contexto.** El BEP y los informes CGR esperan columnas fijas; D-5 adopta profundidad variable. Sin una regla única, cada implementación aplana distinto y los datos dejan de ser comparables entre municipios — que es precisamente el problema que el SGM debe eliminar.

**Pregunta.** ¿Cómo se rellenan los niveles no utilizados al proyectar el árbol sobre columnas fijas?

**Opciones.**
1. **Marcador nulo normalizado** (`—` o vacío explícito), único para todos los municipios. Limpio para agregación; cambia lo que los municipios ven hoy en sus reportes.
2. **Replicar el nombre del nivel superior** (comportamiento actual de Las Cabras). Continuidad con la práctica; perpetúa la ambigüedad entre "nivel no usado" y "nivel con el mismo nombre".
3. Etiqueta genérica tipo `VARIOS` (comportamiento de María Pinto). Peor de ambos mundos: ni nulo ni informativo.

**Default:** opción 1, con la vista aplanada como proyección de solo lectura y el árbol como fuente de verdad.

**Criterio de cierre.** Regla escrita en las bases como requisito, no como decisión del proveedor; contrato de exportación BEP actualizado; prueba de reproducibilidad sobre los cinco municipios en convenio, incluidos los dos extremos de profundidad (Cochamó y Villarrica).

**Insumos.** §5.3; §6.1; planillas de carga BEP; P-8.

---

### P-23 — `OrganizationalUnit` como dimensión de imputación

**Contexto — replanteado en v0.13.** El presupuesto municipal chileno no tiene dimensión organizacional formal, y el campo `Centro de Costo` está **vacío en las 4.919 filas** de las tres plantillas de migración (§5.3). Pero la evidencia de los cinco municipios muestra que la información **sí existe**: está codificada dentro del árbol de gestión. Villarrica usa el nivel `programa` como organigrama literal (`DEPTO. PERSONAL`, `DEPTO. TESORERÍA`, `ASESORÍA JURÍDICA`) y el `subprograma` como ubicación física con dirección. María Pinto la codifica implícitamente en el objeto de gasto.

**La pregunta de v0.12 estaba mal planteada.** No es "¿agregamos la dimensión?" —para Villarrica sería duplicarla— sino: ¿el modelo admite que el mismo hecho se exprese en el árbol de gestión **o** en una dimensión propia, según el municipio?

**Pregunta.** ¿`OrganizationalUnit` es dimensión independiente de `BudgetLine`, atributo derivable de un nodo del árbol, o ambas cosas según cómo el municipio ya organiza su presupuesto?

**Opciones.**
1. **Dimensión opcional, alimentable por dos vías**: captura directa, o derivación desde un nodo del árbol marcado con `node_purpose = organizacional` (P-27). Villarrica no captura nada y obtiene la dimensión gratis; Cochamó la captura si la quiere. Recomendada, y depende de que P-27 se resuelva por la opción 1.
2. **Dimensión independiente de captura obligatoria.** Trazabilidad uniforme y comparable; obliga a Villarrica a mantener el organigrama dos veces y a Cochamó a construirlo desde cero.
3. **No incorporarla.** Cero fricción; la pregunta "cuánto ejecutó esta dirección" sigue siendo irrespondible salvo que el municipio haya tenido la disciplina de codificarla en el árbol.

**Default:** opción 1, condicionada al cierre de P-27.

**Replanteo de v0.14 — cambia el propósito de la dimensión.** D-6 traslada la imputación de la SOLPED al CDP. Con eso, el mapeo unidad → nodo de gestión **deja de servir para filtrar lo que el solicitante elige** —uso que además era circular, §5.3— y pasa a servir para **pre-sugerir a la DAF** la imputación que confirma o corrige.

Es un fundamento mucho más sólido: no impone criterio a quien no lo tiene, sino que acelera a quien sí. Villarrica lo obtendría sin capturar nada, porque su nivel `programa` ya es el organigrama. Y la **divergencia entre la imputación propuesta en la SOLPED y la resuelta en el CDP** es la señal que permite mejorar la sugerencia con el tiempo, sin modelo predictivo: basta la frecuencia observada por unidad.

Consecuencia sobre las opciones: la opción 2 (captura obligatoria) queda descartada —ya no hay a quién obligar—, y la decisión se reduce a si la dimensión se captura, se deriva del árbol, o ambas.

**Criterio de cierre.** Acta con DM y municipios piloto sobre el costo de configuración; definición de si la unidad es obligatoria en la línea o solo en la ejecución; alineación con el modelo de unidad solicitante de Adquisiciones.

**Insumos.** §5.3; §3.2 (centro de costo en Odoo); modelo de SOLPED de Adquisiciones; organigramas de los municipios piloto.

---

### P-24 — Versionado del árbol de gestión entre ejercicios

**Contexto.** El árbol cambia todos los años. Hoy los municipios embeben el ejercicio en el nombre del nodo (`VINCULOS ACOMPAÑAMIENTO 19`, `CONVENIO HABITABILIDAD 2024`) porque no hay dimensión temporal, y la numeración acumula huecos sin depuración.

**Pregunta.** ¿Cómo se abre el árbol de un ejercicio nuevo, y qué ocurre con nodos cerrados que aún tienen saldo devengado pendiente de pago?

**Sub-preguntas.**
1. ¿Arrastre completo con cierre selectivo, o construcción desde cero con importación asistida?
2. ¿Un nodo cerrado puede recibir imputación de una cadena de compromiso abierta en el ejercicio anterior?
3. ¿La trazabilidad entre versiones (`superseded_by`) es obligatoria o solo cuando el municipio la declara?

**Opciones para la sub-pregunta 2.**
1. El nodo cerrado admite solo movimientos de cierre de cadenas preexistentes, no nuevas imputaciones (recomendada).
2. El cierre es total y las cadenas abiertas deben reimputarse a un nodo vigente. Más limpio conceptualmente; obliga a reimputación masiva en enero.

**Default:** arrastre con cierre selectivo; opción 1 para la sub-pregunta 2.

**Criterio de cierre.** Regla integrada al BPMN de apertura del ejercicio (F2, junto con P-6); `ManagementNode` con vigencia temporal especificado en F4.

**Insumos.** §5.3; 26.2.8; P-6; datos de Las Cabras (nombres con año embebido).

---

### P-25 — Atributos operativos del plan de cuentas local

**Contexto.** Anexo A.6. El plan de cuentas municipal trae cuatro atributos por cuenta —`TIPO CUENTA` (MATRIZ/DETALLE), `ANALÍTICO`, `ACTÚA PRESUPUESTO`, `INFORME AGREGADO`— que no aparecen en el clasificador ni en el Manual de Imputaciones. De ellos deriva una invariante central del motor: **solo `DETALLE` es imputable**.

**Pregunta.** ¿Son criterio normativo no levantado, o convención del proveedor del sistema actual? De la respuesta depende si son catálogo gobernado por SUBDERE (§7.5) o configuración del tenant.

**Resuelto en v0.13 — la invariante estaba mal formulada.** Las cuentas `MATRIZ` con monto no son una anomalía: llevan el subtotal agregado. Verificado en Villarrica, donde **241 de 241 cuentas `MATRIZ` con monto cuadran exactamente con la suma de sus hijas**. La invariante correcta es: *el monto de una `MATRIZ` es derivado y no admite imputación directa; solo `DETALLE` recibe movimientos*. El validador verifica el cuadre, no prohíbe el monto.

**Confirmado en v0.13.** Los cuatro atributos existen con idéntico dominio de valores en Villarrica (1.548 cuentas), bajo el rótulo `ASISTENCIA TÉCNICA` en vez de `TIPO CUENTA`. Dos columnas del encabezado están vacías en los cinco municipios: `TIPO RECUR.` y el par `FECHA INICIO` / `FECHA TERMINO` — la vigencia temporal por cuenta existe como campo y nadie la usa.

**Residual.** El origen normativo de `ACTÚA PRESUPUESTO` y `ANALÍTICO`: ¿criterio de CGR no levantado, o convención del proveedor?

**Opciones.**
1. Atributos derivables de la estructura del código (una cuenta es MATRIZ si tiene hijas). Elimina la captura manual; verificar contra los datos antes de asumirlo.
2. Atributos declarativos por cuenta, gobernados por SUBDERE como catálogo nacional.
3. Atributos declarativos, configurables por municipio.

**Default:** opción 1 si la verificación contra los dos planes de cuentas la sostiene; opción 2 en caso contrario.

**Criterio de cierre.** Verificación empírica de la opción 1 sobre Las Cabras y María Pinto; consulta a DM sobre el origen de `ACTÚA PRESUPUESTO`; resolución documentada de las 20 cuentas anómalas; clasificación de los atributos en la tabla de P-14.

**Insumos.** Anexo A.6; planes de cuentas de los dos municipios; Manual V21; §7.5.

---

### P-26 — Contracuentas contables como contrato con Contabilidad

**Contexto.** §5.4. Villarrica, Quilaco y Cochamó mantienen por cuenta presupuestaria las contracuentas de devengo y pago. Villarrica las indexa por **(ejercicio, área de gestión, cuenta presupuestaria)**. Es el mecanismo operativo del devengo dual de D-1, y el plan no lo tenía cubierto: P-6 pregunta *quién* hace el traspaso, no *con qué tabla* se determina el asiento.

**Pregunta.** ¿La correspondencia cuenta presupuestaria → contracuentas es catálogo del módulo Presupuestos, del módulo Contabilidad, o del contrato entre ambos? ¿Quién la mantiene y con qué respaldo normativo?

**Sub-preguntas.**
1. ¿La clave incluye el área de gestión en todos los casos, o Villarrica es un caso particular? Su tabla tiene una sola área poblada, así que la dependencia está declarada pero no ejercida.
2. ¿Es derivable del plan de cuentas NICSP y del Manual de Procedimientos Contables (Oficio CGR N° E59549/2020), o es configuración local?
3. ¿Qué ocurre con las cuentas sin contracuenta declarada? En los datos, la cobertura es de 17/82 en Quilaco, 25/204 en Villarrica y 0 en Cochamó.

**Opciones.**
1. **Catálogo nacional derivado de la normativa contable CGR**, con override local excepcional y justificado. Coherente con §7.5 (respaldo de órgano rector); requiere verificar que la normativa efectivamente lo determina.
2. Configuración por municipio, gobernada como parámetro del tenant. Refleja la práctica actual; perpetúa que cada municipio resuelva distinto un asiento que la norma debería fijar.
3. Derivación automática desde el plan de cuentas sin tabla intermedia. Elimina la configuración; probablemente insuficiente para los casos de activo fijo que Villarrica trata aparte.

**Default:** opción 1, con verificación previa contra el Manual de Procedimientos Contables antes de asumirla.

**Criterio de cierre.** Contraste de la tabla de los tres municipios contra el Oficio CGR N° E59549/2020; decisión de propiedad del catálogo; contrato Presupuestos↔Contabilidad de §6 ampliado con esta correspondencia; resolución del caso `Cta_Devengado_activo_fijo`.

**Insumos.** §5.4; cuentas analíticas de Villarrica, Quilaco y Cochamó; tabla `cuentas_comprobantes` de Villarrica; Oficios CGR E59549 y E64.327 de 2020; P-6; D-1.

---

### P-27 — Semántica heterogénea del nivel `programa`

**Contexto.** §5.3. El mismo nivel del árbol significa cosas distintas en cada municipio: unidad organizacional en Villarrica, objeto de gasto en María Pinto, programa o convenio en Quilaco, mixta en Las Cabras. Villarrica usa además el subprograma como ubicación física, con direcciones de inmuebles.

**Pregunta.** ¿El SGM tipifica la semántica de cada nivel, la normaliza hacia una convención única, o la deja libre y asume que el eje de gestión es un árbol sin semántica declarada?

**Opciones.**
1. **Libre, con `node_purpose` opcional y declarativo** por nodo (organizacional, funcional, programático, territorial). No fuerza migración, permite análisis nacional agregado cuando el municipio lo declara, y hace explícito lo que hoy está implícito. Recomendada.
2. **Normalizar hacia una convención única** definida por SUBDERE. Habilita comparabilidad nacional real; obliga a los cinco municipios a rehacer su árbol, y a Villarrica a desmontar su organigrama presupuestario. Costo político y operativo alto.
3. **Libre sin ninguna tipificación.** Menor fricción; el eje de gestión queda inutilizable para cualquier análisis comparado entre municipios, que es una de las razones de existir de SINIM.

**Default:** opción 1.

**Criterio de cierre.** Validación con los cinco municipios de que la tipificación opcional no les impone trabajo; definición del vocabulario cerrado de `node_purpose`; decisión sobre si SINIM/BEP consumirán ese atributo o lo ignoran.

**Insumos.** §5.3; árboles de gestión de los cinco municipios; P-23 (la opción de dimensión organizacional depende de esta decisión); §7.4 (taxonomía de triage: es un caso categoría 3 típico).

---
---

### P-28 — Validar D-6 con DM

**Contexto.** DM solicitó incorporar campos de `programa`, `proyecto` y `actividad` en la SOLPED, como tres selectores independientes filtrados por la unidad de destino. La solicitud **no se implementa en esos términos**: los tres son niveles de un mismo árbol y no dimensiones (D-5); la propuesta omitía el área de gestión, que es el único nivel normativo; y el filtro por unidad organizacional es circular con la evidencia de los cinco municipios (§5.3). D-6 resuelve la necesidad de otra forma: un solo campo referido a un nodo hoja, opcional y no vinculante en la SOLPED, con la autoridad de imputación en el CDP.

**Pregunta.** ¿DM valida el cambio de forma, y qué necesidad concreta estaba detrás de la solicitud original?

**Sub-preguntas.**
1. **¿De qué municipio es ese vocabulario?** Los cinco en convenio usan esos niveles con semánticas distintas —organigrama en Villarrica, objeto de gasto en María Pinto, convenio en Quilaco—. Si el requerimiento viene de uno en particular, el modelo genérico puede no ser lo que esperan ver en pantalla.
2. **¿Qué problema resolvía tener los campos en la SOLPED?** Si es trazabilidad de para qué se pide, lo cubre el campo de propósito. Si es control previo de disponibilidad por programa, es otra cosa y requiere diseño propio.
3. **¿Hay conformidad con que la clasificación la haga la DAF?** Es un cambio de carga de trabajo entre unidades, no solo de diseño.

**Opciones.**
1. **D-6 tal cual**, con la SOLPED espejando la imputación del CDP de forma opcional. Recomendada.
2. D-6 con los campos de SOLPED ocultos por defecto y habilitables por municipio. Reduce ruido en municipios que no los quieren; agrega configuración.
3. Revertir a captura en la SOLPED si DM aporta un fundamento normativo o funcional que no esté considerado. Requeriría reabrir la segregación del criterio 6 de §11.

**Default:** opción 1, con el cambio documentado y comunicado a DM antes de F3.

**Criterio de cierre.** Respuesta escrita de DM sobre las tres sub-preguntas; ficha de SOLPED de Adquisiciones actualizada; nota de trazabilidad de qué se pidió, qué se entregó y por qué difiere. Si DM insiste en el diseño original, el desacuerdo se documenta con su fundamento en lugar de resolverse por omisión.

**Insumos.** D-5; D-6; §5.3; §6; P-21; P-23; P-27; ficha 1-solped de Adquisiciones.

---

### Orden sugerido de resolución

```
F0:  P-1, P-4, P-28 (comunicación a DM)
F1:  P-8, P-11, P-12, P-17, P-21, P-22, P-25, P-27, (P-10 inicia con RRHH)
     · P-9 cerrado en v0.5; P-3 parcial en v0.6
F2:  P-5, P-6, P-23, P-24, P-26
F3:  P-3, P-7, P-10 (cierre), P-21 (cierre), P-27 (cierre)
F4:  cierre formal P-1 en modelo de Adquisiciones; ContingencyRecord (P-15);
     ManagementNode y OrganizationalUnit (P-23, P-24); contrato de contracuentas (P-26)
F5:  P-13, P-14 (track GP), P-15 (cierre), P-22 (cierre en contrato de reporte)
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
| **Fusionar el nivel `PROJECT` del eje de gestión con `InvestmentInitiative` del ST 31** | **Alto — acopla el eje de gestión con el clasificador y arrastra identificación SNI a líneas que no son de inversión** | Separación explícita en D-5 y §5.3, con vínculo opcional en `BudgetLine`. La colisión de nombres (ítem 31.02 "Proyectos", posición 7 del Código INI) hace el error probable: debe quedar advertido en la ficha de modelo de F4 |
| **Modelar el eje de gestión como columnas fijas** | Medio-alto — reproduce el relleno con placeholders ya observado (114 de 260 líneas en Las Cabras) y contamina toda agregación | D-5: árbol recursivo con profundidad variable; vista aplanada como proyección de solo lectura con regla única (P-22) |
| **Especificar el eje de gestión solo hasta donde llega el BEP** | Medio-alto — el BEP reporta únicamente el área; la imputación real ocurre cuatro niveles más abajo | §6.1: el contrato de reporte es piso en magnitudes, no en dimensionalidad. Verificar contra datos municipales reales, no contra el formato de reporte |
| **Cuello de botella de clasificación en la DAF** | Medio-alto — D-6 traslada la imputación a la DAF; en municipios con equipos de finanzas de tres personas y cientos de SOLPED al año, el paso puede convertirse en el limitante del ciclo de compra | Pre-sugerencia de imputación derivada del mapeo unidad → nodo y del histórico de divergencias (P-23). Medir el tiempo del paso en los pilotos antes de generalizar. No se mitiga relajando la segregación |
| **Asumir que el nivel `programa` significa lo mismo en todos los municipios** | **Alto — en Villarrica es el organigrama, en María Pinto el objeto de gasto, en Quilaco el convenio. Un validador o un reporte nacional que asuma una semántica produce resultados sin sentido** | Tipificación opcional por nodo (P-27) y ninguna regla de negocio que dependa de la semántica del nivel sin que el municipio la haya declarado |
| **Dimensionar el modelo sobre un municipio promedio** | Medio-alto — el rango real va de Cochamó (un área, un programa, ningún subprograma) a Villarrica (224 programas, uno con 37 subprogramas) | Probar el modelo contra los dos extremos, no contra el caso medio. Ningún nivel obligatorio salvo el área |
| **Reconciliar catálogos municipales por glosa** | Medio-alto — 45% de los códigos comunes a dos o más municipios tienen glosa distinta, y en el sexto nivel la divergencia es de significado (Anexo A.6) | El código es la única clave, y solo hasta el quinto nivel. Prohibición explícita de join por descripción en las reglas de migración |
| **Migrar árboles de gestión heredados sin normalización** | Medio — jerarquías incompletas, tipos inconsistentes y ejercicio embebido en el nombre del nodo | Importador con reglas explícitas e informe de excepciones como requisito de bases (Anexo A.6); mismo criterio que P-17 |

---

## 11. Criterios de término del módulo

1. Todo validador bloqueante declara fundamento en `legal_reference`: cita de artículo/decreto/dictamen cuando la regla es normativa, o `integridad:<motivo>` cuando es invariante de proceso sin ancla legal única. El fundamento normativo se muestra en el helper de validación al funcionario ([`musts-arquitectura.md`](../../arquitectura/especificacion/musts-arquitectura.md) §11).
2. Ningún umbral, plazo o clasificación normativa está hardcodeado; todos son `NormativeParameter` con vigencia temporal. Incluye el 42%, el 20%, los plazos del art. 82 y el clasificador del Decreto 854.
3. Los contratos inter-módulo de §6 están versionados y clasificados por modo de invocación (incl. RRHH bidireccional — R-1).
4. Cada etapa tiene ficha completa; ningún paso queda descrito como "según práctica municipal".
5. La especificación permite construir el módulo sin consultar el código de Odoo.
6. Segregación de funciones verificable: formulación, aprobación, emisión de CDP, obligación y control son roles distintos, y el motor lo impone. Incluye **quien solicita no imputa**: la unidad requirente puede proponer una imputación, nunca determinarla (D-6).
7. La cadena de firma del decreto es configurable por municipio sin modificar código.
8. Cada parámetro normativo está clasificado como de mandato propio o de respaldo de órgano rector, y ninguno de la segunda clase se modifica sin acto del órgano competente registrado en el sistema (P-14).
9. Los cuatro procesos del track GP tienen ficha propia y el sistema los soporta técnicamente: vigencia temporal de parámetros, versionado de contratos con preaviso, y trazabilidad de cada validador a su fuente (§7, P-13).
10. Toda operación con plazo legal tiene clase de exposición asignada y vía alternativa documentada; el sistema no da por acreditado el vencimiento de un plazo con efecto jurídico sin verificación humana registrada, y conserva el `ContingencyRecord` asociado (§5.1, P-15).
11. Ninguna regla del módulo se funda en una cita normativa no verificada en fuente primaria (§4.2).
12. El eje de gestión está especificado como árbol con profundidad variable y nivel tipado; existe una regla de aplanamiento única y explícita para los reportes normativos; y ningún nivel del eje se confunde con la identificación de iniciativas de inversión del subtítulo 31 (D-5, §5.3, P-21, P-22).
13. El plan de cuentas local del municipio está modelado como entidad del tenant con referencia al catálogo nacional, y la invariante de imputabilidad es verificable en ambos ejes: los nodos agregados (`MATRIZ`, nodo interno) llevan un monto **derivado** que debe cuadrar con sus hijas, y solo las hojas (`DETALLE`) reciben imputación (Anexo A.6, P-25).
14. La correspondencia entre cuenta presupuestaria y contracuentas contables está especificada como catálogo versionado con propiedad declarada, y es el contrato que materializa el devengo dual de D-1 (§5.4, P-26).
15. El modelo se ha probado contra los dos extremos observados en los cinco municipios en convenio —un área con un programa y sin subprogramas, y 224 programas con hasta 37 subprogramas— y no contra un caso medio (§5.3).
16. Ningún módulo consumidor define un vocabulario de clasificación presupuestaria propio: los campos de imputación de la SOLPED son los del CDP, marcados como propuesta, opcionales y validados solo en su forma (D-6).

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

**Cuarta capa (v0.12): la apertura local del municipio.** Las tres capas anteriores son nacionales. Bajo ellas existe una cuarta, específica de cada municipio: el **plan de cuentas operativo**, que extiende el catálogo nacional con un sexto nivel de apertura y con atributos que ninguna fuente normativa entrega. No es una vista del catálogo nacional: es data del tenant. Ver **Anexo A.6**.

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

### A.6 El plan de cuentas municipal: la capa local

Evidencia: planes de cuentas de los **cinco municipios en convenio**. Las Cabras (228 cuentas de ingreso) y María Pinto (285 de ingreso, 549 de gasto) en v0.12; Villarrica (1.548 cuentas), Quilaco (1.415) y Cochamó (1.000 de ingreso, 1.688 de comprobantes) en v0.13.

Los tres municipios incorporados en v0.13 aportan además el artefacto **cuenta analítica**, que hace explícita la descomposición del código y el mapeo a contracuentas contables. Ver §5.4.

#### Estructura del código: seis segmentos, no cuatro

La jerarquía que el plan describe hasta v0.11 —subtítulo / ítem / asignación / subasignación— es la del **clasificador**. El código que los municipios usan operativamente tiene seis segmentos:

```
215  -  21  -  01  -  001  -  001  -  000
 │       │      │      │       │       └── 6º nivel: apertura local del municipio
 │       │      │      │       └────────── Subasignación   (Sueldos base)
 │       │      │      └────────────────── Asignación      (Sueldos y sobresueldos)
 │       │      └───────────────────────── Ítem            (Personal de Planta)
 │       └──────────────────────────────── Subtítulo       (Gastos en Personal)
 └──────────────────────────────────────── Cuenta contable: 115 Deudores Presupuestarios
                                            (ingresos) / 215 Acreedores (gastos)
```

Dos consecuencias que el modelo debe reflejar:

1. **El prefijo `115` / `215` es contable, no presupuestario.** Son las cuentas de Deudores y Acreedores Presupuestarios del plan de cuentas NICSP. El código presupuestario municipal **es** una cuenta contable: es la costura con Contabilidad materializada en el identificador, no una integración a construir. Refuerza D-1 y P-6.
2. **El sexto nivel es libre y diverge entre municipios.** Verificado sobre el mismo código en los dos planes de cuentas:

| Código | María Pinto | Las Cabras |
|---|---|---|
| `115-03-01-003-999-001` | Alcantarillado | Derechos por mantención de escombros |
| `115-03-01-003-999-002` | Otros Derechos | De Bienes Nacionales de uso público |
| `115-03-01-003-999-003` | Certificados de Antecedentes | Estacionamientos Reservados |

El catálogo nacional gobierna hasta el quinto nivel. **`BudgetAccount` es entidad del tenant con FK al `BudgetClassifier`**, no una fila del catálogo nacional. Modelarlos como una sola tabla impide que dos municipios abran cuentas distintas bajo la misma subasignación, que es lo que hacen hoy.

#### Atributos operativos que ninguna fuente normativa entrega

El plan de cuentas de Las Cabras trae cuatro atributos por cuenta que no están en el Manual de Imputaciones (A.4) ni en el clasificador:

| Atributo | Valores observados (228 cuentas de ingreso) | Uso en el módulo |
|---|---|---|
| `TIPO CUENTA` | MATRIZ 71 · DETALLE 157 | **Solo `DETALLE` es imputable**; `MATRIZ` únicamente agrega. Invariante del motor |
| `ANALÍTICO` | Sí 121 · No 107 | La cuenta abre a detalle por contribuyente o documento. Frontera con Tesorería |
| `ACTÚA PRESUPUESTO` | Sí 76 · No 152 | Si el movimiento afecta ejecución presupuestaria o es solo contable. Cruza con el devengo dual (D-1) |
| `INFORME AGREGADO` | Ingreso 10 · No en informe 218 | Reporte oficial al que agrega la cuenta |

**Confirmados en Villarrica (v0.13)** con los mismos valores y semántica sobre 1.548 cuentas: `Detalle` 1.187 / `Matriz` 361 · `ANALÍTICO` Sí 431 / No 1.117 · `ACTÚA PRESUP.` Sí 149 / No 1.399. La columna se rotula `ASISTENCIA TÉCNICA` en Villarrica y `TIPO CUENTA` en Las Cabras, con idéntico dominio de valores: son el mismo sistema o la misma familia de sistemas.

Dos columnas presentes en el encabezado están **vacías en todos los municipios**: `TIPO RECUR.` y el par `FECHA INICIO` / `FECHA TERMINO`. Esto último es relevante: **la vigencia temporal por cuenta existe como campo y nadie la usa**, aunque el Manual de Imputaciones sí gobierna estados de cuenta (nueva / no usar, Anexo A.4). Es otro caso de campo presente sin uso funcional.

Estos atributos vienen del **sistema municipal**, no de una fuente normativa identificada. Es la pregunta de P-25: ¿son criterio normativo no levantado, o convención del proveedor del sistema actual? La respuesta cambia si son catálogo gobernado por SUBDERE (§7.5, mandato propio o respaldo de órgano rector) o configuración del tenant.

#### Corrección de v0.12: `MATRIZ` con presupuesto no es una anomalía

v0.12 registró como anomalía que 20 cuentas `MATRIZ` de Las Cabras tuvieran presupuesto asignado. **La lectura era incorrecta.** Verificado sobre Villarrica, que tiene 1.548 cuentas y permite la comprobación completa:

- 361 cuentas `MATRIZ`, de las cuales **241 tienen monto**.
- De esas 241, **241 cuadran exactamente con la suma de sus cuentas hijas**. Cero excepciones.

`MATRIZ` es el **nodo agregado que lleva el subtotal**, por diseño. La invariante correcta no es "MATRIZ no tiene monto" sino:

> El monto de una cuenta `MATRIZ` es **derivado** —la suma de sus hijas— y no admite imputación directa. Solo `DETALLE` recibe movimientos.

Es la misma distinción entre valor calculado y valor imputable que aplica al árbol de gestión: los nodos internos agregan, las hojas reciben. El validador debe verificar el cuadre, no prohibir el monto.

#### La glosa no es clave de reconciliación

Comparados los planes de cuentas de los cinco municipios: de **742 códigos presentes en dos o más municipios, 334 (45%) tienen glosa semánticamente distinta**. En 244 casos la divergencia está en niveles del catálogo nacional —redacciones distintas del mismo concepto— y en **90 casos está en el sexto nivel, donde la divergencia es de significado, no de redacción**:

| Código | Cochamó | Villarrica |
|---|---|---|
| `115-03-01-003-001-002` | Certificados DOM | Venta de terreno de cementerio |
| `115-03-01-003-001-003` | Derechos varios DOM | Permisos de subdivisión y loteos |
| `115-03-01-003-001-004` | Cuota permiso de edificación DOM | Ley de copropiedad inmobiliaria |

| Código | Las Cabras | Villarrica |
|---|---|---|
| `115-03-01-001-001-002` | Patentes municipales provisorias | Patentes fuera de rol |
| `115-03-01-003-003-001` | Propaganda enrolada | Derechos por publicidad otras |

**Consecuencia para la migración y para cualquier consolidación nacional:** el código identifica hasta el quinto nivel; la glosa **nunca** es clave de join, ni siquiera para desambiguar. Y en el sexto nivel el código tampoco es interoperable entre municipios: identifica dentro del tenant y nada más.

#### Calidad de datos para la migración

Observado en el presupuesto por área de gestión de Las Cabras:

- Seis filas del área 3 sin programa asignado: jerarquía incompleta.
- El identificador de área viene a veces como entero y a veces como texto (`3` vs `"3"`), separando filas que pertenecen al mismo nodo.

Son anomalías menores en sí mismas, pero establecen el requisito: las bases deben exigir **importador con reglas de normalización explícitas e informe de excepciones**, no carga silenciosa. Mismo criterio que P-17 para el Manual de Imputaciones.

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
- **Datos de los cinco municipios en convenio** — evidencia primaria del eje de gestión, del plan de cuentas local y de las contracuentas contables:
  - *Las Cabras* (v0.12): plan de cuentas de ingresos 2026 (228 cuentas) y presupuesto por área de gestión 2026 (260 líneas, 53 combinaciones)
  - *María Pinto* (v0.12): cuentas de ingreso y gasto y presupuesto por área de gestión 2026 (285 + 549 cuentas, 620 líneas, 62 combinaciones)
  - *Villarrica* (v0.13): cuentas analíticas 2025 (204), plan de cuentas ingreso/gasto (1.548), tabla `cuentas_comprobantes` (1.009), programas y subprogramas (224 / 97), presupuesto detallado I+G (2.182 y 1.843 filas)
  - *Quilaco* (v0.13): cuentas analíticas ingresos y gastos (1.415), programas y subprogramas (49 / 60), presupuesto detallado I+G (635 filas)
  - *Cochamó* (v0.13): cuenta analítica no oficial de ingresos (1.000), plan de cuentas (1.783), cuentas comprobantes (1.688), presupuesto detallado (259 filas)