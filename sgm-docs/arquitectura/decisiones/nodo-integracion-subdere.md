# Nodo de integración SUBDERE y su relación con la licitación SGM

> Documento de trabajo — arquitectura / decisiones estratégicas
> Estado: **borrador para discusión interna**, **v2** (julio 2026).
> Destinatarios: Camila, Juan.
> Propósito: exponer opciones, riesgos y una recomendación sobre cómo tratar el nodo de integración frente a la licitación SGM. **No** es una decisión tomada.
> Cambios de la v2: reformulación del propósito del nodo (§1–§2, el ecosistema privado como razón de ser distintiva); clases de dato y título jurídico (§4); bordes legales por resolver (§5); antecedente DT/LRE (§6); arquitectura de referencia propuesta (§8); brechas de especificación (§9); traducción a bases de licitación (§14). Pendientes ampliados (§15).
> IDs canónicos del nodo: **X-82…X-90** (no X-71…X-74 del registro DocDigital/Trato Directo).

---

## 1. De qué se trata

La propuesta en discusión es que SUBDERE disponga de un **nodo de integración** propio. La v1 de este documento lo describía como una capa con tres funciones equivalentes (integrar plataformas SUBDERE entre sí, conectarse a PISEE, exponer datos a municipios y privados). La conversación posterior precisó la jerarquía, y esa precisión ordena todo lo demás:

> **La razón de ser distintiva del nodo es habilitar que desarrolladores privados construyan aplicaciones para las municipalidades, integrándose con datos y servicios de SUBDERE.**

La integración interna de plataformas SUBDERE (SEM, SIFIM, SIM y otras) es un beneficio real y un caso de uso legítimo, pero **no es lo que justifica un nodo propio**: para el intercambio entre organismos del Estado ya existe PISEE. Lo que PISEE no puede hacer —y no podrá hacer, por diseño normativo— es dar acceso a un privado.

Esta precisión tiene tres consecuencias que recorren el documento:

1. **Desaparece la objeción de duplicación.** El nodo no compite con PISEE ni lo reemplaza: atiende a un consumidor que PISEE estructuralmente no admite (§2).
2. **El centro de gravedad se desplaza de lo técnico a lo jurídico.** La arquitectura es estándar y conocida; lo que no está resuelto es con qué título un privado accede y quién responde (§4–§5).
3. **El financiamiento debe argumentarse por partes.** Integración interna y exposición a privados son la misma plataforma, pero no el mismo fundamento (§13).

Se mantiene además la vía de ejecución planteada originalmente —**incluir el nodo dentro de la licitación SGM**, dado que no existe línea presupuestaria propia— que se analiza en §11.

Estructura del documento:

| Bloque | Secciones | Pregunta que responde |
|---|---|---|
| Delimitación y justificación | §2–§3 | ¿Qué es el nodo y por qué se justifica? |
| Marco jurídico | §4–§6 | ¿Con qué título opera y quién responde? |
| Diseño técnico | §7–§10 | ¿Qué se construye y qué falta especificar? |
| Ejecución | §11–§14 | ¿Cómo se licita, se financia y se recibe? |
| Cierre | §15–§16 | ¿Qué queda pendiente y qué decide este documento? |

---

## 2. Delimitación frente a PISEE

El riesgo declarado por el equipo —«no queremos transformarnos en otro PISEE»— es legítimo, y con la reformulación de §1 tiene una respuesta estructural, no solo una línea de deslinde.

> **OAE** — Órgano de la Administración del Estado. Es el sujeto obligado de la Ley 21.180 y de sus normas técnicas (D.S. N° 10/2023 y D.S. N° 12/2023). Tanto SUBDERE como cada municipalidad son OAE, lo que resulta determinante para la delimitación que sigue.

| | PISEE (Red de Interoperabilidad) | Nodo SUBDERE (propuesta) |
|---|---|---|
| Naturaleza | Infraestructura de intercambio **OAE ↔ OAE** | Capa de publicación y gobierno de acceso **de un OAE específico** |
| Mandato | D.S. N° 12/2023 (NTI); operador designado (SGD) | Decisión institucional de SUBDERE |
| Consumidor admitido | Organismos del Estado | Municipios y **privados en convenio con municipios** |
| Consumidor **no** admitido | Privados | Otros OAE, para tráfico que corresponde a PISEE |

**El argumento central:** PISEE no puede atender a un desarrollador privado, porque su universo de sujetos es el de los organismos del Estado. El nodo SUBDERE no duplica PISEE; **cubre un consumidor que PISEE no admite**. No hay superposición de propósito, y por lo tanto no hay riesgo de constituirse en red paralela mientras se respete la regla siguiente.

**Regla de deslinde (se mantiene de la v1):** cuando el consumidor es **otro OAE**, el intercambio va por PISEE (vía nodo y Catálogo, conforme al D.S. N° 12/2023). El nodo SUBDERE **no** puede constituirse en vía paralela al Catálogo para tráfico OAE ↔ OAE — eso es lo prohibido por la NTI, y ya está registrado como riesgo en [`brechas-estandarizacion-ntdee-pisee.md`](./brechas-estandarizacion-ntdee-pisee.md) §4.

