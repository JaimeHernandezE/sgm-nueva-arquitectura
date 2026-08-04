# Wireframe: Visto bueno de jefatura

**Sub-paso:** 1.2 — Visto bueno de jefatura  
**Rol:** Aprobador de unidad (`adq.aprobador_unidad`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)
**Operaciones:** `approvePurchaseRequest`, `rejectPurchaseRequest`, `previewBudgetAvailability` *(informativa)*

## Layout

```
+----------------------------------------------------------+
| SOLPED #1234 — Revisión jefatura          [Pendiente V°B°]|
+----------------------------------------------------------+
| Contexto SOLPED                                           |
| Unidad: ... | Monto total: $XXX | Líneas: 3               |
| Imputación presup. indicada: Cuenta 22.01.03 (opcional)        |
| [ Ver formulario 1.1 ]                                    |
| [ Consultar saldo en imputación presupuestaria ]  (enlace)     |
+----------------------------------------------------------+
| Seguimiento de firmas                                     |
| +------------------+--------+-------------+               |
| | Interviniente    | Tipo   | Estado      |               |
| +------------------+--------+-------------+               |
| | Jefatura Unidad  | FirmaGob| Pendiente  |               |
| +------------------+--------+-------------+               |
+----------------------------------------------------------+
| Decisión                                                  |
| Comentarios (obligatorio si rechazo; solo lectura tras    |
| decisión)                                                 |
| [________________________________________________]        |
+----------------------------------------------------------+
| [ Rechazar ] [ Rechazar y enviar a borrador ] [ Aprobar y firmar ] |
+----------------------------------------------------------+

Modal al pulsar «Aprobar y firmar»:

+----------------------------------------------------------+
| Previsualización — Solicitud de pedido               [✕] |
+----------------------------------------------------------+
| [Documento: Solicitud de pedido SOLPED #… ]              |
| Plantilla: adq.solped_vb (Configuraciones → Firmas)      |
| FirmaGob — pendiente                                     |
+----------------------------------------------------------+
| [ Cancelar ]                              [ Firmar ]     |
+----------------------------------------------------------+

Tras firmar (vuelve a la pantalla):

| Comentarios (solo lectura)                                |
| Seguimiento de firmas: Jefatura Unidad → Firmado          |
| [ Ver documento firmado ] [ Descargar PDF ] [ Volver… ]   |
```

> El PDF firmado es la **solicitud de pedido** generada desde la plantilla `adq.solped_vb` del mantenedor de documentos firmables (Configuraciones → Firmas). Se persiste en `PurchaseRequestApproval.signed_document_ref` (C10).

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Decisión (aprobar/rechazar) | `PurchaseRequestApproval.decision` | Sí |
| Comentarios | `PurchaseRequestApproval.comments` | Sí si rechazo |
| Estado firma | respuesta `confirmSignature` | Sí (camino aprobación) |
| Documento firmado / descarga | `PurchaseRequestApproval.signed_document_ref` | Sí si aprobación |
| Imputación presup. indicada | `PurchaseRequest.proposed_budget_line_id` | No (solo lectura) — con descripción de cuenta + saldo desde Presupuestos |
| Descripción de cuenta / saldo | `BudgetLine.description` / `previewBudgetAvailability.available_balance` | No (solo lectura) |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Aprobar y firmar | abre modal de previsualización → `approvePurchaseRequest` | Render plantilla `adq.solped_vb` + `storeDocument` (C10); `requestSignature` → `confirmSignature` (FirmaGob) al pulsar **Firmar** |
| Firmar (modal) | `approvePurchaseRequest` + `confirmSignature` | Cierra modal; deja pantalla en estado firmado con `signed_document_ref` |
| Ver documento firmado | — (UI) | Reabre modal en modo solo lectura del PDF firmado |
| Descargar PDF | — (UI / C10) | Descarga `signed_document_ref` (solicitud de pedido firmada) |
| Volver al expediente | — (navegación) | Vista de expediente |
| Rechazar | `rejectPurchaseRequest` (`disposition = cancel`) | — (`ProcurementCase.status = cancelled`; sin corrección) |
| Rechazar y enviar a borrador | `rejectPurchaseRequest` (`disposition = return_to_draft`) | — (`PurchaseRequest.status = draft`; vuelve a 1.1 editable) |
| Ver formulario 1.1 | — (navegación) | Solo lectura del formulario de creación SOLPED |
| Consultar saldo (panel) | `getBudgetLine` + `previewBudgetAvailability` | Informativa — descripción + saldo; mismo comportamiento que 1.1 |

## Estados de pantalla

- **Pendiente firma:** modal de previsualización abierto; aún no se perfecciona la aprobación hasta **Firmar**.
- **Firmado:** comentarios solo lectura; acciones de decisión ocultas; CTAs «Ver documento firmado», «Descargar PDF» y «Volver al expediente».
- **FirmaGob caído:** banner `SIGNATURE_PROVIDER_UNAVAILABLE`; botones bloqueados.
- **Rechazado (cerrar):** expediente cancelado; no hay edición posterior de la SOLPED; comentarios solo lectura.
- **Rechazado (borrador):** vuelve a borrador en unidad solicitante; el solicitante puede editar el paso 1.1 y reenviar a aprobación; comentarios solo lectura.

## Validaciones visibles

- Solo usuarios con rol Aprobador de unidad (`adq.aprobador_unidad`) de la unidad solicitante (QA 6).
- Comentario obligatorio al rechazar.

## Notas

- QA ítems 5, 7 P1: aprobación sin firma real no debe ser posible.
- Medida transitoria piloto: adjunto de visación manual si FirmaGob no disponible (propuesta QA 7).
- La autoconsulta de saldo ayuda al aprobador a decidir; no reemplaza la verificación DAF en 1.3.
