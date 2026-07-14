# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: TUPA (Gestión Municipal)
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

