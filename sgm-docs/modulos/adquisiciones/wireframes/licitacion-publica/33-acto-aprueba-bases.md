# Wireframe: Acto administrativo que aprueba las bases

**Sub-paso:** 3.3 — Acto administrativo que aprueba las bases *(Licitación Pública)*
**Rol:** Aprobador de modalidad (`adq.aprobador_modalidad`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md), ejercido por Alcaldía / autoridad con delegación
**Operación:** `approveTenderBases` · Dependencias: `requestSignature`, `confirmSignature` (Core FirmaGob, síncrona bloqueante)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Acto que aprueba las bases      [VB jurídico OK] |
+----------------------------------------------------------------+
| ## Acto administrativo                                           |
| Bases aprobadas jurídicamente — solo lectura                     |
| Bases técnicas + administrativas · Revisión jurídica: VB         |
| Tipo de acto: Decreto / Resolución que aprueba bases (fijo)      |
| [ Generar acto y solicitar firma ]                               |
+----------------------------------------------------------------+
| ## Firma electrónica                                             |
| Estado de firma: Pendiente de firma electrónica…                 |
| [ Simular respuesta FirmaGob (demo): Firmado ▾ ]                 |
| [ Ejecutar ]                                                     |
+----------------------------------------------------------------+
| (banner: acto firmado N° ___ · fecha ___, habilita 3.4/3.5)      |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Tipo de acto | `AdministrativeAct.act_type` | No (fijo: `bases_approval`) |
| N° de acto | `AdministrativeAct.act_number` | No (generado por sistema) |
| Estado | `AdministrativeAct.status` | No (generado: `pending_signature` → `signed`) |
| Firmante | `AdministrativeAct.signed_by` | Sí, al firmar |
| Fecha de firma | `AdministrativeAct.signed_at` | No (generado por sistema al confirmar) |
| Documento del acto | `AdministrativeAct.document_ref` | Sí, al firmar |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Generar acto y solicitar firma | `approveTenderBases` | `requestSignature` |
| Simular respuesta FirmaGob (demo) | — *(solo prototipo)* | Ilustra: firmado / falla del servicio |
| Ejecutar | — *(confirma la simulación)* | `confirmSignature` |

## Estados de pantalla

- **Bloqueado:** si `TenderBases.status ≠ approved` (VB jurídico pendiente) → `LEGAL_REVIEW_REQUIRED`, no se puede generar el acto.
- **Pendiente de firma:** `AdministrativeAct.status = pending_signature`; sin publicación posible aún.
- **Firmado (camino feliz):** `status = signed`; evento `AdministrativeActSigned`; habilita 3.4 (si aplica umbral de Toma de Razón) o directo a 3.5.
- **Falla de FirmaGob:** el acto no se perfecciona (nunca "firmado" sin confirmación del servicio); reintento disponible; estado permanece `pending_signature`.

## Validaciones visibles

- Bloqueo si no hay VB jurídico registrado en 3.2.

## Notas

- Sin este acto no hay publicación en Mercado Público (3.5).
- `AdministrativeAct` es polimórfica y transversal — generaliza el patrón de `PaymentDecree`; candidata a absorberlo a futuro, marcado `<!-- REVISAR -->` en `entidades-core.md`, no fusionado en esta pasada.
- El selector "Simular respuesta FirmaGob" es un artefacto de prototipo — en producción la confirmación llega vía el servicio real, no por acción de usuario en esta pantalla.
