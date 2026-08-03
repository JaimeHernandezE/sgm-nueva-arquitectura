# Entidades — Presupuestos

**Estado:** aún no documentado.

Índice del modelo: [`entidades-core.md`](entidades-core.md).

## Dependencias ya referenciadas desde Adquisiciones

Estas entidades (o refs) aparecen en el ciclo SOLPED→Pago y deberán definirse formalmente aquí:

| Entidad / concepto | Uso desde Adquisiciones | Nota |
|---|---|---|
| `BudgetLine` | Imputación presupuestaria (`proposed_budget_line_id`, CDP, preobligación) | Consumo mínimo desde Adq 1.1 al seleccionar: `code` / clasificación, **descripción de la cuenta**, **saldo** (`available_balance` vía `previewBudgetAvailability`). Tabla formal pendiente del levantamiento del módulo. Label de negocio: **imputación presupuestaria** (no «línea presupuestaria»). |
| `BudgetAvailabilityCertificate` (CDP) | Emisión / firma en 1.5 | Definición **provisional** en [`entidades-adquisiciones.md`](entidades-adquisiciones.md) |
| `BudgetPreCommitment` | Preobligación 1.6 | Idem, provisional en Adquisiciones |
| `BudgetCommitment` | Compromiso cierto (OC aceptada) | Idem, provisional en Adquisiciones |

### Campos mínimos de `BudgetLine` consumidos por Adquisiciones (provisional)

Hasta documentar Presupuestos, Adquisiciones asume al menos:

| Campo | Label (ES) | Uso en Adq |
|---|---|---|
| `id` | Identificador | `proposed_budget_line_id`, CDP, preobligación |
| `code` | Código / clasificador | Texto del selector (ej. `22.01.03`) |
| `description` | Descripción de la cuenta | Mostrada en solo lectura al seleccionar la línea en 1.1 / 1.2 (`getBudgetLine`) |
| `available_balance` | Saldo disponible | Orientativo vía `previewBudgetAvailability` al seleccionar (no sustituye 1.3) |

No inventar el resto del modelo de Presupuestos aquí.
