# Contrato del core de plataforma

> Estado: borrador funcional — subset mínimo para dependencias de Adquisiciones y sandbox.
> Marco: [`arquitectura/especificacion/plataforma-core.md`](../arquitectura/especificacion/plataforma-core.md)
> Estándares: [`arquitectura/especificacion/estandares-api.md`](../arquitectura/especificacion/estandares-api.md)
> Metodología: [`arquitectura/especificacion/contrato-api-first.md`](../arquitectura/especificacion/contrato-api-first.md)
> Pendiente completo: **[P-48]**

**Alcance de este borrador:** operaciones que Adquisiciones y el sandbox requieren para autenticación, identidad, autorización, parámetros normativos y auditoría. Ciclo de vida completo de tenants y consolas admin se extienden en iteraciones posteriores.

---

## 1. Entidades que expone

| Entidad | Visibilidad | Campos expuestos (subset) |
|---|---|---|
| `Tenant` | Expuesta (lectura restringida) | `id`, `name`, `consumption_mode`, `enabled_modules`, `status` |
| `User` | Expuesta | `id`, `run`, `display_name`, `status` |
| `OrganizationalUnit` | Expuesta | `id`, `tenant_id`, `kind`, `name`, `code`, `parent_id`, `status`, `source` |
| `OrgStructureTemplate` | Expuesta (admin SUBDERE) | `id`, `kind`, `name`, `code`, `parent_template_id`, `active` |
| `Role` | Expuesta | `id`, `module`, `code`, `name`, `description`, `process_area` |
| `RoleAssignment` | Expuesta | `id`, `user_id`, `role_id`, `organizational_unit_id`, `valid_from`, `valid_until` |
| `ApiClient` | Expuesta (admin) | `id`, `name`, `scopes`, `tenant_ids`, `status`, `created_at` |
| `NormativeParameter` | Expuesta (lectura) | `id`, `key`, `value`, `valid_from`, `valid_until`, `legal_reference` |
| `TenantParameter` | Expuesta | `id`, `tenant_id`, `key`, `value` |
| `AuditRecord` | Expuesta (scope restringido) | `id`, `timestamp`, `actor_id`, `action`, `resource_type`, `resource_id`, `payload_summary` |
| `EventSubscription` | Expuesta (admin) | `id`, `tenant_id`, `event_types`, `delivery_url`, `scopes`, `status`, `created_at` |
| `Notification` | Expuesta (destinatario) | `id`, `module`, `kind`, `title`, `body`, `source_event_type`, `resource_type`, `resource_id`, `deep_link`, `read_at`, `created_at` |
| `NotificationPreference` | Expuesta (propietario) | `id`, `email_enabled`, `email_for_info`, `email_for_deadline`, `email_digest_daily`, `quiet_hours_start`, `quiet_hours_end`, `quiet_weekends` |
| `TenantNotificationPolicy` | Expuesta (admin municipal) | `id`, `tenant_id`, `mandatory_email_kinds`, `mandatory_email_event_types`, `updated_at` |
| `DocumentRef` | Expuesta | `id` |
| `Document` | Expuesta (metadatos) | `id`, `content_type`, `size_bytes`, `sha256`, `retention_class`, `created_at` |
| `TenantIntegrationConfig` | Expuesta (admin) | `id`, `tenant_id`, `provider_id`, `enabled`, parámetros no secretos |
| `TenantStorageConfig` | Expuesta (admin) | `id`, `tenant_id`, `storage_backend`, campos según backend |
| `DmsAdapter` | Expuesta (lectura catálogo) | `adapter_id`, `name`, `api_style`, `version` |

Definición canónica: [`modelo-datos/entidades-plataforma.md`](../modelo-datos/entidades-plataforma.md).

---

## 2. Operaciones que ofrece

Rutas sin prefijo de tenant hasta resolver **[P-03]**.

### 2.1 Autenticación

#### `POST /oauth/token` — `obtainToken`
- **Uso:** plano M2M (client credentials) y refresh de personas.
- **Entrada:** `grant_type`, `client_id`, `client_secret` (M2M) o `refresh_token` (personas)
- **Respuesta:** `access_token`, `token_type`, `expires_in`, `scope`
- **Nota:** diseño detallado **[P-02]**, **[P-22]**.

#### `POST /oauth/token/refresh` — `refreshToken`
- **Uso:** renovación de token personas (Clave Única).
- **Entrada:** `refresh_token`
- **Respuesta:** igual que `obtainToken`

### 2.2 Identidad

