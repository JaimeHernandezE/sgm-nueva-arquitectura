# Wireframe: Listado de expedientes de compra

**Sub-paso:** 0.1 — Listado / consulta de expedientes  
**Ficha:** [`../procesos-transversales/0-consulta-expedientes.md`](../procesos-transversales/0-consulta-expedientes.md) §0.1  
**Prototipo:** [`sgm-prototipos/modulos/adquisiciones/01-listado-expedientes.html`](../../../../sgm-prototipos/modulos/adquisiciones/01-listado-expedientes.html)  
**Roles:** lectura según alcance — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
**Operación principal:** `listProcurementCases`  
**Navegación fila:** `getProcurementCase` → vista expediente  
**API:** [`../contracts.md`](../contracts.md) §2.0 · [`../openapi/expediente.yaml`](../openapi/expediente.yaml)

## Layout

```
+------------------------------------------------------------------+
| Expedientes de compra                    [ Nuevo expediente ]    |
| Ver como: [ Usuario DAF v | Unidad solicitante ]                 |
| [ ] Omitir paso 1.0 (sin Inventario ni catálogo CM)              |
| (panel fondo advertencia)                    [ Solo para demo ]  |
+------------------------------------------------------------------+
| Buscar (opcional) [ folio / glosa / modalidad ________ ]         |
|                                                                  |
| Filtros (opcionales, acumulables)                                |
| Departamento solicitante (opcional) [ Todos              v ]     |
|   — oculto si el actor es adq.solicitante / adq.aprobador_unidad |
| Modalidad (opcional)            [ Todas                  v ]     |
| [ ] Proceso activo                                               |
| [ ] Por firmar / aprobar                                         |
| [ Limpiar filtros ]                                              |
+------------------------------------------------------------------+
| Mostrando 1–50 de M  (página P de T)     [ ◀ Anterior ] [ Siguiente ▶ ] |
| +--------+----------+----------+--------+----------+--------+------------------+ |
| | Folio↕ | Creación↕| Glosa↕   | Depto↕ | Modalid↕| Estado↕| Monto↕           | |
| +--------+----------+----------+--------+----------+--------+------------------+ |
| | ADQ-…  | 12-03-2026| …        | Obras  | CA       | En curso| $1.250.000 sol.  | |
| | ADQ-…  | 05-02-2026| …        | Tránsito| CM     | Cerrado | $3.400.000 adj.  | |
| | ADQ-…  | 28-01-2026| … (stub) | …      | …        | …      | — · badge stub   | |
| | … hasta 50 filas por página …                                                  | |
| +--------+----------+----------+--------+----------+--------+------------------+ |
| (vacío) No hay expedientes con estos criterios                   |
+------------------------------------------------------------------+
```

`↕` = encabezado ordenable (`sort` + `order`). Monto: «sol.» = solicitado; «adj.» = adjudicado.

## Campos ↔ entidad / query

| Campo UI | Entidad / query | Obligatorio |
|---|---|---|
| Buscar | query `q` (folio, `ProcurementCase.description`, etiqueta de `procurement_type`) | No |
| Departamento solicitante | query `requesting_department_id` | No; oculto si rol de unidad |
| Modalidad | query `procurement_type` → `ProcurementCase.procurement_type` | No |
| Proceso activo | query `status=in_progress` → `ProcurementCase.status` | No |
| Por firmar / aprobar | query `awaiting_my_action=true` | No |
| Folio (columna, ordenable) | `ProcurementCase.id` / `folio` → `sort=folio` | — (lectura) |
| Creación (columna, ordenable) | `ProcurementCase.created_at` → `sort=created_at` | — (lectura) |
| Glosa (columna, ordenable) | `ProcurementCase.description` → `sort=description` | — (lectura) |
| Departamento (columna, ordenable) | departamento de `OrganizationalUnit` vía `requesting_unit_id` → `sort=requesting_department` | — (lectura) |
| Modalidad (columna, ordenable) | `ProcurementCase.procurement_type` → `sort=procurement_type` | — (lectura) |
| Estado (columna, ordenable) | `ProcurementCase.status` → `sort=status` | — (lectura) |
| Monto (columna, ordenable) | `ProcurementCaseSummary.awarded_amount` si existe; si no `requested_amount` → `sort=amount` | — (lectura) |
| Paginación | `page`, `page_size=50` | — |

