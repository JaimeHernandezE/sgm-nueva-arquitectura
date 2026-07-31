# Alcance mínimo de módulos adyacentes

**Proyecto:** SGM — Sistema de Gestión Municipal
**Pregunta:** para que **Adquisiciones y Presupuestos** sean completamente funcionales, ¿qué se necesita como mínimo de Contabilidad, Tesorería y RRHH?
**Versión:** 0.2 (borrador para revisión interna)
**Estado:** propuesta de alcance, no validada con DM
**Fecha:** julio 2026

**Cambios v0.2:** renumeración de pendientes a la serie transversal **X-nn**, conforme al registro único `arquitectura/decisiones/pendientes.md`. Correspondencia: P-18 → **X-78**, P-19 → **X-79**, P-20 → **X-80**, P-21 → **X-81**. **X-80 consta cerrado** en el registro: la decisión D-1 del plan de RRHH incorpora el motor de liquidación al alcance; se conserva aquí el enunciado original como antecedente de esa decisión.

---

## 1. Método: tres tipos de dependencia

No todas las dependencias cuestan lo mismo. Distinguirlas evita construir de más y, sobre todo, evita descubrir tarde lo que no se puede evitar construir.

| Tipo | Qué es | Se puede reducir | Ejemplo |
|---|---|---|---|
| **A. Dato de referencia** | Catálogo de solo lectura que otro módulo mantiene | Sí — basta un registro mínimo, incluso cargado | Proveedores, estructura organizacional |
| **B. Magnitud calculada** | Cifra agregada que otro módulo debe producir correctamente | Parcialmente — se puede reducir el proceso, no el número | Ingresos propios percibidos del año anterior |
| **C. Hecho transaccional** | Evento sin el cual el flujo no cierra ni jurídica ni contablemente | **No** | Devengo contable; pago |

La regla operativa: **las dependencias de tipo C definen el piso irreducible de la licitación.** Las de tipo B admiten reducción de alcance pero no de exactitud. Las de tipo A son las únicas realmente baratas.

---

## 2. Distinción previa: módulos adyacentes ≠ servicios transversales

Parte de lo que parece "necesitamos algo de otro módulo" no pertenece a ningún módulo: son servicios de plataforma que **cualquier** módulo requiere y que, si se atribuyen a Contabilidad o a RRHH, quedan mal ubicados y peor especificados.

| Servicio transversal | Contenido | Quién lo consume |
|---|---|---|
| **Organización** | Direcciones, departamentos, unidades; unidad ejecutora; vigencia temporal de la estructura | Presupuestos (fichas por área), Adquisiciones (solicitante), RRHH |
| **Identidad y autorización** | Usuarios, roles por operación, segregación de funciones, subrogancias con expiración | Todos |
| **Expediente y documentos** | Adjuntos, folios, firma electrónica avanzada, integración FirmaGob | Todos |
| **Parámetros normativos** | `NormativeParameter` con vigencia temporal y clase de autoridad | Todos |
| **Terceros** | Proveedores, beneficiarios, personas naturales y jurídicas | Adquisiciones, Presupuestos, Tesorería, Contabilidad |
| **Auditoría** | Log inmutable con identificación nominal y reconstrucción histórica | Todos |

**Consecuencia para las bases:** estos seis servicios se especifican una vez, como plataforma, y no como parte del alcance de un módulo. Si se dejan implícitos, cada módulo trae el suyo y el resultado es un ERP con seis registros de proveedores.

> **PENDIENTE X-78:** Definir la lista cerrada de servicios transversales y su propiedad, antes de escribir el alcance por módulo. Sin esto el alcance de cada módulo queda mal delimitado por arriba.

---

## 3. Contabilidad

### 3.1 Por qué no admite reducción en su núcleo

El devengo no es un registro administrativo: es una de las cuatro fases legales del gasto del DL 1.263, y su contrapartida es un asiento bajo la normativa NICSP-CGR Sector Municipal (Resolución CGR N° 3, de 2020, vigente desde el 1 de enero de 2021). Tres consecuencias:

1. **La cadena de compromiso de Presupuestos termina en un asiento.** Sin contabilidad no hay devengo, y sin devengo la cadena CDP → preobligación → obligación queda abierta. Adquisiciones tampoco cierra: su recepción conforme dispara el devengo.
2. **El BEP exige `obliga_deven` y `deuda_exigible`.** Son magnitudes contables. Un municipio que no las puede informar incumple una obligación de reporte.
3. **La apertura del ejercicio (26.2.8) exige registrar saldos de activo, pasivo y patrimonio**, más el traspaso de deudores a ingresos por percibir y de acreedores a Deuda Flotante. Eso presupone un balance, no un registro parcial.

