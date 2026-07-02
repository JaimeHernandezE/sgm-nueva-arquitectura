# Wireframe: Cruce de 3 vías (Match)

**Sub-paso:** 5.1 — Cruce de 3 vías  
**Operación:** `performThreeWayMatch`

## Layout

```
+----------------------------------------------------------+
| OC #5678 — Cruce de 3 vías                                |
+----------------------------------------------------------+
| Fuente 1: Orden de Compra (MP)                            |
|   Monto OC:     $ 450.000    [ Sincronizado 01/07 ]       |
+----------------------------------------------------------+
| Fuente 2: Recepción conforme (SGM)                        |
|   Estado:       Conforme     Fecha: 15/07/2026            |
+----------------------------------------------------------+
| Fuente 3: Factura (SII)                                   |
|   N° factura:   [ 12345 ]    [ Buscar en SII ]            |
|   Monto factura: $ 450.000                                |
+----------------------------------------------------------+
| Resultado del cruce                                       |
| +------------------------------------------------------+  |
| | OC vs Recepción vs Factura:  COINCIDE  /  DISCREPANCIA|  |
| | Diferencia detectada:         $ 0                    |  |
| +------------------------------------------------------+  |
+----------------------------------------------------------+
| [ Cancelar ]                         [ Ejecutar match ]   |
+----------------------------------------------------------+
| Si match OK → habilita [ Registrar devengado ] (5.2)      |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo |
|---|---|
| Resultado cruce | `ThreeWayMatch.match_status` |
| Fecha match | `ThreeWayMatch.match_date` |
| Referencia factura | `ThreeWayMatch.invoice_id` |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Buscar en SII | `getInvoiceForMatch` | SII / Contabilidad |
| Ejecutar match | `performThreeWayMatch` | OC (MP cache), Recepción, Factura |

## Estados de pantalla

- **Sin recepción conforme:** `GOODS_RECEIPT_REQUIRED` — pantalla no habilitada (QA 31 P0).
- **Discrepancia:** `MATCH_DISCREPANCY`; banner rojo; no habilita devengado.
- **SII no disponible:** `INVOICE_PROVIDER_UNAVAILABLE`.
- **Match exitoso:** evento `ThreeWayMatchCompleted`; enlace a devengado.

## Validaciones visibles

- Las tres fuentes deben mostrarse lado a lado antes de confirmar.
- Tolerancia de discrepancia ⚠ pendiente — mostrar diferencia absoluta y porcentaje.

## Notas

- QA 31 P0: devengado solo tras match completo (OC + recepción + factura).
- Patrón transversal tolerancia montos compartido con 1.1 y 3.2.
