# Manifiesto de conexiones — prototipos UI

Mapa de dependencias entre artefactos. **Leer antes de editar** cualquier pantalla, wireframe o regla de tinte.

## Grafo de artefactos

```
Ficha proceso (.md)          →  reglas de negocio, §3.5, operaciones
        ↓
Wireframe spec (.md)         →  layout, campos, acciones UI
        ↓
Prototipo HTML               →  validación UX (sgm-prototipos/)
        ↑
Expediente shell (00)        →  filas de sub-paso, formUrl, tintes
        ↑
contracts.md                 →  operaciones API que respaldan botones
entidades-core.md            →  campos de formulario
```

## Navegación del prototipo

```
index.html (landing GitHub Pages)
  → auth/clave-unica.html (simulación ClaveÚnica)
  → home.html → plataforma/shell/02-bandeja.html

Desde bandeja / sidebar Plataforma:
  → plataforma/shell/05-chats.html (listado conversaciones)
  → plataforma/subdere/* | municipal/*
  → modulos/adquisiciones/…
  → campanita global (notifications-ui.js)
  → chat contextual FAB (chat-contextual-ui.js)
```

- **Auth demo:** [`shared/auth-demo.js`](./shared/auth-demo.js) — `sessionStorage`; `initAppShell` exige sesión (salvo pantallas públicas: landing, ClaveÚnica, home).
- Sidebar derecho: módulos SGM (`shared/app-shell.js`, `shared/modules-registry.js`) — **Plataforma** (Inicio, Bandeja, **Chats**, consolas) y Adquisiciones (Inicio, Expedientes, Configuraciones).
- Topbar C6: campanita + menú de cuenta / cerrar sesión (`shared/notifications-ui.js`). Tipos UI en español (`KIND_LABELS`). Estado leído **solo en memoria** (al refrescar se restaura el seed). Datos: `demo-data/plataforma.js` (`notifications`).
- Chat contextual: FAB abajo-derecha (`shared/chat-contextual-ui.js`) — **cerrado por defecto**; contexto **opt-in**; búsqueda destinatarios por persona/departamento; sin persistencia. Listado: `shell/05-chats.html` (`chatThreads`). Spec: [`sgm-docs/plataforma/mensajeria/overview.md`](../sgm-docs/plataforma/mensajeria/overview.md).
- Perfiles de expediente: [`shared/expedientes-demo.js`](./shared/expedientes-demo.js) — **5** expedientes con detalle completo (4 modalidades + caso sin saldo `ADQ-2026-00142`). La etapa 3 es específica por modalidad.
- Datos demo por expediente: [`shared/demo-data/`](./shared/demo-data/) (`getStages(expedienteId)`).
- Datos demo core: [`shared/demo-data/plataforma.js`](./shared/demo-data/plataforma.js).
- Presets de formularios: [`shared/form-presets.js`](./shared/form-presets.js) + [`shared/form-bootstrap.js`](./shared/form-bootstrap.js).
- Manifiesto activo del shell: [`shared/steps-manifest.json`](./shared/steps-manifest.json) — pasos **transversales** (1.1–1.6, 2.1–2.3, 4.1, 5.1).
- Etapa 3 por modalidad: `steps-manifest-compra-agil.js`, `steps-manifest-convenio-marco.js`, `steps-manifest-licitacion-publica.js`, `steps-manifest-trato-directo.js` (fusionados en `getStepFormUrl`).
- **Panel de simulación** ([`shared/roles.js`](./shared/roles.js) + `initStepSimulation` en `form-shell.js`): dos selects por expediente — «Ver como rol» (10 códigos `adq.*` del catálogo P-24) y «Situar en sub-paso». Sin selección, la vista se mantiene en su estado actual. Con rol: la acción del paso activo solo queda habilitada si el rol coincide con el responsable (`responsible.role` → `ROLE_TEXT_TO_CODES`); si no, se ve **Pendiente**. Con sub-paso: los anteriores se asumen aprobados y los siguientes quedan pendientes. La selección viaja por query string (`?rol=…&paso=…`) entre el expediente y las pantallas de sub-paso (donde el select de paso navega a la pantalla elegida).

## Checklist obligatoria

Antes de modificar un sub-paso `N.M`:

1. Leer la entrada en [`shared/steps-manifest.json`](./shared/steps-manifest.json) (`stepId`: `"N.M"`).
2. Abrir el **wireframe spec** (`wireframeSpec` en el manifiesto).
3. Abrir la **ficha de proceso** (`processFicha`).
4. Verificar **operaciones** en `contracts.md` — ningún botón sin operación.
5. Verificar **campos** en `entidades-core.md`.
6. Verificar **obligatoriedad explícita** en los tres niveles: `entidades-core.md` (obligatorio / opcional / obligatorio si), tabla **Obligatorio** del wireframe spec, y etiqueta del HTML (`*`, `(opcional)` o `(obligatorio si …)`).
7. Verificar **secciones tituladas** del formulario (`.form-section` / subtítulos) según [`patron-formularios-secciones.md`](../sgm-docs/arquitectura/instrucciones/patron-formularios-secciones.md) — wireframe ASCII y HTML con los mismos títulos.
8. Si cambia tinte/origen: revisar reglas 2a/2b en [`patron-vista-expediente.md`](../sgm-docs/arquitectura/instrucciones/patron-vista-expediente.md).
9. Actualizar **prototipo HTML**, **expediente** (`shared/demo-data/<modalidad>.js`) y **preset** (`form-presets.js`) en el mismo cambio.
10. CTAs de escritura: `demoValidation(operationId)` desde [`form-shell.js`](./shared/form-shell.js) cuando el `operationId` exista en el catálogo [`shared/validation-demos.js`](./shared/validation-demos.js); `demoAction` solo para ops fuera de catálogo, deep-links o stubs de lectura.

## Etapa 1 — SOLPED (transversal, 4 modalidades)

| stepId | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| 1.0 | `sgm-docs/.../wireframes/10-verificacion-previa.md` | `procesos-transversales/10-verificacion-previa.html` | `checkStockAvailability`, `checkCatalogAvailability` *(optativo; omitible)* |
| 1.1 | `sgm-docs/.../wireframes/11-creacion-solped.md` | `procesos-transversales/11-creacion-solped.html` | `createPurchaseRequest`, `submitPurchaseRequest`, `previewBudgetAvailability` — `demoValidation` / catálogo [`validation-demos.js`](./shared/validation-demos.js) |
| 1.2 | `12-visto-bueno-jefatura.md` | `12-visto-bueno-jefatura.html` | `approvePurchaseRequest`, `rejectPurchaseRequest` |
| 1.3 | `13-verificacion-disponibilidad.md` | `13-verificacion-disponibilidad.html` | `verifyBudgetAvailability` |
| 1.4 | `16-solicitar-financiamiento.md` | `16-solicitar-financiamiento.html` | `requestBudgetFinancing` |
| 1.5 | `14-emision-cdp.md` | `14-emision-cdp.html` | `issueBudgetAvailabilityCertificate`, `registerScannedBudgetAvailabilityCertificate` |
| 1.6 | `15-preobligacion.md` | `15-preobligacion.html` | `createBudgetPreCommitment` |

Ficha transversal: [`sgm-docs/modulos/adquisiciones/procesos-transversales/1-solped.md`](../sgm-docs/modulos/adquisiciones/procesos-transversales/1-solped.md)

## Etapa 2 — Modalidad de Compra (transversal a las 4 modalidades)

| stepId | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| 2.1 | `21-ratificacion-modalidad.md` | `procesos-transversales/21-ratificacion-modalidad.html` | `confirmProcurementModality` (dependencias: `getUtmValue`, `checkCatalogAvailability`) |
| 2.2 | `22-aprobacion-jefatura.md` | `procesos-transversales/22-aprobacion-jefatura.html` | `approveModalityDecision`, `rejectModalityDecision` — condicional a `ModalityDecision.requires_jefatura_approval` (marcado en 2.1); existencia formal pendiente de ratificar con la DM (**[PENDIENTE P-38]**) |
| 2.3 | `23-vinculacion-mp.md` | `procesos-transversales/23-vinculacion-mp.html` | `linkMpProcess` (dependencia: `readMpProcess`) |

Ficha transversal: [`sgm-docs/modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md`](../sgm-docs/modulos/adquisiciones/procesos-transversales/2-modalidad-compra.md)

Navegación entre 2.1→2.2/2.3 y 2.2→2.3 es condicional: 2.1 captura `requires_jefatura_approval` y enruta a 2.2 (si verdadero) o directo a 2.3 (si falso); 2.2 aprobado enruta a 2.3, rechazado vuelve a 2.1.

## Etapa 3 — Resolución de Compra (por modalidad)

