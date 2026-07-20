# Wireframe: Verificación previa (Inventario / catálogo CM)

**Sub-paso:** 1.0 — Verificación previa *(optativo)*  
**Prototipo:** [`sgm-prototipos/modulos/adquisiciones/procesos-transversales/10-verificacion-previa.html`](../../../../sgm-prototipos/modulos/adquisiciones/procesos-transversales/10-verificacion-previa.html)  
**Ficha:** [`../procesos-transversales/1-solped.md`](../procesos-transversales/1-solped.md) §1.0  
**Rol:** Solicitante (`adq.solicitante`) — catálogo [`catalogo-roles.md`](../../../arquitectura/catalogo-roles.md)  
**Operaciones (deps):** `checkStockAvailability` *(si Inventario)*, `checkCatalogAvailability` *(si catálogo CM ChileCompra)*

## Layout

```
+------------------------------------------------------------------+
| Nuevo expediente — verificación previa                    [1.0]  |
+------------------------------------------------------------------+
| ¿Qué necesita adquirir?                                          |
| Buscar *  [______________________________]  [ Buscar ]           |
+------------------------------------------------------------------+
| Inventario / bodegas municipales                                 |
| +--------------------------------------------------------------+ |
| | Resma papel carta · Bodega Central · disp. 120 Un            | |
| | → [ Solicitud a bodega ]  (proceso por definir — P-44)       | |
| |    Continuar con expediente de compra de todos modos         | |
| +--------------------------------------------------------------+ |
| (o) Sin stock para esta búsqueda                                 |
+------------------------------------------------------------------+
| Catálogo Convenio Marco (ChileCompra)                            |
| +--------------------------------------------------------------+ |
| | Resma papel carta · CM-2024-OFICINA · $4.200 · 3 proveedores | |
| | Ítem disponible en catálogo Convenio Marco                   | |
| +--------------------------------------------------------------+ |
| (o) Sin coincidencias en catálogo / banda oculta si sin sync     |
+------------------------------------------------------------------+
| ¿Generar expediente de compra?                                   |
| [ Cancelar ]              [ Continuar a creación de SOLPED ]     |
+------------------------------------------------------------------+
```

## Campos ↔ entidad / query

| Campo UI | Operación / dato | Obligatorio |
|---|---|---|
| Buscar | entrada a `checkStockAvailability` / `checkCatalogAvailability` | Sí para lanzar búsqueda |
| Resultado stock | respuesta Inventario | — (lectura) |
| Resultado CM | respuesta catálogo (`catalog_price`, `provider_count`, convenio) | — (lectura) |

## Acciones

| Control | Operación | Efecto |
|---|---|---|
| Buscar | `checkStockAvailability`, `checkCatalogAvailability` *(según capacidades)* | Rellena bandas |
| Solicitud a bodega | — *(enunciado)* | Placeholder; no crea expediente de compra |
| Continuar compra (con stock) | — | Confirma → 1.1 (asesora) |
| Continuar a creación de SOLPED | — | Navega a 1.1; si hubo hit CM, pasa contexto query |

## Estados

| Estado | Condición |
|---|---|
| Paso omitido | Sin Inventario y sin catálogo CM → el listado no muestra esta pantalla |
| Sin búsqueda | Formulario vacío |
| Hit stock | CTA bodega primaria |
| Hit CM | Detalle ChileCompra + confirmación a 1.1 |
| Sin resultados | Confirmación simple a 1.1 |

## Notas

1. Optativo: ver ficha §1.0 — omisión cuando no hay inventario interno/externo ni sync CM.
2. La banda CM solo se muestra si la integración de catálogo ChileCompra está activa.
3. Advertencia de modalidad en 1.1 es no bloqueante; V2 bloqueante sigue en 2.1.
4. Prototipo: toggle demo “Omitir paso 1.0” en listado para ilustrar el caso borde.
