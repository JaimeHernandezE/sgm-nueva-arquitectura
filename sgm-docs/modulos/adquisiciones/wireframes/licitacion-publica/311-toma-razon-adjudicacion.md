# Wireframe: Toma de Razón de la adjudicación (Contraloría)

**Sub-paso:** 3.11 — Toma de Razón de la adjudicación *(Licitación Pública, condicional)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md); tramita, no resuelve (resuelve CGR)
**Operación:** `submitToComptroller`, `recordComptrollerOutcome` *(reutiliza 3.4)* · Dependencia: Contraloría (registro manual)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Toma de Razón de la adjudicación  [Condicional]  |
+----------------------------------------------------------------+
| ## Envío a Contraloría                                           |
| Umbral de Toma de Razón vigente: $ 150.000.000  (NormativeParameter)|
| Monto adjudicado: $ 178.500.000  → Aplica Toma de Razón            |
| [ Registrar envío a Contraloría ]                                |
| N° de oficio de envío: [ __________ ]  Fecha: [ __/__/____ ]      |
| Estado: En tramitación en CGR…                                   |
+----------------------------------------------------------------+
| ## Resultado de Contraloría                                      |
| [ Registrar resultado ]                                          |
| Resultado *  ( ) Toma razón  ( ) Toma razón con alcance  ( ) Representación|
| Oficio de respuesta (adjunto) *                                  |
+----------------------------------------------------------------+
| (banner: continúa a 3.12, o representación → adjudicación cae,   |
|  corregir y repetir 3.10, o deserción)                            |
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

- **No aplica (bajo umbral):** sub-paso se omite; el expediente pasa de 3.10 a 3.12.
- **Toma de razón (con o sin alcance):** continúa a 3.12 (Garantía de Fiel Cumplimiento).
- **Representación:** la adjudicación se cae — corregir y repetir 3.10 (nueva `AdministrativeAct` de adjudicación), o declarar desierta.

## Validaciones visibles

- Oficio de respaldo obligatorio para registrar cualquier resultado.

## Notas

- Mismo mecanismo y misma entidad `ComptrollerReview` que 3.4 — el `administrative_act_id` referenciado aquí es el de la adjudicación (3.10), no el de las bases (3.3).
- Canal de consulta de estado integrable **[PENDIENTE P-64]**.
