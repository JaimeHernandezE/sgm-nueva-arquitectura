# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: L10N_CL_HOLIDAYS_ATTENDANCE (Horas Extras y Ausencias)
Módulo de control de asistencia y ausencias para sector público chileno.

#### `hr.leave.isapre` (tabla: `hr_leave_isapre`)
Solicitud de pago de licencia médica a ISAPRE / FONASA (Proceso ante institución).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `code` | varchar | Ilimitada | Código de la solicitud | | NO | NOT NULL, UNIQUE  |
| `name` | varchar | Ilimitada | Nombre/folio de la solicitud (secuencia) | | NO | NOT NULL  |
| `state` | varchar | Ilimitada | Estado: pending/sended/approved/rejected... | | NO | NOT NULL, INDEX  |
| `leave_id` | int4 | 4 bytes | Licencia médica de Odoo HR asociada | FK → `hr_leave` | SI | INDEX  |
| `employee_id`| int4 | 4 bytes | Empleado titular de la licencia | FK → `hr_employee` | NO | NOT NULL, INDEX  |
| `contract_id`| int4 | 4 bytes | Contrato vigente del empleado | FK → `hr_contract` | SI | INDEX  |
| `date_from` | timestamp| 8 bytes| Inicio de la licencia | | SI | INDEX  |
| `date_to` | timestamp| 8 bytes| Término de la licencia | | SI | INDEX  |
| `isapre_id` | int4 | 4 bytes | Institución de salud (ISAPRE o FONASA) | FK → `hr_isapre` | SI |  |
| `payslip_id` | int4 | 4 bytes | Liquidación donde se registra el descuento | FK → `hr_payslip` | SI |  |
| `type` | varchar | Ilimitada | Tipo: enfermedad / maternidad | | NO | NOT NULL, INDEX  |
| `total_days` | float8 | 8 bytes | Días totales de la licencia | | NO | NOT NULL  |
| `total_days_accepted`| float8| 8 bytes| Dias aceptados por la ISAPRE | | NO | NOT NULL  |
| `total_amount_accepted`| float8| 8 bytes| Monto total aceptado por la ISAPRE | | NO | NOT NULL  |
| `factor` | float8 | 8 bytes | Factor de cálculo (default 1) | | NO | NOT NULL  |
| `medical_license_id`| int4 | 4 bytes| Motivo de licencia (clasificación COMPIN)| FK → `hr_cl_medical_licenses`| SI |  |
| `date_sended`| timestamp| 8 bytes| Fecha de envío a la ISAPRE | | SI |  |
| `date_approved`| date | 4 bytes | Fecha de aprobación por la ISAPRE | | SI |  |
| `date_rejected`| date | 4 bytes | Fecha de rechazo por la ISAPRE | | SI |  |
| `reason_rejected`| text | Ilimitada | Motivo de rechazo de la ISAPRE | | SI |  |
| `siaper_date_from`| date | 4 bytes | Fecha inicio registrada en SIAPER RE | | SI |  |
| `siaper_date_to`| date | 4 bytes | Fecha término registrada en SIAPER RE | | SI |  |
| `siaper_mode`| varchar | Ilimitada | Tipo de reposo SIAPER: 1=Total / 2=Parcial | | SI |  |
| `siaper_type`| varchar | Ilimitada | Tipo documento SIAPER: res_exenta / dec_exento| | SI |  |
| `siaper_number`| int4 | 4 bytes | Número del documento SIAPER RE | | SI |  |
| `siaper_date`| date | 4 bytes | Fecha del documento SIAPER | | SI |  |
| `active` | bool | 1 byte | Registro activo | | NO | NOT NULL  |

#### `hr.attendance.excuse` (tabla: `hr_attendance_excuse`)
Justificación de inasistencia (Cometidos, días festivos que no generan descuento).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `employee_id`| int4 | 4 bytes | Empleado ausente | FK → `hr_employee` | NO | NOT NULL, INDEX  |
| `type` | varchar | Ilimitada | Tipo: festivo / cometido / hora_compensado...| | NO | NOT NULL, INDEX  |
| `attendance_id`| int4 | 4 bytes | Registro de asistencia asociado | FK → `hr_attendance`| SI | INDEX  |
| `check_in` | timestamp| 8 bytes| Hora de inicio de la ausencia justificada | | NO | NOT NULL  |
| `check_out` | timestamp| 8 bytes| Hora de término de la ausencia justificada | | NO | NOT NULL  |
| `worked_hours`| float8 | 8 bytes | Horas justificadas (calculado automático) | | NO | NOT NULL  |
| `affect_overtime`| bool | 1 byte | Indica si afecta el cálculo de horas extra | | NO | NOT NULL  |
| `note` | text | Ilimitada | Observaciones o notas adicionales | | SI |  |

---

