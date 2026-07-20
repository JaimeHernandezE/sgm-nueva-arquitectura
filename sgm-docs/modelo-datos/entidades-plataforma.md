# Entidades de plataforma

Fuente canónica de entidades del **core de plataforma**: identidad, RBAC, tenants, parámetros, auditoría, integraciones externas y gestión documental. Los módulos funcionales **referencian** estas entidades — no las redefinen.

Marco: [`arquitectura/plataforma-core.md`](../arquitectura/plataforma-core.md)  
Contrato HTTP: [`plataforma/contracts.md`](../plataforma/contracts.md)

**Convención de nombres:** inglés, PascalCase para entidades; snake_case para campos.

**Distinción con `entidades-core.md`:** entidades de dominio de negocio (SOLPED, OC, etc.) viven en `entidades-core.md`. Campos `*_attachment` y `supporting_document_ref` en entidades de dominio son **`DocumentRef`** definido aquí.

---

## Identidad y RBAC

### `Tenant`
**Visibilidad:** expuesta (lectura restringida según scope)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** (generado por sistema) |
| `name` | texto | **Obligatorio** |
| `consumption_mode` | enum | **Obligatorio**. `hosted_full`, `hosted_hybrid`, `api_a_la_carte` |
| `enabled_modules` | texto[] | **Obligatorio** — módulos habilitados |
| `status` | enum | **Obligatorio**. `provisioning`, `active`, `suspended`, `decommissioned` |
| `schema_name` | texto | **Obligatorio** (generado por sistema) — schema BD transaccional |

### `User`
**Visibilidad:** expuesta

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `run` | texto | **Obligatorio** — RUN chileno |
| `display_name` | texto | **Obligatorio** |
| `status` | enum | **Obligatorio**. `active`, `suspended`, `revoked` |

### `OrganizationalUnit`
**Visibilidad:** expuesta

Estructura orgánico-funcional del municipio en **dos niveles** bajo el tenant:

```
Tenant (municipio)
 └── department  →  Tránsito, Dirección de Obras, Finanzas, …
      └── unit   →  Abastecimiento, Presupuestos, Tesorería, …
```

Una sola entidad tipada (no dos tablas): el `kind` fija el nivel y las reglas de padre.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `tenant_id` | ref. `Tenant` | **Obligatorio** |
| `kind` | enum | **Obligatorio**. `department` \| `unit` |
| `name` | texto | **Obligatorio** |
| `code` | texto | **Opcional** — código estable interno del tenant (útil para integraciones) |
| `parent_id` | ref. `OrganizationalUnit` | **Obligatorio si** `kind = unit` (padre debe ser `department`). **Nulo si** `kind = department` |
| `status` | enum | **Obligatorio**. `active` \| `inactive` |
| `source` | enum | **Obligatorio**. `template` (clonada desde plantilla de plataforma) \| `custom` (creada por el municipio) |

**Reglas de jerarquía (v1):**

1. Profundidad máxima dos niveles bajo el tenant: departamento → unidad. Sin sub-unidades anidadas.
2. Un departamento puede existir **sin** unidades hijas (municipio pequeño o área sin desglose). En ese caso el RBAC puede asignar roles al propio departamento — ver `RoleAssignment`.
3. Renombrar, agregar, desactivar o mover unidades entre departamentos es administración municipal auditada; no requiere cambios de schema.

Ejemplos típicos:

| Departamento | Unidades (ejemplos) |
|---|---|
| Finanzas | Abastecimiento, Presupuestos, Tesorería |
| Dirección de Obras Municipales | (ninguna, o unidades de obra según el municipio) |
| Tránsito | (ninguna, o fiscalización / permisos según el municipio) |

#### Plantilla de estructura (`OrgStructureTemplate`)

**Visibilidad:** expuesta (lectura plataforma; administración SUBDERE)

Catálogo **base de plataforma** que el sistema ofrece al aprovisionar un tenant. No es la estructura viva del municipio: al alta del tenant se **clona** al tenant como `OrganizationalUnit` con `source = template`. Después el municipio la edita (renombra, agrega, desactiva).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `kind` | enum | **Obligatorio**. `department` \| `unit` |
| `name` | texto | **Obligatorio** |
| `code` | texto | **Opcional** — código estable de plantilla |
| `parent_template_id` | ref. `OrgStructureTemplate` | **Obligatorio si** `kind = unit` |
| `active` | booleano | **Obligatorio** — ítem incluido en nuevos aprovisionamientos |

