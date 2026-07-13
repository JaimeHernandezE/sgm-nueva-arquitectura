# Documentación Técnica de Base de Datos - Sistema de Gestión Municipal (SGM)

[cite_start]Este repositorio contiene la documentación técnica oficial de la base de datos PostgreSQL correspondiente al **Sistema de Gestión Municipal (SGM)**[cite: 10]. [cite_start]El sistema ha sido desarrollado a medida por **ResIT SpA** utilizando la plataforma **Odoo 17 Community**[cite: 4, 10].

---

## 🛠️ Especificaciones Técnicas Básicas

* [cite_start]**Plataforma Base:** Odoo 17 Community [cite: 6]
* [cite_start]**Motor de Base de Datos:** PostgreSQL 15 [cite: 6]
* [cite_start]**Autor/Preparado por:** ResIT SpA [cite: 4]
* [cite_start]**Versión del Documento:** 1.0 (Abril 2025) [cite: 6]
* [cite_start]**Nivel de Acceso:** Confidencial / Uso Interno [cite: 2]

> [cite_start]💡 **Nota de Integridad Referencial (ORM):** Odoo gestiona la mayor parte de las relaciones de modelos y la integridad referencial a nivel de código (capa ORM mediante campos *Many2one*, *One2many*, *Many2many*)[cite: 26, 28]. [cite_start]Las claves foráneas (FK) detalladas en este documento representan relaciones a nivel lógico-funcional; solo algunas cuentan con restricciones físicas (`FOREIGN KEY`) explicitadas de manera directa en PostgreSQL[cite: 27, 28].

---

## 🧩 1. Módulos Funcionales del Sistema

[cite_start]El ecosistema municipal se compone de los siguientes módulos modulares interconectados[cite: 11]:

1.  [cite_start]**TUPA:** Gestión de Expedientes y Procedimientos Municipales (con motor BPMN)[cite: 12, 37].
2.  [cite_start]**ACCOUNT_GOV_CL:** Contabilidad Gubernamental adaptada al Plan de Cuentas SIAF / CGR[cite: 13, 14].
3.  [cite_start]**PRESUPUESTO_GOV_CL:** Formulación, Control y Modificaciones Presupuestarias[cite: 15, 148].
4.  [cite_start]**ACCOUNT_GOV_ADQUISICIONES:** Compras Públicas alineadas al flujo de Mercado Público[cite: 16, 205].
5.  [cite_start]**TESORERIA_GOV_CL:** Caja Diaria, Medios de Pago y Recaudación de Impuestos[cite: 17, 236].
6.  [cite_start]**L10N_CL_HR:** Remuneraciones y Liquidaciones del Sector Público Chileno (PREVIRED)[cite: 18, 265].
7.  [cite_start]**L10N_CL_HOLIDAYS_ATTENDANCE:** Control de Asistencia, Ausencias y Licencias Médicas[cite: 19, 288].
8.  [cite_start]**L10N_CL_HR_SCALE:** Escala Única Salarial Municipal[cite: 20].
9.  [cite_start]**L10N_CL_VIATIC:** Gestión y Cálculo de Viáticos por Zonas Geográficas[cite: 21, 304].
10. [cite_start]**EMPLOYEE_PORTAL:** Portal del Empleado y Mural de Comunicaciones Internas[cite: 22, 323].
11. [cite_start]**L10N_CL_HR_MERIT_DEMERIT:** Registro Histórico de Méritos y Deméritos (Medidas Disciplinarias)[cite: 23, 331].
12. [cite_start]**INVENTORY_GOV_CL:** Control de Inventario Físico Gubernamental y Activos[cite: 24].
13. [cite_start]**AUTOSERVICIO_GOV_CL:** Autoservicio Digital para el Funcionario Municipal[cite: 25].

---

## 🔗 2. Matriz de Dependencias entre Módulos

[cite_start]Un módulo depende técnicamente de otro cuando consume datos de sus tablas o extiende sus modelos de negocio[cite: 511]:

