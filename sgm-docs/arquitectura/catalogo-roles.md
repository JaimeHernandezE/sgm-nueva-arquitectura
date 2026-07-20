# Catálogo de roles (borrador P-24)

> **Estado:** borrador para discusión interna con el equipo / DM.  
> **Documento transversal** de arquitectura: una sola fuente para todos los módulos (no duplicar catálogos por módulo).  
> **Marco:** [`seguridad.md`](./seguridad.md) §3 · [`modelo-datos/entidades-plataforma.md`](../modelo-datos/entidades-plataforma.md)  
> **Consola:** [`plataforma/wireframes/municipal/02-roles-unidades.md`](../plataforma/wireframes/municipal/02-roles-unidades.md) (vistas por usuario y por módulo/proceso)

La unidad de permiso es la **`operationId` del contrato**, no la pantalla. Un rol es un paquete estable de operaciones. La UI (wireframes, árbol de proceso) solo **declara** qué roles se necesitan para actuar; no inventa ACLs por vista.

```
RoleAssignment (usuario + nodo orgánico + rol)
  → Role (catálogo)
    → Permission[] = operationId del módulo / core
```

---

## 1. Convenciones

| Campo | Significado |
|---|---|
| `code` | **Código (sistema).** Identificador estable, único, sin espacios (`adq.solicitante`). Prefijo = módulo. Usado en RBAC, `RoleAssignment`, contratos, matrices SoD y Rol→`operationId`. No se cambia por redacción de UI. |
| `name` | **Nombre (usuarios).** Etiqueta en español para fichas, wireframes y consolas (`Solicitante`). Puede afinarse la redacción sin cambiar el `code`. |
| `module` | `adquisiciones` \| `plataforma` |
| `process_area` | Nodo del árbol de proceso (vista admin “Por módulo/proceso”) |
| Nodo orgánico típico | Dónde suele asignarse el `RoleAssignment` (departamento › unidad) |

**Regla de presentación:**

- Fichas de proceso (fila Rol): `Nombre ([code](enlace a este catálogo))` — ejemplo: `Solicitante ([adq.solicitante](./catalogo-roles.md))`.
- Wireframes y prosa: preferir el `name`; el `code` en notas RBAC / QA.
- Matrices técnicas de este documento (§4, §7): solo `code`.

Roles de plataforma SUBDERE se asignan con alcance de plataforma (no tenant municipal), salvo nota en contrario.

---

## 2. Árbol de proceso por módulo

Usado por la vista **Por módulo/proceso**. Asignar en un nodo = `createRoleAssignment` de un rol cuyo `process_area` es ese nodo (o hijo). No crea permisos distintos por pantalla.

### 2.1 Adquisiciones (`adq`)

```
adq
 ├── adq.solped        (etapa 1 — transversal SOLPED)
 ├── adq.modalidad     (etapa 2 — modalidad)
 ├── adq.resolucion    (etapa 3 — resolución / OC; CA·CM·LP·TD tipografía informativa)
 ├── adq.recepcion     (etapa 4 — recepción conforme)
 └── adq.pago          (etapa 5 — pago)
```

| `process_area` | Etapa | Roles tipicos |
|---|---|---|
| `adq.solped` | 1.x | `adq.solicitante`, `adq.aprobador_unidad`, `adq.formulador_presupuesto`, `adq.firmante_cdp` |
| `adq.modalidad` | 2.x | `adq.gestor_compra`, `adq.aprobador_modalidad` |
| `adq.resolucion` | 3.x | `adq.gestor_compra` |
| `adq.recepcion` | 4.x | `adq.recepcionista`, `adq.confirmante_recepcion` |
| `adq.pago` | 5.x | `adq.operador_pago` |
| `adq` (raíz) | transversal | `adq.lector` |

v1 **no** duplica roles por modalidad (CA/CM/LP/TD); ver §8.

### 2.2 Plataforma

