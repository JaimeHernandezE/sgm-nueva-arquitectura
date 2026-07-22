# Wireframe: Emisión de la Orden de Compra

**Sub-paso:** 3.3 — Emisión de la Orden de Compra *(Compra Ágil)*  
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
**Operación:** — *(sin POST de usuario; sync `readMpProcess` → `PurchaseOrderIssued` / `ProviderIneligibleBlocked`)* · Dependencia: `readMpProcess` (deseada)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Emisión de la Orden de Compra  [Pendiente en MP] |
+----------------------------------------------------------------+
| ## Contexto de la selección                                      |
| Proveedor: Comercial Sur SpA · Monto ofertado: $ 1.240.000       |
+----------------------------------------------------------------+
| ## Acción en Mercado Público                                     |
| [ Gestionar en MP ]  (deep link — emite la OC en el portal)      |
+----------------------------------------------------------------+
| ## Estado de sincronización                                      |
| Esperando lectura: OC enviada o bloqueo por inhabilidad.        |
| Sin campos de n° OC / monto — solo sync.                        |
+----------------------------------------------------------------+
| ## OC emitida — solo lectura                                     |
| N° OC: 4021-33-SE26 · Estado: Emitida · Badge: Sincronizado     |
+----------------------------------------------------------------+
| ## Bloqueo por inhabilidad                                       |
| Banner: proveedor inhábil. Alternativas:                        |
| [ Seleccionar siguiente oferta (vuelve a 3.2 en MP) ]           |
| [ Cancelar proceso (3.6) ]                                       |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| N° OC / proveedor / monto / estado | `PurchaseOrder.*` | Solo lectura tras sync |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Gestionar en MP | — (deep link, navegación pura) | Mercado Público |
| Seleccionar siguiente oferta / Cancelar | — (navegación / decisión SGM tras evento) | Tras `ProviderIneligibleBlocked` |
| Simular lectura (demo) | — *(solo prototipo)* | Ilustra hábil vs inhábil |

## Estados de pantalla

- **Pendiente:** deep link + badge `Pendiente en MP`.
- **Hábil (camino feliz):** `PurchaseOrder` en `issued` por sync; evento `PurchaseOrderIssued`; habilita 3.4.
- **Inhábil (gestión):** evento `ProviderIneligibleBlocked`; tarea con alternativas en SGM (decisión fuera de MP).

## Validaciones visibles

- Ninguna de captura de datos MP en SGM.

## Notas

- OC emitida por monto distinto al ofertado → el monto que vale es el de la OC; se toma de la lectura de aceptación en 3.4.
- Modo degradado: pendiente + deep link hasta lectura (plantilla §5.3).
