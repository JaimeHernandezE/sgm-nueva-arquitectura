# Documentación Técnica BD - SGM

**Plataforma:** Odoo 17 Community | PostgreSQL 15  
**Fuente:** [Índice general](../bd-sgm.md)

---

## Módulo: EMPLOYEE_PORTAL (Portal del Empleado)
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

