# Documentación Técnica - Sistema de Gestión Municipal (SGM)

**Preparado por:** ResIT SpA   
**Versión:** 1.0 - Abril 2025   
**Plataforma:** Odoo 17 Community | PostgreSQL 15   
**Clasificación:** Confidencial 

---

## Introducción

El presente documento constituye la documentación técnica oficial de la base de datos PostgreSQL del Sistema de Gestión Municipal (SGM), desarrollado a medida por ResIT SpA sobre la plataforma Odoo 17 Community.

El SGM integra los siguientes módulos funcionales desarrollados por ResIT:
* **TUPA:** Gestión de Expedientes y Procedimientos Municipales.
* **ACCOUNT_GOV_CL:** Contabilidad Gubernamental (Plan SIAF).
* **PRESUPUESTO_GOV_CL:** Formulación y Control Presupuestario.
* **ACCOUNT_GOV_ADQUISICIONES:** Compras y Adquisiciones Públicas.
* **TESORERIA_GOV_CL:** Tesorería y Pagos.
* **L10N_CL_HR:** Remuneraciones Sector Público Chileno.
* **L10N_CL_HOLIDAYS_ATTENDANCE:** Control de Asistencia y Ausencias.
* **L10N_CL_HR_SCALE:** Escala Única Salarial.
* **L10N_CL_VIATIC:** Gestión de Viáticos.
* **EMPLOYEE_PORTAL:** Portal del Empleado.
* **L10N_CL_HR_MERIT_DEMERIT:** Méritos y Deméritos.
* **INVENTORY_GOV_CL:** Inventario Gubernamental.
* **AUTOSERVICIO_GOV_CL:** Autoservicio Funcionario.

> 💡 **Nota técnica sobre integridad:** Odoo gestiona relaciones entre modelos a nivel de ORM (campos Many2one, One2many, Many2many). Las claves foráneas aquí documentadas corresponden a relaciones ORM. Solo algunas tienen restricción de FK a nivel de PostgreSQL; la integridad referencial es garantizada por el ORM.

---

## 1. Diccionario de Datos

### Módulo: TUPA (Gestión Municipal)
Módulo núcleo para la gestión de expedientes, procedimientos y formularios municipales con un motor de flujos BPM configurable mediante BPMN.

#### `tupa.procedure` (tabla: `tupa_procedure`)
Define los procedimientos municipales y sus flujos BPMN.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del procedimiento | | SI |  |
| `code` | varchar | Ilimitada | Código único del procedimiento | | SI |  |
| `state` | varchar | Ilimitada | Estado: draft/active/inactive | | NO | NOT NULL  |
| `area_id` | int4 | 4 bytes | Área responsable del procedimiento | FK → `tupa_area` | SI | INDEX  |
| `bpmn_xml` | text | Ilimitada | Diagrama BPMN en formato XML | | SI |  |
| `create_uid` | int4 | 4 bytes | Usuario creador | FK → `res_users` | SI |  |
| `write_uid` | int4 | 4 bytes | Último usuario que modificó | FK → `res_users` | SI |  |
| `create_date`| timestamp| 8 bytes | Fecha de creación | | SI |  |
| `write_date` | timestamp| 8 bytes | Fecha de última modificación | | SI |  |

#### `tupa.procedure.stage` (tabla: `tupa_procedure_stage`)
Etapas individuales dentro de un procedimiento BPMN.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `procedure_id`| int4 | 4 bytes | Procedimiento al que pertenece | `tupa_procedure`| NO | NOT NULL, INDEX  |
| `name` | varchar | Ilimitada | Nombre de la etapa | | SI |  |
| `tipo_etapa` | varchar | Ilimitada | Tipo: inicio/fin/formulario/revision_informacion... | | NO | NOT NULL, INDEX  |
| `bpmn_id` | varchar | Ilimitada | ID del elemento en el diagrama BPMN | | SI | UNIQUE  |
| `json_info` | jsonb | Variable | Configuración JSON de la etapa (inputs, condiciones)| | SI | GIN INDEX  |
| `email_template_id`| int4| 4 bytes | Plantilla de correo para notificación | FK → `mail_template`| SI |  |
| `iop_type` | varchar | Ilimitada | Tipo de invocación: crear / buscar | | SI |  |
| `iop_procedure_id`| int4 | 4 bytes | Procedimiento a invocar | FK → `tupa_procedure`| SI |  |
| `sequence` | int4 | 4 bytes | Orden de la etapa | | SI |  |

