# Nodo de integración SUBDERE y su relación con la licitación SGM

> Documento de trabajo — arquitectura / decisiones estratégicas
> Estado: **borrador para discusión interna** (julio 2026).
> Destinatarios: Camila, Juan.
> Propósito: exponer opciones, riesgos y una recomendación sobre cómo tratar el nodo de integración frente a la licitación SGM. **No** es una decisión tomada.
> Pendientes nuevos propuestos al final (§9), a registrar en [`pendientes.md`](./pendientes.md) si el equipo acoge el documento.

---

## 1. De qué se trata

La propuesta en discusión es que SUBDERE disponga de un **nodo de integración** propio: una capa que (a) conecte entre sí las plataformas que SUBDERE opera hoy de forma desacoplada, (b) se conecte a PISEE donde corresponda, y (c) exponga servicios de datos a municipios y a privados proveedores de municipios, con niveles de acceso diferenciados y estándares fijados por SUBDERE. SGM sería **uno más** de los servicios publicados en ese nodo, no su razón de ser.

Sobre esa propuesta se ha planteado además una vía de ejecución: **incluir el nodo dentro de la licitación SGM**, dado que hoy no existe una línea presupuestaria que financie el nodo por separado.

Este documento separa dos preguntas que conviene no mezclar:

1. **¿Qué es el nodo y cómo se justifica?** (§2–§4)
2. **¿Cómo se ejecuta y se financia?** (§5–§8)

---

## 2. Delimitación frente a PISEE

El riesgo declarado por el equipo —«no queremos transformarnos en otro PISEE»— es legítimo y tiene una línea de deslinde precisa.

> **OAE** — Órgano de la Administración del Estado. Es el sujeto obligado de la Ley 21.180 y de sus normas técnicas (D.S. N° 10/2023 y D.S. N° 12/2023). Tanto SUBDERE como cada municipalidad son OAE, lo que resulta determinante para la delimitación que sigue.

| | PISEE (Red de Interoperabilidad) | Nodo SUBDERE (propuesta) |
|---|---|---|
| Naturaleza | Infraestructura de intercambio **OAE ↔ OAE** | Capa de integración y publicación **de un OAE específico** |
| Mandato | D.S. N° 12/2023 (NTI); operador designado (SGD) | Decisión institucional de SUBDERE |
| Dirección del dato | Cualquiera hacia cualquiera | De plataformas SUBDERE hacia consumidores autorizados |
| Consumidores | Organismos del Estado | Plataformas SUBDERE entre sí; municipios; privados proveedores de municipios |

**Regla de deslinde propuesta:** cuando el consumidor es **otro OAE**, el intercambio va por PISEE (vía nodo y Catálogo, conforme al D.S. N° 12/2023). El nodo SUBDERE **no** puede constituirse en vía paralela al Catálogo para tráfico OAE ↔ OAE — eso es precisamente lo prohibido por la NTI y ya está registrado como riesgo en [`brechas-estandarizacion-ntdee-pisee.md`](./brechas-estandarizacion-ntdee-pisee.md) §4.

**Zona gris a resolver (jurídica):** el municipio **es** OAE. Falta determinar si el consumo municipal de datos SUBDERE cae bajo la obligación de canalizarse por PISEE, o si se trata de provisión de servicios de un organismo a sus destinatarios institucionales por canal propio. Esta pregunta es previa a cualquier decisión técnica o de compra: si la respuesta es que debe ir por PISEE, buena parte del caso de uso externo del nodo se reduce.

Este documento **no** resuelve esa pregunta. La declara como pendiente bloqueante.

---

## 3. El caso de uso que sostiene la propuesta

En la conversación se identificó que el punto de partida real no es la oferta de datos hacia municipios, sino que **SUBDERE opera hoy un conjunto de plataformas desconectadas entre sí**. Esto reordena la justificación en un sentido favorable:

- **Caso de uso primario: integración interna.** Se justifica por sí solo, sin depender de demanda municipal comprobada. Es medible (integraciones manuales existentes, datos duplicados, trabajo redundante) y tiene fundamento normativo propio (obligación de interoperar bajo D.S. N° 12/2023).
- **Caso de uso secundario: oferta de servicios de datos.** Llega como consecuencia natural de haber ordenado internamente. Requiere demanda verificada y resolución de la zona gris de §2.

