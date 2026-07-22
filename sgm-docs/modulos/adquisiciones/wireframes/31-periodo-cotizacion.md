# Wireframe: Período de cotización

**Sub-paso:** 3.1 — Período de cotización *(Compra Ágil)*  
**Rol:** N/A (monitoreo automático / proceso en MP)  
**Sin operación de contrato** — solo lectura MP (`readMpProcess`, deseada) y evento interno `MpStateChanged`.

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Período de cotización              [En curso]    |
+----------------------------------------------------------------+
| ## Vínculo en Mercado Público                                    |
| ID de Cotización: 4021-33-COT26 · Vinculado: 27-06-2026          |
+----------------------------------------------------------------+
| ## Monitoreo del período de cotización                           |
| Plazo declarado al vincular (2.3): cierre estimado 30-06-2026    |
| Timer: 2 d 14 h restantes (sin lectura de estado ni n° de           |
| cotizaciones; badge Pendiente en MP · detalle vía deep link)       |
| [ Simular cierre del período (demo) ]                            |
+----------------------------------------------------------------+
| Tras el cierre → Continuar a 3.2 (Cierre y selección de oferta)  |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| ID de Cotización | `ProcurementCase.mp_process_id` | No (solo lectura) |
| Timer / plazo declarado | `CaseStep.started_at` | No (solo lectura) |
| Bitácora sincronización | `MpProcessSnapshot` | No (referencial) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Simular cierre del período *(solo demo)* | — no existe operación de contrato; el cierre es un estado de MP | `readMpProcess` (deseada) |

## Estados de pantalla

- **Normal:** timer corriendo sobre la fecha declarada en 2.3; sin acción de usuario posible (Rol N/A).
- **Lectura disponible (cuando exista):** mostraría n° de cotizaciones recibidas y estado de rondas — no implementado en este prototipo (lectura deseada, no confirmada).
- **MP no disponible:** sin efecto de gestión (paso informativo); la ficha no exige banner de error aquí.

## Validaciones visibles

- Ninguna — sub-paso puramente informativo (Interacción MP: Informativo).

## Notas

- Este sub-paso no tiene "Operación" en `contracts.md` — el botón "Simular cierre" es un artefacto de navegación del prototipo, no un control real.
- Ampliación a segunda ronda MiPyme (si nadie cotiza) ocurre en MP, no en SGM — no se modela aquí.
