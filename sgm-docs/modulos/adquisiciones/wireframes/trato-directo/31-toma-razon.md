# Wireframe: Toma de Razón de la Resolución Fundada

**Sub-paso:** 3.1 — Toma de Razón *(Trato Directo, condicional — monto > umbral)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/especificacion/catalogo-roles.md); tramita, no resuelve (resuelve CGR)
**Operación:** `submitToComptroller`, `recordComptrollerOutcome` · Dependencia: Contraloría (registro manual) · Evento: `ComptrollerReviewRecorded`

## Layout

```
+----------------------------------------------------------------+
| ADQ-2026-00012 — Toma de Razón (Resolución Fundada) [Condicional]|
+----------------------------------------------------------------+
| ## Umbral                                                        |
| Umbral Toma de Razón vigente: 8.000 UTM (NormativeParameter)     |
| Monto del proceso: $ 2.400.000 → en demo bajo umbral (omitible)    |
| En escenario > umbral: aplica trámite CGR                        |
+----------------------------------------------------------------+
| ## Envío a Contraloría                                           |
| Fecha de envío *   [ __/__/____ ]                                  |
| [ Registrar envío a Contraloría ]                                  |
+----------------------------------------------------------------+
| ## Resultado CGR                                                 |
| Resultado *  ( ) Toma razón  ( ) Con alcance  ( ) Representación |
| Oficio de respuesta (adjunto) *                                    |
| [ Registrar resultado ]                                            |
+----------------------------------------------------------------+
| (banner: continúa a 3.2, o representación → proceso se cae)       |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Fecha de envío | `ComptrollerReview.submitted_at` | Sí |
| Resultado | `ComptrollerReview.outcome` | Sí, al registrar resultado |
| Oficio de respuesta | `ComptrollerReview.official_document_ref` | Sí, al registrar resultado |
| Acto | `AdministrativeAct.act_type` (= `founded_resolution`) | Sí (sistema) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Registrar envío a Contraloría | `submitToComptroller` | Contraloría (manual) |
| Registrar resultado | `recordComptrollerOutcome` | Contraloría (manual) |

## Estados de pantalla

- **No aplica (bajo umbral):** sub-paso omitido; expediente pasa de etapa 2 a 3.2.
- **Toma de razón:** continúa a 3.2.
- **Representación:** proceso se cae; obligación de licitar.

## Validaciones visibles

- Fecha de envío y oficio de resultado obligatorios (ver ficha §3.1).

## Notas

- Reutiliza `ComptrollerReview` de LP. Canal API CGR — **[PENDIENTE P-64]**.
