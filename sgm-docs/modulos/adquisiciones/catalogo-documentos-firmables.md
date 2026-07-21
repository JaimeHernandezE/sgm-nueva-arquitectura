# Catálogo de documentos firmables — Adquisiciones

Vista de módulo del catálogo transversal. La fuente de `code`, estructura de puntos de firma y convenciones es:

[`arquitectura/especificacion/catalogo-documentos-firmables.md`](../../arquitectura/especificacion/catalogo-documentos-firmables.md)

**Estándar:** [`estandar-firma-electronica.md`](../../arquitectura/especificacion/estandar-firma-electronica.md)  
**Patrón UI (configuración de anclas):** [`patron-edicion-anclas-firma.md`](../../arquitectura/instrucciones/patron-edicion-anclas-firma.md)  
**Roles:** [`catalogo-roles.md`](../../arquitectura/especificacion/catalogo-roles.md)

---

## Documentos firmables del módulo

| Etapa | Sub-paso | Documento | `code` | Rol firmante | Ancla sugerida | Modo |
|---|---|---|---|---|---|---|
| 1 SOLPED | 1.2 | V°B° / aprobación de SOLPED | `adq.solped_vb` | `adq.aprobador_unidad` | `{{firma:adq.aprobador_unidad}}` | Desatendida |
| 1 SOLPED | 1.5 | CDP | `adq.cdp` | `adq.firmante_cdp` | `{{firma:adq.firmante_cdp}}` | Desatendida |
| 2 Modalidad | 2.2 | Aprobación de modalidad | `adq.modalidad_aprobacion` | `adq.aprobador_modalidad` | `{{firma:adq.aprobador_modalidad}}` | Desatendida — **[P-38]** |
| 3 LP | 3.3 | Decreto/resolución aprueba bases | `adq.acto_bases` | `adq.aprobador_modalidad` | `{{firma:adq.aprobador_modalidad}}` | Desatendida |
| 3 LP | 3.9 (a) | Acto designación comisión | `adq.acto_comision` | `adq.aprobador_modalidad` | `{{firma:adq.aprobador_modalidad}}` | Desatendida |
| 3 LP | 3.9 (c) | Acta de evaluación | `adq.acta_evaluacion` | Comisión (v1 vía gestor/aprobador) | Por firmante | Atendida |
| 3 LP | 3.10 | Resolución adjudicación / deserción / revocación | `adq.acto_adjudicacion` | `adq.aprobador_modalidad` | `{{firma:adq.aprobador_modalidad}}` | Desatendida |
| 3 LP | 3.13 | Contrato | `adq.contrato` | Municipio: `adq.aprobador_modalidad`; proveedor pendiente | `{{firma:adq.aprobador_modalidad}}` | Atendida |
| 4 Recepción | 4.2 | Confirmación recepción conforme | `adq.recepcion_confirmacion` | `adq.confirmante_recepcion` | `{{firma:adq.confirmante_recepcion}}` | Desatendida (condicional) |
| 5 Pago | 5.3 | Decreto de pago | `adq.decreto_pago` | `adq.operador_pago` | `{{firma:adq.operador_pago}}` | Desatendida |

### No firmables en SGM (v1)

- **Orden de compra (OC)** — Mercado Público.
- **Resolución Fundada (TD)** — adjunto; sin circuito FirmaGob en SGM.

---

## Configuración de firmas (UI)

En el hub del módulo → **Configuraciones → Firmas**: listado de los documentos anteriores; cada uno abre el editor de anclas de su plantilla. Prototipo de muestra: CDP (`adq.cdp`).

Wireframes: [`wireframes/90-configuraciones.md`](./wireframes/90-configuraciones.md), [`91-config-firmas-lista.md`](./wireframes/91-config-firmas-lista.md), [`92-config-firmas-editor-anclas.md`](./wireframes/92-config-firmas-editor-anclas.md).
