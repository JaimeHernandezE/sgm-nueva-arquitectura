# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: ACCOUNT_GOV_ADQUISICIONES (Adquisiciones)
Módulo de gestión de compras públicas integrado con Mercado Público.

#### `adquisiciones.solicitud.pedido` (tabla: `adquisiciones_solicitud_pedido`)
Solicitud de pedido. Al aprobarse genera automáticamente un CDP.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de solicitud (secuencia) | | NO | NOT NULL, UNIQUE  |
| `titulo` | varchar | Ilimitada | Título descriptivo de la solicitud | | SI |  |
| `state` | varchar | Ilimitada | Estado: draft/confirmed/aprobado/rejected... | | NO | NOT NULL, INDEX  |
| `date` | date | 4 bytes | Fecha de la solicitud | | NO | NOT NULL, INDEX  |
| `department_id`| int4| 4 bytes | Departamento solicitante | `hr_department` | NO | NOT NULL, INDEX  |
| `user_id` | int4 | 4 bytes | Usuario solicitante | FK → `res_users` | NO | NOT NULL, INDEX  |
| `disponibilidad_presupuestaria_id`| int4| 4 bytes| CDP generado automáticamente al aprobar| FK → `account_gov_availability`| SI | INDEX  |
| `tupa_file_id`| int4 | 4 bytes | Expediente TUPA vinculado | FK → `tupa_file` | SI | INDEX  |
| `amount_total`| numeric | Variable | Monto total estimado | | SI |  |

#### `adquisiciones.resolucion.compra` (tabla: `adquisiciones_resolucion_compra`)
Resolución de compra (Genera Obligación Presupuestaria y Egreso Devengado).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de resolución | | NO | NOT NULL, UNIQUE  |
| `state` | varchar | Ilimitada | Estado: draft / validado / aprobado / cancelled | | NO | NOT NULL, INDEX  |
| `fecha` | date | 4 bytes | Fecha de la resolución | | NO | NOT NULL, INDEX  |
| `solicitud_id`| int4 | 4 bytes | Solicitud de pedido de origen | FK → `adquisiciones_solicitud_pedido`| SI | INDEX  |
| `proveedor_id`| int4 | 4 bytes | Proveedor adjudicado | FK → `res_partner` | NO | NOT NULL, INDEX  |
| `monto_total` | numeric | Variable | Monto total adjudicado | | NO | NOT NULL, INDEX  |
| `numero_orden_compra`| varchar| Ilimitada| N° de orden de compra Mercado Público | | SI |  |
| `obligacion_id`| int4 | 4 bytes | Obligación presupuestaria automática | FK → `account_gov_obligation`| SI | INDEX  |
| `egreso_devengado_id`| int4 | 4 bytes| Comprobante de Egreso Devengado generado | FK → `account_gov_move` | SI | INDEX  |

#### `adquisiciones.resolucion.compra.distribution` (tabla: `adquisiciones_resolucion_compra_distribution`)
Líneas de distribución presupuestaria de la resolución de compra.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `resolucion_compra_id`| int4| 4 bytes| Resolución de compra | FK → `adquisiciones_resolucion_compra`| NO | NOT NULL, INDEX  |
| `account_id` | int4 | 4 bytes | Cuenta presupuestaria (215*) | FK → `account_gov_account`| NO | NOT NULL, INDEX  |
| `cost_center_id`| int4 | 4 bytes | Centro de costos | FK → `account_gov_cost_center`| SI |  |
| `area_id` | int4 | 4 bytes | Área de gestión | FK → `account_gov_area` | NO | NOT NULL, INDEX  |
| `program_id` | int4 | 4 bytes | Programa presupuestario | FK → `account_gov_program`| SI | NOT NULL  |
| `subprogram_id`| int4 | 4 bytes | Subprograma presupuestario | FK → `account_gov_subprogram`| SI |  |
| `amount` | numeric | Variable | Monto imputado a esta distribución | | NO |  |
| `currency_id` | int4 | 4 bytes | Moneda | `res_currency` | SI |  |

#### `account.gov.obligation` (tabla: `account_gov_obligation`)
Obligación presupuestaria (Compromiso formal del gasto).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de obligación (secuencia) | | NO | NOT NULL, UNIQUE  |
| `state` | varchar | Ilimitada | Estado: draft / confirmed / paid / cancelled | | NO | NOT NULL, INDEX  |
| `date` | date | 4 bytes | Fecha de la obligación | | NO | NOT NULL, INDEX  |
| `amount` | numeric | Variable | Monto total comprometido | | NO | NOT NULL  |
| `partner_id` | int4 | 4 bytes | Proveedor | FK → `res_partner` | SI | INDEX  |
| `resolucion_id`| int4 | 4 bytes | Resolución de compra de origen | FK → `adquisiciones_resolucion_compra`| SI | INDEX  |
| `disponibilidad_id`| int4 | 4 bytes | CDP que respalda la obligación | FK → `account_gov_availability`| SI | INDEX  |
| `preobligacion_id`| int4 | 4 bytes | Pre-obligación de origen | FK → `account_gov_pre_obligation`| SI | INDEX  |
| `accrued_move_id`| int4 | 4 bytes | Egreso Devengado (comprobante contable) | FK → `account_gov_move`| SI |  |
| `order_number`| varchar | Ilimitada | N° de orden de compra | | SI |  |

#### `account.gov.pre.obligation` (tabla: `account_gov_pre_obligation`)
Pre-obligación presupuestaria (Reserva de fondos previa a la obligación).

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de pre-obligación | | NO | NOT NULL, UNIQUE  |
| `date` | date | 4 bytes | Fecha de creación | | NO | NOT NULL, INDEX  |
| `amount` | numeric | Variable | Monto pre-comprometido | | NO | NOT NULL  |
| `state` | varchar | Ilimitada | Estado: draft/confirmed/converted/cancelled | | NO | NOT NULL, INDEX  |
| `solicitud_id`| int4 | 4 bytes | Solicitud de pedido asociada | FK → `adquisiciones_solicitud_pedido`| SI | INDEX  |
| `obligation_id`| int4 | 4 bytes | Obligación generada desde esta pre-obligación | FK → `account_gov_obligation`| SI |  |

---

