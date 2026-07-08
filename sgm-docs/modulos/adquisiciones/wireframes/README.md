# Wireframes — Compra Ágil (piloto)

Wireframes de **baja fidelidad** (borrador). Especifican estructura y comportamiento, no diseño visual.

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
| [41-recepcion-conforme.md](./41-recepcion-conforme.md) | 4.1 | `confirmGoodsReceipt` |
| [51-cruce-tres-vias.md](./51-cruce-tres-vias.md) | 5.1 | `performThreeWayMatch` |

Contrato: [`../../contracts.md`](../../contracts.md)
