# Wireframe: Rechazo de la OC

**Sub-paso:** 3.5 — Rechazo de la OC *(Compra Ágil, excluyente con 3.4)*  
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
**Sin operación de registro propia** — reflejo de lectura MP (`readMpProcess`, deseada) → evento `PurchaseOrderRejected`. La decisión del usuario es la única acción editable en SGM.

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Rechazo de la OC              [Esperando sync MP]|
+----------------------------------------------------------------+
| (Pendiente de lectura)                                         |
| [ Gestionar en MP ]  · Badge: Esperando sync MP                 |
| Sin campos de transcripción del rechazo.                        |
+----------------------------------------------------------------+
| Tras sync — contexto OC (solo lectura)                         |
| OC N° 4021-33-SE26 · Proveedor: Comercial Sur SpA                |
| Motivo (si MP lo trae): …                                        |
+----------------------------------------------------------------+
| Tarea de decisión (habilitada solo tras sync)                  |
| ( ) Emitir OC a la segunda mejor oferta (vuelve a 3.2/3.3)       |
| ( ) Cancelar y republicar (nueva cotización, re-vinculación 2.3) |
+----------------------------------------------------------------+
| [ Continuar con la decisión ]                                    |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Motivo del rechazo | `PurchaseOrder.rejection_reason` | No — solo lectura si MP lo trae |
| Decisión (radios) | navegación a 3.2/3.3 o 2.3 | Sí (editable SGM) |
| Estado OC | `PurchaseOrder.status` | No (generado por sync: `rejected_by_supplier`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Gestionar en MP | — (deep link) | Mercado Público |
| Emitir a segunda mejor oferta | — (reejecuta 3.2 → 3.3 con nuevo proveedor) | Tras `PurchaseOrderRejected` |
| Cancelar y republicar | — (re-vinculación `linkMpProcess` de 2.3) | Tras `PurchaseOrderRejected` |

## Estados de pantalla

- **Esperando sync:** deep link + badge; sin tarea de decisión ni campos de rechazo.
- **Tras sync:** detalle RO + radios de decisión (única captura en SGM).
- **Sin segunda oferta válida:** única vía es cancelar y republicar, o escalar a 3.6.

## Validaciones visibles

- Decisión obligatoria (elegir una opción antes de continuar), solo cuando el rechazo ya está sincronizado.

## Notas

- No hay vínculo legal tras el rechazo; la preobligación (1.6) se mantiene intacta — no se libera aquí.
- Rechazos sucesivos de todas las ofertas → equivalente funcional a proceso fallido; ver 3.6.
- Modo degradado: pendiente hasta lectura (plantilla §5.3) — no hay `entry_mode = manual`.
