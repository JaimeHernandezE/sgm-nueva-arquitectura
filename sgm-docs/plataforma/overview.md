# Core de plataforma

## Qué cubre

Infraestructura **obligatoria** del SGM: identidad, RBAC, tenants, parámetros, auditoría, eventos y notificaciones (C6), integraciones externas (MP, FirmaGob, SII) y gestión documental. No es un módulo à la carte — todo municipio que use SGM consume el core.

Marco arquitectónico: [`arquitectura/especificacion/plataforma-core.md`](../arquitectura/especificacion/plataforma-core.md)  
Modelo de datos: [`modelo-datos/entidades-plataforma.md`](../modelo-datos/entidades-plataforma.md)  
Contrato API: [`contracts.md`](./contracts.md)  
Notificaciones (C6): [`notificaciones/overview.md`](./notificaciones/overview.md) · matriz P-06: [`notificaciones/matriz-evento-canal.md`](./notificaciones/matriz-evento-canal.md)  
Mensajería in-app: [`mensajeria/overview.md`](./mensajeria/overview.md)  
Catálogo RBAC (borrador P-24, transversal): [`arquitectura/especificacion/catalogo-roles.md`](../arquitectura/especificacion/catalogo-roles.md)

## Dos consolas, una API

Ambas consolas son **frontends sin privilegios**: solo invocan operaciones publicadas en `contracts.md`. Toda acción administrativa es auditada.

| Consola | Audiencia | Alcance |
|---|---|---|
| **Plataforma (SUBDERE)** | Operadores SUBDERE | Tenants, parámetros normativos, M2M, integraciones nacionales, buckets `platform`, monitoreo, auditoría de plataforma |
| **Municipal** | Administrador delegado del municipio | Usuarios, roles/unidades, subrogancias, SoD, parámetros operativos, integraciones del tenant, almacenamiento documental, recertificación |

Fuente de pantallas: `plataforma-core.md` §9. Wireframes: [`wireframes/`](./wireframes/README.md).

## Índice — Consola SUBDERE

| Pantalla | Wireframe | Operaciones |
|---|---|---|
| Gestión de tenants | [`subdere/01-gestion-tenants.md`](./wireframes/subdere/01-gestion-tenants.md) | `listTenants`, `getTenant`; *(inferidas)* `createTenant`, `updateTenant`, `suspendTenant`, `setEnabledModules` |
| Parámetros normativos | [`subdere/02-parametros-normativos.md`](./wireframes/subdere/02-parametros-normativos.md) | `listNormativeParameters`, `getNormativeParameter`; *(inferidas)* `proposeNormativeParameter`, `approveNormativeParameter` |
| Clientes M2M | [`subdere/03-clientes-m2m.md`](./wireframes/subdere/03-clientes-m2m.md) | `createApiClient`, `revokeApiClient`; *(inferidas)* `listApiClients`, `rotateApiClientSecret` |
| Integraciones de plataforma | [`subdere/04-integraciones-plataforma.md`](./wireframes/subdere/04-integraciones-plataforma.md) | `listDmsAdapters`; *(inferida)* `upsertPlatformIntegration` |
| Provisión de almacenamiento | [`subdere/05-provision-almacenamiento.md`](./wireframes/subdere/05-provision-almacenamiento.md) | *(inferida)* `provisionPlatformBucket` |
| Monitoreo por tenant | [`subdere/06-monitoreo-tenant.md`](./wireframes/subdere/06-monitoreo-tenant.md) | *(pendiente observabilidad — musts §8 / P-08)* |
| Auditoría de plataforma | [`subdere/07-auditoria-plataforma.md`](./wireframes/subdere/07-auditoria-plataforma.md) | `listAuditRecords` (scope plataforma) |

## Índice — Consola municipal

