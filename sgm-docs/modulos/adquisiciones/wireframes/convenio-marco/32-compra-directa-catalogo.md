# Wireframe: Compra Directa por Catálogo

**Sub-paso:** 3.2 — Compra Directa por Catálogo *(Convenio Marco, ruta `compra_directa` — monto < 1.000 UTM)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/especificacion/catalogo-roles.md)
**Operación:** `linkMpProcess` *(reutiliza §2.2 del contrato — ejecuta aquí la vinculación diferida)* · Dependencia: `readMpProcess` (síncrona bloqueante solo en la vinculación)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Compra Directa por Catálogo      [Ruta: Compra    |
|                                                   Directa]       |
+----------------------------------------------------------------+
| Ítem de catálogo (de la SOLPED, 1.1): Silla ergonómica CM-8842   |
| Precio catálogo: $ 4.800.000 · Proveedor adjudicado del Convenio |
+----------------------------------------------------------------+
| [ Ir al catálogo Convenio Marco en Mercado Público ] (deep link) |
+----------------------------------------------------------------+
| ID de la OC de catálogo *                                        |
| [                                              ]                 |
| [ Validar y vincular ]                                            |
+----------------------------------------------------------------+
| (banner de éxito: vinculado — expediente en "OC emitida,          |
|  esperando aceptación" — o de bloqueo, 4 causales)                |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| ID de la OC de catálogo | `ProcurementCase.mp_process_id` | Sí |
| Fecha de vinculación | `ProcurementCase.mp_linked_at` | No (generado por sistema) |
| Tipo de proceso MP | `ProcurementCase.mp_process_type` (fijo en `catalog_oc` para esta ruta) | No (generado) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Ir al catálogo Convenio Marco en Mercado Público | — (deep link, navegación pura) | Mercado Público |
| Validar y vincular | `linkMpProcess` | `readMpProcess` (síncrona bloqueante) |

## Estados de pantalla

- **Camino feliz:** `mp_process_id` registrado; evento `MpProcessLinked`; expediente pasa a "OC emitida, esperando aceptación" (continúa a 3.7 cuando el proveedor acepte).
- **Bloqueo — proceso no encontrado:** `MP_PROCESS_NOT_FOUND`.
- **Bloqueo — organismo distinto:** `MP_PROCESS_ORGANISM_MISMATCH`.
- **Bloqueo — tipo incoherente:** `MP_PROCESS_TYPE_MISMATCH` (el proceso MP no es una OC de catálogo Convenio Marco).
- **Bloqueo — ya vinculado:** `MP_PROCESS_ALREADY_LINKED`.
- **API de MP no disponible al validar:** `MP_PROVIDER_UNAVAILABLE` — el vínculo no se persiste sin validación (**[PENDIENTE P-32]**).
- **Usuario no registra el ID tras navegar a MP:** expediente queda detenido — candidato a timer de escalamiento (**[PENDIENTE P-33]**).
- **Ruta alternativa (no aplica en el camino feliz de este expediente):** si la ruta determinada en 3.1 fue `gran_compra`, este sub-paso se muestra como camino alternativo/no ejecutado (ver 3.3).

## Validaciones visibles

- Los cuatro bloqueos estándar de vinculación, idénticos a 2.3/3.5(LP): `MP_PROCESS_NOT_FOUND`, `MP_PROCESS_ORGANISM_MISMATCH`, `MP_PROCESS_TYPE_MISMATCH`, `MP_PROCESS_ALREADY_LINKED` (`severity: blocking`).

## Notas

- A diferencia de Compra Ágil, en CM no hay revalidación de habilidad del proveedor al emitir la OC (el proveedor ya está adjudicado al Convenio Marco).
- Interacción MP: **Gestión** (deep link + registro del ID).
- Condicional a `procurement_route = compra_directa` (resultado de 3.1, o caída automática desde 3.6).
