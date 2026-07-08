# Wireframe: Rechazo de la OC

**Sub-paso:** 3.5 — Rechazo de la OC *(Compra Ágil, excluyente con 3.4)*
**Sin operación de registro propia** — reflejo de lectura MP (`readMpProcess`, deseada) → evento `PurchaseOrderRejected`.

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Rechazo de la OC                    [Rechazada]  |
+----------------------------------------------------------------+
| [OC rechazada — solo lectura / registro manual]                 |
| OC N° 4021-33-SE26 · Proveedor: Comercial Sur SpA                |
| Motivo (si MP lo trae): [________________________]              |
+----------------------------------------------------------------+
| Tarea de decisión                                                |
| ( ) Emitir OC a la segunda mejor oferta (vuelve a 3.2/3.3)       |
| ( ) Cancelar y republicar (nueva cotización, re-vinculación 2.3) |
+----------------------------------------------------------------+
| [ Continuar con la decisión ]                                    |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo |
|---|---|
| Motivo del rechazo | `PurchaseOrder.rejection_reason` |
| Estado OC | `PurchaseOrder.status = rejected_by_supplier`, `.rejected_at` |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Emitir a segunda mejor oferta | — (reejecuta 3.2 → 3.3 con nuevo proveedor) | — |
| Cancelar y republicar | — (re-vinculación, misma operación `linkMpProcess` de 2.3, nuevo `mp_process_id`) | Mercado Público |

## Estados de pantalla

- **Modo degradado:** el usuario registra el rechazo manualmente al verlo en MP (`entry_mode = manual`); la tarea de decisión se crea igual.
- **Sin segunda oferta válida:** única vía es cancelar y republicar, o escalar a 3.6 (proceso fallido).

## Validaciones visibles

- Ninguna bloqueante propia — el rechazo es un hecho reflejado, no una decisión del usuario.

## Notas

- No hay vínculo legal tras el rechazo; la preobligación (1.6) se mantiene intacta — no se libera aquí.
- Rechazos sucesivos de todas las ofertas → equivalente funcional a proceso fallido; ver 3.6.
