# Catálogo de roles (borrador P-24)

> **Estado:** borrador para discusión interna con el equipo / DM.  
> **Marco:** [`arquitectura/seguridad.md`](../arquitectura/seguridad.md) §3 · [`modelo-datos/entidades-plataforma.md`](../modelo-datos/entidades-plataforma.md)  
> **Consola:** [`wireframes/municipal/02-roles-unidades.md`](./wireframes/municipal/02-roles-unidades.md) (vistas por usuario y por módulo/proceso)

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
| `code` | Identificador estable (`adq.solicitante`). Prefijo = módulo. |
| `module` | `adquisiciones` \| `plataforma` |
| `process_area` | Nodo del árbol de proceso (vista admin “Por módulo/proceso”) |
| `name` | Etiqueta humana |
| Nodo orgánico típico | Dónde suele asignarse el `RoleAssignment` (departamento › unidad) |

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

| `code` | `name` | `process_area` | Nodo orgánico típico | Origen en fichas |
|---|---|---|---|---|
| `adq.solicitante` | Solicitante | `adq.solped` | Unidad / depto solicitante (Obras, Tránsito, …) | Rol Usuario 1.1, 1.4 |
| `adq.aprobador_unidad` | Aprobador de unidad | `adq.solped` | Misma unidad solicitante (jefatura) | Rol Aprobador 1.2 |
| `adq.formulador_presupuesto` | Formulador DAF / verificación | `adq.solped` | Finanzas › Presupuestos | Rol Usuario 1.3 |
| `adq.firmante_cdp` | Firmante CDP | `adq.solped` | Finanzas › Presupuestos | Rol Aprobador 1.5 (+ 1.6 borrador) |
| `adq.gestor_compra` | Gestor de compra | `adq.modalidad`, `adq.resolucion` | Finanzas › Abastecimiento | Rol Usuario etapas 2–3 |
| `adq.aprobador_modalidad` | Aprobador de modalidad | `adq.modalidad` | Abastecimiento / jefatura DAF | Rol Aprobador 2.2 (P-38) |
| `adq.recepcionista` | Recepcionista | `adq.recepcion` | Unidad receptora | Rol Usuario 4.1 |
| `adq.confirmante_recepcion` | Confirmante de recepción | `adq.recepcion` | Unidad receptora / control | Rol Aprobador 4.2 |
| `adq.operador_pago` | Operador de pago | `adq.pago` | Finanzas › Tesorería | Rol Aprobador 5.x |
| `adq.lector` | Lector de expediente | `adq` | Cualquier unidad con necesidad de consulta | Lectura transversal |

---

## 4. Matriz Rol → `operationId` (Adquisiciones)

Operaciones según [`modulos/adquisiciones/contracts.md`](../modulos/adquisiciones/contracts.md). Lectura compartida: quienes tienen un rol de escritura del módulo también pueden las `list*`/`get*` del expediente, salvo que se asigne solo `adq.lector`.

| Rol | Operaciones |
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

| `code` | `name` | `process_area` | Notas |
|---|---|---|---|
| `plat.admin_municipal` | Administrador municipal | `plat.municipal` | Paquete completo de consola municipal (v1 de prueba) |

**Operaciones** (`plataforma/contracts.md` §2 + §2.11):  
`listUsers`, `createUser`, `updateUser`, `revokeUser`, `getUser`, `listOrganizationalUnits`, `createOrganizationalUnit`, `updateOrganizationalUnit`, `listRoles`, `listRoleAssignments`, `createRoleAssignment`, `revokeRoleAssignment`, `listDelegations`, `createDelegation`, `revokeDelegation`, `listSodExceptions`, `createSodException`, `revokeSodException`, `listTenantParameters`, `upsertTenantParameter`, `getTenantParameter`, `listTenantIntegrations`, `upsertTenantIntegration`, `rotateIntegrationCredential`, `getTenantStorage`, `upsertTenantStorage`, `listAccessRecertificationReport`, `listAuditRecords` (scope tenant).