Enlazada desde el shell del expediente vía manifiestos de modalidad (`form-shell.js` resuelve `stepId` 3.x según `?expediente=`). Todos los sub-pasos documentados se listan en los 4 ejemplos (caminos alternativos/condicionales incluyen botón «Ver…» para explorar). Demos de validación API (422): catálogo en [`shared/validation-demos.js`](./shared/validation-demos.js); CTAs de escritura usan `demoValidation(operationId)`.

| Modalidad | Ficha etapa 3 | Manifiesto | Carpeta HTML |
|---|---|---|---|
| Compra Ágil | [`1. compra-agil/3-resolucion-compra.md`](../sgm-docs/modulos/adquisiciones/1.%20compra-agil/3-resolucion-compra.md) | `steps-manifest-compra-agil.js` | `1-compra-agil/` (6 sub-pasos) |
| Convenio Marco | [`2. convenio-marco/3-resolucion-compra-convenio-marco v2.md`](../sgm-docs/modulos/adquisiciones/2.%20convenio-marco/3-resolucion-compra-convenio-marco%20v2.md) | `steps-manifest-convenio-marco.js` | `2-convenio-marco/` (8 sub-pasos) |
| Licitación Pública | [`3. licitacion-publica/3-resolucion-compra.md`](../sgm-docs/modulos/adquisiciones/3.%20licitacion-publica/3-resolucion-compra.md) | `steps-manifest-licitacion-publica.js` | `3-licitacion-publica/` (14 sub-pasos) |
| Trato Directo | [`4. trato-directo/3-resolucion-compra.md`](../sgm-docs/modulos/adquisiciones/4.%20trato-directo/3-resolucion-compra.md) | `steps-manifest-trato-directo.js` | `4-trato-directo/` (4 sub-pasos) |

### Compra Ágil

| stepId | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| 3.1 | `31-periodo-cotizacion.md` | `1-compra-agil/31-periodo-cotizacion.html` | — (sin operación, solo lectura MP) |
| 3.2 | `32-cierre-seleccion-oferta.md` | `1-compra-agil/32-cierre-seleccion-oferta.html` | — (sync MP; deep link) |
| 3.3 | `33-emision-oc.md` | `1-compra-agil/33-emision-oc.html` | — (sync MP; deep link) |
| 3.4 | `34-aceptacion-oc.md` | `1-compra-agil/34-aceptacion-oc.html` | `syncPurchaseOrderAccepted` (hito crítico) |
| 3.5 | `35-rechazo-oc.md` | `1-compra-agil/35-rechazo-oc.html` | — (excluyente con 3.4; camino alternativo) |
| 3.6 | `36-proceso-desierto-fallido.md` | `1-compra-agil/36-proceso-desierto-fallido.html` | `releasePreCommitment` (camino alternativo) |

Navegación condicional: 3.2→3.3→3.4 (camino feliz); 3.5 y 3.6 se listan en el expediente demo como caminos explorables.

### Licitación Pública

| stepId | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| 3.1 | `licitacion-publica/31-elaboracion-bases.md` | `3-licitacion-publica/31-elaboracion-bases.html` | `createTenderBases`, `submitBasesForLegalReview` |
| 3.2 | `licitacion-publica/32-revision-juridica-bases.md` | `3-licitacion-publica/32-revision-juridica-bases.html` | `recordLegalReview` |
| 3.3 | `licitacion-publica/33-acto-aprueba-bases.md` | `3-licitacion-publica/33-acto-aprueba-bases.html` | `approveTenderBases` |
| 3.4 | `licitacion-publica/34-toma-razon-bases.md` | `3-licitacion-publica/34-toma-razon-bases.html` | `submitToComptroller`, `recordComptrollerOutcome` (condicional) |
| 3.5 | `licitacion-publica/35-publicacion-vinculacion-mp.md` | `3-licitacion-publica/35-publicacion-vinculacion-mp.html` | `linkMpProcess` (reutiliza 2.3) |
| 3.6 | `licitacion-publica/36-foro-aclaraciones.md` | `3-licitacion-publica/36-foro-aclaraciones.html` | `recordClarification` |
| 3.7 | `licitacion-publica/37-garantia-seriedad.md` | `3-licitacion-publica/37-garantia-seriedad.html` | `registerGuaranteeCustody` (condicional) |
| 3.8 | `licitacion-publica/38-apertura-electronica.md` | `3-licitacion-publica/38-apertura-electronica.html` | — (sin operación, solo lectura MP) |
| 3.9 | `licitacion-publica/39-comision-evaluadora.md` | `3-licitacion-publica/39-comision-evaluadora.html` | `designateEvaluationCommittee`, `recordOfferAdmissibility`, `recordEvaluationScores`, `signEvaluationReport` (condicional sobre umbral) |
| 3.10 | `licitacion-publica/310-resolucion-adjudicacion.md` | `3-licitacion-publica/310-resolucion-adjudicacion.html` | `issueAwardResolution` |
| 3.11 | `licitacion-publica/311-toma-razon-adjudicacion.md` | `3-licitacion-publica/311-toma-razon-adjudicacion.html` | `submitToComptroller`, `recordComptrollerOutcome` (reutiliza 3.4) |
| 3.12 | `licitacion-publica/312-garantia-fiel-cumplimiento.md` | `3-licitacion-publica/312-garantia-fiel-cumplimiento.html` | `registerGuaranteeCustody` (reutiliza 3.7) |
| 3.13 | `licitacion-publica/313-contrato.md` | `3-licitacion-publica/313-contrato.html` | `draftContract`, `signContract` (condicional) |
| 3.14 | `licitacion-publica/314-aceptacion-oc.md` | `3-licitacion-publica/314-aceptacion-oc.html` | `syncPurchaseOrderAccepted` (hito contable) |

