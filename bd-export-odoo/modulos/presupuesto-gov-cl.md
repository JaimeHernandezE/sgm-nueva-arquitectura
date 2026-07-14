# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: PRESUPUESTO_GOV_CL (Presupuesto)
Módulo de gestión presupuestaria gubernamental municipal.

#### `account.gov.budget` (tabla: `account_gov_budget`)
Presupuesto anual municipal consolidado.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del presupuesto | | NO | NOT NULL  |
| `year` | int4 | 4 bytes | Año presupuestario | | NO | NOT NULL, INDEX  |
| `state` | varchar | Ilimitada | Estado: draft / approved / in_progress / closed | | NO | NOT NULL, INDEX  |
| `company_id` | int4 | 4 bytes | Empresa/Municipio | FK → `res_company` | NO | NOT NULL, INDEX  |

#### `account.gov.budget.line` (tabla: `account_gov_budget_line`)
Líneas del presupuesto (Detalle por cuenta, área y centro de costo).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `budget_id` | int4 | 4 bytes | Presupuesto al que pertenece | FK → `account_gov_budget`| NO | NOT NULL, INDEX  |
| `account_id` | int4 | 4 bytes | Cuenta contable | FK → `account_gov_account`| NO | NOT NULL, INDEX  |
| `area_id` | int4 | 4 bytes | Área de gestión | FK → `account_gov_area` | SI | INDEX  |
| `cost_center_id`| int4| 4 bytes | Centro de costo | `account_gov_cost_center`| SI | INDEX  |
| `requested_amount`| numeric| Variable| Monto solicitado por el área | | NO | NOT NULL  |
| `approved_amount`| numeric| Variable | Monto aprobado por autoridad | | NO | NOT NULL  |
| `current_amount`| numeric| Variable | Monto vigente con ajustes aprobados | | NO | NOT NULL  |
| `adjustment_id`| int4 | 4 bytes | Última modificación que afectó esta línea | FK → `account_gov_budget_adjustment`| SI |  |
| `reviewed` | bool | 1 byte | Línea revisada/validada | | NO | NOT NULL  |

#### `account.gov.budget.summary` (tabla: `account_gov_budget_summary`)
Resumen presupuestario consolidado por cuenta.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `budget_id` | int4 | 4 bytes | Presupuesto | FK → `account_gov_budget`| NO | NOT NULL, INDEX  |
| `account_id` | int4 | 4 bytes | Cuenta contable | FK → `account_gov_account`| NO | NOT NULL, INDEX  |
| `requested_amount`| numeric| Variable| Monto solicitado | | NO | NOT NULL  |
| `approved_amount`| numeric| Variable | Monto aprobado | | NO | NOT NULL  |
| `current_amount`| numeric| Variable | Monto vigente con ajustes | | NO | NOT NULL  |
| `adjustment_id`| int4 | 4 bytes | Último ajuste aplicado | FK → `account_gov_budget_adjustment`| SI |  |

#### `account.gov.budget.adjustment` (tabla: `account_gov_budget_adjustment`)
Modificación presupuestaria (Ajuste, Reasignación y Saldo de Apertura).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre calculado del ajuste | | NO | NOT NULL  |
| `budget_id` | int4 | 4 bytes | Presupuesto afectado | `account_gov_budget` | NO | NOT NULL, INDEX  |
| `adjustment_type`| varchar| Ilimitada| Tipo: ajuste / reasignacion / saldo_apertura | | NO | NOT NULL, INDEX  |
| `adjustment_resolution`| varchar| Ilimitada| N° de resolución autorizadora | | SI |  |
| `adjustment_date`| date | 4 bytes | Fecha de la modificación | | SI | INDEX  |
| `parent_account_id`| int4 | 4 bytes | Cuenta padre para reasignación | FK → `account_gov_account`| SI |  |
| `state` | varchar | Ilimitada | Estado: draft / approved | | NO | NOT NULL, INDEX  |
| `active` | bool | 1 byte | Activo (archivar deshace cambios) | | NO | NOT NULL, INDEX  |
| `reason` | text | Ilimitada | Motivo de la modificación | | SI |  |
| `total_amount`| numeric | Variable | Monto total (debe ser 0 en reasignaciones)| | SI |  |
| `currency_id` | int4 | 4 bytes | Moneda | FK → `res_currency` | SI |  |

