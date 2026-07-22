# 0. Consulta y alta de expedientes

*Proceso transversal del módulo Adquisiciones — entrada al ciclo de compra (listado, apertura de expediente y arranque de creación). No es específico de una modalidad. El patrón de **consulta con alcance por rol** es reutilizable como patrón de plataforma; las operaciones y el esquema viven en el contrato de Adquisiciones.*

*Roles:* nombre (usuarios) + código (sistema) según [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md) (P-24).

*Contrato / API:* [`../contracts.md`](../contracts.md) §2.0 · OpenAPI [`../openapi/expediente.yaml`](../openapi/expediente.yaml) · ensamblado [`../openapi/adquisiciones.openapi.yaml`](../openapi/adquisiciones.openapi.yaml).

*Wireframes:* [`../wireframes/01-listado-expedientes.md`](../wireframes/01-listado-expedientes.md) · prototipo `sgm-prototipos/modulos/adquisiciones/01-listado-expedientes.html`.

---

## 0.1 — Listado / consulta de expedientes

| Materia | Valor |
|---|---|
| Unidad municipal | Según rol: Unidad Solicitante (scope restringido) o DAF / unidades con lectura amplia (tenant) |
| Rol | Lectura con alcance: Solicitante ([`adq.solicitante`](../../../arquitectura/especificacion/catalogo-roles.md)) y Aprobador de unidad ([`adq.aprobador_unidad`](../../../arquitectura/especificacion/catalogo-roles.md)) → solo expedientes de su unidad; resto de roles Adquisiciones (p. ej. [`adq.gestor_compra`](../../../arquitectura/especificacion/catalogo-roles.md), [`adq.lector`](../../../arquitectura/especificacion/catalogo-roles.md), formulador/firmante DAF, etc.) → tenant completo |
| Plataforma | SGM |
| Optativo | Falso *(pantalla de entrada del módulo; siempre disponible para quien tenga `listProcurementCases`)* |

**Detalle:** Pantalla de consulta paginada de expedientes de compra (`ProcurementCase`). El usuario busca por folio/glosa/modalidad, aplica filtros acumulables (departamento solicitante, modalidad, proceso activo, bandeja “por firmar/aprobar”) y abre el detalle de un expediente. El **alcance** lo impone el servidor según el `RoleAssignment`: los perfiles de unidad solicitante no pueden ampliar el universo con filtros de departamento/unidad ajenos; los perfiles DAF / lectura amplia ven el tenant y pueden filtrar por departamento.

Desde esta pantalla también se inicia la creación de un expediente nuevo (sub-paso **0.2**), que deriva a la etapa SOLPED (**1.0** optativo o **1.1**).

**Entidad(es) y campos:**

- Lectura de colección: `ProcurementCaseSummary` (DTO) — no crea ni actualiza entidades.
  - `id` / `folio` (texto, **obligatorio**)
  - `description` (texto, **obligatorio** — glosa)
  - `procurement_type` (enum, **opcional** hasta confirmación de modalidad en 2.1)
  - `status` (enum, **obligatorio**: `in_progress` \| `completed` \| `cancelled` \| `deserted`)
  - `current_step_name` (texto, **opcional** en summary — derivado del `CaseStep` actual)
  - `requesting_unit_id` (ref. `OrganizationalUnit`, **obligatorio**)
  - `created_at` (fecha/hora, **obligatorio**)
- Departamento mostrado en UI: derivado del nodo orgánico padre de `requesting_unit_id` (`OrganizationalUnit`, plataforma).
- Bandeja “por firmar/aprobar”: derivado de query `awaiting_my_action` (no es campo persistido del expediente).

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sin cruce *(operación del propio módulo)* | `listProcurementCases` | — (Adquisiciones) | Síncrona | Query paginación + filtros → `ProcurementCaseSummary[]` paginado |
| 2 | Sin cruce *(navegación)* | `getProcurementCase` | — (Adquisiciones) | Síncrona | `case_id` → `ProcurementCaseDetail` |

> La resolución de `requesting_department_id` a unidades hijas usa el catálogo orgánico del tenant (`OrganizationalUnit`, plataforma). No es dependencia de otro módulo de negocio; es dato de identidad/organización del core de plataforma.

**Validaciones:** Sin validaciones de formulario — solo lecturas (`listProcurementCases`, `getProcurementCase`). Errores de auth/scope (`FORBIDDEN`, `PROCUREMENT_CASE_NOT_FOUND`) son de API, no de captura de campos.

**API (contrato ↔ OpenAPI):**

| operationId | HTTP | Spec |
|---|---|---|
| `listProcurementCases` | `GET /procurement-cases` | [`contracts.md`](../contracts.md) §2.0 · [`expediente.yaml`](../openapi/expediente.yaml) |
| `getProcurementCase` | `GET /procurement-cases/{case_id}` | idem |

Query de `listProcurementCases` (todos **opcionales** salvo paginación estándar): `page`, `page_size`, `sort`, `order`, `q`, `procurement_type`, `status`, `requesting_department_id`, `requesting_unit_id`, `folio`, `awaiting_my_action`.

