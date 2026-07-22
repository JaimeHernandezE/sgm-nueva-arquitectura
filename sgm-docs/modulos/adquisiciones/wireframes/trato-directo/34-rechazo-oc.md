# Wireframe: Rechazo de la OC

**Sub-paso:** 3.4 — Rechazo de la OC *(Trato Directo, condicional — excluyente con 3.3)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/especificacion/catalogo-roles.md)
**Operación:** `recordPurchaseOrderRejectionDecision` · Dependencia: `readMpProcess` (OC Rechazada, deseada) · Evento: `PurchaseOrderRejected` · **[PENDIENTE P-69]**

## Layout

```
+----------------------------------------------------------------+
| ADQ-2026-00012 — Rechazo de la OC            [Camino alternativo]|
+----------------------------------------------------------------+
| ## Contexto del rechazo                                          |
| El proveedor rechazó la OC (o no respondió en plazo).            |
| No hay vínculo legal — la preobligación se mantiene intacta.     |
| En TD suele haber un solo proveedor seleccionado.                |
+----------------------------------------------------------------+
| ## Decisión *                                                     |
| ( ) Reiniciar desde modalidad (nueva Resolución Fundada)         |
| ( ) Cancelar expediente (liberar preobligación)                  |
| [ Confirmar decisión ]                                           |
+----------------------------------------------------------------+
| (banner: decisión registrada — P-69 pendiente de validación DM)  |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Estado OC | `PurchaseOrder.status` (`rejected_by_supplier`) | No (sync) |
| Motivo | `PurchaseOrder.rejection_reason` | No |
| Decisión | Pantalla (`restart_modality` \| `cancel`) | Sí |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Confirmar decisión | `recordPurchaseOrderRejectionDecision` | `releasePreCommitment` si `cancel` |

## Estados de pantalla

- **Reiniciar modalidad:** retorna a etapa 2 (propuesto).
- **Cancelar:** libera preobligación.
- Enum y camino exacto — **[PENDIENTE P-69]**.

## Validaciones visibles

| Regla | Severidad | Error |
|---|---|---|
| Proveedor presupuesto disponible si cancelar | blocking | `BUDGET_PROVIDER_UNAVAILABLE` |

## Notas

- Interacción MP: **Gestión.** Lectura deseada.
