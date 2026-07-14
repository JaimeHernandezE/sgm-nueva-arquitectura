# Wireframes — Compra Ágil (piloto)

Wireframes de **baja fidelidad** (borrador). Especifican estructura y comportamiento, no diseño visual.

Patrón transversal de la vista de expediente (filas, tintes, botones): [`../../../arquitectura/patron-vista-expediente.md`](../../../arquitectura/patron-vista-expediente.md).

| Archivo | Sub-paso | Operación principal |
|---|---|---|
| [11-creacion-solped.md](./11-creacion-solped.md) | 1.1 | `createPurchaseRequest` |
| [12-visto-bueno-jefatura.md](./12-visto-bueno-jefatura.md) | 1.2 | `approvePurchaseRequest` |
| [13-verificacion-disponibilidad.md](./13-verificacion-disponibilidad.md) | 1.3 | `verifyBudgetAvailability` |
| [16-solicitar-financiamiento.md](./16-solicitar-financiamiento.md) | 1.4 *(optativo)* | `requestBudgetFinancing` |
| [14-emision-cdp.md](./14-emision-cdp.md) | 1.5 | `issueBudgetAvailabilityCertificate`, `registerScannedBudgetAvailabilityCertificate` |
| [15-preobligacion.md](./15-preobligacion.md) | 1.6 | `createBudgetPreCommitment` |
| [21-ratificacion-modalidad.md](./21-ratificacion-modalidad.md) | 2.1 | `confirmProcurementModality` |
| [22-aprobacion-jefatura.md](./22-aprobacion-jefatura.md) | 2.2 *(condicional, ver **[PENDIENTE P-38]**)* | `approveModalityDecision`, `rejectModalityDecision` |
| [23-vinculacion-mp.md](./23-vinculacion-mp.md) | 2.3 | `linkMpProcess` |
| [31-periodo-cotizacion.md](./31-periodo-cotizacion.md) | 3.1 *(CA — sin operación, solo lectura MP)* | — |
| [32-cierre-seleccion-oferta.md](./32-cierre-seleccion-oferta.md) | 3.2 *(CA)* | `recordQuotationResult` |
| [33-emision-oc.md](./33-emision-oc.md) | 3.3 *(CA)* | `registerPurchaseOrder` |
| [34-aceptacion-oc.md](./34-aceptacion-oc.md) | 3.4 *(CA, hito crítico)* | `syncPurchaseOrderAccepted` |
| [35-rechazo-oc.md](./35-rechazo-oc.md) | 3.5 *(CA, excluyente con 3.4)* | — (reflejo de lectura MP) |
| [36-proceso-desierto-fallido.md](./36-proceso-desierto-fallido.md) | 3.6 *(CA, optativo)* | `releasePreCommitment` |
| [41-recepcion-conforme.md](./41-recepcion-conforme.md) | 4.1 | `confirmGoodsReceipt` |
| [51-cruce-tres-vias.md](./51-cruce-tres-vias.md) | 5.1 | `performThreeWayMatch` |

Contrato: [`../contracts.md`](../contracts.md)
