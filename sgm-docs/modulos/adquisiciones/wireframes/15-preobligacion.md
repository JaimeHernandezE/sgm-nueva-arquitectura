# Wireframe: Generación de preobligación

**Sub-paso:** 1.6 — Generación de preobligación  
**Operación:** `createBudgetPreCommitment`

## Layout

```
+----------------------------------------------------------+
| Expediente ADQ-2026-00142                    [En curso]   |
+----------------------------------------------------------+
| SOLPED #1234 — Preobligación presupuestaria               |
+----------------------------------------------------------+
| CDP vigente           CDP-2026-00891  (firmado 02/07/26)  |
| Línea presupuestaria  [ Cuenta / Programa ...        ]  |
| Monto preobligación * [ $ ____________ ]                |
| Año fiscal *          [ 2026 ]                          |
+----------------------------------------------------------+
| Registro contable: pendiente / registrado                 |
| Ref. asiento:       [ — / AS-2026-12345 ]               |
+----------------------------------------------------------+
| [ Cancelar ]                    [ Generar preobligación ] |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo |
|---|---|
| CDP vigente | `BudgetPreCommitment.budget_availability_certificate_id` |
| Línea presupuestaria | `BudgetPreCommitment.budget_line_id` |
| Monto preobligación | `BudgetPreCommitment.estimated_amount` |
| Año fiscal | `BudgetPreCommitment.fiscal_year` |
| Ref. asiento | respuesta `registerPreObligation` (Contabilidad) |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Generar preobligación | `createBudgetPreCommitment` | `createBudgetPreCommitment` (Presupuestos) + `registerPreObligation` (Contabilidad) |

## Estados de pantalla

- **Sin CDP vigente:** botón deshabilitado; error `CDP_REQUIRED`.
- **Saldo insuficiente:** `BUDGET_UNAVAILABLE` (QA 11 P0).
- **Contabilidad no disponible:** `ACCOUNTING_PROVIDER_UNAVAILABLE`; sin efecto parcial.
- **Éxito:** SOLPED lista para Modalidad de Compra; evento `BudgetPreCommitmentCreated`.

## Notas

- ⚠ Pendiente: secuencial estricto vs. transacción atómica CDP + preobligación.
- ⚠ Pendiente: qué ocurre si se revierte SOLPED tras preobligación activa.
