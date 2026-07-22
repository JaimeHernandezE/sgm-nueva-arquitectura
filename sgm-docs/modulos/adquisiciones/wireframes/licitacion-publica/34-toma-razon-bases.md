# Wireframe: Toma de Razón de las bases (Contraloría)

**Sub-paso:** 3.4 — Toma de Razón de las bases *(Licitación Pública, condicional)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md); tramita, no resuelve (resuelve CGR)
**Operación:** `submitToComptroller`, `recordComptrollerOutcome` · Dependencia: Contraloría (registro manual, sin integración API asumida)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Toma de Razón de las bases    [Condicional]      |
+----------------------------------------------------------------+
| ## Envío a Contraloría                                           |
| Umbral de Toma de Razón vigente: $ 150.000.000  (NormativeParameter)|
| Monto del proceso: $ 185.000.000  → Aplica Toma de Razón          |
| [ Registrar envío a Contraloría ]                                |
| N° de oficio de envío: [ __________ ]  Fecha: [ __/__/____ ]      |
| Estado: En tramitación en CGR… (típicamente semanas)             |
+----------------------------------------------------------------+
| ## Resultado de Contraloría                                      |
| [ Registrar resultado ]                                          |
| Resultado *  ( ) Toma razón  ( ) Toma razón con alcance  ( ) Representación|
| Oficio de respuesta (adjunto) *                                  |
+----------------------------------------------------------------+
| (banner: continúa a 3.5, o representación → vuelve a 3.1)        |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Fecha de envío | `ComptrollerReview.submitted_at` | Sí |
| Resultado | `ComptrollerReview.outcome` | Sí, al registrar resultado |
| Fecha de resultado | `ComptrollerReview.outcome_at` | No (generado por sistema) |
| Oficio de respuesta | `ComptrollerReview.official_document_ref` | Sí, al registrar resultado |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Registrar envío a Contraloría | `submitToComptroller` | Contraloría (manual) |
| Registrar resultado | `recordComptrollerOutcome` | Contraloría (manual) |

## Estados de pantalla

- **No aplica (bajo umbral):** sub-paso se omite; el expediente pasa directo de 3.3 a 3.5.
- **En tramitación:** el expediente muestra el estado y el tiempo transcurrido en CGR; sin acción disponible más que esperar (o consultar manualmente).
- **Toma de razón (con o sin alcance):** continúa a 3.5.
- **Representación:** el acto de aprobación de bases se cae — reversión trazada a 3.1; los `CaseStep` reflejan el reintento sin perder historia.

## Validaciones visibles

- Oficio de respaldo obligatorio para registrar cualquier resultado.

## Notas

- Sin integración API asumida con el sistema de tramitación de la CGR — registro enteramente manual con documento de respaldo. Explorar canal de consulta de estado integrable **[PENDIENTE P-64]**.
- Mismo mecanismo y misma entidad (`ComptrollerReview`) que 3.11 (Toma de Razón de la adjudicación) — reutilizados sin cambio.
- Umbral vigente fijado por resolución de la propia CGR, modelado como `NormativeParameter` — carga inicial verificada contra norma vigente **[PENDIENTE P-37]**.
