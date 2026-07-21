# Wireframe: Solicitar financiamiento a DAF

**Sub-paso:** 1.4 — Solicitar financiamiento a DAF *(optativo)*  
**Rol:** Solicitante (`adq.solicitante`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
**Operación:** `requestBudgetFinancing`

## Layout

```
+----------------------------------------------------------+
| Expediente ADQ-2026-00142                    [En curso]   |
+----------------------------------------------------------+
| SOLPED #1420 — Solicitud de financiamiento presupuestario |
+----------------------------------------------------------+
| Solicitud de financiamiento                               |
| Motivo / justificación *  [________________________]      |
|                           [________________________]      |
| Estado: En trámite — modificación/reasignación presupuesto|
| (proceso externo a Adquisiciones)                         |
+----------------------------------------------------------+
| [ Cancelar ]                    [ Enviar solicitud ]      |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Motivo / justificación | entrada `requestBudgetFinancing` | Sí |
| Estado expediente | `PurchaseRequest.status` | Sí (generado: `pending_budget_financing`) |

## Acciones

| Botón | Operación contrato | Efecto |
|---|---|---|
| Enviar solicitud | `requestBudgetFinancing` | Evento `BudgetFinancingRequested`; sin avance del ciclo principal |

## Estados de pantalla

- **En trámite:** pantalla informativa; el Solicitante espera resolución de Presupuestos.
- **Resuelto:** notificación; retorno a sub-paso 1.3 para nueva verificación.
- **Denegado:** SOLPED bloqueada; opción cancelar o reformular.

## Validaciones visibles

- Asterisco en motivo / justificación.

## Notas

- Sub-paso optativo — solo accesible desde 1.3 cuando no hay saldo o verificación rechazada.
- Caso demo: expediente [`ADQ-2026-00142`](../fixtures/ADQ-2026-00142.yaml) — único paso activo en el timeline; 1.5–1.6 y etapas 2–5 pendientes.
- ⚠ Pendiente: contrato del módulo Presupuestos para modificación/reasignación.