#### `GET /users/me` — `getCurrentUser`
- **Uso:** sesión/autorización y ficha **Mis datos** ([`wireframes/shell/03-mis-datos.md`](./wireframes/shell/03-mis-datos.md)).
- **Respuesta:** `User` + `RoleAssignment[]` **activas** en el tenant del token.
- **Enriquecimiento (UI):** cada ítem de `RoleAssignment` embebe `role` (`Role`: al menos `code`, `name`, `module`, `process_area`) y `organizational_unit` (`OrganizationalUnit` del nodo + `parent` departamento si `kind = unit`), para evitar N+1. Presentación de roles según [`catalogo-roles.md`](../arquitectura/especificacion/catalogo-roles.md) (`name` visible; `code` técnico).
- **Notas:** no hay «departamento home» en `User` — el vínculo orgánico son las N asignaciones. Sin email/cargo en `User` v1 (gap conocido respecto a canal correo en preferencias y firmante en C9; corrección de identidad laboral enriquecida → módulo RRHH futuro).

#### `GET /users/{id}` — `getUser`
- **Respuesta:** `User`
- **Errores:** `USER_NOT_FOUND`

#### `POST /users/me/profile-change-requests` — `requestProfileChange` *(inferida — detalle HTTP en §2.11 / P-48)*
- **Uso:** el funcionario solicita al administrador municipal un cambio de datos personales; **no** muta `User` en el acto (el admin aplica vía `updateUser`).
- **Entrada (borrador):** `proposed_display_name` (opcional), `reason` (obligatorio)
- **Respuesta (borrador):** acuse con `id`, `status` (`pending`), `created_at`
- **Errores:** `VALIDATION_ERROR` (motivo vacío); `USER_NOT_ACTIVE` si `status ≠ active`
- **Frontera RRHH:** no cubre vacaciones, liquidaciones ni otros trámites laborales.

### 2.3 Autorización

#### `GET /roles` — `listRoles`
- **Uso:** catálogo de roles del módulo (consola «Por módulo/proceso»); agrupable por `process_area`
- **Entrada:** filtros `module`, `process_area` (opcionales)
- **Respuesta:** colección de `Role`
- **Nota:** contenido canónico de prueba en [`arquitectura/especificacion/catalogo-roles.md`](../arquitectura/especificacion/catalogo-roles.md) (**P-24**)

#### `GET /role-assignments` — `listRoleAssignments`
- **Entrada:** filtros `user_id`, `organizational_unit_id`, `module`
- **Respuesta:** colección paginada de `RoleAssignment`

#### `POST /permissions/check` — `checkPermission`
- **Entrada:** `operation_id`, `resource_id` (opcional)
- **Respuesta:** `allowed` (boolean), `reason` (opcional)
- **Nota:** mecanismo runtime **[P-51]**; alternativa: claims en token de vida corta.

### 2.4 Parámetros

#### `GET /normative-parameters` — `listNormativeParameters`
- **Entrada:** filtro `key`, vigencia en fecha
- **Respuesta:** colección de `NormativeParameter`

#### `GET /normative-parameters/{key}` — `getNormativeParameter`
- **Respuesta:** `NormativeParameter` vigente
- **Errores:** `NORMATIVE_PARAMETER_NOT_FOUND`

#### `GET /tenant-parameters/{key}` — `getTenantParameter`
- **Respuesta:** `TenantParameter` del tenant del token
- **Errores:** `TENANT_PARAMETER_NOT_FOUND`

### 2.5 Tenants

#### `GET /tenants` — `listTenants`
- **Uso:** consola SUBDERE (scope plataforma).
- **Respuesta:** colección paginada de `Tenant`

#### `GET /tenants/{id}` — `getTenant`
- **Respuesta:** `Tenant`
- **Errores:** `TENANT_NOT_FOUND`

### 2.6 Auditoría

#### `GET /audit-records` — `listAuditRecords`
- **Entrada:** filtros `resource_type`, `resource_id`, `actor_id`, rango de fechas
- **Respuesta:** colección paginada de `AuditRecord`
- **Reglas:** scope restringido; sin datos personales en `payload_summary`.

### 2.7 Eventos y notificaciones (C6)

Visión: [`notificaciones/overview.md`](./notificaciones/overview.md). Matriz borrador **P-06:** [`notificaciones/matriz-evento-canal.md`](./notificaciones/matriz-evento-canal.md). Mecanismo de entrega a sistemas: **[P-05]**.

#### Webhooks M2M

#### `POST /event-subscriptions` — `registerWebhook`
- **Entrada:** `event_types[]`, `delivery_url`, `secret`
- **Respuesta:** `EventSubscription`

