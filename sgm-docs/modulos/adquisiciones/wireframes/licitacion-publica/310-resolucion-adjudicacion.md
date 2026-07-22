# Wireframe: Resolución de adjudicación (o deserción / inadmisibilidad general)

**Sub-paso:** 3.10 — Resolución de adjudicación *(Licitación Pública)*
**Rol:** Aprobador de modalidad (`adq.aprobador_modalidad`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md), ejercido por Alcaldía / autoridad, con revisión previa del Departamento Jurídico
**Operación:** `issueAwardResolution` · Dependencias: `requestSignature`/`confirmSignature`, `adjustPreCommitment` (Presupuestos)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Resolución de adjudicación      [Acta firmada]   |
+----------------------------------------------------------------+
| ## Acta de Evaluación                                            |
| Ranking: 1° Taller Municipal SpA (91,0) · 2° Mecánica Diesel Ñuble Ltda.    |
+----------------------------------------------------------------+
| ## Resolución de adjudicación                                    |
| Tipo de resolución *                                             |
| ( ) Adjudicar   ( ) Declarar desierta   ( ) Revocar               |
| Si Adjudicar:                                                    |
|   Oferta a adjudicar *  [ 1° Taller Municipal SpA ($178.500.000) ▾]  |
|   Fundamentación (obligatoria si ≠ 1° del ranking)                |
|   [                                                    ]         |
| [ Revisión jurídica previa: VB obtenido ✓ ]                      |
| [ Generar acto y solicitar firma ]                                |
+----------------------------------------------------------------+
| (banner: acto firmado → preobligación ajustada a $178.500.000    |
|  → publicado en MP → habilita 3.11/3.12/3.13)                    |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Tipo de resolución | `AdministrativeAct.act_type` | Sí (`award` / `desertion` / `revocation`) |
| Oferta adjudicada | *(entrada de la operación → `Contract.awarded_offer_ref` en 3.13)* | Sí, si `award` |
| Fundamentación | *(entrada de la operación)* | Sí, si la oferta adjudicada ≠ primero del ranking |
| Revisión jurídica previa | `LegalReview` (reutilizada, `subject_type = administrative_act`) | No (verificación de estado) |
| Monto real adjudicado | *(insumo de `adjustPreCommitment`)* | No (tomado de la oferta seleccionada) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Generar acto y solicitar firma | `issueAwardResolution` | `requestSignature`, `confirmSignature`, `adjustPreCommitment` (si `award`) |

## Estados de pantalla

- **Adjudicación al ranking (camino feliz):** acto firmado y publicado en MP por el usuario; ajuste automático de la preobligación al monto adjudicado (`adjustPreCommitment`); el Compromiso Cierto espera a la OC aceptada (3.14).
- **Adjudicación distinta del ranking:** `AWARD_JUSTIFICATION_REQUIRED` si falta fundamentación; queda visible en auditoría.
- **Deserción:** sin oferentes, o todos inadmisibles/inconvenientes — decisión posterior fuera de este paso: relicitar (nuevo proceso MP, mismo expediente) o Trato Directo por causal de licitación desierta (reversión a `2-modalidad-compra.md` §2.1 con la causal precargada).
- **Revocación:** por interés público.
- **Bloqueado:** sin revisión jurídica previa registrada — `LEGAL_REVIEW_REQUIRED`.

## Validaciones visibles

- Fundamentación reforzada obligatoria si la oferta adjudicada no es la del ranking.
- Revisión jurídica previa requerida antes de generar el acto.

## Notas

- Reutiliza `LegalReview` (revisión jurídica previa) y `AdministrativeAct` (firma) — mismas entidades que 3.2/3.3, no duplicadas.
- El acto se publica **en MP** por el usuario; la lectura de la Resolución de Adjudicación publicada es **deseada** y trae monto real + RUT del adjudicatario (degradado: registro manual al publicar).
