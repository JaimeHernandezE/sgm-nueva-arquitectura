# Wireframe: Roles y unidades

**Consola:** Municipal  
**Operaciones:** `listRoleAssignments`; *(inferidas)* `createRoleAssignment`, `revokeRoleAssignment`, `listOrganizationalUnits`, `createOrganizationalUnit`, `updateOrganizationalUnit`

## Layout — unidades

```
+----------------------------------------------------------+
| Unidades organizacionales                   [ + Unidad ] |
+----------------------------------------------------------+
| - DAF                                                    |
|   - Abastecimiento                                       |
|   - Finanzas                                             |
| - Dirección de Obras                                     |
+----------------------------------------------------------+
```

## Layout — asignación de rol

```
+----------------------------------------------------------+
| Asignaciones de rol                         [ + Asignar ]|
+----------------------------------------------------------+
| | Usuario    | Rol              | Unidad        | Hasta | |
| | Ana Pérez  | aprobador_solped | Abastecimiento| —     | |
+----------------------------------------------------------+
| Nueva asignación:                                        |
| Usuario *   [ Ana Pérez           v ]                    |
| Rol *       [ aprobador_solped    v ]                    |
| Unidad *    [ Abastecimiento      v ]                    |
| Desde *     [ __ / __ / ____ ]                           |
| Hasta       [ __ / __ / ____ ] (opcional)                |
| Advertencia SoD: [ si aplica, bloqueo o excepción ]      |
+----------------------------------------------------------+
| [ Guardar ]  [ Revocar asignación ]  [ Cancelar ]      |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Nombre unidad | `OrganizationalUnit.name` | Sí |
| Padre | `OrganizationalUnit.parent_unit_id` | No |
| Usuario | `RoleAssignment.user_id` | Sí |
| Rol | `RoleAssignment.role_id` | Sí |
| Unidad | `RoleAssignment.organizational_unit_id` | Sí |
| Desde / Hasta | `valid_from` / `valid_until` | Desde sí; hasta no |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar unidades | `listOrganizationalUnits` *(inferido)* | Árbol |
| CRUD unidad | `createOrganizationalUnit` / `updateOrganizationalUnit` *(inferidos)* | Persistencia |
| Listar asignaciones | `listRoleAssignments` | Colección |
| Asignar | `createRoleAssignment` *(inferido)* | Alta; valida SoD |
| Revocar | `revokeRoleAssignment` *(inferido)* | Baja asignación |

## Estados de pantalla

- **Violación SoD:** bloqueo salvo excepción vigente (pantalla `04-excepciones-sod`).
- **Estructura org:** catálogo definitivo ⚠ **P-49**.

## Validaciones visibles

- Usuario, rol y unidad obligatorios en asignación.
- `valid_until` ≥ `valid_from` si presente.
