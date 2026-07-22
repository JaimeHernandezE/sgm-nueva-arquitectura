# Wireframe: Gran Compra desierta

**Sub-paso:** 3.6 — Gran Compra desierta *(Convenio Marco, condicional — período de competencia cierra sin ofertas)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/especificacion/catalogo-roles.md)
**Operación:** *(sin operación declarada — transición automática tras lectura MP)* · Dependencia: `readMpProcess` (deseada) · Evento: `GranCompraDesierta`

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Gran Compra desierta          [Camino alternativo]|
+----------------------------------------------------------------+
| Período de competencia cerrado sin ofertas (24-03-2026)            |
+----------------------------------------------------------------+
| El expediente cae automáticamente a Compra Directa por Catálogo:  |
|   Ruta anterior: gran_compra → Ruta nueva: compra_directa          |
|   ID Intención de Compra anterior: 4021-88-IC26 (invalidado)       |
|   Mismo folio ADQ-2026-00089 — no se cancela ni se crea uno nuevo  |
+----------------------------------------------------------------+
| [ Continuar a Compra Directa por Catálogo (3.2) ]                  |
+----------------------------------------------------------------+
| (banner: transición registrada en auditoría con ambos valores      |
|  de procurement_route)                                            |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Ruta nueva | `ProcurementCase.procurement_route` (actualiza de `gran_compra` a `compra_directa`) | Sí |
| ID de Intención de Compra anterior | `ProcurementCase.mp_process_id` (se invalida; nuevo ID se registra en 3.2) | — |
| Fecha de vinculación | `ProcurementCase.mp_linked_at` (se resetea para la nueva vinculación) | — |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Continuar a Compra Directa por Catálogo | — (navegación a 3.2) | — |

Sin operación de escritura propia: la transición la dispara el evento `GranCompraDesierta` al recibir la lectura MP de proceso desierto.

## Estados de pantalla

- **Confirmado (camino feliz):** lectura de desierto recibida → `procurement_route` actualizado, `mp_process_id` anterior invalidado, flujo retoma desde 3.2 con nuevo ID de OC de catálogo.
- **Vencido sin lectura:** `purchase_intent_deadline` vencido pero sin lectura de selección (3.5) ni de desierto — SGM muestra pendiente / posible desierto + deep link; la transición se confirma solo cuando llega la lectura (sin transcribir el estado MP en SGM).
- **Desierto reiterado:** Gran Compra desierta → Compra Directa → rechazo de OC (3.8) → ¿nuevo intento? **[PENDIENTE P-68]** límite de reintentos y acción de escalamiento sin definir.

## Validaciones visibles

Ninguna regla bloqueante — es una transición confirmada, no requiere decisión del usuario más allá de continuar.

## Notas

- Interacción MP: **Gestión** (el usuario retoma el flujo en 3.2 con una acción concreta).
- La transición queda trazada en auditoría con ambos valores de `procurement_route` — no se pierde la ruta original.
- Candidato a métrica de reportería (procesos desiertos por Convenio Marco / unidad).
