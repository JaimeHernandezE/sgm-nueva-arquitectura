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
6. Si cambia tinte/origen: revisar reglas 2a/2b en [`01-vista-expediente-detalle-ca.md`](../sgm-docs/modulos/adquisiciones/01-vista-expediente-detalle-ca.md).
7. Actualizar **prototipo HTML** y **expediente** (`demo-data.js` / fila del paso) en el mismo cambio.

## Etapa 1 — SOLPED (piloto Compra Ágil)

| stepId | Wireframe | Prototipo | Operaciones principales |
|---|---|---|---|
| 1.1 | `sgm-docs/.../wireframes/11-creacion-solped.md` | `1-compra-agil/11-creacion-solped.html` | `createPurchaseRequest`, `submitPurchaseRequest`, `previewBudgetAvailability` |
| 1.2 | `12-visto-bueno-jefatura.md` | `12-visto-bueno-jefatura.html` | `approvePurchaseRequest`, `rejectPurchaseRequest` |
| 1.3 | `13-verificacion-disponibilidad.md` | `13-verificacion-disponibilidad.html` | `verifyBudgetAvailability` |
| 1.4 | `16-solicitar-financiamiento.md` | `16-solicitar-financiamiento.html` | `requestBudgetFinancing` |
| 1.5 | `14-emision-cdp.md` | `14-emision-cdp.html` | `issueBudgetAvailabilityCertificate`, `registerScannedBudgetAvailabilityCertificate` |
| 1.6 | `15-preobligacion.md` | `15-preobligacion.html` | `createBudgetPreCommitment` |

Ficha transversal: [`sgm-docs/modulos/adquisiciones/procesos-transversales/1-solped.md`](../sgm-docs/modulos/adquisiciones/procesos-transversales/1-solped.md)

Shell expediente: [`modulos/adquisiciones/00-expediente/index.html`](./modulos/adquisiciones/00-expediente/index.html)

Listado: [`modulos/adquisiciones/01-listado-expedientes.html`](./modulos/adquisiciones/01-listado-expedientes.html)

## Reglas de tinte (resumen)

- **Azul:** plataforma externa (MP, FirmaGob…) — prioridad sobre rojizo.
- **Rojizo:** borde §3.5 hacia otro módulo SGM (Presupuestos, Contabilidad, Tesorería).
- Chip: `{Módulo|Plataforma} · {modo}`.
