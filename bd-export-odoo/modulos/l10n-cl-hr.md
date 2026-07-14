# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: L10N_CL_HR (Remuneraciones Chile)
Módulo de remuneraciones adaptado al sector público chileno.

#### `hr.cl.employee.extra` (tabla: `hr_cl_employee_extra`)
Registro de horas extras aprobadas por resolución para un empleado.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `employee_id`| int4 | 4 bytes | Empleado titular de las horas extra | FK → `hr_employee` | NO | NOT NULL, INDEX  |
| `name` | varchar | Ilimitada | Descripción o nombre de la resolución | | SI |  |
| `resolution_date`| date | 4 bytes | Fecha de la resolución que aprueba las horas | | SI |  |
| `resolution_date_expiration`| date| 4 bytes| Fecha de vencimiento del saldo | | SI |  |
| `can_be_used`| bool | 1 byte | Indica si el saldo está disponible | | NO | INDEX  |
| `cl_he_24` / `cl_he_25`| float8| 8 bytes| Horas extra al 25% aprobadas | | NO | NOT NULL, INDEX  |
| `cl_he_50` | float8 | 8 bytes | Horas extra al 50% aprobadas | | NO | NOT NULL  |
| `cl_he_25_available`| float8| 8 bytes| Saldo disponible de horas al 25% | | NO | NOT NULL  |
| `cl_he_50_available`| float8| 8 bytes| Saldo disponible de horas al 50% | | NO | NOT NULL  |
| `total_used` | float8 | 8 bytes | Total de horas utilizadas | | NO | NOT NULL  |
| `total_remaining`| float8 | 8 bytes| Saldo total restante (calculado) | | NO | NOT NULL  |
| `overtime_id`| int4 | 4 bytes | Registro de overtime origen | FK → `hr_attendance_overtime`| SI |  |

#### `hr.cl.employee.extra.used` (tabla: `hr_cl_employee_extra_used`)
Detalle del uso e historial de descuento al saldo de horas extras.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `extra_id` | int4 | 4 bytes | Saldo de horas extras del que se descuenta | FK → `hr_cl_employee_extra`| NO | NOT NULL, INDEX  |
| `cl_he_25` | float8 | 8 bytes | Horas al 25% utilizadas en este registro | | NO | NOT NULL  |
| `cl_he_50` | float8 | 8 bytes | Horas al 50% utilizadas en este registro | | NO | NOT NULL  |
| `payslip_id` | int4 | 4 bytes | Liquidación en que se descontaron | FK → `hr_payslip` | SI | INDEX  |
| `leave_id` | int4 | 4 bytes | Ausencia asociada al uso de horas | FK → `hr_leave` | SI | INDEX  |
| `date` | date | 4 bytes | Fecha del uso | | SI |  |

#### `hr.cl.medical.licenses` (tabla: `hr_cl_medical_licenses`)
Catálogo de motivos de licencias médicas según clasificación COMPIN.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Descripción del motivo de licencia | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código COMPIN del motivo | | SI | UNIQUE  |
| `active` | bool | 1 byte | Motivo activo | | NO | NOT NULL  |

#### `hr.overtime.resolution` (tabla: `hr_overtime_resolution`)
Resolución de horas extras (Acto administrativo que autoriza pago).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de resolución | | NO | NOT NULL, UNIQUE  |
| `state` | varchar | Ilimitada | Estado: draft / approved / rejected | | NO | NOT NULL, INDEX  |
| `date` | date | 4 bytes | Fecha de la resolución | | NO | NOT NULL, INDEX  |
| `employee_id`| int4 | 4 bytes | Empleado beneficiado | FK → `hr_employee` | NO | NOT NULL, INDEX  |
| `cl_extra_id`| int4 | 4 bytes | Horas extras generadas | FK → `hr_cl_employee_extra`| SI |  |
| `total_hours`| float8 | 8 bytes | Total de horas autorizadas | | NO | NOT NULL  |

---

