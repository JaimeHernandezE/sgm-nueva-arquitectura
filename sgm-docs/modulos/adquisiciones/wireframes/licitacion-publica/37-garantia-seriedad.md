# Wireframe: Recepción y custodia de Garantía de Seriedad de la Oferta

**Sub-paso:** 3.7 — Garantía de Seriedad de la Oferta *(Licitación Pública, condicional)*
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../../arquitectura/catalogo-roles.md); custodia en Tesorería
**Operación:** `registerGuaranteeCustody` · Dependencia: Tesorería (asíncrona)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Garantía de Seriedad de la Oferta [Condicional]  |
+----------------------------------------------------------------+
| ## Datos de la garantía                                          |
| Bases exigen Garantía de Seriedad: Sí · Monto mínimo $1.850.000  |
| Proveedor / oferente *        [ Taller Municipal SpA         ▾ ]    |
| Tipo de instrumento *          [ Boleta de garantía        ▾ ]   |
| Monto *                        [ $ 1.850.000               ]    |
| Fecha de vencimiento *         [ __/__/____ ]                    |
| Documento del instrumento *    [ subir archivo ]                 |
| [ Registrar en custodia de Tesorería ]                           |
+----------------------------------------------------------------+
| ## Garantías registradas                                         |
| ------------------------------------------------------------    |
| Proveedor          | Monto      | Vence      | Estado            |
| Taller Municipal SpA   | $1.850.000 | 15-05-2026 | En custodia       |
| Mecánica Diesel Ñuble Ltda. | $1.850.000 | 15-05-2026 | En custodia       |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| Proveedor | `Guarantee.provider_rut` | Sí |
| Tipo de garantía | `Guarantee.guarantee_type` | No (fijo: `bid_bond`) |
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

- **No aplica (bajo umbral y bases no la exigen):** sub-paso se omite.
- **En custodia (camino feliz):** evento `GuaranteeRegistered`; garantía verificada contra vigencia y monto de las bases.
- **Garantía vencida o insuficiente:** la oferta correspondiente queda inadmisible — insumo directo de 3.9 (`OfferRecord.admissibility_status = inadmissible`, causal registrada).
- **Devolución a no adjudicados:** tras la adjudicación (3.10), tarea con timer para devolver las garantías de los oferentes no adjudicados — plata de terceros retenida sin razón es hallazgo de auditoría.

## Validaciones visibles

- Monto y vigencia del instrumento verificados contra lo exigido en las bases (3.1).

## Notas

- `Guarantee` es transversal — la misma entidad, distinguida por `guarantee_type`, sirve también para 3.12 (Garantía de Fiel Cumplimiento).
- La custodia física es de Tesorería: borde de módulo explícito.
- Obligatoria sobre el umbral `NormativeParameter`; facultativa bajo él — carga verificada **[PENDIENTE P-37]**.