Consecuencia práctica: **el inventario de plataformas SUBDERE es el insumo que sostiene todo lo demás.** Sin él no hay dimensionamiento, no hay comparación de ofertas y no hay justificación presupuestaria defendible. Con él, el nodo se pide por derecho propio.

**Contenido mínimo del inventario:**

1. Plataformas en operación: propósito, responsable, tecnología, existencia y calidad de API.
2. Datos que cada una mantiene, con identificación de duplicaciones (típicamente: identificación de municipios, unidades, funcionarios).
3. Integraciones existentes, **incluidas las manuales** (carga de planillas, digitación, correo) — suelen ser mayoría y son el argumento más contundente.
4. Dos o tres integraciones dolorosas concretas, candidatas a caso piloto.

---

## 4. Naturaleza técnica del nodo: qué problema resuelve

La elección tecnológica depende de cuál de estos dos problemas predomine. Conviene resolverlo con el inventario en mano, no antes.

| Problema | Qué se necesita | Familia de herramientas |
|---|---|---|
| **Publicación y gobierno de APIs** — los servicios tienen contratos limpios y falta exponerlos con control de acceso, catálogo y observabilidad | Gateway de API, identidad federada, catálogo/portal, observabilidad | Kong, Apache APISIX, Tyk, Gravitee, WSO2; Keycloak para identidad; Backstage u homólogo para catálogo |
| **Integración de sistemas heterogéneos** — plataformas legadas sin API decente, formatos incompatibles, se requiere transformación y orquestación | Motor de integración / ESB | MuleSoft, Boomi, Talend, WSO2, Apache Camel |

Observaciones sobre la mención a **MuleSoft**:

- Es la referencia de mercado en el segundo problema, y el diagnóstico de plataformas desconectadas apunta efectivamente hacia ahí. La mención es pertinente.
- Es también el extremo caro del espectro y el de **mayor cautividad**: los flujos de integración quedan escritos en formato propietario, y migrar después implica rehacerlos. Esto tensiona directamente el principio de propiedad del código y portabilidad ya fijado en [`principios-no-negociables.md`](../licitacion/principios-no-negociables.md) §5.
- Si el volumen de integraciones resulta acotado, un motor abierto (Camel) más un gateway abierto cubre el mismo alcance sin encierro y a costo sustancialmente menor.
- Recomendación de método: **no evaluar productos antes del inventario.** La comparación MuleSoft / Kong / WSO2 / Camel solo tiene sentido con volumen y tipo de integraciones dimensionados.

**Nota:** la experiencia de integración SEM ↔ PISEE ya existente en el equipo es el antecedente más directo disponible para calibrar esfuerzo real y debiera incorporarse explícitamente al inventario como caso documentado.

---

## 5. Capacidad institucional: construir vs. operar

La conversación estableció que no hay capacidad interna suficiente, lo que orienta hacia adquirir producto o licitar. Conviene separar dos capacidades distintas, porque **no las resuelve el mismo instrumento**:

| Capacidad | ¿Existe hoy? | Cómo se resuelve |
|---|---|---|
| **Construir** el nodo | No | Producto comercial, licitación, o combinación |
| **Operar** el nodo de forma permanente | No | **No se resuelve comprando producto.** Requiere equipo, presupuesto recurrente o servicio gestionado contratado |

Riesgo central: un nodo de integración sin operación sostenida se degrada y termina siendo **una plataforma desconectada más**, sumada a las que ya hay. Es la ironía que la propuesta debe evitar explícitamente.

Cualquier presentación de la iniciativa a nivel de decisión presupuestaria debe llegar con el modelo de operación escrito: quién opera, con qué equipo, con qué presupuesto recurrente. Aunque la respuesta sea «servicio gestionado por el proveedor», debe estar declarada.

---

## 6. Opciones de ejecución

### Opción A — Nodo dentro de la licitación SGM

Alcance del nodo incorporado al mismo contrato y financiamiento que SGM.

**A favor:** resuelve el problema de financiamiento inmediato; una sola tramitación; el nodo nace alineado con SGM por construcción.

**Riesgos:**

