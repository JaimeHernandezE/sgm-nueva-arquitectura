# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: ACCOUNT_GOV_CL (Contabilidad Gubernamental)
Módulo adaptado al Plan de Cuentas del sector público chileno (CGR).

#### `account.gov.plan` (tabla: `account_gov_plan`)
Plan de cuentas gubernamental.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del plan de cuentas | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código del plan | | SI | UNIQUE  |
| `company_id` | int4 | 4 bytes | Empresa/Municipio propietario | FK → `res_company` | SI | INDEX  |
| `account_ids`| | | Cuentas asociadas (One2many) | O2M | NO |  |

#### `account.gov.account` (tabla: `account_gov_account`)
Cuenta contable gubernamental con soporte de estructura jerárquica.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre de la cuenta contable | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código contable (clasificador) | | NO | NOT NULL, UNIQUE  |
| `plan_id` | int4 | 4 bytes | Plan de cuentas al que pertenece | FK → `account_gov_plan`| NO | NOT NULL, INDEX  |
| `parent_id` | int4 | 4 bytes | Cuenta padre (estructura jerárquica) | FK → `account_gov_account`| SI | INDEX  |
| `type` | varchar | Ilimitada | Tipo: view / normal / receivable / payable | | NO | NOT NULL, INDEX  |
| `active` | bool | 1 byte | Cuenta activa | | NO | NOT NULL  |
| `company_id` | int4 | 4 bytes | Empresa | FK → `res_company` | NO | NOT NULL, INDEX  |
| `note` | text | Ilimitada | Notas sobre la cuenta | | SI |  |

#### `account.gov.move` (tabla: `account_gov_move`)
Comprobante contable gubernamental (Registro principal de transacciones).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de comprobante (secuencia) | | NO | NOT NULL, UNIQUE  |
| `state` | varchar | Ilimitada | Estado: draft / posted / cancel | | NO | NOT NULL, INDEX  |
| `date` | date | 4 bytes | Fecha contable del comprobante | | NO | NOT NULL, INDEX  |
| `ref` | varchar | Ilimitada | Referencia o descripción | | SI |  |
| `company_id` | int4 | 4 bytes | Empresa/Municipio | FK → `res_company` | NO | NOT NULL, INDEX  |
| `journal_type`| varchar | Ilimitada | Tipo de diario contable | | SI | INDEX  |
| `move_type_id`| int4 | 4 bytes | Tipo de movimiento contable | FK → `movement_type` | SI | INDEX  |
| `partner_id` | int4 | 4 bytes | Proveedor o tercero vinculado | FK → `res_partner` | SI | INDEX  |
| `amount_total`| numeric | Variable | Monto total del comprobante | | SI |  |
| `tupa_file_id`| int4 | 4 bytes | Expediente TUPA asociado | FK → `tupa_file` | SI | INDEX  |
| `create_uid` | int4 | 4 bytes | Usuario creador | FK → `res_users` | SI |  |
| `create_date`| timestamp| 8 bytes | Fecha de creación | | SI | INDEX  |

#### `account.gov.move.line` (tabla: `account_gov_move_line`)
Línea de comprobante contable (Detalle débito/crédito).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `move_id` | int4 | 4 bytes | Comprobante al que pertenece | FK → `account_gov_move`| NO | NOT NULL, INDEX  |
| `account_id` | int4 | 4 bytes | Cuenta contable de la línea | FK → `account_gov_account`| NO | NOT NULL, INDEX  |
| `name` | varchar | Ilimitada | Descripción de la línea | | SI |  |
| `debit` | numeric | Variable | Monto débito | | NO | NOT NULL  |
| `credit` | numeric | Variable | Monto crédito | | NO | NOT NULL  |
| `balance` | numeric | Variable | Balance (débito - crédito) | | NO | NOT NULL  |
| `cost_center_id`| int4| 4 bytes | Centro de costo | FK → `account_gov_cost_center`| SI | INDEX  |
| `partner_id` | int4 | 4 bytes | Tercero vinculado | FK → `res_partner` | SI | INDEX  |

