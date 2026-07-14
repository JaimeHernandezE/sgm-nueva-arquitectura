# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: L10N_CL_VIATIC (Viáticos)
Módulo de gestión de viáticos para funcionarios públicos.

#### `hr.viatic.request` (tabla: `hr_viatic_request`)
Solicitud de viático y asignación para un funcionario.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de solicitud | | NO | NOT NULL, UNIQUE  |
| `state` | varchar | Ilimitada | Estado: draft / approved / paid / rejected | | NO | NOT NULL, INDEX  |
| `employee_id`| int4 | 4 bytes | Funcionario que solicita el viático | FK → `hr_employee` | NO | NOT NULL, INDEX  |
| `date_from` | date | 4 bytes | Fecha de inicio del viaje | | NO | NOT NULL, INDEX  |
| `date_to` | date | 4 bytes | Fecha de término del viaje | | NO | NOT NULL, INDEX  |
| `destination`| varchar | Ilimitada | Destino del viaje | | SI |  |
| `total_amount`| numeric | Variable | Monto total de viáticos | | SI |  |
| `payslip_id` | int4 | 4 bytes | Liquidación en que se paga | FK → `hr_payslip` | SI |  |

#### `hr.cost.of.living` (tabla: `hr_cost_of_living`)
Tabla de costos de vida por zona (Montos de viático diario según ubicación).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre de la zona geográfica | | NO | NOT NULL  |
| `daily_amount`| numeric| Variable | Monto diario de viático para esta zona | | NO | NOT NULL  |
| `active` | bool | 1 byte | Zona activa | | NO | NOT NULL  |

#### `hr.viatic.config` (tabla: `hr_viatic_config`)
Configuración general de viáticos (Parámetros globales).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre de la configuración | | NO | NOT NULL  |
| `company_id` | int4 | 4 bytes | Empresa | FK → `res_company` | NO | NOT NULL, INDEX  |
| `active` | bool | 1 byte | Configuración activa | | NO | NOT NULL  |

---

