# Wireframe: Cierre y selección de oferta

**Sub-paso:** 3.2 — Cierre y selección de oferta *(Compra Ágil)*
**Operación:** `recordQuotationResult` *(nombre inferido — no declarado literalmente en la ficha)* · Dependencia: `readMpProcess` (deseada)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Cierre y selección de oferta        [Pendiente]  |
+----------------------------------------------------------------+
| [Período de cotización — solo lectura]                          |
| Cerrado: 30-06-2026 · 4 cotizaciones recibidas (demo)            |
+----------------------------------------------------------------+
| RUT proveedor seleccionado *                                    |
| [ ______________________ ]                                      |
| Nombre proveedor seleccionado *                                  |
| [ ______________________ ]                                      |
| Monto ofertado (CLP) *                                           |
| [ ______________________ ]                                      |
|                                                                   |
| [ ] ¿Es la oferta de menor precio?                               |
| Justificación (obligatoria si NO es la de menor precio) *        |
| [________________________________________________] [oculto]     |
+----------------------------------------------------------------+
| Modo de registro: Manual (modo degradado) — MP prevalece si       |
| la lectura llega después y difiere.                              |
+----------------------------------------------------------------+
| [ Cancelar ]                        [ Confirmar selección ]      |
+----------------------------------------------------------------+
| Tras confirmar → Continuar a 3.3 (Emisión de la OC)              |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo |
|---|---|
| RUT proveedor seleccionado | `QuotationResult.selected_provider_rut` |
| Nombre proveedor seleccionado | `QuotationResult.selected_provider_name` |
| Monto ofertado | `QuotationResult.offered_amount` |
| ¿Es la oferta de menor precio? | `QuotationResult.lowest_price_selected` |
| Modo de registro | `QuotationResult.entry_mode` (`mp_read` \| `manual`) |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Confirmar selección | `recordQuotationResult` *(inferido)* | `readMpProcess` (deseada, no disponible en este prototipo → siempre modo manual) |

## Estados de pantalla

- **Normal:** formulario de registro manual (modo degradado), porque la lectura MP de cierre+selección es deseada, no confirmada.
- **Justificación obligatoria:** si el usuario marca que NO se eligió la oferta de menor precio (regla de la plataforma MP, reflejada aquí solo informativamente).
- **Confirmado:** pantalla pasa a solo lectura; habilita 3.3.

## Validaciones visibles

- Los tres campos de proveedor/monto son obligatorios.
- Justificación obligatoria si `lowest_price_selected = false`.
- **[PENDIENTE P-33]** Timer de escalamiento si el usuario no gestiona la selección en MP dentro de un plazo razonable.

## Notas

- Legalmente no existe aprobación interna obligatoria en Compra Ágil para este paso — es informativo, no de gestión (salvo que se confirme **[PENDIENTE P-39]**, VB interno pre-OC configurable).
- Si la lectura MP llegara después y difiere del registro manual, MP prevalece (fuente de verdad legal); la discrepancia queda en auditoría — no modelado interactivamente en este prototipo.
