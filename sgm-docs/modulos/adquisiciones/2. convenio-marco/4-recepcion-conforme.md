# 4. Recepción Conforme

## 4.1 — Recepción Conforme (Física en SGM)

| Materia | Valor |
|---|---|
| **Unidad municipal** | DAF Abastecimiento |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle

DAF Abastecimiento registra en SGM la recepción física conforme del bien o servicio adquirido, confirmando que lo recibido corresponde a lo especificado en la OC. Este registro es el segundo insumo (junto con la OC y la Factura) del Match a 3 Vías que se ejecuta en 5.1.

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `receipt_confirmed_at` (datetime) — obligatorio.
  - `receipt_confirmed_by` (string) — obligatorio.
  - `receipt_status` (enum) — obligatorio, se fija en `Conforme` o `NoConforme`.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases

- **Recepción no conforme** (bien/servicio no corresponde a lo pedido, dañado, incompleto): `receipt_status = NoConforme`. ⚠ pendiente de definir el flujo posterior — si dispara reclamo formal ante el proveedor vía Mercado Público (lo que constituiría un borde de módulo adicional) o se resuelve internamente.
- **Recepción conforme registrada sin que `purchase_order_status = Accepted`** (inconsistencia de secuencia): ⚠ pendiente de definir si el sistema bloquea este registro o solo emite advertencia.

### Pendientes de definir

> ⚠ **Pendiente de definir:** flujo de Recepción No Conforme — si constituye un borde de módulo hacia Mercado Público (reclamo/devolución formal) o es un proceso íntegramente interno de SGM. De confirmarse que cruza a Mercado Público, se debe agregar como borde adicional en esta ficha y en `contracts.md`.

---

## Cierre de etapa

### Resumen de entidades de la etapa

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `ProcurementCase` | Actualizada en 4.1 | Se completan `receipt_confirmed_at`, `receipt_status`. |

### Resumen de bordes de la etapa

Sin cruces de borde de módulo confirmados en esta etapa (pendiente de confirmar el caso de Recepción No Conforme, ver arriba).

### Navegación

- Etapa anterior: [3. Resolución de Compra](./3-resolucion-compra.md)
- Etapa siguiente: [5. Pago](./5-pago.md)
