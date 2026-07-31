# Estándar de pruebas y verificación — SGM

> Documento de trabajo — arquitectura / especificación
> Estado: borrador (julio 2026). Propuesta de estándar, no validada con DM.
> Complementa y no sustituye: [`musts-arquitectura.md`](./musts-arquitectura.md) §6–§7 (SLOs y carga), §10.6 (trazabilidad BPMN), §11 (fundamento en validadores); [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) §4.3 y §9.4 (recepción); [`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md) §7 (fixtures como casos oficiales); [`estandares-api.md`](./estandares-api.md) §3 y §6 (errores estructurados y formato de fixtures).
> Pendientes propuestos: X-86 … X-93 (§11), a registrar en [`pendientes.md`](../decisiones/pendientes.md).

---

## 1. Propósito

Definir qué se prueba, quién lo prueba, con qué se prueba y bajo qué criterio se acepta o rechaza, de modo que la recepción del sistema sea un acto verificable y no una apreciación.

Este documento existe porque la verificación del SGM está hoy repartida entre tres documentos y ninguno la posee: `musts-arquitectura.md` cubre carga y SLOs, `entregable-licitacion.md` cubre conformidad de contrato y reproducción de fixtures, `sandbox-desarrolladores.md` cubre el ambiente. Falta el nivel que los une y, sobre todo, falta la clase de prueba que se describe en §2.

---

## 2. El problema que este documento resuelve

La revisión del sistema anterior arrojó siete fallas verificadas en el código. Las tres siguientes son representativas:

| Falla verificada | Fuente |
|---|---|
| El procedimiento de factoring tiene su tarea *Suspender Pago*, pero `payment.decree` **no tiene estado `suspended`**: la suspensión no produce efecto sobre el sistema | [`plan-de-trabajo-contabilidad.md`](../../modulos/contabilidad/plan-de-trabajo-contabilidad.md) |
| La consolidación de caja tiene un método `_create_accounting_entry` que **`action_done` nunca invoca** | [`plan-de-trabajo-tesoreria.md`](../../modulos/tesoreria/plan-de-trabajo-tesoreria.md) |
| La garantía municipal recorre sus tres firmas y **no genera ningún asiento contable**, pese a que el proceso lo exige | ídem |

**Las tres pasarían una prueba de conformidad de contrato.** `action_done` responde `200`, el estado pasa a `done`, el esquema de respuesta es válido. El asiento contable que debía nacer no está en el cuerpo de la respuesta, y por lo tanto ninguna aserción sobre `{b}` lo echa de menos.

De ahí la distinción que ordena este documento:

| Clase | Pregunta que responde | Estado en el corpus |
|---|---|---|
| **Prueba de contrato** | ¿El sistema responde lo que prometió responder? | Cubierta — `estandares-api.md` §6, fixtures, X-53 |
| **Prueba de efecto** | ¿El sistema hizo lo que dice que hizo? | **Ausente** |

Un sistema puede ser íntegramente conforme a su contrato y no producir ninguno de los efectos jurídicos que justifican su existencia. Eso ya ocurrió una vez.

---

## 3. Principio rector: la especificación ya es la suite

No hay que inventar la batería de pruebas. Hay que derivarla, y solo es derivable porque la especificación declara las cosas que declara:

| Artefacto de la especificación | Genera |
|---|---|
| Validador con `severity: blocking` y `legal_reference` | Dos casos: uno que lo dispara, uno que lo evita |
| Transición declarada en una máquina de estados | Un caso positivo; y un caso negativo por cada transición **no** declarada que se intente |
| Efecto de dominio declarado en una ficha de proceso | Una aserción sobre el estado resultante, en el módulo donde ese efecto vive |
| Evento de dominio declarado en `contracts.md` | Una aserción de emisión, con su carga útil |
| Plazo legal computable | Un caso por cada borde del plazo, con reloj controlado |
| Operación publicada en OpenAPI | Un par `{a}` → `{b}` conforme al esquema |

**Consecuencia exigible:** la cobertura de pruebas del adjudicatario no se mide en porcentaje de líneas de código, sino en **porcentaje de elementos declarados en la especificación que tienen al menos un caso asociado**. Ese denominador es contable y está en el repositorio.

> **PENDIENTE X-86:** Producir el inventario derivado —validadores, transiciones, efectos, eventos y plazos declarados por módulo— que constituye el denominador de cobertura. Es trabajo de extracción sobre el corpus existente, sin decisión externa.

---

## 4. Tipos de prueba exigibles

Cada tipo declara qué verifica, de dónde se deriva y cuál es su criterio de aceptación. En todos rige la regla de recepción del corpus: **cumple o no cumple**, sin categorías intermedias.

### 4.1 T1 — Conformidad de contrato

Verifica que cada operación publicada responde conforme a su esquema OpenAPI, con los códigos de error tipificados de [`estandares-api.md`](./estandares-api.md) §3.

*Derivación:* toda operación en OpenAPI. *Ejecuta:* adjudicatario en integración continua; contraparte técnica reproduce los fixtures en recepción ([`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md) §7). *Ya cubierto* por X-53 y el catálogo de fixtures.

