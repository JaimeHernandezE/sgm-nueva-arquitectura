# 5. Pago

## 5.1 — Registrar Devengado (Match a 3 Vías)

| Materia | Valor |
|---|---|
| **Unidad municipal** | Contabilidad |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle

Contabilidad ejecuta el Match a 3 Vías, cotejando (1) la Orden de Compra emitida en Mercado Público, (2) la Recepción Conforme registrada en SGM (4.1), y (3) la Factura electrónica emitida por el proveedor (SII). Solo si las tres fuentes son consistentes se registra el devengo contable.

### Entidad(es) y campos

- **`BudgetCommitment`** *(actualiza)*:
  - `status` (enum) — transita de `Committed` a `Accrued` (devengado).
- **`ProcurementCase`** *(actualiza)*:
  - `invoice_reference` (string) — obligatorio, referencia a la factura del SII.
  - `three_way_match_status` (enum) — obligatorio, resultado del match (`Matched` / `Mismatched`).

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Dependencia (este módulo consume) |
| **Contrato / Evento** | Consulta de OC (Mercado Público) + consulta de Factura (SII) |
| **Contraparte** | Mercado Público / Servicio de Impuestos Internos (SII) |
| **Clasificación** | Síncrona bloqueante |
| **Payload** | `ProcurementCase.market_order_id`, `ProcurementCase.invoice_reference`, `ProcurementCase.receipt_status` |

### Edge cases

- **Match a 3 Vías falla** (discrepancia entre OC, Recepción Conforme y Factura): `three_way_match_status = Mismatched`, el devengo no se registra. ⚠ pendiente de definir flujo de resolución de discrepancias (¿quién resuelve, con qué plazo?).
- **SII no disponible al momento de consultar la factura:** ⚠ pendiente de definir timeout y reintento — candidato a regla transversal, ya que es una nueva integración con proveedor externo no mencionada en el resto del macroproceso.
- **Factura no emitida por el proveedor dentro de un plazo razonable tras la Recepción Conforme:** ⚠ pendiente de definir SLA y escalamiento.

### Pendientes de definir

> ⚠ **Pendiente de definir:** comportamiento ante indisponibilidad del SII durante la consulta de factura — es un borde de módulo (sistema externo) no cubierto por la regla transversal existente de "Mercado Público no disponible", por lo que constituye un pendiente propio.
>
> ⚠ **Pendiente de definir:** flujo de resolución cuando el Match a 3 Vías arroja discrepancia.

---

## 5.2 — Generar Decreto de Pago

| Materia | Valor |
|---|---|
| **Unidad municipal** | Contabilidad |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle

Contabilidad genera el Decreto de Pago sobre la base del devengo registrado en 5.1, formalizando administrativamente la obligación de pago.

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `payment_decree_number` (string) — obligatorio.
  - `payment_decree_issued_at` (datetime) — obligatorio.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases

- Intento de generar Decreto de Pago sin `three_way_match_status = Matched`: ⚠ pendiente de definir si el sistema bloquea esta acción (se asume que sí, por consistencia del proceso, pero no está confirmado en la fuente).

### Pendientes de definir

> ⚠ **Pendiente de definir:** validación de bloqueo entre 5.1 y 5.2 (no se debería poder generar Decreto de Pago sin match exitoso), a confirmar explícitamente en fuente.

---

## 5.3 — Ejecutar Pago

| Materia | Valor |
|---|---|
| **Unidad municipal** | Tesorería |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle

Tesorería ejecuta el pago efectivo al proveedor conforme al Decreto de Pago generado en 5.2, cerrando el ciclo del expediente de adquisición.

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `status` (enum) — transita a `Closed` o `Paid`.
  - `payment_executed_at` (datetime) — obligatorio.
- **`BudgetCommitment`** *(actualiza)*:
  - `status` (enum) — transita de `Accrued` a `Paid`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Evento** | Ejecución de pago (transferencia bancaria u otro medio) |
| **Contraparte** | Sistema de tesorería/bancario municipal (fuera del alcance de este documento) |
| **Clasificación** | ⚠ pendiente |

### Edge cases

- **Pago falla** (fondos insuficientes en cuenta municipal, rechazo bancario): ⚠ pendiente de definir reversa de estado y notificación.
- **Proveedor con datos bancarios inválidos o desactualizados:** ⚠ pendiente de definir.

### Pendientes de definir

> ⚠ **Pendiente de definir:** el sistema/mecanismo bancario municipal que ejecuta el pago no está especificado en la fuente (BPMN). Se marca como borde de módulo con clasificación pendiente, ya que su naturaleza (síncrona/asíncrona) determina el diseño del contrato correspondiente.

---

## Cierre de etapa

### Resumen de entidades de la etapa

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `ProcurementCase` | Actualizada en 5.1, 5.2, 5.3 | Cierre del ciclo de vida del expediente. |
| `BudgetCommitment` | Actualizada en 5.1, 5.3 | Transita `Committed → Accrued → Paid`. |

### Resumen de bordes de la etapa

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 5.1 | Dependencia | Consulta OC + Factura (Match a 3 Vías) | Mercado Público / SII |
| 5.3 | Sistema externo | Ejecución de pago | Sistema bancario/tesorería municipal |

### Navegación

- Etapa anterior: [4. Recepción Conforme](./4-recepcion-conforme.md)
- Fin del macroproceso.
