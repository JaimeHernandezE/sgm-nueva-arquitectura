# Wireframe: Parámetros operativos

**Consola:** Municipal  
**Operaciones:** `getTenantParameter`; *(inferidas)* `listTenantParameters`, `upsertTenantParameter`

## Layout

```
+----------------------------------------------------------+
| Parámetros operativos del municipio                      |
+----------------------------------------------------------+
| Catálogo permitido por plataforma (no valores normativos)|
| | Clave                    | Valor actual | Defecto plat.|
| | perfil_recepcion         | estricto     | estándar    |
| | visto_bueno_pre_oc       | true         | false       |
| | timer_escalamiento_horas | 48           | 72          |
+----------------------------------------------------------+
| Editar:                                                  |
| Clave     [ perfil_recepcion ] (solo lectura)            |
| Valor *   [ _____________ ]                              |
+----------------------------------------------------------+
| [ Guardar ]  [ Restaurar defecto plataforma ]            |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Clave | `TenantParameter.key` | Sí (catálogo fijo) |
| Valor | `TenantParameter.value` | Sí |

Distinto de `NormativeParameter` (solo SUBDERE).

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar | `listTenantParameters` *(inferido)* | Catálogo + valores |
| Leer una | `getTenantParameter` | Valor tenant |
| Guardar | `upsertTenantParameter` *(inferido)* | Persistencia auditada |
| Restaurar defecto | `upsertTenantParameter` (valor defecto) | Vuelve al default plataforma |

## Estados de pantalla

- **Clave fuera de catálogo:** no editable (ni visible como alta libre).
- **Guardado OK:** toast / banner; módulos leen vía cache (`musts` §5).

## Validaciones visibles

- Valor obligatorio y conforme al esquema de la clave (JSON/tipo).