> Partición en roles más finos (solo accesos vs. solo integraciones) queda como pregunta al equipo (§8).

### 5.2 SUBDERE

| `code` | `name` | `process_area` | Operaciones (principales) |
|---|---|---|---|
| `plat.operador_tenants` | Operador de tenants | `plat.subdere.tenants` | `listTenants`, `getTenant`, `createTenant`, `updateTenant`, `suspendTenant`, `setEnabledModules`, `provisionPlatformBucket` |
| `plat.proponente_normativo` | Proponente parámetros normativos | `plat.subdere.normative` | `listNormativeParameters`, `getNormativeParameter`, `proposeNormativeParameter` |
| `plat.aprobador_normativo` | Aprobador parámetros normativos | `plat.subdere.normative` | `listNormativeParameters`, `approveNormativeParameter` (≠ proponente) |
| `plat.operador_m2m` | Operador clientes M2M | `plat.subdere.m2m` | `listApiClients`, `createApiClient`, `rotateApiClientSecret`, `revokeApiClient` |
| `plat.operador_plataforma` | Operador integraciones / auditoría | `plat.subdere.integrations` / audit | `listDmsAdapters`, `upsertPlatformIntegration`, `listAuditRecords`, `listEventSubscriptions`, `registerWebhook` |

---

## 6. Vista UI → roles (auxiliar)

No es fuente de autorización. Sirve al prototipo y a QA de pantallas.

| Pantalla / área | Roles que habilitan la acción principal |
|---|---|
| `11-creacion-solped` | `adq.solicitante` |
| `12-visto-bueno-jefatura` | `adq.aprobador_unidad` |
| `13` verificación DAF | `adq.formulador_presupuesto` |
| `14-emision-cdp` | `adq.firmante_cdp` |
| Modalidad 2.1 / vinculación MP | `adq.gestor_compra` |
| `22-aprobacion-jefatura` (modalidad) | `adq.aprobador_modalidad` |
| Registro recepción | `adq.recepcionista` |
| Confirmación recepción | `adq.confirmante_recepcion` |
| Pago 5.x | `adq.operador_pago` |
| Consola municipal `01`–`08` | `plat.admin_municipal` |
| Consola SUBDERE parámetros | `plat.proponente_normativo` / `plat.aprobador_normativo` |
| `02-roles-unidades` (ambas vistas) | `plat.admin_municipal` |

---

## 7. SoD borrador (anticipación P-25)

Incompatibilidades **bloqueantes** ya exigidas en fichas/QA. Régimen de excepciones: ver consola `04-excepciones-sod` y **P-25**.

| # | Rol A | Rol B (mismo usuario, contexto aplicable) | Base |
|---|---|---|---|
| S1 | `adq.solicitante` | `adq.aprobador_unidad` | Quien solicita no aprueba (misma SOLPED / misma unidad) |
| S2 | `adq.formulador_presupuesto` | `adq.firmante_cdp` | QA 9 P1 — verificador ≠ firmante CDP |
| S3 | `adq.aprobador_unidad` o `adq.aprobador_modalidad` | `adq.confirmante_recepcion` | Quien aprueba la compra ≠ quien confirma recepción |
| S4 | `plat.proponente_normativo` | `plat.aprobador_normativo` | Doble control parámetros normativos |
| S5 | `adq.gestor_compra` (decisor 2.1) | `adq.aprobador_modalidad` | **P-38** — pendiente confirmar alcance con DM |

Los intentos que violen SoD se rechazan y se auditan (`SEGREGATION_OF_DUTIES_VIOLATION`).

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
- Contrato plataforma: [`contracts.md`](./contracts.md)
- Fichas: `procesos-transversales/1-solped.md`, `4-recepcion-conforme.md`, `5-pago.md`; etapas 2–3 por modalidad
- Pendiente: **P-24** (este documento), **P-25** (SoD completo), **P-38**, **P-51**