**Zona gris que persiste:** el municipio **es** OAE. Falta determinar si el consumo municipal de datos SUBDERE debe canalizarse por PISEE o admite canal propio (**X-82**). Con la reformulación de §1, esta pregunta ya **no es bloqueante del proyecto completo**: aunque la respuesta fuera que el tráfico municipal debe ir por PISEE, el acceso de privados seguiría requiriendo el nodo. La zona gris afecta al alcance, no a la existencia.

---

## 3. Los dos casos de uso

El nodo sirve a dos propósitos que comparten plataforma pero no comparten fundamento. Mantenerlos distinguidos es lo que permite argumentar bien el financiamiento (§13) y delimitar el gasto (§11).

| | Caso A — Integración interna | Caso B — Exposición a privados |
|---|---|---|
| Qué resuelve | Plataformas SUBDERE desconectadas entre sí; datos duplicados y contradictorios; integraciones manuales | Que un desarrollador privado pueda construir aplicaciones para municipios sobre datos y servicios de SUBDERE |
| Fundamento | Cumplimiento: obligación de interoperar (D.S. N° 12/2023) y eficiencia interna | Desarrollo de ecosistema; fortalecimiento de capacidad municipal |
| ¿Requiere nodo propio? | No necesariamente — parte podría resolverse vía PISEE | **Sí. No hay alternativa** (§2) |
| Riesgo de argumentar mal | Bajo | Alto: si se financia con argumento de cumplimiento, se replica el problema de finalidad del gasto (§11) |

**Advertencia.** Apoyar la solicitud de financiamiento del Caso B en el argumento de cumplimiento del D.S. N° 12/2023 reproduce, un nivel más arriba, el mismo problema que este documento advierte respecto de meter el nodo dentro de SGM: financiar con el fundamento de A un alcance que en realidad es B. Técnicamente son la misma plataforma; jurídicamente no son el mismo gasto. Deben quedar como **dos alcances con dos fundamentos** en cualquier documento que vaya a decisión presupuestaria.

**El inventario sigue siendo el insumo que sostiene todo** (**X-83**). Sin él no hay dimensionamiento, ni comparación de ofertas, ni justificación defendible. Contenido mínimo:

1. Plataformas en operación: propósito, responsable, tecnología, existencia y calidad de API.
2. Datos que cada una mantiene, con identificación de duplicaciones (típicamente: identificación de municipios, unidades, funcionarios).
3. Integraciones existentes, **incluidas las manuales** (carga de planillas, digitación, correo) — suelen ser mayoría y son el argumento más contundente.
4. Dos o tres integraciones dolorosas concretas, candidatas a caso piloto.
5. **Nuevo en v2:** para cada dato, su clasificación según §4 (origen municipal o propio de SUBDERE) y si contiene datos personales.

---

## 4. Clases de dato y título jurídico

Sección nueva en la v2 y, a juicio de este documento, **el núcleo del problema**. La arquitectura técnica está resuelta (§8); lo que no lo está es con qué título un privado accede y quién responde por ese acceso.

La distinción determinante no es entre datos sensibles y no sensibles, sino entre **quién es el titular del dato**.

### 4.1 Dato de origen municipal alojado en SUBDERE

Es el caso de la mayoría de los datos que interesan a un desarrollador que construye para municipios, y es el caso de SGM completo bajo el modo de hosting definido en [`decisiones-macro-stack.md`](./decisiones-macro-stack.md) §2.

**Construcción propuesta:** SUBDERE **no entrega datos a privados**. El municipio es responsable del tratamiento, SUBDERE es encargado, y **el municipio autoriza a un tercero a acceder a datos propios**. SUBDERE opera el canal y verifica que exista autorización vigente.

Ventajas:

- SUBDERE no requiere habilitación legal propia para «entregar datos a privados», porque no los entrega: los pone a disposición de quien el titular autorizó.
- La responsabilidad queda donde corresponde institucionalmente.
- Es consistente con el convenio tipo ya previsto para SGM (**X-01**), que define responsable y encargado por modo de consumo.

Exigencias que impone:

- La cadena de convenios debe ser impecable y estar documentada por escrito, no inferida.
- **Ley 21.719:** el encargado no puede subencargar el tratamiento sin autorización expresa del responsable. Si el privado se configura como subencargado, la autorización municipal debe ser explícita en ese carácter.
- La autorización debe ser **verificable en línea por el nodo en el momento del acceso**, no solo existir en papel (§9.1).

### 4.2 Dato propio de SUBDERE

Agregados institucionales, indicadores, información de programas (SINIM, FIGEM y equivalentes). Aquí SUBDERE sí requiere título propio para la entrega.

Buena parte de este universo es probablemente **información pública** bajo Ley 20.285, lo que simplifica sustancialmente: si el dato es público, entregarlo por API es un canal más de publicidad activa, no una cesión que requiera habilitación especial.

La tarea es clasificar: qué es público, qué es reservado, y qué contiene datos personales aunque provenga de fuente propia.

### 4.3 Consecuencia de diseño

Las dos clases **no pueden compartir el mismo régimen de acceso**. La clase 4.1 exige verificación de autorización del titular antes de cada acceso; la clase 4.2, en su porción pública, puede resolverse con registro simple.

