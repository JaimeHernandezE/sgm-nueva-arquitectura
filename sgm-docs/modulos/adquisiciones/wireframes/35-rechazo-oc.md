# Wireframe: Rechazo de la OC

**Sub-paso:** 3.5 — Rechazo de la OC *(Compra Ágil, excluyente con 3.4)*  
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../arquitectura/catalogo-roles.md)  
**Sin operación de registro propia** — reflejo de lectura MP (`readMpProcess`, deseada) → evento `PurchaseOrderRejected`.

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Rechazo de la OC                    [Rechazada]  |
+----------------------------------------------------------------+
| [OC rechazada — solo lectura / registro manual]                 |
| OC N° 4021-33-SE26 · Proveedor: Comercial Sur SpA                |
| Motivo (opcional — si MP lo trae) [________________________]              |
+----------------------------------------------------------------+
| Tarea de decisión *                                              |
| ( ) Emitir OC a la segunda mejor oferta (vuelve a 3.2/3.3)       |
| ( ) Cancelar y republicar (nueva cotización, re-vinculación 2.3) |
+----------------------------------------------------------------+
| [ Continuar con la decisión ]                                    |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Motivo del rechazo | `PurchaseOrder.cancellation_reason` | No (opcional) |
| Decisión (radios) | navegación a 3.2/3.3 o 2.3 | Sí |
| Estado OC | `PurchaseOrder.status` | No (generado: `rejected_by_supplier`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Emitir a segunda mejor oferta | — (reejecuta 3.2 → 3.3 con nuevo proveedor) | — |
| Cancelar y republicar | — (re-vinculación, misma operación `linkMpProcess` de 2.3, nuevo `mp_process_id`) | Mercado Público |

## Estados de pantalla

- **Modo degradado:** el usuario registra el rechazo manualmente al verlo en MP (`entry_mode = manual`); la tarea de decisión se crea igual.
- **Sin segunda oferta válida:** única vía es cancelar y republicar, o escalar a 3.6 (proceso fallido).

## Validaciones visibles

- Decisión obligatoria (elegir una opción antes de continuar).
- Motivo opcional (solo si MP lo entrega).

## Notas

- No hay vínculo legal tras el rechazo; la preobligación (1.6) se mantiene intacta — no se libera aquí.
- Rechazos sucesivos de todas las ofertas → equivalente funcional a proceso fallido; ver 3.6.
