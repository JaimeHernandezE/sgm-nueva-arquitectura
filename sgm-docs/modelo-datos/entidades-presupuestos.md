# Entidades — Presupuestos

**Estado:** aún no documentado.

Índice del modelo: [`entidades-core.md`](entidades-core.md).

## Dependencias ya referenciadas desde Adquisiciones

Estas entidades (o refs) aparecen en el ciclo SOLPED→Pago y deberán definirse formalmente aquí:

| Entidad / concepto | Uso desde Adquisiciones | Nota |
|---|---|---|
| `BudgetLine` | Línea presupuestaria (`proposed_budget_line_id`, CDP, preobligación) | Solo referenciada; sin tabla de campos aún |
| `BudgetAvailabilityCertificate` (CDP) | Emisión / firma en 1.5 | Definición **provisional** en [`entidades-adquisiciones.md`](entidades-adquisiciones.md) |
| `BudgetPreCommitment` | Preobligación 1.6 | Idem, provisional en Adquisiciones |
| `BudgetCommitment` | Compromiso cierto (OC aceptada) | Idem, provisional en Adquisiciones |

No inventar campos aquí hasta el levantamiento del módulo.