#### `account.gov.entry.order` (tabla: `account_gov_entry_order`)
Orden de ingreso de fondos o derecho a cobro tributario municipal.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de orden de ingreso | | NO | NOT NULL, UNIQUE  |
| `state` / `status`| varchar| Ilimitada| Estado: draft/confirmed/paid/cancel/accrued| | NO | NOT NULL, INDEX  |
| `date` / `date_order`| date| 4 bytes | Fecha de la orden / emisión | | NO | NOT NULL, INDEX  |
| `partner_id` | int4 | 4 bytes | Pagador / Deudor / Contribuyente | FK → `res_partner` | SI | INDEX  |
| `amount` | numeric | Variable | Monto total a ingresar | | NO | NOT NULL  |
| `account_id` | int4 | 4 bytes | Cuenta contable destino | FK → `account_gov_account`| SI | INDEX  |
| `move_id` | int4 | 4 bytes | Comprobante contable generado | FK → `account_gov_move`| SI |  |
| `tupa_file_id`| int4 | 4 bytes | Expediente TUPA relacionado | FK → `tupa_file` | SI | INDEX  |
| `company_id` | int4 | 4 bytes | Empresa | FK → `res_company` | NO | NOT NULL, INDEX  |
| `received_status`| varchar| Ilimitada| Estado de percepción: draft/confirmed | | SI | INDEX  |
| `entry_department_id`| int4| 4 bytes| Departamento de asientos contables | FK → `account_gov_entry_department`| NO | NOT NULL, INDEX  |
| `due_date` | date | 4 bytes | Fecha de vencimiento de la deuda | | SI | INDEX  |
| `payment_date`| date | 4 bytes | Fecha de pago efectivo | | SI | INDEX  |
| `observations`| text | Ilimitada | Glosa de la orden | | SI |  |
| `user_id` | int4 | 4 bytes | Usuario que emite la orden | FK → `res_users` | NO | NOT NULL, INDEX  |
| `patent` | varchar | Ilimitada | Patente (permisos de circulación) | | SI |  |
| `patent_role` | varchar | Ilimitada | ROL Patente | | SI |  |
| `property_role`| varchar | Ilimitada | ROL Propiedad (contribuciones) | | SI |  |
| `fee` | varchar | Ilimitada | Cuota (primera/segunda) | | SI |  |
| `year` | varchar | Ilimitada | Año tributario | | SI | INDEX  |
| `currency_id` | int4 | 4 bytes | Moneda | FK → `res_currency` | NO | NOT NULL, INDEX  |

#### `account.gov.bank` (tabla: `account_gov_bank`)
Instituciones bancarias registradas para operaciones de tesorería.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del banco | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código del banco | | SI | UNIQUE  |
| `active` | bool | 1 byte | Banco activo | | NO | NOT NULL  |

#### `account.gov.bank.account` (tabla: `account_gov_bank_account`)
Cuentas bancarias del municipio.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre descriptivo de la cuenta | | NO | NOT NULL  |
| `account_number`| varchar| Ilimitada| Número de cuenta bancaria | | NO | NOT NULL, UNIQUE  |
| `bank_id` | int4 | 4 bytes | Banco | `account_gov_bank` | NO | NOT NULL, INDEX  |
| `gov_account_id`| int4 | 4 bytes | Cuenta contable asociada | FK → `account_gov_account`| SI | INDEX  |
| `company_id` | int4 | 4 bytes | Empresa | FK → `res_company` | NO | NOT NULL, INDEX  |
| `active` | bool | 1 byte | Cuenta activa | | NO | NOT NULL  |

