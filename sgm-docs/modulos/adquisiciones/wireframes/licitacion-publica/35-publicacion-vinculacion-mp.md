# Wireframe: Publicación en Mercado Público y vinculación

**Sub-paso:** 3.5 — Publicación en MP y vinculación *(Licitación Pública)* — ejecuta la vinculación diferida de 2.3
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md)
**Operación:** `linkMpProcess` *(reutiliza §2.2 del contrato)* · Dependencia: `readMpProcess` (síncrona bloqueante solo en la vinculación)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Publicación y vinculación MP     [Bases listas]  |
+----------------------------------------------------------------+
| Bases aprobadas ✓ · Toma de Razón: N/A (bajo umbral)             |
| Plazo mínimo de publicación (V7, informado desde etapa 2): 20 días|
+----------------------------------------------------------------+
| [ Publicar licitación en Mercado Público ]  (deep link)          |
+----------------------------------------------------------------+
| ID de la licitación en MP *                                      |
| [ 4021-33-LP26                                ]                  |
| [ Validar y vincular ]                                            |
+----------------------------------------------------------------+
| (banner de éxito: vinculado, o de bloqueo — 4 causales)          |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| ID de la licitación en MP | `ProcurementCase.mp_process_id` | Sí |
| Fecha de vinculación | `ProcurementCase.mp_linked_at` | No (generado por sistema) |
| Tipo de proceso MP | `ProcurementCase.mp_process_type` | No (generado, coherente con `procurement_type`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Publicar licitación en Mercado Público | — (deep link, navegación pura) | Mercado Público |
| Validar y vincular | `linkMpProcess` | `readMpProcess` (síncrona bloqueante) |

## Estados de pantalla

- **Bloqueado:** bases sin acto aprobatorio firmado, o Toma de Razón pendiente si aplicó.
- **Vinculado (camino feliz):** `mp_process_id` registrado; evento `MpProcessLinked`; SGM pasa a modo monitor (cero deep links adicionales, según `integracion-mercado-publico.md`); inicia sincronización de lecturas 3.6-3.10.
- **Bloqueo — proceso no encontrado:** `MP_PROCESS_NOT_FOUND`.
- **Bloqueo — organismo distinto:** `MP_PROCESS_ORGANISM_MISMATCH`.
- **Bloqueo — tipo incoherente:** `MP_PROCESS_TYPE_MISMATCH` (el proceso MP no es de tipo Licitación Pública).
- **Bloqueo — ya vinculado:** `MP_PROCESS_ALREADY_LINKED`.

## Validaciones visibles

- Los cuatro bloqueos de 2.3 aplican idénticos aquí (misma operación reutilizada).

## Notas

- Este es el punto donde se ejecuta la vinculación que en Compra Ágil y Convenio Marco ocurre al cierre de la etapa 2 — en LP queda diferida hasta que las bases están aprobadas (y tomadas de razón si aplicó). Ver `2-modalidad-compra.md` §2.3.
- Interacción MP: **Gestión** (registro del ID); luego **informativa** (monitoreo).
