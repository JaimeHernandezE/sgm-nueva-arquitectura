# SGM — Documentación de Procesos y Modelo de Datos

Repositorio de documentación funcional y técnica del Sistema de Gestión Municipal (SGM), SUBDERE.

## Qué es esto

Este repo documenta, en Markdown versionado, los macroprocesos y modelo de datos del SGM — el ERP municipal en desarrollo para SUBDERE, actualmente en definición de bases de licitación tras la decisión de descontinuar la base Odoo (julio 2026, ver `arquitectura/decisiones/2026-07-eliminacion-odoo.md`).

**No es** el repositorio de código. El código vive en GitLab, en `ci-cd-sgm/` (infraestructura) y `addons/odoo_subdere/` (addons Odoo, legado). Este repo es insumo de especificación — está pensado para ser leído tanto por personas como por herramientas de agentes de código (Claude Code, Cursor) como contexto de proyecto al momento de diseñar o implementar.

## Cómo navegar

- **`arquitectura/`** — principios no negociables ([`principios-no-negociables.md`](arquitectura/principios-no-negociables.md)), estándares API, seguridad, decisiones de arquitectura y el diseño de integración con Mercado Público. Pendientes de arquitectura centralizados en [`pendientes.md`](arquitectura/pendientes.md).
<!-- REVISAR: la sección Convenciones más abajo dice que los pendientes viven incrustados en cada subproceso, sin backlog centralizado — eso aplica a fichas de proceso, pero ya no a documentos de arquitectura. -->
- **`modelo-datos/`** — fuente única de las entidades del modelo de datos (`entidades-core.md`) y el glosario de términos de dominio. Los macroprocesos referencian estas entidades, no las redefinen.
- **`modulos/`** — un subdirectorio por módulo funcional (Adquisiciones, Tesorería, Contabilidad, Presupuestos, RRHH). En Adquisiciones, los procesos transversales (SOLPED, Recepción Conforme, Pago) viven en `procesos-transversales/`; cada modalidad de compra tiene su propio subdirectorio con las etapas 2 y 3 específicas (ej. `adquisiciones/1. compra-agil/`).

Cada macroproceso también trae su ficha QA (`qa/`) y sus diagramas BPMN (`diagramas/`) versionados junto a la documentación.

## Estado actual

| Módulo | Macroproceso | Estado |
|---|---|---|
| Adquisiciones | Compra Ágil | ✅ Etapas 2–3 documentadas; etapas transversales en `procesos-transversales/` |
| Adquisiciones | Convenio Marco | ⏳ Pendiente |
| Adquisiciones | Licitación Pública | ⏳ Pendiente |
| Adquisiciones | Trato Directo | ⏳ Pendiente |
| Tesorería | — | ⏳ Pendiente |
| Contabilidad | — | ⏳ Pendiente |
| Presupuestos | — | ⏳ Pendiente |
| RRHH / Remuneraciones | — | ⏳ Pendiente |

## Convenciones

- Nombres de entidad en inglés, estilo técnico (`PurchaseRequest`, no `SolicitudCompra`) — ver `modelo-datos/entidades-core.md`.
- Cada sub-paso de proceso documenta: Unidad, Rol, Plataforma, Optativo, entidades/campos involucrados, edge cases, y puntos marcados explícitamente como **pendientes de definir** cuando la fuente no resuelve una regla de negocio.
- Los pendientes se mantienen incrustados en el archivo del subproceso donde aparecen (no hay un backlog centralizado) — al resolverse, se actualiza directamente el archivo correspondiente.