#### `GET /event-subscriptions` — `listEventSubscriptions`
- **Respuesta:** colección de `EventSubscription`

#### Bandeja y campanita

#### `GET /notifications` — `listNotifications`
- **Uso:** campanita (recientes) y bandeja completa
- **Entrada:** filtros `kind`, `module`, `read` (`true` \| `false` \| omitir), `from`, `to`, `q` (texto/folio), `limit`, cursor/página; `unread_first` (boolean)
- **Respuesta:** colección paginada de `Notification` del actor (incl. ítems por subrogancia activa)
- **Reglas:** solo destinatario; sin filtrar por tenant ajeno

#### `GET /notifications/{id}` — `getNotification`
- **Respuesta:** `Notification`
- **Errores:** `NOTIFICATION_NOT_FOUND`, `FORBIDDEN`

#### `POST /notifications/{id}/read` — `markNotificationRead` *(inferido — P-48)*
- **Efecto:** setea `read_at` si estaba nulo (idempotente)
- **Respuesta:** `Notification`

#### `POST /notifications/read-all` — `markAllNotificationsRead` *(inferido — P-48)*
- **Entrada:** filtros opcionales (mismos que listado)
- **Efecto:** marca leídas las del actor que cumplan filtro
- **Respuesta:** `{ updated_count }`

#### Preferencias

#### `GET /notification-preferences/me` — `getNotificationPreferences`
- **Respuesta:** `NotificationPreference` del actor (crea defaults si no existe)

#### `PUT /notification-preferences/me` — `upsertNotificationPreferences`
- **Entrada:** campos de preferencia
- **Respuesta:** `NotificationPreference`
- **Reglas:** rechaza opt-out de correo cuando `TenantNotificationPolicy` marca el kind/evento como obligatorio → `POLICY_FORBIDS_OPT_OUT`

#### `GET /tenant/notification-policy` — `getTenantNotificationPolicy` *(inferido — P-48)*
- **Respuesta:** `TenantNotificationPolicy`

#### `PUT /tenant/notification-policy` — `upsertTenantNotificationPolicy` *(inferido — P-48)*
- **Uso:** admin municipal — hechos de correo obligatorio
- **Entrada:** `mandatory_email_kinds`, `mandatory_email_event_types`
- **Respuesta:** `TenantNotificationPolicy`

### 2.8 Clientes M2M (admin)

#### `POST /api-clients` — `createApiClient`
- **Uso:** emisión de credenciales sandbox o producción (conecta con **P-15**).
- **Entrada:** `name`, `scopes`, `tenant_ids`
- **Respuesta:** `ApiClient` + `client_secret` (una sola vez)

#### `DELETE /api-clients/{id}` — `revokeApiClient`
- **Efecto:** revocación inmediata

### 2.9 Integraciones externas (C7, C9)

Operaciones consumidas por módulos vía dependencias declaradas en `contracts.md` §3. Implementación HTTP y secretos solo en el core.

#### `GET /mp/processes/{mp_process_id}` — `readMpProcess`
- **Servicio:** C7 — Mercado Público (solo lectura)
- **Uso:** vinculación y sincronización de estado; emite `MpStateChanged` internamente
- **Entrada:** `mp_process_id`
- **Respuesta:** existencia, tipo de proceso, organismo comprador, estado actual, datos de OC/cotización según contexto
- **Errores:** `MP_PROCESS_NOT_FOUND`, `MP_PROCESS_ORGANISM_MISMATCH`, `MP_PROCESS_TYPE_MISMATCH`, `MP_PROVIDER_UNAVAILABLE`

#### `POST /signatures` — `requestSignature`
- **Servicio:** C9 — FirmaGob
- **Entrada:** `document_ref` (`DocumentRef`), `signer_id`, `document_type` (opcional)
- **Respuesta:** `signature_request_id`, `status`
- **Nota:** C9 lee PDF vía C10; versión firmada se persiste en C10
- **Errores:** `SIGNATURE_PROVIDER_UNAVAILABLE`

#### `POST /signatures/{id}/confirm` — `confirmSignature`
- **Entrada:** `signature_request_id`
- **Respuesta:** `status`, `signed_document_ref`, `signed_at`
- **Errores:** `SIGNATURE_REJECTED`, `SIGNATURE_PROVIDER_UNAVAILABLE`

#### `GET /normative/utm` — `getUtmValue`
- **Servicio:** C9 — SII (cacheada, frescura mensual)
- **Entrada:** `period` (año-mes, opcional — vigente por defecto)
- **Respuesta:** `amount`, `period`, `source`
- **Errores:** `UTM_VALUE_UNAVAILABLE`

