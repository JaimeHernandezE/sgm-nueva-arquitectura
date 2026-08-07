# Arquitectura SGM

Documentación transversal de arquitectura, organizada por propósito.

## Carpetas

| Carpeta | Propósito |
|---|---|
| [`decisiones/`](./decisiones/) | ADRs cerrados, registro de pendientes y documentos de debate / brechas |
| [`licitacion/`](./licitacion/) | Principios no negociables, modelo de entregable y sandbox del ecosistema |
| [`especificacion/`](./especificacion/) | Specs técnicas: core, seguridad, API, roles, integraciones, firma |
| [`instrucciones/`](./instrucciones/) | Gobierno operativo del repo, plantilla maestra y patrones UI |

## Índice de archivos

### Plan general del corpus

- [`../plan-general.md`](../plan-general.md) — gobierna consistencia entre módulos, grafo de pendientes y secuencia B0–B2
- [`../../anatomia-y-arquitectura.md`](../../anatomia-y-arquitectura.md) — anatomía de la especificación (Compra Ágil), enfoques de arquitectura y pendientes por naturaleza del bloqueo

### decisiones/

- [`2026-07-eliminacion-odoo.md`](./decisiones/2026-07-eliminacion-odoo.md) — ADR: descontinuación de Odoo
- [`2026-07-docdigital-tramitacion-documental.md`](./decisiones/2026-07-docdigital-tramitacion-documental.md) — ADR: DocDigital como tramitación de actos (SGM origina; DocDigital tramita)
- [`2026-07-ventana-mutabilidad.md`](./decisiones/2026-07-ventana-mutabilidad.md) — ADR: patrón apertura/cierre/reapertura
- [`2026-07-atomicidad-efectos-borde.md`](./decisiones/2026-07-atomicidad-efectos-borde.md) — ADR: problema canónico (tres manifestaciones; ancla C-1)
- [`2026-07-patrones-transversales-corpus.md`](./decisiones/2026-07-patrones-transversales-corpus.md) — expediente sin efecto, citas, plazos, gates, integraciones
- [`pendientes.md`](./decisiones/pendientes.md) — registro transversal (`X-nn`)
- [`decisiones-macro-stack.md`](./decisiones/decisiones-macro-stack.md) — decisiones macro de stack
- [`brechas-estandarizacion-ntdee-pisee.md`](./decisiones/brechas-estandarizacion-ntdee-pisee.md) — diagnóstico NTDEE / PISEE

### licitacion/

- [`principios-no-negociables.md`](./licitacion/principios-no-negociables.md) — cláusulas no delegables en bases
- [`entregable-licitacion.md`](./licitacion/entregable-licitacion.md) — modelo de entregable (API + sandbox)
- [`sandbox-desarrolladores.md`](./licitacion/sandbox-desarrolladores.md) — detalle operativo del sandbox (X-16)
- [`alcance-minimo-modulos-adyacentes.md`](./licitacion/alcance-minimo-modulos-adyacentes.md) — piso irreducible Cont/Tes/RRHH para Adq+Pres (X-78…X-81)

### especificacion/

- [`plataforma-core.md`](./especificacion/plataforma-core.md) — servicios transversales del core
- [`seguridad.md`](./especificacion/seguridad.md) — especificaciones de seguridad
- [`musts-arquitectura.md`](./especificacion/musts-arquitectura.md) — NFRs verificables
- [`estandares-api.md`](./especificacion/estandares-api.md) — estándares API y OpenAPI / fixtures
- [`estandar-pruebas.md`](./especificacion/estandar-pruebas.md) — estándar de pruebas y verificación (T1–T12; X-86…X-93)
- [`contrato-api-first.md`](./especificacion/contrato-api-first.md) — metodología contract-first
- [`catalogo-roles.md`](./especificacion/catalogo-roles.md) — catálogo RBAC transversal (X-24)
- [`catalogo-documentos-firmables.md`](./especificacion/catalogo-documentos-firmables.md) — tipología de documentos firmables (anclas + roles)
- [`registro-normas.md`](./especificacion/registro-normas.md) — registro único de normas citadas (`N-nn`) + apariciones
- [`integraciones-terceros.md`](./especificacion/integraciones-terceros.md) — registro único de integraciones con terceros (jefatura / CPI / bases)
- [`integracion-mercado-publico.md`](./especificacion/integracion-mercado-publico.md) — integración SGM ↔ MP
- [`integracion-docdigital.md`](./especificacion/integracion-docdigital.md) — integración SGM ↔ DocDigital (C11; condicionada a X-72)
- [`estandar-firma-electronica.md`](./especificacion/estandar-firma-electronica.md) — firma electrónica
- [`openapi/comunes.yaml`](./especificacion/openapi/comunes.yaml) — componentes OpenAPI transversales

### instrucciones/

- [`gobierno-repositorio.md`](./instrucciones/gobierno-repositorio.md) — gobierno operativo / coherencia al editar (mapa de fuentes de verdad; orquestador Cursor)
- [`plantilla-maestra-sgm.md`](./instrucciones/plantilla-maestra-sgm.md) — norma de documentación de procesos
- [`patron-vista-expediente.md`](./instrucciones/patron-vista-expediente.md) — patrón UI de expediente
- [`patron-formularios-secciones.md`](./instrucciones/patron-formularios-secciones.md) — patrón UI de formularios
- [`patron-edicion-anclas-firma.md`](./instrucciones/patron-edicion-anclas-firma.md) — patrón UI de anclas en plantillas firmables

## Nota

La capa analítica de Adquisiciones vive en [`modulos/adquisiciones/analitica.md`](../modulos/adquisiciones/analitica.md), no en esta carpeta.