### 4.2 T2 — Efecto de dominio

**Es el tipo central de este documento.** Verifica que, tras ejecutar un acto, el estado del dominio cambió como la ficha de proceso declara — incluido el estado que vive en **otro módulo**.

*Derivación:* la columna de efecto de dominio de cada paso de ficha.

*Forma de la prueba:* ejecutar la operación, y después consultar por API el estado resultante allí donde el efecto debía producirse. No basta con inspeccionar la respuesta de la operación.

*Ejemplo derivado del hallazgo de Tesorería:* cerrar una consolidación de caja; luego consultar en Contabilidad el asiento correspondiente. Si no existe, la prueba falla — aunque el cierre haya respondido `200`.

*Criterio:* ningún paso de ficha con efecto de dominio declarado puede quedar sin su aserción correspondiente.

> **PENDIENTE X-87:** Establecer que toda ficha de proceso declare el efecto de dominio en forma verificable por API —entidad, campo y valor esperado—, y no en prosa. Requiere ajuste de [`plantilla-maestra-sgm.md`](../instrucciones/plantilla-maestra-sgm.md) §3.6.

### 4.3 T3 — Validador con fundamento

Verifica que cada validador bloqueante efectivamente bloquea, con el código de error, el mensaje y el `legal_reference` declarados.

`musts-arquitectura.md` §11 ya exige que ningún `blocking` viaje con `legal_reference` vacío. Eso es una verificación de **formato**. Falta la de **comportamiento**: que exista un caso que lo dispare.

*Derivación:* el catálogo de validadores bloqueantes por módulo. *Estado actual:* el catálogo de fixtures declara tres escenarios transaccionales (`BUDGET_UNAVAILABLE`, `MODALITY_AMOUNT_EXCEEDED` y una SOLPED válida). Es un piso, no una cobertura.

*Criterio:* cobertura completa de validadores `blocking`. Los `advisory` se prueban por muestreo.

### 4.4 T4 — Máquina de estados, con casos negativos

Verifica las transiciones permitidas y —sobre todo— que **las no declaradas son rechazadas**.

`musts-arquitectura.md` §10.1 exige estados y transiciones explícitos. Sin casos negativos, esa exigencia no es verificable: un sistema que acepta cualquier transición cumple todas las pruebas positivas.

*Criterio:* por cada estado, se intenta al menos una transición no declarada y el sistema la rechaza con error tipificado.

### 4.5 T5 — Fronteras temporales

Verifica los plazos legales computables, con reloj controlado por la prueba.

El corpus identifica al menos cinco efectos jurídicos disparados por tiempo: el silencio del art. 82 de la LOCM, los diez días del art. 29 letra c), los ocho días hábiles de cesión de la Ley 19.983, la anulación de caja dentro de la misma jornada, y el vencimiento de la declaración previsional.

*Forma:* tres casos por plazo — antes del borde, en el borde, después del borde. Con **días hábiles** cuando la norma los computa así, lo que a su vez exige un calendario de feriados como dato del sistema.

> **PENDIENTE X-88:** Definir el origen y la custodia del calendario de días hábiles e inhábiles. Sin él, ningún plazo legal en días hábiles es computable ni verificable. Candidato: `NormativeParameter` con vigencia anual.

*Criterio:* ningún plazo legal declarado queda sin sus tres casos.

### 4.6 T6 — Atomicidad y compensación

Verifica, mediante inyección de fallas, que un hecho cuyos efectos viven en dos módulos no puede quedar a medias.

Es el instrumento de cierre de **C-1** —la atomicidad del devengo dual—, declarado por el corpus como el requisito técnico más duro de la arquitectura. Sin este tipo de prueba, C-1 puede darse por resuelto en el papel y fallar en producción.

*Forma:* interrumpir deliberadamente el segundo módulo a mitad de la operación y verificar que no queda estado huérfano: o ambos efectos existen, o ninguno, o existe una compensación registrada y auditable.

*Criterio:* la prueba se ejecuta en presencia de la contraparte técnica, como las de carga.

> **PENDIENTE X-89:** Definir los puntos de inyección de falla exigibles. Depende del mecanismo que cierre C-1: no puede especificarse antes que la decisión de arquitectura.

### 4.7 T7 — Ventana de mutabilidad

Verifica que un período cerrado rechaza escrituras, y que la reapertura deja rastro.

