# Wireframe: Emisión de OC y aceptación del proveedor

**Sub-paso:** 3.3 — Emisión de OC y aceptación *(Trato Directo, hito contable — excluyente con 3.4)*
**Rol:** N/A (acto del proveedor en MP; efectos automáticos en SGM)
**Operación:** `syncPurchaseOrderAccepted` · Dependencias: `readMpProcess` (OC Aceptada, confirmada) + estado Publicado (deseada), `commitBudget` · Eventos: `PurchaseOrderAccepted`, `BudgetCommitmentCreated`

## Layout

```
+----------------------------------------------------------------+
| ADQ-2026-00012 — OC aceptada → Compromiso Cierto  [Hito]        |
+----------------------------------------------------------------+
| ## Contexto de la OC                                             |
| Proceso MP vinculado: 4021-05-TD26 · Estado Publicado: ✓         |
| OC N° 4021-05-TD26-OC · Repuestos Industriales SpA · $ 2.400.000|
+----------------------------------------------------------------+
| ## Sincronización (demo)                                         |
| Simular lectura MP [ OC Aceptada + Publicado ▼ ]                 |
|   opciones: ok | MP_PROCESS_NOT_PUBLISHED | BUDGET_UNAVAILABLE   |
|            | PRE_COMMITMENT_INACTIVE | MP_PROVIDER_UNAVAILABLE   |
| [ Sincronizar OC aceptada ]                                      |
+----------------------------------------------------------------+
| ## Resultado                                                     |
| (banner: compromiso cierto registrado / código de bloqueo)       |
| [ Continuar a recepción conforme ]                               |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Estado OC | `PurchaseOrder.status` (= `accepted`) | No (sync) |
| Monto | `PurchaseOrder.total_amount` | No (sync) |
| Compromiso | `BudgetCommitment.committed_amount` | No (vía `commitBudget`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Sincronizar OC aceptada | `syncPurchaseOrderAccepted` | MP + Presupuestos |

## Estados de pantalla

- **Camino feliz:** doble validación OK → Compromiso Cierto → etapa 4.
- **Bloqueo Publicado:** `MP_PROCESS_NOT_PUBLISHED`.
- **Bloqueo presupuesto / preobligación / MP:** códigos de ficha §3.3.

## Validaciones visibles

- Sin captura de formulario de usuario; códigos de dependencia al sync.

## Notas

- Interacción MP: **Gestión — hito contable**. Clasificación asíncrona — **[PENDIENTE P-70]**.
- También: Presupuestos (borde módulo, tinte secundario).
