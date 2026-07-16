# Wireframe: Garantía de Fiel Cumplimiento

**Sub-paso:** 3.12 — Garantía de Fiel Cumplimiento *(Licitación Pública, condicional)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md); custodia en Tesorería
**Operación:** `registerGuaranteeCustody` *(reutiliza 3.7)* · Dependencia: Tesorería (asíncrona)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Garantía de Fiel Cumplimiento     [Condicional]  |
+----------------------------------------------------------------+
| Adjudicatario: Taller Municipal SpA · Monto adjudicado: $178.500.000|
| Bases exigen Garantía de Fiel Cumplimiento: Sí · Mínimo $9.025.000|
+----------------------------------------------------------------+
| Tipo de instrumento *          [ Póliza de seguro          ▾ ]   |
| Monto *                        [ $ 9.250.000                ]   |
| Fecha de vencimiento *         [ __/__/____ ]  (cubre contrato + margen)|
| Documento del instrumento *    [ subir archivo ]                 |
+----------------------------------------------------------------+
| [ Registrar en custodia de Tesorería ]                           |
+----------------------------------------------------------------+
| (banner: en custodia — habilita 3.13; sin ella, tratamiento como |
|  no suscripción de contrato)                                     |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Proveedor | `Guarantee.provider_rut` | Sí |
| Tipo de garantía | `Guarantee.guarantee_type` | No (fijo: `performance_bond`) |
| Tipo de instrumento | `Guarantee.instrument_type` | Sí |
| Monto | `Guarantee.amount` | Sí |
| Fecha de vencimiento | `Guarantee.expiry_date` | Sí |
| Documento | `Guarantee.document_ref` | Sí |
| Estado | `Guarantee.status` | No (generado: `in_custody`) |

## Acciones

| Botón / control | Operación contrato | Dependencia |
|---|---|---|
| Registrar en custodia de Tesorería | `registerGuaranteeCustody` | Tesorería (asíncrona) |

## Estados de pantalla

- **No aplica (bajo umbral y bases no la exigen):** sub-paso se omite; la OC (3.14) puede formalizar el contrato directamente.
- **En custodia (camino feliz):** evento `GuaranteeRegistered`; habilita 3.13.
- **No entregada en plazo:** ver 3.13 — tratamiento como no suscripción de contrato (ejecución de la Garantía de Seriedad, readjudicación).

## Validaciones visibles

- Vigencia debe cubrir el contrato más el margen que fijen las bases; timer sobre `expiry_date` para renovaciones en contratos largos.

## Notas

- El adjudicatario entrega esta garantía **antes de** la suscripción del contrato / emisión de OC, según las bases.
- Reutiliza la misma entidad `Guarantee` y el mismo borde a Tesorería de 3.7, distinguidos por `guarantee_type = performance_bond`.
