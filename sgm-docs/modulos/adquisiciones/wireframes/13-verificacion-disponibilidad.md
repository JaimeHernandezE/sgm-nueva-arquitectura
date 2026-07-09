# Wireframe: Verificación de disponibilidad presupuestaria

**Sub-paso:** 1.3 — Verificación de disponibilidad presupuestaria  
**Operación:** `verifyBudgetAvailability`

## Layout

```
+----------------------------------------------------------+
| Expediente ADQ-2026-00142                    [En curso]   |
+----------------------------------------------------------+
| SOLPED #1234 — Verificación presupuestaria                |
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
| Comentarios (obligatorio si rechazo)  [________________________]      |
+----------------------------------------------------------+
| [ Rechazar ]    [ Solicitar financiamiento ]  [ Confirmar ]|
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Línea presupuestaria | `BudgetLine` (consulta) | Sí |
| Monto estimado | entrada de verificación | Sí |
| Año fiscal | entrada de verificación | Sí |
| Comentarios | entrada `verifyBudgetAvailability` | Sí si rechazo |
| Panel saldo | respuesta `checkBudgetAvailability` | No (solo lectura) |
| Verificador | `BudgetAvailabilityCertificate.verified_by` | Sí (al confirmar) |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Confirmar | `verifyBudgetAvailability` (`decision = confirmed`) | `checkBudgetAvailability` (Presupuestos) |
| Rechazar | `verifyBudgetAvailability` (`decision = rejected`) | — |
| Solicitar financiamiento | navega a sub-paso 1.4 | — |

## Estados de pantalla

- **Saldo insuficiente:** panel en rojo; «Confirmar» deshabilitado; «Solicitar financiamiento» habilitado.
- **Presupuestos no disponible:** banner `BUDGET_PROVIDER_UNAVAILABLE`; reintento.
- **Confirmado:** avance a 1.5 (emisión CDP).

## Validaciones visibles

- Panel de trazabilidad siempre visible antes de confirmar (QA 8).
- Comentarios obligatorios si se rechaza.

## Notas

- El formulador DAF que verifica aquí no puede firmar el CDP (1.5) — QA 9.
