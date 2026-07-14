# Documentación Técnica - Sistema de Gestión Municipal (SGM)

**Preparado por:** ResIT SpA   
**Versión:** 1.0 - Abril 2025   
**Plataforma:** Odoo 17 Community | PostgreSQL 15   
**Clasificación:** Confidencial 

---

## Introducción

El presente documento constituye la documentación técnica oficial de la base de datos PostgreSQL del Sistema de Gestión Municipal (SGM), desarrollado a medida por ResIT SpA sobre la plataforma Odoo 17 Community.

El SGM integra los siguientes módulos funcionales desarrollados por ResIT:
* **TUPA:** Gestión de Expedientes y Procedimientos Municipales.
* **ACCOUNT_GOV_CL:** Contabilidad Gubernamental (Plan SIAF).
* **PRESUPUESTO_GOV_CL:** Formulación y Control Presupuestario.
* **ACCOUNT_GOV_ADQUISICIONES:** Compras y Adquisiciones Públicas.
* **TESORERIA_GOV_CL:** Tesorería y Pagos.
* **L10N_CL_HR:** Remuneraciones Sector Público Chileno.
* **L10N_CL_HOLIDAYS_ATTENDANCE:** Control de Asistencia y Ausencias.
* **L10N_CL_HR_SCALE:** Escala Única Salarial.
* **L10N_CL_VIATIC:** Gestión de Viáticos.
* **EMPLOYEE_PORTAL:** Portal del Empleado.
* **L10N_CL_HR_MERIT_DEMERIT:** Méritos y Deméritos.
* **INVENTORY_GOV_CL:** Inventario Gubernamental.
* **AUTOSERVICIO_GOV_CL:** Autoservicio Funcionario.

> 💡 **Nota técnica sobre integridad:** Odoo gestiona relaciones entre modelos a nivel de ORM (campos Many2one, One2many, Many2many). Las claves foráneas aquí documentadas corresponden a relaciones ORM. Solo algunas tienen restricción de FK a nivel de PostgreSQL; la integridad referencial es garantizada por el ORM.

---

## Diccionario de Datos (por módulo)

| Módulo | Archivo |
| :--- | :--- |
| TUPA — Gestión de Expedientes y Procedimientos Municipales | [`modulos/tupa.md`](modulos/tupa.md) |
| ACCOUNT_GOV_CL — Contabilidad Gubernamental (Plan SIAF) | [`modulos/account-gov-cl.md`](modulos/account-gov-cl.md) |
| PRESUPUESTO_GOV_CL — Formulación y Control Presupuestario | [`modulos/presupuesto-gov-cl.md`](modulos/presupuesto-gov-cl.md) |
| ACCOUNT_GOV_ADQUISICIONES — Compras y Adquisiciones Públicas | [`modulos/account-gov-adquisiciones.md`](modulos/account-gov-adquisiciones.md) |
| TESORERIA_GOV_CL — Tesorería y Pagos | [`modulos/tesoreria-gov-cl.md`](modulos/tesoreria-gov-cl.md) |
| L10N_CL_HR — Remuneraciones Sector Público Chileno | [`modulos/l10n-cl-hr.md`](modulos/l10n-cl-hr.md) |
| L10N_CL_HOLIDAYS_ATTENDANCE — Control de Asistencia y Ausencias | [`modulos/l10n-cl-holidays-attendance.md`](modulos/l10n-cl-holidays-attendance.md) |
| L10N_CL_VIATIC — Gestión de Viáticos | [`modulos/l10n-cl-viatic.md`](modulos/l10n-cl-viatic.md) |
| EMPLOYEE_PORTAL — Portal del Empleado | [`modulos/employee-portal.md`](modulos/employee-portal.md) |
| L10N_CL_HR_MERIT_DEMERIT — Méritos y Deméritos | [`modulos/l10n-cl-hr-merit-demerit.md`](modulos/l10n-cl-hr-merit-demerit.md) |

> Los módulos listados en la introducción sin diccionario propio en el export original (`L10N_CL_HR_SCALE`, `INVENTORY_GOV_CL`, `AUTOSERVICIO_GOV_CL`) no tienen sección de tablas en esta documentación.

---

## Secciones transversales

| Sección | Archivo |
| :--- | :--- |
| Dependencias entre módulos | [`dependencias.md`](dependencias.md) |
| Clasificación de tablas por módulo | [`clasificacion-tablas.md`](clasificacion-tablas.md) |
| Notas técnicas adicionales | [`notas-tecnicas.md`](notas-tecnicas.md) |

---
Para mayor información técnica: ResIT SpA | https://resit.cl | contacto@resit.cl.