Navegación condicional: camino feliz 3.1→3.2→3.3→(3.4 si sobre umbral)→3.5→3.6→(3.7 si bases lo exigen)→3.8→3.9→3.10→(3.11 si sobre umbral)→(3.12 si bases lo exigen)→3.13→3.14. Ramas de retorno: 3.2 con observaciones → 3.1; 3.4/3.11 representación → 3.1/3.10; 3.13 no suscripción en plazo → 3.10 (readjudicación). Probado end-to-end con Playwright (camino feliz completo + las 3 ramas de retorno).

### Convenio Marco / Trato Directo

Prototipos HTML + wireframes `.md` en `wireframes/convenio-marco/` (8/8) y `wireframes/trato-directo/` (4/4). Ver `processFicha` / `wireframeMd` / `prototypeHtml` en los respectivos `steps-manifest-*.js`.

Etapa 4 (Recepción Conforme, transversal) tiene prototipo HTML para 4.1; el flujo post-aceptación de OC enlaza al expediente o a 4.1 según estado demo.

## Etapa 4 — Recepción Conforme (transversal)

| stepId | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| 4.1 | `41-recepcion-conforme.md` | `procesos-transversales/41-recepcion-conforme.html` | `createGoodsReceipt`, `confirmGoodsReceipt` |

Ficha transversal: [`sgm-docs/modulos/adquisiciones/procesos-transversales/4-recepcion-conforme.md`](../sgm-docs/modulos/adquisiciones/procesos-transversales/4-recepcion-conforme.md)

## Etapa 5 — Pago (transversal)

| stepId | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| 5.1 | `51-cruce-tres-vias.md` | `procesos-transversales/51-cruce-tres-vias.html` | `performThreeWayMatch`, `getInvoiceForMatch` |

Ficha transversal: [`sgm-docs/modulos/adquisiciones/procesos-transversales/5-pago.md`](../sgm-docs/modulos/adquisiciones/procesos-transversales/5-pago.md)

Shell expediente: [`modulos/adquisiciones/00-expediente/index.html`](./modulos/adquisiciones/00-expediente/index.html)

Listado: [`modulos/adquisiciones/01-listado-expedientes.html`](./modulos/adquisiciones/01-listado-expedientes.html)

## Plataforma — consolas del core

Overview docs: [`sgm-docs/plataforma/overview.md`](../sgm-docs/plataforma/overview.md)  
Wireframes: [`sgm-docs/plataforma/wireframes/`](../sgm-docs/plataforma/wireframes/README.md)  
Hub prototipo: [`plataforma/index.html`](./plataforma/index.html)

No usa expediente ni `?expediente=`. Breadcrumb: Plataforma › Consola › Pantalla. Acciones vía `demoAction(operationId)`.

### Consola SUBDERE

| Pantalla | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| Tenants | `subdere/01-gestion-tenants.md` | `plataforma/subdere/01-gestion-tenants.html` | `listTenants`, `getTenant`, `createTenant`, `updateTenant`, `suspendTenant`, `setEnabledModules` |
| Parámetros normativos | `02-parametros-normativos.md` | `02-parametros-normativos.html` | `proposeNormativeParameter`, `approveNormativeParameter` |
| Clientes M2M | `03-clientes-m2m.md` | `03-clientes-m2m.html` | `createApiClient`, `revokeApiClient`, `rotateApiClientSecret` |
| Integraciones plataforma | `04-integraciones-plataforma.md` | `04-integraciones-plataforma.html` | `upsertPlatformIntegration`, `listDmsAdapters` |
| Provisión storage | `05-provision-almacenamiento.md` | `05-provision-almacenamiento.html` | `provisionPlatformBucket` |
| Monitoreo | `06-monitoreo-tenant.md` | `06-monitoreo-tenant.html` | — (empty state P-08) |
| Auditoría | `07-auditoria-plataforma.md` | `07-auditoria-plataforma.html` | `listAuditRecords` |