| Módulo Origen | Depende de | Naturaleza de la Dependencia |
| :--- | :--- | :--- |
| `account_gov_cl` | `tupa` | [cite_start]Vinculación de comprobantes contables a expedientes TUPA (`tupa_file_id`)[cite: 512]. |
| `presupuesto_gov_cl` | `account_gov_cl` | [cite_start]Extensión de líneas contables (`account_gov_move_line`) con áreas y programas presupuestarios[cite: 512]. |
| `account_gov_adquisiciones` | `account_gov_cl`, `presupuesto_gov_cl` | [cite_start]Las obligaciones contables y CDPs validan cuentas y saldos del presupuesto vigente[cite: 512]. |
| `account_gov_adquisiciones` | `tupa` | [cite_start]Las solicitudes de pedido inician y se tramitan mediante flujos de expedientes TUPA[cite: 512]. |
| `tesoreria_gov_cl` | `account_gov_cl` | [cite_start]Los ingresos percibidos en caja generan automáticamente comprobantes (`account_gov_move`)[cite: 512]. |
| `tesoreria_gov_cl` | `account_gov_cl` | [cite_start]Las órdenes de ingreso forman la base del derecho a cobro de la recaudación[cite: 512]. |
| `l10n_cl_hr` | `account_gov_cl`, `tupa` | [cite_start]Liquidaciones/finiquitos impactan la contabilidad y se respaldan en expedientes[cite: 512]. |
| `l10n_cl_holidays_attendance` | `l10n_cl_hr` | [cite_start]Vinculación de licencias médicas ISAPRE/FONASA y horas extras con contratos y liquidaciones[cite: 512]. |
| `account_hr_gov_cl` | `account_gov_cl`, `tesoreria_gov_cl`, `l10n_cl_hr` | [cite_start]Integra la nómina salarial completa con la contabilidad y tesorería centralizado[cite: 512]. |
| `inventory_gov_cl` | `account_gov_cl` | [cite_start]Los activos fijos de inventario se asocian a las cuentas contables gubernamentales[cite: 512]. |
| `reports_gov_cl` | `account_gov_cl`, `tupa`, `l10n_cl_hr` | [cite_start]Consolidación de reportes obligatorios para DIPRES y Contraloría General (CGR)[cite: 512]. |
| `autoservicio_gov_cl` | `l10n_cl_hr`, `l10n_cl_holidays_attendance` | [cite_start]Expone liquidaciones, asistencias y solicitudes de licencias al portal web del funcionario[cite: 512]. |

---

## 🛑 3. Clasificación y Criticidad Operacional de las Tablas

[cite_start]Las tablas se categorizan según su comportamiento y tasa de transacciones[cite: 517]:
* `MAESTRA`: Parámetros globales y configuraciones del sistema. Cambios infrecuentes[cite: 518].
* `TRANSACCIONAL`: Flujo activo del negocio municipal. [cite_start]Alta concurrencia de lectura y escritura[cite: 520].
* `HISTÓRICA`: Logs inmutables y auditorías. [cite_start]No se modifican, son esenciales para trazabilidad[cite: 521].

### 🚨 Tablas Críticas de Alta Atención
[cite_start]Estas tablas requieren **respaldos continuos**, monitoreo estricto de almacenamiento y máxima precaución en migraciones de datos[cite: 529]:

1.  **`tupa_file`**: Raíz operativa del sistema municipal. [cite_start]Referenciada globalmente[cite: 530].
2.  **`tupa_file_line`**: Tabla de mayor volumen del módulo núcleo. [cite_start]Guarda instantáneas inmutables[cite: 530].
3.  **`account_gov_move`**: Comprobantes contables. [cite_start]Datos críticos financieros no recuperables en caso de pérdida[cite: 530].
4.  **`account_gov_move_line`**: Detalle del libro mayor contable. [cite_start]Tabla con la mayor tasa de crecimiento en volumen[cite: 530].
5.  **`account_gov_budget_execution`**: Saldos presupuestarios en tiempo real. [cite_start]Fuente de auditoría DIPRES/CGR[cite: 530].
6.  [cite_start]**`account_gov_obligations`**: Gasto público comprometido formalmente[cite: 530].
7.  [cite_start]**`hr_leave_isapre`**: Datos de salud e integración normativa con SIAPER de Contraloría[cite: 530].

---

## 🗺️ 4. Diagrama Entidad-Relación Global (GitLab Native)