**Conclusión:** el libro mayor, el plan de cuentas NICSP y los procedimientos de devengo, apertura y cierre son **atómicos**. No existe media contabilidad.

### 3.2 Núcleo mínimo

- Plan de cuentas NICSP-CGR cargado y **versionado** (Oficio CGR N° E11061/2020 y su complemento E59541/2020)
- Mapeo clasificador presupuestario ↔ plan de cuentas (el Manual de Imputaciones; capa 3 del Anexo A del plan de Presupuestos)
- Libro diario y mayor con partida doble
- Procedimientos del Manual de Procedimientos Contables (Oficio CGR N° E59549/2020) que tocan el flujo: devengo de gasto, devengo de ingreso, apertura y cierre del ejercicio
- Deuda Flotante e ingresos por percibir como saldos consultables
- **Recepción de documentos tributarios electrónicos (DTE)** — ver §3.4

### 3.3 Diferible a una segunda fase

- Estados financieros elaborados y notas
- Conciliación bancaria automatizada
- Depreciación y revalorización de activo fijo
- Informes contables no exigidos por CGR/SINIM en el corto plazo

### 3.4 Dependencia probablemente subestimada: facturas electrónicas

El *three-way match* de Adquisiciones (orden ↔ recepción ↔ factura) y el devengo requieren la factura. En Chile eso significa recibir y aceptar DTE, con los plazos de la Ley 19.983 y el registro de aceptación o reclamo. **No aparece en el levantamiento de Presupuestos ni está en el modelo preliminar de Adquisiciones.**

Si nadie recibe facturas, la etapa 4 de Adquisiciones no cierra y el devengo no tiene documento sustentatorio.

> **PENDIENTE X-79:** Determinar quién posee la recepción y aceptación de DTE —Contabilidad, Tesorería o servicio transversal— y qué integración requiere (SII, plataformas de recepción). Es dependencia de tipo C para Adquisiciones.

### 3.5 Inventario: dependencia real, no opcional

El proceso 28 del levantamiento (*Contabilidad: Inventario*) establece que **al registrarse la factura, en el devengamiento, se debe registrar el bien** con número único, descripción, ubicación, fecha, valor, vida útil e información del proveedor y de la compra.

Es decir: el devengo de una adquisición de bienes **dispara** el alta de inventario. Es un acoplamiento directo entre Adquisiciones, Presupuestos y Contabilidad que no puede diferirse sin romper la trazabilidad exigida por la normativa de contabilidad general.

**Mínimo:** alta del bien en el devengo, con los campos del proceso 28, y registro de traslados. **Diferible:** depreciación, revalorización, baja con decreto (aunque el proceso 28 la describe), catastro de inmuebles.

---

## 4. Tesorería

### 4.1 Distinción clave

Hay que separar dos cosas que suelen confundirse bajo el nombre "Tesorería":

| | Alcance | ¿Mínimo? |
|---|---|---|
| **Percepción y pago como hechos presupuestarios** | Registrar que se percibió un ingreso y se pagó una obligación, con su imputación | **Sí — tipo C** |
| **Sistemas de recaudación por tributo** | Patentes comerciales, derechos de aseo, permisos de circulación, convenios de pago, cobranza | **No — diferible** |

Lo primero es pequeño y obligatorio. Lo segundo es grande y, en muchos municipios, ya existe en sistemas propios que pueden mantenerse e interfacear. Confundirlos infla el alcance de la licitación sin necesidad.

### 4.2 Núcleo mínimo

- **Registro de percepción de ingresos** con imputación a cuenta 115, alimentando `ingresos_percib` e `ingresos_por_percib` del BEP
- **Registro de pagos** vinculados a la obligación y al devengo, para cerrar la cadena de compromiso — es la etapa 5 de Adquisiciones bajo el patrón de etapa observada
- **Saldos de caja y bancos**, incluido el saldo final de caja (subtítulo 35), que el Manual de Imputaciones marca como sujeto a acuerdo del Concejo
- **Ingresos propios percibidos del ejercicio anterior**, agregados por origen — base del límite del 42% del art. 67 LOCM
- **Carga de percibidos históricos** para la puesta en marcha: el primer ejercicio en SGM necesita el año anterior, que vino de otro sistema (ver P-11 del plan de Presupuestos)
- Fondo Común Municipal: aportes y percepciones, requeridos por el informe trimestral del art. 29 letra d)