Requisito técnico derivado: **la clasificación del dato debe ser un atributo del servicio publicado en el catálogo, y el nodo debe aplicar el régimen que corresponda** (**X-86**). No puede quedar como criterio del administrador que da de alta el servicio.

---

## 5. Bordes legales por resolver

Además del título de acceso (§4), tres materias deben quedar resueltas antes de habilitar a privados. Ordenadas por riesgo institucional.

### 5.1 Criterios de acreditación de privados

Debe existir un procedimiento **objetivo, publicado y recurrible** para que un privado sea habilitado. Si SUBDERE habilita a unos y no a otros sin criterio explícito, la exposición es doble: discriminación arbitraria entre agentes económicos (Contraloría) y, eventualmente, materia de libre competencia.

Es el riesgo más subestimado de la propuesta, porque en la práctica un piloto suele partir «con dos o tres empresas que ya conocemos», y ese punto de partida es difícil de regularizar después.

Definiciones mínimas: quién resuelve la solicitud, en qué plazo, con qué causales de rechazo y con qué vía de reclamo.

### 5.2 Gratuidad o tarifa

Cobrar por el acceso requiere base legal expresa. Si no la hay, el servicio es gratuito y **el costo operacional lo absorbe SUBDERE de forma permanente**, lo que remite directamente al problema de capacidad de operación (§10).

Conviene resolverlo temprano porque condiciona el modelo de operación, no al revés.

### 5.3 Revocación y responsabilidad por uso posterior

Qué ocurre si un privado usa mal el dato: quién detecta, quién revoca, en qué plazo se hace efectiva la revocación y quién responde ante el titular. Bajo Ley 21.719 la cadena de responsabilidad debe estar escrita antes del primer acceso, no después del primer incidente.

Este borde tiene contraparte técnica directa: la revocación debe ser **demostrable en recepción** (§14.3), no una cláusula de convenio sin mecanismo.

---

## 6. Antecedente: Dirección del Trabajo / LRE

Existe un antecedente nacional cercano al modelo propuesto, y hay una reunión pendiente con el Ministerio del Trabajo para revisarlo.

La Dirección del Trabajo, con el **Libro de Remuneraciones Electrónico (LRE)**, declaró que la evolución del trámite contemplaba carga vía servicios web, permitiendo que tanto privados como servicios públicos se conecten con la DT para enviar o recibir información, y que la transferencia con otros organismos se efectuaría previa celebración de convenios con cláusulas de protección de datos personales. Adicionalmente trabajaron con empresas de software de remuneraciones para que adecuaran sus productos y se conectaran por servicio web.

Fuente: <https://www.dt.gob.cl/portal/1628/w3-article-120083.html>

**Por qué importa:** es el modelo de tres partes de §4.1 —el organismo opera el canal, el titular del dato autoriza, el software privado consume en su representación— implementado por un servicio público chileno con software comercial de por medio.

> **Advertencia de vigencia.** La fuente consultada describe la conexión por servicio web como etapa futura y no está claramente fechada. Debe confirmarse en la reunión el estado real de implementación antes de darlo por establecido.

### 6.1 Qué levantar en la reunión

Ordenado por lo que no puede resolverse internamente:

**Jurídico (lo más valioso)**
- ¿Con qué instrumento habilitaron el acceso de privados: convenio, adhesión a términos, resolución?
- ¿Quién figura como responsable del tratamiento y quién como encargado?
- ¿Lo revisó Contraloría? ¿Hubo observaciones y cómo las salvaron?
- ¿Pueden compartir el instrumento tipo?

**Acreditación**
- ¿Cómo se entra a la lista de integradores: proceso abierto o por invitación?
- Si partió por invitación, ¿cómo lo abrieron después sin exponerse a discriminación arbitraria? (§5.1)
- ¿Cobran? ¿Con qué fundamento legal? (§5.2)

**Modelo de representación (el punto técnico clave)**
- ¿El token es del software o del titular del dato?
- ¿Cómo autoriza el titular y cómo revoca?
- ¿Dónde se aplica el aislamiento entre titulares?

**Operación**
- ¿Cuántos integradores hay hoy? ¿Cuánta gente opera la plataforma y con qué presupuesto recurrente?
- ¿Han tenido que revocar accesos? ¿Cómo funcionó en la práctica?
- ¿Cómo manejaron los cambios de versión sin romper a los integradores?

### 6.2 Beneficio adicional

El LRE aplica también a las municipalidades en su calidad de empleadores. La reunión puede rendir doble: modelo de gobierno del nodo **y** requisitos funcionales para el módulo de **RRHH/Remuneraciones** de SGM, aún no especificado. Conviene llevar a alguien atento a esa segunda conversación.

---

## 7. Naturaleza técnica: qué problema resuelve

La elección tecnológica depende de cuál de dos problemas predomine. Con la propuesta de §8 sobre la mesa, la respuesta se inclina hacia el primero, pero requiere el inventario para confirmarse.

