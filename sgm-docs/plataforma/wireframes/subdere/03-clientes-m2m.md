# Wireframe: Clientes M2M y convenios

**Consola:** Plataforma (SUBDERE)  
**Operaciones:** `createApiClient`, `revokeApiClient`; *(inferidas)* `listApiClients`, `rotateApiClientSecret`

## Layout — listado

```
+----------------------------------------------------------+
| Clientes M2M (ApiClient)                    [ + Emitir ] |
+----------------------------------------------------------+
| | Nombre          | Scopes              | Estado |       |
| | Sandbox Integr. | adquisiciones.read  | active |       |
| | Mun. Beta ERP   | adquisiciones.*     | active |       |
+----------------------------------------------------------+
```

## Layout — emisión / detalle

```
+----------------------------------------------------------+
| Nuevo cliente M2M                                        |
+----------------------------------------------------------+
| Nombre *           [ ________________ ]                  |
| Scopes *           [ adquisiciones:read , … ]            |
| Tenants *          [ Mun. Alpha , Mun. Beta  v ]         |
+----------------------------------------------------------+
| Tras crear (una sola vez):                               |
| client_id     [ ac_… ]                                   |
| client_secret [ ******** ]  [ Copiar ]                   |
| ⚠ El secreto no se vuelve a mostrar                      |
+----------------------------------------------------------+
| [ Emitir ]  [ Rotar secreto ]  [ Revocar ]  [ Cancelar ] |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Nombre | `ApiClient.name` | Sí |
| Scopes | `ApiClient.scopes` | Sí (≥1) |
| Tenants | `ApiClient.tenant_ids` | Sí (≥1) |
| Estado | `ApiClient.status` | Sí (sistema) |
| Creado | `ApiClient.created_at` | No (sistema) |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar | `listApiClients` *(inferido)* | Colección |
| Emitir | `createApiClient` | Devuelve secreto una vez |
| Rotar secreto | `rotateApiClientSecret` *(inferido)* | Nuevo secreto una vez |
| Revocar | `revokeApiClient` | Revocación inmediata; evento `ApiClientRevoked` |

## Estados de pantalla

- **Revocado:** filas en solo lectura; no rotación.
- **Error de scope:** scopes fuera del catálogo → rechazo.

## Validaciones visibles

- Nombre, scopes y tenants obligatorios.
- Confirmar revocación (irreversible para el secret actual).
