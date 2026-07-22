# Matriz evento → canal → destinatario (borrador P-06)

Borrador derivable de fichas y [`modulos/adquisiciones/contracts.md`](../../modulos/adquisiciones/contracts.md) §4. **Estado:** borrador — cierra **[P-06]** tras validación con DM / roles ([`catalogo-roles.md`](../../arquitectura/especificacion/catalogo-roles.md)).

Visión de producto: [`overview.md`](./overview.md).

**Convenciones**

| Columna | Valores |
|---|---|
| `kind` | `action_required` · `info` · `deadline` · `escalation` |
| Canales v1 | `inbox` (bandeja+campanita) · `email` · `docdigital` (solo si el hecho es notificación formal) |
| Destinatario | `code` de rol + scope de unidad del expediente / asignación |
| Subrogancia | Si hay `Delegation` activa sobre el rol, entregar también (o en su lugar según política) al subrogante |

`email` obligatorio = política municipal / no opt-out. `email` según preferencia = respeta `NotificationPreference`.

---

## 1. Adquisiciones — SOLPED y modalidad

| Evento | kind | Destinatario(s) | inbox | email | docdigital | Notas |
|---|---|---|---|---|---|---|
| *(gap)* envío a aprobación — hoy `submitPurchaseRequest` **no** declara evento | `action_required` | `adq.aprobador_unidad` (unidad solicitante) | sí | obligatorio | — | **Hueco:** declarar p. ej. `PurchaseRequestSubmitted` o disparar desde transición de `CaseStep` |
| `PurchaseRequestApproved` | `info` | `adq.solicitante` | sí | preferencia | — | |
| `PurchaseRequestApproved` | `action_required` | `adq.formulador_presupuesto` | sí | obligatorio | — | Siguiente paso 1.3 |
| rechazo SOLPED *(si se emite evento — verificar ficha)* | `info` | `adq.solicitante` | sí | obligatorio | — | Alinear nombre de evento al cerrar P-06 |
| `BudgetFinancingRequested` | `action_required` | rol Finanzas / formulador según ficha 1.4 | sí | obligatorio | — | |
| `BudgetAvailabilityCertificateIssued` | `action_required` | `adq.firmante_cdp` **o** siguiente actor post-firma según flujo | sí | obligatorio | — | Si ya firmado: `info` a solicitante / gestor |
| `BudgetPreCommitmentCreated` | `info` | `adq.solicitante`, `adq.gestor_compra` | sí | preferencia | — | |
| `ProcurementModalityConfirmed` | `action_required` | `adq.aprobador_modalidad` **si** P-38 exige visto bueno; si no, `info` a gestor | sí | obligatorio si action | — | Condicionado a P-38 |
| `ProcurementModalityApproved` | `info` | `adq.gestor_compra` | sí | preferencia | — | |
| `MpProcessLinked` | `info` | `adq.gestor_compra` | sí | preferencia | — | |

---

## 2. Adquisiciones — resolución / OC (CA · CM · LP · TD)

