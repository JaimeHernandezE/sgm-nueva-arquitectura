# Wireframe: Usuarios del municipio

**Consola:** Municipal  
**Operaciones:** `getUser`, `getCurrentUser`; *(inferidas)* `listUsers`, `createUser`, `updateUser`, `revokeUser`

## Layout — listado

```
+----------------------------------------------------------+
| Usuarios del municipio                      [ + Alta ]   |
+----------------------------------------------------------+
| Filtros: [ estado v ] [ buscar RUN / nombre ]            |
+----------------------------------------------------------+
| | RUN          | Nombre        | Estado   | Últ. acceso | |
| | 12.345.678-9 | Ana Pérez     | active   | 2026-07-13  | |
| | 9.876.543-2  | Luis Soto     | suspended| 2026-06-01  | |
+----------------------------------------------------------+
```

## Layout — alta / edición

```
+----------------------------------------------------------+
| Usuario                                                  |
+----------------------------------------------------------+
| RUN *            [ _____________ ]                       |
| Nombre visible * [ _____________ ]                       |
| Estado           [ active / suspended / revoked v ]      |
+----------------------------------------------------------+
| [ Guardar ]  [ Revocar acceso ]  [ Cancelar ]            |
+----------------------------------------------------------+
| Nota: roles se asignan en "Roles y unidades".            |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| RUN | `User.run` | Sí |
| Nombre visible | `User.display_name` | Sí |
| Estado | `User.status` | Sí |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar | `listUsers` *(inferido)* | Colección del tenant |
| Detalle | `getUser` | Detalle |
| Alta / Guardar | `createUser` / `updateUser` *(inferidos)* | Persistencia |
| Revocar | `revokeUser` *(inferido)* | Baja inmediata (`seguridad.md` §9) |

## Estados de pantalla

- **Revocado:** sin login; banner irreversible salvo reactivación auditada (política ⚠).
- **Scope insuficiente:** 403.

## Validaciones visibles

- RUN formato chileno válido.
- Revocación exige confirmación.
