# Wireframe: Integraciones del municipio

**Consola:** Municipal  
**Operaciones:** `upsertTenantIntegration`, `rotateIntegrationCredential`; *(inferida)* `listTenantIntegrations`

## Layout

```
+----------------------------------------------------------+
| Integraciones del municipio                              |
+----------------------------------------------------------+
| | Proveedor       | Habilitado | Parámetros no secretos | |
| | mercado_publico | sí         | organismo: 1234        | |
| | firma_gob       | sí         | (defaults plataforma)  | |
| | sii             | sí         | —                      | |
+----------------------------------------------------------+
| Editar Mercado Público:                                  |
| Habilitado *     [x]                                     |
| Código organismo*[ ________ ]                            |
| Credencial       [ Rotar… ] (nunca mostrar secreto)       |
+----------------------------------------------------------+
| [ Guardar ]  [ Cancelar ]                                |
+----------------------------------------------------------+
| ⚠ Detalle de campos por proveedor: P-57.                 |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Proveedor | `TenantIntegrationConfig.provider_id` | Sí |
| Habilitado | `TenantIntegrationConfig.enabled` | Sí |
| Código organismo MP | `mp_organism_code` | Sí si MP habilitado |
| Base URL | `base_url` | Según proveedor |
| Secret ref | `IntegrationCredential.secret_ref` | Sistema |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar | `listTenantIntegrations` *(inferido)* | Config del tenant |
| Guardar | `upsertTenantIntegration` | Parámetros no secretos |
| Rotar | `rotateIntegrationCredential` | Nuevo secreto / rotación auditada |

## Estados de pantalla

- **Proveedor deshabilitado:** módulos reciben error de proveedor al usarlo.
- **Rotación:** confirmación; downtime breve posible.

## Validaciones visibles

- Organismo MP obligatorio si MP habilitado.
- No hay campo de secreto en claro en el formulario.
