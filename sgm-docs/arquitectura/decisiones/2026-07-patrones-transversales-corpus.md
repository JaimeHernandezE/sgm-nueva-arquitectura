# 2026-07 — Patrones transversales del corpus (diagnóstico y método)

**Estado:** Aceptada
**Fecha:** Julio 2026
**Plan general:** [`../../plan-general.md`](../../plan-general.md) §4 y §7
**Complementa:** [`2026-07-ventana-mutabilidad.md`](./2026-07-ventana-mutabilidad.md), [`2026-07-atomicidad-efectos-borde.md`](./2026-07-atomicidad-efectos-borde.md), [`2026-07-docdigital-tramitacion-documental.md`](./2026-07-docdigital-tramitacion-documental.md)

## Propósito

Elevar a declaración única patrones descubiertos módulo a módulo. Los planes de módulo **referencian** este documento; no reiteran la definición.

---

## 1. Expediente sin efecto de dominio

**Origen canónico de la categoría:** Contabilidad §3.2.1; reutilizado en Tesorería (T-14) y RRHH.

| Categoría | Significado | Costo típico |
|---|---|---|
| **No existe** | Sin rastro en el código | Construcción completa |
| **Expediente sin efecto de dominio** | Hay flujo, formulario o trámite, pero ninguna máquina de estados se entera | Modelado del efecto; el flujo se conserva |
| **Existe con efecto parcial** | Hay dominio, incompleto respecto del requisito | Extensión |

**Regla:** al diagnosticar cobertura as-is, usar esta tricotomía. Dar por “cubierto” un TUPA/BPMN sin efecto de dominio es un error de dimensionamiento.

**Aplicación retroactiva:** los cinco módulos (incl. Adquisiciones) revisan coberturas con esta lente antes de F3 / equivalente.

---

## 2. Verificación de citas normativas en fuente primaria

**Regla metodológica del corpus:** toda cita del levantamiento Magenta que fundamente un validador, plazo o umbral se verifica en fuente primaria antes de fijarla en ficha. Es entregable de la fase de levantamiento normativo (F1) de **todos** los módulos.

**Errores confirmados (trazabilidad):**

| Caso | Módulo | Hallazgo |
|---|---|---|
| Dictamen CGR N° 60.449/2008 | Presupuestos (cerró P-9) | Citado incorrectamente; fuente real art. 29 d) LOCM |
| Porcentajes y plazos proceso 39 | Tesorería (**T-2**) | Sin verificar en fuente primaria |
| Estatuto / período / dictamen proceso 6 | RRHH (**R-3**) | Dos errores en el levantamiento |

---

## 3. Plazos legales con efecto jurídico

Inventario transversal único. El cómputo, el calendario de días hábiles, la alerta y el comportamiento ante contingencia se especifican una sola vez a nivel de plataforma/parámetro; los módulos declaran *cuál* plazo aplica.

| # | Plazo | Efecto | Módulo(s) |
|---|---|---|---|
| 1 | Silencio art. 82 LOCM (15 dic) | Rige lo propuesto por el alcalde | Presupuestos |
| 2 | 10 días art. 29 c) LOCM | Escalamiento a CGR | Presupuestos |
| 3 | 8 días hábiles Ley 19.983 | Reclamo de factura | Contabilidad (**C-14**) |
| 4 | Ventana de anulación de caja | Hasta cierre de `CashierSession` (no 24 h corridas) | Tesorería (**T-13**) |
| 5 | Previred día 13 a las 13:45 | Plazo de pago previsional con hora exacta | RRHH |

**Regla:** no consumar silencio ni efecto automático sin registro verificable y, donde el plan lo exija, verificación humana (Presupuestos §5.1).

---

## 4. Acoplamiento fuerte entre módulos

Puntos donde un módulo **bloquea o interrumpe** a otro. Régimen de excepción y contingencia se documentan en el contrato versionado.

| Gate | Origen → destino | Pendiente / nota |
|---|---|---|
| Certificado de Saldos Bancarios | Tesorería → cierre mensual Contabilidad | C-10 / T-5 |
| Suspensión de pago por cesión de factura | Contabilidad → Tesorería | C-13 |
| Disponibilidad presupuestaria bloqueante | Presupuestos → contratación / cometidos RRHH | **R-1** |
| CDP (incl. gasto en personal) | Presupuestos → Adq y RRHH | R-1; ampliación vs solo Adq |
| Atomicidad efectos de borde | Adq ↔ Pres ↔ Cont (± Inventario) | ADR atomicidad; **C-1** |

---

## 5. Integraciones con organismos del Estado

Inventario de interfaces con estado de verificación. **No dar por verificada** ninguna que no conste como tal.

| Interfaz | Uso principal | Verificación |
|---|---|---|
| **DocDigital** | Tramitación de actos (C11) | Existencia/cobertura ~80 % **verificada**; M2M **no verificada** — **X-72** bloqueante |
| **SIAPER** | Registro actos de personal | M2M **no verificada** — **R-2** bloqueante |
| Mercado Público | Adquisiciones | Parcial (lectura/deep link); canal operativo **X-70** |
| SII | Precios, DTE, Registro Transferencias | Parcial; C-4 abierto |
| DIPRES / SINIM / CGR | Reportes presupuestarios y contables | Formatos/canales abiertos (P-8 Pres, C-5, etc.) |
| INE / Transparencia | Reportes RRHH | Abierto en plan RRHH |
| Previred | Cotizaciones | Plazo con hora; integración por verificar en F1 |
| Registro Civil / TGR | Tesorería (RMTNP, etc.) | T-9 |
| COMPIN / Isapre | Subsidios licencias médicas | **R-7** — ciclo ingresos ausente en Cont/Tes |
| Registro Deudores Pensiones de Alimentos | Nómina | R-11 |
| FirmaGob / Clave Única | Firma y auth (vía DocDigital o C9) | Presentes en plataforma; actos vía DocDigital |

---

## Consecuencias

1. Los planes de módulo sustituyen prosa duplicada de estos patrones por referencia a este documento o al plan general §4 / §7.
2. Nuevos hallazgos de la misma familia se agregan aquí, no se redefinen localmente.
