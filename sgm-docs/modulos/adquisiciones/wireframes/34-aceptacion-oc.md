# Wireframe: Aceptación de la OC (perfeccionamiento del vínculo)

**Sub-paso:** 3.4 — Aceptación de la OC *(Compra Ágil)* — **hito crítico de la etapa**  
**Rol:** N/A (automático / gatillado por lectura MP confirmada)  
**Operación:** `syncPurchaseOrderAccepted` · Dependencias: `readMpProcess` — OC Aceptada (**confirmada**), `commitBudget` (Presupuestos, síncrona bloqueante)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Aceptación de la OC              [En espera]     |
+----------------------------------------------------------------+
| [OC emitida — solo lectura]                                     |
| OC N° 4021-33-SE26 · Proveedor: Comercial Sur SpA · $ 1.240.000  |
| Esperando aceptación del proveedor en MP…                        |
+----------------------------------------------------------------+
| [ Simular lectura MP (demo): OC Aceptada ▾ ]                     |
| [ Ejecutar ]                                                     |
+----------------------------------------------------------------+
| (banner de resultado: aceptada + compromiso, o error de          |
|  disponibilidad presupuestaria)                                  |
+----------------------------------------------------------------+
| Tras aceptación + compromiso → Continuar (vuelve al expediente o a 4.1 Recepción conforme) |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Monto real (tras aceptación) | `PurchaseOrder.total_amount` | No (solo lectura) |
| Estado OC | `PurchaseOrder.status`, `acceptance_date` | No (generado por lectura MP) |
| Compromiso Cierto | `BudgetCommitment` | No (generado por `commitBudget`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Simular lectura MP (demo) | — *(solo prototipo)* | Ilustra: OC Aceptada / rechazo (ir a 3.5) / falla de Presupuestos |
| Ejecutar | `syncPurchaseOrderAccepted` | `readMpProcess` (confirmada), `commitBudget` (síncrona bloqueante) |

## Estados de pantalla

- **En espera:** Rol N/A — no hay acción de usuario, solo monitoreo (Interacción MP: Gestión, hito crítico).
- **Aceptada + compromiso OK:** monto real puede diferir del estimado en la preobligación (1.6); si es menor, libera el excedente automáticamente (sin intervención); si es mayor y hay saldo, compromete la diferencia.
- **`BUDGET_UNAVAILABLE`** (monto real > preobligación sin saldo): situación anómala grave — la OC ya está aceptada (vínculo legal existe) pero el compromiso contable no puede registrarse; tarea urgente a DAF Finanzas — **[PENDIENTE P-40]**, el sistema no la resuelve solo pero no debe pasar silenciosamente.
- **Presupuestos no disponible:** reintento con retroceso; estado intermedio visible "aceptada, compromiso pendiente" — nunca se pierde el hito ni se duplica el compromiso (idempotencia por `purchase_order_ref`).
- **Rechazo (variante):** ver 3.5 — excluyente con esta aceptación.

## Validaciones visibles

- Ninguna de usuario — el hito lo dispara la lectura MP, no una acción manual.

## Notas

- Es el hito contable mayor del macroproceso: perfecciona el vínculo legal (Compra Ágil no requiere contrato ni resolución) y avanza el expediente a Recepción Conforme (etapa 4, prototipo 4.1).
- El selector "Simular lectura MP" es un artefacto de prototipo — en producción esto llega vía `readMpProcess` (push o polling), nunca por acción de un usuario en esta pantalla.
