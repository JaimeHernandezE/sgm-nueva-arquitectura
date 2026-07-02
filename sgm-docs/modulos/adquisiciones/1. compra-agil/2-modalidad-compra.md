# 2. Modalidad de Compra *(contenido específico: Compra Ágil)*

*Macroproceso: [Compra Ágil](./overview.md) · Etapa anterior: [1. SOLPED](../procesos-transversales/1-solped.md) (transversal)*

## 2.1 — Inicio en MP vía Deep Link

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Usuario |
| Plataforma | SGM → Mercado Público (deep link, sin escritura API) |
| Optativo | Falso |

**Detalle:** Tras la Pre-afectación, el usuario hace clic en "Gestionar en MP". Se abre el portal estatal donde se crea la solicitud de cotización (título, descripción técnica, cantidad, dirección de despacho, plazo de entrega, datos de contacto). Ver `arquitectura/integracion-mercado-publico.md` — este es un deep link puro, navegación sin escritura.

**Entidad(es) y campos:**
- `AgileQuoteProcess` (nueva) — `purchase_request_id` (ref. `PurchaseRequest`, 1:1), `deep_link_clicked_at` (fecha/hora), `mp_quote_id` (texto, nulo hasta 2.2)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | *(deep link — sin operación API)* | Mercado Público | — | URL de navegación; sin payload de escritura |

**Edge cases:**
- Usuario no completa la creación en MP → SOLPED queda indefinidamente en espera (sin timeout definido en la fuente).
- MP no disponible al abrir deep link → error de navegación del navegador; SGM registra `deep_link_clicked_at` pero no avanza el flujo. Usuario reintenta manualmente.

> ⚠ **Pendiente de definir:** regla de alerta/timeout tras clic en deep link sin completar en MP.

---

## 2.2 — Sincronización de ID de Cotización

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Usuario |
| Plataforma | SGM |
| Optativo | Falso |

**Detalle:** El usuario copia el ID de Cotización generado en MP y lo ingresa en el SGM. Desde este momento, el SGM bloquea la SOLPED con estado "En proceso de cotización" (solo lectura).

**Entidad(es) y campos:**
- `AgileQuoteProcess.mp_quote_id` (texto, ahora obligatorio)
- `PurchaseRequest.status` (enum, transiciona a `quoting_in_progress`)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | `validateQuoteId` | Mercado Público (solo lectura) | Síncrona bloqueante ⚠ | Entrada: `mp_quote_id` — Respuesta: `exists`, `quote_status` |

**Edge cases:**
- ID mal copiado/inválido → `syncQuoteId` retorna `INVALID_QUOTE_ID` (`severity: blocking`) si la validación contra MP está activa; si no, se acepta con advertencia.
- Mercado Público no disponible al validar → `syncQuoteId` retorna `MP_PROVIDER_UNAVAILABLE` (`severity: blocking`); usuario puede reintentar. SOLPED no transiciona a `quoting_in_progress` hasta validación exitosa o regla alternativa definida.

> ⚠ **Pendiente de definir:** validación de formato/existencia del ID contra MP (regex o verificación liviana). Comportamiento si MP está caído: ¿aceptar ID sin verificar con flag `validation_pending`?

---

## 2.3 — Recepción de cotizaciones

| Materia | Valor |
|---|---|
| Unidad municipal | — |
| Rol | N/A (proveedores externos) |
| Plataforma | Mercado Público |
| Optativo | Falso |

**Detalle:** Filtro normativo dirige la solicitud a MiPymes/proveedores locales en primera instancia. Proveedores cotizan dentro del plazo (2-5 días hábiles), aceptando Declaración de Habilidad jurada.

**Entidad(es) y campos:**
- Sin entidad propia en SGM — vive en MP. SGM solo lee agregados en el paso 2.4 (cantidad de ofertas recibidas).

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | `getQuoteSummary` *(lectura agregada)* | Mercado Público | Asíncrona | Entrada: `mp_quote_id` — Respuesta: `offer_count`, `round`, `status` |

**Edge cases:**
- Ninguna MiPyme cotiza → ampliación a grandes empresas (2ª ronda).
- Nadie cotiza en ninguna ronda → estado "Desierto" (`PurchaseRequest.status = quote_void`), requiere evaluación y republicación (nuevo ciclo desde 2.1).
- MP no disponible al consultar resumen → SGM muestra último estado conocido en caché con indicador de frescura; no bloquea consulta manual del usuario en portal MP.

---

## 2.4 — Selección y emisión de OC

| Materia | Valor |
|---|---|
| Unidad municipal | DAF Abastecimiento |
| Rol | Aprobador |
| Plataforma | Mercado Público |
| Optativo | Falso |

**Detalle:** Comprador revisa tabla comparativa auto-generada y selecciona oferta; emite la Orden de Compra en MP. SGM registra la OC reflejada desde MP o ingreso manual de respaldo.

**Entidad(es) y campos:**
- `PurchaseOrder` (nueva) — `purchase_request_id` (ref. `PurchaseRequest`), `mp_oc_id` (texto), `supplier_rut` (texto), `total_amount` (número), `selection_justification` (texto, obligatorio si no es menor precio), `status` (enum: `issued`)

**Borde de módulo:**

| # | Tipo | Contrato / Evento | Contraparte | Clasificación | Payload |
|---|---|---|---|---|---|
| 1 | Sistema externo | *(emisión manual en MP — sin escritura API)* | Mercado Público | — | Acción humana en portal |
| 2 | Sistema externo | `getPurchaseOrderFromMP` | Mercado Público (solo lectura) | Asíncrona | Entrada: `mp_oc_id` — Respuesta: `PurchaseOrder` campos desde MP |
| 3 | Evento | `PurchaseOrderIssued` | — (consumidores: Contabilidad, reportería) | Asíncrona | `PurchaseOrder` (`id`, `mp_oc_id`, `total_amount`, `supplier_rut`, `status`) |

**Edge cases:**
- Cancelación de la solicitud posible en cualquier momento antes de emitir OC, con `cancellation_reason` (texto) obligatorio.
- MP no devuelve datos de OC tras emisión → `PurchaseOrder` queda en estado `pending_sync`; reintento vía `getPurchaseOrderFromMP`.

---

## Resumen de entidades — Etapa 2

| Entidad | Tipo de relación | Notas |
|---|---|---|
| `AgileQuoteProcess` | 1:1 con `PurchaseRequest` | Puente SGM↔MP; solo trazabilidad, no negocio |
| `PurchaseOrder` | 1:1 con `PurchaseRequest` (esta modalidad) | En otras modalidades podría ser 1:N — extensión futura |

## Resumen de bordes — Etapa 2

| Sub-paso | Tipo | Contrato o Evento | Contraparte |
|---|---|---|---|
| 2.1 | Sistema externo | Deep link (sin API) | Mercado Público |
| 2.2 | Sistema externo | `validateQuoteId` | Mercado Público |
| 2.3 | Sistema externo | `getQuoteSummary` | Mercado Público |
| 2.4 | Sistema externo + Evento | `getPurchaseOrderFromMP`, `PurchaseOrderIssued` | Mercado Público |

**Etapa anterior:** [1. SOLPED](../procesos-transversales/1-solped.md) · **Siguiente etapa:** [3. Resolución de Compra →](./3-resolucion-compra.md)
