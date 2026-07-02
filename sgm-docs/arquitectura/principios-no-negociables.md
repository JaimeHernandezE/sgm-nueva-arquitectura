# Principios de Arquitectura No Negociables

Estos principios deben quedar definidos en las bases de cualquier licitación de desarrollo del nuevo stack SGM, y no pueden delegarse al proveedor adjudicado — evitan recrear lock-in con un nuevo vendor de la misma forma en que ocurrió con Odoo.

## 1. REST API-first

El backend expone una API REST documentada como contrato de primera clase, con **OpenAPI como fuente de verdad, versionada** en el repositorio; el código se valida contra la especificación, no al revés. El frontend base (el que construya el adjudicatario) debe consumir esa misma API pública, sin privilegios especiales — esta es la disciplina que mantiene viable, a futuro, un marketplace o frontend de terceros sobre el mismo backend.

## 2. Hosting del motor y residencia de datos

El **motor** SGM se aloja en infraestructura propia de SUBDERE — nunca en infraestructura del proveedor adjudicatario, que es el lock-in que este principio evita. La **residencia de los datos** sigue el modo de consumo definido en `decisiones-macro-stack.md` §1–2:

- **Hosting completo** (municipios sin capacidad TI): motor, datos y frontend base en infraestructura SUBDERE.
- **Módulos à la carte vía API** (municipios con sistemas propios): el municipio absorbe su data en su propia infraestructura/nube, consumiendo el motor vía API.

Multitenancy por municipio con **separación por schema** y datos claramente aislados entre tenants, en ambos modos.

## 3. Stack abierto

Sin dependencias de licenciamiento propietario que reintroduzcan lock-in. Componentes con licencia open source permisiva, comunidad activa y posibilidad real de cambio de proveedor de mantención sin reescritura completa. El lenguaje y framework elegidos deben tener **mercado laboral local verificable** — las bases pueden exigir evidencia en la oferta.

## 4. Cumplimiento normativo desde el diseño

- **DS N°4/2020** — cumplimiento en el diseño de flujos y trazabilidad documental.
- **DS N°7/2023** — ciberseguridad: gestión de incidentes, coordinación CSIRT, estándares mínimos de plataformas del Estado (detalle en [`seguridad.md`](./seguridad.md)).
- **DS N°1/2015 (Ley N°20.422)** — accesibilidad del frontend base. **[PENDIENTE P-20]** especificación de accesibilidad no existe aún como documento.
- **Ley 21.719** (protección de datos personales) — aplicable especialmente a datos de RRHH, proveedores y ciudadanos en módulos futuros (Rentas, JPL).
- **Ley 19.886** (compras públicas) — tratamiento diferenciado por modalidad de compra (ver `modulos/adquisiciones/`), no un flujo genérico.
- **Ley 19.799** (firma electrónica) — relevante para integración con FirmaGob/FirmaDigital.

Especificación de seguridad completa: [`seguridad.md`](./seguridad.md).

## 5. Propiedad del código de Estado

El código fuente es propiedad de SUBDERE, con cláusulas de portabilidad explícitas en el contrato de licitación — no debe quedar dependencia irrestricta de un proveedor único para mantención o evolución futura.

## 6. Separación de almacenamiento de objetos

Los archivos/documentos (evidencias, resoluciones, comprobantes) se almacenan separados de la base de datos transaccional, con su propio ciclo de vida y política de retención.

## 7. Validación fuerte del lado del servidor

Toda regla de negocio bloqueante vive en el backend; el frontend solo la refleja. Las respuestas de error son verbosas y estructuradas según el esquema único definido en [`estandares-api.md`](./estandares-api.md) §3 — nunca un 400/422 sin cuerpo.

## Rol de un eventual apoyo externo de arquitectura

Si SUBDERE no cuenta con la capacidad interna suficiente para definir estos principios en detalle técnico, la vía correcta es un contrato de asesoría acotado en el que un especialista ayuda a definir la arquitectura, mientras la propiedad de la decisión permanece en SUBDERE. Esto es distinto de delegar estas decisiones al proveedor que construye el sistema.
