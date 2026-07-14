# Wireframe: Gestión de tenants

**Consola:** Plataforma (SUBDERE)  
**Operaciones:** `listTenants`, `getTenant`; *(inferidas)* `createTenant`, `updateTenant`, `suspendTenant`, `setEnabledModules`

## Layout — listado

```
+----------------------------------------------------------+
| Tenants                                      [ + Alta ]  |
+----------------------------------------------------------+
| Filtros: [ estado v ] [ modo v ] [ buscar por nombre ]   |
+----------------------------------------------------------+
| | Nombre       | Modo consumo    | Estado   | Módulos |  |
| | Mun. Alpha   | hosted_full     | active   | ADQ…    |  |
| | Mun. Beta    | hosted_hybrid   | active   | ADQ…    |  |
| | Mun. Gamma   | api_a_la_carte  | suspended| —       |  |
+----------------------------------------------------------+
```

## Layout — detalle / alta

```
+----------------------------------------------------------+
| Tenant: Mun. Alpha                     [ active ]        |
+----------------------------------------------------------+
| Nombre *              [ ________________ ]               |
| Modo de consumo *     [ hosted_full          v ]         |
|   hosted_full / hosted_hybrid / api_a_la_carte           |
| Módulos habilitados * [x] Adquisiciones [ ] Presupuestos |
| Schema                [ tenant_alpha ] (solo lectura)    |
+----------------------------------------------------------+
| [ Guardar ]  [ Suspender ]  [ Reactivar ]  [ Cancelar ]  |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Nombre | `Tenant.name` | Sí |
| Modo de consumo | `Tenant.consumption_mode` | Sí |
| Módulos habilitados | `Tenant.enabled_modules` | Sí (≥1) |
| Estado | `Tenant.status` | Sí (sistema / acción suspender) |
| Schema | `Tenant.schema_name` | No (generado) |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar / filtrar | `listTenants` | Colección paginada |
| Abrir detalle | `getTenant` | Detalle |
| Alta / Guardar | `createTenant` / `updateTenant` *(inferidos)* | Alta o actualización |
| Módulos | `setEnabledModules` *(inferido)* | Cambia `enabled_modules` |
| Suspender | `suspendTenant` *(inferido)* | `status = suspended` |

## Estados de pantalla

- **Sin scope plataforma:** 403; no se muestran tenants.
- **Suspensión:** accesos del tenant revocables; banner de confirmación.
- **Alta en curso:** `status = provisioning` hasta schema listo (`TenantProvisioned`).

## Validaciones visibles

- Nombre y modo obligatorios.
- Al menos un módulo habilitado.
- Suspender exige confirmación explícita.
