# Wireframe: Selección de oferta Gran Compra

**Sub-paso:** 3.5 — Selección de oferta Gran Compra *(Convenio Marco, ruta `gran_compra` con al menos una oferta)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/especificacion/catalogo-roles.md)
**Operación:** *(sin operación de usuario — solo sync MP)* · Dependencia: `readMpProcess` (deseada) · Evento: `QuotationClosed`

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Selección de oferta Gran Compra  [Pendiente en MP]|
+----------------------------------------------------------------+
| ## Acción en Mercado Público                                     |
| [ Comparar y seleccionar oferta en Mercado Público ] (deep link)  |
+----------------------------------------------------------------+
| ## Estado de sincronización                                      |
| Período cerrado (24-03-2026) · 3 ofertas recibidas                |
| (badge: Sincronizado — o Pendiente en MP hasta la lectura)         |
+----------------------------------------------------------------+
| ## Oferta seleccionada — solo lectura                            |
|   Proveedor: Mobiliario Chile Ltda.                                |
|   Monto: $ 4.650.000                                               |
|   Sincronizado desde MP: 25-03-2026                                |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Proveedor seleccionado | `QuotationResult.selected_provider_rut`, `.selected_provider_name` *(sugerida — creada solo por sync)* | No (solo lectura) |
| Monto ofertado | `QuotationResult.offered_amount` | No (solo lectura) |
| Fecha de registro | `QuotationResult.recorded_at` | No (generado por sistema) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Comparar y seleccionar oferta en Mercado Público | — (deep link, navegación pura) | Mercado Público |

Sin botón de confirmación en SGM: la selección ocurre íntegramente en MP: el proveedor ya está adjudicado al Convenio Marco, por lo que — a diferencia de Compra Ágil — no hay revalidación de habilidad al emitir la OC desde MP.

## Estados de pantalla

- **Pendiente en MP (default):** sin campos editables; badge `Pendiente en MP` + deep link.
- **Sincronizado (camino feliz):** `QuotationResult` creado por sync; el `CaseStep` avanza a 3.7 (Emisión y aceptación de la OC).
- **Sin lectura:** el expediente permanece en `Pendiente en MP`; no hay transcripción manual de proveedor/monto en SGM (plantilla §5.3).
- **Usuario no gestiona la selección en MP dentro de un plazo razonable:** candidato a timer de escalamiento (**[PENDIENTE P-33]**).
- **Inhabilitación sobreviniente del proveedor seleccionado:** edge case a tratar — no cubierto por el camino feliz de este wireframe.

## Validaciones visibles

Ninguna regla bloqueante propia — el paso es informativo; el `CaseStep` avanza solo con la lectura.

## Notas

- Interacción MP: **Informativo** — candidato a **Gestión** optativa (**[PENDIENTE P-39]**: VB interno pre-OC configurable por municipio, igual que CA 3.2).
- `QuotationResult` es la misma entidad que usa Compra Ágil en su 3.2 (patrón compartido, sin transcripción manual — ver `entidades-core.md`).
