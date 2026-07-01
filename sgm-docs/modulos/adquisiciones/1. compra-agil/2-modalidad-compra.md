# 2. Modalidad de Compra *(contenido específico: Compra Ágil)*

*Macroproceso: [Compra Ágil](./overview.md) · Etapa anterior: [1. SOLPED](../procesos-transversales/1-solped.md) (transversal)*

## 2.1 — Inicio en MP vía Deep Link

| Campo | Valor |
|---|---|
| Unidad | DAF Abastecimiento |
| Rol | Usuario |
| Plataforma | SGM → Mercado Público (deep link, sin escritura API) |
| Optativo | Falso |

**Detalle:** Tras la Pre-afectación, el usuario hace clic en "Gestionar en MP". Se abre el portal estatal donde se crea la solicitud de cotización (título, descripción técnica, cantidad, dirección de despacho, plazo de entrega, datos de contacto). Ver `arquitectura/integracion-mercado-publico.md` — este es un deep link puro, navegación sin escritura.

**Entidad(es) y campos:**
- `AgileQuoteProcess` (nueva) — `purchase_request_id` (ref. `PurchaseRequest`, 1:1), `deep_link_clicked_at` (fecha/hora), `mp_quote_id` (texto, nulo hasta 2.2)

**Edge cases:**
- Usuario no completa la creación en MP → SOLPED queda indefinidamente en espera (sin timeout definido en la fuente).

> ⚠ **Pendiente de definir:** regla de alerta/timeout tras clic en deep link sin completar en MP.

---

## 2.2 — Sincronización de ID de Cotización

| Campo | Valor |
|---|---|
| Unidad | DAF Abastecimiento |
| Rol | Usuario |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** El usuario copia el ID de Cotización generado en MP y lo ingresa en el SGM. Desde este momento, el SGM bloquea la SOLPED con estado "En proceso de cotización" (solo lectura).

**Entidad(es) y campos:**
- `AgileQuoteProcess.mp_quote_id` (texto, ahora obligatorio)
- `PurchaseRequest.status` (enum, transiciona a `quoting_in_progress`)

**Edge cases:**
- ID mal copiado/inválido → sin validación de formato mencionada en la fuente.

> ⚠ **Pendiente de definir:** validación de formato/existencia del ID contra MP (regex o verificación liviana).

---

## 2.3 — Recepción de cotizaciones

| Campo | Valor |
|---|---|
| Unidad | — (sin unidad SGM interviniente) |
| Rol | N/A (proveedores externos) |
| Plataforma | Mercado Público |
| Optativo | Falso |

**Detalle:** Filtro normativo dirige la solicitud a MiPymes/proveedores locales en primera instancia. Proveedores cotizan dentro del plazo (2-5 días hábiles), aceptando Declaración de Habilidad jurada.

**Entidad(es) y campos:**
- Sin entidad propia en SGM — vive en MP. SGM solo lee agregados en el paso 2.4 (cantidad de ofertas recibidas).

**Edge cases:**
- Ninguna MiPyme cotiza → ampliación a grandes empresas (2ª ronda).
- Nadie cotiza en ninguna ronda → estado "Desierto" (`PurchaseRequest.status = quote_void`), requiere evaluación y republicación (nuevo ciclo desde 2.1).

---

## 2.4 — Selección y emisión de OC

| Campo | Valor |
|---|---|
| Unidad | DAF Abastecimiento |
| Rol | Aprobador |
| Plataforma | Mercado Público |
| Optativo | Falso |

**Detalle:** Comprador revisa tabla comparativa auto-generada y selecciona oferta; emite la Orden de Compra.

**Entidad(es) y campos:**
- `PurchaseOrder` (nueva) — `purchase_request_id` (ref. `PurchaseRequest`), `mp_oc_id` (texto), `supplier_rut` (texto), `total_amount` (número), `selection_justification` (texto, obligatorio si no es menor precio), `status` (enum: `issued`)

**Edge cases:**
- Cancelación de la solicitud posible en cualquier momento antes de emitir OC, con `cancellation_reason` (texto) obligatorio.

---

## Resumen de entidades — Etapa 2

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `AgileQuoteProcess` | 1:1 con `PurchaseRequest` | Puente SGM↔MP; solo trazabilidad, no negocio |
| `PurchaseOrder` | 1:1 con `PurchaseRequest` (esta modalidad) | En otras modalidades podría ser 1:N — a confirmar al levantar Convenio Marco / Gran Compra |

**Etapa anterior:** [1. SOLPED](../procesos-transversales/1-solped.md) · **Siguiente etapa:** [3. Resolución de Compra →](./3-resolucion-compra.md)
