# Wireframe: Elaboración de bases administrativas y técnicas

**Sub-paso:** 3.1 — Elaboración de bases *(Licitación Pública)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md)
**Operación:** `createTenderBases`, `submitBasesForLegalReview`

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Elaboración de bases                 [Borrador] |
+----------------------------------------------------------------+
| ## Datos de las bases                                            |
| Bases técnicas (adjunto) *          [ subir archivo ]           |
| Bases administrativas (adjunto) *   [ subir archivo ]           |
| ¿Exige Garantía de Seriedad?  ( ) Sí  ( ) No                    |
|   Monto mínimo: [ $__________ ]                                 |
| ¿Exige Garantía de Fiel Cumplimiento?  ( ) Sí  ( ) No            |
|   Monto mínimo: [ $__________ ]                                 |
+----------------------------------------------------------------+
| ## Criterios de evaluación (EvaluationCriterion)                 |
| Criterios de evaluación                    [ + agregar criterio]|
| ------------------------------------------------------------    |
| Nombre               | Ponderación % | Regla de puntuación      |
| Precio                | [ 40 ]       | [ menor precio = 100pts ]|
| Experiencia           | [ 30 ]       | [ escala 1-5 ]           |
| Plazo de entrega      | [ 30 ]       | [ escala 1-5 ]           |
| ------------------------------------------------------------    |
| Suma de ponderaciones: 100 %  ✓ (o ⚠ si ≠ 100)                   |
+----------------------------------------------------------------+
| [ Guardar borrador ]   [ Enviar a revisión jurídica ]            |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Bases técnicas | `TenderBases.technical_bases_ref` | Sí |
| Bases administrativas | `TenderBases.administrative_bases_ref` | Sí |
| Exige Garantía de Seriedad | `TenderBases.requires_bid_bond` | Sí |
| Monto mínimo seriedad | `TenderBases.bid_bond_min_amount` | Sí, si `requires_bid_bond = true` |
| Exige Garantía de Fiel Cumplimiento | `TenderBases.requires_performance_bond` | Sí |
| Monto mínimo fiel cumplimiento | `TenderBases.performance_bond_min_amount` | Sí, si `requires_performance_bond = true` |
| Nombre del criterio | `EvaluationCriterion.name` | Sí |
| Ponderación % | `EvaluationCriterion.weight_percent` | Sí |
| Regla de puntuación | `EvaluationCriterion.scoring_rule` | Sí |
| Estado | `TenderBases.status` | No (generado: `draft` → `legal_review`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Guardar borrador | `createTenderBases` | — |
| + agregar criterio | — *(edición de línea, sin llamada de red hasta guardar)* | — |
| Enviar a revisión jurídica | `submitBasesForLegalReview` | — |

## Estados de pantalla

- **Borrador:** edición libre; suma de ponderaciones se recalcula en vivo, con advertencia visual si ≠ 100 (no bloquea el guardado del borrador, sí bloquea el envío a revisión).
- **Bloqueado al enviar:** `CRITERIA_WEIGHTS_INVALID` si la suma de `weight_percent` ≠ 100 al intentar `submitBasesForLegalReview`.
- **En revisión jurídica:** formulario en solo lectura hasta que 3.2 devuelva VB u observaciones.
- **Devuelto con observaciones (desde 3.2):** vuelve a `draft`, editable, con banner mostrando las observaciones y versión anterior conservada (`version` incrementa).

## Validaciones visibles

- Suma de ponderaciones = 100 % antes de habilitar "Enviar a revisión jurídica".
- Bases técnicas y administrativas adjuntas obligatorias.
- Montos mínimos de garantía obligatorios solo si el flag correspondiente está activo.

## Notas

- Bases tipo (plantillas administrables) mencionadas en la ficha como candidato a biblioteca — no modelado aquí, fuera de alcance del prototipo.
- Los criterios se capturan estructurados (no solo como documento adjunto) porque 3.9 evalúa y valida contra ellos.
- Edge case ficha: modificación de bases después de enviadas a revisión → vuelve a `draft` con versionamiento del documento (`TenderBases.version`).
