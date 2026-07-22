# Wireframe: Emisión y aceptación de la OC

**Sub-paso:** 3.14 — Emisión y aceptación de la OC *(Licitación Pública)* — hito contable de la etapa
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md)
**Operación:** `syncPurchaseOrderAccepted` *(misma operación que CA 3.4)* · Dependencias: `readMpProcess` — OC Aceptada (**confirmada**), `commitBudget` (Presupuestos, síncrona bloqueante)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Emisión y aceptación de la OC     [En espera]    |
+----------------------------------------------------------------+
| ## Contexto del contrato                                         |
| Contrato N° ___ · Taller Municipal SpA · $ 178.500.000               |
+----------------------------------------------------------------+
| ## Acción en Mercado Público                                     |
| [ Emitir OC en Mercado Público ]  (deep link, referida a la      |
|   adjudicación)                                                  |
+----------------------------------------------------------------+
| ## Simulación de lectura MP                                      |
| [ Simular lectura MP (demo): OC Aceptada ▾ ]                     |
| [ Ejecutar ]                                                     |
+----------------------------------------------------------------+
| (banner de resultado: aceptada + Compromiso Cierto, o error de   |
|  disponibilidad presupuestaria)                                  |
| Tras aceptación + compromiso → Continuar a 4.1 Recepción Conforme|
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| N° de OC en MP | `PurchaseOrder.mp_oc_id` | No (generado por lectura MP) |
| Monto real (tras aceptación) | `PurchaseOrder.total_amount` | No (solo lectura) |
| Estado OC | `PurchaseOrder.status`, `acceptance_date` | No (generado por lectura MP) |
| Compromiso Cierto | `BudgetCommitment` | No (generado por `commitBudget`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Emitir OC en Mercado Público | — (deep link, navegación pura) | Mercado Público |
| Simular lectura MP (demo) | — *(solo prototipo)* | Ilustra: OC Aceptada / falla de Presupuestos |
| Ejecutar | `syncPurchaseOrderAccepted` | `readMpProcess` (**confirmada**), `commitBudget` (síncrona bloqueante) |

## Estados de pantalla

- **En espera:** sin acción de usuario, solo monitoreo — Interacción MP: **Gestión, hito contable de la etapa**.
- **Aceptada + compromiso OK (camino feliz):** la preobligación ya fue ajustada al monto adjudicado en 3.10, así que la diferencia esperable con el Compromiso Cierto es cero; si no lo es, mismo tratamiento de ajuste/regularización que CA 3.4. Avanza a Recepción Conforme (etapa 4 transversal) y dispara notificaciones. Idempotencia por `purchase_order_ref`.
- **`BUDGET_UNAVAILABLE`:** situación anómala — mismo tratamiento que CA 3.4, tarea urgente a DAF Finanzas (**[PENDIENTE P-40]**).
- **Rechazo de OC post-contrato:** anomalía grave (hay contrato suscrito) — tarea a jurídica, no auto-resolución; solo comparte mecánica con CA 3.5 si no hay contrato de por medio (bajo umbral, sin 3.13).

## Validaciones visibles

- Ninguna de usuario — el hito lo dispara la lectura MP confirmada, no una acción manual.

## Notas

- Comparte operación (`syncPurchaseOrderAccepted`) y mecánica de compromiso contable con CA 3.4 — misma entidad `BudgetCommitment`, mismo evento `PurchaseOrderAccepted`.
- El selector "Simular lectura MP" es artefacto de prototipo.