| Problema | Qué se necesita | Familia de herramientas |
|---|---|---|
| **Publicación y gobierno de APIs** — los servicios tienen contratos limpios y falta exponerlos con control de acceso, catálogo y observabilidad | Gateway de API, identidad federada, catálogo/portal, observabilidad | Kong, Apache APISIX, Tyk, Gravitee, WSO2; Keycloak para identidad; Backstage u homólogo para catálogo |
| **Integración de sistemas heterogéneos** — plataformas legadas sin API decente, formatos incompatibles, se requiere transformación y orquestación | Motor de integración / ESB | MuleSoft, Boomi, Talend, WSO2, Apache Camel |

Observaciones sobre la mención a **MuleSoft**:

- Es la referencia de mercado en el segundo problema. La mención es pertinente si el inventario revela plataformas sin API en condiciones.
- Es también el extremo caro del espectro y el de **mayor cautividad**: los flujos quedan escritos en formato propietario y migrar después implica rehacerlos. Tensiona el principio de propiedad del código y portabilidad de [`principios-no-negociables.md`](../licitacion/principios-no-negociables.md) §5.
- Si el volumen de integraciones resulta acotado, un motor abierto (Camel) más un gateway abierto cubre el mismo alcance sin encierro y a costo sustancialmente menor.
- **No evaluar productos antes del inventario.** La comparación solo tiene sentido con volumen y tipo de integraciones dimensionados.

**Nota:** la experiencia de integración SEM ↔ PISEE ya existente en el equipo es el antecedente más directo para calibrar esfuerzo real y debiera incorporarse al inventario como caso documentado.

---

## 8. Arquitectura de referencia propuesta

La propuesta técnica interna («Plataforma Institucional de Gestión de APIs») aporta dos diagramas: un flujo mínimo de prueba de concepto y una vista con separación de zonas de red. Componentes:

| Componente | Rol | Observación |
|---|---|---|
| **Keycloak** | Emisor de identidad (OAuth 2.0 / OIDC). El consumidor se autentica y recibe un JWT | Resuelve el plano M2M pendiente en SGM (**X-02**) |
| **API7 Gateway** | Punto único de entrada: valida token, aplica permisos y límites, enruta al sistema correspondiente | Es la distribución comercial de Apache APISIX — familia abierta, no propietaria |
| **LogTank / logs centralizados** | Observabilidad operacional | Complementa, no reemplaza, la auditoría (§9.5) |
| **PostgreSQL** | Persistencia de Keycloak | Detalle de implementación |

**Valoración.** La arquitectura es estándar, probada y de implementación conocida. La elección de componentes es acertada en lo que más importa para SUBDERE: son de la familia abierta, con configuración exportable, lo que preserva el principio de portabilidad. **No hay discusión de fondo pendiente sobre el patrón**; la discusión se traslada a qué se expone y bajo qué reglas (§4–§5, §9).

**Alcance de la propuesta.** Los diagramas cubren la capa de **publicación y gobierno** — el primer problema de §7. No cubren la capa de integración hacia sistemas que no expongan API en condiciones (segundo problema de §7). Si el inventario revela que SEM, SIFIM o SIM requieren transformación, falta un componente que los diagramas no contemplan.

**Nota sobre las APIs de ejemplo.** Los diagramas ilustran con «API Patentes / Gastos / Contabilidad», dominios **municipales**, no datos propios de SUBDERE. Conviene aclarar si son marcadores ilustrativos o si reflejan una intención de alcance: en el segundo caso se superponen con lo que resuelve SGM y cambia la delimitación de §4.1.

---

## 9. Brechas de especificación

La propuesta de §8 tiene **postura de demostración**: acredita que el flujo funciona, no que la plataforma es institucional. Las brechas aparecen casi todas al introducir el consumidor privado, que es precisamente el caso de uso que justifica el nodo (§1).

### 9.1 Modelo de tres partes y registro de autorizaciones

Los diagramas tienen un solo actor («aplicación municipal»). El escenario real tiene tres: SUBDERE opera el canal, el municipio autoriza, el privado consume (§4.1).

Falta la pieza que sostiene jurídicamente el esquema: un **registro de autorizaciones** como entidad de primera clase —qué municipio autorizó a qué privado, sobre qué datos, con qué vigencia, respaldado en qué convenio—, con historial y trazabilidad al acto que la origina. No puede resolverse como atributo suelto de un cliente en el IdP. Es, además, lo primero que se revisará en una auditoría.

### 9.2 Aislamiento por municipio

La brecha más crítica. Un privado que desarrolla para un municipio no puede alcanzar datos de otro.

Falta definir **dónde se aplica el filtro**: en el gateway o en cada API interna. Si queda delegado a las APIs, basta que una lo implemente mal para comprometer el aislamiento completo. La decisión equivalente en SGM está abierta como **X-03** (tenant en ruta, en token, o ambos); aquí es más crítica porque el consumidor es externo a la Administración.

### 9.3 Taxonomía de scopes

Un **scope** es una etiqueta de permiso que viaja dentro del token y que el gateway lee para autorizar o rechazar cada petición. Ejemplo: un token con `patentes.read` y municipio `quilaco` permite leer patentes de ese municipio y nada más.

Decisiones pendientes:

| Granularidad | Ejemplo | Consecuencia |
|---|---|---|
| Por sistema | `patentes` | Simple, pero no distingue lectura de escritura |
| Por sistema y operación | `patentes.read`, `patentes.write` | Punto dulce habitual |
| Por operación específica | `patentes.consultar_rol` | Control fino, cantidad inmanejable |
| Por campo | `patentes.read.sin_datos_personales` | Útil para minimización, complejo de administrar |

Además: **si el municipio viaja como scope o como atributo aparte del token.** Como scope, la cantidad se multiplica por el número de municipios.

**Por qué definirlo temprano:** los scopes son parte del contrato con el consumidor. Agregar scopes nuevos es aditivo y barato; reestructurar los existentes rompe todas las aplicaciones ya construidas. No es corregible después.

### 9.4 Ciclo de vida de credenciales

Alta, rotación, expiración y revocación, con proceso institucional definido. Hoy no está establecido quién da de alta a un privado ni bajo qué acto. Si la respuesta operativa es «un administrador entra a la consola», eso no es un proceso auditable sino una intervención manual.

La revocación debe tener **plazo comprometido** y ser verificable (§14.3).

### 9.5 Auditoría distinta de los logs operacionales

Los logs centralizados son observabilidad. Falta la **traza de auditoría inmutable**: qué privado accedió a qué dato de qué municipio, cuándo y bajo qué autorización. Es la misma distinción ya establecida para SGM entre auditoría (Contraloría, Ley 21.719) y logs operacionales — ver [`seguridad.md`](../especificacion/seguridad.md) §5 y [`musts-arquitectura.md`](../especificacion/musts-arquitectura.md) §8.

**Exigencia expresa:** el gateway registra cabeceras por defecto. Debe quedar prohibido que la cabecera `Authorization` u otros secretos aparezcan en log — lección directa del hallazgo de JWT en logs del sistema anterior ([`seguridad.md`](../especificacion/seguridad.md) §7.3).

### 9.6 Catálogo, contratos y sandbox

No hay portal de desarrollador, ni estándar de contrato (OpenAPI, versionamiento, política de deprecación), ni ambiente de pruebas.

