# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](bd-sgm.md)

---

## 4. Notas Técnicas Adicionales

### Convenciones de nomenclatura de tablas:
* Prefijo `tupa_*`: Módulo de Gestión Municipal (expedientes y procedimientos).
* Prefijo `account_gov_*`: Módulo de Contabilidad Gubernamental.
* Prefijo `adquisiciones_*`: Módulo de Adquisiciones Públicas.
* Prefijo `presupuesto_*`: Módulo de Presupuesto.
* Prefijo `hr_cl_*` / `hr_leave_isapre` / `hr_attendance_excuse`: Extensiones RRHH Chile.
* Prefijo `hr_viatic_*`: Módulo de Viáticos.
* Prefijo `employee_portal_*`: Portal del Empleado.

### Tablas Odoo Core Referenciadas
Las tablas `hr_employee`, `hr_contract`, `hr_leave`, `hr_payslip`, `hr_attendance`, `res_partner`, `res_users`, `res_company`, `hr_department` son nativas de Odoo. No se modifican directamente por los módulos custom; solo se extienden a través del mecanismo de herencia (`_inherit`) del ORM. Su estructura base se documenta en la documentación oficial de Odoo 17.

---
Para mayor información técnica: ResIT SpA | https://resit.cl | contacto@resit.cl.
