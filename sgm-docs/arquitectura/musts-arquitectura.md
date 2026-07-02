# Musts de arquitectura: escalabilidad y requisitos no funcionales verificables

> Documento de trabajo — arquitectura / requisitos no funcionales
> Estado: borrador. Complementa `decisiones-macro-stack.md` y `contrato-api-first.md`.
> Principio rector: todo requisito de este documento debe ser **verificable en recepción**. La escalabilidad no es una promesa del oferente; se mide antes de pagar.
> Pendientes marcados como **[PENDIENTE]**.

---

## 1. Escenario de dimensionamiento

El sistema debe dimensionarse para el escenario de adopción amplia, no para los pilotos:

- **Referencia de carga:** 100 municipios activos operando el módulo de Adquisiciones a diario desde múltiples unidades municipales, con crecimiento proyectado hacia la totalidad de municipios del país (345 tenants eventuales).
- **Orden de magnitud transaccional:** decenas de miles a ~100.000 transacciones de escritura diarias (SOLPEDs, cotizaciones, órdenes, recepciones, devengados), más el tráfico de lectura asociado. Carga modesta para un stack moderno bien configurado; no requiere arquitectura exótica, pero sí disciplina en los puntos críticos de las secciones siguientes.
- **Dimensionamiento por pico, no por promedio.** La carga municipal es estacional y sincronizada: cierre presupuestario, fin de mes, diciembre — todos los municipios devengando simultáneamente. Las pruebas de carga y los SLOs se definen contra el perfil de pico. **[PENDIENTE]** Caracterizar el perfil de pico con datos reales de los pilotos (razón pico/promedio).

## 2. Escalamiento horizontal

- La API debe ser **sin estado (stateless)**: ninguna sesión ni dato de trabajo puede residir en la instancia que atiende la petición. Esto habilita escalar horizontalmente agregando instancias tras un balanceador de carga.
- Prohibido cualquier diseño que ate una sesión de usuario a un servidor específico (sticky sessions como requisito estructural).
- El estado vive en la base de datos y, cuando corresponda, en un almacén de caché compartido.

## 3. Multitenancy por schema a escala

La multitenancy por schema (decisión asentada) tiene dos puntos críticos conocidos a cientos de tenants, ambos con solución conocida que el proveedor debe **demostrar**, no declarar:

1. **Migraciones de esquema.** Se ejecutan schema por schema; a 345 tenants, un deploy mal diseñado puede tomar horas. Exigencia: estrategia de migraciones documentada con tiempo total demostrado en prueba (N schemas sintéticos), migraciones compatibles hacia atrás para permitir despliegue sin ventana de corte total.
2. **Pooling de conexiones.** Configuración explícita del pool frente a cientos de schemas; evidencia de comportamiento bajo concurrencia multi-tenant en las pruebas de carga.

## 4. Capa de lectura separada para reportería agregada

- Ninguna consulta que cruce schemas (reportería nacional, SINIM, analítica) puede ejecutarse contra la base transaccional.
- Exigencia: capa de lectura separada (réplica de lectura o data warehouse) alimentada desde la base transaccional, con retraso máximo de actualización definido. **[PENDIENTE]** Definir la frescura requerida por caso de uso (SINIM tolera horas; un tablero DAF quizás no).
- Esta capa es además el punto de consumo natural para la categoría de reportería del ecosistema de terceros (ver `decisiones-macro-stack.md`, sección 7): los scopes de lectura de terceros apuntan aquí, no a la transaccional.

## 5. Latencia en cadenas de validación entre módulos

El mandato API (ver `contrato-api-first.md`) implica que una operación puede encadenar llamadas entre módulos (Adquisiciones → Presupuestos → Contabilidad). Las latencias de una cadena síncrona se suman; a escala, esto es el riesgo de rendimiento principal del diseño por contratos.

Exigencia sobre los contratos: **cada validación declarada en un contrato debe clasificarse** como:

