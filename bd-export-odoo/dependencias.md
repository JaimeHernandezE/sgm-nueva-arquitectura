# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](bd-sgm.md)

---

## 2. Dependencias entre Módulos

Un módulo depende de otro cuando utiliza sus tablas o modelos para funcionar correctamente.

| Módulo | Depende de | Naturaleza de la dependencia |
| :--- | :--- | :--- |
| `account_gov_cl` | `tupa` | Comprobantes contables (`account.gov.move`) vinculados a expedientes TUPA (`tupa_file_id`). |
| `presupuesto_gov_cl`| `account_gov_cl` | Líneas de movimiento (`account.gov.move.line`) extendidas con área y programa presupuestario. |
| `account_gov_adquisiciones`| `account_gov_cl`, `presupuesto_gov_cl`| Obligaciones y CDPs usan cuentas contables y presupuesto vigente. |
| `account_gov_adquisiciones`| `tupa` | Solicitudes de pedido tramitadas a través de expedientes TUPA. |
| `tesoreria_gov_cl` | `account_gov_cl` | Ingresos percibidos generan comprobantes contables (`account.gov.move`). |
| `tesoreria_gov_cl` | `account_gov_cl` | Órdenes de ingreso son la base del flujo de recaudación. |
| `l10n_cl_hr` | `account_gov_cl`, `tupa` | Liquidaciones y finiquitos generan comprobantes y usan expedientes TUPA. |
| `l10n_cl_holidays_attendance`| `l10n_cl_hr` | Licencias ISAPRE y horas extras vinculadas a contratos y liquidaciones. |
| `account_hr_gov_cl`| `account_gov_cl`, `tesoreria_gov_cl`, `l10n_cl_hr`| Integra nómina con contabilidad gubernamental y tesorería. |
| `inventory_gov_cl`| `account_gov_cl` | Activos de inventario usan cuentas contables gubernamentales. |
| `reports_gov_cl` | `account_gov_cl`, `tupa`, `l10n_cl_hr` | Reportes DIPRES/Contraloría consolidan datos contables, RRHH y expedientes. |
| `autoservicio_gov_cl`| `l10n_cl_hr`, `l10n_cl_holidays_attendance`| Autoservicio expone licencias, asistencia y liquidaciones al funcionario. |

---