Si el propósito del nodo es que privados construyan sobre él (§1), estas tres piezas **son el producto**: sin ellas la plataforma funciona técnicamente y no existe comercialmente. El patrón ya está escrito para SGM y se replica: [`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md), [`estandares-api.md`](../especificacion/estandares-api.md).

### 9.7 Capa hacia los sistemas reales

Ver §8, alcance de la propuesta. El inventario decide si basta el gateway o se requiere motor de integración.

### 9.8 Postura de producción

Todo aparece en instancia única: si el IdP cae, nadie obtiene token. Faltan alta disponibilidad, ambientes separados, respaldo y recuperación, gestión de secretos y certificados, y **SLOs declarados con consecuencia contractual**. Razonable en una demostración; inaceptable en una plataforma que sostiene aplicaciones de terceros.

### 9.9 Gobierno del plano administrativo

Publicar una nueva API hacia privados es un acto con consecuencias. Falta definir quién autoriza, con qué flujo de aprobación y con qué control de cambios.

---

## 10. Capacidad institucional: construir vs. operar

No hay capacidad interna suficiente, lo que orienta hacia adquirir producto o licitar. Conviene separar dos capacidades distintas, porque **no las resuelve el mismo instrumento**:

| Capacidad | ¿Existe hoy? | Cómo se resuelve |
|---|---|---|
| **Construir** el nodo | No | Producto comercial, licitación, o combinación |
| **Operar** el nodo de forma permanente | No | **No se resuelve comprando producto.** Requiere equipo, presupuesto recurrente o servicio gestionado contratado |

Riesgo central: un nodo sin operación sostenida se degrada y termina siendo **una plataforma desconectada más**, sumada a las que ya hay. Es la ironía que la propuesta debe evitar explícitamente.

Con el ecosistema privado como propósito (§1), la carga operacional es **mayor** que la de una integración puramente interna: hay terceros con expectativas de disponibilidad, soporte a integradores, gestión de altas y revocaciones, y versionamiento de contratos publicados. Todo eso es operación permanente, no proyecto.

Cualquier presentación a nivel de decisión presupuestaria debe llegar con el modelo de operación escrito: quién opera, con qué equipo, con qué presupuesto recurrente. Aunque la respuesta sea «servicio gestionado por el proveedor», debe estar declarada (**X-84**).

---

## 11. Opciones de ejecución

### Opción A — Nodo dentro de la licitación SGM

Alcance del nodo incorporado al mismo contrato y financiamiento que SGM.

**A favor:** resuelve el problema de financiamiento inmediato; una sola tramitación; el nodo nace alineado con SGM por construcción.

**Riesgos:**

1. **Finalidad del gasto (Contraloría).** Si se financia con la línea destinada a SGM un componente cuyo alcance real es integración transversal y exposición a privados de datos ajenos a la gestión municipal, existe riesgo de observación por desviación de la finalidad del gasto. El riesgo no se materializa al contratar, sino después, cuando el nodo esté sirviendo plataformas sin relación con SGM y se revise contra qué se financió. **Con la reformulación de §1 este riesgo aumenta**, porque el propósito declarado del nodo —ecosistema privado sobre datos SUBDERE— es más distante del objeto de SGM que la integración interna.
2. **Concentración en un proveedor único.** El nodo sería la capa por la que pase toda la integración institucional futura. Si lo construye el adjudicatario de SGM dentro del mismo contrato, ese proveedor queda en el punto de control de toda la integración de SUBDERE, y cada plataforma que se sume después negocia desde posición débil. Tensiona [`principios-no-negociables.md`](../licitacion/principios-no-negociables.md) §5.
3. **Perfiles de oferente incompatibles.** SGM es dominio funcional municipal con normativa chilena encima (Ley 19.886 y siguientes). El nodo es infraestructura de integración y gobierno de APIs. Los oferentes fuertes en uno rara vez lo son en el otro. Resultado probable: se filtran los especialistas en ERP, o el integrador toma el ERP como carga, o entran consorcios grandes que cotizan caro por poder con ambos.
4. **Acoplamiento de cronogramas.** Un contrato es un cronograma y un punto de falla. Si el nodo se atrasa arrastra a SGM; si SGM se atrasa, el nodo queda congelado.
5. **Presión sobre la calidad de las bases.** Existe especificación madura de Adquisiciones y falta replicar el método a cuatro módulos. Sumar la especificación del nodo —con las nueve brechas de §9 aún abiertas— presiona el estándar propio del equipo. Lo peor especificado sería el nodo, que es lo menos trabajado.
6. **Estatus institucional.** Un nodo que nace como anexo del ERP municipal se lee como accesorio de SGM y le cuesta después reclamar el rol transversal que la propuesta busca.

### Opción B — Licitaciones separadas, acopladas por contrato

SGM y nodo se licitan por separado. En las bases de SGM queda escrito que el sistema publica sus servicios contra una interfaz de integración definida por SUBDERE, con propiedades verificables y sin nombrar producto ni proveedor.

**A favor:** cada alcance con su justificación, su cronograma y su perfil de oferente; sin concentración de proveedor; sin riesgo de finalidad del gasto; el nodo nace con estatus propio.

**En contra:** requiere financiamiento propio para el nodo, que hoy no existe. Dos tramitaciones en vez de una.

**Variante:** licitación única con **lotes separados y adjudicación independiente**. Resuelve el costo de tramitación sin fundir alcances ni proveedores. Aplicable si la motivación fuera administrativa; **no** resuelve el problema de financiamiento, que es el caso real.

### Opción C — Capa de integración propia de SGM, extensible

SGM especifica y financia **solo la capa de integración que necesita por sí mismo**, con exigencia contractual de extensibilidad a servicios externos al SGM. El nodo, cuando obtenga financiamiento, no se construye de cero: se amplía sobre código y configuración propiedad de SUBDERE.

**Qué entra legítimamente por esta vía** (justificado por el diseño SGM vigente, sin forzar alcance):

- Capa de exposición de API con gobierno de acceso — mandato API-first, [`decisiones-macro-stack.md`](./decisiones-macro-stack.md) §1.
- Identidad y autorización M2M con scopes por módulo y municipio — **X-02**, prerequisito del modo à la carte.
- Catálogo de servicios publicados y portal de desarrollador — [`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md).
- Observabilidad de consumo por tenant — [`musts-arquitectura.md`](../especificacion/musts-arquitectura.md) §8.
- Borde **C-PISEE** — [`brechas-estandarizacion-ntdee-pisee.md`](./brechas-estandarizacion-ntdee-pisee.md) §5.4, pendiente **X-61**.

**Qué NO entra por esta vía** (alcance del nodo propiamente tal, requiere financiamiento propio):

- Adaptadores hacia otras plataformas SUBDERE.
- Orquestación de flujos ajenos al dominio SGM.
- Catálogo de datos institucionales de SUBDERE.
- Gestión de acceso de privados a datos **no-SGM**.

**Precisión de la v2:** la porción de exposición a privados que corresponde a **datos SGM** sí entra por esta vía, porque el modo à la carte y el ecosistema de terceros ya están previstos en el diseño de SGM ([`decisiones-macro-stack.md`](./decisiones-macro-stack.md) §7). Lo que no entra es el acceso de privados a datos de **otras** plataformas SUBDERE. **La frontera es el origen del dato, no el tipo de consumidor.**

**A favor:** SGM financia lo que le corresponde y nada más; el nodo queda técnicamente viable sin dinero adicional hoy; la ampliación es contrato aparte sobre código propio.

**En contra:** no entrega el nodo completo; requiere igualmente financiamiento propio para el alcance transversal; exige disciplina para que la extensibilidad sea propiedad verificable en recepción y no una promesa en las bases.

---

## 12. Recomendación

**Se recomienda no fundir el nodo en la licitación SGM: mantener licitaciones separadas (Opción B), avanzando entretanto por la Opción C.**

Fundamento:

1. Los riesgos de la Opción A no son de diseño sino institucionales y de largo plazo (finalidad del gasto, cautividad de proveedor, estatus del nodo). Se pagan después de adjudicar, cuando ya no son corregibles. La reformulación del propósito (§1) **agrava** el primero de ellos.
2. La Opción C entrega hoy, sin financiamiento adicional y sin forzar alcance, la base técnica sobre la cual el nodo se construye después. No se pierde tiempo.
3. La separación **no debilita** la propuesta del nodo: la fortalece. Un nodo con propósito propio (ecosistema privado), inventario propio y modelo de operación declarado se pide por derecho propio y nace con el rol transversal que la propuesta busca.
4. Las brechas de §9 —especialmente el modelo de tres partes y el aislamiento— requieren definición jurídica previa (§4–§5). Incorporarlas al paquete SGM las forzaría a resolverse con el calendario de SGM, que es el calendario equivocado para decisiones que condicionan la exposición institucional a largo plazo.

**Principio operativo asociado:** SGM y nodo se mantienen desacoplados en el cronograma. SGM debe funcionar y recepcionarse con o sin nodo. El nodo, cuando exista, consume SGM como cualquier otro servicio publicado. Si el nodo va primero, SGM se enchufa el día uno; si va después, SGM ya está construido para enchufarse.

---

## 13. Financiamiento

El obstáculo real es que no existe línea que financie el nodo. Conforme a §3, las vías deben separarse por caso de uso.

### 13.1 Para el Caso A — integración interna

1. **Argumento de cumplimiento normativo.** El D.S. N° 12/2023 obliga a SUBDERE a interoperar; el diagnóstico interno indica que hoy no está en condiciones de hacerlo de forma sistemática. Los argumentos de cumplimiento consiguen financiamiento con menos fricción que los de innovación.
2. **EVALTIC 2027.** El inventario (§3) **es** la justificación: número de plataformas, integraciones manuales, trabajo duplicado, datos contradictorios.

### 13.2 Para el Caso B — exposición a privados

Requiere fundamento propio, distinto del cumplimiento:

- Desarrollo de ecosistema de proveedores para el mundo municipal.
- Fortalecimiento de capacidad tecnológica municipal sin costo directo para el municipio.
- Precedente institucional comparable (§6) como evidencia de viabilidad.

**No debe apoyarse en el D.S. N° 12/2023.** Esa norma obliga a interoperar entre organismos; no fundamenta la apertura a privados. Usarla como argumento crea, un nivel más arriba, el mismo problema de finalidad que este documento advierte respecto de la Opción A.

### 13.3 Insumo común

En todas las vías el insumo es el mismo: el inventario. Conviene levantarlo ahora, con independencia de la opción que se elija — sirve para fundamentar el financiamiento propio si se consigue, y para delimitar con precisión qué es SGM y qué es nodo si no se consigue.

---

## 14. Traducción a bases de licitación