```
plat.municipal
 ├── plat.municipal.users
 ├── plat.municipal.org_roles
 ├── plat.municipal.delegations
 ├── plat.municipal.sod
 ├── plat.municipal.params
 ├── plat.municipal.integrations
 ├── plat.municipal.storage
 └── plat.municipal.recertification

plat.subdere
 ├── plat.subdere.tenants
 ├── plat.subdere.normative
 ├── plat.subdere.m2m
 ├── plat.subdere.integrations
 ├── plat.subdere.storage
 └── plat.subdere.audit
```

---

## 3. Roles Adquisiciones

| Nombre (usuarios) | Código (sistema) | `process_area` | Nodo orgánico típico | Origen en fichas |
|---|---|---|---|---|
| Solicitante | `adq.solicitante` | `adq.solped` | Unidad / depto solicitante (Obras, Tránsito, …) | [`1-solped.md`](../modulos/adquisiciones/procesos-transversales/1-solped.md) §1.1, §1.4 |
| Aprobador de unidad | `adq.aprobador_unidad` | `adq.solped` | Misma unidad solicitante (jefatura) | [`1-solped.md`](../modulos/adquisiciones/procesos-transversales/1-solped.md) §1.2 |
| Formulador DAF / verificación | `adq.formulador_presupuesto` | `adq.solped` | Finanzas › Presupuestos | [`1-solped.md`](../modulos/adquisiciones/procesos-transversales/1-solped.md) §1.3 |
| Firmante CDP | `adq.firmante_cdp` | `adq.solped` | Finanzas › Presupuestos | [`1-solped.md`](../modulos/adquisiciones/procesos-transversales/1-solped.md) §1.5, §1.6 |
| Gestor de compra | `adq.gestor_compra` | `adq.modalidad`, `adq.resolucion` | Finanzas › Abastecimiento | [`2-modalidad-compra.md`](../modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md) §2.1, §2.3; resoluciones CA/CM/LP/TD (etapa 3); [`4-recepcion-conforme.md`](../modulos/adquisiciones/procesos-transversales/4-recepcion-conforme.md) §4.5 |
| Aprobador de modalidad | `adq.aprobador_modalidad` | `adq.modalidad` | Abastecimiento / jefatura DAF | [`2-modalidad-compra.md`](../modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md) §2.2 (P-38); LP acto bases / adjudicación / comisión (v1) |
| Recepcionista | `adq.recepcionista` | `adq.recepcion` | Unidad receptora | [`4-recepcion-conforme.md`](../modulos/adquisiciones/procesos-transversales/4-recepcion-conforme.md) §4.1, §4.3 |
| Confirmante de recepción | `adq.confirmante_recepcion` | `adq.recepcion` | Unidad receptora / control | [`4-recepcion-conforme.md`](../modulos/adquisiciones/procesos-transversales/4-recepcion-conforme.md) §4.2 |
| Operador de pago | `adq.operador_pago` | `adq.pago` | Finanzas › Tesorería | [`5-pago.md`](../modulos/adquisiciones/procesos-transversales/5-pago.md) §5.1–§5.4 |
| Lector de expediente | `adq.lector` | `adq` | Cualquier unidad con necesidad de consulta | Lectura transversal |

---

## 4. Matriz Rol → `operationId` (Adquisiciones)

Operaciones según [`modulos/adquisiciones/contracts.md`](../modulos/adquisiciones/contracts.md). Lectura compartida: quienes tienen un rol de escritura del módulo también pueden las `list*`/`get*` del expediente, salvo que se asigne solo `adq.lector`.

La columna usa **código (sistema)**; el nombre de usuario está en §3.

