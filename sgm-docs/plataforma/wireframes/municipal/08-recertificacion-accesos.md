# Wireframe: Recertificación de accesos

**Consola:** Municipal  
**Operaciones:** *(inferida)* `listAccessRecertificationReport` (puede apoyarse en `listUsers` + `listAuditRecords`)

## Layout

```
+----------------------------------------------------------+
| Recertificación de accesos                               |
+----------------------------------------------------------+
| Periodo *   [ último trimestre           v ]             |
| Filtro      [ sin actividad > 90 días    v ]             |
+----------------------------------------------------------+
| | Usuario    | Roles           | Últ. acceso | Acción  | |
| | Luis Soto  | solicitante     | 2025-12-01  | [Revocar]| |
| | Ana Pérez  | aprobador       | 2026-07-13  | [OK]     | |
+----------------------------------------------------------+
| [ Exportar ]  [ Marcar periodo como revisado ]           |
+----------------------------------------------------------+
| Fuente: seguridad.md §9.4 — reporte de cuentas y         |
| última actividad.                                        |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Usuario | `User` | — (resultado) |
| Roles | vía `RoleAssignment` | — |
| Últ. acceso | derivado (actividad / auditoría) | — |
| Periodo | query | Sí |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Generar reporte | `listAccessRecertificationReport` *(inferido)* | Filas |
| Revocar | `revokeUser` *(inferido)* | Baja inmediata |
| Exportar | mismo listado / CSV | Descarga |
| Marcar revisado | *(inferido — registro auditado)* | Evidencia de ciclo |

## Estados de pantalla

- **Sin actividad registrada:** mostrar “nunca” / null, no omitir fila.
- **Revocación:** vuelve a flujo de usuarios.

## Validaciones visibles

- Periodo obligatorio.
- Confirmar antes de revocar desde esta pantalla.
