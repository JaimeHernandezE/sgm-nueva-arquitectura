# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: L10N_CL_HR_MERIT_DEMERIT (Méritos y Deméritos)
Gestión de reconocimientos y sanciones administrativas.

#### `hr.request.merit` (tabla: `hr_request_merit`)
Solicitud de mérito para un funcionario (Reconocimiento).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de solicitud de mérito (secuencia) | | NO | NOT NULL, UNIQUE  |
| `state` | varchar | Ilimitada | Estado: draft / submitted / approved / rejected | | NO | NOT NULL, INDEX  |
| `employee_id`| int4 | 4 bytes | Funcionario propuesto para mérito | FK → `hr_employee` | NO | NOT NULL, INDEX  |
| `date` | date | 4 bytes | Fecha de la solicitud | | NO | NOT NULL, INDEX  |
| `reason` | text | Ilimitada | Fundamento del mérito | | NO | NOT NULL  |
| `approver_id`| int4 | 4 bytes | Autoridad que aprueba el mérito | FK → `res_users` | SI |  |

#### `hr.request.demerit` (tabla: `hr_request_demerit`)
Solicitud de demérito o medida disciplinaria para un funcionario.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de solicitud (secuencia) | | NO | NOT NULL, UNIQUE  |
| `state` | varchar | Ilimitada | Estado: draft / submitted / approved / rejected | | NO | NOT NULL, INDEX  |
| `employee_id`| int4 | 4 bytes | Funcionario afectado | FK → `hr_employee` | NO | NOT NULL, INDEX  |
| `date` | date | 4 bytes | Fecha de la medida | | NO | NOT NULL, INDEX  |
| `reason` | text | Ilimitada | Fundamento de la medida disciplinaria | | NO | NOT NULL  |
| `severity` | varchar | Ilimitada | Gravedad: low / medium / high | | SI |  |
| `approver_id`| int4 | 4 bytes | Autoridad que aprueba | FK → `res_users` | SI |  |

---

