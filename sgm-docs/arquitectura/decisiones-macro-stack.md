# Decisiones macro: elección de stack para el nuevo SGM

> Documento de trabajo — arquitectura / decisiones estratégicas
> Estado: borrador para discusión interna. Pendientes registrados en [`pendientes.md`](./pendientes.md).
> Contexto: decisión de julio 2026 de eliminar Odoo y licitar un ERP nuevo. Este documento registra las definiciones macro conversadas respecto del stack tecnológico del reemplazo.

---

## 1. Modelo conceptual del sistema

**Decisión asentada.** SGM se concibe como un **motor backend API-first**, no como una aplicación. La API es el producto; todo consumidor —incluido el frontend base construido por SUBDERE— la consume sin privilegios especiales.

Dos modos de consumo:

| Modo | Público objetivo | Descripción |
|---|---|---|
| **Hosting completo** | Municipios sin musculatura TI (p. ej. Quilaco, Cochamó) | SUBDERE aloja motor, datos y frontend base. El municipio opera contra la interfaz provista. |
| **Módulos à la carte vía API** | Municipios grandes con sistemas propios (arquetipo: Lo Barnechea sobre Oracle) | El municipio consume módulos específicos (p. ej. solo Adquisiciones) e integra las respuestas a sus aplicaciones en uso. |

**Consecuencia arquitectónica central:** cada módulo debe ser independiente, con protocolos de entrada y salida explícitos (ver documento `contrato-api-first.md`). Sin esa disciplina, el modo à la carte no es viable.

## 2. Soberanía del dato vs. operación de infraestructura

**Decisión asentada.** Se distingue la propiedad jurídica del dato de la operación de la infraestructura:

- Municipios pequeños: alojados completamente en SUBDERE, nube incluida. La responsabilidad de tratamiento debe quedar jurídicamente clara (relevante para Ley 21.719).
- Municipios grandes: absorben su data en sus propias nubes/sistemas, consumiendo el motor vía API.

**[PENDIENTE P-01]** Formalizar el instrumento jurídico (convenio tipo) que define responsable del tratamiento y encargado en cada modo, en línea con Ley 21.719.

## 3. Principio rector para las bases: propiedades, no marcas

**Decisión asentada.** Las bases de licitación **no exigirán un framework específico** (riesgo de impugnación por restricción de competencia). En su lugar, exigirán propiedades verificables — stack-agnósticas, definidas por SUBDERE y nunca delegadas al adjudicatario.

El catálogo canónico de propiedades no negociables vive en [`principios-no-negociables.md`](./principios-no-negociables.md); este documento no lo duplica.

## 4. Evaluación de candidatos de stack backend

Criterios relevantes al contexto SGM: (a) profundidad del mercado de desarrolladores en Chile para licitar y mantener, (b) madurez del ecosistema para dominio contable-financiero-transaccional, (c) cultura contract-first / calidad de tooling OpenAPI, (d) tipado y robustez para un motor de validación, (e) velocidad de desarrollo.

| Stack | A favor | En contra |
|---|---|---|
| **Python / Django (+DRF)** | ORM y admin aceleran módulos CRUD-pesados; DRF + drf-spectacular maduros para API-first; django-tenants para multitenancy por schema; músculo interno del equipo SUBDERE en Python (contraparte técnica) | Tipado más laxo que Java; cultura contract-first menos profunda que Spring |
| **Java / Spring Boot** | Mercado enterprise chileno más profundo (consultoras grandes que ganan licitaciones); tipado estricto favorable para reglas contables; cultura contract-first madura; predominio en sistemas del Estado | Verboso, desarrollo más lento; menor afinidad con el equipo interno |
| **PHP / Laravel** | Gran volumen de desarrolladores locales; costo bajo | Menor prestigio en sistemas críticos; estigma de mantenibilidad |
| **Node / NestJS** | Unifica lenguaje con frontend; crecimiento sostenido | Ecosistema contable-financiero más inmaduro que Python/Java |
| **.NET** | Técnicamente excelente | Percepción de stack no abierto (aunque hoy es open source); mercado local orientado a banca, no a consultoras que licitan con el Estado |

**Lectura de trabajo (no decisión):** Django+React y Spring Boot+React son los dos candidatos defendibles. Dado que la API es el producto, el peso relativo de tipado fuerte y contract-first sube frente a velocidad de desarrollo, lo que fortalece parcialmente el caso de Spring; la afinidad del equipo interno y la velocidad favorecen a Django. Las bases deben permitir que cualquiera de los dos gane por mérito.

## 5. Frontend

