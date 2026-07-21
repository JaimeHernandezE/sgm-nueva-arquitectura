# Wireframe: Verificación de disponibilidad presupuestaria

**Sub-paso:** 1.3 — Verificación de disponibilidad presupuestaria  
**Rol:** Formulador DAF / verificación (`adq.formulador_presupuesto`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
**Operación:** `verifyBudgetAvailability`

## Layout

```
+----------------------------------------------------------+
| Expediente ADQ-2026-00142                    [En curso]   |
+----------------------------------------------------------+
| SOLPED #1420 — Verificación presupuestaria                |
+----------------------------------------------------------+
| Verificación presupuestaria                               |
| Línea presupuestaria *    [ 22.01.03 — Insumos …     v ]  |
| Monto estimado *          [ $ 2.450.000 ]                 |
| Año fiscal *              [ 2026 ]                        |
+----------------------------------------------------------+
| Disponibilidad presupuestaria                             |
| +------------------------------------------------------+  |
| | Saldo disponible actual:        $   320.000          |  |
| | Comprometido otras SOLPED:      $   180.000          |  |
| | Monto esta solicitud:           $ 2.450.000          |  |
| | Saldo proyectado:               $ -2.310.000 [INSUF.]|  |
| +------------------------------------------------------+  |
+----------------------------------------------------------+
| Decisión                                                  |
| Comentarios (obligatorio si rechazo)  [________________________]      |
| [ Rechazar ]    [ Solicitar financiamiento ]  [ Confirmar*]|
| (* Confirmar deshabilitado — saldo insuficiente)          |
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

- **Saldo insuficiente (caso demo `ADQ-2026-00142`):** panel en rojo; «Confirmar» deshabilitado; «Solicitar financiamiento» habilitado → sub-paso 1.4. En el expediente, 1.5–1.6 y etapas 2–5 quedan pendientes/bloqueados.
- **Presupuestos no disponible:** banner `BUDGET_PROVIDER_UNAVAILABLE`; reintento.
- **Confirmado:** avance a 1.5 (emisión CDP).

## Validaciones visibles

- Panel de trazabilidad siempre visible antes de confirmar (QA 8).
- Comentarios obligatorios si se rechaza.

## Notas

- El Formulador DAF / verificación (`adq.formulador_presupuesto`) no puede firmar el CDP (1.5; rol Firmante CDP / `adq.firmante_cdp`) — SoD S2 / QA 9.
- Fixture / prototipo del camino sin saldo: [`ADQ-2026-00142`](../fixtures/ADQ-2026-00142.yaml) · timeline en `sgm-prototipos/shared/demo-data/compra-agil-sin-saldo.js`.
