# Módulo: Contabilidad

Inventario Odoo y plan de trabajo de especificación en curso. Macroprocesos, contratos y dominio nuevo aún pendientes.

## Documentos

| Documento | Descripción |
|-----------|-------------|
| [`plan-de-trabajo-contabilidad.md`](plan-de-trabajo-contabilidad.md) | Plan de especificación (v0.3): diagnóstico Magenta × Odoo, MC-1…MC-7, fases, pendientes C-nn |
| [`modelos-odoo.md`](modelos-odoo.md) | Modelos, relaciones y flujos de estado en Odoo (`account_gov_cl` + puentes Adq/HR/Inventario + Tesorería con prefijo `account.gov.*`) |
| [`prototipo/analisis-flujos.md`](prototipo/analisis-flujos.md) | Análisis de los diagramas de procesos (draw.io), supuestos S1–S13 y descripción del prototipo navegable |
| [`prototipo/guion-demo.md`](prototipo/guion-demo.md) | Guion de demo del prototipo: 12 casos (caminos felices y bloqueos) paso a paso por rol |
| [`diagramas/`](diagramas/) | Diagramas de procesos de Contabilidad levantados (6 archivos draw.io, 13 diagramas) |

## Referencias

- Prototipo HTML: [`sgm-prototipos/modulos/contabilidad/`](../../../sgm-prototipos/modulos/contabilidad/)

- Export BD parcial: [`bd-export-odoo/modulos/account-gov-cl.md`](../../../bd-export-odoo/modulos/account-gov-cl.md), [`account-gov-adquisiciones.md`](../../../bd-export-odoo/modulos/account-gov-adquisiciones.md), [`tesoreria-gov-cl.md`](../../../bd-export-odoo/modulos/tesoreria-gov-cl.md) (desfasados vs código; ver notas en el inventario)
- Estructura a replicar (cuando se levanten procesos): `modulos/adquisiciones/`
- Inventarios relacionados: [`presupuestos/modelos-odoo.md`](../presupuestos/modelos-odoo.md), [`adquisiciones/comparativa-odoo-vs-nuevo.md`](../adquisiciones/comparativa-odoo-vs-nuevo.md)
