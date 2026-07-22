# Wireframe: Publicación en Mercado Público y vinculación

**Sub-paso:** 3.2 — Publicación y vinculación *(Trato Directo)* — ejecuta la vinculación diferida de 2.3
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/especificacion/catalogo-roles.md)
**Operación:** `linkMpProcess` *(reutiliza §2.2)* · Dependencia: `readMpProcess` · Evento: `MpProcessLinked`

## Layout

```
+----------------------------------------------------------------+
| ADQ-2026-00012 — Publicación y vinculación MP     [Pendiente]   |
+----------------------------------------------------------------+
| ## Contexto                                                      |
| Resolución Fundada firmada ✓ · Toma de Razón: N/A (bajo umbral)  |
| Plazo legal de publicidad: 24 h desde total tramitación (P-71)   |
+----------------------------------------------------------------+
| ## Acción en Mercado Público                                     |
| [ Publicar Trato Directo en Mercado Público ]  (deep link)       |
+----------------------------------------------------------------+
| ## Vinculación                                                   |
| ID del proceso publicado en MP *                                  |
| [ 4021-05-TD26                              ]                    |
| Simular resultado (solo demo) [ Vinculación exitosa ▼ ]          |
| [ Validar y vincular ]                                           |
+----------------------------------------------------------------+
| (banner de éxito o de bloqueo — 4 causales de 2.3)               |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| ID del proceso MP | `ProcurementCase.mp_process_id` | Sí |
| Fecha de vinculación | `ProcurementCase.mp_linked_at` | No (generado) |
| Tipo de proceso MP | `ProcurementCase.mp_process_type` | No (generado, `direct_procurement`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Publicar en Mercado Público | — (deep link) | Mercado Público |
| Validar y vincular | `linkMpProcess` | `readMpProcess` |

## Estados de pantalla

- **Vinculado:** `MpProcessLinked`; inicia sync; continúa a 3.3.
- **Bloqueos:** `MP_PROCESS_NOT_FOUND` / `ORGANISM_MISMATCH` / `TYPE_MISMATCH` / `ALREADY_LINKED`.

## Validaciones visibles

- Reutiliza íntegramente las de 2.3 / ficha TD §3.2.

## Notas

- Interacción MP: **Gestión** (registro del ID); luego informativa. **[PENDIENTE P-71]** plazo 24 h.
