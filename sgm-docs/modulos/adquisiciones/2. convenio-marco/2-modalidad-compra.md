# 2. Modalidad de Compra

## 2.1 — Pre-afectar gasto (Reserva de Fondos)

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Finanzas |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle

DAF Finanzas reserva presupuestariamente el monto estimado de la compra sobre la línea presupuestaria correspondiente, antes de continuar con la tramitación en el catálogo. Esta reserva es una pre-afectación (no un compromiso cierto todavía; el compromiso formal ocurre en 3.4 tras la aceptación de la OC).

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `budget_reservation_status` (enum) — obligatorio, transita a `Reserved`.
  - `budget_line_reference` (string) — obligatorio, referencia a la línea presupuestaria afectada.
  - `estimated_amount` (decimal) — obligatorio.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Dependencia (este módulo consume) |
| **Contrato / Evento** | `checkBudgetAvailability` |
| **Contraparte** | Módulo Presupuestos |
| **Clasificación** | Síncrona bloqueante |
| **Payload** | `ProcurementCase.budget_line_reference`, `ProcurementCase.estimated_amount` |

### Edge cases

- **Presupuesto no disponible / línea sin saldo:** la pre-afectación se rechaza y el expediente no avanza a 2.2. ⚠ pendiente de definir mensaje de error estructurado y si permite reintento con monto ajustado.
- **Módulo Presupuestos no responde (proveedor no disponible):** ⚠ pendiente de definir timeout y política de reintento — candidato a regla transversal (ver overview, sección 8).

### Pendientes de definir

> ⚠ **Pendiente de definir:** clasificación exacta síncrona/asíncrona ya está definida (síncrona bloqueante), pero falta el comportamiento ante timeout del módulo Presupuestos.

---

## 2.2 — Iniciar Convenio Marco en SGM

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle

DAF Abastecimiento toma el expediente con la reserva de fondos ya confirmada y da inicio al flujo de Convenio Marco propiamente tal dentro de SGM, preparando la navegación hacia el catálogo de Mercado Público.

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `status` (enum) — transita a `FrameworkAgreementInitiated` o equivalente.
  - `procurement_modality` (enum) — obligatorio, se fija en `ConvenioMarco`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases

- Reserva de fondos de 2.1 caducó o fue revertida antes de llegar a este paso: ⚠ pendiente de definir vigencia de la pre-afectación.

### Pendientes de definir

> ⚠ **Pendiente de definir:** vigencia temporal de `budget_reservation_status = Reserved` antes de caducar.

---

## 2.3 — Ingresar/Sincronizar ID Carro / OC

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Usuario |
| **Plataforma** | `SGM → Mercado Público (deep link)` |
| **Optativo** | Falso |

### Detalle

DAF Abastecimiento navega (deep link) hacia el Portal de Mercado Público para operar el carro de compra del Convenio Marco, y el ID de ese carro/OC se sincroniza de vuelta hacia SGM como parte del mismo `ProcurementCase`, sin crear una entidad separada.

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `market_order_id` (string) — obligatorio tras sincronización exitosa; identificador del carro/OC en Mercado Público.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sistema externo |
| **Contrato / Evento** | Sincronización de ID de carro/OC (deep link + callback) |
| **Contraparte** | Mercado Público (Portal / API) |
| **Clasificación** | Síncrona bloqueante |
| **Payload** | `ProcurementCase.market_order_id` |

### Edge cases

- **Mercado Público no disponible o deep link falla:** el expediente queda sin `market_order_id`; el flujo no puede avanzar a 3.1 (Navegar Catálogo y Seleccionar). ⚠ pendiente de definir mensaje al usuario y reintento.
- **Sincronización parcial** (usuario opera el carro en MP pero el callback a SGM no llega): ⚠ pendiente de definir mecanismo de reconciliación manual.

### Pendientes de definir

> ⚠ **Pendiente de definir:** mecanismo de reconciliación si el callback de sincronización de `market_order_id` no llega a SGM tras operar el carro en Mercado Público. Candidato a regla transversal para toda integración con Mercado Público.

---

## Cierre de etapa

### Resumen de entidades de la etapa

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `ProcurementCase` | Actualizada en 2.1, 2.2, 2.3 | Se completan `budget_reservation_status`, `procurement_modality`, `market_order_id`. |

### Resumen de bordes de la etapa

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 2.1 | Dependencia | `checkBudgetAvailability` | Módulo Presupuestos |
| 2.3 | Sistema externo | Sincronización ID Carro/OC | Mercado Público (Portal/API) |

### Navegación

- Etapa anterior: [1. SOLPED](./1-solped.md)
- Etapa siguiente: [3. Resolución de Compra](./3-resolucion-compra.md)
