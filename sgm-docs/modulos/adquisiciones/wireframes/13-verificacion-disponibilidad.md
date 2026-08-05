# Wireframe: Clasificación y verificación presupuestaria

**Sub-paso:** 1.3 — Clasificación y verificación presupuestaria  
**Rol:** Formulador DAF / verificación (`adq.formulador_presupuesto`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
**Operación:** `verifyBudgetAvailability`  
**Dependencias:** `listManagementNodes`, `checkBudgetAvailability`

## Layout

```
+----------------------------------------------------------+
| Expediente ADQ-2026-00142                    [En curso]   |
+----------------------------------------------------------+
| SOLPED #1420 — Clasificación y verificación               |
+----------------------------------------------------------+
| Contexto SOLPED (solo lectura)                            |
| Título: Insumos de oficina — reposición anual             |
| Justificación: Reposición de stock según plan anual       |
| Unidad destino: Dirección de Administración               |
| Propuesta (si hay):                                       |
|   Nodo: Adm. › Prog. Gest. › … › Act. Oficina             |
|   Cuenta: 22.01.03 — Insumos oficina                      |
|   [PENDIENTE P-28] — propuesta no vinculante              |
+----------------------------------------------------------+
| Clasificación presupuestaria *                            |
| Nodo de gestión (hoja) *  [ Adm. › … › Act. Oficina    v ]|
|   (listManagementNodes; path derivado — D-5)              |
| Imputación / cuenta *     [ 22.01.03 — Insumos …       v ]|
| Monto estimado *          [ $ 2.450.000 ]                 |
| Año fiscal *              [ 2026 ]                        |
| Banner si diverge de propuesta: «Imputación distinta a la |
|   propuesta del solicitante» (imputation_diverged)        |
| Pre-sugerencia por unidad si sin propuesta [PENDIENTE P-23]|
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
| Título / justificación / unidad destino | `PurchaseRequest.*` (solo lectura) | — |
| Nodo propuesto (lectura) | `PurchaseRequest.proposed_management_node_id` | — |
| Cuenta propuesta (lectura) | `PurchaseRequest.proposed_budget_line_id` | — |
| Nodo de gestión (hoja) | resolución → `BudgetAvailabilityCertificate.management_node_id` | Sí al confirmar |
| Imputación / cuenta | resolución → `BudgetAvailabilityCertificate.budget_line_id` | Sí al confirmar |
| Monto estimado | entrada de verificación | Sí |
| Año fiscal | entrada de verificación | Sí |
| Comentarios | entrada `verifyBudgetAvailability` | Sí si rechazo |
| Panel saldo | respuesta `checkBudgetAvailability` (par resuelto) | No (solo lectura) |
| Divergencia | `BudgetAvailabilityCertificate.imputation_diverged` | Sí (calculado al confirmar) |
| Verificador | `BudgetAvailabilityCertificate.verified_by` | Sí (al confirmar) |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Confirmar | `verifyBudgetAvailability` (`decision = confirmed`) | `listManagementNodes`, `checkBudgetAvailability` |
| Rechazar | `verifyBudgetAvailability` (`decision = rejected`) | — |
| Solicitar financiamiento | navega a sub-paso 1.4 | — |

## Estados de pantalla

- **Saldo insuficiente (caso demo `ADQ-2026-00142`):** panel en rojo; «Confirmar» deshabilitado; «Solicitar financiamiento» habilitado → sub-paso 1.4. En el expediente, 1.5–1.6 y etapas 2–5 quedan pendientes/bloqueados.
- **Presupuestos no disponible:** banner `BUDGET_PROVIDER_UNAVAILABLE`; reintento.
- **Confirmado:** avance a 1.5 (emisión CDP) con imputación resuelta.
- **Divergencia:** banner informativo; no bloquea confirmar.

## Validaciones visibles

- Nodo hoja e imputación obligatorios al confirmar (resolución DAF — D-6).
- Panel de trazabilidad siempre visible antes de confirmar (QA 8).
- Comentarios obligatorios si se rechaza.

## Notas

- El Formulador DAF / verificación (`adq.formulador_presupuesto`) no puede firmar el CDP (1.5; rol Firmante CDP / `adq.firmante_cdp`) — SoD S2 / QA 9.
- Fixture / prototipo del camino sin saldo: [`ADQ-2026-00142`](../fixtures/ADQ-2026-00142.yaml) · timeline en `sgm-prototipos/shared/demo-data/compra-agil-sin-saldo.js`.
