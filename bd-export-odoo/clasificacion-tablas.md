# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](bd-sgm.md)

---

## 3. Detalle y Clasificación de Tablas por Módulo

Las tablas del SGM se clasifican en tres categorías:
* **MAESTRA:** Tablas de configuración y parámetros. Se modifican raramente.
* **TRANSACCIONAL:** Tablas del flujo de negocio. Alta frecuencia de inserción y actualización (Críticas).
* **HISTÓRICA:** Tablas de auditoría, logs y registros cerrados. Solo se insertan.

### Tablas Críticas del Sistema
Requieren respaldo frecuente, monitoreo de crecimiento y especial cuidado en migraciones:

* **`tupa_file` (TUPA):** Expediente municipal. Tabla raíz del sistema. Referenciada por casi todos los módulos.
* **`tupa_file_line` (TUPA):** Tabla de mayor volumen. Crece con cada acción de cada expediente. Contiene estados inmutables.
* **`account_gov_move` (Contabilidad):** Comprobantes contables. Tabla crítica financiera. Pérdida irreversible.
* **`account_gov_move_line` (Contabilidad):** Mayor volumen contable. Cada comprobante genera múltiples líneas.
* **`account_gov_budget_execution` (Presupuesto):** Ejecución presupuestaria en tiempo real. Base para reportes DIPRES/CGR.
* **`account_gov_obligations` (Adquisiciones):** Obligaciones contraídas. Determina el gasto comprometido del municipio.
* **`hr_leave_isapre` (RRHH):** Datos de licencias médicas con integración SIAPER. Conservación obligatoria.

### Tablas Históricas y de Auditoría (Odoo & Custom)
Odoo genera logs automáticos en tablas del ORM para modelos que heredan de `mail.thread`, sumado a los snapshots del sistema:

| Tabla PostgreSQL / Odoo | Módulo | Descripción / Motivo de Auditoría |
| :--- | :--- | :--- |
| `mail_message` | Odoo Core | Mensajes y chatter de todos los modelos (Cambios de estado, comentarios). |
| `mail_tracking_value` | Odoo Core | Valores anteriores y nuevos de cada campo modificado con `tracking=True`. |
| `tupa_file_line` (`stage_json`) | TUPA | Snapshot JSON inmutable de la etapa en el momento de ejecución. |
| `account_gov_closure` | Contabilidad | Cierres contables. No se modifican tras el cierre final. |
| `adquisiciones_resolucion_compra`| Adquisiciones | Resoluciones de compra firmadas e inmutables tras firma. |
| `hr_cl_employee_extra_used` | RRHH | Historial inmutable completo de uso de horas extras por empleado o liquidación. |
| `hr_request_merit` / `hr_request_demerit`| RRHH / Méritos | Registro permanente de méritos y medidas disciplinarias de personal. |

---