| Pantalla | Wireframe | Operaciones |
|---|---|---|
| Usuarios | [`municipal/01-usuarios.md`](./wireframes/municipal/01-usuarios.md) | `getUser`, `getCurrentUser`; *(inferidas)* `listUsers`, `createUser`, `updateUser`, `revokeUser` |
| Roles y unidades | [`municipal/02-roles-unidades.md`](./wireframes/municipal/02-roles-unidades.md) | Vistas **por usuario** y **por módulo/proceso**. `listRoleAssignments`, `listRoles`; *(inferidas)* `createRoleAssignment`, `revokeRoleAssignment`, `listOrganizationalUnits`, CRUD departamentos/unidades |
| Subrogancias | [`municipal/03-subrogancias.md`](./wireframes/municipal/03-subrogancias.md) | *(inferidas)* CRUD `Delegation` |
| Excepciones SoD | [`municipal/04-excepciones-sod.md`](./wireframes/municipal/04-excepciones-sod.md) | *(inferidas)* CRUD `SodException` |
| Parámetros operativos | [`municipal/05-parametros-operativos.md`](./wireframes/municipal/05-parametros-operativos.md) | `getTenantParameter`; *(inferidas)* `listTenantParameters`, `upsertTenantParameter` |
| Integraciones del municipio | [`municipal/06-integraciones-municipio.md`](./wireframes/municipal/06-integraciones-municipio.md) | `upsertTenantIntegration`, `rotateIntegrationCredential`; *(inferida)* `listTenantIntegrations` |
| Almacenamiento de documentos | [`municipal/07-almacenamiento-documentos.md`](./wireframes/municipal/07-almacenamiento-documentos.md) | `upsertTenantStorage`; *(inferida)* `getTenantStorage` |
| Recertificación de accesos | [`municipal/08-recertificacion-accesos.md`](./wireframes/municipal/08-recertificacion-accesos.md) | *(inferida)* `listAccessRecertificationReport` |
| Preferencias de notificación | [`municipal/09-preferencias-notificacion.md`](./wireframes/municipal/09-preferencias-notificacion.md) | `getNotificationPreferences`, `upsertNotificationPreferences`; *(inferida)* `upsertTenantNotificationPolicy` |

## Shell — cuenta y notificaciones (C6)

Superficie del **propio usuario** (no es consola admin). Presente en todas las consolas y módulos. Visión C6: [`notificaciones/overview.md`](./notificaciones/overview.md). Entrada habitual: menú de cuenta del topbar.

| Pantalla | Wireframe | Operaciones |
|---|---|---|
| Campanita | [`shell/01-campanita.md`](./wireframes/shell/01-campanita.md) | `listNotifications`; *(inferida)* `markNotificationRead` |
| Bandeja de entrada | [`shell/02-bandeja.md`](./wireframes/shell/02-bandeja.md) | `listNotifications`, `getNotification`; *(inferidas)* `markNotificationRead`, `markAllNotificationsRead` |
| Mis datos | [`shell/03-mis-datos.md`](./wireframes/shell/03-mis-datos.md) | `getCurrentUser`; *(inferida)* `requestProfileChange` |
| Chat contextual (FAB) | [`shell/04-chat-contextual.md`](./wireframes/shell/04-chat-contextual.md) | Mensajería (demo) — [`mensajeria/overview.md`](./mensajeria/overview.md) |
| Chats (listado) | [`shell/05-chats.md`](./wireframes/shell/05-chats.md) | Listado de conversaciones demo + deep link a vista citada |

Las operaciones *(inferidas)* están listadas en [`contracts.md`](./contracts.md) §2.11 hasta cerrar **P-48**.

## Fuera de alcance de esta carpeta

- Flujos de negocio de módulos funcionales (Adquisiciones, Presupuestos, etc.).
- OpenAPI del core — sigue en P-48.

## Prototipo HTML

Entrada pública (GitHub Pages / local): [`sgm-prototipos/index.html`](../../sgm-prototipos/index.html) — landing → simulación ClaveÚnica → `home.html` → bandeja C6.

Hub de consolas: [`sgm-prototipos/plataforma/`](../../sgm-prototipos/plataforma/index.html) (SUBDERE, municipal, bandeja, **Chats**). Detalle de navegación: [`MANIFEST.md`](../../sgm-prototipos/MANIFEST.md).

## Estado

Wireframes (**P-52**) y prototipos HTML de ambas consolas. Shell: C6 ([`notificaciones/`](./notificaciones/overview.md)), [`mis datos`](./wireframes/shell/03-mis-datos.md), mensajería ([`mensajeria/`](./mensajeria/overview.md) — FAB + [`05-chats`](./wireframes/shell/05-chats.md)). Cuerpos HTTP de ops admin e inbox pendientes en **P-48**. Matriz **P-06** en borrador.
