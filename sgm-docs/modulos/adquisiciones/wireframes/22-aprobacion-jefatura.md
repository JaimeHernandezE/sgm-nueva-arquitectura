# Wireframe: Aprobación de modalidad por jefatura

**Sub-paso:** 2.2 — Aprobación de modalidad por jefatura *(condicional a `ModalityDecision.requires_jefatura_approval`, marcado en 2.1 — existencia formal pendiente de ratificar con la DM, **[PENDIENTE P-38]**)*  
**Rol:** Aprobador de modalidad (`adq.aprobador_modalidad`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
**Operaciones:** `approveModalityDecision`, `rejectModalityDecision` *(nombres inferidos — no declarados literalmente en la ficha)* · Dependencia condicional: `requestSignature`/`confirmSignature` (Core (FirmaGob))

## Layout

```
+----------------------------------------------------------+
| SOLPED #1234 — Aprobación de modalidad     [Pendiente V°B°]|
+----------------------------------------------------------+
| Decisión de modalidad (solo lectura)                        |
| Modalidad seleccionada: Compra Ágil                        |
| Monto estimado: $ 1.250.000 (19,21 UTM) · Gateway: OK       |
| Solicitada por: Carla Fuentes (DAF Finanzas) · 26-06-2026   |
+----------------------------------------------------------------+
| Seguimiento de firmas (si DM exige firma)                  |
| +------------------+--------+-------------+               |
| | Interviniente    | Tipo   | Estado      |               |
| +------------------+--------+-------------+               |
| | Jefatura DAF     | FirmaGob| Pendiente  |               |
| +------------------+--------+-------------+               |
+----------------------------------------------------------+
| Decisión                                                  |
| Comentarios (obligatorio si rechazo)                      |
| [________________________________________________]        |
+----------------------------------------------------------+
| [ Rechazar ]                    [ Aprobar y firmar ]      |
+----------------------------------------------------------+
| Tras aprobar → Continuar a 2.3 (Vinculación MP)            |
| Tras rechazar → Vuelve a 2.1 (nueva selección)             |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Decisión | `ModalityDecisionApproval.decision` | Sí |
| Comentarios | `ModalityDecisionApproval.comments` | Sí si rechazo |
| Aprobador | `ModalityDecisionApproval.approver_id` | Sí (generado) |
| Fecha decisión | `ModalityDecisionApproval.decision_date` | Sí (generado) |
| Resumen de modalidad | `ModalityDecision.selected_modality` | No (solo lectura) |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Aprobar y firmar | `approveModalityDecision` *(inferido)* | `requestSignature` → `confirmSignature` (Core (FirmaGob)), condicional a que DM exija firma |
| Rechazar | `rejectModalityDecision` *(inferido)* | — |

## Estados de pantalla

- **Omitido:** si `ModalityDecision.requires_jefatura_approval = false`, este sub-paso no se presenta — el expediente avanza directo a 2.3.
- **Pendiente firma:** botón de aprobación deshabilitado hasta `confirmSignature` exitoso, si la firma resulta exigida.
- **Rechazado:** `ModalityDecision` queda sin efecto; los `CaseStep` instanciados en 2.1 se anulan con auditoría; el flujo vuelve a 2.1.

## Validaciones visibles

- Comentario obligatorio al rechazar.
- **[PENDIENTE P-38]** Segregación decisor/aprobador (quien decidió en 2.1 no debería aprobar aquí) — regla y su alcance exacto por confirmar con DM.
- **[PENDIENTE P-38]** Si la firma electrónica es exigible siempre, solo sobre cierto monto/modalidad, o nunca.

## Notas

- Este sub-paso completo (incluida su existencia) es una propuesta documentada para no bloquear la especificación — no una definición cerrada. El campo `requires_jefatura_approval` de 2.1 permite ejercitarlo o no por expediente mientras la DM no resuelve su exigencia formal.
- Consistente con el patrón de `12-visto-bueno-jefatura.md` (misma estructura de seguimiento de firmas y comentarios obligatorios al rechazo).
