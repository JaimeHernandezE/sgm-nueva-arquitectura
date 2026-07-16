# Wireframe: Comisión evaluadora y acta de evaluación

**Sub-paso:** 3.9 — Comisión evaluadora y acta de evaluación *(Licitación Pública, condicional sobre umbral)*
**Rol:** Gestor de compra (`adq.gestor_compra`) / Aprobador de modalidad (`adq.aprobador_modalidad`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md); integrantes de comisión sin rol propio (v1)
**Operaciones:** `designateEvaluationCommittee` (3.9a), `recordOfferAdmissibility` (3.9b), `recordEvaluationScores` + `signEvaluationReport` (3.9c)

Tres momentos secuenciales en la misma pantalla, como pasos internos.

## Layout — 3.9a Designación

```
+----------------------------------------------------------------+
| SOLPED #1234 — Comisión evaluadora        [3.9a Designación]    |
+----------------------------------------------------------------+
| Integrantes de la comisión                    [ + agregar ]     |
| ------------------------------------------------------------    |
| Nombre           | Declaración de conflictos       | Estado     |
| Marcela Iturra    | [ subir declaración ]           | Pendiente  |
| Pedro Soto        | [ subir declaración ]           | Pendiente  |
| Carla Fuentes     | [ subir declaración ]           | Pendiente  |
| ------------------------------------------------------------    |
| [ Generar acto de designación y solicitar firma ]                |
+----------------------------------------------------------------+
```

## Layout — 3.9b Admisibilidad

```
+----------------------------------------------------------------+
| SOLPED #1234 — Comisión evaluadora        [3.9b Admisibilidad]  |
+----------------------------------------------------------------+
| Ofertas recibidas (desde apertura, 3.8): 4                       |
| ------------------------------------------------------------    |
| Proveedor            | Monto       | Admisible | Causal          |
| Taller Municipal SpA     | $178.500.000| ( ) Sí ( )No| [           ]|
| Mecánica Diesel Ñuble Ltda.   | $182.300.000| ( ) Sí ( )No| [           ]|
| ------------------------------------------------------------    |
| [ Registrar admisibilidad ]                                     |
+----------------------------------------------------------------+
```

## Layout — 3.9c Evaluación y acta

```
+----------------------------------------------------------------+
| SOLPED #1234 — Comisión evaluadora        [3.9c Evaluación]     |
+----------------------------------------------------------------+
| Criterios: Precio 40% · Experiencia 30% · Plazo 30% (de 3.1)     |
| ------------------------------------------------------------    |
| Oferta              | Precio | Experiencia | Plazo | Total       |
| Taller Municipal SpA    | [ 100]| [ 80]       | [ 90] | 91,0        |
| Mecánica Diesel Ñuble Ltda.  | [ 98] | [ 70]       | [ 85] | 85,7        |
| ------------------------------------------------------------    |
| ⚠ Puntajes deben cuadrar con las ponderaciones declaradas         |
| Ranking propuesto: 1° Taller Municipal SpA · 2° Mecánica Diesel Ñuble Ltda. |
+----------------------------------------------------------------+
| [ Firmar Acta de Evaluación (integrantes) ]                      |
+----------------------------------------------------------------+
| (banner: acta firmada, ranking cerrado — habilita 3.10)          |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Integrante | `CommitteeMember.user_id` | Sí |
| Declaración de conflictos | `CommitteeMember.conflict_declaration_ref` | Sí — bloqueante |
| Proveedor / monto (oferta) | `OfferRecord.provider_rut`, `OfferRecord.offered_amount` | Sí |
| Admisible | `OfferRecord.admissibility_status` | Sí |
| Causal de inadmisibilidad | `OfferRecord.inadmissibility_cause` | Sí, si `admissibility_status = inadmissible` |
| Puntaje por criterio | `EvaluationScore.score` | Sí |
| Fundamento | `EvaluationScore.rationale` | Sí |
| Ranking | `EvaluationReport.ranking` | No (generado por sistema) |
| Propuesta de adjudicación | `EvaluationReport.proposed_award_offer_id` | No (generado: primero del ranking) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Generar acto de designación y solicitar firma | `designateEvaluationCommittee` | `requestSignature`, `confirmSignature` |
| Registrar admisibilidad | `recordOfferAdmissibility` | — |
| (edición de puntajes, sin llamada hasta firmar) | `recordEvaluationScores` | — |
| Firmar Acta de Evaluación | `signEvaluationReport` | `requestSignature`, `confirmSignature` (integrantes) |

## Estados de pantalla

- **No aplica (bajo umbral):** sin `EvaluationCommittee` formal — evaluación por funcionario responsable con el mismo registro estructurado (`OfferRecord`/`EvaluationScore`/`EvaluationReport` igual, sin comisión).
- **3.9a bloqueado:** integrante sin `conflict_declaration_ref` no puede habilitarse a evaluar — `CONFLICT_DECLARATION_REQUIRED`.
- **3.9b:** oferta inadmisible queda fuera de 3.9c aunque tenga mejor precio; causal visible en el acta.
- **3.9c bloqueado:** `SCORES_INCONSISTENT_WITH_CRITERIA` si el puntaje total por oferta no cuadra con los pesos de `EvaluationCriterion` — el acta no puede firmarse hasta corregir.
- **Firmada (camino feliz):** evento `EvaluationCompleted`; habilita 3.10 con la propuesta de adjudicación precargada.
- **Empate en ranking:** requiere criterio de desempate declarado en las bases (3.1); bases sin ese criterio generan advertencia en 3.1, no aquí.
- **Conflicto sobreviniente:** reemplazo de integrante por acto modificatorio, trazado vía `CommitteeMember.replaced_by_member_id`.

## Validaciones visibles

- Declaración de conflictos obligatoria por integrante antes de habilitar evaluación.
- Causal obligatoria en ofertas inadmisibles.
- Cuadre de puntajes contra ponderaciones antes de firmar el acta.

## Notas

- Regla SoD propuesta: integrantes ≠ requirente de la SOLPED ni elaborador de bases técnicas — alcance exacto de las inhabilidades **[PENDIENTE P-66]**, validar con jurídica.
- Comisión formal obligatoria sobre umbral `NormativeParameter` — carga verificada **[PENDIENTE P-37]**.
