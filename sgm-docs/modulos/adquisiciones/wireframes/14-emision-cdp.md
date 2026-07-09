# Wireframe: Emisión de CDP firmado

**Sub-paso:** 1.5 — Emisión de CDP firmado  
**Operación:** `issueBudgetAvailabilityCertificate` · `registerScannedBudgetAvailabilityCertificate` *(modo degradado)*

## Layout — firma electrónica (camino preferido)

```
+----------------------------------------------------------+
| Expediente ADQ-2026-00142                    [En curso]   |
+----------------------------------------------------------+
| SOLPED #1234 — Certificado de Disponibilidad (CDP)        |
+----------------------------------------------------------+
| Verificado por:  María López (1.3)                        |
| Línea presupuestaria (solo lectura) [ Cuenta / Programa ... ]  |
| Monto certificado *     [ $ ____________ ]                |
| Año fiscal *            [ 2026 ]                          |
+----------------------------------------------------------+
| Panel: Revalidación de saldo                              |
| Saldo proyectado:  $ 450.000  [OK]                        |
+----------------------------------------------------------+
| [ Cancelar ]              [ Emitir y firmar CDP ]         |
+----------------------------------------------------------+
```

## Layout — CDP escaneado (modo degradado)

Visible cuando FirmaGob no está disponible o el usuario elige «Registrar CDP firmado en papel»:

```
+----------------------------------------------------------+
| Modo: CDP escaneado — el documento físico firmado es la   |
|       fuente de verdad; SGM registra metadatos + archivo  |
+----------------------------------------------------------+
| Nº correlativo CDP *    [ CDP-2026-00891 ]                |
| Monto certificado *     [ $ ____________ ]                |
| Fecha del documento *   [ __ / __ / ____ ]                |
| Adjunto CDP firmado *   [ Seleccionar PDF o imagen... ]   |
|                         (firmas manuscritas visibles)     |
+----------------------------------------------------------+
| Panel: Revalidación de saldo                              |
| Saldo proyectado:  $ 450.000  [OK]                        |
+----------------------------------------------------------+
| [ Cancelar ]         [ Registrar CDP escaneado ]        |
+----------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Línea presupuestaria | `BudgetAvailabilityCertificate.budget_line_id` | No (solo lectura, heredada de 1.3) |
| Monto certificado | `BudgetAvailabilityCertificate.certified_amount` | Sí |
| Año fiscal | `BudgetAvailabilityCertificate.fiscal_year` | Sí |
| Nº correlativo CDP | `BudgetAvailabilityCertificate.certificate_number` | Sí (modo escaneado) |
| Fecha del documento | `BudgetAvailabilityCertificate.signed_at` | Sí (modo escaneado) |
| Adjunto CDP firmado | `BudgetAvailabilityCertificate.scanned_certificate_attachment` | Sí si modo escaneado |
| Firmante | `BudgetAvailabilityCertificate.signed_by` | Sí (generado al firmar) |
| Modo de firma | `BudgetAvailabilityCertificate.signature_mode` | Sí |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Emitir y firmar CDP | `issueBudgetAvailabilityCertificate` (`signature_mode = electronic`) | `checkBudgetAvailability` → `requestSignature` → `confirmSignature` |
| Registrar CDP escaneado | `registerScannedBudgetAvailabilityCertificate` | `checkBudgetAvailability` |

## Estados de pantalla

- **Segregación roles:** si firmante = verificador → `SEGREGATION_OF_DUTIES_VIOLATION` (QA 9 P1).
- **Firma pendiente:** estado `pending_signature`; reintento FirmaGob u oferta de camino escaneado.
- **CDP escaneado inválido:** adjunto sin firmas legibles o metadatos inconsistentes → `SCANNED_CDP_INVALID`.
- **Éxito:** CDP `issued`; evento `BudgetAvailabilityCertificateIssued`; avance a 1.6. La fila del expediente muestra el modo en línea secundaria (`Firma electrónica` / `CDP escaneado`).

## Validaciones visibles

- Asterisco en monto certificado y año fiscal (ambos modos).
- Modo escaneado: asterisco en correlativo, fecha y adjunto.
- Segregación verificador ≠ firmante (`SEGREGATION_OF_DUTIES_VIOLATION`).

## Notas

- Folio del expediente siempre visible en encabezado (patrón expediente).
- El camino escaneado no exime la revalidación en Presupuestos; solo sustituye FirmaGob.
