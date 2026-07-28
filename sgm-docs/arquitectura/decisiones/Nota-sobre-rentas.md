# Nota de decisión — Módulo Rentas en el alcance de SGM

**Proyecto:** SGM — Sistema de Gestión Municipal
**Para:** Jefatura
**De:** Jaime Hernández
**Fecha:** julio 2026
**Tipo:** decisión de alcance, previa a las bases de licitación

---

## 1. La pregunta

El corpus de especificación cubre cinco módulos: Adquisiciones, Presupuestos, Contabilidad, Tesorería y RRHH/Remuneraciones. **Rentas no está**, y no está en ninguna parte: no fue construido por el proveedor anterior y tampoco aparece en el levantamiento de procesos de Magenta.

La pregunta no es si Rentas es importante. Es si entra en esta licitación, y en qué forma.

## 2. El replanteo que hace más fácil la decisión

Formulada como *«¿agregamos un sexto módulo?»*, la respuesta obvia es no: ya hay cinco módulos, una plataforma transversal y un corpus que recién se consolidó.

Pero esa no es la pregunta real. La pregunta real es:

> **¿Especificamos los contratos de ingreso municipal con o sin conocer su origen?**

Los tres módulos que ya tenemos escritos dependen de datos que nacen en Rentas:

- **Contabilidad** registra el devengo de ingresos *«al confeccionar los roles las unidades generadoras de la contribución»* (proceso 30 del levantamiento). La unidad generadora principal es Rentas.
- **Tesorería** cobra órdenes de ingreso que otro produce, y su decisión D-3 dejó explícitamente fuera a esos productores. Rentas es el mayor de ellos.
- **Presupuestos y RRHH** aplican el límite del 42% del art. 67 LOCM sobre los **ingresos propios percibidos**. Rentas es donde nacen.

Si se especifican esos contratos sin tener a la vista de dónde viene el ingreso, se especifican mal. Y rehacerlos después cuesta bastante más que mirarlos ahora.

## 3. Por qué Rentas pesa más de lo que parece

Según la composición de **Ingresos Propios Permanentes** que publica SINIM, estos se integran con: impuesto territorial, permisos de circulación de beneficio municipal, patentes de beneficio municipal, derechos de aseo, otros derechos, rentas de la propiedad, licencias de conducir, multas e intereses, concesiones, patentes acuícolas, patentes mineras y casinos.

**De esos doce componentes, Rentas administra directamente al menos ocho.** Quedan fuera de su ámbito el impuesto territorial (SII y Tesorería General), las multas del Juzgado de Policía Local, y casinos.

La consecuencia es directa: **el validador legal más citado de todo el corpus —el 42% del art. 67— se calcula sobre una base cuya mayor parte se origina en el módulo que no existe.**

## 4. Qué contendría el módulo

Reconstrucción a partir del DL 3.063 sobre Rentas Municipales y de práctica municipal. **No hay levantamiento de procesos: esto es propuesta, no hallazgo.**

**Patentes municipales.** Comerciales, industriales, profesionales y de alcoholes. Base: capital propio tributario declarado al SII. Tasa fijada por cada municipio **dentro del rango legal de 2,5‰ a 5‰**, con mínimo de 1 UTM y tope de 8.000 UTM anuales (art. 24 DL 3.063). Pago en dos cuotas, enero y julio. Incluye distribución del capital propio entre comunas con sucursales, patentes provisorias, traslados, transferencias y caducidad. Las de alcoholes se rigen además por la Ley 19.925, con categorías, límites por población y otorgamiento sujeto a acuerdo del Concejo.

**Permisos de circulación.** Padrón, tasación según lista de valores, vencimientos legales, exigencia de revisión técnica y seguro vigentes, y el aporte del 62,5% al Fondo Común Municipal.

**Derechos municipales.** Aseo domiciliario con su régimen de exenciones, publicidad y propaganda, ocupación de bien nacional de uso público, ferias y comercio en vía pública, certificaciones.