## Acciones

| Control | Operación contrato | Efecto |
|---|---|---|
| Nuevo expediente | — (navegación) | Si 1.0 habilitado → verificación previa; si omitido → 1.1 creación SOLPED |
| Aplicar buscador / filtros | `listProcurementCases` | Recarga colección paginada con query combinada (AND); vuelve a `page=1` |
| Limpiar filtros | `listProcurementCases` | Quita filtros UI; mantiene scope de rol y orden; `page=1` |
| Clic en encabezado de columna | `listProcurementCases` | Fija `sort` al campo de la columna; alterna `order` asc/desc |
| Anterior / Siguiente | `listProcurementCases` | Cambia `page` (máx. 50 ítems por página) |
| Clic en fila (expediente con detalle) | `getProcurementCase` | Navega a vista de expediente |
| Clic en fila stub (solo listado) | — | Sin navegación (prototipo: sin contenido) |

## Estados de la pantalla

| Estado | Condición |
|---|---|
| Normal | Hay al menos un expediente en el resultado |
| Vacío | Filtros/scope sin coincidencias — mensaje “No hay expedientes con estos criterios” |
| Scope unidad | Actor `adq.solicitante` o `adq.aprobador_unidad`: listado limitado a su unidad; filtro Departamento no visible |
| Scope DAF / amplio | Resto de roles Adquisiciones: tenant completo; filtro Departamento disponible |

## Notas de comportamiento

1. **Filtros acumulables:** buscador y filtros se combinan con AND. Dentro de `q`, la coincidencia es por folio **o** glosa **o** modalidad (OR de campos de texto).
2. **Alcance RBAC (servidor):** con `adq.solicitante` / `adq.aprobador_unidad` el scope de `requesting_unit_id` de la asignación se aplica **siempre**. Intentos de ampliar con `requesting_department_id` / `requesting_unit_id` ajenos se ignoran o rechazan.
3. **Proceso activo:** en UI es un checkbox que fija `status=in_progress`. Otros valores de `status` siguen disponibles vía API.
4. **Por firmar / aprobar:** filtro de expedientes que esperan acción del actor (`awaiting_my_action`). No hay columna “Bandeja”: el listado de **acciones pendientes por usuario** corresponde a la bandeja de entrada del sistema de notificaciones ([`musts-arquitectura.md`](../../../arquitectura/especificacion/musts-arquitectura.md) §9).
5. **Monto:** prioriza adjudicado (`PurchaseOrder.total_amount` / `Contract.amount`) sobre solicitado (total bruto SOLPED / `BudgetPreCommitment.estimated_amount`).
6. **Paginación:** hasta **50** filas por página (`page_size=50`).
7. **Orden por encabezado:** cada columna del listado ordena con `sort` + `order`; clic repetido en la misma columna invierte el sentido.
8. **Prototipo “Ver como”:** control solo de demo — *Unidad solicitante* vs *Usuario DAF* — para ilustrar el contraste de alcance; no sustituye autenticación real. El panel lleva badge «Solo para demo» y fondo de advertencia (igual que los paneles de simulación rol/paso).
9. **Filas stub:** expedientes de prueba sin timeline; badge “Solo listado · sin contenido”; no navegan al expediente.
10. **Nuevo expediente:** destino según capacidades del tenant — sub-paso 1.0 ([`10-verificacion-previa.md`](./10-verificacion-previa.md)) u omisión directa a 1.1. Toggle demo “Omitir paso 1.0” ilustra el caso borde (mismo panel con badge «Solo para demo»).

## Pendientes UI

- Confirmación con DM del grano exacto de “Departamento” vs unidad en municipios sin desglose (**P-49** / **P-51**).
