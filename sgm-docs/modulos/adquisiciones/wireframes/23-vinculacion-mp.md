# Wireframe: Vinculación del proceso en Mercado Público

**Sub-paso:** 2.3 — Vinculación del proceso en Mercado Público (momento según modalidad)
**Operación:** `linkMpProcess` · Dependencia: `readMpProcess` (Mercado Público, síncrona bloqueante solo en la vinculación)

Este wireframe cubre la **ejecución inmediata** (Compra Ágil / Convenio Marco, al cierre de la etapa 2). Para Licitación Pública y Trato Directo la misma operación se ejecuta de forma **diferida** dentro de su propio subproceso (LP §3.5, TD en su publicación) — ver `procesos-transversales/2-modalidad-compra.md` §2.3.

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Vinculación con Mercado Público    [Pendiente]    |
+----------------------------------------------------------------+
| [Decisión de modalidad — solo lectura]                          |
| Modalidad confirmada: Compra Ágil · Gateway: OK                  |
+----------------------------------------------------------------+
| [ Gestionar en MP ]  (deep link — abre Mercado Público)          |
+----------------------------------------------------------------+
| Código / ID del proceso en Mercado Público *                    |
| [ 4021-33-COT26                              ]                  |
|                                                                   |
| [ Simular resultado (demo): OK ▾ ]  [ Validar y vincular ]        |
+----------------------------------------------------------------+
| Resultado de la validación                                       |
| (banner de éxito o de error según simulación)                    |
+----------------------------------------------------------------+
| [ Cancelar ]                                                     |
+----------------------------------------------------------------+
| Tras vincular → SOLPED bloqueada, inicia sincronización de       |
| estados MP · Vuelve al expediente (etapa 3 sin prototipo aún)    |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Código / ID del proceso MP | `ProcurementCase.mp_process_id` | Sí |
| Fecha de vinculación | `ProcurementCase.mp_linked_at` | Sí (generado al vincular) |
| Tipo de proceso MP | `ProcurementCase.mp_process_type` | Sí (generado) |
| Modalidad confirmada | `ProcurementCase.procurement_type` | No (solo lectura) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Gestionar en MP | — (deep link, navegación pura, sin payload de escritura) | Mercado Público |
| Validar y vincular | `linkMpProcess` | `readMpProcess` (síncrona bloqueante, solo en la vinculación) |
| Simular resultado (demo) | — *(solo prototipo, no existe en la ficha)* | Ilustra los 4 bloqueos + `MP_PROVIDER_UNAVAILABLE` |

## Estados de pantalla

- **Normal:** código prellenado (si viene de deep link) o vacío para ingreso manual.
- **Vinculado:** pantalla pasa a solo lectura; SOLPED bloqueada "En proceso de cotización" (u estado equivalente de la modalidad).
- **Error de validación:** banner con el `error_code` correspondiente, vínculo no se persiste.
- **MP no disponible:** banner `MP_PROVIDER_UNAVAILABLE` — **[PENDIENTE P-32]** (resiliencia ante servicios externos), sin registro provisional definido.

## Validaciones visibles

- Asterisco en código / ID del proceso MP.
- Código MP obligatorio para «Validar y vincular».

| Regla | Error | Severidad |
|---|---|---|
| Código MP existe | `MP_PROCESS_NOT_FOUND` | blocking |
| Organismo comprador coincide con el tenant | `MP_PROCESS_ORGANISM_MISMATCH` | blocking |
| Tipo de proceso MP coincide con la modalidad confirmada | `MP_PROCESS_TYPE_MISMATCH` | blocking |
| Código no vinculado previamente a otro expediente | `MP_PROCESS_ALREADY_LINKED` | blocking |
| API de MP disponible al validar | `MP_PROVIDER_UNAVAILABLE` | blocking — **[PENDIENTE P-32]** |

## Notas

- El botón "Simular resultado" y el selector de escenario son artefactos del prototipo (validación UX), no aparecen en la ficha ni en `contracts.md` — permiten mostrar los cinco edge cases sin backend real.
- **[PENDIENTE P-33]** Timer de escalamiento si el usuario crea el proceso en MP pero no registra el código en SGM.
- La etapa 3 (Resolución de Compra, específica de Compra Ágil) no tiene prototipo HTML todavía — el enlace de continuación vuelve al expediente.