#### `GET /price-references/{item_code}` — `getPriceReference`
- **Servicio:** C9 — SII u otra fuente oficial
- **Entrada:** `item_code`, `reference_date` (opcional)
- **Respuesta:** `item_code`, `reference_price`, `reference_date`, `source`
- **Errores:** `PRICE_REFERENCE_UNAVAILABLE`

#### Admin integraciones

##### `PUT /tenant-integrations/{provider}` — `upsertTenantIntegration`
- **Uso:** consola municipal / SUBDERE
- **Entrada:** `enabled`, parámetros no secretos (`mp_organism_code`, `base_url`, …)
- **Respuesta:** `TenantIntegrationConfig`

##### `POST /tenant-integrations/{provider}/credentials` — `rotateIntegrationCredential`
- **Entrada:** nuevo secreto (una sola vez en respuesta) o referencia a rotación externa
- **Efecto:** rotación auditada en gestor de secretos

### 2.10 Gestión documental (C10)

Patrón recomendado para módulos: frontend sube aquí → obtiene `DocumentRef` → operación de negocio del módulo recibe solo el ref.

#### `POST /documents` — `storeDocument`
- **Entrada:** metadatos (`content_type`, `retention_class`, nombre opcional) + cuerpo binario o URL de subida firmada según implementación
- **Respuesta:** `DocumentRef` (`id`)
- **Errores:** `DOCUMENT_STORAGE_UNAVAILABLE`, `DOCUMENT_TYPE_NOT_ALLOWED`, `DOCUMENT_SIZE_EXCEEDED`

#### `GET /documents/{id}` — `getDocumentMetadata`
- **Respuesta:** `Document` (metadatos + hash)
- **Errores:** `DOCUMENT_NOT_FOUND`

#### `GET /documents/{id}/content` — `getDocument`
- **Respuesta:** stream del archivo (scope RBAC)

#### `GET /documents/{id}/download-url` — `getDownloadUrl`
- **Respuesta:** URL presignada o equivalente con expiración
- **Errores:** `DOCUMENT_NOT_FOUND`, `DOCUMENT_STORAGE_UNAVAILABLE`

#### `DELETE /documents/{id}` — `archiveDocument`
- **Efecto:** baja lógica según clase de retención

#### Admin almacenamiento

##### `PUT /tenant/storage` — `upsertTenantStorage`
- **Entrada:** `storage_backend`, campos según backend (`bucket_*` o `adapter_id` + `base_url` + `repository_id`)
- **Respuesta:** `TenantStorageConfig`

##### `GET /dms-adapters` — `listDmsAdapters`
- **Uso:** catálogo SUBDERE de adaptadores `external_dms`
- **Respuesta:** colección de `DmsAdapter`

### 2.11 Consolas admin — operations pendientes (P-48 / P-52)

Operaciones citadas en wireframes de [`overview.md`](./overview.md) / [`wireframes/`](./wireframes/README.md) que **aún no tienen cuerpo HTTP completo** en §2.1–§2.10. Los botones de UI las invocan por `operationId`; el detalle request/response se cierra en **P-48**.

#### Consola SUBDERE

| operationId | Pantalla wireframe | Notas |
|---|---|---|
| `createTenant` | `subdere/01-gestion-tenants` | Alta tenant + disparo aprovisionamiento |
| `updateTenant` | idem | Nombre, metadatos |
| `suspendTenant` | idem | `status = suspended` |
| `setEnabledModules` | idem | `Tenant.enabled_modules` |
| `proposeNormativeParameter` | `subdere/02-parametros-normativos` | Doble control — proponente |
| `approveNormativeParameter` | idem | Doble control — aprobador ≠ proponente |
| `listApiClients` | `subdere/03-clientes-m2m` | Listado admin |
| `rotateApiClientSecret` | idem | Secreto una sola vez en respuesta |
| `upsertPlatformIntegration` | `subdere/04-integraciones-plataforma` | CU OIDC, webhook MP nacional |
| `provisionPlatformBucket` | `subdere/05-provision-almacenamiento` | Backend `platform` por tenant |
| *(observabilidad)* | `subdere/06-monitoreo-tenant` | Sin operationId hasta P-08 / musts §8 |

#### Consola municipal