#### `tupa.file` (tabla: `tupa_file`)
Expediente municipal. Registro principal que agrupa todas las etapas ejecutadas.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Número de expediente (secuencia automática) | | NO | NOT NULL, UNIQUE  |
| `procedure_id`| int4 | 4 bytes | Procedimiento al que corresponde | FK → `tupa_procedure`| NO | NOT NULL, INDEX  |
| `partner_id` | int4 | 4 bytes | Ciudadano o entidad vinculada | FK → `res_partner` | SI | INDEX  |
| `user_id` | int4 | 4 bytes | Usuario responsable del expediente | FK → `res_users` | SI | INDEX  |
| `state` | varchar | Ilimitada | Estado: in_progress / done / cancelled | | NO | NOT NULL, INDEX  |
| `parent_tupa_file_id`| int4| 4 bytes | Expediente padre (si es invocado por otro) | FK → `tupa_file` | SI |  |
| `bpmn_xml` | text | Ilimitada | BPMN XML con estado visual actual | | SI |  |
| `create_date`| timestamp| 8 bytes | Fecha de apertura del expediente | | SI | INDEX  |
| `write_date` | timestamp| 8 bytes | Fecha de última actualización | | SI |  |
| `department_id`| int4 | 4 bytes | Departamento responsable | FK → `hr_department`| SI | INDEX  |

#### `tupa.file.line` (tabla: `tupa_file_line`)
Línea de ejecución de un expediente. Registra cada etapa completada o en progreso.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `tupa_file_id`| int4 | 4 bytes | Expediente al que pertenece esta línea | FK → `tupa_file` | NO | NOT NULL, INDEX  |
| `stage_id` | int4 | 4 bytes | Etapa del procedimiento ejecutada | FK → `tupa_procedure_stage`| SI |  |
| `stage_json` | jsonb | Variable | Snapshot inmutable de la etapa al ejecutar | | SI |  |
| `tipo_etapa` | varchar | Ilimitada | Tipo de etapa (copia inmutable) | | NO | NOT NULL, INDEX  |
| `user_id` | int4 | 4 bytes | Usuario que ejecutó la etapa | FK → `res_users` | NO | NOT NULL, INDEX  |
| `date` | timestamp| 3 bytes | Fecha y hora de ejecución | | SI | INDEX  |
| `state` | varchar | Ilimitada | Estado: in_progress / done | | NO | NOT NULL, INDEX  |
| `form_response_id`| int4| 4 bytes | Respuesta del formulario (si aplica) | FK → `tupa_form_response`| SI |  |
| `review_response_bool`| bool| 1 byte | Resultado de revisión (aprobado/rechazado)| | SI |  |
| `review_response_note`| text | Ilimitada | Nota de revisión de información | | SI |  |
| `file_id` | int4 | 4 bytes | Archivo DMS adjunto (si aplica) | FK → `dms_file` | SI |  |
| `model_id` | int4 | 4 bytes | Modelo Odoo afectado (si aplica) | FK → `ir_model` | SI |  |
| `record_id` | int4 | 4 bytes | ID del registro afectado en el modelo | | SI |  |
| `iop_file_id`| int4 | 4 bytes | Expediente invocado (si aplica) | FK → `tupa_file` | SI |  |
| `mail_id` | int4 | 4 bytes | Correo enviado (si aplica) | FK → `mail_mail` | SI |  |

#### `tupa.form` (tabla: `tupa_form`)
Definición de formularios dinámicos asociados a etapas.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del formulario | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código único del formulario | | SI | UNIQUE  |
| `question_ids`| | | Preguntas (One2many → `tupa_form_question`)| O2M | SI |  |
| `active` | bool | 1 byte | Formulario activo | | NO | NOT NULL  |

#### `tupa.form.response` (tabla: `tupa_form_response`)
Respuesta a un formulario generada durante la ejecución.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `tupa_file_id`| int4 | 4 bytes | Expediente relacionado | FK → `tupa_file` | NO | NOT NULL, INDEX  |
| `form_id` | int4 | 4 bytes | Formulario respondido | FK → `tupa_form` | NO | NOT NULL  |
| `question_ids`| | | Respuestas (One2many) | O2M | NO |  |
| `create_date`| timestamp| 8 bytes | Fecha de respuesta | | SI |  |
| `user_id` | int4 | 4 bytes | Usuario que respondió | FK → `res_users` | SI |  |

#### `tupa.area` (tabla: `tupa_area`)
Áreas funcionales del municipio.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del área (ej: Tesorería, RRHH) | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código del área | | SI |  |
| `description`| text | Ilimitada | Descripción del área | | SI |  |

#### `res.country.province` (tabla: `res_country_province`)
Tabla maestra de provincias de Chile.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre de la provincia | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código de la provincia | | NO | NOT NULL  |
| `state_id` | int4 | 4 bytes | Región a la que pertenece | FK → `res_country_state`| NO | NOT NULL, INDEX  |
| `country_id` | int4 | 4 bytes | País (Chile) | FK → `res_country` | SI |  |

