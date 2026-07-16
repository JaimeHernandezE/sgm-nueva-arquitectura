# Wireframe: Acto de apertura electrónica

**Sub-paso:** 3.8 — Acto de apertura electrónica *(Licitación Pública)*
**Rol:** N/A (ocurre en MP; SGM en modo monitor)
**Operación:** *(sin operación de escritura)* · Dependencia: `readMpProcess` (deseada)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Apertura electrónica            [En espera]      |
+----------------------------------------------------------------+
| Cierre de recepción de ofertas: 20-04-2026 10:00                |
| Apertura electrónica: pendiente…                                 |
+----------------------------------------------------------------+
| [ Simular lectura MP (demo): Apertura realizada — 4 ofertas ▾ ]  |
| [ Consultar ]                                                    |
+----------------------------------------------------------------+
| (banner: apertura reflejada, n° de ofertas — habilita 3.9)       |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| N° de ofertas recibidas | *(reflejo de lectura MP, sin persistencia propia — insumo directo de `OfferRecord` en 3.9)* | No |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Simular lectura MP (demo) | — *(solo prototipo)* | Ilustra cierre + apertura + n° de ofertas |

## Estados de pantalla

- **En espera:** sin acción de usuario, solo monitoreo — Interacción MP: **Informativo**.
- **Apertura reflejada (camino feliz):** SGM muestra el hito y el número de ofertas; el detalle de cada oferta se gestiona en MP y se trae a SGM recién en 3.9 (admisibilidad). Evento `BidOpeningRecorded`.
- **Modo degradado:** sin lecturas MP, registro manual del hito para poder habilitar 3.9.

## Validaciones visibles

- Ninguna de usuario — hito disparado por lectura MP, no por acción manual.

## Notas

- El selector "Simular lectura MP" es artefacto de prototipo — en producción llega vía `readMpProcess` (push o polling).
- Lectura **deseada**, no confirmada — MP prevalece si la lectura llega después del registro manual.
