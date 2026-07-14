# Wireframe: Almacenamiento de documentos

**Consola:** Municipal  
**Operaciones:** `upsertTenantStorage`, `listDmsAdapters` (lectura catálogo); *(inferida)* `getTenantStorage`

## Layout

```
+----------------------------------------------------------+
| Almacenamiento de documentos (C10)                       |
+----------------------------------------------------------+
| Backend *  ( ) platform  ( ) tenant_owned  ( ) external_dms|
+----------------------------------------------------------+
| Si tenant_owned:                                         |
| Bucket *        [ ________ ]                             |
| Región *        [ ________ ]                             |
| Endpoint *      [ ________ ]  (S3-compatible)            |
| Credenciales    [ Rotar… ]                               |
+----------------------------------------------------------+
| Si external_dms:                                         |
| Adaptador *     [ stub_generic          v ]  (catálogo)  |
| Base URL *      [ ________ ]                             |
| Repositorio *   [ ________ ]                             |
| Credenciales    [ Rotar… ]                               |
+----------------------------------------------------------+
| Si platform: (solo lectura — provisionado por SUBDERE)   |
+----------------------------------------------------------+
| [ Guardar ]  [ Probar conexión ]  [ Cancelar ]           |
+----------------------------------------------------------+
| ⚠ MIME/tamaños/retención: P-58. Primer DMS certificado:  |
|   P-59. Módulos solo ven DocumentRef.                    |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Backend | `TenantStorageConfig.storage_backend` | Sí |
| Bucket / región / endpoint | campos `bucket_*` | Sí si `tenant_owned` |
| Adaptador | `adapter_id` | Sí si `external_dms` |
| Base URL / repositorio | `base_url`, `repository_id` | Sí si `external_dms` |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Cargar config | `getTenantStorage` *(inferido)* | Estado actual |
| Catálogo adaptadores | `listDmsAdapters` | Select de `external_dms` |
| Guardar | `upsertTenantStorage` | Persistencia |
| Probar conexión | *(inferido opcional / parte de upsert)* | Verificación |

## Estados de pantalla

- **platform:** formulario bloqueado; enlace a pedir provisión SUBDERE.
- **Error almacenamiento:** banner `DOCUMENT_STORAGE_UNAVAILABLE`.

## Validaciones visibles

- Campos del backend elegido obligatorios según tabla.
- Cambio de backend exige confirmación (migración ⚠ P-58).