| Clase | Comportamiento | Ejemplo |
|---|---|---|
| Síncrona bloqueante | La operación no procede sin respuesta del proveedor | Disponibilidad presupuestaria al comprometer |
| Asíncrona | La operación procede; la validación confirma o revierte después | Notificación de devengado a Contabilidad |
| Cacheada | Se valida contra dato local con frescura declarada | Catálogos, tablas de referencia |

**[PENDIENTE]** Clasificar las validaciones del piloto Compra Ágil (insumo: los 12 sub-pasos y el catálogo de reglas bloqueantes/asesoras de la ficha QA).

## 6. SLOs exigibles en las bases

Objetivos de nivel de servicio explícitos, medidos en el ambiente de recepción y luego en producción:

| Indicador | Objetivo de referencia | Nota |
|---|---|---|
| Latencia p95, operaciones transaccionales | < 500 ms | Medida en el borde de la API, perfil de pico |
| Latencia p95, consultas de lectura simples | < 300 ms | Ídem |
| Disponibilidad mensual | ≥ 99,5% | **[PENDIENTE]** Validar contra el estándar de servicios del Estado y el costo asociado |
| Error rate 5xx | < 0,1% | Sostenido |

Los valores exactos son de referencia y deben calibrarse antes de las bases; lo no negociable es que **existan, sean medibles y tengan consecuencias contractuales** (multas o retenciones por incumplimiento sostenido). **[PENDIENTE]** Calibración final de valores y régimen de consecuencias.

## 7. Pruebas de carga como criterio de aceptación

- La recepción del sistema incluye pruebas de carga ejecutadas por el proveedor **en presencia de la contraparte técnica**, contra el escenario de la sección 1: N municipios concurrentes con perfil de pico, no de promedio.
- El plan de pruebas (herramienta, escenarios, datos sintéticos, criterios de éxito ligados a los SLOs de la sección 6) forma parte de los entregables y se aprueba antes de ejecutarse.
- Mismo principio que el resto de la recepción: cumple o no cumple, sin "rendimiento razonable" difuso.

## 8. Observabilidad exigida

El sistema debe entregarse instrumentado; la observabilidad no es un agregado posterior:

1. **Métricas** por endpoint y **por tenant**: latencia, throughput, tasa de error. Debe poder responderse "qué municipio genera qué carga" sin trabajo forense.
2. **Trazas distribuidas** que sigan una operación a través de las cadenas de módulos (imprescindible para diagnosticar la sección 5).
3. **Logs estructurados** con identificador de tenant y de correlación, sin datos personales ni secretos en el log (lección directa del hallazgo de JWT en logs del sistema anterior).
4. Tableros operativos entregados como parte del sistema, no como servicio aparte.

## 9. Eventos y sistema de notificaciones

Las notificaciones se construyen sobre los eventos de dominio que cada módulo declara en su contrato (ver `contrato-api-first.md`, sección 3.4). Diseño exigible:

1. **Los módulos no notifican: emiten eventos.** Adquisiciones emite `PurchaseOrderIssued`; no sabe ni necesita saber quién quiere enterarse. Esto preserva el mandato API.
2. **Servicio transversal de notificaciones.** Un servicio único se suscribe a los eventos de todos los módulos y resuelve la entrega según reglas de suscripción por rol, unidad y municipio.
3. **Canales de entrega desacoplados del evento:** bandeja en la aplicación, correo electrónico, y canales formales (DocDigital) cuando el hecho lo exija. **[PENDIENTE]** Matriz evento → canal → destinatario por rol, derivable de las fichas de flujo.
4. **El mismo mecanismo sirve al ecosistema.** Los eventos expuestos como webhooks con scopes M2M permiten que sistemas municipales externos y terceros reaccionen a hechos de SGM sin polling. Un solo diseño cubre notificación a personas e integración de sistemas. **[PENDIENTE]** Decisión de mecanismo de entrega a sistemas (webhooks, cola, ambos) — mismo pendiente del documento de contratos.

