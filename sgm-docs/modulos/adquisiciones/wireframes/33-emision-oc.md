# Wireframe: Emisión de la Orden de Compra

**Sub-paso:** 3.3 — Emisión de la Orden de Compra *(Compra Ágil)*  
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
**Operación:** `registerPurchaseOrder` · Dependencia: `readMpProcess` (deseada)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Emisión de la Orden de Compra       [Pendiente]  |
+----------------------------------------------------------------+
| Contexto de la oferta (solo lectura)                          |
| Proveedor: Comercial Sur SpA · Monto ofertado: $ 1.240.000       |
+----------------------------------------------------------------+
| Acceso a Mercado Público                                       |
| [ Gestionar en MP ]  (deep link — emite la OC en el portal)      |
+----------------------------------------------------------------+
| Registro de la OC                                              |
| N° de OC en Mercado Público *                                    |
| [ 4021-33-SE26                                ]                  |
|                                                                   |
| [ Simular revalidación de habilidad (demo): Hábil ▾ ]             |
|                                                                   |
| [ Validar y registrar OC ]                                       |
+----------------------------------------------------------------+
| Resultado de validación                                        |
| (banner de éxito, o de bloqueo por inhabilidad con alternativas) |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| N° de OC en MP | `PurchaseOrder.mp_oc_id` | Sí |
| Proveedor (heredado) | `PurchaseOrder.supplier_rut` | No (solo lectura) |
| Monto (heredado) | `PurchaseOrder.total_amount` | No (solo lectura) |
| Estado tras emitir | `PurchaseOrder.status` | Sí (generado: `issued`) |
| Modo de registro | `PurchaseOrder.entry_mode` | Sí |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Gestionar en MP | — (deep link, navegación pura) | Mercado Público |
| Validar y registrar OC | `registerPurchaseOrder` | `readMpProcess` (deseada) |
| Simular revalidación (demo) | — *(solo prototipo)* | Ilustra bloqueo por inhabilidad del proveedor |

## Estados de pantalla

- **Hábil (camino feliz):** `PurchaseOrder` se crea en `status = issued`; evento `PurchaseOrderIssued`; habilita 3.4.
- **Inhábil (gestión):** evento `ProviderIneligibleBlocked`; se crea tarea con dos alternativas: **seleccionar siguiente oferta** (vuelve a 3.2) o **cancelar** (va a 3.6, variante de proceso fallido).
- **Modo degradado:** sin lecturas MP, el estado "OC enviada" se infiere del registro manual de 3.2 + deep link; el bloqueo por inhabilidad solo se conoce cuando el usuario lo ve en MP y lo registra manualmente.

## Validaciones visibles

- N° de OC obligatorio para registrar.

## Notas

- **Nota de reconciliación:** el estado se crea aquí como `issued` (no `sent`) y el evento es `PurchaseOrderIssued` (no `PurchaseOrderSent`), consistentes con el enum canónico de `entidades-core.md`.
- OC emitida por monto distinto al ofertado (corrección en MP) → el monto que vale es el de la OC; se toma de la lectura de aceptación en 3.4, no se corrige aquí.
