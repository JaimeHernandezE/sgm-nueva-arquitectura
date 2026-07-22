# Wireframe: Rechazo de la OC

**Sub-paso:** 3.8 — Rechazo de la OC *(Convenio Marco, condicional — excluyente con 3.7, solo si el proveedor rechaza)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/especificacion/catalogo-roles.md)
**Operación:** `recordPurchaseOrderRejectionDecision` · Dependencia: `readMpProcess` (OC Rechazada, deseada) · Evento: `PurchaseOrderRejected` (al recibir la lectura; la decisión del usuario no emite evento nuevo)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Rechazo de la OC              [Camino alternativo]|
+----------------------------------------------------------------+
| El proveedor rechazó la OC en Mercado Público.                    |
| Causal (si la lectura la trae): inconsistencia de valores/         |
| cantidades / dirección de despacho inválida                       |
| No hay vínculo legal — la preobligación se mantiene intacta.       |
+----------------------------------------------------------------+
| Decisión *                                                         |
| ( ) Emitir OC al siguiente proveedor del catálogo / oferente       |
| ( ) Republicar (nuevo proceso MP, mismo folio)                     |
+----------------------------------------------------------------+
| [ Confirmar decisión ]                                             |
+----------------------------------------------------------------+
| (banner: decisión registrada — reejecuta 3.7 con nuevo proveedor,  |
|  o retoma 3.2/3.3 con nuevo mp_process_id)                         |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Estado de la OC | `PurchaseOrder.status` (`rejected`) *(crea/actualiza por sync)* | No (generado) |
| Motivo de rechazo | `PurchaseOrder.rejection_reason` (si la lectura lo trae) | No |
| Decisión del usuario | Pantalla — única acción editable en SGM tras el evento | Sí |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Confirmar decisión | `recordPurchaseOrderRejectionDecision` | — |

## Estados de pantalla

- **Emitir OC al siguiente proveedor (camino feliz, ruta con alternativa disponible):** reejecuta 3.7 con el siguiente proveedor del catálogo (Compra Directa) o el siguiente oferente (Gran Compra).
- **Republicar:** nuevo proceso MP, nuevo `mp_process_id` — el mismo `ProcurementCase` se reutiliza con su folio original, trazado; retoma desde 3.2 o 3.3 según corresponda.
- **Sin proveedor alternativo en catálogo:** única vía es republicar o reevaluar modalidad (reversión a etapa 2 con nueva `ModalityDecision`, según procedimiento de reversión pendiente en 2.1).
- **Rechazos sucesivos que agotan proveedores disponibles:** equivalente funcional a proceso fallido; misma decisión que 3.6. **[PENDIENTE P-68]** límite de reintentos sin definir.
- **Modo degradado:** badge `Esperando sync MP` + deep link mientras no llega la lectura; sin transcripción del rechazo. La tarea de decisión se crea **solo** cuando llega la lectura.

## Validaciones visibles

| Regla | Severidad | Error |
|---|---|---|
| Existe proveedor alternativo en catálogo si la decisión es "siguiente proveedor" | blocking | `NO_ALTERNATIVE_PROVIDER_AVAILABLE` |

## Notas

- Interacción MP: **Gestión.** Solo puede rechazarse por las causales contractuales establecidas en las bases del Convenio Marco específico.
- Evento crítico a negociar con ChileCompra — lectura **deseada**, no confirmada.