**Ordenanza local de derechos.** El instrumento que fija los montos, con acuerdo del Concejo conforme al art. 65 letra c) de la LOCM, y vigencia anual.

**Concesiones, fiscalización y cobranza.** Concesiones de bienes municipales, inspección y clausura, morosidad y prescripción.

## 5. Las cinco cosas que Rentas cambia en la arquitectura

Estas son las implicancias que hacen que la decisión no sea solo de tamaño.

**5.1. Es el único módulo cuya contraparte es el ciudadano, no un funcionario.** Los cinco módulos actuales son internos: los usa la DAF, Adquisiciones, RRHH. Rentas atiende al contribuyente. Eso arrastra capacidades transversales que hoy no están especificadas en ninguna parte: identidad ciudadana, notificación con efecto legal, reclamación y debido proceso, prescripción de la deuda.

Es también, por la misma razón, **donde está el mayor retorno visible de la digitalización**: el vecino que paga su patente en línea ve el sistema; el que hace un devengo contable, no.

**5.2. Rompe la taxonomía de parámetros normativos.** La especificación actual reconoce dos clases: parámetros de mandato propio de SUBDERE, y parámetros con respaldo de órgano rector nacional. La tasa de patente no es ninguna de las dos: es un **rango fijado por ley nacional cuyo valor concreto determina el Concejo de cada municipio por ordenanza**. Es una tercera clase —autoridad local, acotada nacionalmente, distinta por municipio— que obliga a extender el modelo.

**5.3. Introduce dependencias externas de cálculo, no solo de reporte.** El resto del corpus depende de terceros para *informar* (CGR, SINIM, DIPRES). Rentas depende del SII y del Registro Civil para **calcular lo que debe cobrar**: capital propio tributario, avalúos, tasación vehicular, registro de vehículos motorizados. Sin esas fuentes no hay monto. Es una clase de dependencia más dura que todas las anteriores.

**5.4. Reabre la decisión D-3 de Tesorería.** Ese plan estableció que SGM no incluye los sistemas de recaudación por tributo y solo consume sus órdenes de ingreso. Es una reducción de alcance grande y bien fundada —muchos municipios ya tienen sistemas de patentes operando—, pero **traslada todo el riesgo del ingreso municipal a un solo punto**: el contrato de entrada de órdenes de ingreso. Si Rentas entra, D-3 se reformula. Si no entra, D-3 debe asumirse con plena conciencia de lo que concentra.

**5.5. Trae un ciclo que ningún otro módulo tiene:** cobranza, morosidad y prescripción, con calendario tributario propio y fechas legales duras.

## 6. Lo que cuesta

Con honestidad, porque la decisión no se sostiene si se subestima.

**Es el único módulo que parte de cero.** Los otros cinco tenían al menos una de dos anclas: levantamiento de procesos o implementación previa en el sistema anterior. Rentas no tiene ninguna. Todo el levantamiento hay que hacerlo, y validarlo con municipios.

**Agrega capacidades transversales, no solo funcionalidad.** Identidad ciudadana, notificación legal y debido proceso son servicios de plataforma que hoy no existen y que benefician a Rentas casi en exclusiva.

**Aumenta la superficie de integración** con dos organismos nuevos y críticos, en un corpus que ya tiene más de doce integraciones con el Estado.

**Puede desplazar sistemas que funcionan.** Es el ámbito donde más municipios tienen soluciones propias operativas. Sustituirlas tiene costo político y de migración.

## 7. Lo que cuesta no hacerlo

**Los contratos de ingreso se especifican a ciegas.** Contabilidad, Tesorería y Presupuestos definen ahora cómo entra el ingreso al sistema. Sin conocer su origen, ese diseño se hace por inferencia.