### Consola municipal

| Pantalla | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| Usuarios | `municipal/01-usuarios.md` | `plataforma/municipal/01-usuarios.html` | `listUsers`, `createUser`, `updateUser`, `revokeUser` |
| Roles y unidades | `02-roles-unidades.md` | `02-roles-unidades.html` | `createRoleAssignment`, CRUD unidades |
| Subrogancias | `03-subrogancias.md` | `03-subrogancias.html` | CRUD `Delegation` |
| Excepciones SoD | `04-excepciones-sod.md` | `04-excepciones-sod.html` | CRUD `SodException` |
| Parámetros operativos | `05-parametros-operativos.md` | `05-parametros-operativos.html` | `listTenantParameters`, `upsertTenantParameter` |
| Integraciones municipio | `06-integraciones-municipio.md` | `06-integraciones-municipio.html` | `upsertTenantIntegration`, `rotateIntegrationCredential` |
| Almacenamiento | `07-almacenamiento-documentos.md` | `07-almacenamiento-documentos.html` | `upsertTenantStorage`, `getTenantStorage` |
| Recertificación | `08-recertificacion-accesos.md` | `08-recertificacion-accesos.html` | `listAccessRecertificationReport` |
| Preferencias de notificación | `09-preferencias-notificacion.md` | `09-preferencias-notificacion.html` | `getNotificationPreferences`, `upsertNotificationPreferences` |

### Shell — cuenta y notificaciones (C6)

Campanita global montada por `initAppShell` → `notifications-ui.js` (todas las pantallas). Visión: [`sgm-docs/plataforma/notificaciones/overview.md`](../sgm-docs/plataforma/notificaciones/overview.md). Menú de cuenta: Mis datos, Preferencias, Bandeja.

| Pantalla | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| Campanita (dropdown) | `shell/01-campanita.md` | (chrome en `shared/notifications-ui.js`) | `listNotifications`, `markNotificationRead` |
| Bandeja | `shell/02-bandeja.md` | `plataforma/shell/02-bandeja.html` | `listNotifications`, `getNotification`, `markNotificationRead`, `markAllNotificationsRead` |
| Mis datos | `shell/03-mis-datos.md` | `plataforma/shell/03-mis-datos.html` | `getCurrentUser`, `requestProfileChange` |
| Chat contextual | `shell/04-chat-contextual.md` | chrome en `shared/chat-contextual-ui.js` | Demo mensajería — [`mensajeria/overview.md`](../sgm-docs/plataforma/mensajeria/overview.md) |
| Chats (listado) | `shell/05-chats.md` | `plataforma/shell/05-chats.html` | Conversaciones demo; deep link si hay contexto |

## Configuraciones de módulo (Adquisiciones)

Pantallas fuera del flujo de expediente (no viven en `steps-manifest`). Nav: `adquisicionesNav` → Configuraciones.

| Pantalla | Wireframe | Prototipo | Operación |
|---|---|---|---|
| Hub módulo | `wireframes/00-hub-modulo.md` | `modulos/adquisiciones/index.html` | — |
| Configuraciones | `90-configuraciones.md` | `configuraciones/index.html` | — |
| Firmas (lista) | `91-config-firmas-lista.md` | `configuraciones/91-firmas.html` | — |
| Editor anclas CDP | `92-config-firmas-editor-anclas.md` | `configuraciones/92-editor-anclas.html` | `configureDocumentTemplate` |

Catálogo: [`sgm-docs/modulos/adquisiciones/catalogo-documentos-firmables.md`](../sgm-docs/modulos/adquisiciones/catalogo-documentos-firmables.md) · patrón: [`patron-edicion-anclas-firma.md`](../sgm-docs/arquitectura/instrucciones/patron-edicion-anclas-firma.md).

## Reglas de tinte (resumen)

- **Azul:** plataforma externa (MP, FirmaGob…) — prioridad sobre rojizo.
- **Rojizo:** borde §3.5 hacia otro módulo SGM (Presupuestos, Contabilidad, Tesorería).
- Chip: `{Módulo|Plataforma} · {modo}`.
