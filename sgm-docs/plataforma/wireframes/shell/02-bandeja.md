# Wireframe: Bandeja de notificaciones

**Consola:** Shell global (entrada desde campanita o menú de usuario)  
**Operaciones:** `listNotifications`, `getNotification`; *(inferidas)* `markNotificationRead`, `markAllNotificationsRead`  
**Prototipo:** [`sgm-prototipos/plataforma/shell/02-bandeja.html`](../../../../sgm-prototipos/plataforma/shell/02-bandeja.html)

Fuente canónica de **acciones pendientes del actor** (musts §9). El listado de expedientes de Adquisiciones **no** duplica esta bandeja; solo ofrece el filtro `awaiting_my_action`.

## Layout

```
+----------------------------------------------------------+
| Bandeja de entrada                                       |
+----------------------------------------------------------+
| Filtros                                                  |
| [ kind v ] [ módulo v ] [ leída v ] [ desde ] [ hasta ]  |
| [ Buscar folio / texto ]              [ Marcar todas leídas ]
+----------------------------------------------------------+
| | ● | Título                         | Módulo | Tipo | Fecha | |
| | ● | Firmar CDP ADQ-2026-00045      | Adq.   | action_required | 22-07 09:12 | [ Ir ] |
| | ○ | OC aceptada — ACME             | Adq.   | info            | 22-07 08:01 | [ Abrir ] |
| | ● | Confirmar recepción OC-8841    | Adq.   | action_required | 21-07 16:40 | [ Ir ] |
+----------------------------------------------------------+
| Paginación                                               |
+----------------------------------------------------------+
```

## Layout — detalle (opcional panel o fila expandida)

```
+----------------------------------------------------------+
| Firmar CDP — ADQ-2026-00045                              |
+----------------------------------------------------------+
| Tipo        action_required                              |
| Evento      BudgetAvailabilityCertificateIssued (origen) |
| Expediente  ADQ-2026-00045                               |
| Cuerpo      Debes firmar el CDP para continuar la SOLPED.|
| [ Ir al paso ]  [ Marcar leída ]                         |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Título | `Notification.title` | Sí |
| Cuerpo | `Notification.body` | No |
| Módulo | `Notification.module` | Sí |
| Tipo | `Notification.kind` | Sí |
| Leída | `Notification.read_at` | No |
| Fecha | `Notification.created_at` | Sí |
| Deep link | `Notification.deep_link` | Sí |
| Evento origen | `Notification.source_event_type` | Sí |
| Recurso | `Notification.resource_type`, `resource_id` | Sí si hay deep link de expediente |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar / filtrar | `listNotifications` | Colección paginada del actor |
| Detalle | `getNotification` | Panel o fila |
| Ir / Abrir | navegación `deep_link` + `markNotificationRead` *(inferido)* | Destino de proceso |
| Marcar leída | `markNotificationRead` *(inferido)* | `read_at` |
| Marcar todas leídas | `markAllNotificationsRead` *(inferido)* | Bulk |

## Estados de pantalla

- **Vacía:** “No hay notificaciones con estos filtros”.
- **Solo informativas:** sin CTA de acción; deep link de consulta.
- **403 / sesión:** redirigir a login.

## Validaciones visibles

- Filtros de fecha: desde ≤ hasta.
