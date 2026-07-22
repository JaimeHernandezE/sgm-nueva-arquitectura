# Wireframe: Cierre y selección de oferta

**Sub-paso:** 3.2 — Cierre y selección de oferta *(Compra Ágil)*  
**Rol:** Gestor de compra (`adq.gestor_compra`) — catálogo [`catalogo-roles.md`](../../../arquitectura/especificacion/catalogo-roles.md)  
**Operación:** — *(sin POST de usuario; sync `readMpProcess` → `QuotationClosed`)* · Dependencia: `readMpProcess` (deseada)

## Layout

```
+----------------------------------------------------------------+
| SOLPED #1234 — Cierre y selección de oferta   [Pendiente en MP] |
+----------------------------------------------------------------+
| ## Contexto del período                                          |
| Cerrado: 30-06-2026 · 4 cotizaciones recibidas (demo sync)      |
+----------------------------------------------------------------+
| ## Acción en Mercado Público                                     |
| [ Gestionar en MP ]  (deep link — selecciona la oferta en MP)    |
+----------------------------------------------------------------+
| ## Estado de sincronización                                      |
| Esperando lectura MP de cierre + oferta seleccionada.           |
| Sin campos editables — los datos llegan solo por sync.          |
+----------------------------------------------------------------+
| ## Oferta seleccionada — solo lectura                            |
| Proveedor: Comercial Sur SpA · RUT 76.123.456-7                 |
| Monto ofertado: $ 1.240.000 · Menor precio: Sí                  |
| Badge: Sincronizado → Continuar a 3.3 (automático)              |
+----------------------------------------------------------------+
```

## Campos ↔ entidad

| Campo UI | Entidad.campo | Obligatorio |
|---|---|---|
| RUT / nombre / monto / menor precio | `QuotationResult.*` | Solo lectura tras sync (creados por lectura MP) |

## Acciones

| Botón | Operación contrato | Dependencia |
|---|---|---|
| Gestionar en MP | — (deep link, navegación pura) | Mercado Público |

## Estados de pantalla

- **Pendiente:** badge `Pendiente en MP` + deep link; sin formulario.
- **Sincronizado:** badge + detalle solo lectura (si el volumen lo amerita); el `CaseStep` avanzó con `QuotationClosed`.
- **Justificación menor precio:** vive en MP; si la lectura la trae, se muestra en detalle RO.

## Validaciones visibles

- Ninguna de captura en SGM.

## Notas

- Legalmente no existe aprobación interna obligatoria en Compra Ágil — es informativo (salvo **[PENDIENTE P-39]**).
- Modo degradado (lectura deseada): el expediente permanece pendiente hasta la lectura; no hay transcripción (plantilla §5.3).
- **[PENDIENTE P-33]** Timer de escalamiento si el usuario no gestiona la selección en MP a tiempo.
