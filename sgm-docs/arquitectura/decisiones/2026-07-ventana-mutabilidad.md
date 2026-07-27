# 2026-07 — Ventana de mutabilidad (patrón transversal)

**Estado:** Aceptada
**Fecha:** Julio 2026
**Origen:** Elevación de T-3 (Tesorería); confirmado en Presupuestos, Contabilidad y RRHH
**Plan general:** [`../../plan-general.md`](../../plan-general.md) §4

## Contexto

Cuatro módulos introdujeron, de forma independiente, una entidad cuya única función es gobernar **cuándo** se pueden registrar o mutar hechos de dominio:

| Módulo | Entidad gobernante | Qué gobierna |
|---|---|---|
| Presupuestos | `BudgetExercise` | Escritura sobre la cadena de compromiso del ejercicio |
| Contabilidad | `AccountingPeriod` | Asientos y cierres del período |
| Tesorería | `CashierSession` | Cobros, anulaciones y cierre de jornada de caja |
| RRHH | `PayrollPeriod` | Liquidación y ajustes de nómina del período |

No es coincidencia de modelado: es el mismo patrón con cuatro nombres. Dejarlo implícito produce cuatro especificaciones divergentes del mismo comportamiento.

## Decisión

> Toda entidad que gobierne una **ventana de mutabilidad** implementa el mismo comportamiento canónico:
>
> 1. **Apertura** — habilita escritura de los hechos bajo su alcance.
> 2. **Cierre** — bloquea escritura nueva; los hechos ya registrados permanecen legibles.
> 3. **Reapertura** — solo con auditoría, **motivo obligatorio** y rol autorizado; no es un “deshacer cierre”.
> 4. **Bloqueo fuera de ventana** — el motor rechaza escrituras cuyo período/sesión/ejercicio no esté abierto; no es validación solo de UI.

Los módulos **referencian** esta decisión; no redefinen el comportamiento. Pueden especializar *qué* hechos quedan bajo la ventana y *quién* puede reabrir, no el patrón.

## Consecuencias

1. **T-3 (parte elevación):** la elevación queda cumplida. El residual de T-3 (doble raíz local de Tesorería) sigue en el plan de módulo.
2. Las fichas y máquinas de estado citan esta decisión en lugar de reiterar apertura/cierre/reapertura.
3. Contingencias con plazo legal (anulación de caja anclada al cierre de jornada, etc.) se anclan a la entidad de ventana, no a un timer ad hoc.

## Pendientes derivados

Ninguno nuevo. El residual de modelado por módulo permanece en P-4, C-3, T-3 (doble raíz) y el plan de RRHH.