### 4.3 Diferible

- Cobranza y gestión de morosidad
- Convenios de pago
- Módulos de recaudación por tipo de tributo
- Portal de pago en línea

### 4.4 Observación

El límite del 42% se calcula sobre **ingresos propios percibidos el año anterior**. Es una magnitud de tipo B: se puede reducir el proceso que la produce, pero si el número está mal, un validador bloqueante de Presupuestos bloquea mal. La exactitud de esta cifra no es negociable aunque el módulo sea reducido.

---

## 5. RRHH y Remuneraciones

### 5.1 Por qué Presupuestos no funciona sin esto

Confirmado en el levantamiento y en la normativa:

- **Art. 67 LOCM:** gasto anual en personal ≤ 42% de los ingresos propios percibidos el año anterior
- **Art. 2 Ley 18.883:** gasto en cargos a contrata ≤ 20% del gasto en remuneraciones de la planta
- **Tarea 26.2.4:** la Sección de Personal pronostica jubilaciones, concursos y necesidad de personal a contrata y a honorarios; con esa base se ajusta el presupuesto para no exceder los porcentajes legales
- **Art. 29 letra d) LOCM:** informe trimestral al Concejo sobre cotizaciones previsionales y asignaciones de perfeccionamiento docente

Los dos primeros son **validadores bloqueantes en formulación**. Sin RRHH no hay base de cálculo y los validadores no se pueden implementar.

### 5.2 Distinción clave: dotación y costo ≠ planilla

| | Alcance | ¿Mínimo? |
|---|---|---|
| **Dotación y costo por imputación** | Cuántos funcionarios por estamento, con qué costo proyectado, imputado a qué cuenta | **Sí — tipo B, obligatorio** |
| **Motor de liquidación de remuneraciones** | Cálculo individual de haberes y descuentos según cuatro estatutos | Depende — ver §5.4 |

Los validadores del 42% y 20% necesitan **agregados por imputación**, no liquidaciones individuales. Esa es la reducción legítima.

### 5.3 Núcleo mínimo

- **Dotación por estamento**, distinguiendo planta, contrata, honorarios y Código del Trabajo, con su imputación presupuestaria: `21.01` planta, `21.02` contrata, `21.03` otras remuneraciones, y dentro de esta última `2103001` honorarios a suma alzada, `2103002` asimilados a grado, `2103005` suplencias y reemplazos
- **Costo proyectado por imputación**, para alimentar la ficha de personal de la formulación
- **Catálogo de componentes remuneratorios** con su imputación y fuente legal, según el cuadro de SUBDERE, incluyendo la marca de componentes **extrapresupuestarios** que deben excluirse de la base de cálculo
- **Estado de cotizaciones previsionales** y de asignaciones de perfeccionamiento docente, para el informe del art. 29 d)
- Proyección de jubilaciones y concursos para 26.2.4

### 5.4 La decisión que hay que tomar

Si el motor de liquidación de remuneraciones **no** entra en esta licitación, entonces el devengo del subtítulo 21 —típicamente la mayor partida de gasto de un municipio— ingresa a SGM desde un sistema externo. Eso es viable, pero implica:

- Un contrato de entrada bien especificado y validado, no una carga manual
- Que la exactitud del 42% y del 20% dependa de un sistema que SUBDERE no controla
- Que la cadena de compromiso del gasto en personal tenga un tratamiento distinto al del resto del gasto

> **PENDIENTE X-80 — CERRADO** (ver D-1 del plan de RRHH). Enunciado original: Decidir si el motor de liquidación de remuneraciones entra en el alcance de esta licitación. Si no entra, especificar el contrato de entrada del devengo de remuneraciones con el mismo rigor que un contrato interno, y evaluar el riesgo de que los validadores legales dependan de una fuente externa.

---

## 6. Resumen de alcance mínimo

