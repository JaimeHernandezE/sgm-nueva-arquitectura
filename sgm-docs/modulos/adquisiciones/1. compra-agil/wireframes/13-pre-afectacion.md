# Wireframe: Pre-afectación presupuestaria

**Sub-paso:** 1.3 — Pre-afectación presupuestaria  
**Operación:** `createBudgetPreCommitment`

## Layout

```
+----------------------------------------------------------+
| SOLPED #1234 — Pre-afectación presupuestaria              |
+----------------------------------------------------------+
| Línea presupuestaria *    [ Cuenta / Programa ...    v ]  |
| Monto estimado *          [ $ ____________ ]              |
| Año fiscal *              [ 2026 ]                        |
+----------------------------------------------------------+
| Panel: Disponibilidad presupuestaria (QA 8 P1)            |
| +------------------------------------------------------+  |
| | Saldo disponible actual:        $ 1.200.000          |  |
| | Comprometido otras SOLPED:      $   300.000          |  |
| | Monto esta solicitud:           $   450.000          |  |
| | Saldo proyectado:               $   450.000  [OK]    |  |
| +------------------------------------------------------+  |
+----------------------------------------------------------+
| [ Cancelar ]                         [ Generar CDP ]      |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo |
|---|---|
| Línea presupuestaria | `BudgetPreCommitment.budget_line_id` |
| Monto estimado | `BudgetPreCommitment.estimated_amount` |
| Año fiscal | `BudgetPreCommitment.fiscal_year` |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Generar CDP | `createBudgetPreCommitment` | `checkBudgetAvailability` → `createBudgetPreCommitment` (Presupuestos) |

## Estados de pantalla

- **Saldo insuficiente:** panel en rojo; botón deshabilitado; error `BUDGET_UNAVAILABLE` (QA 11 P0).
- **Presupuestos no disponible:** banner `BUDGET_PROVIDER_UNAVAILABLE`; reintento.
- **Segregación roles:** si generador = aprobador → `SEGREGATION_OF_DUTIES_VIOLATION` (QA 9 P1).
- **Éxito:** SOLPED lista para Modalidad de Compra; evento `BudgetPreCommitmentCreated`.

## Validaciones visibles

- Panel de trazabilidad siempre visible antes de confirmar (QA 8).
- Mensajes de error específicos por campo bloqueado (QA 10 — no genéricos).

## Notas

- ⚠ Pendiente: qué ocurre si se revierte SOLPED tras pre-afectación activa.
