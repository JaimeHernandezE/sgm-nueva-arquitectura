# Wireframe: Publicación de Intención de Compra / Gran Compra

**Sub-paso:** 3.3 — Publicación de Intención de Compra / Gran Compra *(Convenio Marco, ruta `gran_compra` — monto ≥ 1.000 UTM)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/especificacion/catalogo-roles.md)
**Operación:** `linkMpProcess` *(reutiliza §2.2; además calcula `purchase_intent_published_at`/`purchase_intent_deadline` para esta ruta)* · Dependencia: `readMpProcess` (síncrona bloqueante solo en la vinculación)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Intención de Compra / Gran Compra [Ruta: Gran      |
|                                                    Compra]        |
+----------------------------------------------------------------+
| ## Contexto Gran Compra                                          |
| Monto estimado: $ 4.800.000 (73,77 UTM ≥ 1.000 UTM)               |
| Convenio Marco: Mobiliario de oficina — todos los proveedores     |
| adjudicados del rubro serán alertados                            |
| [ Publicar Intención de Compra en Mercado Público ] (deep link)   |
+----------------------------------------------------------------+
| ## Vinculación de la Intención de Compra                         |
| ID de la Intención de Compra *                                   |
| [                                              ]                 |
| [ Validar y vincular ]                                            |
| Fecha publicación: (autogenerada al vincular)                     |
| Fecha límite (10 días corridos): (calculada automáticamente)       |
+----------------------------------------------------------------+
| (banner de éxito: vinculado — expediente "Gran Compra en curso",  |
|  timer activo — o de bloqueo, 4 causales)                         |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| ID de la Intención de Compra | `ProcurementCase.mp_process_id` | Sí |
| Fecha de vinculación | `ProcurementCase.mp_linked_at` | No (generado por sistema) |
| Tipo de proceso MP | `ProcurementCase.mp_process_type` (fijo en `gran_compra_intent`) | No (generado) |
| Fecha de publicación | `ProcurementCase.purchase_intent_published_at` | Sí (generado al vincular) |
| Fecha límite | `ProcurementCase.purchase_intent_deadline` (`published_at + 10 días corridos`) | Sí (generado) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Publicar Intención de Compra en Mercado Público | — (deep link, navegación pura) | Mercado Público |
| Validar y vincular | `linkMpProcess` | `readMpProcess` (síncrona bloqueante) |

## Estados de pantalla

- **Camino feliz:** `mp_process_id` y `purchase_intent_deadline` registrados; evento `MpProcessLinked`; expediente pasa a "Gran Compra en curso" con timer sobre el plazo — continúa a 3.4.
- **Bloqueo — proceso no encontrado / organismo distinto / tipo incoherente / ya vinculado:** los cuatro bloqueos estándar de vinculación, idénticos a 3.2.
- **API de MP no disponible al validar:** `MP_PROVIDER_UNAVAILABLE` (**[PENDIENTE P-32]**).
- **Usuario no publica dentro de un plazo razonable tras la evaluación de umbral:** candidato a timer de escalamiento (**[PENDIENTE P-33]**).
- **Reingreso tras Gran Compra desierta (3.6):** este sub-paso no se reejecuta — la caída automática pasa a 3.2 (Compra Directa) con nuevo `mp_process_id`, no a una nueva Intención de Compra.

## Validaciones visibles

- Los cuatro bloqueos estándar de vinculación (`severity: blocking`).

## Notas

- Directiva N° 15 ChileCompra: plazo mínimo de respuesta de proveedores es 10 días corridos desde la publicación.
- Interacción MP: **Gestión** (deep link + registro del ID + cálculo del plazo).
- Condicional a `procurement_route = gran_compra`, resultado de 3.1.