## 10. Flujos de proceso: BPMN como especificación, propiedades como exigencia

Los BPMN de la especificación son notación, no tecnología: definen el flujo que el sistema debe implementar, sin prescribir cómo. Las bases **no exigirán un motor BPM** (sería especificar marca en vez de propiedad y acoplaría la implementación a una herramienta); exigirán las propiedades que un flujo bien implementado debe tener, sea con motor o con máquinas de estado nativas:

1. **Estados y transiciones explícitos.** Los estados de cada flujo como conjunto declarado; las transiciones permitidas como estructura definida, no dispersas en lógica condicional.
2. **Estado consultable vía API.** Para cualquier instancia de flujo (una SOLPED, una orden): en qué paso está, quién la tiene asignada, hace cuánto tiempo.
3. **Transiciones auditadas.** Cada cambio de estado registra quién, cuándo, desde qué estado y hacia cuál, inmutablemente.
4. **Timers y escalamientos de negocio configurables.** Plazos por paso (p. ej. cotización sin respuesta en N días hábiles → escalamiento) definibles sin cambio de código. Es lo que un motor BPM regala y una implementación nativa debe construir; se exige explícitamente para que no se omita.
5. **Versionamiento de procesos en vuelo.** Regla definida para instancias a mitad de flujo cuando el proceso cambia (terminan con la versión anterior o migran con criterio explícito). **[PENDIENTE]** Definir la regla por tipo de flujo.
6. **Trazabilidad contra la especificación como criterio de recepción.** El comportamiento del sistema debe ser demostrable contra el BPMN de la especificación: mismo conjunto de pasos, mismas decisiones, mismos cruces de módulo. Cumple o no cumple.

Lectura de diseño que conecta con los contratos: en los BPMN, cada cruce de carril entre unidades que corresponden a módulos distintos es un borde de contrato. El recorrido de los 12 sub-pasos de Compra Ágil identifica simultáneamente los contratos (documento API-first) y los estados/transiciones de esta sección.

## 11. Resumen: qué va a las bases

Todo lo anterior se traduce en cláusulas de bases bajo la lógica de propiedades verificables:

1. API sin estado, escalable horizontalmente (demostrable en prueba de carga).
2. Estrategia de migraciones multi-tenant documentada y demostrada.
3. Capa de lectura separada para consultas agregadas.
4. Clasificación síncrona/asíncrona/cacheada declarada en cada contrato de módulo.
5. SLOs con valores, medición y consecuencias contractuales.
6. Pruebas de carga con perfil de pico como condición de recepción.
7. Observabilidad por tenant instrumentada de fábrica.
8. Notificaciones sobre eventos de dominio, con servicio transversal y canales desacoplados; eventos expuestos como webhooks con scopes para sistemas externos.
9. Flujos con estados y transiciones explícitos, estado consultable vía API, transiciones auditadas, timers configurables y trazabilidad demostrable contra el BPMN de la especificación — sin exigir motor BPM.

## 12. Pendientes abiertos

1. **[PENDIENTE]** Perfil de pico con datos reales de pilotos (razón pico/promedio).
2. **[PENDIENTE]** Frescura requerida de la capa de lectura por caso de uso.
3. **[PENDIENTE]** Clasificación de validaciones del piloto Compra Ágil (síncrona/asíncrona/cacheada).
4. **[PENDIENTE]** Calibración final de SLOs y régimen de consecuencias contractuales.
5. **[PENDIENTE]** Validación del objetivo de disponibilidad contra estándares de servicios del Estado.
6. **[PENDIENTE]** Matriz evento → canal → destinatario por rol (derivable de las fichas de flujo).
7. **[PENDIENTE]** Mecanismo de entrega de eventos a sistemas externos (webhooks, cola, ambos).
8. **[PENDIENTE]** Regla de versionamiento de procesos en vuelo, por tipo de flujo.