#### `account.gov.check` (tabla: `account_gov_check`)
Gestión de cheques emitidos por el municipio.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de cheque | | NO | NOT NULL, UNIQUE  |
| `state` | varchar | Ilimitada | Estado: draft / emitted / cashed / cancelled | | NO | NOT NULL, INDEX  |
| `date` | date | 4 bytes | Fecha de emisión | | NO | NOT NULL, INDEX  |
| `amount` | numeric | Variable | Monto del cheque | | NO | NOT NULL  |
| `bank_account_id`| int4| 4 bytes | Cuenta bancaria de emisión | FK → `account_gov_bank_account`| NO | NOT NULL, INDEX  |
| `partner_id` | int4 | 4 bytes | Beneficiario del cheque | FK → `res_partner` | NO | NOT NULL, INDEX  |
| `move_id` | int4 | 4 bytes | Comprobante contable | FK → `account_gov_move`| SI |  |

#### `account.gov.conciliation` (tabla: `account_gov_conciliation`)
Proceso de conciliación bancaria.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre/período de la conciliación | | NO | NOT NULL  |
| `state` | varchar | Ilimitada | Estado: draft / done | | NO | NOT NULL, INDEX  |
| `date_from` | date | 4 bytes | Fecha inicio del período | | NO | NOT NULL  |
| `date_to` | date | 4 bytes | Fecha fin del período | | NO | NOT NULL  |
| `bank_account_id`| int4| 4 bytes | Cuenta bancaria conciliada | FK → `account_gov_bank_account`| NO | NOT NULL, INDEX  |
| `company_id` | int4 | 4 bytes | Empresa | FK → `res_company` | NO | NOT NULL, INDEX  |

#### `account.gov.closure` (tabla: `account_gov_closure`)
Cierre contable mensual/anual. Bloquea períodos.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del cierre | | NO | NOT NULL  |
| `state` | varchar | Ilimitada | Estado: open / closed | | NO | NOT NULL, INDEX  |
| `date_from` | date | 4 bytes | Inicio del periodo cerrado | | NO | NOT NULL  |
| `date_to` | date | 4 bytes | Fin del período cerrado | | NO | NOT NULL  |
| `company_id` | int4 | 4 bytes | Empresa | FK → `res_company` | NO | NOT NULL, INDEX  |

#### `account.gov.movement.type` (tabla: `account_gov_movement_type`)
Tipos de movimientos contables gubernamentales (Clasifican comprobantes).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del tipo | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código identificador | | NO | NOT NULL, UNIQUE  |
| `sequence` | int4 | 4 bytes | Orden de presentación | | NO | NOT NULL  |
| `description`| text | Ilimitada | Descripción del tipo | | SI |  |
| `movement_type`| varchar | Ilimitada| Clasificación: accrued_income/received_income/accrued_expense... | | NO | NOT NULL, INDEX  |

#### `account.gov.closure.line` (tabla: `account_gov_closure_line`)
Líneas del cierre contable (Snapshot de saldos por cuenta).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `closure_id`| int4 | 4 bytes | Cierre contable al que pertenece | FK → `account_gov_closure`| NO | NOT NULL, INDEX  |
| `account_id` | int4 | 4 bytes | Cuenta contable con saldo | FK → `account_gov_account`| NO | NOT NULL, INDEX  |
| `debit` | numeric | Variable | Saldo débito al cierre | | NO | NOT NULL  |
| `credit` | numeric | Variable | Saldo crédito al cierre | | NO | NOT NULL  |
| `balance` | numeric | Variable | Saldo neto (débito - crédito) | | NO | NOT NULL  |

#### `account.gov.closure.history` (tabla: `account_gov_closure_history`)
Historial de auditoría inmutable de cierres y reaperturas.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `closure_id`| int4 | 4 bytes | Cierre contable relacionado | `account_gov_closure` | NO | NOT NULL, INDEX  |
| `action_type`| varchar | Ilimitada | Tipo: review/closed / reopened | | NO | NOT NULL, INDEX  |
| `reason` | text | Ilimitada | Justificación obligatoria en reapertura | | NO | NOT NULL  |
| `user_id` | int4 | 4 bytes | Usuario que ejecutó la acción | FK → `res_users` | NO | NOT NULL, INDEX  |
| `date` | timestamp| 8 bytes | Fecha y hora de la acción | | NO | NOT NULL, INDEX  |

---