**La base del 42% queda fuera de control.** Un validador con consecuencia legal —responsabilidad personal y solidaria del art. 81— dependería de datos producidos por sistemas que SUBDERE no especifica ni controla.

**SGM no sería la fuente de verdad de la gestión municipal.** Sería la fuente de verdad del gasto. El ingreso propio, que es la mitad de la gestión financiera de un municipio, quedaría afuera.

## 8. Opciones

| # | Opción | Qué implica | Costo |
|---|---|---|---|
| **a** | **Incluir Rentas completo en esta licitación** | Sexto módulo con levantamiento, especificación e implementación | Alto. Retrasa las bases; el levantamiento parte de cero |
| **b** | **Especificar completo, implementar por fases** | Modelo de datos y contratos completos desde el inicio; implementación comienza por patentes y permisos, el resto con condición de salida declarada | Medio. Coherente con la regla ya adoptada: *no se recorta el modelo de datos, se recorta la implementación* |
| **c** | **Fuera de alcance, con contrato de entrada de calidad de módulo** | Rentas no se construye, pero el contrato de entrada de órdenes de ingreso se especifica con el rigor de un módulo, incluyendo el inventario real de giradores | Bajo. Mantiene D-3, pero exige cerrar bien el punto que hoy concentra el riesgo |
| **d** | **Fuera de alcance sin más** | Situación actual por omisión | Aparentemente cero, realmente el más caro: es lo que ocurre si no se decide |

## 9. Recomendación

**Opción (b)**, por tres razones:

1. **Es la aplicación de una regla que ya adoptamos.** El corpus establece que un módulo reducido no es un módulo más chico sino uno con superficie de contrato definida, y que el modelo de datos no se recorta porque recortarlo es lo que obliga a migrar después. Rentas es el caso que esa regla estaba esperando.

2. **El costo marginal de especificar ahora es bajo; el de rehacer después, no.** Estamos escribiendo los contratos de ingreso en estas semanas. Mirarlos con Rentas a la vista cuesta trabajo de especificación. Rehacerlos con el sistema construido cuesta una licitación.

3. **Deja la decisión de implementación abierta y con datos.** Si al levantar procesos resulta que los municipios tienen sistemas de patentes sólidos, la fase de implementación se difiere con fundamento. Pero el contrato ya estará bien definido.

**Lo que la opción (b) no resuelve** y hay que decir: sigue exigiendo levantar procesos desde cero, y sigue agregando las capacidades transversales de atención al ciudadano. No es gratis, es ordenado.

## 10. Qué se necesita para decidir

| Insumo | Para qué | Quién |
|---|---|---|
| Postura sobre alcance de la licitación | Es la decisión de fondo | Jefatura |
| Inventario de sistemas de Rentas en municipios | Saber cuánto se desplazaría y cuánto se construiría | DM + municipios piloto |
| Peso relativo de cada componente en el IPP | Priorizar qué entra primero en la implementación | Datos SINIM |
| Verificación de interfaces con SII y Registro Civil | Sin ellas no hay cálculo posible | Equipo + organismos |

## 11. Advertencias sobre esta nota

1. **El alcance del módulo descrito en §4 es reconstrucción, no levantamiento.** Proviene del DL 3.063 y de práctica municipal general. Ningún proceso de Rentas está levantado ni validado con municipios.
2. **Los datos normativos citados están verificados en fuente**, salvo indicación contraria: art. 24 del DL 3.063 para base, tasa y topes de patente; art. 65 letra c) de la LOCM para el acuerdo del Concejo sobre derechos, permisos y concesiones; composición de Ingresos Propios Permanentes según SINIM.
3. **No se ha cuantificado el peso de cada componente del IPP.** Se sabe qué lo compone, no en qué proporción. Ese dato existe en SINIM y conviene tenerlo antes de priorizar.
4. **Esta nota no propone un plan de trabajo.** Si la decisión es (a) o (b), el plan de Rentas se construye después, con la misma estructura de los otros cinco.
