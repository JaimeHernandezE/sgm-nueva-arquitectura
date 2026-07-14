# Wireframe: Auditoría de plataforma

**Consola:** Plataforma (SUBDERE)  
**Operaciones:** `listAuditRecords` (scope plataforma)

## Layout

```
+----------------------------------------------------------+
| Auditoría de plataforma                                  |
+----------------------------------------------------------+
| Filtros:                                                 |
| Desde * [ __ / __ / ____ ]  Hasta * [ __ / __ / ____ ]  |
| Actor   [ (opcional) ]  Acción [ (opcional) v ]          |
| Recurso [ tipo v ] [ id opcional ]                       |
+----------------------------------------------------------+
| | Timestamp | Actor | Acción        | Recurso     |      |
| | 10:41     | u-12  | tenant.suspend| tenant/Beta |      |
| | 09:02     | u-03  | api_client.rev| ac_99       |      |
+----------------------------------------------------------+
| Detalle (payload_summary, sin PII sensible)              |
| [ … ]                                                    |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Timestamp | `AuditRecord.timestamp` | — (resultado) |
| Actor | `AuditRecord.actor_id` | Filtro opcional |
| Acción | `AuditRecord.action` | Filtro opcional |
| Tipo recurso | `AuditRecord.resource_type` | Filtro opcional |
| Id recurso | `AuditRecord.resource_id` | Filtro opcional |
| Resumen | `AuditRecord.payload_summary` | — (resultado) |
| Rango fechas | query | Sí |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Buscar | `listAuditRecords` | Colección paginada scope plataforma |
| Abrir fila | — (detalle local del resumen) | Sin escritura |

## Estados de pantalla

- **Sin scope:** 403.
- **Resultado vacío:** empty state (no es error).

## Validaciones visibles

- Rango de fechas obligatorio.
- UI no muestra secretos ni PII en `payload_summary`.