⚠ Contenido concreto del catálogo base (lista definitiva de departamentos/unidades típicos) se cierra con pilotos/DM — **[P-49]**. El **modelo** (dos niveles + plantilla clonable) queda fijado aquí.

### `Role` / `Permission`

Catálogo transversal (única fuente): [`arquitectura/catalogo-roles.md`](../arquitectura/catalogo-roles.md) (**P-24**).

#### `Role`
**Visibilidad:** expuesta (lectura; administración de definiciones = plataforma / SUBDERE)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `module` | texto | **Obligatorio** — `adquisiciones`, `plataforma`, … |
| `code` | texto | **Obligatorio** — estable (`adq.solicitante`); único por plataforma |
| `name` | texto | **Obligatorio** |
| `description` | texto | **Opcional** |
| `process_area` | texto | **Opcional** — nodo del árbol de proceso para vista admin «Por módulo/proceso» (`adq.solped`, `plat.municipal`, …) |

#### `Permission`
**Visibilidad:** expuesta (lectura)

Unidad de autorización = operación del contrato (`seguridad.md` §3.1).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `role_id` | ref. `Role` | **Obligatorio** |
| `operation_id` | texto | **Obligatorio** — `operationId` OpenAPI / `contracts.md` del módulo |
| `module` | texto | **Obligatorio** — módulo dueño del contrato de la operación |

### `RoleAssignment` / `Delegation` / `SodRule` / `SodException`

Definición de alto nivel en `plataforma-core.md` §4.

#### `RoleAssignment` — cardinalidad

**1 usuario → N asignaciones.** Cada fila vincula un rol a un nodo orgánico del tenant (preferentemente una **unidad**; departamento solo si opera sin desglose):

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `user_id` | ref. `User` | **Obligatorio** |
| `role_id` | ref. `Role` | **Obligatorio** — rol **en ese** nodo |
| `organizational_unit_id` | ref. `OrganizationalUnit` | **Obligatorio** — `kind = unit`, o `kind = department` sin unidades hijas activas |
| `valid_from` | fecha | **Obligatorio** |
| `valid_until` | fecha | **Opcional** |

Un municipio pequeño puede asignar a la misma persona, p. ej., `adq.aprobador_unidad` en Abastecimiento y `adq.firmante_cdp` en Presupuestos (dos `RoleAssignment`). La UI ofrece vistas **por usuario** y **por módulo/proceso** — ver wireframe [`02-roles-unidades.md`](../plataforma/wireframes/municipal/02-roles-unidades.md).

---

## Parámetros y auditoría

### `NormativeParameter`
**Visibilidad:** expuesta (lectura)

Parámetro normativo de plataforma (umbrales UTM, tramos de licitación, etc.). Antes listado en `entidades-core.md`; **canónico aquí**.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `key` | texto | **Obligatorio** — clave estable |
| `value` | JSON | **Obligatorio** |
| `valid_from` | fecha | **Obligatorio** |
| `valid_until` | fecha | **Opcional** |
| `legal_reference` | texto | **Opcional** |

### `TenantParameter`
**Visibilidad:** expuesta (administración municipal)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `tenant_id` | ref. `Tenant` | **Obligatorio** |
| `key` | texto | **Obligatorio** |
| `value` | JSON | **Obligatorio** |

### `AuditRecord` / `EventSubscription` / `ApiClient`
Ver `plataforma-core.md` §4 y `plataforma/contracts.md`.

---

## Integraciones externas

### `ExternalProvider`
**Visibilidad:** interna — catálogo administrado por SUBDERE

| Campo | Tipo | Notas |
|---|---|---|
| `provider_id` | enum | **Obligatorio**. `mercado_publico`, `firma_gob`, `sii`, `clave_unica` |
| `name` | texto | **Obligatorio** |
| `service_code` | texto | **Obligatorio** — C1, C7, C9, etc. |

### `TenantIntegrationConfig`
**Visibilidad:** expuesta (administración)

Configuración **no secreta** por tenant y proveedor.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `tenant_id` | ref. `Tenant` | **Obligatorio** |
| `provider_id` | ref. `ExternalProvider` | **Obligatorio** |
| `enabled` | booleano | **Obligatorio** |
| `mp_organism_code` | texto | **Opcional** — **Obligatorio si** `provider_id = mercado_publico` |
| `base_url` | URL | **Opcional** — según proveedor |
| `parameters` | JSON | **Opcional** — parámetros no secretos adicionales |

