# Wireframe: Evaluación de umbral y determinación de ruta

**Sub-paso:** 3.1 — Evaluación de umbral y determinación de ruta *(Convenio Marco)*
**Rol:** N/A — compuerta automática del sistema
**Operación:** *(sin operación declarada)* · Dependencia: `getUtmValue` (Core SII, cacheada — mismo contrato que 2.1) · Evento: `ProcurementRouteDecided`

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Evaluación de umbral            [Ruta: —]        |
+----------------------------------------------------------------+
| ## Determinación de ruta                                         |
| Monto estimado (de la SOLPED / preobligación): $ 4.800.000       |
| Valor UTM del mes en curso (cacheado, fuente SII): $ 65.084      |
| Equivalente en UTM: 73,77 UTM                                    |
| Umbral Gran Compra (NormativeParameter): 1.000 UTM                |
| Ruta determinada: Compra Directa por Catálogo (< 1.000 UTM)      |
| (o bien: Gran Compra, si monto ≥ 1.000 UTM — borde exacto:        |
|  igual a 1.000 UTM enruta a Gran Compra, Art. 90 D.S. 661/2024)   |
+----------------------------------------------------------------+
| (banner: ruta fijada, evento ProcurementRouteDecided emitido —   |
|  continúa automáticamente al sub-paso correspondiente)           |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Ruta determinada | `ProcurementCase.procurement_route` (enum `gran_compra` \| `compra_directa`) | Sí — se fija aquí |
| Fecha de evaluación | `ProcurementCase.route_decided_at` | Sí (generado por sistema) |
| Valor UTM aplicado | `UtmValue` (referencia, mismo objeto de 2.1) | — |

## Acciones

Ninguna — es una compuerta automática, sin botón ni formulario. La pantalla es de solo lectura y confirma el resultado antes de continuar al sub-paso 3.2 o 3.3 según la ruta.

## Estados de pantalla

- **Camino feliz — Compra Directa:** monto < 1.000 UTM → `procurement_route = compra_directa` → continúa a 3.2.
- **Camino feliz — Gran Compra:** monto ≥ 1.000 UTM (incluye el borde exacto) → `procurement_route = gran_compra` → continúa a 3.3.
- **Bloqueado:** `UTM_VALUE_UNAVAILABLE` — fuente UTM no disponible y sin valor cacheado del mes en curso; la evaluación no puede ejecutarse (mismo edge case que 2.1).
- **Variación de UTM:** si el valor UTM cambia entre el mes de la preobligación (1.6) y el de emisión de OC, el sistema recalcula con el UTM vigente y notifica al usuario si la ruta cambia respecto de la declarada en la SOLPED.

## Validaciones visibles

- `UTM_VALUE_UNAVAILABLE` (`severity: blocking`) — igual que el gateway V1 de 2.1.

## Notas

- Reutiliza íntegramente el patrón de compuerta automática por umbral ya construido en 2.1 (mismo `UtmValue`, misma regla de frescura mensual).
- **[PENDIENTE P-37]** Carga inicial de `FRAMEWORK_AGREEMENT_GRAN_COMPRA_UTM_LIMIT` en `NormativeParameter`, verificada contra norma vigente.
