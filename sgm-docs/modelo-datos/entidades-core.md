# Entidades Core del Modelo de Datos

Índice de las entidades del **dominio de negocio** del modelo de datos SGM. La definición canónica vive en un archivo por módulo; los macroprocesos **referencian** esas entidades — no las redefinen.

**Entidades de plataforma** (identidad, `DocumentRef`, integraciones, parámetros normativos): [`entidades-plataforma.md`](entidades-plataforma.md).

Si un macroproceso necesita un campo nuevo en una entidad ya existente, se agrega en el archivo del módulo dueño y se referencia desde el subproceso correspondiente, para evitar que la misma entidad diverja entre módulos.

## Archivos por módulo

| Módulo | Archivo | Estado |
|---|---|---|
| Adquisiciones | [`entidades-adquisiciones.md`](entidades-adquisiciones.md) | Documentado (piloto Compra Ágil + CM/LP/TD) |
| Presupuestos | [`entidades-presupuestos.md`](entidades-presupuestos.md) | Stub — aún no documentado |
| Contabilidad | [`entidades-contabilidad.md`](entidades-contabilidad.md) | Stub — aún no documentado |
| Tesorería | [`entidades-tesoreria.md`](entidades-tesoreria.md) | Stub — aún no documentado |
| RRHH / Remuneraciones | [`entidades-rrhh.md`](entidades-rrhh.md) | Stub — aún no documentado |
| Plataforma (core) | [`entidades-plataforma.md`](entidades-plataforma.md) | Documentado |

## Convenciones

**Nombres técnicos:** inglés — entidades PascalCase (`PurchaseRequest`), campos `snake_case` (`requesting_unit`).

**Tabla de campos** (cuatro columnas):

| Campo | Label (ES) | Tipo | Notas |
|---|---|---|---|
| `requesting_unit` | Unidad solicitante | ref. `OrganizationalUnit` | **Obligatorio** |

- **Campo** — nombre técnico API/modelo.
- **Label (ES)** — etiqueta canónica de UI / lenguaje funcional. Debe coincidir con “Campo UI” del wireframe y con la etiqueta del prototipo HTML cuando el campo aparece en formulario. Cambiar el Label (ES) obliga a actualizar wireframe y prototipo en el mismo cambio (`plantilla-maestra-sgm.md` §6–§7).
- **Tipo** — tipo lógico (`texto`, `número`, `fecha`, `fecha/hora`, `enum`, `ref. Entidad`, …).
- **Notas** — obligatoriedad y reglas.

**Leyenda de obligatoriedad** (en **Notas**):

| Valor | Significado |
|---|---|
| `Obligatorio` | Requerido al persistir o enviar |
| `**Opcional**` | Puede omitirse o ser nulo |
| `**Obligatorio si** <condición>` | Condicional explícita |
| `Obligatorio (generado por sistema)` | Asignado por el motor (timestamps, correlativos, FKs auto) |
| `**Opcional** (derivado)` | Calculado o agregado; no ingreso de usuario |

**Visibilidad de borde:** cada entidad indica si es **interna** al módulo o **expuesta** en el contrato API del módulo. Por defecto toda entidad es interna; la exposición se declara explícitamente.

**Glosario:** mapeo entidad técnica ↔ término funcional en [`glosario.md`](glosario.md) (entidades, no sustituye Label (ES) campo a campo).

---

## Patrones transversales pendientes de definir

Estos puntos aparecen repetidos en más de una entidad/subproceso y son candidatos a resolverse con una única regla de negocio reutilizable:

- **Catálogo / base de productos (`Product`, `searchProducts`)** — typeahead de `PurchaseRequestLine.product_code` en SOLPED 1.1. **[PENDIENTE X-94]**.
- **Regla de tolerancia de desviación de montos/precios** — aparece en `PurchaseRequestLine.unit_price` vs. `PriceReference`, en `BudgetCommitment.committed_amount` vs. `BudgetPreCommitment.estimated_amount`, y en `ThreeWayMatch` (discrepancia entre OC/Recepción/Factura).
- **Fuente(s) API externas confiables** — `PriceReference.source` queda sin fuente concreta definida.
- **Hito que congela el tipo de cambio para compromiso presupuestario** — cuando `PurchaseRequest.currency` ≠ `CLP`, el presupuesto y la contabilidad operan en CLP. Falta definir en qué hito se fija la tasa auditable (fecha de resolución, de OC, de preobligación/CDP, u otro) y si la diferencia de cambio posterior es asiento de Contabilidad. Candidato a corregirse al documentar la generación de obligación/compromiso. La tasa mostrada en 1.1 es solo referencial.
- **Umbrales de modalidad: neto vs bruto** — el gateway de modalidad compara montos contra umbrales en UTM (`NormativeParameter`). ¿Se compara el total neto o el total bruto (impuestos incluidos)? Definición normativa, no de diseño. Práctica usual en Mercado Público: impuestos incluidos — verificar. Impacta etapa 2 y el total que viaja desde la SOLPED.
- **Catálogo de `tax_code`** — hoy `iva_19` / `exempt` / `other`; faltan retenciones y tasas especiales si el levantamiento lo requiere.
- **Manejo de fallas de sincronización/disponibilidad de API externa** — relevante para `AgileQuoteProcess` (deep link sin completar) y `BudgetCommitment` (falla de notificación desde MP). Consolidado con la misma familia de resiliencia ante servicios externos de las etapas 2-4 — **[PENDIENTE X-32]**.

---

## Dependencias entre módulos (provisionales)

Varias entidades viven hoy en [`entidades-adquisiciones.md`](entidades-adquisiciones.md) como **definición provisional** (`BudgetAvailabilityCertificate`, `BudgetPreCommitment`, `BudgetCommitment`, `Accrual`, `PaymentDecree`, `Payment`) hasta documentar Presupuestos / Contabilidad / Tesorería.

Referencias externas asumidas (aún sin definición de dominio en este índice): `BudgetLine`, `Invoice`. Identidad y orgánico: `User`, `OrganizationalUnit` en plataforma.
