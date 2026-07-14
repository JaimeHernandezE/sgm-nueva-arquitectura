# Wireframe: Provisión de almacenamiento (buckets platform)

**Consola:** Plataforma (SUBDERE)  
**Operaciones:** *(inferida)* `provisionPlatformBucket`

## Layout

```
+----------------------------------------------------------+
| Almacenamiento platform por tenant                       |
+----------------------------------------------------------+
| Tenant *           [ Mun. Alpha              v ]         |
| Backend actual     [ platform ] (solo lectura)           |
| Bucket             [ sgm-tenant-alpha ]                  |
| Región             [ … ]                                 |
| Estado             [ provisioned / pending / error ]     |
+----------------------------------------------------------+
| [ Provisionar bucket ]  [ Reintentar ]  [ Volver ]       |
+----------------------------------------------------------+
| Nota: tenant_owned y external_dms se configuran en la   |
|       consola municipal (hosting híbrido).               |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Tenant | `TenantStorageConfig.tenant_id` | Sí |
| Backend | `TenantStorageConfig.storage_backend` | Sí (= `platform` en esta pantalla) |
| Bucket | `TenantStorageConfig.bucket_name` | Sí si provisionado |
| Región | `TenantStorageConfig.bucket_region` | Sí si provisionado |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Provisionar / Reintentar | `provisionPlatformBucket` *(inferido)* | Crea bucket SUBDERE y fija `storage_backend = platform` |

## Estados de pantalla

- **Pending:** alta de tenant en curso; botón deshabilitado hasta schema listo.
- **Error:** mensaje `DOCUMENT_STORAGE_UNAVAILABLE`; reintento.
- **Tenant en modo híbrido:** advertencia — el bucket platform puede coexistir o no según política (⚠ P-58).

## Validaciones visibles

- Tenant obligatorio.
- No provisionar si ya hay `tenant_owned` activo sin confirmación explícita de cambio de backend.
