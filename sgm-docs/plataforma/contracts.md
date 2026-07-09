# Contrato del core de plataforma

> Estado: borrador funcional — subset mínimo para dependencias de Adquisiciones y sandbox.
> Marco: [`arquitectura/plataforma-core.md`](../arquitectura/plataforma-core.md)
> Estándares: [`arquitectura/estandares-api.md`](../arquitectura/estandares-api.md)
> Metodología: [`arquitectura/contrato-api-first.md`](../arquitectura/contrato-api-first.md)
> Pendiente completo: **[P-48]**

**Alcance de este borrador:** operaciones que Adquisiciones y el sandbox requieren para autenticación, identidad, autorización, parámetros normativos y auditoría. Ciclo de vida completo de tenants y consolas admin se extienden en iteraciones posteriores.

---

## 1. Entidades que expone

| Entidad | Visibilidad | Campos expuestos (subset) |
|---|---|---|
| `Tenant` | Expuesta (lectura restringida) | `id`, `name`, `consumption_mode`, `enabled_modules`, `status` |
| `User` | Expuesta | `id`, `run`, `display_name`, `status` |
| `OrganizationalUnit` | Expuesta | `id`, `tenant_id`, `name`, `parent_unit_id` |
| `Role` | Expuesta | `id`, `module`, `name`, `description` |
| `RoleAssignment` | Expuesta | `id`, `user_id`, `role_id`, `organizational_unit_id`, `valid_from`, `valid_until` |
| `ApiClient` | Expuesta (admin) | `id`, `name`, `scopes`, `tenant_ids`, `status`, `created_at` |
| `NormativeParameter` | Expuesta (lectura) | `id`, `key`, `value`, `valid_from`, `valid_until`, `legal_reference` |
| `TenantParameter` | Expuesta | `id`, `tenant_id`, `key`, `value` |
| `AuditRecord` | Expuesta (scope restringido) | `id`, `timestamp`, `actor_id`, `action`, `resource_type`, `resource_id`, `payload_summary` |
| `EventSubscription` | Expuesta (admin) | `id`, `event_types`, `delivery_url`, `scopes`, `status` |

Definición canónica propuesta: `modelo-datos/entidades-plataforma.md` (**pendiente de crear**).

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
- **Respuesta:** `User` + `RoleAssignment[]` activas en el tenant del token

#### `GET /users/{id}` — `getUser`
- **Respuesta:** `User`
- **Errores:** `USER_NOT_FOUND`

### 2.3 Autorización

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

### 2.7 Eventos (stub P-05)

#### `POST /event-subscriptions` — `registerWebhook`
- **Entrada:** `event_types[]`, `delivery_url`, `secret`
- **Respuesta:** `EventSubscription`

#### `GET /event-subscriptions` — `listEventSubscriptions`
- **Respuesta:** colección de `EventSubscription`

### 2.8 Clientes M2M (admin)

#### `POST /api-clients` — `createApiClient`
- **Uso:** emisión de credenciales sandbox o producción (conecta con **P-15**).
- **Entrada:** `name`, `scopes`, `tenant_ids`
- **Respuesta:** `ApiClient` + `client_secret` (una sola vez)

#### `DELETE /api-clients/{id}` — `revokeApiClient`
- **Efecto:** revocación inmediata

---

## 3. Dependencias que requiere

| Proveedor | Operación | Uso del core |
|---|---|---|
| Clave Única | OIDC | Autenticación plano personas |
| Mercado Público | `readMpProcess` (interno) | Servicio C7 — emite `MpStateChanged` |
| FirmaGob | `requestSignature`, `confirmSignature` | Delegación desde módulos vía contrato de dependencia |

Los módulos **no** acceden a tablas del core; consumen estas operaciones.

---

## 4. Eventos que emite

| Evento | Origen | Esquema (campos principales) |
|---|---|---|
| `MpStateChanged` | Servicio sincronización MP (C7) | `mp_process_id`, `state`, `procurement_case_id` |
| `NormativeParameterUpdated` | Administración parámetros | `key`, `value`, `valid_from` |
| `TenantProvisioned` | Alta tenant | `tenant_id`, `schema_name` |
| `ApiClientRevoked` | Revocación M2M | `api_client_id`, `revoked_at` |

**[PENDIENTE P-05]** mecanismo de entrega (webhooks, cola).

---

## 5. Relación con Adquisiciones

`modulos/adquisiciones/contracts.md` §3 declara dependencias hacia Presupuestos, Contabilidad, Tesorería, FirmaGob y MP. Las siguientes dependencias del core deben resolverse vía **este contrato**, no por acceso directo:

- Identidad del funcionario originante (**P-23**)
- Scopes y roles para RBAC
- `getNormativeParameter` / `getUtmValue` (UTM puede permanecer como dependencia SII en Adquisiciones; umbrales normativos vía core)
- `MpStateChanged` como sustituto interno de polling MP en módulos