| Código (sistema) | Operaciones |
|---|---|
| `adq.lector` | `listProcurementCases`, `getProcurementCase`, `listProcurementCaseSteps`, `listPurchaseRequests`, `getPurchaseRequest`, `listPurchaseOrders`, `getPurchaseOrder` |
| `adq.solicitante` | (+ lector) `createPurchaseRequest`, `submitPurchaseRequest`, `previewBudgetAvailability`, `requestBudgetFinancing` |
| `adq.aprobador_unidad` | (+ lector) `approvePurchaseRequest`, `rejectPurchaseRequest`, `previewBudgetAvailability` |
| `adq.formulador_presupuesto` | (+ lector) `verifyBudgetAvailability` |
| `adq.firmante_cdp` | (+ lector) `issueBudgetAvailabilityCertificate`, `registerScannedBudgetAvailabilityCertificate`, `createBudgetPreCommitment` |
| `adq.gestor_compra` | (+ lector) `confirmProcurementModality`, `linkMpProcess`, `recordQuotationResult`, `registerPurchaseOrder`, `syncPurchaseOrderAccepted`, `releasePreCommitment` |
| `adq.aprobador_modalidad` | (+ lector) `approveModalityDecision`, `rejectModalityDecision` |
| `adq.recepcionista` | (+ lector) `registerReceipt` |
| `adq.confirmante_recepcion` | (+ lector) `confirmReceipt`, `recordAccrual` *(según P-46)* |
| `adq.operador_pago` | (+ lector) `performThreeWayMatch`, `registerAccrual`, `issuePaymentDecree`, `executePayment` |

`registerInventoryEntry` queda fuera hasta **P-44**.

---

## 5. Roles plataforma

### 5.1 Municipal

| Nombre (usuarios) | Código (sistema) | `process_area` | Notas |
|---|---|---|---|
| Administrador municipal | `plat.admin_municipal` | `plat.municipal` | Paquete completo de consola municipal (v1 de prueba) |

**Operaciones** ([`plataforma/contracts.md`](../plataforma/contracts.md) §2 + §2.11):  
`listUsers`, `createUser`, `updateUser`, `revokeUser`, `getUser`, `listOrganizationalUnits`, `createOrganizationalUnit`, `updateOrganizationalUnit`, `listRoles`, `listRoleAssignments`, `createRoleAssignment`, `revokeRoleAssignment`, `listDelegations`, `createDelegation`, `revokeDelegation`, `listSodExceptions`, `createSodException`, `revokeSodException`, `listTenantParameters`, `upsertTenantParameter`, `getTenantParameter`, `listTenantIntegrations`, `upsertTenantIntegration`, `rotateIntegrationCredential`, `getTenantStorage`, `upsertTenantStorage`, `listAccessRecertificationReport`, `listAuditRecords` (scope tenant).

> Partición en roles más finos (solo accesos vs. solo integraciones) queda como pregunta al equipo (§8).

### 5.2 SUBDERE

| Nombre (usuarios) | Código (sistema) | `process_area` | Operaciones (principales) |
|---|---|---|---|
| Operador de tenants | `plat.operador_tenants` | `plat.subdere.tenants` | `listTenants`, `getTenant`, `createTenant`, `updateTenant`, `suspendTenant`, `setEnabledModules`, `provisionPlatformBucket` |
| Proponente parámetros normativos | `plat.proponente_normativo` | `plat.subdere.normative` | `listNormativeParameters`, `getNormativeParameter`, `proposeNormativeParameter` |
| Aprobador parámetros normativos | `plat.aprobador_normativo` | `plat.subdere.normative` | `listNormativeParameters`, `approveNormativeParameter` (≠ proponente) |
| Operador clientes M2M | `plat.operador_m2m` | `plat.subdere.m2m` | `listApiClients`, `createApiClient`, `rotateApiClientSecret`, `revokeApiClient` |
| Operador integraciones / auditoría | `plat.operador_plataforma` | `plat.subdere.integrations` / audit | `listDmsAdapters`, `upsertPlatformIntegration`, `listAuditRecords`, `listEventSubscriptions`, `registerWebhook` |

---

## 6. Vista UI → roles (auxiliar)

No es fuente de autorización. Sirve al prototipo y a QA de pantallas.

