# Wireframe: Excepciones SoD

**Consola:** Municipal  
**Operaciones:** *(inferidas)* `listSodExceptions`, `createSodException`, `revokeSodException`

## Layout

```
+----------------------------------------------------------+
| Excepciones de segregación de funciones     [ + Nueva ]  |
+----------------------------------------------------------+
| | Usuario   | Regla SoD          | Motivo   | Hasta   |  |
| | Ana Pérez | aprobador≠formulador| auditoría| 2026-12|  |
+----------------------------------------------------------+
| Nueva excepción:                                         |
| Usuario *      [ _____________ v ]                       |
| Regla SoD *    [ _____________ v ]                       |
| Motivo *       [ ________________________ ]              |
| Hasta *        [ __ / __ / ____ ]                        |
| Aprobado por   [ (doble control — otro admin) ]          |
+----------------------------------------------------------+
| [ Guardar ]  [ Revocar ]  [ Cancelar ]                   |
+----------------------------------------------------------+
| ⚠ Toda excepción es explícita, registrada y auditada     |
|   (seguridad / P-25).                                    |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Usuario | `SodException` → `User` | Sí |
| Regla | `SodException` → `SodRule` | Sí |
| Motivo | texto auditoría | Sí |
| Hasta | vigencia | Sí |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar | `listSodExceptions` *(inferido)* | Colección |
| Guardar | `createSodException` *(inferido)* | Alta auditada |
| Revocar | `revokeSodException` *(inferido)* | Fin excepción |

## Estados de pantalla

- **Sin excepción vigente:** asignación conflictiva bloqueada en roles.
- **Excepción vencida:** deja de aplicar; no requiere acción.

## Validaciones visibles

- Motivo y fecha de fin obligatorios.
- Quién crea la excepción ≠ sujeto de la excepción (recomendado / política P-25).
