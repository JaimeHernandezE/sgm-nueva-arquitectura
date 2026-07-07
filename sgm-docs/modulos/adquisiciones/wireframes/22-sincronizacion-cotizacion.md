# Wireframe: Sincronización ID de cotización

**Sub-paso:** 2.2 — Sincronización de ID de Cotización  
**Operación:** `syncQuoteId`

## Layout

```
+----------------------------------------------------------+
| SOLPED #1234 — Cotización Compra Ágil  [Pre-afectada]   |
+----------------------------------------------------------+
| Paso 1 completado: Deep link a MP — 02/07/2026 10:30      |
+----------------------------------------------------------+
| ID Cotización Mercado Público *                           |
| [ __________________________ ]  [ Validar ]               |
|                                                           |
| Estado validación: ( ) Pendiente  ( ) Válido  ( ) Error   |
+----------------------------------------------------------+
| [ Gestionar en MP ] (deep link — abre nueva pestaña)      |
+----------------------------------------------------------+
| [ Cancelar solicitud ]              [ Confirmar y bloquear]|
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo |
|---|---|
| ID Cotización | `AgileQuoteProcess.mp_quote_id` |
| Fecha deep link | `AgileQuoteProcess.deep_link_clicked_at` (solo lectura) |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Validar | `validateQuoteId` (MP) | Lectura MP |
| Confirmar y bloquear | `syncQuoteId` | Tras validación OK → `status = quoting_in_progress` |
| Gestionar en MP | `recordDeepLinkClick` / navegación | Deep link sin API |

## Estados de pantalla

- **Solo lectura post-confirmación:** SOLPED bloqueada "En proceso de cotización".
- **MP no disponible:** `MP_PROVIDER_UNAVAILABLE`; no transiciona estado.
- **ID inválido:** `INVALID_QUOTE_ID` bajo el campo.

## Validaciones visibles

- Formato ID (⚠ pendiente definir regex).
- Confirmación explícita antes de bloquear SOLPED.

## Notas

- Tras confirmar, pantalla pasa a modo solo lectura hasta fin de cotización o estado desierto.