**Decisión de trabajo.** React como opción de menor riesgo por volumen de desarrolladores; Vue como único competidor razonable, sin diferencial. El frontend base de SUBDERE consume la API publicada sin privilegios — disciplina que mantiene viable la opción futura de frontends de terceros vía convenio.

## 6. Consecuencias del modelo "API como producto"

Cuando la API es el producto, el contrato es el activo central. Exigencias derivadas (detalle en `contrato-api-first.md`):

- OpenAPI versionada como fuente de verdad, con política de deprecación publicada.
- Errores estructurados: código de error de dominio, campo, regla infringida, referencia normativa cuando aplique. Nunca un 400 sin cuerpo.
- Autenticación máquina-a-máquina (OAuth2 client credentials o equivalente) con scopes por módulo y por municipio, distinta de Clave Única (personas). **[PENDIENTE P-02]** Hoy no existe en el diseño; debe especificarse.
- Criterio de aceptación en recepción: cada módulo pasa sus pruebas de integración consumiendo únicamente los contratos publicados de los demás módulos, con las bases de datos del resto inaccesibles.

## 7. Ecosistema abierto de terceros sobre SGM

**Decisión de orientación estratégica.** SGM no es solo un sistema: es la plataforma sobre la cual empresas externas podrán ofrecer servicios de valor agregado a los municipios, compitiendo libremente por mejor servicio. El Estado provee el motor y las reglas; el mercado provee las mejoras.

### 7.1 Categorías de servicios de terceros previstas

| Categoría | Ejemplos | Requisito de plataforma |
|---|---|---|
| Capas de análisis e IA | Analítica sobre datos municipales, asistentes, alertas | Acceso de lectura granular vía API; datos estructurados y documentados |
| Reportería avanzada | Reportes especializados para DAF, alcaldía, concejo; automatización SINIM/anexos | Contratos de lectura por módulo; catálogo de datos con finalidad legal |
| Frontends alternativos y personalizaciones | Interfaces especializadas por tipo de municipio, ajustes estéticos | Frontend base sin privilegios (garantiza paridad de acceso) |
| Adaptadores de integración | Conexión del motor SGM con sistemas municipales existentes (Oracle, SAP, otros) | Contratos de dependencia como interfaces (sección 6); plano M2M |
| Nuevas aplicaciones | Módulos o apps complementarias no cubiertas por SGM | API de lectura/escritura con validación fuerte del lado del motor |
| Servicios de adopción | Mesas de ayuda, capacitación, acompañamiento | Documentación pública de calidad; ambiente de práctica |

### 7.2 Condiciones habilitantes del ecosistema

El ecosistema solo existe si construir sobre la API es **económicamente viable para un tercero**. Eso depende de decisiones de diseño que deben quedar en las bases y en la especificación, no improvisarse después:

1. **Convenio de acceso de trámite razonable.** El proceso para que una empresa obtenga credenciales de producción no puede ser una barrera de meses; debe existir un procedimiento estandarizado y publicado.
2. **Ambiente sandbox con datos sintéticos.** Cualquier empresa debe poder desarrollar y demostrar su servicio sin convenio previo, contra un ambiente de prueba públicamente accesible.
3. **Documentación suficiente para estimar sin ingeniería inversa.** Un tercero debe poder dimensionar un proyecto solo desde la especificación publicada (mismo estándar de calidad de Etapa 1: dos equipos independientes construirían consumidores equivalentes).
4. **Scopes granulares.** El plano M2M debe permitir acceso mínimo necesario: una empresa de reportería obtiene lectura de los módulos pertinentes, no acceso total.
5. **Paridad de acceso.** Ningún actor —incluido el frontend base de SUBDERE y el adjudicatario del desarrollo— opera con privilegios no publicados. Es la garantía estructural de competencia justa.
6. **Validación en el motor, siempre.** Toda regla de negocio bloqueante vive en el backend; ningún tercero puede eludirla ni depende de reimplementarla. Esto protege la integridad del dato municipal con independencia de quién construya encima.

**Principio rector:** la ventaja competitiva legítima de un tercero debe provenir de la calidad de su servicio y su expertise de dominio, nunca de acceso privilegiado a información o infraestructura. Un ecosistema con cancha pareja atrae más y mejores actores.

## 8. Lecciones del contrato anterior (caso proveedor Odoo)

El proveedor del desarrollo original lanzó posteriormente un ERP municipal propio, construido sobre el conocimiento de dominio adquirido durante el contrato con SUBDERE, en ausencia de cláusulas robustas de propiedad intelectual. Con independencia de las acciones legales que se evalúen, el hecho fundamenta directamente varias decisiones de este documento:

1. **Los no-negociables en [`principios-no-negociables.md`](./principios-no-negociables.md) son correctivos, no perfeccionismo.** Propiedad estatal del código, cláusulas de portabilidad y contratos verificables en recepción responden punto por punto a las debilidades del contrato anterior.
2. **El conocimiento de dominio financiado por el Estado debe quedar en activos del Estado.** Todo el levantamiento, especificación y documentación del nuevo SGM se versiona en repositorios de propiedad de SUBDERE (`sgm-docs/`). Nada del valor generado durante el contrato debe ser apropiable en exclusiva por el adjudicatario.
3. **La especificación completa neutraliza ventajas informativas en la licitación.** Debe anticiparse que actores con conocimiento previo del dominio (incluido el proveedor anterior) se presenten a la licitación. La respuesta no es la inhabilitación —jurídicamente frágil— sino una especificación tan completa que la ventaja de conocimiento se diluya, más criterios de evaluación que exijan evidencia verificable de calidad en proyectos previos.
4. **[PENDIENTE P-17]** Revisión jurídica del contrato original completo (obligaciones de confidencialidad o de destino de los desarrollos que puedan sobrevivir aunque la PI no esté bien amarrada), previa a descartar acciones.

## 9. Participación temprana del mercado en la definición de estándares

**Decisión de orientación.** Los estándares del ecosistema se definirán con participación del mercado, no en aislamiento: estándares escritos sin contacto con las empresas corren el riesgo de ser inconstruibles o de no atraer actores. La participación, sin embargo, debe darse exclusivamente por mecanismos formales, públicos y trazables.

### 9.1 Mecanismo: consulta al mercado, nunca reuniones informales

Las conversaciones informales con empresas previas a una licitación exponen el proceso a impugnaciones (ventaja del participante, trato desigual hacia el no invitado) y a reproches de probidad. El instrumento correcto es la **consulta al mercado (RFI) vía Mercado Público**, formalizada por la reforma a la Ley 19.886 (Ley 21.634): convocatoria pública, participación abierta a cualquier interesado, registro íntegro de lo conversado, sin que participar inhabilite ni privilegie. Para instancias donde la solución deba construirse iterativamente con el mercado, la misma reforma contempla el **diálogo competitivo** como alternativa a evaluar. **[PENDIENTE P-18]** Confirmación jurídica del encuadre exacto (RFI, diálogo competitivo u otro) antes de la primera convocatoria.

Regla operativa: todo intercambio con empresas sobre SGM es público, trazable y de convocatoria abierta. Sin excepciones.

### 9.2 SUBDERE llega con borrador, no con página en blanco

La consulta al mercado se convoca sobre una propuesta de estándares ya escrita (los documentos de `sgm-docs/`: estándares API, contratos por módulo, condiciones habilitantes del ecosistema). Las empresas reaccionan aportando viabilidad técnica y costos; SUBDERE mantiene la definición del marco. Llegar sin propuesta invierte la asimetría: los estándares terminarían escritos por los incumbentes a su medida, recreando el lock-in por otra vía. Esto convierte los documentos de especificación en curso en insumo directo de la consulta, con la urgencia correspondiente.

### 9.3 Dos objetos de conversación, dos instancias separadas

| Objeto | Instancia | Carácter |
|---|---|---|
| Estándares del ecosistema (API, contratos, sandbox, convenio de acceso) | Mesa técnica pública, potencialmente permanente | Abierta, iterativa, análoga a la gobernanza de otros estándares del Estado |
| Bases de la licitación del motor | Proceso formal de compra pública | Cerrado, reglado, sin interacción fuera de los canales del proceso |

Mezclar ambas conversaciones en la misma mesa contamina la segunda. La mesa de estándares puede sobrevivir a la licitación como órgano de gobernanza del ecosistema.

### 9.4 Participación del proveedor anterior

En un mecanismo de convocatoria abierta, el proveedor anterior no puede ser excluido — y un proceso bien armado convierte eso en ventaja: sus observaciones quedan registradas públicamente como las de cualquier participante, su conocimiento de dominio se socializa en lugar de permanecer como ventaja privada, y su participación en la definición de los estándares debilita eventuales impugnaciones posteriores de su parte. La cancha pareja aplica también hacia el incumbente.

## 10. Pendientes abiertos

Los pendientes de este documento están registrados en [`pendientes.md`](./pendientes.md): P-01, P-02, P-13, P-14, P-15, P-16, P-17, P-18, P-19.
