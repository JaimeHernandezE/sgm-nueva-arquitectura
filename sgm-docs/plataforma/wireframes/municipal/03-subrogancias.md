# Wireframe: Subrogancias

**Consola:** Municipal  
**Operaciones:** *(inferidas)* `listDelegations`, `createDelegation`, `revokeDelegation`

## Layout

```
+----------------------------------------------------------+
| Subrogancias (Delegation)                   [ + Nueva ]  |
+----------------------------------------------------------+
| | Titular     | Subrogante   | Desde      | Hasta     |  |
| | Ana Pérez   | Luis Soto    | 2026-07-01 | 2026-07-15|  |
+----------------------------------------------------------+
| Nueva subrogancia:                                       |
| Titular *     [ Ana Pérez           v ]                  |
| Subrogante *  [ Luis Soto           v ]                  |
| Desde *       [ __ / __ / ____ ]                         |
| Hasta *       [ __ / __ / ____ ]  (vencimiento obligatorio)|
| Roles cubiertos [ (heredados del titular / selección) ]  |
+----------------------------------------------------------+
| [ Guardar ]  [ Revocar ]  [ Cancelar ]                   |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Titular | `Delegation` (titular → `User`) | Sí |
| Subrogante | `Delegation` (subrogante → `User`) | Sí |
| Desde | `valid_from` | Sí |
| Hasta | `valid_until` | Sí (vencimiento obligatorio — `plataforma-core` §9.2) |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar | `listDelegations` *(inferido)* | Colección del tenant |
| Guardar | `createDelegation` *(inferido)* | Alta |
| Revocar | `revokeDelegation` *(inferido)* | Fin anticipado |

## Estados de pantalla

- **Vencida:** fila read-only; sin efecto en login.
- **Titular = subrogante:** bloqueo.

## Validaciones visibles

- Hasta obligatorio y posterior a Desde.
- Ambos usuarios del mismo tenant.
