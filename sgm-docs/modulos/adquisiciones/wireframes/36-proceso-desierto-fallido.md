# Wireframe: Proceso desierto o fallido

**Sub-paso:** 3.6 — Proceso desierto o fallido *(Compra Ágil, optativo — solo si el proceso fracasa)*  
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../arquitectura/catalogo-roles.md)  
**Operación:** `releasePreCommitment` (si cancelación) · Dependencia: `readMpProcess` — desierto (deseada)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Proceso desierto o fallido          [Pendiente]  |
+----------------------------------------------------------------+
| [Motivo — solo lectura]                                         |
| Causa: ( ) Desierto (nadie cotizó)  ( ) Todas las ofertas         |
|          rechazadas/inhábiles                                    |
+----------------------------------------------------------------+
| Decisión *                                                       |
| ( ) Republicar (nueva cotización en MP, re-vinculación 2.3)      |
| ( ) Reevaluar (reversión formal a etapa 2 — nueva ModalityDecision)|
| ( ) Cancelar expediente (libera preobligación completa)          |
+----------------------------------------------------------------+
| [ Confirmar decisión ]                                            |
+----------------------------------------------------------------+
| (banner según decisión)                                          |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Causa | payload `ProcurementProcessFailed` | No (solo lectura) |
| Decisión (radios) | `ProcurementCase.status` | Sí |
| Liberación preobligación | `BudgetPreCommitment` | Sí si cancelación (`releasePreCommitment`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Republicar | — (re-vinculación vía `linkMpProcess`, mismo mecanismo de 2.3) | Mercado Público |
| Reevaluar | — (reversión formal a 2.1 — **[PENDIENTE P-34]**, procedimiento aún no definido) | — |
| Cancelar expediente | `releasePreCommitment` | Proveedor de disponibilidad presupuestaria (síncrona bloqueante) |

## Estados de pantalla

- **Modo degradado:** vencido el plazo de cotización sin registro de selección (3.2), SGM presume posible desierto y crea tarea de verificación; el usuario confirma manualmente contra MP.
- **Cancelado:** libera el 100% de la preobligación; notifica a la unidad solicitante.
- **Reevaluar:** bloqueado en este prototipo — el procedimiento de reversión formal a etapa 2 no está definido (**[PENDIENTE P-34]**); se muestra la opción pero la acción real queda pendiente.

## Validaciones visibles

- Debe seleccionarse exactamente una decisión antes de confirmar.

## Notas

- Republicación reiterada sin resultado (2+ intentos) → advertencia asesora sugiriendo reevaluar condiciones o modalidad (no bloqueante).
- **[PENDIENTE P-41]** Cancelación con preobligación ya vencida de saldo anual — coordinar con regla de cierre presupuestario, con Finanzas.
