# Módulo: Tesorería

## Documentos

| Documento | Descripción |
|-----------|-------------|
| [`plan-de-trabajo-tesoreria.md`](plan-de-trabajo-tesoreria.md) | Plan de trabajo v0.2 — diagnóstico Magenta × Odoo, decisiones, fases y pendientes **T-nn** |
| [`modelos-odoo.md`](modelos-odoo.md) | Modelos, relaciones y flujos de estado en Odoo (`tesoreria_gov_cl` + portal; percibido, caja, decretos, garantías, SEM) |

## Decisión transversal aplicable: DocDigital

El **decreto de pago** (proceso 38; también etapa 5 de Adquisiciones y factoring en Contabilidad) se originará en SGM y se tramitará en **DocDigital** (visación, FEA, enumeración). Folio oficial = externo; correlativo interno = trazabilidad. Decisión canónica: [`arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md`](../../arquitectura/decisiones/2026-07-docdigital-tramitacion-documental.md). Inventario y brechas: [`integracion-docdigital.md`](../../arquitectura/especificacion/integracion-docdigital.md).

Detalle en el plan: **D-6**, pendiente **T-11** (alineado a P-74). Mecanismo de integración — **[PENDIENTE P-72]** (bloqueante).

## Referencias

- Export BD parcial: [`bd-export-odoo/modulos/tesoreria-gov-cl.md`](../../../bd-export-odoo/modulos/tesoreria-gov-cl.md) (desfasado vs código; ver notas en el inventario)
- Borde Contabilidad: [`../contabilidad/modelos-odoo.md`](../contabilidad/modelos-odoo.md) · plan Contabilidad: [`../contabilidad/plan-de-trabajo-contabilidad.md`](../contabilidad/plan-de-trabajo-contabilidad.md)
- Estructura a replicar (cuando se levanten procesos): `modulos/adquisiciones/`