#### `account.gov.budget.adjustment.line` (tabla: `account_gov_budget_adjustment_line`)
Líneas de modificación presupuestaria.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `adjustment_id`| int4 | 4 bytes | Modificación a la que pertenece | | NO | NOT NULL, INDEX  |
| `account_id` | int4 | 4 bytes | Cuenta contable modificada | FK → `account_gov_budget_adjustment`| NO | NOT NULL, INDEX  |
| `area_id` | int4 | 4 bytes | Área de gestión | FK → `account_gov_account`| SI | INDEX  |
| `cost_center_id`| int4| 4 bytes | Centro de costo | FK → `account_gov_area` | SI |  |
| `amount` | numeric | Variable | Monto del ajuste (positivo incrementa...) | FK → `account_gov_cost_center`| NO | NOT NULL  |
| `incremento` | numeric | Variable | Monto de incremento | | NO | NOT NULL  |
| `descuento` | numeric | Variable | Monto de descuento | | NO | NOT NULL  |
| `monto_nuevo` | numeric | Variable | Monto vigente resultante tras el ajuste | | NO | NOT NULL  |
| `original_budget_amount`| numeric| Variable| Monto original antes del ajuste | | SI |  |
| `original_summary_amount`| numeric| Variable| Monto original en resumen antes del ajuste | | SI |  |
| `budget_line_existed_before`| bool | 1 byte | Indica si la línea existía antes | | SI |  |
| `original_budget_line_id`| int4| 4 bytes | Línea presupuestaria original para reversión | FK → `account_gov_budget_line`| SI |  |
| `original_summary_id`| int4 | 4 bytes | Resumen original para reversión | FK → `account_gov_budget_summary`| SI |  |

#### `account.gov.budget.execution` (tabla: `account_gov_budget_execution`)
Ejecución presupuestaria en tiempo real (Avance real vs presupuestado).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `budget_id` | int4 | 4 bytes | Presupuesto de referencia | FK → `account_gov_budget`| NO | NOT NULL, INDEX  |
| `account_id` | int4 | 4 bytes | Cuenta contable | FK → `account_gov_account`| NO | NOT NULL, INDEX  |
| `area_id` | int4 | 4 bytes | Área de gestión | FK → `account_gov_area` | SI | INDEX  |
| `program_id` | int4 | 4 bytes | Programa presupuestario | FK → `account_gov_program`| SI | INDEX  |
| `period` | varchar | Ilimitada | Período de ejecución (YYYY-MM) | | NO | NOT NULL, INDEX  |
| `amount_budgeted`| numeric| Variable | Monto presupuestado vigente | | NO | NOT NULL  |
| `amount_executed`| numeric| Variable | Monto ejecutado acumulado | | NO | NOT NULL  |
| `amount_available`| numeric| Variable | Monto disponible (presupuestado - ejecutado) | | NO | NOT NULL  |

#### `account.gov.availability` (tabla: `account_gov_availability`)
Certificado de disponibilidad presupuestaria (CDP).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número del certificado de disponibilidad | | NO | NOT NULL, UNIQUE  |
| `state` | varchar | Ilimitada | Estado: draft/confirmed/used/expired | | NO | NOT NULL, INDEX  |
| `date` | date | 4 bytes | Fecha de emisión | | NO | NOT NULL, INDEX  |
| `amount` | numeric | Variable | Monto certified | | NO | NOT NULL  |
| `account_id` | int4 | 4 bytes | Cuenta presupuestaria afectada | FK → `account_gov_account`| NO | NOT NULL, INDEX  |
| `area_id` | int4 | 4 bytes | Área de gestión | FK → `account_gov_area` | SI | INDEX  |
| `company_id` | int4 | 4 bytes | Empresa | FK → `res_company` | NO | NOT NULL, INDEX  |
| `description`| text | Ilimitada | Descripción del gasto a financiar | | SI |  |

#### `account.gov.area` (tabla: `account_gov_area`)
Áreas de gestión presupuestaria.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del área | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código del área | | SI | UNIQUE  |
| `active` | bool | 1 byte | Área activa | | NO | NOT NULL  |

#### `account.gov.program` (tabla: `account_gov_program`)
Programas presupuestarios (Clasificación funcional del gasto).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del programa | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código del programa | | SI | UNIQUE  |
| `active` | bool | 1 byte | Programa activo | | NO | NOT NULL  |

#### `presupuesto.income` (tabla: `presupuesto_income`)
Catálogo de ingresos municipales.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del ingreso | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código único del ingreso | | NO | NOT NULL, UNIQUE  |
| `active` | bool | 1 byte | Ingreso activo | | NO | NOT NULL  |

#### `presupuesto.tax.income` (tabla: `presupuesto_tax_income`)
Consulta de ingreso / impuesto.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `income_id` | int4 | 4 bytes | Impuesto/fuente de ingreso | FK → `presupuesto_income`| NO | NOT NULL, INDEX  |
| `name` | varchar | Ilimitada | Nombre (relacionado con income_id) | | SI |  |
| `code` | varchar | Ilimitada | Código (relacionado con income_id) | | SI |  |
| `unit_id` | int4 | 4 bytes | Unidad giradora (departamento) | FK → `hr_department`| SI | INDEX  |
| `type` | varchar | Ilimitada | Tipo: municipal / fiscal / otro | | SI |  |
| `budget_id` | int4 | 4 bytes | Presupuesto asociado | FK → `account_gov_budget`| SI |  |
| `is_enrolled`| bool | 1 byte | Enrolado en sistema | | NO | NOT NULL  |
| `is_cash_payment`| bool| 1 byte | Permite giro en caja | | NO | NOT NULL  |
| `is_web_payment`| bool | 1 byte | Permite pago por web | | NO | NOT NULL  |
| `active` | bool | 1 byte | Activo | | NO | NOT NULL  |

---