| operationId | Pantalla wireframe | Notas |
|---|---|---|
| `listUsers` | `municipal/01-usuarios` | Scope tenant |
| `createUser` | idem | Alta funcionario |
| `updateUser` | idem | Metadatos / estado |
| `revokeUser` | idem | Baja inmediata |
| `listRoles` | `municipal/02-roles-unidades` | Catálogo + `process_area` (P-24) |
| `listOrganizationalUnits` | `municipal/02-roles-unidades` | Árbol departamento→unidad |
| `createOrganizationalUnit` | idem | Alta departamento o unidad (`kind`) |
| `updateOrganizationalUnit` | idem | Renombre / padre / `status` |
| `listOrgStructureTemplates` | *SUBDERE (futuro)* | Catálogo base de plataforma — P-49 contenido |
| `createRoleAssignment` | idem | Con validación SoD |
| `revokeRoleAssignment` | idem | Fin asignación |
| `listDelegations` | `municipal/03-subrogancias` | |
| `createDelegation` | idem | `valid_until` obligatorio |
| `revokeDelegation` | idem | |
| `listSodExceptions` | `municipal/04-excepciones-sod` | |
| `createSodException` | idem | Auditada (P-25) |
| `revokeSodException` | idem | |
| `listTenantParameters` | `municipal/05-parametros-operativos` | Catálogo permitido |
| `upsertTenantParameter` | idem | |
| `listTenantIntegrations` | `municipal/06-integraciones-municipio` | |
| `getTenantStorage` | `municipal/07-almacenamiento-documentos` | Lectura config C10 |
| `listAccessRecertificationReport` | `municipal/08-recertificacion-accesos` | Reporte §9.4 seguridad |
| `markNotificationRead` | `shell/01-campanita`, `shell/02-bandeja` | C6 bandeja |
| `markAllNotificationsRead` | `shell/02-bandeja` | Bulk leídas |
| `requestProfileChange` | `shell/03-mis-datos` | Solicitud de cambio de datos al admin; no muta `User` |
| `getTenantNotificationPolicy` | `municipal/09-preferencias-notificacion` | Lectura política |
| `upsertTenantNotificationPolicy` | idem (admin) | Correo obligatorio por tenant |

---

## 3. Dependencias que requiere

| Proveedor | Operación | Uso del core |
|---|---|---|
| Clave Única | OIDC | Autenticación plano personas (C1) |
| Mercado Público | API lectura procesos | C7 — `readMpProcess`, evento `MpStateChanged` |
| FirmaGob | Firma electrónica | C9 — `requestSignature`, `confirmSignature`; PDF vía C10 |
| SII | UTM, referencias de precio | C9 — `getUtmValue`, `getPriceReference` |
| Object storage S3-compatible | Buckets `platform` / `tenant_owned` | C10 — backends documentales |
| APIs de DMS según adaptador | Repositorio municipal | C10 — backend `external_dms` vía `DmsAdapter` |

Los módulos **no** acceden a tablas del core ni a APIs de terceros; consumen las operaciones de §2.

---

## 4. Eventos que emite

| Evento | Origen | Esquema (campos principales) |
|---|---|---|
| `MpStateChanged` | Servicio sincronización MP (C7) | `mp_process_id`, `state`, `procurement_case_id` |
| `DocumentStored` | C10 | `document_ref`, `tenant_id`, `content_type`, `retention_class` |
| `SignatureCompleted` | C9 | `signature_request_id`, `signed_document_ref`, `signed_at` |
| `SignatureRejected` | C9 | `signature_request_id`, `reason` |
| `NormativeParameterUpdated` | Administración parámetros | `key`, `value`, `valid_from` |
| `TenantProvisioned` | Alta tenant | `tenant_id`, `schema_name` |
| `ApiClientRevoked` | Revocación M2M | `api_client_id`, `revoked_at` |

**[PENDIENTE P-05]** mecanismo de entrega (webhooks, cola).  
**[PENDIENTE P-06]** matriz evento → canal → destinatario — borrador en [`notificaciones/matriz-evento-canal.md`](./notificaciones/matriz-evento-canal.md).

---

## 5. Relación con Adquisiciones

`modulos/adquisiciones/contracts.md` §3 declara dependencias hacia módulos de negocio (Presupuestos, Contabilidad, Tesorería) y hacia el **core** (integraciones C7/C9, documentos C10, notificaciones C6). Las siguientes capacidades se resuelven vía **este contrato**:

- Identidad del funcionario originante (**P-23**)
- Scopes y roles para RBAC
- `getNormativeParameter`, `getUtmValue`, `getPriceReference`
- `readMpProcess` / `MpStateChanged`
- `requestSignature`, `confirmSignature`
- `storeDocument`, `getDownloadUrl` — adjuntos como `DocumentRef`
- Bandeja / campanita C6 (`listNotifications`, …) — pendientes del actor; no columna en listado de expedientes

