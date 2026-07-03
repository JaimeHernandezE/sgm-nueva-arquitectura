# 5. Pago

Etapa final del macroproceso **Trato Directo (SGM Integrado)**. Contabilidad/Tesorería registra el devengado mediante match de 3 vías, genera el decreto de pago y ejecuta el pago, cerrando el expediente.

**Fuente base:** diagrama BPMN de carriles `Adquisiciones: Trato Directo (SGM Integrado)`.

---

## 5.1 — Registrar Devengado (Match a 3 Vías)

| Materia | Valor |
|---|---|
| **Unidad municipal** | Contabilidad / Tesorería |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle
Contabilidad/Tesorería registra el devengado contrastando tres fuentes de forma consistente antes de continuar: la Orden de Compra emitida en Mercado Público (3.1), la Recepción Conforme registrada en el SGM (4.1) y la Factura emitida en el SII. El propio diagrama declara esta condición como nota explícita bajo el nodo: **"Requiere: OC (MP) + Recep. Conforme (SGM) + Factura (SII)"**.

### Entidad(es) y campos
- **AccrualEntry** *(propuesta — "registro de devengado", no confirmada en fuente)* — crea: `procurement_case_id`, `purchase_order_id` (ref. PurchaseOrder), `goods_receipt_id` (ref. GoodsReceipt, obligatorio), `invoice_id` (ref. Invoice, obligatorio), `matched` (booleano), `amount`, `matched_at`.
- **Invoice** *(propuesta, entidad externa referenciada por match — no confirmada en fuente)* — referencia: `invoice_number`, `supplier_id`, `amount`, `sii_reference`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Evento** | Consulta de factura (nombre de operación no confirmado; propuesto: `getInvoiceFromSII`) |
| **Contraparte** | SII |
| **Clasificación** | ⚠ no definida |
| **Payload** | Entrada: `invoice_number` o `supplier_id` — Respuesta: `Invoice` (`amount`, `status`) |

| Campo | Contenido |
|---|---|
| **Tipo** | Dependencia |
| **Contrato / Evento** | Lectura de `PurchaseOrder` (Etapa 3) — nombre de operación no confirmado |
| **Contraparte** | Mercado Público |
| **Clasificación** | ⚠ no definida |
| **Payload** | `PurchaseOrder` (`mp_order_id`, `status`, `accepted_at`) |

| Campo | Contenido |
|---|---|
| **Tipo** | Dependencia (interna al SGM, distinto módulo/carril: DAF Abastecimiento → Contabilidad/Tesorería) |
| **Contrato / Evento** | Lectura de `GoodsReceipt` (sub-paso 4.1) |
| **Contraparte** | Adquisiciones / Abastecimiento |
| **Clasificación** | ⚠ no definida |
| **Payload** | `GoodsReceipt` (`purchase_order_id`, `conformity_status`, `received_at`) |

### Edge cases
- Alguna de las tres fuentes no coincide (monto, cantidad o proveedor distintos entre OC, Recepción Conforme y Factura) → el diagrama no muestra camino de excepción para un match fallido. **Obligatorio documentar por tratarse de un sub-paso con borde de módulo — no definido en el diagrama.**
- Factura no encontrada en el SII → `matched` no puede completarse; devengado bloqueado.
- SII, Mercado Público o el módulo de Abastecimiento no disponibles → cada dependencia requiere su propio comportamiento ante falla; ninguno está definido en la fuente.

### Pendientes de definir
> ⚠ **Pendiente de definir:** qué ocurre exactamente cuando el match de 3 vías falla (¿bloqueo total, tolerancia de desviación, o devolución a Recepción Conforme para corrección?) — vacío crítico dado que el diagrama lo declara como requisito pero no modela su fracaso.
> ⚠ **Pendiente de definir:** tolerancia de desviación de monto entre las tres fuentes — mismo patrón transversal de tolerancia identificado en otras etapas del módulo (candidato a regla única reutilizable).
> ⚠ **Pendiente de definir:** nombres canónicos de `AccrualEntry` e `Invoice` en `entidades-core.md`.

---

## 5.2 — Generar Decreto de Pago

