# Wireframe: Parámetros normativos

**Consola:** Plataforma (SUBDERE)  
**Operaciones:** `listNormativeParameters`, `getNormativeParameter`; *(inferidas)* `proposeNormativeParameter`, `approveNormativeParameter`

## Layout — listado

```
+----------------------------------------------------------+
| Parámetros normativos                                    |
+----------------------------------------------------------+
| | Clave              | Valor   | Vigente desde | Estado | |
| | umbral_compra_agil | 100 UTM | 2026-01-01    | activo | |
| | umbral_toma_razon  | 5000 UTM| 2026-01-01    | activo | |
| | (propuesta) X      | …       | —             | pending| |
+----------------------------------------------------------+
| [ Proponer cambio ]                                      |
+----------------------------------------------------------+
```

## Layout — propuesta / aprobación (doble control)

```
+----------------------------------------------------------+
| Propuesta de parámetro                                   |
+----------------------------------------------------------+
| Clave *            [ umbral_compra_agil     ] (solo lect.|
| Nuevo valor *      [ ________________ ]                   |
| Vigente desde *    [ __ / __ / ____ ]                     |
| Referencia legal * [ ________________ ]                   |
| Propuesto por      [ (usuario actual) ]                   |
+----------------------------------------------------------+
| [ Enviar a aprobación ]     [ Cancelar ]                 |
+----------------------------------------------------------+
| Aprobador distinto del proponente:                       |
| [ Aprobar ]  [ Rechazar ]                                |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Clave | `NormativeParameter.key` / `parameter_code` | Sí |
| Valor | `NormativeParameter.value` | Sí |
| Vigente desde | `NormativeParameter.valid_from` | Sí |
| Referencia legal | `NormativeParameter.legal_reference` | Sí |
| Propuesto / aprobado por | `created_by` / `approved_by` | Sí (sistema) |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Listar | `listNormativeParameters` | Catálogo + vigencias |
| Detalle | `getNormativeParameter` | Valor vigente |
| Enviar a aprobación | `proposeNormativeParameter` *(inferido)* | Pendiente doble control |
| Aprobar | `approveNormativeParameter` *(inferido)* | Emite `NormativeParameterUpdated` |
| Rechazar | *(inferido mismo flujo)* | Sin efecto en vigencia |

## Estados de pantalla

- **Proponente = aprobador:** bloqueo `SEGREGATION_OF_DUTIES_VIOLATION`.
- **Histórico:** valores pasados solo lectura (inmutables).

## Validaciones visibles

- Doble control obligatorio (quién propone ≠ quién aprueba).
- `valid_from` no puede reescribir el pasado ya aplicado a expedientes.