#### `res.country.city` (tabla: `res_country_city`)
Tabla maestra de comunas/ciudades de Chile.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre de la comuna | | NO | NOT NULL  |
| `code` | varchar | Ilimitada | Código de la comuna | | SI |  |
| `province_id`| int4 | 4 bytes | Provincia a la que pertenece | FK → `res_country_province`| SI | INDEX  |
| `state_id` | int4 | 4 bytes | Región | FK → `res_country_state`| SI | INDEX  |

---

### Módulo: ACCOUNT_GOV_CL (Contabilidad Gubernamental)
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

### Módulo: PRESUPUESTO_GOV_CL (Presupuesto)
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

### Módulo: ACCOUNT_GOV_ADQUISICIONES (Adquisiciones)
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

### Módulo: TESORERIA_GOV_CL (Tesorería)
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

### Módulo: L10N_CL_HR (Remuneraciones Chile)
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

### Módulo: L10N_CL_HOLIDAYS_ATTENDANCE (Horas Extras y Ausencias)
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

### Módulo: L10N_CL_VIATIC (Viáticos)
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

### Módulo: EMPLOYEE_PORTAL (Portal del Empleado)
Módulo de comunicación interna para funcionarios.

#### `employee.portal.wall.post` (tabla: `employee_portal_wall_post`)
Publicación en el mural interno de funcionarios.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Título de la publicación | | NO | NOT NULL  |
| `body` | html | Ilimitada | Contenido de la publicación | | SI |  |
| `state` | varchar | Ilimitada | Estado: draft / published / archived | | NO | NOT NULL, INDEX  |
| `author_id` | int4 | 4 bytes | Autor de la publicación | FK → `res_users` | NO | NOT NULL, INDEX  |
| `date_published`| date | 4 bytes | Fecha de publicación | | SI | INDEX  |
| `date_expiry`| date | 4 bytes | Fecha de expiración de la publicación | | SI |  |
| `department_ids`| | | Departamentos destinatarios (M2M) | M2M | NO |  |

#### `employee.portal.banner` (tabla: `employee_portal_banner`)
Banner visual para el portal del empleado.

| Campo | Tipo PG | Longitud | Descripción Funcional | Llave | Nulo | Índices / Restricciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | int4 | 4 bytes | Identificador único | PK | NO | NOT NULL, PRIMARY KEY  |
| `name` | varchar | Ilimitada | Nombre del banner | | NO | NOT NULL  |
| `image` | bytea | Variable | Imagen del banner | | SI |  |
| `url` | varchar | Ilimitada | URL de destino al hacer clic | | SI |  |
| `active` | bool | 1 byte | Banner activo | | NO | NOT NULL  |
| `sequence` | int4 | 4 bytes | Orden de presentación | | NO | NOT NULL  |

---

### Módulo: L10N_CL_HR_MERIT_DEMERIT (Méritos y Deméritos)
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

## 2. Dependencias entre Módulos

Un módulo depende de otro cuando utiliza sus tablas o modelos para funcionar correctamente.

| Módulo | Depende de | Naturaleza de la dependencia |
| :--- | :--- | :--- |
| `account_gov_cl` | `tupa` | Comprobantes contables (`account.gov.move`) vinculados a expedientes TUPA (`tupa_file_id`). |
| `presupuesto_gov_cl`| `account_gov_cl` | Líneas de movimiento (`account.gov.move.line`) extendidas con área y programa presupuestario. |
| `account_gov_adquisiciones`| `account_gov_cl`, `presupuesto_gov_cl`| Obligaciones y CDPs usan cuentas contables y presupuesto vigente. |
| `account_gov_adquisiciones`| `tupa` | Solicitudes de pedido tramitadas a través de expedientes TUPA. |
| `tesoreria_gov_cl` | `account_gov_cl` | Ingresos percibidos generan comprobantes contables (`account.gov.move`). |
| `tesoreria_gov_cl` | `account_gov_cl` | Órdenes de ingreso son la base del flujo de recaudación. |
| `l10n_cl_hr` | `account_gov_cl`, `tupa` | Liquidaciones y finiquitos generan comprobantes y usan expedientes TUPA. |
| `l10n_cl_holidays_attendance`| `l10n_cl_hr` | Licencias ISAPRE y horas extras vinculadas a contratos y liquidaciones. |
| `account_hr_gov_cl`| `account_gov_cl`, `tesoreria_gov_cl`, `l10n_cl_hr`| Integra nómina con contabilidad gubernamental y tesorería. |
| `inventory_gov_cl`| `account_gov_cl` | Activos de inventario usan cuentas contables gubernamentales. |
| `reports_gov_cl` | `account_gov_cl`, `tupa`, `l10n_cl_hr` | Reportes DIPRES/Contraloría consolidan datos contables, RRHH y expedientes. |
| `autoservicio_gov_cl`| `l10n_cl_hr`, `l10n_cl_holidays_attendance`| Autoservicio expone licencias, asistencia y liquidaciones al funcionario. |

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
