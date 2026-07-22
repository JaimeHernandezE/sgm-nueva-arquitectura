# Wireframe: Período de competencia Gran Compra

**Sub-paso:** 3.4 — Período de competencia Gran Compra (10 días) *(Convenio Marco, ruta `gran_compra`)*
**Rol:** N/A — proceso corre en Mercado Público, monitoreo automático
**Operación:** *(sin operación de usuario — solo sync MP)* · Dependencia: `readMpProcess` (deseada, vía servicio de sincronización) · Evento: `MpStateChanged`

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Período de competencia          [En curso — MP]  |
+----------------------------------------------------------------+
| ## Monitoreo del período de competencia                          |
| Intención de Compra: ID 4021-88-IC26 · Publicada: 14-03-2026      |
| Plazo (10 días corridos): vence 24-03-2026                        |
| Días restantes: 6                                                  |
| Ofertas recibidas hasta ahora: 2 (lectura deseada — puede no       |
| reflejar el número real hasta el cierre)                          |
| [ Ver proceso en Mercado Público ] (deep link, solo lectura)       |
+----------------------------------------------------------------+
| ## Simulación de lectura MP                                      |
| (solo demo — cierre con ofertas / desierta)                       |
+----------------------------------------------------------------+
| (badge: Pendiente en MP — hasta la lectura de cierre en 3.5/3.6)  |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Estado del período / n° ofertas | `MpProcessSnapshot` *(sugerida — patrón común con CA)* | No (solo lectura, deseada) |
| Fecha límite | `ProcurementCase.purchase_intent_deadline` (de 3.3) | — |

## Acciones

Ninguna acción de usuario en SGM — el paso es puramente informativo mientras corre en MP.

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Ver proceso en Mercado Público | — (deep link, navegación pura) | Mercado Público |

## Estados de pantalla

- **Camino feliz — con ofertas:** al vencimiento, al menos una oferta recibida → continúa a 3.5 (Selección de oferta).
- **Camino feliz — sin ofertas:** al vencimiento, ninguna oferta recibida → Gran Compra desierta → continúa a 3.6.
- **Sin lectura de estado MP:** SGM muestra solo el timer sobre `purchase_intent_deadline`; el detalle vive en MP vía deep link (modo degradado — plantilla §5.3).
- **MP no disponible durante el período:** sin efecto de gestión (paso informativo); la sincronización se retoma con retroceso exponencial.

## Validaciones visibles

Ninguna — paso de solo monitoreo, sin campos editables ni reglas bloqueantes.

## Notas

- Interacción MP: **Informativo**.
- `MpProcessSnapshot` es la misma bitácora de sincronización usada en Compra Ágil (patrón común, ver `entidades-core.md`).
- El expediente no puede forzar el cierre del período desde SGM — depende enteramente de la lectura MP (agnóstica de push/polling).
