# Arquitectura SGM

Documentación transversal de arquitectura, organizada por propósito.

## Carpetas

| Carpeta | Propósito |
|---|---|
| [`decisiones/`](./decisiones/) | ADRs cerrados, registro de pendientes y documentos de debate / brechas |
| [`licitacion/`](./licitacion/) | Principios no negociables, modelo de entregable y sandbox del ecosistema |
| [`especificacion/`](./especificacion/) | Specs técnicas: core, seguridad, API, roles, integraciones, firma |
| [`instrucciones/`](./instrucciones/) | Cómo documentar y diseñar UI (plantilla maestra y patrones) |

## Índice de archivos

### decisiones/

- [`2026-07-eliminacion-odoo.md`](./decisiones/2026-07-eliminacion-odoo.md) — ADR: descontinuación de Odoo
- [`pendientes.md`](./decisiones/pendientes.md) — registro único de pendientes (`P-nn`)
- [`decisiones-macro-stack.md`](./decisiones/decisiones-macro-stack.md) — decisiones macro de stack
- [`brechas-estandarizacion-ntdee-pisee.md`](./decisiones/brechas-estandarizacion-ntdee-pisee.md) — diagnóstico NTDEE / PISEE

### licitacion/

- [`principios-no-negociables.md`](./licitacion/principios-no-negociables.md) — cláusulas no delegables en bases
- [`entregable-licitacion.md`](./licitacion/entregable-licitacion.md) — modelo de entregable (API + sandbox)
- [`sandbox-desarrolladores.md`](./licitacion/sandbox-desarrolladores.md) — detalle operativo del sandbox (P-16)

### especificacion/

- [`plataforma-core.md`](./especificacion/plataforma-core.md) — servicios transversales del core
- [`seguridad.md`](./especificacion/seguridad.md) — especificaciones de seguridad
- [`musts-arquitectura.md`](./especificacion/musts-arquitectura.md) — NFRs verificables
- [`estandares-api.md`](./especificacion/estandares-api.md) — estándares API y OpenAPI / fixtures
- [`contrato-api-first.md`](./especificacion/contrato-api-first.md) — metodología contract-first
- [`catalogo-roles.md`](./especificacion/catalogo-roles.md) — catálogo RBAC transversal (P-24)
- [`catalogo-documentos-firmables.md`](./especificacion/catalogo-documentos-firmables.md) — tipología de documentos firmables (anclas + roles)
- [`integracion-mercado-publico.md`](./especificacion/integracion-mercado-publico.md) — integración SGM ↔ MP
- [`estandar-firma-electronica.md`](./especificacion/estandar-firma-electronica.md) — firma electrónica
- [`openapi/comunes.yaml`](./especificacion/openapi/comunes.yaml) — componentes OpenAPI transversales

### instrucciones/

- [`plantilla-maestra-sgm.md`](./instrucciones/plantilla-maestra-sgm.md) — norma de documentación de procesos
- [`patron-vista-expediente.md`](./instrucciones/patron-vista-expediente.md) — patrón UI de expediente
- [`patron-formularios-secciones.md`](./instrucciones/patron-formularios-secciones.md) — patrón UI de formularios
- [`patron-edicion-anclas-firma.md`](./instrucciones/patron-edicion-anclas-firma.md) — patrón UI de anclas en plantillas firmables

## Nota

La capa analítica de Adquisiciones vive en [`modulos/adquisiciones/analitica.md`](../modulos/adquisiciones/analitica.md), no en esta carpeta.
