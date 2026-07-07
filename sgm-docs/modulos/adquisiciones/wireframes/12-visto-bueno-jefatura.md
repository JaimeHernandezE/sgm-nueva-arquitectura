# Wireframe: Visto bueno de jefatura

**Sub-paso:** 1.2 — Visto bueno de jefatura  
**Operaciones:** `approvePurchaseRequest`, `rejectPurchaseRequest`, `previewBudgetAvailability` *(informativa)*

## Layout

```
+----------------------------------------------------------+
| SOLPED #1234 — Revisión jefatura          [Pendiente V°B°]|
+----------------------------------------------------------+
| [Datos SOLPED — solo lectura]                             |
| Unidad: ... | Monto total: $XXX | Líneas: 3               |
| Línea presup. indicada: Cuenta 22.01.03 (opcional)        |
| [ Consultar saldo en línea presupuestaria ]  (enlace)     |
+----------------------------------------------------------+
| Seguimiento de firmas                                     |
| +------------------+--------+-------------+               |
| | Interviniente    | Tipo   | Estado      |               |
| +------------------+--------+-------------+               |
| | Jefatura Unidad  | FirmaGob| Pendiente  |               |
| +------------------+--------+-------------+               |
+----------------------------------------------------------+
| Comentarios (obligatorio si rechazo)                      |
| [________________________________________________]        |
+----------------------------------------------------------+
| [ Rechazar ]                    [ Aprobar y firmar ]      |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo |
|---|---|
| Decisión | `PurchaseRequestApproval.decision` |
| Comentarios | `PurchaseRequestApproval.comments` |
| Estado firma | respuesta `confirmSignature` |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Aprobar y firmar | `approvePurchaseRequest` | `requestSignature` → `confirmSignature` (FirmaGob) |
| Rechazar | `rejectPurchaseRequest` | — |
| Consultar saldo (panel) | `previewBudgetAvailability` | Informativa — mismo panel que 1.1 |

## Estados de pantalla

- **Pendiente firma:** botón aprobación deshabilitado hasta `confirmSignature` exitoso.
- **FirmaGob caído:** banner `SIGNATURE_PROVIDER_UNAVAILABLE`; botones bloqueados.
- **Rechazado:** vuelve a borrador en unidad solicitante.

## Validaciones visibles

- Solo usuarios con rol Aprobador de la unidad solicitante (QA 6).
- Comentario obligatorio al rechazar.

## Notas

- QA ítems 5, 7 P1: aprobación sin firma real no debe ser posible.
- Medida transitoria piloto: adjunto de visación manual si FirmaGob no disponible (propuesta QA 7).
- La autoconsulta de saldo ayuda al aprobador a decidir; no reemplaza la verificación DAF en 1.3.