```mermaid
erDiagram
    %% Core Odoo Tables
    res_users { int4 id PK }
    res_partner { int4 id PK }
    hr_department { int4 id PK }
    hr_employee { int4 id PK }
    hr_contract { int4 id PK }
    hr_leave { int4 id PK }
    hr_attendance { int4 id PK }
    hr_payslip { int4 id PK }
    res_company { int4 id PK }
    res_currency { int4 id PK }

    %% TUPA Module
    tupa_procedure {
        int4 id PK
        varchar name
        varchar code
        varchar state
        int4 area_id FK
    }
    tupa_procedure_stage {
        int4 id PK
        int4 procedure_id FK
        varchar tipo_etapa
        varchar bpmn_id
        jsonb json_info
    }
    tupa_file {
        int4 id PK
        varchar name
        int4 procedure_id FK
        int4 partner_id FK
        int4 department_id FK
        varchar state
    }
    tupa_file_line {
        int4 id PK
        int4 tupa_file_id FK
        int4 stage_id FK
        varchar tipo_etapa
        varchar state
    }
    tupa_form_response {
        int4 id PK
        int4 tupa_file_id FK
        int4 form_id FK
    }
    tupa_area { int4 id PK }
    res_country_province { int4 id PK }
    res_country_city { int4 id PK }

    %% Contabilidad
    account_gov_account {
        int4 id PK
        varchar code
        varchar name
        int4 plan_id FK
        int4 parent_id FK
    }
    account_gov_move {
        int4 id PK
        varchar name
        varchar state
        date date
        int4 move_type_id FK
        int4 partner_id FK
    }
    account_gov_move_line {
        int4 id PK
        int4 move_id FK
        int4 account_id FK
        numeric debit
        numeric credit
    }
    account_gov_entry_order {
        int4 id PK
        varchar name
        varchar state
        int4 partner_id FK
        int4 account_id FK
    }

    %% Presupuesto & Adquisiciones
    account_gov_budget_sheet { int4 id PK }
    account_gov_budget_execution {
        int4 id PK
        int4 sheet_id FK
        int4 account_id FK
        numeric amount_executed
    }
    account_gov_availability {
        int4 id PK
        varchar name
        numeric amount
        int4 account_id FK
        varchar state
    }
    adquisiciones_solicitud_pedido {
        int4 id PK
        varchar name
        varchar state
        int4 department_id FK
        int4 availability_id FK
    }
    account_gov_obligations {
        int4 id PK
        varchar name
        numeric amount
        int4 account_id FK
        int4 partner_id FK
    }

    %% RRHH
    hr_cl_employee_extra {
        int4 id PK
        int4 employee_id FK
        float8 cl_he_25
        float8 cl_he_50
    }
    hr_leave_isapre {
        int4 id PK
        varchar state
        int4 employee_id FK
        int4 leave_id FK
        int4 contract_id FK
        float total_days
    }
    hr_attendance_excuse {
        int4 id PK
        int4 employee_id FK
        varchar type
        float8 worked_hours
    }

    %% Relationships
    tupa_procedure ||--|{ tupa_procedure_stage : "define etapas"
    tupa_procedure ||--o{ tupa_file : "da origen a"
    tupa_file ||--o{ tupa_file_line : "ejecuta"
    tupa_procedure_stage ||--o{ tupa_file_line : "instancia"
    tupa_file ||--ol tupa_form_response : "genera"
    tupa_area ||--o{ tupa_procedure : "agrupa"
    tupa_file }o--|| res_partner : "vincula ciudadano"
    tupa_file }o--|| hr_department : "asignada a"
    account_gov_account }o--|| account_gov_plan : "pertenece a"
    account_gov_account ||--o{ account_gov_move_line : "registra"
    account_gov_move ||--o{ account_gov_move_line : "contiene"
    account_gov_move }o--|| movement_type : "clasificado por"
    account_gov_move }o--|| tupa_file : "origina"
    account_gov_entry_order }o--|| tupa_file : "vinculada"
    account_gov_budget_sheet ||--o{ account_gov_budget_execution : "ejecuta"
    account_gov_availability }o--|| account_gov_account : "certifica"
    adquisiciones_solicitud_pedido }o--|| account_gov_availability : "consume"
    adquisiciones_solicitud_pedido }o--|| tupa_file : "tramitada en"
    account_gov_obligations }o--|| account_gov_availability : "compromete"
    hr_cl_employee_extra }o--|| hr_employee : "pertenece a"
    hr_leave_isapre }o--|| hr_employee : "titular"
    hr_leave_isapre }o--|| hr_leave : "extiende"
    hr_attendance_excuse }o--|| hr_employee : "justifica"
    hr_attendance_excuse }o--|| hr_attendance : "referencia"
