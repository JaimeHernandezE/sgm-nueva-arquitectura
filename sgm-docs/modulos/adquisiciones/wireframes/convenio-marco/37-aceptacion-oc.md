# Wireframe: Emisión y aceptación de la OC (hito contable)

**Sub-paso:** 3.7 — Emisión y aceptación de la OC *(Convenio Marco)*
**Rol:** N/A — acto del proveedor en MP; efectos automáticos en SGM
**Operación:** `syncPurchaseOrderAccepted` *(reutiliza CA 3.4 / LP 3.14)* · Dependencias: `readMpProcess` (OC Aceptada, **confirmada**), `commitBudget` (Presupuestos, síncrona bloqueante) · Eventos: `PurchaseOrderAccepted`, `BudgetCommitmentCreated`

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Emisión y aceptación de la OC     [En espera]     |
+----------------------------------------------------------------+
| Contexto: OC de catálogo / de Gran Compra emitida en MP           |
| Proveedor: Mobiliario Chile Ltda. · Monto ofertado: $ 4.650.000    |
+----------------------------------------------------------------+
| [ Gestionar en MP ] (deep link, solo lectura)                     |
+----------------------------------------------------------------+
| Simulación de lectura MP (solo demo)                               |
| [ OC Aceptada — compromiso OK ▾ ]                                  |
| [ Ejecutar ]                                                        |
+----------------------------------------------------------------+
| (banner: OC Aceptada · commitBudget OK · Compromiso Cierto         |
|  registrado — avanza a Recepción Conforme, etapa 4 transversal)    |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| N° OC | `PurchaseOrder.mp_oc_number` *(crea por sync)* | No (solo lectura) |
| Proveedor | `PurchaseOrder.provider_rut` | No (solo lectura) |
| Monto real | `PurchaseOrder.amount` | No (solo lectura) |
| Estado | `PurchaseOrder.status` (`accepted`) | No (generado) |
| Compromiso presupuestario | `BudgetCommitment` *(vía `commitBudget`, entidad del módulo Presupuestos)* | No (generado) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Gestionar en MP | — (deep link, solo lectura) | Mercado Público |
| *(automático al recibir la lectura)* | `syncPurchaseOrderAccepted` | `readMpProcess` (confirmada) + `commitBudget` (Presupuestos, síncrona bloqueante) |

Sin operación de escritura manual del usuario: el hito se dispara al recibir la lectura confirmada de MP.

## Estados de pantalla

- **Camino feliz:** OC Aceptada (única lectura MP **confirmada** de toda la etapa) → `commitBudget` ajusta la preobligación al monto real, libera excedente si el real es menor, emite `PurchaseOrderAccepted` → expediente avanza a Recepción Conforme (etapa 4 transversal).
- **`BUDGET_UNAVAILABLE`:** monto real > preobligación y la línea no tiene saldo para la diferencia (`severity: blocking`). Situación anómala grave — OC ya aceptada legalmente pero el compromiso contable no puede registrarse; tarea urgente a DAF Finanzas (**[PENDIENTE P-40]**).
- **Monto real < preobligación:** compromiso por el real y liberación automática del excedente (regla estándar, sin intervención).
- **Proveedor de presupuesto no disponible:** reintento con retroceso; estado intermedio visible ("OC aceptada, compromiso pendiente") — nunca se pierde el hito ni se duplica el compromiso (idempotencia por `purchase_order_ref`).

## Validaciones visibles

| Regla | Severidad | Error |
|---|---|---|
| Saldo presupuestario al comprometer por el monto real | blocking | `BUDGET_UNAVAILABLE` |

## Notas

- Interacción MP: **Gestión — hito contable de la etapa.** Sin modo degradado necesario para el camino feliz (la lectura es confirmada, no deseada).
- Mismo contrato exacto que Compra Ágil 3.4 y Licitación Pública 3.14 — reutilización íntegra, sin variante propia de CM.
