# Glosario del Modelo de Datos

Mapeo entre el término técnico usado en las entidades (`modelo-datos/entidades-core.md`) y el término funcional/legal usado en Chile.

| Término técnico | Término funcional (ES) | Notas |
|---|---|---|
| `ProcurementCase` | Expediente de Compra | Raíz de trazabilidad del ciclo SOLPED→Pago; folio único |
| `CaseStep` | Paso de Expediente | Instancia de cada etapa del expediente; estado, responsable y tiempos |
| `BudgetAvailabilityCertificate` | Certificado de Disponibilidad Presupuestaria (CDP) | Emitido y firmado por aprobador DAF; precede a la preobligación |
| `PurchaseRequest` | SOLPED (Solicitud de Pedido) | |
| `PurchaseRequestLine` | Línea de SOLPED | |
| `BudgetPreCommitment` | Preobligación / Pre-afectación presupuestaria | Requiere CDP vigente; se contabiliza en Contabilidad |
| `BudgetCommitment` | Compromiso Cierto / Obligación | Hito contable disparado por OC Aceptada |
| `PurchaseOrder` | Orden de Compra (OC) | |
| `GoodsReceipt` | Recepción Conforme | |
| `ThreeWayMatch` | Cruce a 3 vías / Match | OC + Recepción Conforme + Factura |
| `Accrual` | Devengado | |
| `PaymentDecree` | Decreto de Pago | |
| `Payment` | Pago / Ejecución de pago | |
| `AgileQuoteProcess` | Proceso de cotización (Compra Ágil) | Puente de trazabilidad SGM↔MP |

Ver también `glosario-siglas.md` en la raíz del repo para siglas institucionales generales (SGM, DM, JPL, etc.), no específicas del modelo de datos.
