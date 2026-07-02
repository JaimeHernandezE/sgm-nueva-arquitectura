# Wireframe 00 — Vista de Expediente de Compra

**Pantalla:** Vista principal del expediente (`ProcurementCase`)
**Sub-paso(s) que la motivan:** Transversal — es la vista contenedora de todo el macroproceso, no de un sub-paso específico. Se numera `00` por esa razón.
**Patrón de referencia:** Plataforma Transferencia de Competencias (SUBDERE) — timeline vertical de pasos con estado, responsable y tiempo por etapa.
**Estado:** Propuesta a validar con el equipo. No incorporar a bases de licitación hasta validación.

## Qué especifica esta pantalla

La vista de expediente es la **vista principal de una compra** — reemplaza el patrón heredado de Odoo de una vista/pestaña independiente por etapa (que obligaba a cruzar IDs manualmente entre pestañas para seguir un mismo proceso).

### Elementos obligatorios

1. **Encabezado del expediente**, siempre visible:
   - Folio (`ProcurementCase.folio`) en formato legible y monoespaciado
   - Glosa/nombre de la compra
   - Modalidad (`procurement_type`) y unidad de origen
   - Estado global del expediente + indicador de avance ("paso N de M")
2. **Timeline vertical de pasos** (`CaseStep`), uno por paso instanciado según la modalidad:
   - Número y nombre del paso
   - Estado (badge): Finalizada / En curso / Pendiente — el paso en curso se destaca visualmente (borde más marcado); los pendientes se atenúan (borde punteado, texto gris)
   - Responsable del paso (`responsible_unit`), incluyendo actores externos cuando aplica (ej. "Proveedor (MP)")
   - Tiempo transcurrido y fecha de última modificación (derivados de `started_at`/`completed_at`)
   - Condiciones pendientes del paso en curso, explícitas (ej. 'lectura API "OC Aceptada"')
   - Accesos a los documentos/entidades del paso (Ver solicitud, Ver OC, etc.)

### Correlación con el modelo de datos

| Elemento de UI | Campo de entidad |
|---|---|
| Folio del encabezado | `ProcurementCase.folio` |
| Badge de estado global | `ProcurementCase.status` |
| "Paso N de M" | `ProcurementCase.current_step` / count de `CaseStep` |
| Cada bloque del timeline | Un registro de `CaseStep` |
| Badge de estado por paso | `CaseStep.status` |
| Responsable | `CaseStep.responsible_unit` |
| Tiempo transcurrido | `CaseStep.started_at` / `completed_at` |

## Reglas de comportamiento no evidentes en el dibujo

- Los pasos se **instancian según la modalidad** del expediente: Compra Ágil 5, Convenio Marco 4, Licitación Pública 6, Trato Directo 5. El wireframe muestra Compra Ágil como ejemplo.
- Las vistas de detalle por etapa son **secciones dentro del expediente** (se abren desde los botones de cada paso), no pestañas o vistas independientes.
- El folio debe ser visible en **toda** pantalla del proceso, incluidas las vistas de detalle.
- El usuario nunca "crea un expediente": crea una solicitud de pedido y el sistema genera el expediente automáticamente en la misma transacción (propuesta — ver pendientes).

## Pendientes de definir

> ⚠ **Pendiente de definir:** formato final del folio (propuesta: `ADQ-AAAA-NNNNN`) — validar contra convenciones existentes de SUBDERE.

> ⚠ **Pendiente de definir:** momento de instanciación de los pasos — alternativa (a) los pasos se instancian dinámicamente cuando se decide la modalidad (el expediente nace con un solo paso y "se dibuja" hacia adelante), o (b) se declara modalidad tentativa desde la SOLPED, corregible. Decisión de equipo pendiente.

> ⚠ **Pendiente de definir:** lista de estados globales del expediente (propuesta inicial: en_curso, finalizado, cancelado, desierto).

> ⚠ **Pendiente de definir:** comportamiento del timeline en flujos con retrocesos (ej. OC rechazada por proveedor que devuelve el proceso al paso de selección) — ¿el paso vuelve a "En curso" o se registra un nuevo intento visible en el historial?
