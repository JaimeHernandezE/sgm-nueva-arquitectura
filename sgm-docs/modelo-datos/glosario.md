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
| `ModalityDecision` | Decisión de Modalidad | Ratificación/selección de modalidad de compra vía gateway de validación (V1–V8) |
| `ModalityDecisionApproval` | Aprobación de Decisión de Modalidad | Aprobación de jefatura, existencia pendiente de ratificar — **[PENDIENTE P-38]** |
| `NormativeParameter` | Parámetro Normativo | Umbral legal configurable (monto Compra Ágil, Toma de Razón, tramos LP, garantías); administra SUBDERE a nivel plataforma |
| `UtmValue` | Valor UTM | Valor mensual de la Unidad Tributaria Mensual, usado para conversión CLP↔UTM |
| `QuotationResult` | Resultado de Cotización | Selección de oferta al cierre del período de cotización |
| `MpProcessSnapshot` | Bitácora de Sincronización MP | Registro de cada lectura de estado desde Mercado Público |
| `ReceiptRejectionCase` | Gestión de Recepción No Conforme | Devolución, reposición o incumplimiento sobre líneas rechazadas en la recepción |
| `GoodsReceiptLine` | Línea de Recepción | Cantidades ordenada/recibida/aceptada/rechazada por línea de OC |
| `fulfillment_status` | Estado de cumplimiento de la OC | Campo de `PurchaseOrder`, derivado del agregado de recepciones (`pending`/`partially_received`/`fully_received`) |

**Conceptos del estándar Mercado Público ↔ SGM** (`plantilla-maestra-sgm.md` §5, no son nombres de entidad):
- **Interacción MP Informativo / Gestión:** clasificación de cada sub-paso gobernado por un estado MP, según si el estado solo hace avanzar la línea de tiempo del expediente (Informativo) o exige una acción de sistema/decisión de usuario (Gestión).
- **Lectura confirmada / deseada:** una lectura de estado MP es *confirmada* si existe en la API actual de Mercado Público, o *deseada* si depende de negociación pendiente con ChileCompra.
- **Modo degradado:** forma en que un sub-paso avanza cuando depende de una lectura *deseada* que aún no existe — típicamente registro manual del usuario con menor granularidad de trazabilidad.

Ver también `glosario-siglas.md` en la raíz del repo para siglas institucionales generales (SGM, DM, JPL, etc.), no específicas del modelo de datos.