### `IntegrationCredential`
**Visibilidad:** interna

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `tenant_integration_config_id` | ref. `TenantIntegrationConfig` | **Obligatorio** |
| `secret_ref` | texto | **Obligatorio** — referencia opaca al gestor de secretos |
| `rotated_at` | fecha/hora | **Opcional** |
| `expires_at` | fecha/hora | **Opcional** |

---

## Gestión documental (C10)

### `DmsAdapter`
**Visibilidad:** expuesta (lectura — catálogo SUBDERE)

| Campo | Tipo | Notas |
|---|---|---|
| `adapter_id` | texto | **Obligatorio** — identificador estable |
| `name` | texto | **Obligatorio** |
| `api_style` | enum | **Obligatorio**. `s3_compatible`, `rest`, `cmis`, `proprietary` |
| `version` | texto | **Obligatorio** |

### `TenantStorageConfig`
**Visibilidad:** expuesta (administración)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `tenant_id` | ref. `Tenant` | **Obligatorio** |
| `storage_backend` | enum | **Obligatorio**. `platform`, `tenant_owned`, `external_dms` |
| `bucket_name` | texto | **Opcional** — **Obligatorio si** `tenant_owned` |
| `bucket_region` | texto | **Opcional** — **Obligatorio si** `tenant_owned` |
| `bucket_endpoint` | URL | **Opcional** — S3-compatible municipal |
| `adapter_id` | ref. `DmsAdapter` | **Opcional** — **Obligatorio si** `external_dms` |
| `base_url` | URL | **Opcional** — **Obligatorio si** `external_dms` |
| `repository_id` | texto | **Opcional** — repositorio/carpeta raíz DMS |

Credenciales de bucket o DMS vía `IntegrationCredential` asociada.

### `Document`
**Visibilidad:** interna — metadatos en core; bytes fuera de BD transaccional

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** — mismo valor expuesto como `DocumentRef.id` |
| `tenant_id` | ref. `Tenant` | **Obligatorio** |
| `content_type` | texto | **Obligatorio** — MIME |
| `size_bytes` | entero | **Obligatorio** |
| `sha256` | texto | **Obligatorio** |
| `storage_backend` | enum | **Obligatorio** — copia del tenant al momento de almacenar |
| `retention_class` | texto | **Obligatorio** |
| `external_locator` | texto | **Obligatorio** — ID nativo del backend; opaco para módulos |
| `created_at` | fecha/hora | **Obligatorio** |
| `archived_at` | fecha/hora | **Opcional** — baja lógica |

### `DocumentRef`
**Visibilidad:** expuesta — única referencia que cruzan los módulos

Identificador opaco. Los módulos persisten `DocumentRef` en campos `*_attachment`; resolución de bytes siempre vía C10.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** — string en APIs de módulo |

En payloads de módulo, los campos `founded_resolution_attachment`, `scanned_certificate_attachment`, `supporting_document_ref`, `PurchaseRequestAttachment.document_ref` y listas `attachments` son **UUID de `DocumentRef`**.

### `SignatureRequest`
**Visibilidad:** interna — subconjunto consultable vía C9

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | **Obligatorio** |
| `tenant_id` | ref. `Tenant` | **Obligatorio** |
| `document_ref` | ref. `DocumentRef` | **Obligatorio** — PDF en C10 |
| `signer_id` | ref. `User` | **Obligatorio** |
| `provider` | enum | **Obligatorio** — `firma_gob` |
| `status` | enum | **Obligatorio**. `pending`, `completed`, `rejected`, `expired` |
| `signed_document_ref` | ref. `DocumentRef` | **Opcional** — versión firmada en C10 |
| `requested_at` | fecha/hora | **Obligatorio** |
| `completed_at` | fecha/hora | **Opcional** |

---

## Valores de referencia consumidos por módulos (no entidades de módulo)

Estos tipos se devuelven por operaciones del core (C7/C9); los módulos pueden cachearlos pero no los administran.

### `UtmValue` *(DTO)*
Procedencia: `getUtmValue` (C9 → SII). Ver nota en `entidades-core.md`.

### `PriceReference` *(DTO)*
Procedencia: `getPriceReference` (C9 → SII u otra fuente). Entidad de dominio homónima en `entidades-core.md` describe el uso en líneas SOLPED.

### `MpProcessSnapshot` *(DTO / bitácora)*
Procedencia: servicio C7. Bitácora de sincronización MP; ver `entidades-core.md`.