Cuando el nodo se licite, aplica el criterio ya adoptado para SGM: **especificar completo lo que no es corregible de forma aditiva; recibir contra propiedades lo demás** ([`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) §3).

### 14.1 Qué especifica SUBDERE completo

| Materia | Por qué no admite delegación |
|---|---|
| Modelo de autorización de tres partes y entidad de registro (§9.1) | Ahí vive la exposición jurídica; un modelo mal construido no se corrige con un parche |
| Regla de aislamiento por municipio y dónde se aplica (§9.2) | Un fallo compromete la totalidad, no un caso |
| Taxonomía de scopes (§9.3) | Reestructurarla rompe a todos los consumidores existentes |
| Contrato de auditoría: qué se registra, formato, inmutabilidad (§9.5) | Auditoría reconstruida a posteriori no sirve |
| Estándar de publicación de API: OpenAPI, versionamiento, deprecación (§9.6) | Es el contrato con el ecosistema |
| Clasificación de datos y minimización por scope (§4) | Determina el régimen legal aplicable a cada servicio |
| Proceso de alta, revocación y sus plazos (§5.3, §9.4) | Compromiso frente a terceros y ante el titular del dato |

### 14.2 Qué se recibe contra propiedades

Producto de gateway e IdP; topología de despliegue; implementación interna del registro de auditoría; diseño del portal de desarrollador; mecanismo técnico de filtrado.

**Sobre los productos nombrados en §8:** API7 y Keycloak **no pueden ir en las bases como requisito** — es mención de marca. Se traducen a propiedades que ellos satisfacen: cumplimiento OAuth 2.0 / OIDC estándar, configuración exportable en formato abierto, ausencia de lenguaje propietario para reglas de enrutamiento, contratos en OpenAPI. Los diagramas van como **anexo de arquitectura de referencia, no vinculante**: orientan al oferente sin cerrar la competencia.

### 14.3 Verificación en recepción

Cada propiedad exigida necesita su prueba de cumple / no cumple, ejecutada en presencia de la contraparte técnica:

| Prueba | Criterio |
|---|---|
| **Aislamiento** | Credencial del municipio A intenta leer datos del municipio B → denegado |
| **Secretos en log** | Batería de llamadas; búsqueda de tokens y credenciales en logs → cero coincidencias |
| **Revocación** | Se revoca una credencial y se demuestra denegación efectiva dentro del plazo comprometido |
| **Cuotas y límites** | Se excede el límite y se demuestra el rechazo correspondiente |
| **Auditoría** | Se ejecuta un acceso; se demuestra el registro con todos los campos exigidos y la imposibilidad de alterarlo |
| **Portabilidad** | Se exporta la configuración completa de gateway e IdP, se reimporta en instancia limpia y se demuestra equivalencia funcional |
| **Carga** | Mismo esquema ya definido para SGM ([`musts-arquitectura.md`](../especificacion/musts-arquitectura.md) §7) |

La prueba de **portabilidad** es la más importante a largo plazo: materializa el principio antilock-in y distingue una plataforma propia de una arrendada.

### 14.4 Diferencia de forma respecto de SGM

El nodo **no es desarrollo a medida**, sino implementación y operación de componentes existentes. Eso cambia qué significa «entregable»:

| SGM | Nodo |
|---|---|
| Código fuente de un producto construido | Infraestructura como código, configuración versionada, runbooks |
| Propiedad del código | Propiedad de la configuración y de los scripts de despliegue, ejecutables sin el proveedor |
| Recepción contra contratos funcionales | Recepción contra propiedades operacionales (§14.3) y traspaso operativo demostrable |

Y vuelve el punto de §10: construir y operar son contratos distintos. Si se licitan juntos, conviene al menos que sean **ítems separables**, con la operación acotada en plazo y traspaso demostrable al término.

---

## 15. Pendientes propuestos

A registrar en [`pendientes.md`](./pendientes.md) si el equipo acoge el documento:

| ID propuesto | Título corto | Contraparte |
|---|---|---|
| **X-82** | Criterio jurídico: ¿el consumo municipal de datos SUBDERE debe canalizarse por PISEE (municipio = OAE) o admite canal propio? Afecta al alcance, no a la existencia del nodo (§2) | jurídica / SGD |
| **X-83** | Inventario de plataformas SUBDERE: datos, integraciones existentes (incl. manuales), duplicaciones, clasificación por origen del dato, candidatas a piloto (§3) | Camila / equipo |
| **X-84** | Decisión producto vs. capacidad y modelo de operación permanente: quién opera, con qué equipo y presupuesto recurrente (§10) | jefatura |
| **X-85** | Propiedades verificables de extensibilidad de la capa de integración SGM (Opción C) para bases de licitación (§11) | arquitectura |
| **X-86** | Clasificación de datos por origen y régimen de acceso aplicable; atributo del servicio en el catálogo (§4.3) | jurídica / arquitectura |
| **X-87** | Modelo de representación: instrumento por el cual el municipio autoriza a un privado; verificación en línea de autorización vigente; cadena responsable/encargado bajo Ley 21.719 (§4.1, §9.1) | jurídica |
| **X-88** | Criterios de acreditación de privados (procedimiento objetivo, publicado y recurrible) y definición de gratuidad o tarifa con su base legal (§5.1, §5.2) | jurídica / jefatura |
| **X-89** | Taxonomía de scopes y ubicación del filtro de aislamiento por municipio (gateway vs. API interna); relación con **X-02** y **X-03** de SGM (§9.2, §9.3) | arquitectura |
| **X-90** | Levantamiento del antecedente DT/LRE: instrumento jurídico, modelo de acreditación, modelo de representación y datos de operación; confirmar estado real de implementación (§6) | Camila / Juan |

---

## 16. Qué decide este documento y qué no

**No decide:** qué producto tecnológico se adopta; si el nodo se financia y por qué vía; si el consumo municipal va por PISEE; con qué instrumento jurídico se habilita a privados.

**Propone decidir:**

1. Que el propósito distintivo del nodo es habilitar el ecosistema privado para municipios, y que la integración interna es beneficio concurrente con fundamento propio (§1, §3).
2. Que el nodo no se funda en el contrato de SGM (§12).
3. Que SGM especifique su capa de integración con extensibilidad exigible (Opción C, §11).
4. Que el inventario y el levantamiento jurídico (§4–§5) se inicien de inmediato, previos a cualquier evaluación de producto.

---

## Referencias

- [`brechas-estandarizacion-ntdee-pisee.md`](./brechas-estandarizacion-ntdee-pisee.md) — borde C-PISEE, deslinde con la Red de Interoperabilidad, X-61
- [`principios-no-negociables.md`](../licitacion/principios-no-negociables.md) §5 — propiedad del código y portabilidad
- [`decisiones-macro-stack.md`](./decisiones-macro-stack.md) §1, §2, §3, §7 — modos de consumo; soberanía del dato; propiedades, no marcas; ecosistema de terceros
- [`estandares-api.md`](../especificacion/estandares-api.md) §8 — planos de autenticación; X-02, X-03
- [`entregable-licitacion.md`](../licitacion/entregable-licitacion.md) §3 — criterio de nivel de detalle de especificación
- [`musts-arquitectura.md`](../especificacion/musts-arquitectura.md) §7, §8 — pruebas de carga; observabilidad exigida
- [`seguridad.md`](../especificacion/seguridad.md) §5, §7.3 — auditoría; secretos y logging
- [`sandbox-desarrolladores.md`](../licitacion/sandbox-desarrolladores.md) — portal de desarrollador y catálogo
- D.S. N° 12/2023 (NTI / PISEE); D.S. N° 10/2023 (NTDEE); Ley 21.180; Ley 21.719; Ley 20.285
- Dirección del Trabajo — Libro de Remuneraciones Electrónico: <https://www.dt.gob.cl/portal/1628/w3-article-120083.html>