| Módulo | Núcleo no diferible | Diferible | Tipo dominante |
|---|---|---|---|
| **Contabilidad** | Plan de cuentas NICSP versionado; libro diario y mayor; devengo de gasto e ingreso; apertura y cierre; Deuda Flotante e ingresos por percibir; recepción de DTE; alta de inventario en el devengo | Estados financieros elaborados; conciliación bancaria; depreciación; catastro de inmuebles | **C** |
| **Tesorería** | Percepción de ingresos con imputación; pago vinculado a obligación; saldos de caja y bancos; ingresos propios percibidos del año anterior; carga de históricos; FCM | Recaudación por tributo; cobranza; convenios de pago; portal de pagos | **C** para pago, **B** para el 42% |
| **RRHH** | Dotación por estamento con imputación; costo proyectado; catálogo de componentes remuneratorios con fuente legal; cotizaciones previsionales; proyección de jubilaciones y concursos | Carrera funcionaria; capacitación; evaluación de desempeño; bienestar | **B** |
| **Transversales** | Organización; identidad y autorización; expediente y firma; parámetros normativos; terceros; auditoría | — | **A** y plataforma |

---

## 7. Cómo especificar un módulo reducido sin construir un callejón sin salida

Este es el riesgo real de la estrategia, y conviene nombrarlo antes de escribir las bases.

**Un módulo reducido no es un módulo más chico: es un módulo con una superficie de contrato definida.** Si se especifica como lista de funcionalidades recortada, el proveedor construye algo que funciona hoy y hay que rehacer cuando se complete. Si se especifica como **contrato completo con implementación parcial declarada**, la extensión posterior es incremental.

Tres reglas:

1. **El contrato se especifica completo aunque la implementación sea parcial.** El contrato de Tesorería declara todas las operaciones de percepción y pago que el modelo necesitará; la primera versión implementa las que se usan, y las demás responden con un código de no implementado explícito y versionado.
2. **El modelo de datos no se recorta.** Recortar el modelo es lo que obliga a migrar después. Recortar la interfaz de usuario y los procesos automatizados, no.
3. **Cada reducción se declara con su condición de salida.** "Conciliación bancaria diferida" debe venir con el criterio que la vuelve exigible, no quedar como omisión silenciosa.

> **PENDIENTE X-81:** Definir el mecanismo formal para declarar alcance parcial en las bases —qué se implementa, qué se contrata como contrato sin implementación, y bajo qué condición se activa— de modo que la reducción sea auditable y no una omisión.

---

## 8. Lo que esto implica para la licitación

Traducido a alcance: **la licitación no puede ser "Adquisiciones y Presupuestos"**. El conjunto mínimo funcional es:

```
Plataforma transversal          (6 servicios, §2)
+ Presupuestos                  (completo)
+ Adquisiciones                 (completo)
+ Contabilidad                  (núcleo, no reducible en el libro mayor)
+ Tesorería                     (percepción y pago; sin recaudación por tributo)
+ RRHH                          (dotación y costo; liquidación por decidir, X-80)
```

Los dos módulos "completos" descansan sobre tres módulos parciales y una plataforma, y esa es la unidad mínima que produce un municipio operable. Presentarlo así —y no como dos módulos más algunos apéndices— es también más defendible: describe un sistema que funciona en vez de dos piezas que necesitan andamios.

---

## 9. Pendientes abiertos en este documento

| ID | Pendiente | Bloquea |
|---|---|---|
| **X-78** | Lista cerrada de servicios transversales y su propiedad | Alcance por módulo |
| **X-79** | Propiedad de la recepción y aceptación de DTE; integración requerida | Adquisiciones etapa 4; devengo |
| **X-80** *(cerrado)* | ¿Entra el motor de liquidación de remuneraciones en esta licitación? | Alcance RRHH; exactitud de validadores del 42% y 20% |
| **X-81** | Mecanismo formal para declarar alcance parcial en las bases | Redacción de bases |

---

## 10. Advertencias sobre este documento

Escrito a partir de lo establecido en el plan de trabajo de Presupuestos v0.9 y de lo que consta del trabajo previo en Adquisiciones. **Tres áreas se apoyan en inferencia y requieren verificación antes de convertirse en alcance:**

1. **El detalle del núcleo contable** se deriva de los requisitos que Presupuestos y el BEP le imponen, no de una lectura del Manual de Procedimientos Contables (Oficio CGR N° E59549/2020), que todavía no se ha revisado. Puede haber procedimientos obligatorios adicionales.
2. **La dependencia de DTE** (X-79) es una inferencia a partir del *three-way match* y del requisito de documento sustentatorio del devengo. No está levantada como proceso en ninguna fuente disponible.
3. **La frontera de Tesorería** entre percepción y sistemas de recaudación no está validada con municipios. Es plausible y económicamente conveniente, pero es una propuesta, no un hallazgo.
