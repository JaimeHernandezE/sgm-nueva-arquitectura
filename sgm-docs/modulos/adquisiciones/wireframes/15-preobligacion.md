# Wireframe: Generación de preobligación

**Sub-paso:** 1.6 — Generación de preobligación  
**Rol:** Firmante CDP (`adq.firmante_cdp`) — catálogo [`catalogo-roles.md`](../../../arquitectura/catalogo-roles.md)  
**Operación:** `createBudgetPreCommitment`

## Layout

```
+----------------------------------------------------------+
| Expediente ADQ-2026-00142                    [En curso]   |
+----------------------------------------------------------+
| SOLPED #1234 — Preobligación presupuestaria               |
+----------------------------------------------------------+
| CDP vigente           CDP-2026-00891  (firmado 02/07/26)  |
| Línea presupuestaria (solo lectura)  Cuenta / Programa ...   |
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

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| CDP vigente | `BudgetPreCommitment.budget_availability_certificate_id` | Sí (solo lectura) |
| Línea presupuestaria | `BudgetPreCommitment.budget_line_id` | No (solo lectura, heredada) |
| Monto preobligación | `BudgetPreCommitment.estimated_amount` | Sí |
| Año fiscal | `BudgetPreCommitment.fiscal_year` | Sí |
| Ref. asiento | respuesta `registerPreObligation` | No (generado por sistema) |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Generar preobligación | `createBudgetPreCommitment` | `createBudgetPreCommitment` (Presupuestos) + `registerPreObligation` (Contabilidad) |

## Estados de pantalla

- **Sin CDP vigente:** botón deshabilitado; error `CDP_REQUIRED`.
- **Saldo insuficiente:** `BUDGET_UNAVAILABLE` (QA 11 P0).
- **Contabilidad no disponible:** `ACCOUNTING_PROVIDER_UNAVAILABLE`; sin efecto parcial.
- **Éxito:** SOLPED lista para Modalidad de Compra; evento `BudgetPreCommitmentCreated`.

## Validaciones visibles

- Asterisco en monto preobligación y año fiscal.
- Botón deshabilitado sin CDP vigente.

## Notas

- ⚠ Pendiente: secuencial estricto vs. transacción atómica CDP + preobligación.
- ⚠ Pendiente: qué ocurre si se revierte SOLPED tras preobligación activa.