**Edge cases:**
- Sin resultados para los filtros/scope → colección vacía; UI muestra estado vacío (no es error).
- `adq.solicitante` / `adq.aprobador_unidad` intentan filtrar fuera de su unidad → scope forzado o `FORBIDDEN` (decisión de implementación documentada en contrato).
- Token sin scope `adquisiciones:read` / `adquisiciones.read` → `401` / `403`.
- Folio inexistente al abrir fila → `PROCUREMENT_CASE_NOT_FOUND` en `getProcurementCase`.

> ⚠ **Pendiente de definir:** comportamiento exacto ante intento de ampliar scope (¿forzar silenciosamente vs `FORBIDDEN`)? Grano departamento vs unidad en municipios sin desglose (**P-49** / **P-51**).

**Wireframe / prototipo:** [`../wireframes/01-listado-expedientes.md`](../wireframes/01-listado-expedientes.md)

---

## 0.2 — Inicio de nuevo expediente

| Materia | Valor |
|---|---|
| Unidad municipal | Unidad Solicitante |
| Rol | Solicitante ([`adq.solicitante`](../../../arquitectura/especificacion/catalogo-roles.md)) |
| Plataforma | SGM |
| Optativo | Falso *(la acción de crear es parte de la entrada; el **camino** puede omitir 1.0)* |

**Detalle:** Desde el listado (0.1), el usuario elige **Nuevo expediente**. El enrutamiento depende de capacidades del tenant:

| Capacidades del tenant | Destino |
|---|---|
| Inventario (interno o externo) y/o catálogo CM ChileCompra | Sub-paso **1.0** — Verificación previa ([`1-solped.md`](./1-solped.md) §1.0) |
| Ni Inventario ni catálogo CM | **Omite 1.0** → Sub-paso **1.1** — Creación de SOLPED ([`1-solped.md`](./1-solped.md) §1.1) |

Este sub-paso **no** persiste el expediente por sí solo: la creación formal ocurre en 1.1 (`createPurchaseRequest`, que instancia el `ProcurementCase` asociado). 0.2 documenta el **borde de navegación** y la regla de omisión del gateway 1.0.

**Entidad(es) y campos:** no crea entidades. Transfiere contexto opcional de UI hacia 1.0/1.1 (texto de búsqueda, hallazgo CM) sin modelo de persistencia propio en v1.

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sin cruce | — (navegación UI) | — | — | Destino 1.0 o 1.1 según capacidades |
| 2 | Dependencia *(evaluación de capacidades; no es llamada de negocio del listado)* | Disponibilidad de `checkStockAvailability` / sync `checkCatalogAvailability` | Inventario / Core (catálogo CM) | — | Flags de tenant / integración — ver §1.0 |

Las operaciones de escritura del alta están en la ficha **1.1**:

| operationId | HTTP | Sub-paso | Spec |
|---|---|---|---|
| `createPurchaseRequest` | `POST /purchase-requests` | 1.1 | [`contracts.md`](../contracts.md) §2.1 |
| `submitPurchaseRequest` | `POST /purchase-requests/{id}/submit` | 1.1 | idem |
| `checkStockAvailability` | *(dep. Inventario)* | 1.0 | [`contracts.md`](../contracts.md) §3.6 |
| `checkCatalogAvailability` | *(dep. catálogo CM)* | 1.0, 2.1 | [`contracts.md`](../contracts.md) §3 |

**Validaciones:** Sin validaciones de formulario — solo navegación UI hacia 1.0/1.1; las validaciones de escritura viven en la ficha 1.1.

**Edge cases:**
- Tenant sin Inventario ni CM → 0.2 salta a 1.1 (omisión de 1.0).
- Usuario sin rol de creación (`adq.solicitante`) → CTA oculto o `403` al intentar operaciones de 1.1.
- Fallo al evaluar capacidades de integración → ⚠ pendiente: ¿omitir 1.0 por seguridad o mostrar 1.0 degradado?

> ⚠ **Pendiente de definir:** mecanismo canónico de feature-flags / capacidades de tenant para Inventario y sync ChileCompra (consola municipal vs parámetros de plataforma).

**Wireframes relacionados:** CTA en [`01-listado-expedientes.md`](../wireframes/01-listado-expedientes.md); destino [`10-verificacion-previa.md`](../wireframes/10-verificacion-previa.md) o [`11-creacion-solped.md`](../wireframes/11-creacion-solped.md).

---

## Resumen de entidades — Etapa 0

| Entidad / DTO | Tipo de relación | Notas |
|---|---|---|
| `ProcurementCase` | Raíz de lectura | Consultada vía summary/detail; no escrita en 0.x |
| `ProcurementCaseSummary` | DTO de listado | Respuesta de `listProcurementCases` |
| `ProcurementCaseDetail` | DTO de detalle | Respuesta de `getProcurementCase` (navegación desde fila) |
| `OrganizationalUnit` | Plataforma | Scope RBAC y filtro departamento |

## Resumen de bordes — Etapa 0

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 0.1 | Operación módulo | `listProcurementCases` | — |
| 0.1 | Operación módulo | `getProcurementCase` | — |
| 0.2 | Navegación | → 1.0 / 1.1 | — |
| 0.2 | Dependencia *(capacidades)* | `checkStockAvailability` / `checkCatalogAvailability` *(evaluación)* | Inventario / Core (CM) |

**Etapa siguiente:** [1. SOLPED](./1-solped.md) (1.0 verificación previa optativa → 1.1 creación).
