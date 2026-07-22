# Wireframes — Adquisiciones

Wireframes de **baja fidelidad** (borrador). Especifican estructura y comportamiento, no diseño visual.

Patrón transversal de la vista de expediente (filas, tintes, botones): [`../../../arquitectura/instrucciones/patron-vista-expediente.md`](../../../arquitectura/instrucciones/patron-vista-expediente.md).

Patrón de secciones y subtítulos en formularios: [`../../../arquitectura/instrucciones/patron-formularios-secciones.md`](../../../arquitectura/instrucciones/patron-formularios-secciones.md) — el layout ASCII debe mostrar títulos de sección alineados con el prototipo HTML.

Patrón de anclas en plantillas firmables: [`../../../arquitectura/instrucciones/patron-edicion-anclas-firma.md`](../../../arquitectura/instrucciones/patron-edicion-anclas-firma.md).

**Convención de carpetas:** las etapas 1, 2, 4 y 5 son transversales a las 4 modalidades y viven planas en esta carpeta (un solo archivo por sub-paso, sin prefijo de modalidad). La etapa 3 (Resolución de Compra) es específica por modalidad — subcarpetas `convenio-marco/`, `licitacion-publica/`, `trato-directo/`. Los wireframes `31-*`…`36-*` de esta carpeta raíz son específicos de **Compra Ágil**.

## Transversales (etapas 1, 2, 4, 5)

| Archivo | Sub-paso | Operación principal |
|---|---|---|
| [00-hub-modulo.md](./00-hub-modulo.md) | Hub módulo | — (navegación) |
| [01-listado-expedientes.md](./01-listado-expedientes.md) | 0.1 | `listProcurementCases` |
| [10-verificacion-previa.md](./10-verificacion-previa.md) | 1.0 *(optativo)* | `checkStockAvailability`, `checkCatalogAvailability` |
| [11-creacion-solped.md](./11-creacion-solped.md) | 1.1 | `createPurchaseRequest` |
| [12-visto-bueno-jefatura.md](./12-visto-bueno-jefatura.md) | 1.2 | `approvePurchaseRequest` |
| [13-verificacion-disponibilidad.md](./13-verificacion-disponibilidad.md) | 1.3 | `verifyBudgetAvailability` |
| [16-solicitar-financiamiento.md](./16-solicitar-financiamiento.md) | 1.4 *(optativo)* | `requestBudgetFinancing` |
| [14-emision-cdp.md](./14-emision-cdp.md) | 1.5 | `issueBudgetAvailabilityCertificate`, `registerScannedBudgetAvailabilityCertificate` |
| [15-preobligacion.md](./15-preobligacion.md) | 1.6 | `createBudgetPreCommitment` |
| [21-ratificacion-modalidad.md](./21-ratificacion-modalidad.md) | 2.1 | `confirmProcurementModality` |
| [22-aprobacion-jefatura.md](./22-aprobacion-jefatura.md) | 2.2 *(condicional, ver **[PENDIENTE P-38]**)* | `approveModalityDecision`, `rejectModalityDecision` |
| [23-vinculacion-mp.md](./23-vinculacion-mp.md) | 2.3 | `linkMpProcess` |
| [41-recepcion-conforme.md](./41-recepcion-conforme.md) | 4.1 | `confirmGoodsReceipt` |
| [51-cruce-tres-vias.md](./51-cruce-tres-vias.md) | 5.1 | `performThreeWayMatch` |
| [90-configuraciones.md](./90-configuraciones.md) | Config | — (navegación) |
| [91-config-firmas-lista.md](./91-config-firmas-lista.md) | Config › Firmas | — (lista catálogo) |
| [92-config-firmas-editor-anclas.md](./92-config-firmas-editor-anclas.md) | Config › Firmas › CDP | `configureDocumentTemplate` |

## Etapa 3 — Compra Ágil

| Archivo | Sub-paso | Operación principal |
|---|---|---|
| [31-periodo-cotizacion.md](./31-periodo-cotizacion.md) | 3.1 *(CA — sin operación, solo lectura MP)* | — |
| [32-cierre-seleccion-oferta.md](./32-cierre-seleccion-oferta.md) | 3.2 *(CA)* | — *(sync MP)* |
| [33-emision-oc.md](./33-emision-oc.md) | 3.3 *(CA)* | — *(sync MP)* |
| [34-aceptacion-oc.md](./34-aceptacion-oc.md) | 3.4 *(CA, hito crítico)* | `syncPurchaseOrderAccepted` |
| [35-rechazo-oc.md](./35-rechazo-oc.md) | 3.5 *(CA, excluyente con 3.4)* | — (reflejo de lectura MP) |
| [36-proceso-desierto-fallido.md](./36-proceso-desierto-fallido.md) | 3.6 *(CA, optativo)* | `releasePreCommitment` |

## Etapa 3 — Licitación Pública

Vinculación MP diferida a 3.5 (reutiliza `linkMpProcess` de 2.3) — ver `2-modalidad-compra.md` §2.3 ↔ `3. licitacion-publica/3-resolucion-compra.md`.

