# 2026-07 — Atomicidad de efectos de borde entre módulos

**Estado:** Aceptada como *problema canónico* (mecanismo concreto aún abierto — **C-1**)
**Fecha:** Julio 2026
**Origen:** Comparativa Adquisiciones §3.3; Contabilidad C-1; Adquisiciones X-46 → **X-46**
**Plan general:** [`../../plan-general.md`](../../plan-general.md) §3.0 y §4
**Ancla operativa:** pendiente **C-1** del plan de Contabilidad (bloquea F4 de Presupuestos y Contabilidad)

## Contexto

En Odoo, varios efectos de dominio se materializan **dentro del mismo commit ORM** de una aprobación en Adquisiciones (presupuesto e inventario/activo fijo). En la arquitectura nueva esos efectos son **dependencias de borde** entre módulos independientes con contratos versionados.

El mismo problema reaparece con otro nombre en Contabilidad: un hecho económico produce **devengo presupuestario** (Presupuestos) y **devengo patrimonial** (Contabilidad) que no pueden existir por separado (**C-1**).

Tratarlos como pendientes sueltos multiplica soluciones incompatibles. Son **un solo problema con tres manifestaciones**.

## Decisión

> Se declara el problema canónico **atomicidad de efectos de borde**: cuando un hecho de negocio debe producir efectos en más de un módulo, la especificación define un mecanismo único de atomicidad o compensación (saga con reversa, commit coordinado con suscriptor obligatorio, u otro documentado por SUBDERE). **No se deja al adjudicatario.**

### Tres manifestaciones (no tres pendientes)

| ID | Manifestación | Origen | Relación |
|---|---|---|---|
| **M1** | Efectos presupuestarios desde Adquisiciones (CDP / preobligación / obligación) que en Odoo iban en el mismo commit de aprobación | [`comparativa-odoo-vs-nuevo.md`](../../modulos/adquisiciones/comparativa-odoo-vs-nuevo.md) §3.3; **P-1** (Presupuestos) | Misma familia que C-1 |
| **M2** | Efectos de Inventario / Activo fijo desde recepción/aprobación | Comparativa §3.3; alcance **X-44** | Condicionado a decisión de alcance; el contrato de borde exige compensación aunque Inventario quede fuera de la licitación |
| **M3** | Devengo dual Presupuestos ↔ Contabilidad; momento del devengo (recepción vs three-way match) | **C-1**; **X-46** (antes X-46) | **C-1** es el ancla operativa; **X-46** queda *absorbido / reconciliar bajo C-1* |

## Consecuencias

1. **C-1** permanece abierto hasta elegir mecanismo; es la ficha de trabajo del problema canónico.
2. **X-46** no se “resuelve” por separado: se cierra cuando C-1 fije el momento y la atomicidad del efecto patrimonial ligado al ciclo Adq→Cont.
3. **P-1** (propiedad de `BudgetPreCommitment`) se vincula a **M1**, no se duplica como otro problema de atomicidad.
4. Los módulos referencian esta decisión; no inventan sagas locales incompatibles.

## Lo que esta decisión no cierra

- El mecanismo concreto (saga vs commit único) — sigue en **C-1**.
- Si Inventario/Activo fijo entra a las bases — sigue en **X-44** (contradicción con Contabilidad D-2; ver plan general §3).