| Materia | Valor |
|---|---|
| **Unidad municipal** | Contabilidad / Tesorería |
| **Rol** | Aprobador |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle
Con el devengado registrado y validado en 5.1, Contabilidad/Tesorería genera el decreto de pago que formaliza la instrucción de pago. El diagrama no muestra firma electrónica explícita en este nodo, a diferencia de actos administrativos formales de otras etapas del módulo.

### Entidad(es) y campos
- **PaymentDecree** *(propuesta — no confirmada en fuente)* — crea: `procurement_case_id`, `accrual_entry_id` (ref. AccrualEntry, obligatorio), `decree_number`, `issued_by` (ref. User), `issued_at`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases
- Devengado (5.1) no validado o incompleto → no permite generar el decreto (regla propuesta; dependencia directa mostrada en el diagrama).

### Pendientes de definir
> ⚠ **Pendiente de definir:** si el Decreto de Pago requiere firma electrónica avanzada (patrón visto en actos administrativos de otras etapas del módulo) o es un documento generado sin firma en este flujo.
> ⚠ **Pendiente de definir:** autoridad competente para emitir el decreto según monto (¿misma lógica de facultad delegada que la Resolución Fundada de 2.2?).

---

## 5.3 — Ejecutar Pago

| Materia | Valor |
|---|---|
| **Unidad municipal** | Contabilidad / Tesorería |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle
Tesorería ejecuta el pago al proveedor conforme al Decreto de Pago de 5.2. Este sub-paso cierra el expediente de Trato Directo (nodo "Fin" del diagrama).

### Entidad(es) y campos
- **Payment** *(propuesta — no confirmada en fuente)* — crea: `procurement_case_id`, `payment_decree_id` (ref. PaymentDecree, obligatorio), `paid_at`, `payment_method`, `status` (= `executed`).
- **ProcurementCase.status** — actualiza a `closed` *(propuesta, no confirmada — el diagrama solo muestra un nodo "Fin" genérico)*.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Evento** | Ejecución de pago (nombre de operación no confirmado; propuesto: `executePayment`) |
| **Contraparte** | Sistema bancario / pasarela de pago municipal |
| **Clasificación** | ⚠ no definida |
| **Payload** | `PaymentDecree`, `amount`, `supplier_bank_details` |

### Edge cases
- Sistema bancario o pasarela de pago no disponible → pago no se ejecuta; **[⚠ ver Pendientes]**, obligatorio por tratarse de un sub-paso con borde de módulo.
- Pago rechazado por el banco (cuenta inválida, fondos, etc.) → no representado en el diagrama.

### Pendientes de definir
> ⚠ **Pendiente de definir:** sistema o pasarela de pago concreta detrás de "Ejecutar Pago" — el diagrama no lo nombra, a diferencia de otras integraciones del macroproceso (FirmaGob, SII, Mercado Público).
> ⚠ **Pendiente de definir:** comportamiento ante falla del sistema de pago y su reintento.
> ⚠ **Pendiente de definir:** si el cierre del `ProcurementCase` es automático al ejecutar el pago o requiere una acción de cierre explícita.

---

## Resumen de entidades — Etapa 5

| Entidad | Tipo de relación | Notas |
|---|---|---|
| AccrualEntry | Raíz de la etapa *(propuesta)* | Match de 3 vías: OC + Recepción Conforme + Factura |
| Invoice | N:1 con AccrualEntry *(propuesta)* | Referenciada desde el SII, no gestionada en el SGM |
| PaymentDecree | 1:1 con AccrualEntry *(propuesta)* | Firma electrónica no confirmada |
| Payment | 1:1 con PaymentDecree *(propuesta)* | Cierra el expediente (`ProcurementCase`) |

## Resumen de bordes — Etapa 5

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 5.1 | Sistema externo | Consulta de factura (⚠ nombre pendiente) | SII |
| 5.1 | Dependencia | Lectura de `PurchaseOrder` | Mercado Público |
| 5.1 | Dependencia | Lectura de `GoodsReceipt` | Adquisiciones / Abastecimiento |
| 5.3 | Sistema externo | Ejecución de pago (⚠ nombre pendiente) | Sistema bancario / pasarela de pago |

---

**Navegación:** Etapa anterior: [4. Recepción Conforme](./4-recepcion-conforme.md) · Etapa siguiente: — (cierre del macroproceso)
