# Wireframe: Revisión jurídica de bases

**Sub-paso:** 3.2 — Revisión jurídica de bases *(Licitación Pública)*
**Rol:** Aprobador de modalidad (`adq.aprobador_modalidad`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md), ejercido por Departamento Jurídico
**Operación:** `recordLegalReview`

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Revisión jurídica de bases      [En revisión]    |
+----------------------------------------------------------------+
| [Bases — solo lectura]                                          |
| Bases técnicas: bases-tecnicas-v1.pdf   [ver]                   |
| Bases administrativas: bases-admin-v1.pdf   [ver]                |
| Criterios de evaluación: Precio 40% · Experiencia 30% · Plazo 30%|
| Garantías: Seriedad $1.850.000 · Fiel cumplimiento $9.250.000    |
+----------------------------------------------------------------+
| Resultado *  ( ) Visto bueno   ( ) Con observaciones             |
| Observaciones (obligatorio si "Con observaciones")               |
| [                                                    ]           |
+----------------------------------------------------------------+
| [ Registrar resultado ]                                         |
+----------------------------------------------------------------+
| (banner: VB → continúa a 3.3, u observaciones → vuelve a 3.1)   |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Resultado | `LegalReview.outcome` | Sí |
| Observaciones | `LegalReview.observations` | Sí, si `outcome = observations` |
| Revisor | `LegalReview.reviewer_id` | No (generado: usuario autenticado) |
| Fecha de revisión | `LegalReview.reviewed_at` | No (generado por sistema) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Registrar resultado | `recordLegalReview` | — |

## Estados de pantalla

- **VB:** `TenderBases.status = approved`; evento `LegalReviewCompleted`; habilita 3.3.
- **Con observaciones:** `TenderBases.status = draft`; el expediente vuelve a 3.1 con las observaciones visibles en el formulario de bases.
- **Ciclo iterable:** cada vuelta genera un nuevo `LegalReview`; el historial completo queda trazado (revisión ↔ corrección).
- **Observaciones reiteradas (3+ ciclos):** visible en reportería de tiempos por etapa — sin bloqueo adicional, solo señal de alerta operativa.

## Validaciones visibles

- `TenderBases.status = legal_review` requerido para poder registrar el resultado (`INVALID_STATUS` si no).
- Observaciones obligatorias si el resultado es "Con observaciones".

## Notas

- `LegalReview` es polimórfica y transversal: esta misma entidad se reutiliza en 3.10 (revisión previa a la Resolución de Adjudicación) y es candidata para la Resolución Fundada de Trato Directo.
- Sin cruce de módulo (interno a Adquisiciones/Jurídica dentro del mismo municipio).