1. **Finalidad del gasto (Contraloría).** Si se financia con la línea destinada a SGM un componente cuyo alcance real es integración transversal de plataformas SUBDERE ajenas a la gestión municipal, existe riesgo de observación por desviación de la finalidad del gasto. El riesgo no se materializa al momento de contratar, sino después, cuando el nodo esté integrando plataformas sin relación con SGM y se revise contra qué se financió. Debe ser conocido por quien decide.
2. **Concentración en un proveedor único.** El nodo sería la capa por la que pase toda la integración institucional futura. Si lo construye el adjudicatario de SGM dentro del mismo contrato, ese proveedor queda en el punto de control de toda la integración de SUBDERE, y cada plataforma que se sume después negocia desde posición débil. Tensiona [`principios-no-negociables.md`](../licitacion/principios-no-negociables.md) §5 (propiedad del código y portabilidad, sin dependencia irrestricta de proveedor único).
3. **Perfiles de oferente incompatibles.** SGM es dominio funcional municipal con normativa chilena encima (Ley 19.886 y siguientes). El nodo es infraestructura de integración. Los oferentes fuertes en uno rara vez lo son en el otro. Resultado probable: se filtran los especialistas en ERP, o el integrador toma el ERP como carga, o entran consorcios grandes que cotizan caro por poder con ambos.
4. **Acoplamiento de cronogramas.** Un contrato es un cronograma y un punto de falla. Si el nodo se atrasa arrastra a SGM; si SGM se atrasa, el nodo queda congelado y las plataformas siguen desconectadas.
5. **Presión sobre la calidad de las bases.** Hoy existe especificación madura de Adquisiciones y falta replicar el método a cuatro módulos. Sumar la especificación del nodo al mismo paquete presiona el estándar propio del equipo (dos equipos independientes deben poder construir lo mismo desde la spec). Lo más probable es que lo peor especificado sea el nodo, que es lo menos trabajado.
6. **Estatus institucional.** Un nodo que nace como anexo del ERP municipal se lee como accesorio de SGM y le cuesta después reclamar el rol transversal que la propuesta busca.

### Opción B — Licitaciones separadas, acopladas por contrato

SGM y nodo se licitan por separado. En las bases de SGM queda escrito que el sistema publica sus servicios contra una interfaz de integración definida por SUBDERE, con propiedades verificables y sin nombrar producto ni proveedor.

**A favor:** cada alcance con su justificación, su cronograma y su perfil de oferente; sin concentración de proveedor; sin riesgo de finalidad del gasto; el nodo nace con estatus propio.

**En contra:** requiere financiamiento propio para el nodo, que hoy no existe. Dos tramitaciones en vez de una.

**Variante:** licitación única con **lotes separados y adjudicación independiente**. Resuelve el costo de tramitación sin fundir alcances ni proveedores. Aplicable si la motivación fuera administrativa; **no** resuelve el problema de financiamiento, que es el caso real.

### Opción C — Capa de integración propia de SGM, extensible

SGM especifica y financia **solo la capa de integración que necesita por sí mismo**, con exigencia contractual de extensibilidad a servicios externos al SGM. El nodo, cuando obtenga financiamiento, no se construye de cero: se amplía sobre código propiedad de SUBDERE.

**Qué entra legítimamente por esta vía** (todo ya justificado por el diseño SGM vigente, sin forzar alcance):

