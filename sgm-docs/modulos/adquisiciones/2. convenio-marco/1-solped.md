# 1. SOLPED

## 1.1 — Requerir adquisición

| Materia | Valor |
|---|---|
| **Unidad municipal** | Unidad Solicitante |
| **Rol** | Usuario |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle

La Unidad Solicitante origina la necesidad de compra navegando el Catálogo SGM (réplica o vista integrada del catálogo de bienes/servicios) y generando una Solicitud de Pedido (SOLPED). Este sub-paso da inicio al expediente de adquisición.

### Entidad(es) y campos

- **`ProcurementCase`** *(crea)*:
  - `folio` (string) — obligatorio, identificador único del expediente en SGM.
  - `requesting_unit` (string) — obligatorio.
  - `status` (enum) — obligatorio, se inicializa en `Draft` o equivalente.
  - `catalog_item_reference` (string) — obligatorio, referencia al ítem de catálogo seleccionado.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases

- Catálogo SGM no disponible o desincronizado del catálogo real de Convenio Marco: ⚠ pendiente de definir política de fallback.
- Usuario sin permisos de Unidad Solicitante intenta crear SOLPED: se asume bloqueo por RBAC, sujeto a **[PENDIENTE P-24]**.

### Pendientes de definir

> ⚠ **Pendiente de definir:** frecuencia de sincronización entre el Catálogo SGM y el catálogo oficial de Convenio Marco de ChileCompra. Candidato a regla transversal (afecta también a 2.1).

---

## 1.2 — V°B° Jefatura Unidad Solicitante

| Materia | Valor |
|---|---|
| **Unidad municipal** | Unidad Solicitante |
| **Rol** | Aprobador |
| **Plataforma** | SGM |
| **Optativo** | Falso |

### Detalle

La Jefatura de la Unidad Solicitante revisa y aprueba (V°B°) la SOLPED generada en 1.1. Este visto bueno es **siempre obligatorio, sin excepción por monto** — a diferencia de otras modalidades (ej. Compra Ágil) donde puede existir un umbral de exención, en Convenio Marco no aplica excepción alguna.

### Entidad(es) y campos

- **`ProcurementCase`** *(actualiza)*:
  - `status` (enum) — transita a `ApprovedBySupervisor` o equivalente.
  - `approved_by` (string) — obligatorio al aprobar.
  - `approved_at` (datetime) — obligatorio al aprobar.

### Borde de módulo

| Campo | Contenido |
|---|---|
| **Tipo** | Sin cruce |

### Edge cases

- Jefatura rechaza la SOLPED: el expediente vuelve a estado editable en 1.1. ⚠ pendiente de definir si se notifica automáticamente al solicitante y si queda trazabilidad del motivo de rechazo.
- Jefatura no responde dentro de un plazo: ⚠ pendiente de definir SLA de aprobación y escalamiento.

### Pendientes de definir

> ⚠ **Pendiente de definir:** SLA de aprobación de Jefatura y mecanismo de escalamiento por no respuesta.

---

## Cierre de etapa

### Resumen de entidades de la etapa

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `ProcurementCase` | Creada en 1.1, actualizada en 1.2 | Entidad raíz del expediente; folio visible en toda pantalla del proceso (regla de wireframes, sección 6 de la Plantilla). |

### Resumen de bordes de la etapa

Sin cruces de borde de módulo en esta etapa.

### Navegación

- Etapa siguiente: [2. Modalidad de Compra](./2-modalidad-compra.md)