*Derivación:* las cuatro entidades que implementan el patrón —`BudgetExercise`, `AccountingPeriod`, `CashierSession`, `PayrollPeriod`— según [`2026-07-ventana-mutabilidad.md`](../decisiones/2026-07-ventana-mutabilidad.md).

*Criterio:* por cada una, un intento de escritura sobre período cerrado que sea rechazado, y una reapertura que quede registrada con autor y motivo.

### 4.8 T8 — Aislamiento entre tenants

Verifica, por prueba negativa, que un tenant no accede a datos de otro.

`musts-arquitectura.md` §3 exige demostrar migraciones y pooling a escala; eso es rendimiento. El aislamiento es una propiedad distinta y se prueba de otra forma: con credenciales del tenant A, intentar leer recursos del tenant B por identificador conocido, y obtener negativa.

*Criterio:* ninguna combinación de operación y ruta permite lectura cruzada, incluidos los identificadores obtenidos por enumeración.

### 4.9 T9 — Autorización y segregación de funciones

Verifica que cada operación exige el rol declarado, que la segregación de funciones se impone en servidor, y que las excepciones registradas operan como se especifica.

*Criterio:* por cada operación, un caso con rol suficiente y uno con rol insuficiente. La negativa se produce en el servidor, no en la interfaz.

Esta prueba responde además al hallazgo H-2 del sistema anterior —un endpoint sin autenticación que creaba registros financieros ([`seguridad.md`](./seguridad.md) Anexo A)—: **el inventario de endpoints y su nivel de autenticación es material de prueba, no solo de documentación.**

### 4.10 T10 — Carga y SLO

Ya especificado en [`musts-arquitectura.md`](./musts-arquitectura.md) §6 y §7. Se referencia aquí para completar el mapa; **no se redefine**.

### 4.11 T11 — Trazabilidad contra la especificación de flujo

Ya especificado en [`musts-arquitectura.md`](./musts-arquitectura.md) §10.6. Se referencia aquí; no se redefine.

### 4.12 T12 — Regresión normativa

Verifica que un cambio de parámetro normativo produce el efecto esperado **sin despliegue de código**, y que los actos anteriores conservan el parámetro vigente al momento en que se dictaron.

Es la contracara verificable del diseño de `NormativeParameter` con vigencia temporal: si un cambio de valor altera retroactivamente actos ya dictados, el sistema no es auditable.

*Forma:* modificar un parámetro con fecha de vigencia futura; verificar que los actos anteriores mantienen el valor antiguo y los posteriores toman el nuevo.

*Criterio:* la prueba se reejecuta cada vez que se incorpora un parámetro normativo nuevo. Es el vínculo operativo entre este estándar y la función permanente de custodia normativa.

---

## 5. Derivación y cobertura

La cobertura exigible se expresa por tipo, sobre denominadores extraídos del repositorio:

| Tipo | Denominador | Cobertura exigida |
|---|---|---|
| T1 | Operaciones publicadas en OpenAPI | 100% |
| T2 | Pasos de ficha con efecto de dominio declarado | 100% |
| T3 | Validadores `blocking` | 100%; `advisory` por muestreo |
| T4 | Estados declarados por entidad | 100%, con al menos un caso negativo cada uno |
| T5 | Plazos legales declarados | 100%, tres casos cada uno |
| T6 | Hechos con efectos en más de un módulo | 100% |
| T7 | Entidades con ventana de mutabilidad | 100% |
| T8 | Recursos expuestos por API | Muestreo dirigido, más enumeración |
| T9 | Operaciones publicadas | 100% |
| T12 | Clases de parámetro normativo | 100% |

> **PENDIENTE X-90:** Calibrar los niveles de cobertura antes de las bases. Un 100% mal calibrado encarece la oferta sin aumentar la garantía; el criterio de calibración debe ser la consecuencia jurídica del elemento no probado.

---

## 6. Los artefactos de prueba son entregable

Sin esta regla, el resto del documento no es exigible.

1. **El código de las pruebas se entrega**, en el repositorio de SUBDERE, bajo las mismas condiciones de propiedad que el resto ([`principios-no-negociables.md`](../licitacion/principios-no-negociables.md) §5).
2. **Las pruebas son ejecutables por la contraparte técnica** contra el ambiente de recepción, sin asistencia del proveedor. Un informe de resultados no es evidencia; una suite reproducible sí.
3. **La suite se ejecuta en integración continua** y su resultado es público para SUBDERE durante todo el desarrollo, no solo en recepción.
4. **Una prueba que falla no se desactiva:** se corrige el sistema o se corrige la especificación, y en este segundo caso el cambio queda registrado.