| Archivo | Sub-paso | Operación principal |
|---|---|---|
| [licitacion-publica/31-elaboracion-bases.md](./licitacion-publica/31-elaboracion-bases.md) | 3.1 | `createTenderBases`, `submitBasesForLegalReview` |
| [licitacion-publica/32-revision-juridica-bases.md](./licitacion-publica/32-revision-juridica-bases.md) | 3.2 | `recordLegalReview` |
| [licitacion-publica/33-acto-aprueba-bases.md](./licitacion-publica/33-acto-aprueba-bases.md) | 3.3 | `approveTenderBases` |
| [licitacion-publica/34-toma-razon-bases.md](./licitacion-publica/34-toma-razon-bases.md) | 3.4 *(condicional)* | `submitToComptroller`, `recordComptrollerOutcome` |
| [licitacion-publica/35-publicacion-vinculacion-mp.md](./licitacion-publica/35-publicacion-vinculacion-mp.md) | 3.5 | `linkMpProcess` *(reutiliza 2.3)* |
| [licitacion-publica/36-foro-aclaraciones.md](./licitacion-publica/36-foro-aclaraciones.md) | 3.6 | `recordClarification` |
| [licitacion-publica/37-garantia-seriedad.md](./licitacion-publica/37-garantia-seriedad.md) | 3.7 *(condicional)* | `registerGuaranteeCustody` |
| [licitacion-publica/38-apertura-electronica.md](./licitacion-publica/38-apertura-electronica.md) | 3.8 | — (reflejo de lectura MP) |
| [licitacion-publica/39-comision-evaluadora.md](./licitacion-publica/39-comision-evaluadora.md) | 3.9 *(condicional sobre umbral)* | `designateEvaluationCommittee`, `recordOfferAdmissibility`, `recordEvaluationScores`, `signEvaluationReport` |
| [licitacion-publica/310-resolucion-adjudicacion.md](./licitacion-publica/310-resolucion-adjudicacion.md) | 3.10 | `issueAwardResolution` |
| [licitacion-publica/311-toma-razon-adjudicacion.md](./licitacion-publica/311-toma-razon-adjudicacion.md) | 3.11 *(condicional)* | `submitToComptroller`, `recordComptrollerOutcome` *(reutiliza 3.4)* |
| [licitacion-publica/312-garantia-fiel-cumplimiento.md](./licitacion-publica/312-garantia-fiel-cumplimiento.md) | 3.12 *(condicional)* | `registerGuaranteeCustody` *(reutiliza 3.7)* |
| [licitacion-publica/313-contrato.md](./licitacion-publica/313-contrato.md) | 3.13 *(condicional)* | `draftContract`, `signContract` |
| [licitacion-publica/314-aceptacion-oc.md](./licitacion-publica/314-aceptacion-oc.md) | 3.14 *(hito contable)* | `syncPurchaseOrderAccepted` *(misma operación que CA 3.4)* |

## Etapa 3 — Convenio Marco

| Archivo | Sub-paso | Operación principal |
|---|---|---|
| [convenio-marco/31-evaluacion-umbral.md](./convenio-marco/31-evaluacion-umbral.md) | 3.1 | `getUtmValue` (compuerta) |
| [convenio-marco/32-compra-directa-catalogo.md](./convenio-marco/32-compra-directa-catalogo.md) | 3.2 | `linkMpProcess` |
| [convenio-marco/33-intencion-gran-compra.md](./convenio-marco/33-intencion-gran-compra.md) | 3.3 | `linkMpProcess` |
| [convenio-marco/34-periodo-competencia.md](./convenio-marco/34-periodo-competencia.md) | 3.4 | — (sync MP) |
| [convenio-marco/35-seleccion-oferta.md](./convenio-marco/35-seleccion-oferta.md) | 3.5 | — (sync MP) |
| [convenio-marco/36-gran-compra-desierta.md](./convenio-marco/36-gran-compra-desierta.md) | 3.6 | — (transición) |
| [convenio-marco/37-aceptacion-oc.md](./convenio-marco/37-aceptacion-oc.md) | 3.7 | `syncPurchaseOrderAccepted` |
| [convenio-marco/38-rechazo-oc.md](./convenio-marco/38-rechazo-oc.md) | 3.8 | `recordPurchaseOrderRejectionDecision` |

## Etapa 3 — Trato Directo

Vinculación MP diferida a 3.2 — ver `2-modalidad-compra.md` §2.3 ↔ `4. trato-directo/3-resolucion-compra.md`.

| Archivo | Sub-paso | Operación principal |
|---|---|---|
| [trato-directo/31-toma-razon.md](./trato-directo/31-toma-razon.md) | 3.1 *(condicional)* | `submitToComptroller`, `recordComptrollerOutcome` |
| [trato-directo/32-publicacion-vinculacion-mp.md](./trato-directo/32-publicacion-vinculacion-mp.md) | 3.2 | `linkMpProcess` *(reutiliza 2.3)* |
| [trato-directo/33-emision-aceptacion-oc.md](./trato-directo/33-emision-aceptacion-oc.md) | 3.3 *(hito contable)* | `syncPurchaseOrderAccepted` |
| [trato-directo/34-rechazo-oc.md](./trato-directo/34-rechazo-oc.md) | 3.4 *(excluyente)* | `recordPurchaseOrderRejectionDecision` |

Contrato: [`../contracts.md`](../contracts.md)
Catálogo documentos firmables: [`../catalogo-documentos-firmables.md`](../catalogo-documentos-firmables.md)