| Evento | kind | Destinatario(s) | inbox | email | docdigital | Notas |
|---|---|---|---|---|---|---|
| `QuotationClosed` | `action_required` | `adq.gestor_compra` | sí | obligatorio | — | Selección / siguiente paso |
| `PurchaseOrderIssued` | `info` | `adq.solicitante`, `adq.gestor_compra` | sí | preferencia | — | |
| `ProviderIneligibleBlocked` | `action_required` | `adq.gestor_compra` | sí | obligatorio | — | |
| `PurchaseOrderAccepted` | `info` | `adq.solicitante` (unidad), `adq.gestor_compra` | sí | obligatorio | — | Texto tipo ficha CA 3.4 |
| `PurchaseOrderAccepted` | `action_required` | `adq.recepcionista` / unidad receptora | sí | obligatorio | — | Avanza a recepción |
| `PurchaseOrderRejected` | `action_required` | `adq.gestor_compra` | sí | obligatorio | — | Decisión post-rechazo |
| `ProcurementProcessFailed` | `info` | `adq.solicitante`, `adq.gestor_compra` | sí | obligatorio | — | Desierto / fallido |
| `GranCompraDesierta` | `action_required` | `adq.gestor_compra` | sí | obligatorio | — | Retoma ruta |
| `LegalReviewCompleted` | `action_required` o `info` | según outcome — elaborador bases / gestor | sí | obligatorio si action | — | LP |
| `AdministrativeActSigned` | `info` / siguiente `action_required` | firmantes ya actuaron; notificar siguientes del BPMN | sí | según paso | posible | DocDigital si es notificación formal del acto |
| `ComptrollerReviewRecorded` | `action_required` o `info` | `adq.gestor_compra` | sí | obligatorio | — | |
| `EvaluationCommitteeDesignated` | `info` | miembros comisión + gestor | sí | preferencia | — | |
| `EvaluationCompleted` | `action_required` | `adq.gestor_compra` / aprobador | sí | obligatorio | — | |
| `AwardResolutionIssued` | `info` | solicitante, gestor | sí | obligatorio | posible | |
| `ContractSigned` | `info` | gestor, solicitante | sí | obligatorio | posible | |

---

## 3. Adquisiciones — recepción y pago

| Evento | kind | Destinatario(s) | inbox | email | docdigital | Notas |
|---|---|---|---|---|---|---|
| `GoodsReceiptConfirmed` | `info` | `adq.solicitante`, `adq.gestor_compra` | sí | preferencia | — | + consumidores Contabilidad vía webhook |
| `GoodsReceiptConfirmed` | `action_required` | `adq.operador_pago` o confirmante según P-46 | sí | obligatorio | — | Siguiente hito contable/pago |
| `ReceiptRejected` | `action_required` | `adq.gestor_compra`, unidad solicitante | sí | obligatorio | — | |
| `ThreeWayMatchCompleted` | `action_required` | `adq.operador_pago` | sí | obligatorio | — | |
| `AccrualRecorded` / `AccrualRegistered` | `info` | operador pago / Contabilidad (M2M) | sí | preferencia | — | Unificar al cerrar P-46 |
| `PaymentDecreeIssued` | `info` | `adq.operador_pago` | sí | preferencia | posible | |
| `PaymentCompleted` | `info` | `adq.solicitante`, gestor | sí | preferencia | — | |

---

## 4. Eventos de plataforma (core)

| Evento | kind | Destinatario(s) | inbox | email | docdigital | Notas |
|---|---|---|---|---|---|---|
| `SignatureCompleted` | `info` o siguiente action | actor del paso / siguientes | sí | preferencia | — | Origen C9 |
| `SignatureRejected` | `action_required` | solicitante de la firma | sí | obligatorio | — | |
| `NormativeParameterUpdated` | `info` | admin municipal / SUBDERE según scope | sí | preferencia | — | |
| `TenantProvisioned` | `info` | operadores SUBDERE | sí | obligatorio | — | |
| `ApiClientRevoked` | `info` | admin tenant + SUBDERE | sí | obligatorio | — | Seguridad |
| `MpStateChanged` | — | **no** notifica personas por defecto | — | — | — | Evento interno; módulos emiten hechos de negocio derivados |

---

## 5. Webhooks M2M

Los mismos eventos de dominio pueden entregarse a `EventSubscription` con scopes (P-05). No sustituyen bandeja. Destinatario = sistema suscrito, no rol de persona.

---

## 6. Huecos a cerrar con P-06

1. Evento explícito al **enviar SOLPED a aprobación** (`submitPurchaseRequest`).
2. Evento de **rechazo** de SOLPED / modalidad si solo hay efecto de estado sin nombre de evento.
3. Unificación `AccrualRecorded` vs `AccrualRegistered` (P-46).
4. Cuándo DocDigital es obligatorio (acto administrativo / Ley 19.880) — alinear con brechas NTDEE.
5. Política por defecto de correo obligatorio por municipio (plantilla SUBDERE).