> **PENDIENTE X-91:** Definir el régimen contractual ante prueba fallida en recepción: qué se rechaza, qué se subsana con plazo, y qué consecuencia tiene el incumplimiento sostenido. Debe alinearse con el régimen de SLOs de `musts-arquitectura.md` §6 (X-10).

---

## 7. Ambientes

Los tres ambientes ya están definidos en [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) §5.4. Este estándar asigna qué se prueba en cada uno:

| Ambiente | Tipos que se ejecutan |
|---|---|
| Integración continua del adjudicatario | T1 a T5, T7, T9, T12 |
| Sandbox | T1 y los fixtures publicados; es ambiente de integración de terceros, no de recepción |
| Staging / pre-producción | Todos, incluidos T6 y T10, en presencia de la contraparte técnica |

---

## 8. Datos de prueba

Rige la política ya establecida: datos sintéticos, prohibido cargar datos reales de municipios (Ley 21.719), según [`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md) §4.

Se agrega una exigencia que el corpus todavía no cubre: **staging usa datos anonimizados de alta fidelidad**, y el procedimiento de anonimización es entregable y auditable. Sin él, «alta fidelidad» y «anonimizado» tienden a resolverse a favor del primero.

> **PENDIENTE X-92:** Especificar el procedimiento de anonimización para staging: qué campos, con qué técnica, y quién certifica el resultado. Requiere criterio jurídico sobre Ley 21.719.

---

## 9. Qué se agrega al checklist de recepción

Complementa [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) §9.4, que hoy contiene cinco ítems, todos de conformidad y carga:

- [ ] Suite de pruebas entregada en repositorio SUBDERE y ejecutable por la contraparte sin asistencia del proveedor.
- [ ] Cobertura demostrada por tipo, contra los denominadores extraídos de la especificación (§5).
- [ ] Pruebas de efecto de dominio (T2) para todo paso con efecto declarado.
- [ ] Pruebas de validador (T3) para el 100% de los bloqueantes, con su `legal_reference`.
- [ ] Casos negativos de máquina de estados (T4) y de aislamiento entre tenants (T8).
- [ ] Pruebas de frontera temporal (T5) con reloj controlado y calendario de días hábiles.
- [ ] Prueba de atomicidad con inyección de falla (T6), ejecutada ante la contraparte técnica.
- [ ] Inventario de endpoints con su nivel de autenticación, verificado contra el sistema entregado (T9).

---

## 10. Lo que este estándar no resuelve

1. **No prueba que la regla especificada sea la regla correcta.** Verifica fidelidad entre especificación y sistema. Si la especificación cita mal una norma, la prueba confirmará el error con toda exactitud. Esa validación es de dominio y de custodia normativa, no de pruebas.
2. **No cubre usabilidad.** Que un validador bloquee no dice nada sobre si el funcionario entiende por qué. El testeo con usuarios es un instrumento distinto.
3. **No sustituye la aceptación funcional del municipio.** Una operación puede ser conforme, producir su efecto y aun así no servir para el trabajo real.

---

## 11. Pendientes propuestos

| ID | Materia | Naturaleza del cierre |
|---|---|---|
| X-86 | Inventario derivado de la especificación como denominador de cobertura | Trabajo de especificación |
| X-87 | Efecto de dominio declarado en forma verificable en las fichas | Trabajo de especificación (ajuste de plantilla) |
| X-88 | Origen y custodia del calendario de días hábiles | Decisión técnica + fuente normativa |
| X-89 | Puntos de inyección de falla exigibles | Depende del cierre de C-1 |
| X-90 | Calibración de los niveles de cobertura antes de las bases | Decisión de jefatura / bases |
| X-91 | Régimen contractual ante prueba fallida | Decisión de jefatura / jurídica |
| X-92 | Procedimiento de anonimización para staging | Criterio jurídico (Ley 21.719) |
| X-93 | Verificar si este estándar debe extenderse a los módulos aún sin especificación | Trabajo de especificación |

---

## 12. Referencias

- [`musts-arquitectura.md`](./musts-arquitectura.md) — §6 SLOs, §7 carga, §10.6 trazabilidad BPMN, §11 fundamento normativo
- [`estandares-api.md`](./estandares-api.md) — §3 errores estructurados, §6 fixtures
- [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) — §4.3 capa de verificación, §5.4 ambientes, §8 catálogo de fixtures, §9.4 checklist
- [`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md) — §4 datos, §7 fixtures como casos oficiales
- [`principios-no-negociables.md`](../licitacion/principios-no-negociables.md) — §5 propiedad del código
- [`seguridad.md`](./seguridad.md) — Anexo A, hallazgos del sistema anterior
- [`2026-07-ventana-mutabilidad.md`](../decisiones/2026-07-ventana-mutabilidad.md)
- [`2026-07-atomicidad-efectos-borde.md`](../decisiones/2026-07-atomicidad-efectos-borde.md)
