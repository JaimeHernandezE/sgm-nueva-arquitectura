# Módulo: RRHH / Remuneraciones

Inventario Odoo del stack municipal de remuneraciones documentado. Plan de trabajo de especificación en curso. Macroprocesos, contratos y dominio nuevo aún pendientes.

## Documentos

| Documento | Descripción |
|-----------|-------------|
| [`plan-de-trabajo-rrhh.md`](plan-de-trabajo-rrhh.md) | Plan de trabajo v0.2 — diagnóstico Magenta × Odoo, decisiones, fases y pendientes **R-nn** |
| [`modelos-odoo.md`](modelos-odoo.md) | Modelos, relaciones y flujos de estado en Odoo (`tupa_hr` + `l10n_cl_hr` + `bi_hr_payroll` + satélites escala/asistencia/viáticos/méritos + puente `account_hr_gov_cl`) |

## Referencias

- Export BD parcial: [`l10n-cl-hr.md`](../../../bd-export-odoo/modulos/l10n-cl-hr.md), [`l10n-cl-hr-merit-demerit.md`](../../../bd-export-odoo/modulos/l10n-cl-hr-merit-demerit.md), [`l10n-cl-holidays-attendance.md`](../../../bd-export-odoo/modulos/l10n-cl-holidays-attendance.md), [`l10n-cl-viatic.md`](../../../bd-export-odoo/modulos/l10n-cl-viatic.md), [`employee-portal.md`](../../../bd-export-odoo/modulos/employee-portal.md) (desfasados vs código; ver notas en el inventario)
- Borde Contabilidad (asiento/decreto desde nómina): [`../contabilidad/modelos-odoo.md`](../contabilidad/modelos-odoo.md) §9
- Borde Tesorería (pago de decretos): [`../tesoreria/modelos-odoo.md`](../tesoreria/modelos-odoo.md)
- Estructura a replicar (cuando se levanten procesos): `modulos/adquisiciones/`