| Pantalla / área | Rol (nombre + código) |
|---|---|
| `01-listado-expedientes` | Lectura: `adq.solicitante` / `adq.aprobador_unidad` → solo expedientes de su unidad; resto de roles Adquisiciones (DAF / `adq.lector`, etc.) → tenant completo. Operación: `listProcurementCases` |
| `11-creacion-solped` | Solicitante (`adq.solicitante`) |
| `12-visto-bueno-jefatura` | Aprobador de unidad (`adq.aprobador_unidad`) |
| `13` verificación DAF | Formulador DAF / verificación (`adq.formulador_presupuesto`) |
| `14-emision-cdp` | Firmante CDP (`adq.firmante_cdp`) |
| `15-preobligacion` | Firmante CDP (`adq.firmante_cdp`) |
| `16-solicitar-financiamiento` | Solicitante (`adq.solicitante`) |
| Modalidad 2.1 / vinculación MP (`21`, `23`) | Gestor de compra (`adq.gestor_compra`) |
| `22-aprobacion-jefatura` (modalidad) | Aprobador de modalidad (`adq.aprobador_modalidad`) |
| Resolución CA `32`–`33`, `35`–`36` | Gestor de compra (`adq.gestor_compra`) |
| `41-recepcion-conforme` | Recepcionista (`adq.recepcionista`) |
| Confirmación recepción | Confirmante de recepción (`adq.confirmante_recepcion`) |
| `51-cruce-tres-vias` / Pago 5.x | Operador de pago (`adq.operador_pago`) |
| Consola municipal `01`–`08` | Administrador municipal (`plat.admin_municipal`) |
| Consola SUBDERE parámetros | Proponente / Aprobador parámetros normativos (`plat.proponente_normativo` / `plat.aprobador_normativo`) |
| `02-roles-unidades` (ambas vistas) | Administrador municipal (`plat.admin_municipal`) |

---

## 7. SoD borrador (anticipación P-25)

Incompatibilidades **bloqueantes** ya exigidas en fichas/QA. Régimen de excepciones: ver consola `04-excepciones-sod` y **P-25**.

| # | Código A | Código B (mismo usuario, contexto aplicable) | Base |
|---|---|---|---|
| S1 | `adq.solicitante` | `adq.aprobador_unidad` | Quien solicita no aprueba (misma SOLPED / misma unidad) |
| S2 | `adq.formulador_presupuesto` | `adq.firmante_cdp` | QA 9 P1 — verificador ≠ firmante CDP |
| S3 | `adq.aprobador_unidad` o `adq.aprobador_modalidad` | `adq.confirmante_recepcion` | Quien aprueba la compra ≠ quien confirma recepción |
| S4 | `plat.proponente_normativo` | `plat.aprobador_normativo` | Doble control parámetros normativos |
| S5 | `adq.gestor_compra` (decisor 2.1) | `adq.aprobador_modalidad` | **P-38** — pendiente confirmar alcance con DM |

Los intentos que violen SoD se rechazan y se auditan (`SEGREGATION_OF_DUTIES_VIOLATION`). La consola municipal muestra el **nombre (usuarios)** homólogo (§3 / §5); el motor evalúa por **código**.

---

## 8. Preguntas abiertas para el equipo

1. ¿Un solo `adq.gestor_compra` cubre CA/CM/LP/TD, o hace falta partir por modalidad?
2. ¿`createBudgetPreCommitment` (1.6) queda en `adq.firmante_cdp` o rol aparte (`adq.preobligacion`)?
3. ¿`previewBudgetAvailability` limita líneas a la unidad del solicitante?
4. ¿Asignación masiva desde un nodo del árbol (mismo rol a N usuarios) en v1 de la consola?
5. ¿Partir `plat.admin_municipal` en roles más finos (accesos vs. integraciones vs. parámetros)?
6. ¿Roles de solo lectura distintos por departamento, o basta `adq.lector` + scope de unidad en runtime (**P-51**)?

---

## 9. Referencias

- Contrato Adquisiciones: [`modulos/adquisiciones/contracts.md`](../modulos/adquisiciones/contracts.md)
- Contrato plataforma: [`plataforma/contracts.md`](../plataforma/contracts.md)
- Fichas: `procesos-transversales/1-solped.md`, `4-recepcion-conforme.md`, `5-pago.md`; etapas 2–3 por modalidad
- Pendiente: **P-24** (este documento), **P-25** (SoD completo), **P-38**, **P-51**
