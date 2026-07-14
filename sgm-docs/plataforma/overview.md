# Core de plataforma

## Qué cubre

Infraestructura **obligatoria** del SGM: identidad, RBAC, tenants, parámetros, auditoría, eventos, integraciones externas (MP, FirmaGob, SII) y gestión documental. No es un módulo à la carte — todo municipio que use SGM consume el core.

Marco arquitectónico: [`arquitectura/plataforma-core.md`](../arquitectura/plataforma-core.md)  
Modelo de datos: [`modelo-datos/entidades-plataforma.md`](../modelo-datos/entidades-plataforma.md)  
Contrato API: [`contracts.md`](./contracts.md)  
Catálogo RBAC (borrador P-24): [`catalogo-roles.md`](./catalogo-roles.md)

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

Las operaciones *(inferidas)* están listadas en [`contracts.md`](./contracts.md) §2.11 hasta cerrar **P-48**.

## Fuera de alcance de esta carpeta

- Flujos de negocio de módulos funcionales (Adquisiciones, Presupuestos, etc.).
- OpenAPI del core — sigue en P-48.

## Prototipo HTML

[`sgm-prototipos/plataforma/`](../../sgm-prototipos/plataforma/index.html) — hub de consolas SUBDERE y municipal (véase [`MANIFEST.md`](../../sgm-prototipos/MANIFEST.md) sección Plataforma).

## Estado

Wireframes (**P-52**) y prototipos HTML de ambas consolas. Cuerpos HTTP de ops admin pendientes en **P-48**.