- Capa de exposición de API con gobierno de acceso — mandato API-first, [`decisiones-macro-stack.md`](./decisiones-macro-stack.md) §1.
- Identidad y autorización M2M con scopes por módulo y municipio — **P-02**, prerequisito del modo à la carte.
- Catálogo de servicios publicados y portal de desarrollador — [`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md).
- Observabilidad de consumo por tenant — [`musts-arquitectura.md`](../especificacion/musts-arquitectura.md) §8.
- Borde **C-PISEE** — ya especificado en [`brechas-estandarizacion-ntdee-pisee.md`](./brechas-estandarizacion-ntdee-pisee.md) §5.4, pendiente **P-61**.

**Qué NO entra por esta vía** (alcance del nodo propiamente tal, requiere financiamiento propio):

- Adaptadores hacia otras plataformas SUBDERE.
- Orquestación de flujos ajenos al dominio SGM.
- Catálogo de datos institucionales de SUBDERE.
- Gestión de acceso de privados proveedores de municipios a datos no-SGM.

**A favor:** SGM financia lo que le corresponde y nada más, sin riesgo de finalidad del gasto; el nodo queda técnicamente viable sin dinero adicional hoy; la ampliación es contrato aparte sobre código propio, sin cautividad.

**En contra:** no entrega el nodo completo; requiere igualmente conseguir financiamiento propio para el alcance transversal; exige disciplina para que la extensibilidad sea propiedad verificable en recepción y no una promesa en las bases.

---

## 7. Recomendación

**Se recomienda no fundir el nodo en la licitación SGM: mantener licitaciones separadas (Opción B), avanzando entretanto por la Opción C.**

Fundamento:

1. Los riesgos de la Opción A no son de diseño sino institucionales y de largo plazo (finalidad del gasto, cautividad de proveedor, estatus del nodo). Se pagan después de adjudicar, cuando ya no son corregibles.
2. La Opción C entrega hoy, sin financiamiento adicional y sin forzar alcance, la base técnica sobre la cual el nodo se construye después. No se pierde tiempo.
3. La separación **no debilita** la propuesta del nodo: la fortalece. Un nodo con inventario propio, justificación de integración interna y modelo de operación declarado se pide por derecho propio y nace con el rol transversal que la propuesta busca.

**Principio operativo asociado:** SGM y nodo se mantienen desacoplados en el cronograma. SGM debe funcionar y recepcionarse con o sin nodo. El nodo, cuando exista, consume SGM como cualquier otro servicio publicado. Si el nodo va primero, SGM se enchufa el día uno; si va después, SGM ya está construido para enchufarse.

---

## 8. Financiamiento del nodo: dónde enfocar

El obstáculo real es que no existe línea que financie el nodo. Vías a explorar, en orden de solidez:

1. **Argumento de cumplimiento normativo.** El D.S. N° 12/2023 obliga a SUBDERE a interoperar; el diagnóstico interno indica que hoy no está en condiciones de hacerlo de forma sistemática. Los argumentos de cumplimiento suelen conseguir financiamiento con menos fricción que los de innovación.
2. **EVALTIC 2027.** Ventana natural. El inventario de plataformas (§3) **es** la justificación: número de plataformas, integraciones manuales, trabajo duplicado, datos contradictorios entre sistemas.
3. **Instrumentos de modernización del Estado / transformación digital**, distintos de la línea SGM.

En las tres vías, el insumo es el mismo: el inventario. Por eso conviene levantarlo ahora, con independencia de qué opción se elija — sirve para fundamentar el financiamiento propio si se consigue, y para delimitar con precisión qué es SGM y qué es nodo si no se consigue.

---

## 9. Pendientes propuestos

A registrar en [`pendientes.md`](./pendientes.md) si el equipo acoge el documento:

| ID propuesto | Título corto | Contraparte |
|---|---|---|
| **P-71** | Criterio jurídico: ¿el consumo municipal de datos SUBDERE debe canalizarse por PISEE (municipio = OAE) o admite canal propio? — bloqueante del alcance externo del nodo | jurídica / SGD |
| **P-72** | Inventario de plataformas SUBDERE: datos, integraciones existentes (incl. manuales), duplicaciones, candidatas a piloto | Camila / equipo |
| **P-73** | Decisión producto vs. capacidad: ¿el nodo es producto institucional con SLA y usuarios externos, o capacidad interna de integración? Define modelo de operación y presupuesto recurrente | jefatura |
| **P-74** | Propiedades verificables de extensibilidad de la capa de integración SGM (Opción C) para bases de licitación | arquitectura |

---

## 10. Qué decide este documento y qué no

**No decide:** qué producto tecnológico se adopta; si el nodo se financia y por qué vía; si el consumo municipal va por PISEE.

**Propone decidir:** que el nodo no se funda en el contrato de SGM; que SGM especifique su capa de integración con extensibilidad exigible; que el inventario se levante como paso inmediato, previo a cualquier evaluación de producto.

---

## Referencias

- [`brechas-estandarizacion-ntdee-pisee.md`](./brechas-estandarizacion-ntdee-pisee.md) — borde C-PISEE, deslinde con la Red de Interoperabilidad, P-61
- [`principios-no-negociables.md`](../licitacion/principios-no-negociables.md) §5 — propiedad del código y portabilidad
- [`decisiones-macro-stack.md`](./decisiones-macro-stack.md) §1, §3 — modos de consumo; propiedades, no marcas
- [`estandares-api.md`](../especificacion/estandares-api.md) §8 — planos de autenticación; P-02
- [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) §3 — criterio de nivel de detalle de especificación
- [`musts-arquitectura.md`](../especificacion/musts-arquitectura.md) §8 — observabilidad exigida
- [`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md) — portal de desarrollador y catálogo
- D.S. N° 12/2023 (NTI / PISEE); D.S. N° 10/2023 (NTDEE)
