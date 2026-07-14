# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: TESORERIA_GOV_CL (Tesorería)
Módulo de Tesorería Municipal. Gestiona ingresos percibidos y cajas diarias.

#### `account.gov.payment` (tabla: `account_gov_payment`)
Ingreso Percibido (Registro del pago recibido en caja de un ciudadano).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de ingreso percibido (secuencia) | | NO | NOT NULL, UNIQUE  |
| `status` | varchar | Ilimitada | Estado del devengado: draft / confirmed / cancelled | | NO | NOT NULL, INDEX  |
| `entry_department_id`| int4| 4 bytes | Departamento de asientos contables | FK → `account_gov_entry_department`| NO | NOT NULL, INDEX  |
| `entry_order_id`| int4 | 4 bytes | Orden de ingreso asociada | FK → `account_gov_entry_order`| SI | INDEX  |
| `date` | date | 4 bytes | Fecha del pago | | NO | NOT NULL, INDEX  |
| `due_date` | date | 4 bytes | Fecha de vencimiento | | SI |  |
| `date_received_payment`| timestamp| 8 bytes| Fecha y hora de recepción en caja | | SI | INDEX  |
| `observations`| text | Ilimitada | Glosa del pago | | NO | NOT NULL  |
| `user_id` | int4 | 4 bytes | Cajero que recibe el pago | FK → `res_users` | NO | NOT NULL, INDEX  |
| `amount` | numeric | Variable | Monto total del ingreso (calculado) | | NO | NOT NULL  |
| `amount_paid` | numeric | Variable | Monto pagado por el ciudadano | | SI |  |
| `amount_change`| numeric | Variable | Vuelto | | SI |  |
| `partner_id` | int4 | 4 bytes | Ciudadano/contribuyente | FK → `res_partner` | SI | INDEX  |
| `partner_vat` | varchar | Ilimitada | RUT del ciudadano | | SI | INDEX  |
| `patent` | varchar | Ilimitada | Patente (para permisos de circulación) | | SI |  |
| `patent_role` | varchar | Ilimitada | ROL Patente | | SI |  |
| `property_role`| varchar | Ilimitada | ROL Propiedad | | SI |  |
| `payment_method_id`| int4 | 4 bytes | Medio de pago utilizado | FK → `account_gov_payment_method`| NO | NOT NULL, INDEX  |
| `payment_day_id`| int4 | 4 bytes | Caja diaria en que se recibe | FK → `payment_day` | NO | NOT NULL, INDEX  |
| `gov_move_id` | int4 | 4 bytes | Comprobante contable generado | FK → `account_gov_move`| SI |  |
| `income_year` | varchar | Ilimitada | Año de la orden de ingreso | | SI | INDEX  |
| `vehicle_registration`| bool | 1 byte | Es permiso de circulación | | SI |  |
| `currency_id` | int4 | 4 bytes | Moneda | FK → `res_currency` | NO | NOT NULL  |
| `company_id` | int4 | 4 bytes | Empresa | FK → `res_company` | NO | NOT NULL, INDEX  |

#### `payment.day` (tabla: `payment_day`)
Caja diaria (Registro de apertura/cierre de caja para operación).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre/descripción de la caja | | NO | NOT NULL  |
| `state` | varchar | Ilimitada | Estado: open / closed | | NO | NOT NULL, INDEX  |
| `date` | date | 4 bytes | Fecha de la caja | | NO | NOT NULL, INDEX  |
| `user_id` | int4 | 4 bytes | Cajero responsable | FK → `res_users` | NO | NOT NULL, INDEX  |
| `payment_method_ids`| | | Medios de pago habilitados (M2M) | M2M | NO |  |

#### `account.gov.payment.method` (tabla: `account_gov_payment_method`)
Medios de pago aceptados en tesorería.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del medio de pago | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código del medio de pago | | SI | UNIQUE  |
| `account_id` | int4 | 4 bytes | Cuenta contable asociada | FK → `account_gov_account`| SI |  |
| `active` | bool | 1 byte | Medio de pago activo | | NO | NOT NULL  |

#### `account.gov.ipc` (tabla: `account_gov_ipc`)
Índice de Precios al Consumidor (IPC) mensual para reajustes.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `month` | varchar | Ilimitada | Mes del IPC (1-12) | | NO | NOT NULL, INDEX  |
| `year` | int4 | 4 bytes | Año del IPC | | NO | NOT NULL, INDEX  |
| `value` | numeric | Variable | Valor del IPC para ese mes/año | | NO | NOT NULL  |

---

