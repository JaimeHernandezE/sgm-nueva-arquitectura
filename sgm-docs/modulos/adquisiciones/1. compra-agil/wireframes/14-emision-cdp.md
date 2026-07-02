# Wireframe: Emisión de CDP firmado

**Sub-paso:** 1.5 — Emisión de CDP firmado  
**Operación:** `issueBudgetAvailabilityCertificate`

## Layout

```
+----------------------------------------------------------+
| Expediente ADQ-2026-00142                    [En curso]   |
+----------------------------------------------------------+
| SOLPED #1234 — Certificado de Disponibilidad (CDP)        |
+----------------------------------------------------------+
| Verificado por:  María López (1.3)                        |
| Línea presupuestaria    [ Cuenta / Programa ...        ]  |
| Monto certificado *     [ $ ____________ ]                |
| Año fiscal *            [ 2026 ]                          |
+----------------------------------------------------------+
| Panel: Revalidación de saldo                              |
| Saldo proyectado:  $ 450.000  [OK]                        |
+----------------------------------------------------------+
| [ Cancelar ]              [ Emitir y firmar CDP ]         |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo |
|---|---|
| Nº correlativo CDP | `BudgetAvailabilityCertificate.certificate_number` |
| Monto certificado | `BudgetAvailabilityCertificate.certified_amount` |
| Firmante | `BudgetAvailabilityCertificate.signed_by` |
| Fecha firma | `BudgetAvailabilityCertificate.signed_at` |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Emitir y firmar CDP | `issueBudgetAvailabilityCertificate` | `checkBudgetAvailability` → `requestSignature` → `confirmSignature` |

## Estados de pantalla

- **Segregación roles:** si firmante = verificador → `SEGREGATION_OF_DUTIES_VIOLATION` (QA 9 P1).
- **Firma pendiente:** estado `pending_signature`; reintento FirmaGob.
- **Éxito:** CDP `issued`; evento `BudgetAvailabilityCertificateIssued`; avance a 1.6.

## Notas

- Folio del expediente siempre visible en encabezado (patrón expediente).
