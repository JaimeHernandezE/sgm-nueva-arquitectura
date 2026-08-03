# Entidades — Tesorería

**Estado:** aún no documentado.

Índice del modelo: [`entidades-core.md`](entidades-core.md).

## Dependencias ya referenciadas desde Adquisiciones

| Entidad / concepto | Uso desde Adquisiciones | Nota |
|---|---|---|
| `Invoice` | Cruce de 3 vías (`ThreeWayMatch`) | Solo referenciada (fuente SII); sin tabla de campos aún |
| `PaymentDecree` | Decreto de pago | Definición **provisional** en [`entidades-adquisiciones.md`](entidades-adquisiciones.md) |
| `Payment` | Ejecución de pago | Idem, provisional en Adquisiciones |
| `Guarantee` (custodia) | Garantías LP — custodia en Tesorería | Entidad definida en Adquisiciones; borde de custodia hacia este módulo |

No inventar campos aquí hasta el levantamiento del módulo.
