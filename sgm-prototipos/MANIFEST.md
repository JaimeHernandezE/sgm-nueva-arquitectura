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
index.html → modulos/adquisiciones/index.html (bienvenida)
           → 01-listado-expedientes.html
           → 00-expediente/index.html?expediente=<id>
```

- Sidebar derecho: módulos SGM (`shared/app-shell.js`, `shared/modules-registry.js`).
- Perfiles de expediente: [`shared/expedientes-demo.js`](./shared/expedientes-demo.js) — solo Compra Ágil (`ADQ-2026-00123`) tiene detalle completo de etapas.

## Checklist obligatoria

Antes de modificar un sub-paso `N.M`:

1. Leer la entrada en [`shared/steps-manifest.json`](./shared/steps-manifest.json) (`stepId`: `"N.M"`).
2. Abrir el **wireframe spec** (`wireframeSpec` en el manifiesto).
3. Abrir la **ficha de proceso** (`processFicha`).
4. Verificar **operaciones** en `contracts.md` — ningún botón sin operación.
5. Verificar **campos** en `entidades-core.md`.
6. Verificar **obligatoriedad explícita** en los tres niveles: `entidades-core.md` (obligatorio / opcional / obligatorio si), tabla **Obligatorio** del wireframe spec, y etiqueta del HTML (`*`, `(opcional)` o `(obligatorio si …)`).
7. Si cambia tinte/origen: revisar reglas 2a/2b en [`01-vista-expediente-detalle-ca.md`](../sgm-docs/modulos/adquisiciones/01-vista-expediente-detalle-ca.md).
8. Actualizar **prototipo HTML** y **expediente** (`demo-data.js` / fila del paso) en el mismo cambio.

## Etapa 1 — SOLPED (piloto Compra Ágil)

| stepId | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| 1.1 | `sgm-docs/.../wireframes/11-creacion-solped.md` | `procesos-transversales/11-creacion-solped.html` | `createPurchaseRequest`, `submitPurchaseRequest`, `previewBudgetAvailability` |
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

## Etapa 3 — Resolución de Compra (específica de Compra Ágil)

| stepId | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| 3.1 | `31-periodo-cotizacion.md` | `1-compra-agil/31-periodo-cotizacion.html` | — (sin operación, solo lectura MP) |
| 3.2 | `32-cierre-seleccion-oferta.md` | `1-compra-agil/32-cierre-seleccion-oferta.html` | `recordQuotationResult` |
| 3.3 | `33-emision-oc.md` | `1-compra-agil/33-emision-oc.html` | `registerPurchaseOrder` |
| 3.4 | `34-aceptacion-oc.md` | `1-compra-agil/34-aceptacion-oc.html` | `syncPurchaseOrderAccepted` (hito crítico) |
| 3.5 | `35-rechazo-oc.md` | `1-compra-agil/35-rechazo-oc.html` | — (reflejo de lectura MP, excluyente con 3.4) |
| 3.6 | `36-proceso-desierto-fallido.md` | `1-compra-agil/36-proceso-desierto-fallido.html` | `releasePreCommitment` (optativo, camino alternativo) |

Ficha específica: [`sgm-docs/modulos/adquisiciones/1. compra-agil/3-resolucion-compra.md`](<../sgm-docs/modulos/adquisiciones/1. compra-agil/3-resolucion-compra.md>)

Navegación condicional: 3.2→3.3→3.4 (camino feliz); 3.3 inhábil → vuelve a 3.2 o va a 3.6; 3.4 rechazada → 3.5 → segunda oferta (3.2) o re-vinculación (2.3); 3.6 → republicar (2.3), reevaluar (bloqueado, **[PENDIENTE P-34]**) o cancelar (vuelve al expediente). 3.5 y 3.6 no aparecen en la fila del expediente demo salvo que ocurran — son caminos alternativos, no el flujo principal.

Etapa 4 (Recepción Conforme, transversal) tiene prototipo HTML para 4.1; el flujo de 3.4 puede enlazar al expediente o a 4.1 según estado demo.

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

## Reglas de tinte (resumen)

- **Azul:** plataforma externa (MP, FirmaGob…) — prioridad sobre rojizo.
- **Rojizo:** borde §3.5 hacia otro módulo SGM (Presupuestos, Contabilidad, Tesorería).
- Chip: `{Módulo|Plataforma} · {modo}`.
