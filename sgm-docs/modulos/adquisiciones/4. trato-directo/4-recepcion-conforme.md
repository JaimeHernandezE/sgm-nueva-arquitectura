# 4. Recepción Conforme

Etapa del macroproceso **Trato Directo (SGM Integrado)** en la que DAF Abastecimiento registra la recepción física conforme del bien o servicio adquirido, insumo obligatorio para el devengo en la Etapa 5.

**Fuente base:** diagrama BPMN de carriles `Adquisiciones: Trato Directo (SGM Integrado)`.

---

## 4.1 — Recepción Conforme (Física en SGM)

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle
DAF Abastecimiento registra en el SGM la recepción física conforme de los bienes o servicios asociados a la OC aceptada en 3.1. El diagrama muestra este nodo conectado por línea punteada hacia "Registrar Devengado (Match a 3 Vías)" en la Etapa 5, indicando que este registro es un insumo de datos para el match de 3 vías, no una llamada API en tiempo real dentro de esta etapa.

### Entidad(es) y campos
- **GoodsReceipt** *(propuesta, no confirmada en fuente — nombre canónico a validar en `entidades-core.md`)* — crea: `procurement_case_id`, `purchase_order_id` (ref. PurchaseOrder), `received_by` (ref. User), `received_at`, `conformity_status` (enum: `conforme`, `no_conforme`), `attachment` (opcional, acta de recepción).

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |
| **Nota** | El único cruce visible en el diagrama para este dato es hacia Contabilidad/Tesorería en la Etapa 5 (5.1); se documenta como borde en esa ficha, no aquí, para evitar duplicar la declaración del contrato. |

### Edge cases
- Recepción no conforme (bien o servicio no cumple lo pactado en la OC) → el diagrama no muestra camino de excepción para este caso (p. ej. devolución, reclamo al proveedor). **[⚠ ver Pendientes]**.
- Recepción parcial (solo una parte de lo comprado en la OC) → no representada en el diagrama.

### Pendientes de definir
> ⚠ **Pendiente de definir:** camino de excepción ante recepción no conforme o parcial — el diagrama solo modela el camino feliz de recepción conforme total. Impacta directamente el match de 3 vías de 5.1, que asume una `GoodsReceipt` conforme y completa.
> ⚠ **Pendiente de definir:** si DAF Abastecimiento es la única unidad habilitada para registrar la recepción, o si la Unidad Solicitante también participa (patrón de doble validación visto en otros procesos de recepción, no confirmado aquí).
> ⚠ **Pendiente de definir:** nombre canónico de la entidad de recepción en `entidades-core.md` (se usa `GoodsReceipt` como propuesta de trabajo, consistente con la nomenclatura en inglés técnico exigida por la plantilla).

---

## Resumen de entidades — Etapa 4

| Entidad | Tipo de relación | Notas |
|---|---|---|
| GoodsReceipt | Raíz de la etapa *(propuesta)* | Insumo obligatorio para el match de 3 vías de la Etapa 5 |

## Resumen de bordes — Etapa 4

Sin cruces de borde declarados directamente en esta etapa. El uso de `GoodsReceipt` como insumo de Contabilidad/Tesorería se documenta en el borde de módulo del sub-paso 5.1.

---

**Navegación:** Etapa anterior: [3. Resolución de Compra](./3-resolucion-compra.md) · Etapa siguiente: [5. Pago](./5-pago.md)
