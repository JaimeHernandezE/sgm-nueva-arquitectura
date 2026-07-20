# Wireframe: Cierre y selección de oferta

**Sub-paso:** 3.2 — Cierre y selección de oferta *(Compra Ágil)*  
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../arquitectura/catalogo-roles.md)  
**Operación:** `recordQuotationResult` *(nombre inferido — no declarado literalmente en la ficha)* · Dependencia: `readMpProcess` (deseada)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Cierre y selección de oferta        [Pendiente]  |
+----------------------------------------------------------------+
| Contexto del período (solo lectura)                           |
| Cerrado: 30-06-2026 · 4 cotizaciones recibidas (demo)            |
+----------------------------------------------------------------+
| Selección de proveedor                                        |
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
| Modo de registro                                              |
| Manual (modo degradado) — MP prevalece si la lectura llega       |
| después y difiere.                                              |
+----------------------------------------------------------------+
| [ Cancelar ]                        [ Confirmar selección ]      |
+----------------------------------------------------------------+
| Tras confirmar → Continuar a 3.3 (Emisión de la OC)              |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| RUT proveedor seleccionado | `QuotationResult.selected_provider_rut` | Sí |
| Nombre proveedor seleccionado | `QuotationResult.selected_provider_name` | Sí |
| Monto ofertado | `QuotationResult.offered_amount` | Sí |
| ¿Es la oferta de menor precio? | `QuotationResult.lowest_price_selected` | Sí |
| Justificación | `PurchaseOrder.selection_justification` | Sí si no es menor precio |
| Modo de registro | `QuotationResult.entry_mode` | Sí (generado) |

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
