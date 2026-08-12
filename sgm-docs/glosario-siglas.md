# Glosario de Siglas

| Sigla | Significado |
|---|---|
| SGM | Sistema de Gestión Municipal |
| SUBDERE | Subsecretaría de Desarrollo Regional |
| DM | Dirección de Municipalidades |
| JPL | Juzgado de Policía Local |
| DAF | Dirección de Administración y Finanzas |
| SOLPED | Solicitud de Pedido |
| IC | Informe de Contratación |
| OC | Orden de Compra |
| BPMN | Business Process Model and Notation |
| MP | Mercado Público (ChileCompra) |
| SII | Servicio de Impuestos Internos |
| DT | Dirección del Trabajo |
| PISEE | Plataforma Integrada de Servicios Electrónicos del Estado |
| SINIM | Sistema Nacional de Información Municipal |
| SEM | Plataforma SUBDERE; feed hacia caja SGM (as-is). Fichas: [`integraciones-terceros.md`](arquitectura/especificacion/integraciones-terceros.md) A6 / **C2**. Expansión literal de la sigla: no está en el corpus |
| SIFIM | Plataforma SUBDERE (integración interna). Ficha **C4**. Expansión literal: no está en el corpus |
| SIM | Plataforma SUBDERE (integración interna). Ficha **C5**. Expansión literal: no está en el corpus |
| FIGEM | Plataforma / programas SUBDERE (dato propio citado en nodo). Ficha **C3**. Expansión literal: no está en el corpus |
| FNDR | Fondo Nacional de Desarrollo Regional |
| EVALTIC | Plataforma de evaluación para financiamiento de proyectos TIC |
| UTM | Unidad Tributaria Mensual |
| UF | Unidad de Fomento |

## Términos de uso interno del proyecto

Términos que el corpus emplea con un sentido preciso y que no son siglas ni entidades del modelo de datos.

| Término | Significado |
|---|---|
| **Corpus** | El conjunto de documentos de especificación escritos del proyecto: planes de módulo, especificaciones transversales, decisiones de arquitectura, fichas de proceso y registro de pendientes. Cuando un documento afirma que algo **«no está en el corpus»**, significa que no está escrito en ninguno de ellos — no que sea falso ni que nadie lo sepa. La distinción es deliberada: separa lo documentado de lo sabido, lo supuesto y lo conversado, y es la base de la regla de verificación que rige la especificación. |
| **Modo degradado** | Qué hace el sistema cuando algo de lo que depende no está disponible — sea porque nunca se construyó, porque el tercero no lo ofrece, o porque falló el día que se necesitaba. En la mayoría de los casos la degradación consiste en que **el trabajo lo hace una persona**: el sistema genera un archivo y alguien lo carga en el portal del organismo, o el funcionario reingresa a mano lo que la integración habría traído sola. En unos pocos casos no hay degradación posible y la ausencia obliga a resolver el asunto de otra manera. Es un campo obligatorio de las fichas de [`arquitectura/especificacion/integraciones-terceros.md`](arquitectura/especificacion/integraciones-terceros.md). |
| **Condición de puesta en marcha** | Si un municipio puede empezar a operar sin un componente o integración determinada. Distinto de *modo degradado*: una integración puede degradar bien y aun así ser condición de puesta en marcha, o al revés. |

---

Ver `modelo-datos/glosario.md` para el mapeo específico de entidades del modelo de datos.
