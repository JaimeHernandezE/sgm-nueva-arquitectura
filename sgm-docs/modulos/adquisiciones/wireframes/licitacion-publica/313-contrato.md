# Wireframe: Contrato

**Sub-paso:** 3.13 — Contrato *(Licitación Pública, condicional)*
**Rol:** Gestor de compra (`adq.gestor_compra`) / Aprobador de modalidad (`adq.aprobador_modalidad`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md); redacción Departamento Jurídico, firma Alcaldía
**Operación:** `draftContract`, `signContract` · Dependencias: `requestSignature`/`confirmSignature` (municipio); canal de firma del proveedor **[PENDIENTE P-67]**

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Contrato                     [Adjudicación firme]|
+----------------------------------------------------------------+
| Adjudicatario: Taller Municipal SpA · Monto: $178.500.000            |
| Garantía de Fiel Cumplimiento: En custodia ✓                     |
+----------------------------------------------------------------+
| Fecha de inicio *      [ __/__/____ ]                             |
| Fecha de término *     [ __/__/____ ]                             |
| Documento del contrato (adjunto) *  [ subir archivo ]              |
+----------------------------------------------------------------+
| [ Redactar contrato ]                                            |
+----------------------------------------------------------------+
| Firma municipal (FirmaGob): Pendiente…                            |
| [ Simular firma FirmaGob (demo) ]                                 |
| Firma del proveedor: mecanismo por definir (P-67)                 |
| [ Simular firma proveedor (demo) ]                                |
+----------------------------------------------------------------+
| [ Confirmar contrato suscrito ]                                   |
+----------------------------------------------------------------+
| (banner: contrato suscrito → habilita 3.14, o vencido el plazo   |
|  sin firma → ejecutar garantía + readjudicar)                     |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Oferta adjudicada | `Contract.awarded_offer_ref` | Sí |
| Acto aprobatorio | `Contract.administrative_act_id` | Sí |
| Monto | `Contract.amount` | Sí (heredado de la adjudicación) |
| Fecha de inicio | `Contract.start_date` | Sí |
| Fecha de término | `Contract.end_date` | Sí |
| Documento del contrato | `Contract.document_ref` | Sí |
| Mecanismo de firma del contratista | `Contract.contractor_signature_mode` | Sí — **[PENDIENTE P-67]** |
| Estado | `Contract.status` | No (generado: `draft` → `signed` / `not_subscribed`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Redactar contrato | `draftContract` | — |
| Simular firma FirmaGob (demo) / Confirmar contrato suscrito | `signContract` | `requestSignature`, `confirmSignature` |

## Estados de pantalla

- **No aplica (bajo umbral y bases no lo exigen):** las bases pueden disponer que la OC (3.14) formalice el contrato directamente, sin este sub-paso.
- **Suscrito (camino feliz):** ambas partes firman; evento `ContractSigned`; el contrato queda en el expediente con su acto aprobatorio; habilita 3.14.
- **Adjudicatario no suscribe en plazo (edge case crítico, camino de primera clase):** cobro/ejecución de la Garantía de Seriedad (3.7, `status = executed`, borde a Tesorería) y facultad de readjudicar al siguiente del ranking (reejecuta `issueAwardResolution` con el acta vigente de 3.9) o declarar desierta.

## Validaciones visibles

- Garantía de Fiel Cumplimiento en custodia (si aplica) antes de suscribir.

## Notas

- Firma del proveedor: mecanismo pendiente de definir — FEA propia, firma en papel digitalizada, o plataforma externa **[PENDIENTE P-67]**.
- El botón "Simular firma proveedor" es un artefacto de prototipo que anticipa la resolución de P-67 sin comprometer una decisión.
