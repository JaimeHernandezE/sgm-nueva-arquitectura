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
| Mostrando N de M                                                 |
| +--------+----------+--------+----------+--------+-------------+ |
| | Folio  | Glosa    | Depto  | Modalidad| Estado | Bandeja     | |
| +--------+----------+--------+----------+--------+-------------+ |
| | ADQ-…  | …        | Obras  | CA       | En curso| Por firmar | |
| | ADQ-…  | …        | Tránsito| CM     | Cerrado | —          | |
| | ADQ-…  | … (stub) | …      | …        | …      | badge stub | |
| +--------+----------+--------+----------+--------+-------------+ |
| (vacío) No hay expedientes con estos criterios                   |
+------------------------------------------------------------------+
```

## Campos ↔ entidad / query

| Campo UI | Entidad / query | Obligatorio |
|---|---|---|
| Buscar | query `q` (folio, `ProcurementCase.description`, etiqueta de `procurement_type`) | No |
| Departamento solicitante | query `requesting_department_id` | No; oculto si rol de unidad |
| Modalidad | query `procurement_type` → `ProcurementCase.procurement_type` | No |
| Proceso activo | query `status=in_progress` → `ProcurementCase.status` | No |
| Por firmar / aprobar | query `awaiting_my_action=true` | No |
| Folio (columna) | `ProcurementCase.id` / `folio` | — (lectura) |
| Glosa (columna) | `ProcurementCase.description` | — (lectura) |
| Departamento (columna) | departamento de `OrganizationalUnit` vía `requesting_unit_id` | — (lectura) |
| Modalidad (columna) | `ProcurementCase.procurement_type` | — (lectura) |
| Estado (columna) | `ProcurementCase.status` | — (lectura) |
| Bandeja (columna) | derivado bandeja del actor (`awaiting_my_action`) | — (lectura) |

## Acciones

| Control | Operación contrato | Efecto |
|---|---|---|
| Nuevo expediente | — (navegación) | Si 1.0 habilitado → verificación previa; si omitido → 1.1 creación SOLPED |
| Aplicar buscador / filtros | `listProcurementCases` | Recarga colección paginada con query combinada (AND) |
| Limpiar filtros | `listProcurementCases` | Quita filtros UI; mantiene scope de rol |
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
4. **Por firmar / aprobar:** bandeja del actor autenticado (`awaiting_my_action`); el significado concreto depende del rol (p. ej. aprobación de unidad vs firma CDP).
5. **Prototipo “Ver como”:** control solo de demo — *Unidad solicitante* vs *Usuario DAF* — para ilustrar el contraste de alcance; no sustituye autenticación real. El panel lleva badge «Solo para demo» y fondo de advertencia (igual que los paneles de simulación rol/paso).
6. **Filas stub:** expedientes de prueba sin timeline; badge “Solo listado · sin contenido”; no navegan al expediente.
7. **Nuevo expediente:** destino según capacidades del tenant — sub-paso 1.0 ([`10-verificacion-previa.md`](./10-verificacion-previa.md)) u omisión directa a 1.1. Toggle demo “Omitir paso 1.0” ilustra el caso borde (mismo panel con badge «Solo para demo»).

## Pendientes UI

- Paginación / orden (`page`, `sort`) en prototipo v1 no interactiva (API ya las declara).
- Confirmación con DM del grano exacto de “Departamento” vs unidad en municipios sin desglose (**P-49** / **P-51**).
